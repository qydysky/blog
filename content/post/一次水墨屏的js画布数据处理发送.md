---
title: 一次水墨屏的js画布数据处理发送
summary: 本文记录了一次水墨屏的js画布数据处理发送方法。
date: 2021-10-17T21:08:00+08:00
tags:
 - javascript
 - canvas
toc: true
slug: canvas2byte
---
## 一次水墨屏的js画布数据处理发送
### 获取画布数据
```js
c.getContext('2d').getImageData(0,0,w,h);
```

c是画布元素；

其中数据为4个0~255的整数为一像素，RGBA格式。例`[0,0,0,255 ,255,255,255,255 ...]`

关于`getContext('2d').getImageData(0,0,w,h)`的更多信息，查看[HTML5 canvas getImageData() 方法](https://www.w3school.com.cn/html5/canvas_getimagedata.asp)

### 将像素存入数组
```js
var a=new Array(w*h);
var i = 0;
for(var y=0;y<h;y++){
    for(var x=0;x<w;x++,i++) {
        if(epdInd==25 || epdInd==37)
            a[i]=getVal_7color(p,i<<2);
        else                            //  <- 4.2b v2 时 epdInd=34
            a[i]=getVal(p,i<<2);        //  i<<2 时 0,4,8,12,16...
    }
}
```

```js
function getVal(p, i){
    if((p.data[i]==0x00) && (p.data[i+1]==0x00))return 0;   // 00 指 黑
    if((p.data[i]==0xFF) && (p.data[i+1]==0xFF))return 1;   // FF 指 白
    if((p.data[i]==0x7F) && (p.data[i+1]==0x7F))return 2;   // 7F 指 中间灰度
    return 3;                                               // 其他
}
```

处理后数据变为，例`[0,1,2,3,2....]`


### 准备发送
```js
var init='http://'+adpip+'/EPD';
xhReq.open('POST',init, true);
xhReq.send(byteToStr(epdInd));
```

向 `'http://'+输入的ip+'/EPD'` 发送类型值`epdInd`的编码值

```js
function byteToStr(v){return String.fromCharCode((v & 0xF) + 97, ((v >> 4) & 0xF) + 97);}
```

将 Unicode 编码转换为一个字符串，此处输入两参数，输出两字符。

关于`String.fromCharCode`的更多信息，查看[String.fromCharCode()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode)

当`4.2b v2`时`epdInd=34(10进制)=100010(2进制)`

```
(34 & 0xF) + 97         //  低4位 +97开始是因为Unicode 97 为 a
((v >> 4) & 0xF) + 97   //  高4位

34 变为 cc
```

向 `'http://'+输入的ip+'/EPD'` 发送类型值`cc`


### 发送数据
```js
xhReq.onload=xhReq.onerror=function(){
    ldPrv();        //   当上述请求响应不正确时，重新加载上次的发送阶段和发送
    if(stInd==0&&epdInd==23)return u_dataA(a,0,0,100);
    if(stInd==0)return u_dataA(a,(epdInd==1)||(epdInd==12)?-1:0,0,50);  // <- 4.2b v2 epdInd = 34 第一次
    if(stInd==1)return u_next();                                        //  发送
    if(stInd==2)return u_dataA(a,3,50,50);                              //  第二次
    if(stInd==3)return u_done();                                        //  发送
};
```

分段发送。其中`(epdInd==1)||(epdInd==12)?-1:0`和`3`为下述中的`c`变量，`a`为[将像素存入数组](#将像素存入数组)中所得到的像素数组。

`stInd`：发送阶段。起始时为0

`pxInd`：当前发送的数据索引(index)。起始时为0

```js
u_dataA:

// 每8个像素转为8位2进制，8位2进制转字符
while((pxInd<a.length)&&(rqMsg.length<1500)){
    var v=0;    //  8位

    for (var i=0;i<8;i++)
    {
        if((pxInd<a.length)&&(a[pxInd]!=c))v|=(128>>i); //  不为c(当前c=0)的则将该位设为1
        pxInd++;
    }

    rqMsg += byteToStr(v);                              //  将上述的8位转字符
}
```

第一次发送非黑的数据。

处理即将发送的数据，本次最多发送1500字符。

```js
function u_next(){
    lnInd=0;
    pxInd=0;            //  重置了像素索引
    u_send('NEXT',true);
}
function u_send(cmd,next){
    xhReq.open('POST',rqPrf+cmd, true); //  发送`字符数据+NEXT`
    xhReq.send();
    if(next)stInd++;                    //  下一阶段
    return 0; 
}
```

接着发送第二次，与第一次不同，c=3即非其他时置1。灰度数据。

```js
xhReq.onload=xhReq.onerror=function(){
    ldPrv();        //   当上述请求响应不正确时，重新加载上次的发送阶段和发送
    if(stInd==0&&epdInd==23)return u_dataA(a,0,0,100);
    if(stInd==0)return u_dataA(a,(epdInd==1)||(epdInd==12)?-1:0,0,50);  // <- 4.2b v2 epdInd = 34 第一次
    if(stInd==1)return u_next();                                        //  发送
    if(stInd==2)return u_dataA(a,3,50,50);                              //  第二次
    if(stInd==3)return u_done();                                        //  发送
};
```

### 展示
```js
function u_done(){
    setInn('logTag','Complete!');
    return u_send('SHOW',true);     //  发送`字符数据+SHOW`
}
```

或是截取每次最后4个字符进行识别，为`NEXT`时，等待第二次发送的灰度数据，为`SHOW`时，展示数据。