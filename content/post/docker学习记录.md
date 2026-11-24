---
title: docker学习记录
summary: docker在这几年十分热门，这么热门的东西一定要学一下。
date: 2021-10-21T15:43:00+08:00
tags:
 - docker
toc: true
slug: docker
---
## docker学习笔记
### 基础概念
#### 最初印象
docker引擎是一款开源的容器技术，使用它你可以快速构建你的应用容器，分发到你的基础设备上。

它让你可以将应用打包成独立的运行环境，简称为容器。由于其独立及安全，一个主机上可以运行许多容器。
容器是轻量的，并且包含了所有需要运行应用的环境，所以不需要对主机有其他的要求。从而你可以轻松的把容器进行分享。

docker提供了工具和平台来管理容器的生命周期。

- 使用容器开发应用和组件
- 容器成为分发和测试应用的单元
- 一旦你准备好发布，部署容器到生产环境就如同本地部署一样

docker能在相同的硬件条件下运行比虚拟机更多的工作载荷

#### docker组织组成
- client:

    创建、拉取、运行、推送docker镜像

- host:

    docker守护进程管理镜像及运行容器

- registry:

    docker公共镜像库

#### docker技术组成
Images 镜像：

你可以在已经存在的镜像基础上创建自己镜像。创建`Dockerfile`，它规定了你的镜像基于什么镜像框架、如何创建和运行你的应用。当你对它进行改动时，只有改动的部分会重建，这使得镜像的创建变得轻量、快速。

Containers 容器：

容器是镜像的可运行界面。它的创建及配置基于镜像的配置。它是相对独立的，你可以控制它的网络，储存等。对它的任何改动都将在容器摧毁时被销毁。

这是一个轻松的示例：
```bash
docker run -i -t ubuntu /bin/bash
```

上述命令可以启动一个`ubuntu`容器。`ubuntu`会从镜像库中获取，然后在本地创建容器。以下是此命令会发生的详细事情。

- 如果你本地没有`ubuntu`镜像，则会从镜像库中获取，就如同`docker pull ubuntu`一样
- 创建容器，就如同`docker container create`一样
- 分配一块可读写文件系统给容器，这允许容器操作本地文件系统
- 创建网络界面，并连接到默认网络，并给容器注册一个ip。
- docker运行`/bin/bash`，这让你通过当前命令行连接到容器中。
- 当你断开命令行时，docker会停止此容器，但不会删除，你可以选择再次启动或者移除它

#### docker底层技术
docker使用golang语言编写，并使用了linux的内核功能。

docker使用了linux的命名空间`namespaces`。linux内核使用各种命名空间来分离进程树、网络接口、挂载点及进程间的通信资源。这使得容器可以安全并独立的运行。

