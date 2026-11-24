---
title: Linux ffmpeg录制屏幕
summary: 本文记录了在debian kde 使用ffmpeg进行录制的探索。
tags:
  - ffmpeg
  - kde
  - linux
toc: true
date: 2024-02-17T22:20:10+08:00
slug: ffmpeg
---
# Linux ffmpeg录制屏幕
ffmpeg官网

[https://ffmpeg.org/](https://ffmpeg.org/)

ffmpeg录屏官方教程

[http://trac.ffmpeg.org/wiki/Capture/Desktop](http://trac.ffmpeg.org/wiki/Capture/Desktop)

ffmpeg可以使用如下项目的自定义构建

[https://github.com/BtbN/FFmpeg-Builds](https://github.com/BtbN/FFmpeg-Builds)

## ffmpeg使用[x11grab](https://ffmpeg.org/ffmpeg-all.html#x11grab)获取视频

使用xrog的后端，这通常在登陆时可以切换，若使用Wayland后端，将会导致录制黑屏

```bash
#!/bin/bash
xdpyinfo | grep name
echo 选择窗口
select_win=$(xwininfo | grep "Window id:")
select_win_name=$(echo $select_win | grep -oE "\".*\"")
select_win_id=$(echo $select_win | grep -oE "0x[0-9a-z]+")
select_au=$(pactl list short sources | grep hdmi | grep -oE "^[0-9]{0,}")
select_display=$(xdpyinfo | grep name | grep -oE ":[0-9]")
echo $select_win_name $select_win_id $select_au $select_display
sleep

./ffmpeg/bin/ffmpeg \
-framerate 60 \
-probesize 50M \
-thread_queue_size 24 \
-f x11grab -window_id $select_win_id -i $select_display \
-f pulse -ac 2 -i $select_au \
-c:v libx264 \
-filter:v fps=60 -crf 18 -maxrate 10M -bufsize 20M \
-c:a copy \
./$(date '+%Y-%m-%d_%H-%M-%S').mkv
```