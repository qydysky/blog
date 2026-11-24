---
title: TrueNas折腾记
summary: 这篇文章是关于TrueNas折腾的备忘。
date: 2023-06-18T20:27:52+08:00
toc: true
slug: truenas
tags:
 - truenas
---
### TrueNas
#### nas系统选择
Truenas官网[https://www.truenas.com/](https://www.truenas.com/)。

本次折腾选取TrueNAS SCALE版本，原因是基于Linux，支持k3s，docker。

不选择[OMV](https://www.openmediavault.org/)，因为本次折腾的硬件平台使用网卡Intel I226V，OMV官网ISO镜像安装时会提示无此网卡驱动。

不选择黑群辉，因为不符合群辉条款规定，想避免后续出现的法律或者更多问题。

不选择威联通，因为威联通是订阅付费。

不选择[unraid](https://unraid.net/zh)，一是因为需要一次性付费，价格较贵，二是据说（有评论）性能不佳。

不选择windows，一是因为我之前有折腾Linux经验，二是占用资源会更多。

事前进行了虚拟机安装测试，虚拟机使用oracleVM VritalBox。虚拟机上发现问题：虽然挂载多个硬盘，但创建储存池后容量显示错误。总体来说不是大问题。

这次折腾TrueNAS SCALE，相比之前用过的威联通，群晖等系统，主要的是它对磁盘的基础管理、共享能力。容器等更多能力使用[Portainer](https://github.com/portainer/portainer)进行管理。

#### 硬件
- cpu：intel 赛扬 j4125
- 内存：8G 2666 SO-DIMM 光威
- 硬盘：4x1TB SSD、3x240GB SSD

在[官网文档](https://www.truenas.com/docs/)有关于TrueNAS SCALE安装的步骤。下面开始记录。

#### 制作安装盘
下载ISO镜像，使用dd命令写入u盘，这里直接贴官网文字。

```
To write the TrueNAS installer to a USB stick on Linux, plug the USB stick into the system and open a terminal.

Start by making sure the USB stick connection path is correct. There are many ways to do this in Linux, but a quick option is to enter the command lsblk -po +vendor,model and note the path to the USB stick. This shows in the NAME column of the lsblk output.

Next, use command dd to write the installer to the USB stick.

    Be very careful when using dd, as choosing the wrong of= device path can result in irretrievable data loss!

Enter command dd status=progress if=path/to/.iso of=path/to/USB in the CLI.

If this results in a permission denied error, use command sudo dd with the same parameters and enter the administrator password.
```

#### 安装前注意事项
比较重要的有以下两项，需要进入bios进行操作


1. Disable SecureBoot if your system supports it so or set it to Other OS so you can boot to the install media.
2. Choose to boot in UEFI mode or legacy CSM/BIOS mode. 


#### 安装
给主板插入1个硬盘，插入u盘，连接显示器和键盘，选择u盘启动。安装过程较简单（没多少选择），可参见[官方文档](https://www.truenas.com/docs/scale/gettingstarted/install/installingscale/)。

安装过程很顺利，没遇到什么问题。

#### 使用
插入两硬盘，设置为镜像，放置系统（会默认将第一个创建的池作为系统集）。以上未遇到问题。且在众多视频网站均有创建储存池的相关视频

- [【司波图】TrueNAS新手视频教学（1）——系统安装，存储池建立](https://www.bilibili.com/video/BV1Cy4y1i7yG)
- [TrueNAS SCALE小白级安装设置教程](https://www.bilibili.com/video/BV1q3411i7Nq)

在此处就不再赘述。

然后遇到第一个truenas常见问题

#### 问题-报告为空
在浏览器中点击报告页，没有显示图表内容，或者显示为null。

解决办法：
[Most reports are blank, TrueNAS-SCALE-22.12.1](https://www.truenas.com/community/threads/most-reports-are-blank-truenas-scale-22-12-1.108187)

简要概括就是bios时间要为当前UTC时间，中国为东8区，故要在bios里将本地时间-8小时，可以调整快1~2s。然后重启，进入界面提示报告数据错误，需要重新收集，过几分钟后就可以正常查看到报告图表了。

```
admin@truenas[~]$ timedatectl
               Local time: Sun 2023-06-18 23:07:29 CST
           Universal time: Sun 2023-06-18 15:07:29 UTC
                 RTC time: Sun 2023-06-18 15:07:29
                Time zone: Asia/Shanghai (CST, +0800)
System clock synchronized: yes
              NTP service: n/a
          RTC in local TZ: no
admin@truenas[~]$ 
```

#### 问题-双网口无法同时使用
网上对网络配置提及的较少，由于硬件为双网口，故想同时用的起来。

但若你完全没有相关知识，可以先找些相关视频。

经测试，它不能手动设置到同一子网中比如一个为`192.168.31.101/24`，另一个设置`192.168.31.102/24`就无法点击确认，并且没有提示。

它能一个设置为dhcp自动获取，一个设置具体ip,也可以两个dhcp自动获取，但经测试，只要拔掉其中一个网口，另一个ip也无法访问。

添加接口配置，桥接、VLAN个人感觉意义不大。

链路聚合中LACP需要交换机支持，手头没有，不能选择。

FAILOVER配置好使用两个网口，但无法访问，1min钟后由于不能登陆web界面确认导致配置回滚。

LOADBALANCE是唯一成功的，指定好ip地址后，使用两个网口，确认可以正常使用web访问，并且拔任一网口均可正常继续使用。

#### 问题-写入、读取、校验错误
在解决上述两个比较显眼的问题后，我接上了4个1T硬盘，组raidz1，即1块校验。并且配置了邮件提醒。

邮件提醒使用了阿里云的邮件服务，与此次关系不大，如何配置不在赘述。

在后续的长时间写入中，先提一嘴，此处指录制直播，因此会1~2M/s持续写入几小时。最后大致会有20G左右的大文件。

这期间某块盘一直报写入错误，邮件一个接一个不停。

首先，web界面的校验按钮是无效的，状态依然显示有问题。

在`sudo -i`后，使用命令行`zpool status`可以看到他建议使用`zpool clear {池名称} {盘uuid}`去除错误，去除后点击校验按钮，马上又会收到校验错误的提示。

最后解决方案是，~~拔出发生错误的盘，重新插入。因为是阵列，所以拔出也不会损毁。因为是新硬盘，怀疑是硬件接触不良等导致的~~更换掉垃圾铝制sata线。

#### 问题-某硬盘unreadable sectors
在`服务`页中默认配置了定期`S.M.A.R.T. Tests`，然后就来邮件提示某硬盘无法读取。

解决方案，~~选择`空闲`模式~~硬盘出现坏块，更换了硬盘。

#### 问题-nfs共享提示错误
在配置好主储存池后，我新建了测试的数据集。

如果对池及数据集等不太了解，可以先找些相关视频。

然后在共享中添加了nfs共享，但是我的电脑却无法访问。或者电脑创建的文件，手机无法访问，删除。

目前解决方法，一是参考[官方文档](https://www.truenas.com/docs/scale/scaletutorials/shares/addingnfsshares/)，使用`mount -t nfs -o rw,nconnect=16 10.239.15.110:/mnt/Pool1/NFS_Share /mnt/pool` 进行挂载，二是配置好权限。

数据集详细信息，高级选项，ACL模式选择了`SMB/NFSv4`，`丢弃`。

ACL权限保留所有者，组，其他人就足够我的使用了。如果对数据集设置了smb共享，上述就是所有者@，团队@，每个人@。

我使用了权限中的高级，都不给`删除`。每个人@不给`写入命名属性`、`写所有者`、`写ACL`。全部标记都是`继承`。`递归`保存。

以上仅供参考，如有不合理之处在说吧。

#### Portainer配置
经过上述一系列的踩坑，资源管理、基础共享的算是比较稳定了，接下来记录Portainer的配置。

可以参考[TrueNAS SCALE 如何直接使用docker，这个视频告诉你最优解](https://www.bilibili.com/video/BV1pb4y1b7Sc)

简要的说就是Portainer本身支持k8s部署，使用[配置文件](https://github.com/portainer/k8s/blob/master/deploy/manifests/portainer/portainer.yaml)进行部署后，就可以在Portainer中管理docker了。配置文件参见[https://github.com/portainer/k8s](https://github.com/portainer/k8s).

我在portainer直接使用host网络，容器可以连上网络。

这里也给出我的配置

```yml
---
# Source: portainer/templates/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: portainer
---
# Source: portainer/templates/serviceaccount.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: portainer-sa-clusteradmin
  namespace: portainer
  labels:
    app.kubernetes.io/name: portainer
    app.kubernetes.io/instance: portainer
    app.kubernetes.io/version: "ce-latest-ee-2.18.3"
---
# Source: portainer/templates/pvc.yaml
kind: "PersistentVolumeClaim"
apiVersion: "v1"
metadata:
  name: portainer
  namespace: portainer  
  annotations:
    volume.alpha.kubernetes.io/storage-class: "generic"
  labels:
    io.portainer.kubernetes.application.stack: portainer
    app.kubernetes.io/name: portainer
    app.kubernetes.io/instance: portainer
    app.kubernetes.io/version: "ce-latest-ee-2.18.3"
spec:
  accessModes:
    - "ReadWriteOnce"
  resources:
    requests:
      storage: "10Gi"
---
# Source: portainer/templates/rbac.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: portainer
  labels:
    app.kubernetes.io/name: portainer
    app.kubernetes.io/instance: portainer
    app.kubernetes.io/version: "ce-latest-ee-2.18.3"
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  namespace: portainer
  name: portainer-sa-clusteradmin
---
# Source: portainer/templates/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: portainer
  namespace: portainer
  labels:
    io.portainer.kubernetes.application.stack: portainer
    app.kubernetes.io/name: portainer
    app.kubernetes.io/instance: portainer
    app.kubernetes.io/version: "ce-latest-ee-2.18.3"
spec:
  type: NodePort
  ports:
    - port: 9000
      targetPort: 9000
      protocol: TCP
      name: http
      #使用自定义端口
      nodePort: 9001  
    - port: 9443
      targetPort: 9443
      protocol: TCP
      name: https
      nodePort: 30779      
    - port: 30776
      targetPort: 30776
      protocol: TCP
      name: edge
      nodePort: 30776
  selector:
    app.kubernetes.io/name: portainer
    app.kubernetes.io/instance: portainer
---
# Source: portainer/templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: portainer
  namespace: portainer
  labels:
    io.portainer.kubernetes.application.stack: portainer
    app.kubernetes.io/name: portainer
    app.kubernetes.io/instance: portainer
    app.kubernetes.io/version: "ce-latest-ee-2.18.3"
spec:
  replicas: 1
  strategy:
    type: "Recreate"
  selector:
    matchLabels:
      app.kubernetes.io/name: portainer
      app.kubernetes.io/instance: portainer
  template:
    metadata:
      labels:
        app.kubernetes.io/name: portainer
        app.kubernetes.io/instance: portainer
    spec:
      nodeSelector:
        {}
      serviceAccountName: portainer-sa-clusteradmin
      containers:
        - name: portainer
          image: "portainer/portainer-ce:latest"
          imagePullPolicy: Always
          args:
          - '--tunnel-port=30776'          
          volumeMounts:
            - name: data
              mountPath: /data
            - name: docker
              mountPath: /var/run/docker.sock              
          ports:
            - name: http
              containerPort: 9000
              protocol: TCP
            - name: https
              containerPort: 9443
              protocol: TCP                
            - name: tcp-edge
              containerPort: 8000
              protocol: TCP              
          livenessProbe:
            httpGet:
              path: /
              port: 9443
              scheme: HTTPS
          readinessProbe:
            httpGet:
              path: /
              port: 9443
              scheme: HTTPS        
          resources:
      volumes:
      - name: data
        hostPath:
          #使用自己的池
          path: /mnt/system/apps/portainer
          type: Directory
      - name: docker
        hostPath:
          path: /var/run/docker.sock
```

然后`k3s kubectl apply -f /root/portainer.yaml`执行部署

然后应该就在设定的端口`9001`看到了web界面，选get start,环境，添加`Docker Standalone`，`socket`，然后docker环境就出现了。

#### 问题-官方目录超时
说到应用，truenas本身自带一个应用的菜单，它内置了一个官方应用目录，如果是内网使用，或者网络原因连接不上就会触发默认危急的警告（邮件）。还是每天一次，如果重启了也会来一次。

解决方法，目前没有办法在不取消池的前提，删除、修改、禁用这个官方目录。一调低警告等级，为信息，就不会触发邮件等。二是它默认选了`charts`和`community`，`community`很容易超时，如果不用，建议只选`charts`。

也可以在容器里跑代理，在truenas网络中配置http代理。

#### 问题-无法联网
有时容器会设置网关、dns失败。导致无法上网。解决方案，到网络手动设置一次。

#### 配置容器
下面列出了我配置的容器

##### coder
浏览器码代码

项目地址：https://github.com/coder/code-server

[配置账号保存](https://github.com/coder/code-server/issues/5072)

##### cloudreve
文件管理

项目地址：https://github.com/cloudreve/cloudreve

##### frp
内网穿透

项目地址：https://github.com/fatedier/frp

##### cloudbeaver
浏览器数据库查询

项目地址：https://github.com/dbeaver/cloudbeaver

##### caddy
统一的反向代理

项目地址：https://caddyserver.com/

##### proxy
为局域网及本机提供代理，提供socks、http代理