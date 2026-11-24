---
title: golang笔记
summary: 本文记录了一些使用golang的常见问题。
date: 2021-04-25 14:05:29
tags:
 - golang
toc: true
slug: golang
---
### 简介
[golang](https://golang.org/)是一款开源的编程语言，可以让你编写出快速，简单，高效的程序。在中国大陆，可以访问这个[官网](https://golang.google.cn/)。本文记录了一些使用golang中的常见问题。

### select与chan的优先问题
[select](https://tour.golang.org/concurrency/5)会阻塞直到有一个[chan](https://tour.golang.org/concurrency/2)满足了条件，而其他将会被忽略。

关于select的优先级，同级时随机，优先级从高到低有：

- 从打开、有元素的channel中取出元素
- 向打开、缓冲未满的channel中放入元素
- 从关闭的channel中取出元素
- default默认

注意，以下会panic：

- 向关闭的channel中放入元素

注意，以下会阻塞：

- 从打开、无元素的channel中取出元素
- 向打开、缓冲满的channel中放入元素
- 取出尚未分配内存的channel
- 放入尚未分配内存的channel


验证可以到[在线运行](https://play.golang.org/)尝试。

应用：[信号](https://github.com/qydysky/part/tree/master/signal)
