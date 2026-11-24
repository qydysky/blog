---
title: vueElementAdmin配置
summary: 本文记录了vueElementAdmin配置中常见的错误及解决方法。
date: 2021-10-06T14:08:00+08:00
tags:
 - vue-element-admin
 - mock
 - nvm
 - nodejs
toc: true
slug: vueElementAdmin
---
### vue-element-admin配置
vue-element-admin是一款知名的element套件，但根据官网进行安装会导致诸多错误。

经过下述nvm安装nodejs并对git配置代理后，此项目安装成功。

### ~~python的版本问题~~
由于依赖中有`gyp`，而这玩意使用的是`python2`，对于默认安装的`python3`来说，将会导致`npm install`失败。

解决方法：

使用`python2`
```
npm config set python python2.7
```

### nodejs源缓慢问题
通常来说，当官方源缓慢时，可以使用镜像源。

全局设置方法：
```
npm config set registry [源地址]
```

常用的源地址：
- 官方源`https://registry.npmjs.org`
- 淘宝源`https://registry.npm.taobao.org` 或 `https://registry.npmmirror.com`

也可以特指此时使用：
```
npm install --registry=[源地址]
```

也可以加上`--verbose`选项来查看具体进度。

### gyp报错问题
```
npm ERR! gyp info spawn args   '[目录]\\node_modules\\node-gyp\\addon.gypi',npm ERR! gyp info spawn args   '-I'
```

解决方法：

因为node-gyp老版本有bug（据网上说是v5 v6的问题），导致在npm install时报错，运行上述命令会安装8.0.0版本的node-gyp，就可以解决问题。
```
npm install -g node-gyp
```

有时即使安装了最新的，在执行时仍为老版本。原因可能是`nodejs`与`node-scss`及`node-gyp`版本不对应。可使用[NVM for Windows](https://github.com/coreybutler/nvm-windows)进行nodejs版本安装。

### NVM for Windows
官方安装路径：[NVM for Windows](https://github.com/coreybutler/nvm-windows)

注意：nvm安装路径及nodejs安装路径尽量不要使用带空格/中文字符。

注意：需要使用管理员身份命令行，否则有可能会出现乱码错误。

在`settings.txt`配置淘宝源从而加速获取速度：
```
node_mirror: https://npm.taobao.org/mirrors/node/
npm_mirror: https://npm.taobao.org/mirrors/npm/
```

使用命令行进行管理

查看可用版本：
```
PS D:\project\github\PanJiaChen\vue-element-admin> nvm list available

|   CURRENT    |     LTS      |  OLD STABLE  | OLD UNSTABLE |
|--------------|--------------|--------------|--------------|
|   16.10.0    |   14.18.0    |   0.12.18    |   0.11.16    |
|    16.9.1    |   14.17.6    |   0.12.17    |   0.11.15    |
|    16.9.0    |   14.17.5    |   0.12.16    |   0.11.14    |
|    16.8.0    |   14.17.4    |   0.12.15    |   0.11.13    |
|    16.7.0    |   14.17.3    |   0.12.14    |   0.11.12    |
|    16.6.2    |   14.17.2    |   0.12.13    |   0.11.11    |
|    16.6.1    |   14.17.1    |   0.12.12    |   0.11.10    |
|    16.6.0    |   14.17.0    |   0.12.11    |    0.11.9    |
|    16.5.0    |   14.16.1    |   0.12.10    |    0.11.8    |
|    16.4.2    |   14.16.0    |    0.12.9    |    0.11.7    |
|    16.4.1    |   14.15.5    |    0.12.8    |    0.11.6    |
|    16.4.0    |   14.15.4    |    0.12.7    |    0.11.5    |
|    16.3.0    |   14.15.3    |    0.12.6    |    0.11.4    |
|    16.2.0    |   14.15.2    |    0.12.5    |    0.11.3    |
|    16.1.0    |   14.15.1    |    0.12.4    |    0.11.2    |
|    16.0.0    |   14.15.0    |    0.12.3    |    0.11.1    |
|   15.14.0    |   12.22.6    |    0.12.2    |    0.11.0    |
|   15.13.0    |   12.22.5    |    0.12.1    |    0.9.12    |
|   15.12.0    |   12.22.4    |    0.12.0    |    0.9.11    |
|   15.11.0    |   12.22.3    |   0.10.48    |    0.9.10    |

This is a partial list. For a complete list, visit https://nodejs.org/download/releases

PS D:\project\github\PanJiaChen\vue-element-admin> nvm list

  * 14.18.0 (Currently using 64-bit executable)
```

下载/删除nodejs及npm：
```
nvm install 14.18.0
nvm uninstall 14.18.0
```

使用特定版本：
```
nvm use 14.18.0
```

### git报错问题
```
npm ERR! Error while executing:
npm ERR! D:\Git\cmd\git.EXE ls-remote -h -t https://github.com/nhn/raphael.git
npm ERR!
npm ERR! fatal: unable to access 'https://github.com/nhn/raphael.git/': OpenSSL SSL_read: Connection was reset, errno 10054
npm ERR!
npm ERR! exited with error code: 128
```

解决：给git添加http代理。

### vue-element-admin下的complex-table中过滤器问题
此问题同[https://segmentfault.com/q/1010000018135585](https://segmentfault.com/q/1010000018135585)
```
[Vue warn]: Failed to resolve filter: parseTime
```

虽然导入了`parseTime`但是要`{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}`这样使用时，就必须在`filters`里声明。
```
filters: {
  parseTime: parseTime
},
```

### mock相关
由于vue-element-admin使用了mock来模拟数据，所以这方面的相关知识在此总结，以便速查。

[文档](https://github.com/nuysoft/Mock/wiki)

[示例](http://mockjs.com/examples.html#)

```
名称 @first
ip @ip
自增 @increment @increment(1)
```
