---
title: Visual Studio吐槽及配置
summary: Visual Studio简称VS，被誉为IDE中的天下第一。最近由于有开发UWP的需求，亲自体验了一番。
tags:
  - vs
toc: true
date: 2021-09-04 00:00:00
slug: vs
---
### Visual Studio吐槽及配置
[Visual Studio](https://visualstudio.microsoft.com/)是一款相当老牌的IDE了，背靠微软，技术累计雄厚。最近开发UWP，那必然首选的就是VS了。

### 吐槽
VS给我最开始的感觉就是它需要一本像oracle database的说明书。它不是可以开箱即用的。有许多的机能相比起其他的IDE，比如IDEA，很不完善。这让我在使用它之后总想着吐槽一下。这里列出痛点。

#### 错误列表不能单独选中/复制错误信息
这个问题我还专门去找了，在[这个页面](https://developercommunity.visualstudio.com/t/copying-a-specific-cell-for-an-error-in-the-error/424849)中可以看到。这个需求早在2019年1月就提出，别的IDE时至今天早已支持，唯独VS还是使用列表来进行展示，而且不能只复制错误信息，附带还要复制一堆无用字符，而且错误定位也不总是准确。

#### 莫名奇妙的警告
```
PRI257: 0xdef00522 - Resources found for language(s) 'en-us' but no resources found for default language(s): 'en-us'. Change the default language or qualify resources with the default language. http://go.microsoft.com/fwlink/?LinkId=231899
```
谁能告诉我这两个字符串有什么不同之处么？

#### 难以使用的查找功能
VS的查找结果就像上述的错误列表一样，不能复制，更甚之，还不能点击跳转到文件的对应行。难道在大项目的时候，全局搜索后都要手动对照一层层打开目录，找到那一行么？这简直落后别的IDE一百年！更别说有时根本搜不出结果。

*未完待续*

### 配置
这节讲一些可以降低血压的插件。明明插件都开发出来了，别的IDE十年前都支持的功能却还是没得到官方的支持。

* [ErrorHelper](https://marketplace.visualstudio.com/items?itemName=MattLaceyLtd.ErrorHelper) 这让你可以仅复制错误信息

*未完待续*