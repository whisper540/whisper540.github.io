---
title: 基于alist图床写博客
date: 2024-12-02 16:46:11
author: 石头
top: false
hide: false
cover: true
toc: false
mathjax: false
summary: 用阿里云盘当图床，写一篇markdown格式博客。
categories: Blog
tags:
  - 博客
  - 技术
  - hexo
  - picgo
  - typora
  - alist
---


如何在github pages上写博客？本篇介绍如何使用阿里云盘作为图床，写一篇markdown格式的博客，并实现引入本地图片自动上传到阿里云盘，并把md中图片路径自动调整为上传阿里云盘后的url地址。


##  相关技术介绍
[github pages](https://docs.github.com/zh/pages "github pages")：存放在github上的文件可以直接配置github page成为静态文件服务器，可以直接通过域名访问。

[hexo](https://hexo.io/ "hexo官网")：一个基于nodejs的生成静态页面的框架，支持各种主题，支持markdown格式的文件，编辑完可以一键发布成github pages。

[alist](https://hexo.io/ "alist 官网")：当下一个流行的网盘管理方案，支持接入各种主流网盘和webdav，本篇举例的是阿里云盘。

[picgo](https://picgo.github.io/PicGo-Doc/ "picgo 官网")：一个图床（永久存放图片的服务器，可以通过url地址访问图片）管理工具，有mac端linux和windows客户端，可以把图片文件直接上传到alist（本篇使用阿里云盘作为存放图片的位置）

[typora](https://typora.io/ "typora 官网")：一个markdown编辑器，之所以使用typora，是因为typora可以直接调用pico，把本地的图片直接上传到alist并插入上传成功后的图片链接。

本博客地址内的所有文章均采用此方案编写。

##  hexo 安装配置
官网：[hexo](https://hexo.io/ "hexo官网")
hexo安装参照官方文档即可，本人博客主题为matery，其它不做过多介绍。

## alist 安装配置
官网：[alist](https://hexo.io/ "alist 官网")
alist安装参照官方文档即可，推荐使用docker方式安装，本人在nas上搭建了alist，所以选用docker方式安装。

**!注意：安装的时候要记录下自己安装的alist版本（是2还是3），后面配置picgo的时候要用到**

安装完毕后，参照官方文档接入[阿里云盘](https://alist.nn.ci/zh/guide/drivers/aliyundrive_open.html)。

## pico 安装配置
官网：[picgo](https://picgo.github.io/PicGo-Doc/ "picgo 官网")
pico的安装参照官方文档，刚安装好的picgo并不是原生支持alist，需要安装第三方插件：[picgo-plugin-alist]()
刚安装好的picgo界面如下：
![](https://alist.anliu.site/d/alist-ali/pico-install-01.png)

### 1. 安装picgo-plugin-alist插件：
[官方插件列表](https://github.com/PicGo/Awesome-PicGo)中查找[picgo-plugin-alist](https://github.com/PicGo/Awesome-PicGo)插件，插件安装分为在线和离线安装

#### 方式一、在线安装
![](https://alist.anliu.site/d/alist-ali/pico-install-02.png)

#### 方式二、离线安装
找到pico在机器上安装后的插件目录：

- Windows: %APPDATA%\picgo\

- Linux: $XDG_CONFIG_HOME/picgo/ or ~/.config/picgo/

- macOS: ~/Library/Application\ Support/picgo/

在该目录打开命令行，然后执行命令：
`npm install picgo-plugin-alist`
成功安装后，显示如下：
![](https://alist.anliu.site/d/alist-ali/pico-install-03.png)

### 2. 配置 **picgo-plugin-alist** 插件

![](https://alist.anliu.site/d/alist-ali/pico-install-04.png)
![](https://alist.anliu.site/d/alist-ali/pico-install-05.png)
![](https://alist.anliu.site/d/alist-ali/pico-install-06.png)

### 3. 获取alist的管理员token

在alist页面点击管理-设置-其它，![](https://alist.anliu.site/d/alist-ali/alist-install-01.png)
![](https://alist.anliu.site/d/alist-ali/alist-install-02.png)



## typora 安装配置

官网：[typora](https://typora.io/ "typora 官网")

双击安装typora，安装完毕后，进入设置页面

![](https://alist.anliu.site/d/alist-ali/typora-install-01.png)



此时在markdown中插入本地图片就会自动调用picgo上传到alist中，上传成功后动态修改插入图片的地址为alist中上传图片的地址：

![](https://alist.anliu.site/d/alist-ali/typora-install-02.png)

![](https://alist.anliu.site/d/alist-ali/typora-install-03.png)

至此你可以拥有一个属于自己的阿里云盘的图床。