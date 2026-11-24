---
title: openwrt阻断域名
summary: 本文记录了如何配置openwrt阻断域名
tags:
  - openwrt
toc: true
date: 2024-12-16T00:00:00+08:00
slug: openwrt
---
### 方法
#### 安装`dnsmasq-full`
进入系统->软件包

安装`dnsmasq-full`，勾选`允许覆盖冲突的包文件`

进入系统->启动项，重启`dnsmasq`

#### 查看dns ttl
进入网络->DHCP/DNS->限制

`最大缓存 TTL`的值，下文使用`{ttl}`代指，默认应为`3600`

#### 配置防火墙ip集
进入网络->防火墙->ip集

##### 配置ipv6
点击添加

名称任意(不能与已有规则重复)，下文使用`{ipset}6`代指，例如`yuanshen6`

数据包字段匹配选择`dest_ip`

族选择`ipv6`

超时填写`{ttl}`，例如`3600`

点击保存

##### 配置ipv4
点击添加

名称任意(不能与已有规则重复)，下文使用`{ipset}4`代指，例如`yuanshen4`

数据包字段匹配选择`dest_ip`

族选择`ipv4`

超时填写`{ttl}`，例如`3600`

点击保存

#### 配置防火墙通信规则
进入网络->防火墙->通信规则

##### 配置ipv6
点击添加

名称任意(不能与已有规则重复)

源区域选择

- `设备(输出)` 当你的局域网设备正在使用路由器上的代理进行通信时
- `lan` 当你的局域网在`lan`区域时

目标区域选择`wan`

操作选择

- `拒绝` 会响应拒绝信息
- `丢弃` 会直接丢弃包

点击`高级设置`页

地址族限制选择`仅ipv6`

使用ip集选择`{ipset}6`，例如`yuanshen6`

##### 配置ipv4
点击添加

名称任意(不能与已有规则重复)

源区域选择

- `设备(输出)` 当你的局域网设备正在使用路由器上的代理进行通信时
- `lan` 当你的局域网在`lan`区域时

目标区域选择`wan`

操作选择

- `拒绝` 会响应拒绝信息
- `丢弃` 会直接丢弃包

点击`高级设置`页

地址族限制选择`仅ipv4`

使用ip集选择`{ipset}4`，例如`yuanshen4`

#### 配置dns
进入网络->DHCP/DNS->ip集

点击添加

集合名输入`{ipset}4`，例如`yuanshen4`及`{ipset}6`，例如`yuanshen6`

FQDN输入若干全限定域名，下文使用`{hosts}`代指

表格ip族保持默认`IPv4+6`

点击保存

#### 测试
在测试机访问`{hosts}`

进入系统->管理权->SSH访问

添加`lan`区域

ssh登陆openwrt

执行命令`nft list set inet fw4 {ipset}4`，例如`nft list set inet fw4 yuanshen4`

正常应该可以看到返回
```
table inet fw4 {
        set yuanshen4 {
                type ipv4_addr
                timeout 1h
                elements = { 120.xxx.xxx.231 expires 52m53s900ms }
        }
}
```

执行命令`nft list set inet fw4 {ipset}6`同理，例如`nft list set inet fw4 yuanshen6`