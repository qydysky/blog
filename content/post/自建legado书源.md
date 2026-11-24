---
title: 自建legado书源
summary: 本文记录了如何自建legado书源。
tags:
  - pocketbase
  - legado
toc: true
date: 2024-03-13T2:20:10+08:00
slug: legado
---

### 起源

本文简述了如何使用 pocketbase+legado 搭建自己的图片书源。

- 阅读(legado)是安卓上出名的开源阅读软件，主要使用书源配置规则，从各种网站等获取文字、图片等数据，并展示到手机上。：[https://github.com/gedoor/legado](https://github.com/gedoor/legado)

- pocketbase 是一个简单的 go 后台，提供了一个简单的管理界面和 api：[https://github.com/pocketbase/pocketbase](https://github.com/pocketbase/pocketbase)

### pocketbase 配置

pocketbase 建立 1+n 个 Collections，一个命名为 books，存放书本基础信息，n 个为 n 个书籍。

books 字段有`name`书名，`author`作者，`pic`封面，`info`简介，`ref`对应 Collections 的 id，`field`分类

书 Collections 的名称为上述`ref`，字段有`field`多个图片文件，`pn`数字排序，`p`章节名，`info`正文 rich text

权限 list/search、view 都要进行放开。

### 书源

书源的编写规则可见 legado 项目 readme,下面为上述配置对应的书源。

其中，重点要介绍的是正文规则

```
$.field@js:result.split(\"\\n\").sort().map(x=>'<img src=\\\"/api/files/{{$.collectionId}}/{{$.id}}/'+x+'\\\">').join(\"\")

legado在加载超长图片时，滑动会卡顿，解决方案是先切分成多个图(从上到下切分)

$.field：书Collections field字段，因为多个图片文件，所以用\n分割
.sort()：当存在多个图片时，必须保证图片是按顺序拼合
.map(x=>'<img src=\\\"/api/files/{{$.collectionId}}/{{$.id}}/'+x+'\\\">').join(\"\")：转化为多个img,这将会加载多个图片并拼合

如果是想自定义正文，可以将正文规则简单的设为$.info然后就可以通过编写每个记录的info字段实现展示
```

```json
{
  "bookSourceName": "pocketbase",
  "bookSourceType": 2,
  "bookSourceUrl": "http://书源域名/_/",
  "customOrder": 0,
  "enabled": true,
  "enabledCookieJar": false,
  "enabledExplore": false,
  "exploreUrl": "",
  "lastUpdateTime": 1710170295968,
  "respondTime": 180000,
  "ruleBookInfo": {
    "author": "$.author",
    "coverUrl": "/api/files/{$.collectionId}/{$.id}/{$.pic}",
    "downloadUrls": "",
    "intro": "$.info",
    "kind": "$.field",
    "name": "$.name",
    "tocUrl": "/api/collections/{$.ref}/records?sort=pn&perPage=10000"
  },
  "ruleContent": {
    "content": "$.field@js:result.split(\"\\n\").sort().map(x=>'<img src=\\\"/api/files/{{$.collectionId}}/{{$.id}}/'+x+'\\\">').join(\"\")",
    "imageStyle": "FULL",
    "nextContentUrl": "",
    "sourceRegex": "",
    "title": "$.p",
    "webJs": ""
  },
  "ruleExplore": {
    "author": "",
    "bookList": "",
    "bookUrl": "",
    "coverUrl": "",
    "intro": "",
    "kind": "",
    "name": ""
  },
  "ruleReview": {},
  "ruleSearch": {
    "author": "$.author",
    "bookList": "$.items",
    "bookUrl": "/api/collections/books/records/{$.id}",
    "coverUrl": "/api/files/{$.collectionId}/{$.id}/{$.pic}",
    "intro": "$.info",
    "kind": "$.field",
    "name": "$.name"
  },
  "ruleToc": {
    "chapterList": "$.items",
    "chapterName": "$.p",
    "chapterUrl": "/api/collections/{$.collectionId}/records/{$.id}"
  },
  "searchUrl": "/api/collections/books/records?filter=(name='{{key}}')",
  "weight": 0,
  "loginUrl": ""
}
```
