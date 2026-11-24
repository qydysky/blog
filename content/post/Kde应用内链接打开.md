---
title: Kde应用内链接打开
summary: 最近我的debian从10更新到了11,对应的kde也进行了更新。但后来发生了应用内打开链接表现为kioexec下载该链接之后再浏览器打开本地页面，与之前直接调用浏览器打开链接不同。本文记录了这个情况解决的详情。
date: 2021-04-21 19:34:12
tags:
 - kde
 - url
 - kioexec
toc: true
slug: kde
---
### 简介
最近我的debian从10更新到了11,对应的kde也进行了更新。但后来发生了应用内打开链接表现为kioexec下载该链接之后再浏览器打开本地页面，与之前直接调用浏览器打开链接不同。本文记录了这个情况解决的详情。

这个问题相关的提问在网上：[kde open link kioexec copy](https://www.google.com/search?q=kde+open+link+kioexec+copy)

### 情况复现
本文使用firefox进行测试。由于firefox默认下载压缩包，而后直接运行目录下的`firefox`启动。

在`设置`-`应用程序`-`默认程序`-`网页浏览器`中选择其他，选择上述文件，确定并应用。

然后在应用内打开，此处使用命令行。在命令行中输入`echo 'https://baidu.com'`回车后，将显示该网址。如果你使用的是`Konsole`时，你可以使用`ctrl+左键`打开此链接。

此时会弹出通知，显示kioexec正在拷贝此网页到`~/.cache/kioexec/...`中，当它拷贝完成后，将会调用firefox打开本文件。此时浏览器显示地址为`file://`开头的文件。

### 详细分析
找到设置默认程序的配置文件目录`/home/qydysky/.local/share/applications`，此处用户名为`qydysky`。找到对应的`desltop`文件。

```desktop
[Desktop Entry]
Exec=/home/qydysky/程序/filefox/firefox/firefox
MimeType=x-scheme-handler/http;
Name=firefox
NoDisplay=true
Type=Application
```

### 问题解决
后来发现，当设置为`chrome`时，可以顺利的调用打开。于是，改变思路，在kde程序列表中添加firefox。

**注意：如果如何怎么更改都无法起效，考虑重启kde，即重启电脑**

在应用列表中空白处右键，编辑应用列表，这将打开kde菜单编辑器`kmenuedit`。

查看`网络`中chrome中的配置，将看到`命令`项为`/usr/bin/google-chrome-stable %U`。

在里面的`网络`中添加firefox。模仿chrome，将命令设置为`/home/qydysky/程序/filefox/firefox/firefox %U`，然后即可在上述选择默认程序时找到firefox。应用后发现有效，之后应用内打开链接将直接调用firefox。

### 差异分析
再次在`/home/qydysky/.local/share/applications`中查看配置文件。可以发现，新的配置文件如下：

```desktop
[Desktop Entry]
Comment=访问互联网
Exec=/home/qydysky/程序/filefox/firefox/firefox %U
GenericName=网页浏览器
Icon=/home/qydysky/程序/filefox/firefox/browser/chrome/icons/default/default128.png
Name=Firfox
NoDisplay=false
Path[$e]=
StartupNotify=true
Terminal=0
TerminalOptions=
Type=Application
X-KDE-SubstituteUID=false
X-KDE-Username=
```

由此，即可得到结论，当命令后没有`%U`时，将调用`kioexec`。通过更改详细分析一节中的配置文件，并启用它后，发现结论得到验证。

### 更多文件关联
在设置默认程序时，可以看到`x-scheme-handler/https`的字样。这在`文件关联`中可以找到，如果找不到，则可以添加。添加组编辑为`x-scheme-handler`，类型名为`https`。然后即可找到程序优先顺序。