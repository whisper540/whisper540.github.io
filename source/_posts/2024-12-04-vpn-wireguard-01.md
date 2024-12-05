---
title: 从0开始搭建一个wireguard环境
date: 2024-12-04 14:19:48
author: 石头
top: false
hide: false
cover: false
toc: false
mathjax: false
summary: 从0开始搭建一个wireguard环境
categories: Vpn
tags:
  - docker
  - wireguard
  - vpn
---

本篇文章根据一个具体的案例，介绍如何从0开始搭建一个wireguard服务端环境（例如：SERVER01），并配置两台客户端(PCA、PCB)异地互联（在整个互联网内实现一个大局域网）：

### 基本概念
**vpn**：虚拟专用通道；

**wireguard**：linux内置的一个vpn工具；

**网卡**(有线/无线)：客户端/服务器用来连接网络的硬件设备；

**虚拟网卡**：由软件模拟出来的网卡，功能和网卡类似（也能实现上网功能），一台电脑可以虚拟出来多张虚拟网卡；

**ip地址**：

- 私有ipv4地址：
  - A类地址: 10.0.0.0 - 10.255.255.255，子网掩码:10.0.0.0/8，数量:1677 万个
  - B类地址: 172.16.0.0 - 172.31.255.255，子网掩码:255.240.0.0/12，数量:104 万个
  - C类地址: 192.168.0.0 - 192.168.255.255，子网掩码:255.255.0.0/16，数量:65536个
- 私有ipv6地址：
  - fc00::/7类: fc00:: 到 fdff:ffff:ffff:ffff:ffff:ffff:ffff:ffff
  - fe80::/64类:这是链路本地地址范围，仅用于同一链路上的设备之间的通信。
- 公网ip地址：一台可以访问互联网的设备，并且具有非私有网段的ip地址

### 达成目标
1. PCA和PCB可以通讯，并且可以访问互联网
2. PCA依然可以访问局域网内设备(例如：PC01、phone01等)

