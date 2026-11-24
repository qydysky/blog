---
title: 从debian开始搭建nas系统
summary: 本文记录了从debian开始搭建nas系统
tags:
  - nas
toc: true
date: 2024-12-21T11:06:00+08:00
slug: nas
---
### 简介
在去年6月，曾写过一篇关于部署truenas的记录，踩了truenas的若干坑。

在最近，truenas重启后，容器不再能启动，搜索得到的结果都是无法恢复。

加之truenas升级也会带来风险，truenas总有些遗留未修复的坑。

终于决定，不再使用truenas，直接从debian开始配置，以得到对系统的完全控制。

但更加自由的同时，可能会带来更多的风险，本文尽量在可能导致数据丢失的时候进行提醒。

以下为部署记录：

### 说明
此文为顺序操作记录，如果对linux足够熟悉，应该可以在1h内完成本文配置，实现以下功能。

- Web状态监控
- SMB共享
- 邮件提醒功能
- UPS slave
- raid
- lacp
- k3s

### 必要条件
- 正常网络环境
- 另一台正常运行电脑
- 无用u盘
- 显示设备
- 键盘
- 组装好的NAS硬件

### 制作安装盘
前往[debian官网](https://www.debian.org/)，下载安装镜像`debian-testing-amd64-netinst.iso`

使用安装盘制作工具将镜像烧录入u盘

### 安装debian
将u盘插入NAS,配置从u盘启动

在进行安装分区时，本处直接使用一个空硬盘。

！需要注意选错安装到数据盘，数据将丢失。

在选择桌面环境时，不安装桌面环境，安装`ssh服务器`

配置http代理或者镜像使得安装速度加快

下文安装时默认用户为`xxx`

安装完后重启

### 配置debian
使用nas键盘，登陆`root`

使用`ip address show`查看当前ip

下文默认为`192.168.31.2`

在其他电脑上，使用ssh工具连接`ssh xxx@192.168.31.2`

连接后开始配置软件

#### 更新系统
使用命令`su`，登陆`root`用户

执行`apt update;apt upgrade`更新系统

#### 安装sudo
执行`apt install sudo`，安装sudo

执行`nano /etc/sudoers.d/xxx`

写入
```
xxx ALL=(ALL:ALL) ALL
```
，保存退出

执行`exit`退出root

执行`sudo -i`，检查是否配置成功

#### 查看磁盘
执行`fdisk -l | less`查看磁盘

#### 检查磁盘状态
执行`apt install smartmontools`

执行`smartctl -a /dev/nvme0|less`查看指定设备smart状态

#### 为磁盘重新分区
！对磁盘进行分区，将会丢失数据

执行`fdisk /dev/sdb`

常用命令：

- g：重新创建gpt记录
- p：查看分区
- n：新建分区
- d：删除分区
- w：保存
- q：离开不保存
- m：帮助

当遇到提示忙时：使用`lsblk`可以查看磁盘分区及raid绑定

卸载raid：`mdadm --stop /dev/mdX`

卸载vg：`vgremove {vgname}`

通知系统磁盘卸载：`echo 1 | sudo tee /sys/block/(whatever)/device/delete`

！格式化分区，将会丢失数据

执行`mkfs.<filesystem> </path/to/disk/partition>`，重新格式化分区

#### 创建raid1
执行`mdadm --create /dev/md/1 /dev/sdb1 /dev/sdc1 --level=1 --raid-devices=2`

执行`mdadm --detail /dev/md1`查看状态

！格式化分区，将会丢失数据

执行`mkfs.<filesystem> </path/to/disk/partition>`，重新格式化分区

#### 挂载磁盘
由于[fhs](https://www.debian.org/doc/packaging-manuals/fhs/fhs-3.0.html#mediaMountPoint)，新建一个`/vol`作为挂载点目录

执行`mkdir /vol/disk1`创建挂载点

手动挂载分区：

执行`mount /dev/sda1 /vol/disk1`

情况：

- 提示`unknown filesystem type 'linux_raid_member'`时，说明此磁盘为raid磁盘

  使用`cat /proc/mdstat`查看是否以自动安装

  如没有使用`mdadm`命令安装

- 提示`unknown filesystem type 'LVM2_member'`时

  使用`vgdisplay`查看vgName

  使用`fdisk -l | less`查看对应的mapper

  使用`mount /dev/mapper/vg288-lv4 /vol/disk1`挂载

通知系统重新扫描：`echo "- - -" | tee /sys/class/scsi_host/host*/scan`

配置自动挂载：

执行`blkid`查询磁盘id、及文件系统类型

！错误的fstab将会导致系统不能正常启动

执行`nano /etc/fstab`

添加自定义注释，写入以下内容（注意自行替换关键字段）

```
# <file system> <mount point>   <type>  <options>       <dump>  <pass>
UUID=3b0d8f07-d5fa-4649-8aa4-f0e08b92ee08 /vol/disk1 ext4 errors=continue 0 2
```

其中：

errors=continue：失败跳过，不影响系统系统启动

dump：是否转储，0否

pass: 挂载顺序，2其他文件系统

更多信息查看`man mount`说明

执行`systemctl daemon-reload`加载变动

#### 导入zfs
如果需要从truenas导入zfs pool

[https://wiki.debian.org/ZFS](https://wiki.debian.org/ZFS)

[https://openzfs.github.io/openzfs-docs/Getting%20Started/Debian/index.html#installation](https://openzfs.github.io/openzfs-docs/Getting%20Started/Debian/index.html#installation)

run `nano /etc/apt/sources.list`

add `contrib`
```
deb http://deb.debian.org/debian/ trixie main non-free-firmware contrib
deb-src http://deb.debian.org/debian/ trixie main non-free-firmware contrib
```

run`nano /etc/apt/preferences.d/90_zfs`
```
Package: src:zfs-linux
Pin: release n=trixie-backports
Pin-Priority: 990
```

run
```
apt update
apt install dpkg-dev linux-headers-generic linux-image-generic
apt install zfs-dkms zfsutils-linux
```

run`reboot`

test`zfs version`

use`zpool import`check all pool

！不使用N选项，将在导入时自动挂载，可能会挂载到系统路径，损坏系统

use`zpool import -Nf {pool name}`to import pool, use '-N' to avoid mount something to break you system

run`zpool status`to check status

使用`zfs get all`获取zpool里的所有挂载路径，建议先行取消所有挂载点：

use`zfs set mountpoint=none {pool name}/{path}`to unset mountpoint {pool name}/{path}

！配置挂载路径，将会自动挂载，可能会损坏系统

use`zfs set mountpoint=/vol/test {pool name}/{path}`to set mountpoint {pool name}/{path} and automount

配置之后，应该会在重启时自动挂载。

mount by hand: use`zfs mount {pool name}/{path}`to mount pool

unmount by hand: use`zfs unmount {pool name}/{path}`to unmount pool

use`zpool export -f {pool name}`to export pool

#### 配置smb
执行`apt install samba`安装`smb`

执行`useradd -m smb`创建`smb`用户，此处以`smb`为示例

执行`passwd smb`设置`smb`用户密码

执行`smbpasswd -a smb`添加`smb`到samba用户

执行`nano /etc/samba/smb.conf`，写入
```
[disk1]
 path = /vol/disk1
 read only = no
 guest ok = no
```

注意你path的unix权限会影响smb读写

其他配置查看注释示例

执行`systemctl restart smbd.service`重启服务

然后可以从局域网机器访问测试

#### 配置监控
此处使用`Grafana`进行示例

在可以上网的电脑打开[grafana官网](https://grafana.com)，查看安装示例

在本文创建时，为[https://grafana.com/docs/grafana/latest/setup-grafana/installation/debian](https://grafana.com/docs/grafana/latest/setup-grafana/installation/debian), 以下内容可能过时

执行`apt-get install -y apt-transport-https wget`

> 注意`software-properties-common`已经被移除,[https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=1038747](https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=1038747)

执行
```
sudo mkdir -p /etc/apt/keyrings/
wget -q -O - https://apt.grafana.com/gpg.key | gpg --dearmor | sudo tee /etc/apt/keyrings/grafana.gpg > /dev/null

echo "deb [signed-by=/etc/apt/keyrings/grafana.gpg] https://apt.grafana.com stable main" | sudo tee -a /etc/apt/sources.list.d/grafana.list

# Updates the list of available packages
sudo apt-get update

# Installs the latest OSS release:
sudo apt-get install grafana

systemctl daemon-reload

systemctl enable grafana-server

systemctl start grafana-server
```

默认配置在`/etc/grafana/grafana.ini`

服务默认启动在3000端口

使用用户名`admin`，密码`admin`登陆

添加监控prometheus：

执行`apt-get install prometheus prometheus-node-exporter`

默认启动在本机9090端口， 配置文件`/etc/prometheus/prometheus.yml`

在grafana数据源添加prometheus

内存、CPU、网络、磁盘等监控都可以通过prometheus获取，此处不再赘述，仅提供一些prometheus常用code,可自行搜索

- Netstat(TCP UDP连接数)
```
node_netstat_Tcp_CurrEstab

irate(node_netstat_Udp_InDatagrams[5m])+irate(node_netstat_Udp_InErrors[5m])+irate(node_netstat_Udp_OutDatagrams[5m])+irate(node_netstat_Udp_NoPorts[5m])
```

- NetworkIO(网络流量)
```
sum(irate(node_network_receive_bytes_total{device=~"^en.*"}[1m]))

sum(irate(node_network_transmit_bytes_total{device=~"^en.*"}[1m]))
```

- cpu
```
100 - (avg(irate(node_cpu_seconds_total{mode="idle"}[30m])) * 100)
```

- men（内存）
```
(node_memory_MemTotal_bytes-node_memory_MemAvailable_bytes)/node_memory_MemTotal_bytes*100
```

- disk
```
100 - ((node_filesystem_avail_bytes{mountpoint="/vol/system",fstype!="rootfs"} * 100) / node_filesystem_size_bytes{mountpoint="/vol/system",fstype!="rootfs"})
```

添加日志监控loki：

执行`apt-get install loki`

执行`systemctl enable loki;systemctl start loki`

默认启动在本机3100端口，配置文件`/etc/loki/config.yml`

在grafana数据源添加loki

添加定时命令产生日志：

执行`crontab -e`
```
*/5 * * * * echo "time=$(date '+\%Y-\%m-\%d_\%H:\%M:\%S') dev=nvme0 msg=$(/sbin/smartctl -H /dev/$(ls -l /dev/disk/by-id/nvme-GLOWAY_TC3000_256GM280_L24103000502 | grep -o '.......$') | grep test | grep -o '\w\+\(!\?\)$')" >> /var/log/custom/smart/nvme0.log
```

添加日志收集器alloy：

执行`apt-get install alloy`

从日志收集可以参考[https://grafana.com/docs/alloy/latest/tutorials/send-logs-to-loki/](https://grafana.com/docs/alloy/latest/tutorials/send-logs-to-loki/)

执行`nano /etc/alloy/config.alloy`

```
local.file_match "local_files" {
    path_targets = [{"__path__" = "/var/log/custom/**/*.log"}]
    sync_period = "5s"
}
loki.source.file "log_scrape" {
    targets    = local.file_match.local_files.targets
    forward_to = [loki.process.filter_logs.receiver]
    tail_from_end = true
}
loki.process "filter_logs" {
    forward_to = [loki.write.grafana_loki.receiver]
}
loki.write "grafana_loki" {
    endpoint {
        url = "http://localhost:3100/loki/api/v1/push"
    }
}
```

执行`systemctl start alloy`

日志的grafana示例：

```
{filename=~"/var/log/custom/smart/.*.log"} | logfmt time | logfmt dev | logfmt msg
```

#### 配置警告
警告基于`Grafana`，此处以邮件为例

可以在`grafana`找到相关文档，在本文创建时[https://grafana.com/docs/grafana/latest/alerting/configure-notifications/manage-contact-points/integrations/configure-email/](https://grafana.com/docs/grafana/latest/alerting/configure-notifications/manage-contact-points/integrations/configure-email/)

执行`nano /etc/grafana/grafana.ini`

查询`smtp`，配置相关字段

执行`systemctl restart grafana-server`

在界面配置联络点，配置警告规则

#### 配置UPS slave
一般只有在直连ups的机器才配置master,此处以slave为例

执行`apt install nut-client`

执行`nano /etc/nut/nut.conf`，配置`MODE=netclient`

使用`upsc qnapups@192.168.31.1:3493`，探测是否可以正常获取ups信息

执行`nano /etc/nut/upsmon.conf`，写入
```
MONITOR <system> <powervalue> <username> <password> ("primary"|"secondary")
MONITOR qnapups@192.168.31.1:3493 1 admin 123456 "secondary"
```

执行`service nut-client restart`重启服务

#### 配置lacp
执行`apt-get install ifenslave`

执行`ip link show`查看网卡

执行`nano /etc/network/interfaces.d/bond0`写入以下内容
```
auto bond0
iface bond0 inet static
    address 192.168.31.221
    netmask 255.255.255.0
    network 192.168.31.0
    gateway 192.168.31.1
    slaves enp3s0 enp4s0
    bond-mode 802.3ad
    bond-miimon 100
    bond-downdelay 200
    bond-updelay 200
```

or

```
auto bond0
iface bond0 inet dhcp
    slaves enp3s0 enp4s0
    bond-mode 802.3ad
    bond-miimon 100
    bond-downdelay 200
    bond-updelay 200
```

！错误的配置可能让你无法通过网络继续操作nas

执行命令`reboot`

使用`cat /proc/net/bonding/bond0 |less`查看状态

#### 配置k3s
前往[https://docs.k3s.io/quick-start](https://docs.k3s.io/quick-start)

执行`apt install curl`

执行安装支持ipv4/ipv6的k3s
```
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server --node-ip 2001:BBB:111:111::1 --cluster-cidr 2001:cafe:42:0::/56 --service-cidr 2001:cafe:43:1::/112" sh -s -
```

如果希望自行管理443/80,你需要[移除traefik](https://github.com/k3s-io/k3s/issues/1160)

执行`kubectl -n kube-system delete helmcharts.helm.cattle.io traefik`

执行`service k3s stop`

执行`nano /etc/systemd/system/k3s.service`，在ExecStart添加行
```
'--disable traefik' \
```

执行`systemctl daemon-reload`

执行`rm /var/lib/rancher/k3s/server/manifests/traefik.yaml`

执行`service k3s start`


设置代理:

执行`mkdir -p /etc/systemd/system/containerd.service.d/`

执行`/etc/systemd/system/containerd.service.d/http-proxy.conf`

写入
```
[Service]
Environment="HTTP_PROXY=http://192.168.31.1:10807"
Environment="HTTPS_PROXY=http://192.168.31.1:10807"
Environment="NO_PROXY=localhost,127.0.0.0/8,::1,172.17.0.0/16,10.0.0.0/8,192.0.0.0/8,.cluster.local"
```

执行`systemctl restart k3s.service`

安装[portainer](https://docs.portainer.io/start/install-ce/server/kubernetes/baremetal)

执行`kubectl get sc`获取NAME，下文以local-path为例

执行
```
kubectl patch storageclass local-path -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
```

执行
```
kubectl apply -n portainer -f https://downloads.portainer.io/ce2-21/portainer.yaml
```

执行
```
kubectl patch deployments -n portainer portainer -p '{"spec": {"template": {"spec": {"nodeSelector": {"kubernetes.io/hostname": "'$(kubectl get pods -n portainer -o jsonpath='{ ..nodeName }')'"}}}}}' || (echo Failed to identify current node of portainer pod; exit 1)
```

服务运行于30777端口

简单使用示例：

#### 快速上手k3s

1. 创建持久卷：

目前[不允许动态创建持久卷](https://kubernetes.io/docs/concepts/storage/storage-classes/#local)，此处为手动创建

执行`kubectl describe nodes | grep kubernetes.io/hostname`得到`{hostname}`，配置中需要

在portainer的Volume，新建
```yml
# 如果需要挂载多个，则对应需要多个`持久卷`及`持久卷声明`，他们的name应该唯一
# 持久卷
apiVersion: v1
kind: PersistentVolume
metadata:
  name: {name}-data-pv
spec:
  capacity:
    storage: 100Gi # 自定义大小，local-storage时，并没有效果
  volumeMode: Filesystem
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Delete
  storageClassName: local-storage
  local:
    path: /mnt/disks/ssd1 # 主机自定义位置
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - {hostname} # 主机名
---
# 持久卷声明
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: {name}-data-claim
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 100Gi # 自定义大小
  storageClassName: local-storage
  volumeName: {name}-data-pv
```

关于移除持久卷：

界面删除后，执行下述命令，删除pv，删除本文中示例的持久卷并不会删除对应的文件。
```
kubectl get pv
kubectl delete pv {pv名称}
```

2. 简单的从debian启动任意程序的例子
```yml
# 服务
apiVersion: v1
kind: Service
metadata:
  name: {name}-service #replace {name} with anything you like
spec:
  selector:
    app: {name}
  ipFamilyPolicy: PreferDualStack
  ipFamilies:
    - IPv4
    - IPv6
  ports: # add more port if you like
    - name: port-1
      port: 10851 # 主机
      targetPort: 10851 # 容器
    - name: port-2
      port: 10852
      targetPort: 10852
    - name: port-3
      port: 10902
      targetPort: 10902
  type: LoadBalancer
---
# 应用
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {name}-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: {name} #name
  template:
    metadata:
      labels:
        app: {name}
    spec:
      volumes: # add more if you want
        - name: {name}-data #volName
          persistentVolumeClaim:
            claimName: {name}-data-claim #volName
      containers:
      - name: debian
        image: debian:latest # 使用镜像
        env:
        - name: DEMO_GREETING
          value: "Hello from the environment"
        volumeMounts:
          - mountPath: /caddy #mountpath
            name: {name}-data #volName
        command: [ "/bin/bash", "-c", "--" ]
        args: [ "/caddy/run.sh" ] # sh脚本
```
