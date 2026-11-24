---
title: Debian音量控制
summary: 作为Debian的长期笔记本用户，在入坑时踩过的坑之一便是音量控制。在使用扬声器与耳机时，总会遇到一个声音过大的问题。本文描述如何解决这个问题
tags:
  - amixer
toc: true
date: 2021-04-02 00:00:00
slug: debain
---
### 简介
作为Debian的长期笔记本用户，在入坑时踩过的坑之一便是音量控制。在使用扬声器与耳机时，总会遇到一个声音过大的问题。而这在windows平台几乎不会碰到。本文描述当时的我是如何解决这个问题。

本文部分引用了资料[pulseaudio, analog-output.conf.common, volume-limit](https://bbs.archlinux.org/viewtopic.php?id=225312)

### amixer
amixer命令主要用于linux下音频的接口配置，下面展示这个程序的帮助文档。

```bash
amixer -h
```

```bash
Usage: amixer <options> [command]

Available options:
  -h,--help       this help
  -c,--card N     select the card
  -D,--device N   select the device, default 'default'
  -d,--debug      debug mode
  -n,--nocheck    do not perform range checking
  -v,--version    print version of this program
  -q,--quiet      be quiet
  -i,--inactive   show also inactive controls
  -a,--abstract L select abstraction level (none or basic)
  -s,--stdin      Read and execute commands from stdin sequentially
  -R,--raw-volume Use the raw value (default)
  -M,--mapped-volume Use the mapped volume

Available commands:
  scontrols       show all mixer simple controls
  scontents       show contents of all mixer simple controls (default command)
  sset sID P      set contents for one mixer simple control
  sget sID        get contents for one mixer simple control
  controls        show all controls for given card
  contents        show contents of all controls for given card
  cset cID P      set control contents for one control
  cget cID        get control contents for one control
```

### 查看默认声卡的配置。
通过amixer命令，可以查看默认声卡设置。使用如下命令。

```bash
amixer -c 0
```

输出非常详细，此处我截取了需要的一部分。

```bash
Simple mixer control 'Master',0
  Capabilities: pvolume pvolume-joined pswitch pswitch-joined
  Playback channels: Mono
  Limits: Playback 0 - 87
  Mono: Playback 33 [38%] [-40.50dB] [on]
Simple mixer control 'Headphone',0
  Capabilities: pvolume pswitch
  Playback channels: Front Left - Front Right
  Limits: Playback 0 - 87
  Mono:
  Front Left: Playback 0 [0%] [-65.25dB] [off]
  Front Right: Playback 0 [0%] [-65.25dB] [off]
  ...
```

从输出可以看出音量等级从0-87,当前主音量在33。

### 设置音量限制
通过改变配置文件，可以起到设置音量限制的效果。先查看有哪些配置文件。

```bash
ls /usr/share/pulseaudio/alsa-mixer/paths
analog-input-aux.conf            analog-input-headset-mic.conf          analog-input-rear-mic.conf       analog-output-lineout.conf         hdmi-output-3.conf         steelseries-arctis-input.conf
analog-input.conf                analog-input-internal-mic-always.conf  analog-input-tvtuner.conf        analog-output-mono.conf            hdmi-output-4.conf         steelseries-arctis-output-mono.conf
analog-input.conf.common         analog-input-internal-mic.conf         analog-input-video.conf          analog-output-speaker-always.conf  hdmi-output-5.conf         steelseries-arctis-output-stereo.conf
analog-input-dock-mic.conf       analog-input-linein.conf               analog-output.conf               analog-output-speaker.conf         hdmi-output-6.conf
analog-input-fm.conf             analog-input-mic.conf                  analog-output.conf.common        hdmi-output-0.conf                 hdmi-output-7.conf
analog-input-front-mic.conf      analog-input-mic.conf.common           analog-output-headphones-2.conf  hdmi-output-1.conf                 iec958-stereo-input.conf
analog-input-headphone-mic.conf  analog-input-mic-line.conf             analog-output-headphones.conf    hdmi-output-2.conf                 iec958-stereo-output.conf
```

或许你的配置文件不在此处，可以使用`find /usr -name alsa-mixer`查找文件所在。

这个目录下有许多配置文件，但我们为了解决耳机音量过大的问题，修改对应的配置文件`analog-output-headphones.conf`。修改其中一项`[Element Master]`的键值。

```conf
[Element Master]
switch = mute
volume = merge
volume-limit = 35 #添加此行
override-map.1 = all
override-map.2 = all-left,all-right
```

注意不要添加到其他项下，比如`[Element Headphone]`。否则在大音量下会破音。

同理，若你想修改其他设备的限制，可以修改对应的配置文件。如扬声器，则可以编辑`analog-output-speaker.conf`。

### 应用配置
上述配置文件在修改保存后并不会自动应用，需要进行手动重启进程。重启后可以测试音量效果，重复调整，应用，直到满意。

```bash
pulseaudio -k
```

**该配置文件会在`pulseaudio`更新后失效。所以更新后还需要重复进行此操作。**

### 浏览器播放视频时音量过小的问题
有时在看视频/看直播时，有时觉得音量过小。平时用的是火狐，有这样一个可以调整音量增益的插件。[soundfixer](https://github.com/unrelentingtech/soundfixer)。