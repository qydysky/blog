---
title: hexo安装、配置及博客生成全流程
summary: hexo是一个静态的博客生成程序，拥有许多优秀的主题及插件，支持Markdown，方便快速搭建博客。本文简单描述了hexo的安装，配置，生成。
tags:
  - hexo
toc: true
date: 2021-03-31 00:00:00
slug: hexo
---
### 简介
[hexo](https://hexo.io/)是一个静态的博客生成程序，拥有许多优秀的主题及插件，支持Markdown，方便快速搭建博客。

### npm镜像准备
由于网络连接问题，**或许**需要设置镜像源。

```bash
#设置淘宝镜像
npm config set registry https://registry.npm.taobao.org
#取消
npm config delete registry
```

### 安装hexo
安装hexo前需要准备以下程序。

- [Node.js](https://nodejs.org/) (Node.js 版本需不低于 10.13，建议使用 Node.js 12.0 及以上版本)
- [Git](http://git-scm.com/)

安装完毕后，新建一目录，并安装hexo。

```bash
mkdir hexo
cd hexo
npm install hexo
```

若无意外，hexo应当已经安装到了此目录。

```bash
npx hexo help
Usage: hexo <command>

Commands:
  help     Get help on a command.
  init     Create a new Hexo folder.
  version  Display version information.

Global Options:
  --config  Specify config file instead of using _config.yml
  --cwd     Specify the CWD
  --debug   Display all verbose messages in the terminal
  --draft   Display draft posts
  --safe    Disable all plugins and scripts
  --silent  Hide output on console

For more help, you can use 'hexo help [command]' for the detailed information
or you can check the docs: http://hexo.io/docs/
```

### 生成及配置网页目录
在安装完hexo之后，生成网页目录，此目录即为你维护博客的工作目录。此处以page目录为示例。

```bash
npx hexo init page
cd page
npm install
```

下面对该网站进行配置。

```bash
nano _config.yml
```

以下对此配置文件中较为重要的几项进行设置。

```yml
# Site
title: qydysky's blog #网站标题
subtitle: ''
description: qydysky's blog #网站描述
keywords: qydysky blog #网站关键词
author: qydysky #作者
language: zh-CN #语言
timezone: ''

# URL
url: https://blog.ntsdtt.bid #网站的网址
```

### 安装及配置主题
浏览器打开[hexo.io/themes](https://hexo.io/themes/)挑选一款喜欢的主题。此处以本博客主题进行示例。

点击主题名称进入主题[Maupassant](https://github.com/tufu9441/maupassant-hexo)

按照README.md中的描述，安装。

```bash
git clone https://github.com/tufu9441/maupassant-hexo.git themes/maupassant
npm install hexo-renderer-pug --save
npm install hexo-renderer-sass --save
```

或许会出现错误与警告，但可以无视它。进行配置。

```bash
nano themes/maupassant/_config.yml
```

对需要的内容进行增删改。此处为我的改动`git diff`。

```diff
diff --git a/_config.yml b/_config.yml
index 5ebde37..7ab7438 100644
--- a/_config.yml
+++ b/_config.yml
@@ -100,25 +100,25 @@ menu:
   - page: about
     directory: about/
     icon: fa-user
-  - page: rss
-    directory: atom.xml
-    icon: fa-rss
+  # - page: rss
+  #   directory: atom.xml
+  #   icon: fa-rss
 
 widgets: ## Six widgets in sidebar provided: search, category, tag, recent_posts, recent_comments and links.
   - search
-  - category
+  # - category
   - tag
   - recent_posts
-  - recent_comments
-  - links
+  # - recent_comments
+  # - links
 
 links:
-  - title: site-name1
-    url: http://www.example1.com/
-  - title: site-name2
-    url: http://www.example2.com/
-  - title: site-name3
-    url: http://www.example3.com/
+  - title: github
+    url: https://github.com/qydysky
+  # - title: site-name2
+  #   url: http://www.example2.com/
+  # - title: site-name3
+  #   url: http://www.example3.com/
 
 timeline:
   - num: 1
```

应用主题。

```bash
nano _config.yml
```

修改为主题名。

```yml
# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
theme: maupassant
```

### 创建博文
在`source/_posts/`中创建md文档。

```markdown
---
title: hexo安装、配置及博客生成全流程
description: 这将显示在首页
date: 2021-03-31 16:19:21
updated: 2021-03-31 20:25:21
tags:
- hexo
---
write something
```

### maupassant标签页
本节内容引用[maupassant主题创建Tags页面](https://wiki.hushhw.cn/posts/5e14d0e.html)

在`source`目录下创建`tags`目录，在`tags`目录下创建`index.md`，写入以下内容。

```markdown
---
layout: tagcloud
title: 标签
date: 2021-03-31 00:43:22
type: tags
---
```

在`themes/maupassant/_config.yml`中`menu`项添加`page`，效果如下。

```yml
menu:
  - page: tags
    directory: tags/
    icon: fa-tag
```
### 评论的实现
maupassant可以使用许多评论项目从而实现评论功能，此处使用[valine](https://valine.js.org/)实现。

> Valine - 一款快速、简洁且高效的无后端评论系统。

根据[快速开始](https://valine.js.org/quickstart.html)，注册帐号，需要邮箱验证，手机验证，实名认证。并得到`App ID`和`App Key`。

修改`themes/maupassant/_config.yml`的`App ID`和`App Key`。

```yml
valine: ## See: https://valine.js.org
  enable: true ## If you want to use Valine comment system, please set the value to true.
  appid: ## Your LeanCloud application App ID, e.g. pRBBL2JR4N7kLEGojrF0MsSs-gzGzoHsz
  appkey: ## Your LeanCloud application App Key, e.g. tjczHpDfhjYDSYddzymYK1JJ
  notify: false ## Mail notifier, see https://github.com/xCss/Valine/wiki/Valine-评论系统中的邮件提醒设置
  verify: false ## Validation code.
  placeholder: 说些什么 ## Comment box placeholders.
  avatar: "mm" ## Gravatar type, see https://github.com/xCss/Valine/wiki/avatar-setting-for-valine
  pageSize: 10 ## Number of comments per page.
  guest_info: nick,mail,link ## Attributes of reviewers.
```

在想要启用/禁用评论的页面对应的md头中添加，例如：禁用标签页的评论。

```markdown
---
layout: tagcloud
title: 标签
date: 2021-03-31
type: tags
comments: false
---
```

### 页面的链接优化
#### 使用hexo-abbrlink插件
引用自[博客文章链接优化](https://wiki.hushhw.cn/posts/28187ef7.html#%E6%89%93%E9%80%A0%E4%B8%AA%E6%80%A7%E8%B6%85%E8%B5%9E%E5%8D%9A%E5%AE%A2%E8%B6%85%E6%B7%B1%E5%BA%A6%E4%BC%98%E5%8C%96)。

在网页目录安装hexo-abbrlink。

```bash
npm install hexo-abbrlink --save
```

然后修改`_config.yml`，改变`permalink：`，添加`abbrlink配置`。

```yml
# URL
## Set your site url here. For example, if you use GitHub Page, set url as 'https://username.github.io/project'
url: https://blog.ntsdtt.bid #网站的网址
permalink: :year/:abbrlink.html
permalink_defaults:
pretty_urls:
  trailing_index: true # Set to false to remove trailing 'index.html' from permalinks
  trailing_html: true # Set to false to remove trailing '.html' from permalinks

#abbrlink配置
abbrlink:
  alg: crc32  # 算法：crc16(default) and crc32
  rep: hex    # 进制：dec(default) and hex
```

#### 使用:hash
hexo自带的hash计算。

```yml
# URL
## Set your site url here. For example, if you use GitHub Page, set url as 'https://username.github.io/project'
url: https://blog.ntsdtt.bid #网站的网址
permalink: :year/:hash.html
permalink_defaults:
pretty_urls:
  trailing_index: true # Set to false to remove trailing 'index.html' from permalinks
  trailing_html: true # Set to false to remove trailing '.html' from permalinks
```


### 添加阅读时长、字数统计
首先在网站工作目录安装`hexo-wordcount`。

```bash
npm install hexo-wordcount
```

再将`themes/maupassant/_config.yml`中`wordcount`改为`true`。

### hexo加速
本节引用[加速 Hexo 博客](https://io-oi.me/tech/speed-up-hexo/)。加速的方法非常多，此处介绍`hexo-filter-optimize`。

> A hexo plugin that optimize the pages loading speed.

根据[README.md](https://github.com/theme-next/hexo-filter-optimize),先安装。

```bash
npm install hexo-filter-optimize
```

再在`_config.yml`中添加即可

```yml
filter_optimize:
  enable: true
  # remove the surrounding comments in each of the bundled files
  remove_comments: false
  css:
    # minify all css files
    minify: true
    # bundle loaded css files into one
    bundle: true
    # use a script block to load css elements dynamically
    delivery: true
    # make specific css content inline into the html page
    #   - only support the full path
    #   - default is ['css/main.css']
    inlines:
    excludes:
  js:
    # minify all js files
    minify: true
    # bundle loaded js files into one
    bundle: true
    excludes:
  # set the priority of this plugin,
  # lower means it will be executed first, default of Hexo is 10
  priority: 12
```

### 生成
生成静态文件

```bash
npx hexo generate
```

产物位于`public`中