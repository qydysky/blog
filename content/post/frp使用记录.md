---
title: frp使用记录
summary: 直接在云上搭建服务器的成本太高，不如使用反向代理。
date: 2022-02-23T21:04:00+08:00
tags:
 - frp
toc: true
slug: frp
---
## frp使用记录
### 基础概念
[frp](https://github.com/fatedier/frp/)是一个开源的反向代理程序，由golang编写，能够跨平台使用，是一款简单、高效的内网穿透工具。此文将记录frp的其中一种使用方法，更多的使用方法见[项目地址](https://github.com/fatedier/frp/)。

### 获取frp
先到[官方发布地址](https://github.com/fatedier/frp/releases)下载编译后版本，我下载了`linux_amd64`及`windows`版，考虑到具备公网ip的云服务成本越小越好，因此选择了可以在较小资源就可以运行的`debain`。而客户端则使用`windows`版。

### 多用户插件
frp默认只支持一个用户，如果需要配置多用户不同密钥，则需要[多用户插件](https://github.com/gofrp/fp-multiuser)，这个插件是官方的，可以放心使用。配置方式会在下面一起介绍。

### 配置服务器
#### 文件介绍
在服务器需要5个文件，在下面列出：

1. `fp-multiuser`：多用户插件

2. `frps`：frps

3. `frps.ini`：frps的配置文件
```
# 通用设置
[common]
# 服务器通信端口，可随意设置
bind_port = 80
# 服务器密钥，客户端需要相同
token = {任意字符}

# 多用户插件
[plugin.multiuser]
# 多用户插件，验证地址
addr = 127.0.0.1:7200
# 多用户插件默认值
path = /handler
# 多用户插件默认值
ops = Login
```

4. `tokens`：多用户配置
```
user1=password1
```

5. `frps.service`：linux服务配置
```
[Unit]
Description=Frp Server Service
After=network.target

[Service]
Type=simple
Group=Root
User=Root
Restart=on-failure
RestartSec=5s
ExecStart=~/frps -c ~/frps.ini
LimitNOFILE=1048576

[Install]
WantedBy=multi-user.target
```

注：

1. `frps.service`中的`ExecStart`或许需要修改路径

2. 如果需要使用1024以内端口，需要使用`Root`用户或`iptable`转发端口，此处为了方便使用`Root`

#### 安装服务
运行如下命令安装`frps.service`服务：

```bash
install -m 644 {frps.service文件路径} /etc/systemd/system/frps.service
systemctl daemon-reload
```

然后即可使用下述命令进行管理：

停止服务`systemctl stop frps`

启动服务`systemctl start frps`

重启服务`systemctl restart frps`

服务状态`systemctl status frps`

同理，修改`frps.service`，为多用户插件也做一个服务:

`frpsmul.service`
```
[Unit]
Description=Frp Server Service
After=network.target

[Service]
Type=simple
Group=Root
User=Root
Restart=on-failure
RestartSec=5s
ExecStart=./fp-multiuser -l 127.0.0.1:7200 -f ./tokens
LimitNOFILE=1048576

[Install]
WantedBy=multi-user.target
```

注：`frpsmul.service`中的`ExecStart`或许需要修改路径

#### 启动服务
使用如下命令启动服务：

```
systemctl start frps
systemctl start frpsmul
```

查看服务状态：

```
systemctl status frps -l
systemctl status frpsmul -l
```

至此服务器配置完成。

#### 服务自启动(可选)
在`/etc/init.d`下创建启动脚本`frp.sh`

```sh
@echo off
systemctl start frps
systemctl start frpsmul
```

授权可执行`chmod +x frp.sh`

然后创建软链接`ln -s /etc/init.d/frp.sh /etc/rc3.d/S99frp`

至此配置完成。

### 配置客户端
#### 服务所在客户端配置
在服务所在客户端需要2个文件，在下面列出：

1. `frpc`：客户端
2. `frpc.ini`：客户端配置
```
[common]
server_addr = {服务器ip/域名}
server_port = {服务器端口}
token = {服务器对应密钥}
user = {多用户配置中的用户名}
meta_token = {多用户配置中的密码}

# gitea：服务名
[gitea]
# stcp：tcp，一般http用tcp较多 或 sudp：udp，一般游戏用udp较多
type = stcp
sk = {服务密钥}
local_ip = {服务所在ip}
local_port = {服务所在端口}
use_encryption = true
use_compression = true
```

直接运行`frpc`即可启动。

#### 客户所在客户端配置
在服务所在客户端需要2个文件，在下面列出：

1. `frpc`：客户端
2. `frpc.ini`：客户端配置
```
[common]
server_addr = {服务器ip/域名}
server_port = {服务器端口}
token = {服务器对应密钥}
user = {多用户配置中的用户名}
meta_token = {多用户配置中的密码}

# gitea_v：随意设置
[gitea_v]
type = {需要与服务所在客户端配置相同}
role = visitor
sk = {需要与服务所在客户端配置相同}
server_name = {服务所在客户端配置中的 服务名}
# 127.0.0.1：限定本机 0.0.0.0：同子网
bind_addr = 127.0.0.1
bind_port = {访问此端口即可访问 服务所在客户端配置中的 服务所在端口}
use_encryption = true
use_compression = true
```

直接运行`frpc`即可启动。

至此，访问`127.0.0.1:bind_port`即可访问`local_ip:local_port`

### 应用示例
#### 普通http网站
对于类似如`gitea`，`gitlab`等本地代码托管平台，与一些其他可本地部署的http服务均可使用frp进行反向代理。但国内云服务商通常禁止未备案的http服务，因此此示例应当使用加密等tcp流进行反代，而非反代为公开服务。

#### MC远程局域网联机
在单人游戏中点击`esc`可选择`对局域网开放`，然后即可看到`本地游戏已在端口xxxx开放`，通过上述配置，即可将主机端口反向代理到其他客户端的指定端口，然后即可在其他客户端选择多人游戏，添加服务器，填写监听地址及端口后即可加入畅玩。

#### 起源引擎游戏
使用如下bat启动游戏服务

```bat
@echo off
start srcds.exe -ip 0.0.0.0
```

添加反向代理客户端配置，注意远程与本地服务端口需一致。使用端口查看器，将游戏服务使用的端口全反代。

```
[range:sourceudp]
type = udp
local_ip = {局域网ip}
local_port = {游戏端口},{Stream端口}
remote_port = {游戏端口},{Stream端口}

[range:sourcetcp]
type = tcp
local_ip = {局域网ip}
local_port = {游戏端口},{Stream端口}
remote_port = {游戏端口},{Stream端口}
```

在游戏中连接代理服务器ip。

在l4d2时，在房间使用命令可以指定连接服务器，开始游戏后即可使用反代游戏服务。

```
mm_dedicated_force_servers {反代服务器ip}:{27016}
```