---
title: 双openwrt通过wireguard互联
summary: 本文记录了双openwrt通过wireguard互联子网的备忘
tags:
  - openwrt
  - wireguard
toc: true
date: 2025-05-18T20:00:00+08:00
slug: openwrtwireguard
---
### 简介
本文记录了两个openwrt通过wireguard互联的步骤

本文基于OpenWrt 23.05.5

### 准备
- 将软件包源配置为镜像源，以便快速下载软件包
- 两路由都安装`ddns-go`，`luci-app-ddns-go`,`luci-i18n-ddns-go-zh-cn`，仓库地址[https://github.com/sirpdboy/luci-app-ddns-go](https://github.com/sirpdboy/luci-app-ddns-go)，以便使用ddns
- 两路由都安装`luci-i18n-base-zh-cn`，以便中文操作
- 两路由都安装`luci-proto-wireguard`，安装后重启

### 配置
为双路由的公网ipv6配置ddns,此处不再描述，此处假设已为两路由配置了`gw1`,`gw2`两个域名

打开`网络`，`接口`。添加新接口，名称`wg`，协议选择`WireGuard VPN`，点击创建接口。

点击生成新的密钥对，得到公钥，此处假设两个路由公钥分别为`pk1`, `pk2`

监听端口填写默认端口`51820`

ip地址填写一个新网段地址，此处假设两个路由分别为`192.168.33.1`，`192.168.33.2`

防火墙选择`lan`

在`对端`页，添加对端。

描述填写`rt`，公钥填写对方公钥，例如`pk2`，`pk1`

允许的ip填写wireguard网段及对方lan网段
例如`192.168.33.0/24`，`192.168.31.0/24`
例如`192.168.33.0/24`，`192.168.32.0/24`

勾选`路由允许的ip`

填写端点主机为对方路由域名，例如`gw2`,`gw1`

端点端口填写`51820`

持续keep-alive，填写25

点击保存。保存并应用。然后重启接口

打开防火墙，添加通信规则。

名称`wg`

源区域选择`wan`

目标区域选择`设备(输入)`

目标端口填写`51820`

操作`接受`

此时双方的`lan`网段就可以互访了