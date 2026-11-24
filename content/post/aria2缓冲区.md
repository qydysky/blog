---
title: aria2缓冲区
summary: Aria2是一款优秀的C++开源下载器，但它已经好久没有更新，本文记录解决其接收缓冲区过大导致下载开始时出现限速失效的过程。
tags:
  - aria2
toc: true
date: 2021-04-06 00:00:00
slug: aria2
---
### 简介
[Aria2](https://aria2.github.io/)是一款优秀的C++开源下载器，但它已经好久没有更新，本文记录解决其接收缓冲区过大导致下载开始时出现限速失效的过程。

### 问题提出
在[issue1](https://github.com/aria2/aria2/issues/1755)中提出，当`socket-recv-buffer-size`较大而`max-overall-download-limit`较小时，下载开始时缓冲区还未填满，此时会出现满速下载情况，而后虽然aria2从缓冲区读取的速率会降低到指定速率，但是内容全部已经下载到缓冲区，实际并没实现限速。表现为先满速下载而后完成速度归零。

其中关于`socket-recv-buffer-size`，若没使用aria2进行设置，使用系统默认设置时，有如下规律：

在Linux上运行`sysctl -a | grep tcp_rmem`查看接收缓冲区大小。三个值分别为最小值，默认值，最大值。

更多关于缓冲区的内容可见[记一次典型的TCP传输吞吐效率问题](https://blog.csdn.net/weixin_44774358/article/details/89881605)。

根据他提供的系统`tcp_rmem`有`net.ipv4.tcp_rmem = 536870912 536870912 536870912`。由此可见，这将会给每个连接配极大的缓冲区，导致上述情况发生。

他在aria2设置了较小的`socket-recv-buffer-size`后，情况有了一定的好转。

根据[issue2](https://github.com/aria2/aria2/issues/487)，aria2的`socket-recv-buffer-size`是用来解决当udp流过大时缓冲区溢出导致的数据丢弃的问题。当时的可能由于系统默认缓冲区过小，才会导致丢弃。在issue2中通过设置一个足够大的系统缓冲区`net.core.rmem_default = 2097152 `，从而避免溢出。

### 解决方案
1. 调整系统接收区缓冲大小，调整`tcp_rmem`三个值的大小，使得系统能进行动态分配。
2. 设置aria2的`socket-recv-buffer-size`避免超速。

关于方案1。linux可在`/etc/sysctl.conf`中添加`net.ipv4.tcp_rmem = <MIN> <DEFAULT> <MAX>`，然后`sysctl -p`刷新。windows上的设置及更多详情见[TCP传输慢问题分析](https://zhuanlan.zhihu.com/p/80043707)。

关于方案2。要实现动态设置有难度。可以将简单的将其设置为一个较为小的值如`1m`。

### 源码解析
#### 更改`socket-recv-buffer-size`默认值
更改`socket-recv-buffer-size`默认值的方法很简单。在`src/OptionHandlerFactory.cc`有，此处设置为`2M`。

```c++
...
{
  OptionHandler* op(
    new UnitNumberOptionHandler(PREF_SOCKET_RECV_BUFFER_SIZE,
                                TEXT_SOCKET_RECV_BUFFER_SIZE,
                                "2m", 0, 16_m));
  op->addTag(TAG_ADVANCED);
  handlers.push_back(op);
}
...
```

#### `socket-recv-buffer-size`的设置时机
此处记录一下对`socket-recv-buffer-size`的设置时机，以便以后升级方案。有以下多种情况：

一是程序启动时，`socket-recv-buffer-size`进行初始化，初始化代码位于`SocketCore.cc`中：

```c++
void SocketCore::setSocketRecvBufferSize(int size)
{
  socketRecvBufferSize_ = size;
}
```

这段代码在`Context.cc`中被调用：

```c++
SocketCore::setSocketRecvBufferSize(op->getAsInt(PREF_SOCKET_RECV_BUFFER_SIZE));
```

二是用户通过RPC进行全局参数设置时。在`RpcMethodImpl.cc`中，`e->getOption()`的返回可以设置。

```c++
std::unique_ptr<ValueBase>
ChangeGlobalOptionRpcMethod::process(const RpcRequest& req, DownloadEngine* e)
{
  const Dict* optsParam = checkRequiredParam<Dict>(req, 0);

  Option option;
  gatherChangeableGlobalOption(&option, optsParam);
  changeGlobalOption(option, e);
  return createOKResponse();
}
```

三是用户通过RPC进行单一任务的设置时。在`RpcMethodImpl.cc`中，`group->getOption()`的返回可以设置。

```c++
std::unique_ptr<ValueBase> ChangeOptionRpcMethod::process(const RpcRequest& req,
                                                          DownloadEngine* e)
{
  const String* gidParam = checkRequiredParam<String>(req, 0);
  const Dict* optsParam = checkRequiredParam<Dict>(req, 1);

  a2_gid_t gid = str2Gid(gidParam);
  auto group = e->getRequestGroupMan()->findGroup(gid);
  if (group) {
    Option option;
    std::shared_ptr<Option> pendingOption;
    if (group->getState() == RequestGroup::STATE_ACTIVE) {
      pendingOption = std::make_shared<Option>();
      gatherChangeableOption(&option, pendingOption.get(), optsParam);
      if (!pendingOption->emptyLocal()) {
        group->setPendingOption(pendingOption);
        // pauseRequestGroup() may fail if group has been told to
        // stop/pause already.  In that case, we can still apply the
        // pending options on pause.
        if (pauseRequestGroup(group, false, false)) {
          group->setRestartRequested(true);
          e->setRefreshInterval(std::chrono::milliseconds(0));
        }
      }
    }
    else {
      gatherChangeableOptionForReserved(&option, optsParam);
    }
    changeOption(group, option, e);
  }
  else {
    throw DL_ABORT_EX(
        fmt("Cannot change option for GID#%s", GroupId::toHex(gid).c_str()));
  }
  return createOKResponse();
}
```

其中`changeOption`的修改方法是先从`group`取副本，将`option`中的设置项合并到副本，若`option`中有更改的项，则从副本中取出值设置到`group`或其他类中。

```c++
void changeOption(const std::shared_ptr<RequestGroup>& group,
                  const Option& option, DownloadEngine* e)
{
  const std::shared_ptr<DownloadContext>& dctx = group->getDownloadContext();
  const std::shared_ptr<Option>& grOption = group->getOption();
  grOption->merge(option);
...
  if (option.defined(PREF_MAX_DOWNLOAD_LIMIT)) {
    group->setMaxDownloadSpeedLimit(
        grOption->getAsInt(PREF_MAX_DOWNLOAD_LIMIT));
  }
  if (option.defined(PREF_MAX_UPLOAD_LIMIT)) {
    group->setMaxUploadSpeedLimit(grOption->getAsInt(PREF_MAX_UPLOAD_LIMIT));
  }
#ifdef ENABLE_BITTORRENT
  auto btObject = e->getBtRegistry()->get(group->getGID());
  if (btObject) {
    if (option.defined(PREF_BT_MAX_PEERS)) {
      btObject->btRuntime->setMaxPeers(grOption->getAsInt(PREF_BT_MAX_PEERS));
    }
  }
...
```

四是在添加url链接时。在`RpcMethodImpl.cc`中的`requestOption`下可以设置。

```c++
std::unique_ptr<ValueBase> AddUriRpcMethod::process(const RpcRequest& req,
                                                    DownloadEngine* e)
{
  const List* urisParam = checkRequiredParam<List>(req, 0);
  const Dict* optsParam = checkParam<Dict>(req, 1);
  const Integer* posParam = checkParam<Integer>(req, 2);

  std::vector<std::string> uris;
  extractUris(std::back_inserter(uris), urisParam);
  if (uris.empty()) {
    throw DL_ABORT_EX("URI is not provided.");
  }

  auto requestOption = std::make_shared<Option>(*e->getOption());
  gatherRequestOption(requestOption.get(), optsParam);

  bool posGiven = checkPosParam(posParam);
  size_t pos = posGiven ? posParam->i() : 0;

  std::vector<std::shared_ptr<RequestGroup>> result;
  createRequestGroupForUri(result, requestOption, uris,
                           /* ignoreForceSeq = */ true,
                           /* ignoreLocalPath = */ true);

  if (!result.empty()) {
    return addRequestGroup(result.front(), e, posGiven, pos);
  }
  else {
    throw DL_ABORT_EX("No URI to download.");
  }
}
```

五是添加BT种子时。在`RpcMethodImpl.cc`中的`requestOption`下可以设置。

```c++
std::unique_ptr<ValueBase> AddTorrentRpcMethod::process(const RpcRequest& req,
                                                        DownloadEngine* e)
{
  const String* torrentParam = checkRequiredParam<String>(req, 0);
  const List* urisParam = checkParam<List>(req, 1);
  const Dict* optsParam = checkParam<Dict>(req, 2);
  const Integer* posParam = checkParam<Integer>(req, 3);

  std::unique_ptr<String> tempTorrentParam;
  if (req.jsonRpc) {
    tempTorrentParam = String::g(
        base64::decode(torrentParam->s().begin(), torrentParam->s().end()));
    torrentParam = tempTorrentParam.get();
  }
  std::vector<std::string> uris;
  extractUris(std::back_inserter(uris), urisParam);

  auto requestOption = std::make_shared<Option>(*e->getOption());
  gatherRequestOption(requestOption.get(), optsParam);

  bool posGiven = checkPosParam(posParam);
  size_t pos = posGiven ? posParam->i() : 0;

  std::string filename;
  if (requestOption->getAsBool(PREF_RPC_SAVE_UPLOAD_METADATA)) {
    filename = util::applyDir(requestOption->get(PREF_DIR),
                              getHexSha1(torrentParam->s()) + ".torrent");
    // Save uploaded data in order to save this download in
    // --save-session file.
    if (util::saveAs(filename, torrentParam->s(), true)) {
      A2_LOG_INFO(
          fmt("Uploaded torrent data was saved as %s", filename.c_str()));
      requestOption->put(PREF_TORRENT_FILE, filename);
    }
    else {
      A2_LOG_INFO(fmt("Uploaded torrent data was not saved."
                      " Failed to write file %s",
                      filename.c_str()));
      filename.clear();
    }
  }
  std::vector<std::shared_ptr<RequestGroup>> result;
  createRequestGroupForBitTorrent(result, requestOption, uris, filename,
                                  torrentParam->s());

  if (!result.empty()) {
    return addRequestGroup(result.front(), e, posGiven, pos);
  }
  else {
    throw DL_ABORT_EX("No Torrent to download.");
  }
}
```

还有其他更多方法可以添加下载，或在未来补充。
