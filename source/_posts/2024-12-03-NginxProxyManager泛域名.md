---
title: NginxProxyManager泛域名SSL证书
date: 2024-12-03 15:07:59
author: 石头
top: false
hide: false
cover: true
toc: false
mathjax: false
summary: 用NginxProxyManager生成免费SSL泛域名证书
categories: Nginx
tags:
  - nginx
  - ssl
  - 泛域名
  - 证书
---

使用NginxProxyManager生成免费SSL泛域名证书（例如*.xxx.com格式的SSL证书），则该证书在xxx.com及其所有子域名下（例如:xx.xxx.com）都可以使用。

## 基础环境
- 有公网ip的服务器一台（要求可以使用80、443端口，因为NginxProxyManager要用到）
- 安装NginxProxyManager（我是在服务器环境用docker的方式安装的）
- 域名一枚（我在腾讯云购买了 "anliu.site" 的域名）

## 设置域名和ip地址的解析
在域名解析页面，配置域名和服务器公网ip的映射关系
![](https://alist.anliu.site/d/alist-ali/domain-config-01.png)

## 安装NginxProxyManager

docker compose环境自寻搜索，我的compose的文件如下：

`docker-compose-nginx-proxy-manager.yml`

```yaml
networks:
  nginx-net:
    external: false
    
services:
  nginx-proxy-manager:
    image: 'nas.anliu.space:10000/jc21/nginx-proxy-manager:latest'
    container_name: nginx-proxy-manager
    hostname: nginx-proxy-manager
    restart: unless-stopped
    networks:
      - nginx-net
    ports:
      - '80:80'
      - '81:81'
      - '443:443'
    environment:
      # Mysql/Maria connection parameters:
      DB_MYSQL_HOST: "mariadb"
      DB_MYSQL_PORT: 3306
      DB_MYSQL_USER: "stone"
      DB_MYSQL_PASSWORD: "2090@Database"
      DB_MYSQL_NAME: "npm"
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
    depends_on:
      - mariadb

  mariadb:
    image: 'nas.anliu.space:10000/mariadb:latest'
    container_name: mariadb
    hostname: mariadb
    restart: unless-stopped
    networks:
      - nginx-net
    environment:
      MARIADB_ROOT_PASSWORD: '2090@Database'
      MARIADB_DATABASE: 'npm'
      MARIADB_USER: 'stone'
      MARIADB_PASSWORD: '2090@Database'
      MARIADB_AUTO_UPGRADE: '1'
    volumes:
      - ./mariadb:/var/lib/mysql
    ports:
      - '3306:3306'
```

安装完毕，打开域名解析对应的服务器网址（我的是**https://www.anliu.site** ），界面如下：
![](https://alist.anliu.site/d/alist-ali/nginx-proxy-config-01.png)

## 配置SSL泛域名证书

### 打开配置面板（我的是 **https://www.anliu.site** ）

![](https://alist.anliu.site/d/alist-ali/nginx-proxy-config-02.png)

![](https://alist.anliu.site/d/alist-ali/nginx-proxy-config-03.png)

![](https://alist.anliu.site/d/alist-ali/nginx-proxy-config-04.png)

### 使用泛域名证书

![](https://alist.anliu.site/d/alist-ali/nginx-proxy-config-05.png)

![](https://alist.anliu.site/d/alist-ali/nginx-proxy-config-06.png)

![](https://alist.anliu.site/d/alist-ali/nginx-proxy-config-07.png)

![](https://alist.anliu.site/d/alist-ali/nginx-proxy-config-08.png)

### 在浏览器地址栏查看证书是否有效

![](https://alist.anliu.site/d/alist-ali/nginx-proxy-config-09.png)

至此，你的网址已经可以正常使用免费的SSL证书啦。