更多信息查看[docker docs](https://docs.docker.com/)。

### 开始安装
根据[官方教程](https://docs.docker.com/desktop/windows/install/)，首先开启虚拟化。

在本文编写时，正是win11正式版刚发布的时间点，本文使用win10来进行配置。

官方给了`Hyper-V backend and Windows containers`及`WSL 2 backend`两种运行方式，此处选择第一种。

首先，开启bios里的虚拟化功能，再在win里开启`Hyper-V`。

找到`控制面板\所有控制面板项\程序和功能`中的`启用或关闭windows功能`，找到`Hyper-V`，勾选并确定，此时将会重启安装。

如一切顺利，接下来下载[docker destop](https://docs.docker.com/desktop/windows/install/)。

注意，注册是不需要的，但如果直接访问`https://www.docker.com/products/personal`则会要求先注册。

点击安装，需要勾选使用`Hyper-V backend and Windows containers`还是`WSL 2 backend`，两项中仅选择`Hyper-V`。

有时也并不会有`Hyper-V`的选项，不过只要确定`Hyper-V`已启动，那么不用勾选亦能成功安装启动。

如一切正常，将会重启，然后安装成功。

首次打开`docker destop`时，会再次提示选择`Hyper-V backend and Windows containers`还是`WSL 2 backend`，此时选择`Hyper-V`。

然后`docker`就开始启动，如一切正常，则会开始教程使用，但这不是必须的，可以跳过。

接着可以对`docker destop`进行一些调整，在设置中，可以禁止`docker destop`的自动启动，调整容器配置，选择切换运行方式。

同npm一样，docker也可使用镜像库，在设置中找到`Daemon`，在`Registry mirrors`中添加镜像源。

镜像源：
- [https://docker.mirrors.ustc.edu.cn](https://docker.mirrors.ustc.edu.cn)
- [http://hub-mirror.c.163.com](http://hub-mirror.c.163.com)

使用aliyun的镜像加速：

登录[https://cr.console.aliyun.com/](https://cr.console.aliyun.com/)，选择镜像工具，即可取得镜像加速器地址

### 入门使用
本章是一个连续的操作，为了方便，也做了分标题。

#### 创建镜像
创建镜像需要`Dockerfile`文件（注意是无后缀名的），下面介绍此文件的结构。

```dockerfile
# syntax=docker/dockerfile:1
FROM ubuntu:18.04
COPY . /app
RUN make /app
CMD python /app/app.py
```

`# syntax`:此功能仅在使用BuildKit后端时可用,在使用经典构建器后端时会被忽略，为了兼容性，你随时应当加上此标签，[更多关于该标签的信息](https://docs.docker.com/engine/reference/builder/#syntax)

`FROM`:基于哪个镜像（这必须是第一个标签）

`COPY`:添加文件到镜像中

`RUN`:创建镜像时运行的命令

`CMD`:运行镜像时运行的命令

除此之外，常用的还有：
```dockerfile
# 指定下面的RUN CMD COPY ADD ENTRYPOINT的工作路径
WORKDIR /path/to/workdir

# 声明镜像暴露的端口，但实际还需要在运行时使用-p等进行映射
EXPOSE 8080

# 环境变量
ENV MY_CAT=fluffy
```

更多标签，见[reference](https://docs.docker.com/engine/reference/builder/)

下面给一个`Dockerfile`就可以创建镜像的例子，将它放在一空文件夹下，就可以开始创建镜像了

```dockerfile
FROM ubuntu
CMD echo "This is a test."
```

当在项目的根创建了此文件后，就可以开始创建镜像了，在此文件夹打开命令行。

```
docker build -t test .
```

`-t`后跟一好记的名称，更多关于build的选项，运行`docker build --help`查看

```
PS C:\Users\011474\Downloads\getting-started-master\test> docker build -t test .                             
[+] Building 5.3s (5/5) FINISHED
 => [internal] load build definition from Dockerfile                                                    0.0s
 => => transferring dockerfile: 31B                                                                     0.0s
 => [internal] load .dockerignore                                                                       0.0s
 => => transferring context: 2B                                                                         0.0s
 => [internal] load metadata for docker.io/library/ubuntu:latest                                        5.2s
 => CACHED [1/1] FROM docker.io/library/ubuntu@sha256:626ffe58f6e7566e00254b638eb7e0f3b11d4da9675088f4  0.0s
 => exporting to image                                                                                  0.0s
 => => exporting layers                                                                                 0.0s
 => => writing image sha256:6b703d5b349b873e3d61b9d8f1b401d36fe0fd3aa8520f8b9357b763a3b9a504            0.0s
 => => naming to docker.io/library/test                                                                 0.0s

Use 'docker scan' to run Snyk tests against images to find vulnerabilities and learn how to fix them
```

#### 查看镜像
很快就创建好了镜像，使用下述命令可以看到本地的镜像。更多关于docker本身命令的选项，运行`docker --help`

```
PS C:\Users\011474\Downloads\getting-started-master\test> docker images
REPOSITORY   TAG       IMAGE ID       CREATED      SIZE
test         latest    6b703d5b349b   6 days ago   72.8MB
```

#### 运行镜像
使用下述运行镜像。

```
PS C:\Users\011474\Downloads\getting-started-master\test> docker run test
This is a test.
```

在下面的章节将会对`run`命令进行更多解读，如果想先看它有什么选项，可以运行`docker run --help`

#### 查看容器
在运行了镜像之后，会生成一个容器，使用下述命令查看容器

```
docker ps -a
CONTAINER ID   IMAGE     COMMAND                   CREATED         STATUS                     PORTS     NAMES
2e570ad005b5   test      "/bin/sh -c 'echo \"T…"   4 minutes ago   Exited (0) 4 minutes ago             magical_gauss
```

如果不加`-a`，默认是查看当前运行中的容器，更多选项可以运行`docker ps --help`查看

#### 创建容器
当然，你也可以先创建容器但不运行。关于`create`的命令，在下面的章节将会对它进行更多解读

```
docker create test
9d0138ed77de728dac04cb08b027fed282be6602a07ddfc3b7f07f2d294d2d27
```

返回的是容器的id，当然在使用此id时，并不需要把全部都输入，只需要输入足够位数，可以让docker区分即可

#### 运行容器
运行创建的容器可以使用如下命令。

```
docker start -a 9d0138ed77d
This is a test.
```

`-a`可以使我们直接连接到此容器的命令行。`-d`可以独立的运行（后台运行）。更多选项可以运行`docker start --help`查看

#### 重启、停止容器，查看容器占用
停止运行中的容器可以使用`docker stop 此处为容器id`，也支持延时关闭，具体运行`docker stop --help`查看。

如果无法停止，可以使用`docker kill 此处为容器id`强制停止，支持发送指定信号，具体运行`docker kill --help`查看。

同样，重启容器与停止命令相似，更多选项运行`docker restart --help`查看

使用如下指令可以实时查看各容器对硬件资源的占用情况

```
docker stats
CONTAINER ID   NAME      CPU %     MEM USAGE / LIMIT   MEM %     NET I/O   BLOCK I/O   PIDS
```

#### 删除容器
在有容器绑定镜像时，镜像是默认不能删除的，所以先删除容器。rm后跟容器id

```
docker rm 2e570ad005b5
2e570ad005b5
```

当然你可以加上`-f`来强行终止容器，加上`-v`来顺便移除容器使用的本地文件系统。更多选项可以运行`docker rm --help`查看

#### 删除镜像
然后即可删除镜像，更多选项可以运行`docker rmi --help`查看

```
docker rmi test
Untagged: test:latest
Deleted: sha256:00d9dc028d3adc93e997e4c87b168426ee55cb58f6b71c233741c274b88404bc
```

还记得之前用`create`创建的容器么，在项目目录中，我们找不到此容器的具体文件。如果我们想对其进行分发，就有以下几种方法。

#### 分发镜像

运行下面的命令可以创建一个本地包

```
docker save test -o a.tar
```

这会在当前文件夹生成a.tar，而这个tar包可以拷贝到其他地方进行导入

此处先删除`test`镜像后，运行下述命令即可导入。

```
docker load -i .\a.tar
Loaded image: test:latest
```

另外，我们还可以推送到docker镜像库中

#### 创建、挂载、删除、查找持久卷
上面提到，删除容器时，可以同时删除容器的本地文件系统，此处我们对如何持久化数据进行讲解。

首先创建容器卷

```
docker volume create test
test
```

在启动容器时，使用`-v 容器卷名称:挂载路径`选项，然后此容器将会挂载此容器卷。

你可以查看此卷的详细位置`Mountpoint`

```
docker volume inspect test
[
    {
        "CreatedAt": "2021-10-25T05:42:43Z",
        "Driver": "local",
        "Labels": {},
        "Mountpoint": "/var/lib/docker/volumes/test/_data",
        "Name": "test",
        "Options": {},
        "Scope": "local"
    }
]
```

注意，在windows上时，此卷是存储在hyper-V虚拟机中的，因此你并不能在资源管理器中找到这个卷。

如果你在Linux上运行docker，那就可以在如上路径找到此容器卷。

删除容器卷使用如下命令

```
docker volume rm test
test
```

请注意，如果你只需要让多个容器可以挂载同一个文件系统时，你并不需要创建持久卷。看下面的多个应用容器，里面会提到如何解决这个情况。

#### 连接到容器
有时我们需要进入容器运行命令。当我们在启动容器时就打开命令行连接时：

```
docker run -it ubuntu
root@9d5c8c100540:/# ls
bin  boot  dev  etc  home  lib  lib32  lib64  libx32  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
```

这会在容器启动后直接连接到容器的命令行，使用`ctrl+p+q`在保持容器运行的情况下退出命令行。若使用`exit`退出，容器将同时停止。

在已经启动容器的情况下，使用如下命令连接到容器

```
docker attach 容器id
```

有时，你只想让容器执行某条命令而不想进入容器

```
docker exec 容器id 命令
```

如果在使用`exec`时，想对工作路径等做出要求，可以使用`-w`选项，更多运行`docker exec --help`查看

#### 使用启动文件
在启动容器时，可以使用[配置文件](https://docs.docker.com/compose/compose-file/)进行启动，从而省去繁杂的命令行选项。通过配置文件启动，可以同时配置并启动多个容器。

此处先给出一示例：
```yml
version: "3.9"
services:

  redis:
    image: redis:alpine
    ports:
      - "6379"
    networks:
      - frontend
    deploy:
      replicas: 2
      update_config:
        parallelism: 2
        delay: 10s
      restart_policy:
        condition: on-failure

  db:
    image: postgres:9.4
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      - backend
    deploy:
      placement:
        max_replicas_per_node: 1
        constraints:
          - "node.role==manager"

  vote:
    image: dockersamples/examplevotingapp_vote:before
    ports:
      - "5000:80"
    networks:
      - frontend
    depends_on:
      - redis
    deploy:
      replicas: 2
      update_config:
        parallelism: 2
      restart_policy:
        condition: on-failure

  result:
    image: dockersamples/examplevotingapp_result:before
    ports:
      - "5001:80"
    networks:
      - backend
    depends_on:
      - db
    deploy:
      replicas: 1
      update_config:
        parallelism: 2
        delay: 10s
      restart_policy:
        condition: on-failure

  worker:
    image: dockersamples/examplevotingapp_worker
    networks:
      - frontend
      - backend
    deploy:
      mode: replicated
      replicas: 1
      labels: [APP=VOTING]
      restart_policy:
        condition: on-failure
        delay: 10s
        max_attempts: 3
        window: 120s
      placement:
        constraints:
          - "node.role==manager"

  visualizer:
    image: dockersamples/visualizer:stable
    ports:
      - "8080:8080"
    stop_grace_period: 1m30s
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock"
    deploy:
      placement:
        constraints:
          - "node.role==manager"

networks:
  frontend:
  backend:

volumes:
  db-data:
```

这个配置文件用到了一些常用的标签：
```yml
# 执行命令
command: bundle exec thin -p 3000

# 容器名称
container_name: my-web-container

# 依赖depends_on
version: "3.9"
services:
  web:
    build: .
    depends_on: 
      - db
      - redis
  redis:
    image: redis
  db:
    image: postgres

# 模式mode  global(一节点一容器)  replicated
version: "3.9"
services:
  worker:
    image: dockersamples/examplevotingapp_worker
    deploy:
      mode: global  

```


### 多个应用容器
通常，一个容器只把一样事情做好。原因有以下几点：

- 不同的技术层进行分离
- 不同的容器可以分别管理版本
- 自定义的本地化开发环境容器组件
- 一个容器只能在一个进程中运行，而多应用一容器或需要进程管理器

以上解释了为什么我们需要多个容器，下面将举一个例子，说明多容器之间如何进行文件、网络的互通。

#### docker网络环境
创建一个docker网络环境，并给每个容器一个名称，其他同网络的容器将可以通过此名称连接到对应容器。其实现原理大致是`dns`。

```
docker network create todo-app
123d8571d6c9b5aae62d4724318c49188e53e6f6b4eb533f11fa38b44238f0f0
```

返回的是网络id，通常记住`todo-app`这个名称即可

我们可以通过如下命令查看docker网络

```
docker network ls
NETWORK ID     NAME       DRIVER    SCOPE
93287fac1141   bridge     bridge    local
30a4f33bd1e4   host       host      local
c49488f43723   none       null      local
123d8571d6c9   todo-app   bridge    local
```

其中，`host`,`bridge`,`null`是默认的。更多关于如何管理网络的命令，运行`docker network --help`查看

#### docker多容器共享卷
在启动不同容器，通过`-v 容器卷名称:挂载路径`选项挂载卷时，只要卷的名称相同，那么不同容器即可挂载同一个卷。这个卷若无将会自动创建。

#### 新建Mysql容器
通过下述命令，你可以很容易的创建一个mysql服务。注意下述命令在PowerShell中使用，在命令行请考虑更改/去掉换行符<code>`</code>

```PowerShell
docker run -d `
--network todo-app --network-alias mysql `
-v todo-mysql-data:/var/lib/mysql `
-e MYSQL_ROOT_PASSWORD=secret `
-e MYSQL_DATABASE=todos `
mysql:5.7
```

#### 新建ubuntu容器
也可以[使用netshoot容器]()来进行网络测试，但此处我就使用`ubuntu`来测试了。

```
docker run -it --network todo-app --network-alias u ubuntu
```

这样，这个ubuntu容器就运行在与上述mysql同一网络环境中了

首先安装一下基本包及`aptitude`，然后安装`mysql`客户端。

```
apt-get update
apt-get install aptitude
aptitude install mysql-client
```

一切准备完毕后，输入命令及密码`secret`

```
mysql -h mysql -u root -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 4
Server version: 5.7.36 MySQL Community Server (GPL)

Copyright (c) 2000, 2021, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> exit
Bye
```

一切工作良好。

### 常用的镜像
[公用镜像库](https://hub.docker.com/search?type=image)提供了许多官方/第三方的镜像，下面举几个常见的镜像。

#### JAVA
[openjdk](https://hub.docker.com/_/openjdk?tab=tags)

可以直接在`FROM`中，下面提供一个完整`Dockeerfile`示例

```
# syntax=docker/dockerfile:1

FROM openjdk:16-alpine3.13

WORKDIR /app

COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline

COPY src ./src

CMD ["./mvnw", "spring-boot:run"]
```

#### GO
[golang](https://hub.docker.com/_/golang)

```
# syntax=docker/dockerfile:1

FROM golang:1.16-alpine

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY *.go ./

RUN go build -o /docker-gs-ping

EXPOSE 8080

CMD [ "/docker-gs-ping" ]
```

### 关于容器的其他注意事项
#### 配置debian类容器时区
```bash
apt-get install tzdata
tzselect
cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```