### 拓扑图
真实网络拓扑图：
![](https://alist.anliu.site/d/alist-ali/wireguard-install-01.png)

wireguard环境拓扑图(大局域网)：
![](https://alist.anliu.site/d/alist-ali/wireguard-install-02.png)

SERVER01：
- 可访问互联网，并有公网ip
- 安装了wireguard服务端环境，并配置了大局域网的网段为：172.16.0.x (相当于子网掩码/24)
- 分配给PCA的虚拟网卡的地址（二维码/配置文件）为：172.16.0.2
- 分配给PCA的虚拟网卡的地址（二维码/配置文件）为：172.16.0.3

PCA（Mac系统）：
- 可以访问互联网即可(无需公网ip)
- 路由器分配了局域网ip地址(例如：192.168.0.22)
- 安装wireguard客户端

PCB（Win系统）：
- 可以访问互联网即可(无需公网ip)
- 路由器分配了局域网ip地址(例如：192.168.0.22)
- 安装wireguard客户端

### 环境搭建

### 服务端配置

easy-wireguard-docker-compose.yml

```yaml
version: "3.8"

networks:
  wg-easy-net:
    external: false

services:
  wg-easy:
    environment:
      - LANG=chs
      - WG_HOST=127.0.0.1
      # 下面密码是：foobar123
      - PASSWORD_HASH=$$2y$$10$$hBCoykrB95WSzuV4fafBzOHWKu9sbyVa34GJr8VV5R/pIelfEMYyG
      - PORT=51821
      - WG_PORT=51820
      - WG_DEFAULT_ADDRESS=172.16.0.x
      - WG_DEFAULT_DNS=8.8.8.8, 8.8.4.4
      - WG_ALLOWED_IPS=0.0.0.0/0, ::/0
      - WG_PERSISTENT_KEEPALIVE=30
    image: nas.anliu.space:10000/wg-easy/wg-easy:latest
    container_name: wg-easy
    volumes:
      - ./data:/etc/wireguard
    ports:
      - "51820:51820/udp"
      - "51821:51821/tcp"
    restart: unless-stopped
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
    sysctls:
      - net.ipv4.ip_forward=1
      - net.ipv4.conf.all.src_valid_mark=1
    networks:
      - wg-easy-net

```

首先安装docker和docker-compose环境，然后执行命令：

`docker-compose -f easy-wireguard-docker-compose.yml up -d`



### 客户端配置

#### 1. 在浏览器打开ip:51821( 例如：x.x.x.x:51821 )地址，如下：

![](https://alist.anliu.site/d/alist-ali/wireguard-install-03.png)

#### 2. 新建并下载配置文件（PCA.conf、PCB.conf）

![](https://alist.anliu.site/d/alist-ali/wireguard-install-04.png)

![](https://alist.anliu.site/d/alist-ali/wireguard-install-05.png)

配置信息一般如下(把ip替换成自己的服务器公网ip)：

`PCA.conf`

```bash
[Interface]
PrivateKey = SLRWKG1qHsu4WZURw3mNsa5D7Q40fsiaGpCwmBF5M38=
Address = 172.16.0.2/24
DNS = 8.8.8.8, 8.8.4.4

[Peer]
PublicKey = waOr+X1HT5LnLJd4wo1xEr2scN0oyhNNQWqGv2zO2TE=
PresharedKey = 9P/aw4uBZysfAylToAd59QKm599ob5twZQOpjRCROQQ=
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 30
Endpoint = 100.12.2.1:51820
```

`PCB.conf`

```bash
[Interface]
PrivateKey = mOf7+7qHQZXt9AqhS8oykC81tgtGMTPhpN4HJ7MJaGU=
Address = 172.16.0.3/24
DNS = 8.8.8.8, 8.8.4.4

[Peer]
PublicKey = waOr+X1HT5LnLJd4wo1xEr2scN0oyhNNQWqGv2zO2TE=
PresharedKey = MBgIcMJZ8WpeFvN3FR3t5VeqDQZdbNJZMIrHgja7zlY=
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 30
Endpoint = 100.12.2.1:51820
```



#### 3. 到[wireguard官网](https://www.wireguard.com/install/ "wireguard官网")下载并安装wireguard客户端

打开界面如下

![](https://alist.anliu.site/d/alist-ali/wireguard-install-06.png)

在PCA客户端导入`PCA.conf`，点击连接，此时PCA电脑会由wireguard创建一个虚拟网卡，并且所有的网络访问请求都会走这张虚拟网卡。

![](https://alist.anliu.site/d/alist-ali/wireguard-install-07.png)



在PCB客户端导入`PCB.conf`，点击连接，此时PCB电脑会由wireguard创建一个虚拟网卡，并且所有的网络访问请求都会走这张虚拟网卡。

![](https://alist.anliu.site/d/alist-ali/wireguard-install-08.png)

#### 4. 额外配置

   此时产生一个问题，访问的网络受SERVER01可访问的网络限制，SERVER01无法访问的，PCA和PCB也无法访问。
   解释下：PCA的所有网络请求都会走wireguard的虚拟网卡，即所有的请求都会经过`SERVER01`绕一次，由于`SERVER01`存在于公网上，那么PCA就会无法访问本地局域网的ip地址，例如PCA无法访问本地的192.0.0.x系列的设备，怎么解决这个问题呢？

   解决办法：

   手动配置本地网络访问规则，让所有192.168.0.x的网站都走本地网卡，其他的地址则走wireguard的虚拟网卡。

   这里举例，例如PCA为MAC苹果电脑，执行以下脚本命令行：

   `addLocalRouter.sh`（可以直接写入一个脚本文件中）

   ```bash
   #!/bin/bash
   route add -net 192.0.0.0 -netmask 255.0.0.0 192.168.0.1
   ```

   删除脚本如下：

   `deleteLocalRouter.sh`（可以直接写入一个脚本文件中）

   ```bash
   #!/bin/bash
   route delete -net 192.0.0.0 -netmask 255.0.0.0 192.168.0.1
   ```
至此，你已经成功构建了一个公网范围内的“大局域网”，可以测试下：
- PCA客户端去ping PCB客户端
- PCB客户端去ping PCA客户端
- PCA和PCB去ping SERVER01
  

