---
title: flv文件解析及golang的流实现
summary: 最近在使用bilibili直播姬的时候，想在局域网同时观看保存下来的直播流，本文记录实现的全过程。
tags:
  - flv
  - golang
toc: true
date: 2021-04-16 00:00:00
slug: flv-golang
---
注意，本文待查证！

### 简介 
最近在使用[bilibili直播姬](https://github.com/qydysky/bili_danmu)的时候，想在局域网同时观看保存下来的直播流，本文记录flv的文件格式，将保存下的flv文件作为直播流时的golang实现及踩的一些坑。

### flv文件结构
本节引用来自众多文章：

- [官方文档](https://www.adobe.com/content/dam/acom/en/devnet/flv/video_file_format_spec_v10_1.pdf)
- [flv结构分析](https://www.cnblogs.com/poissonnotes/p/7744283.html)
- [FLV文件格式官方规范详解](https://blog.csdn.net/chgaowei/article/details/51243345)
- [一张图看懂FLV文件格式 ](https://blog.ibaoger.com/2017/06/04/flv-file-format/)
- [H264(NAL简介与I帧判断)](https://www.cnblogs.com/cy568searchx/p/4415495.html)
- [FLV科普10 FLV视频头信息](https://blog.csdn.net/cabbage2008/article/details/50449664)
- [FLV文件(H264 + AAC)格式超详细分析](http://www.360doc.com/content/16/1013/17/474846_598171645.shtml)

flv文件结构简单，这里记录一下flv文件的基本结构，以便日后完善功能使用。

#### flv
flv头|flv内容
-|-
9 bytes|? bytes

#### flv头
签名|版本|媒体标识位|flv头长度
-|-|-|-
3 bytes|1 byte|1 byte|4 bytes

签名：固定使用`FLV`(0x46 0x4c 0x56)。

版本：当前版本号`1`(0x01)。

媒体标识位:

保留|音频标识|保留|视频标识
-|-|-|-
5 bits|1 bit|1 bit|1 bit

保留：必须是`0`。

音频/视频标示：有则为`1`。

flv头长度：必须为`9`(0x09)。

实例：

```
46 4C 56 01 05 00 00 00 09
```

#### flv内容
前一tag的长度|tag头|tag内容
-|-|-
4 bytes|11 bytes|? bytes

前一tag的长度：首tag为`0`(0x00 0x00 0x00 0x00)，其他的为上一个tag头+tag内容的长度。

tag头：

tag信息|tag内容长度|相对时间戳|扩展时间戳|流id
-|-|-|-|-
1 byte|3 bytes|3 bytes|1 byte|3 bytes

tag信息：

保留|加密标识|tag类型
-|-|-
2 bits|1 bit|5 bits

保留：必须是`0`。

加密标识：加密`1`、未加密`0`。

tag类型：Script脚本`1 0010`、视频`0 1001`、音频`0 1000`。

实例：

```
未加密的
    Script脚本`0x12`
    视频`0x09`
    音频`0x08`
```

tag内容长度：记录tag内容的长度。

相对时间戳：相对第一个tag的时间戳，单位毫秒。第一个Script脚本、视频、音频tag的时间戳为`0`(0x00 0x00 0x00)

扩展时间戳：当相对时间戳不够用时，可将此字节拼接到相对时间戳之前，以此进行扩展。

流id：固定为`0`(0x00 0x00 0x00)

实例：

```
12 00 02 AF 00 00 00 00 00 00 00
...
00 00 02 BA
```

#### tag内容
上述提到有3种tag。其中Script脚本是用来记录一些视频的基本信息，由于此处暂时没使用到，留待日后研究。

##### 视频tag
tag类型为视频时，tag内容还具有视频头。

视频：

帧类型|编码类型|视频数据
-|-|-
4 bits|4 bits|? bits

帧类型：有以下5种。

- 关键帧`1`(0x1)
- 中间帧`2`(0x2)
- 一次性中间帧`3`(0x3)
- 生成关键帧`4`(0x4)
- 视频信息帧`5`(0x5)

编码类型：有若干种详见官方文档，其中常用的有AVC H264`7`(0x7)。

视频数据：当编码类型为AVC时，其具有AVC头部，但此处暂未用到，日后补充。

实例：末尾的`17`

```
09 00 00 2D 00 00 00 00 00 00 00 17
```

##### 音频tag
tag类型为音频时，tag内容还具有音频头。

音频：

音频格式|采样率|位宽|通道|音频数据
-|-|-|-|-
4 bits|2 bits|1 bit|1 bit|? bits

音频格式：有若干种，详见官方文档，其中常用的有AAC`10`(0xa)。

采样率：有以下4种。

- 5.5kHz`0`(00)
- 11kHz`1`(01)
- 22kHz`2`(10)
- 44kHz`3`(11)

位宽：8bit：`0`(0)、16bit：`1`(1)。

通道：单声道：`0`(0)、双声道：`1`(1)。

音频数据：当音频格式为AAC时，有AAC头，此处暂未用到，日后补充。

实例：末尾的`AF`

```
08 00 00 04 00 00 00 00 00 00 00 AF
```

### golang转flv直播流
相关内容已更新，示例代码见[bili_danmu](https://github.com/qydysky/bili_danmu)

<details>
  <summary>历史内容</summary>

本节暂时仅针对bilibili直播流保存中再转直播流的情况，其他情况需要再做研究，如已下载完成的直播流转直播，会`Read`到许多`EOF`，暂时直接使用`http.FileServer`进行服务。

```go
http.FileServer(http.Dir(base_dir)).ServeHTTP(w,r)
```

本节转换后的flv直播流在播放时会有音画不同步的情况，详见[issues](https://github.com/bilibili/flv.js/pull/354)。后续会fork[flv.js](https://github.com/bilibili/flv.js)来尝试解决此问题。

根据对上述flv格式的了解，可以得出直播流的生成方法：获取最新的视频关键帧，并将它之前的音视频tag全部去除，直接拼接到第一个音/视频tag后即可。同时为了形成流，而不是变成直接下载，需要使用到[Flush](https://golang.org/pkg/net/http/#Flusher)。

#### flv处理
完整代码见[flvDecode.go](https://github.com/qydysky/bili_danmu/blob/0de0132ce1f09f73f78dbd94d90446e694855c28/Reply/flvDecode.go)，内含简单注释，下面进行解释。以下代码还处于开发中，可能有不合理处不要介意，仅介绍思路。

首先打开文件：

```go
//file
f,err := os.OpenFile(path,os.O_RDONLY,0644)
if err != nil {
    return err
}
defer f.Close()
```

复制flv头及首个`前一个tag大小`，其中`streamChan`为一个[golang channel](https://draveness.me/golang/docs/part3-runtime/ch06-concurrency/golang-channel/)，用于后续从中读取数据并发送到客户端。

```go
//get flv header(9byte) + FirstTagSize(4byte)
{
    buf := make([]byte, flv_header_size+previou_tag_size)
    if _,err := f.Read(buf);err != nil {return err}
    if bytes.Index(buf,flv_header_sign) != 0 {return errors.New(`no flv`)}
    streamChan <- buf
}
```

其中`flv_header_size=9`、`previou_tag_size=4`、`flv_header_sign=[]byte{0x46,0x4c,0x56}`是根据flv格式标准定义的值，分别表示flv头长度、前一tag长度、flv签名`FLV`。

接着获取Script脚本tag、第一个视频tag、第一个音频tag。

```go
for {
    t := getTag(f)
    if t.Tag == script_tag {
        streamChan <- *t.Buf
    } else if t.Tag == video_tag {
        if !first_video_tag {
            first_video_tag = true
            streamChan <- *t.Buf
        }

        if t.FirstByte & 0xf0 == 0x10 {
            if len(last_keyframe_video_offsets) > 2 {
                // last_timestamps = append(last_timestamps[1:], t.Timestamp)
                last_keyframe_video_offsets = append(last_keyframe_video_offsets[1:], t.Offset)
            } else {
                // last_timestamps = append(last_timestamps, t.Timestamp)
                last_keyframe_video_offsets = append(last_keyframe_video_offsets, t.Offset)
            }
        }
    } else if t.Tag == audio_tag {
        if !first_audio_tag {
            first_audio_tag = true
            streamChan <- *t.Buf
        }
    } else {//eof_tag 
        break;
    }
}
```

其中

`script_tag=0x12`、`video_tag=0x09`、`audio_tag=0x08`为三种tag的flv定义的字节串。

`first_video_tag`、`first_audio_tag`为局部bool变量，获取到第一个视频、音频tag后设为`true`。不再将后续视频，音频tag发送给客户。

`last_keyframe_video_offsets`为局部int64数组，用来储存最后几个关键帧的位置。int64是由[f.Seek](https://golang.org/pkg/os/#File.Seek)返回的位置是int64类型决定的。

`t.FirstByte & 0xf0 == 0x10`中`t.FirstByte`是视频头，通过位相与，为真时即为关键帧。

这里使用了`getTag`方法：

```go
type flv_tag struct {
    Tag byte
    Offset int64
    Timestamp int32
    PreSize int32
    FirstByte byte
    Buf *[]byte
}

//get tag func
var getTag = func(f *os.File)(t flv_tag){
    t.Offset,_ = f.Seek(0,1)//获取当前tag位置
    Buf := []byte{}
    t.Buf = &Buf//返回指针避免再次分配内存

    buf := make([]byte, tag_header_size)//读取tag头
    if size,err := f.Read(buf);err != nil || size == 0 {
        t.Tag = eof_tag//eof_tag为读取到结尾的标志，或许当前tag还没下载完成
        return
    }
    Buf = append(Buf, buf...)//将tag头储存到buf中，准备返回
    t.Tag = buf[0]//获取当前tag类型
    t.Timestamp = F.Btoi32([]byte{buf[7],buf[4],buf[5],buf[6]},0)//获取当前tag时间戳，Btoi32为4为字节转int32

    size := F.Btoi32(append([]byte{0x00},buf[1:4]...),0)//获取tag内容长度

    data := make([]byte, size)
    if size,err := f.Read(data);err != nil || size == 0 {
        t.Tag = eof_tag
        return
    }
    t.FirstByte = data[0]//获取当前内容的第一个字节，视频头/音频头

    pre_tag := make([]byte, previou_tag_size)//前一tag长度
    if size,err := f.Read(pre_tag);err != nil || size == 0 {
        t.Tag = eof_tag
        return
    } 
    t.PreSize = F.Btoi32(pre_tag,0)//前一tag长度
    
    Buf = append(Buf, append(data, pre_tag...)...)
    // if t.PreSize == 0{fmt.Println(t.Tag,size,data[size:])}

    return
}
```

将当前位置定位到最后几个关键帧

```go
//seed to the second last tag
if len(last_keyframe_video_offsets) == 0 {flvlog.L(`W: `,`no keyframe`);return errors.New(`no keyframe`)}
f.Seek(last_keyframe_video_offsets[0],0)
```

下面进行对tag逐个进行复制

```go
//copy
{
    last_available_offset := last_keyframe_video_offsets[0]//最后一个可用tag，万一发生错误，将回溯到此位置

    // last_Timestamp := last_timestamps[0]
    for {
        //退出
        select {
        case <-cancel:return nil;//客户退出了
        default:;
        }
        t := getTag(f)//逐个获取tag
        if t.Tag == eof_tag {//获取到了个残缺tag
            f.Seek(last_available_offset,0)
            time.Sleep(time.Second)
            continue
        } else if t.PreSize == 0 {//这是个无效的tag，或许读取发生了错误
            f.Seek(last_available_offset,0)
            f.Seek(seachtag(f),1)//seachtag返回可用tag位置
            continue
        } else if t.Tag == video_tag {
            // if t.FirstByte & 0xf0 == 0x10 {
            // 	video_keyframe_speed = t.Timestamp - last_video_keyframe_timestramp
            // 	fmt.Println(`video_keyframe_speed`,video_keyframe_speed)
            // 	last_video_keyframe_timestramp = t.Timestamp
            // }
            streamChan <- *t.Buf
        } else if t.Tag == audio_tag {
            streamChan <- *t.Buf
        } else if t.Tag != script_tag {//不复制Script脚本tag
            ;
        }
        
        last_available_offset = t.Offset//刷新最后可用tag

    }
}
```

#### http部分
完整代码见[Reply/F.go](https://github.com/qydysky/bili_danmu/blob/0de0132ce1f09f73f78dbd94d90446e694855c28/Reply/F.go#L950),其中的核心部分：

```go
flusher, flushSupport := w.(http.Flusher);
if flushSupport {flusher.Flush()}//先进行这步，否则将可能会变成直接下载

var (
    err error
)
for err == nil {
    if b := <- byteC;len(b) != 0 {
        _,err = w.Write(b)
    } else {
        break
    }
    if flushSupport {flusher.Flush()}
}
```
</details>