---
title: Caddy的配置与运行
summary: Caddy是一款基于Golang的web服务项目，它配置方便，可以快速搭建起网站服务。本文描述如何在linux上安装配置Caddy。
tags:
  - Caddy
toc: true
date: 2021-03-31 00:00:00
slug: caddy
---
### 简介
Caddy是一款基于Golang的web服务项目，它配置方便，可以快速搭建起网站服务。

### Caddy用户
为了安全，需要创建一个用户组及用户来独立运行Caddy。

```bash
sudo useradd caddy
```

这将创建一个用户caddy，同时也将创建一个用户组caddy。

本节额外内容：删除用户，用户组。

```bash
sudo userdel caddy
sudo groupdel caddy
```

### Caddy的获取及安装
Caddy可以从[下载页](https://caddyserver.com/download)中获取到，你可以添加想要的插件，此处使用的为未添加插件的Caddy。为了方便后续使用，下载后重命名为`caddy`。并将此可执行文件放置在`/usr/bin/`下，并更改所有者，确保有运行权限。

```bash
sudo chown caddy:caddy /usr/bin/caddy
sudo chmod 775 /usr/bin/caddy
```

### Caddy配置文件
Caddy启用时可以从配置文件启动。此处给出静态网站示例。当没有域名时，也可以启动到端口，详见[配置文件学习](https://caddyserver.com/docs/caddyfile-tutorial)。需要更多功能参见[更多功能](https://caddyserver.com/docs/caddyfile/directives)。

```
blog.ntsdtt.bid {
  root * 此处为网站根目录的绝对地址
  encode gzip
  file_server
}
```

根据需要修改后将其保存到`/etc/caddy/Caddyfile`，确保所有者及权限。

```bash
sudo chown -R caddy:caddy /etc/caddy
sudo chmod -R 775 /etc/caddy
```

### Caddy服务文件
为了能让Caddy作为服务运行，需要编写一个服务文件，如下。

```service
# caddy.service
#
# For using Caddy with a config file.
#
# Make sure the ExecStart and ExecReload commands are correct
# for your installation.
#
# See https://caddyserver.com/docs/install for instructions.
#
# WARNING: This service does not use the --resume flag, so if you
# use the API to make changes, they will be overwritten by the
# Caddyfile next time the service is restarted. If you intend to
# use Caddy's API to configure it, add the --resume flag to the
# `caddy run` command or use the caddy-api.service file instead.

[Unit]
Description=Caddy
Documentation=https://caddyserver.com/docs/
After=network.target

[Service]
User=caddy
Group=caddy
ExecStart=/usr/bin/caddy run --environ --config /etc/caddy/Caddyfile
ExecReload=/usr/bin/caddy reload --config /etc/caddy/Caddyfile
TimeoutStopSec=5s
LimitNOFILE=1048576
LimitNPROC=512
PrivateTmp=true
ProtectSystem=full
AmbientCapabilities=CAP_NET_BIND_SERVICE

[Install]
WantedBy=multi-user.target
```

在此服务文件中，Caddy在一个用户组为caddy的用户caddy下运行。配置文件被指定为`/etc/caddy/Caddyfile`。

然后将其安装。

```bash
install -m 644 {caddy.service文件路径} /etc/systemd/system/caddy.service
systemctl daemon-reload
```

本节额外内容：删除服务。

首先停止服务，再删除。

```bash
rm /etc/systemd/system/caddy.service
systemctl daemon-reload
```

### 启动Caddy服务
通过以下命令来管理你的Caddy服务。

停止服务`systemctl stop caddy`

启动服务`systemctl start caddy`

重启服务`systemctl restart caddy`

服务状态`systemctl status caddy`

### Caddyfile配置备忘
#### 避免占用2019端口以免只能开一个caddy
```
{
    admin off
    auto_https off
}
```

#### 硬盘均衡
```
{
    log {
        output discard
    }
}

:10802 {
    reverse_proxy {
        to http://localhost:10800 http://localhost:10801
        lb_policy least_conn
        fail_duration 2s
        unhealthy_latency 1s
        unhealthy_status 4xx 5xx
        header_down X-Host {upstream_hostport}
    }

    handle_errors {
        respond "all servers down." 502
    }

}

http://localhost:10800 {
    file_server {
        root E:\1
        precompressed gzip br
        disable_canonical_uris
    }
}

http://localhost:10801 {
    file_server {
        root D:\0stack\1
        precompressed gzip br
        disable_canonical_uris
    }
}
```