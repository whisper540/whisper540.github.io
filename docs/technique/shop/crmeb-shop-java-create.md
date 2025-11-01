---
sticky: 1
top: 1
recommend: 1
date: 2025-11-01
title: crmeb商城java版完整docker方式搭建
description: 记录下crmeb商城的java版本完整搭建过程
cover: false
author: 石头
readingTime: true
tags:
    - 技术
    - 商城
---



# 开源crmeb商城java版完整docker方式搭建

记录下crmeb商城(1.4版)的java版本搭建过程，网上没找到完整的搭建方式，自己写个blog记录下。

我是有自己公网ip的，免去了单独购买一台云服务器，但是由于运营商关闭了公网ip的80/443端口，导致配置后台服务接口的时候总是要携带端口号（例如https://nas.anliu.online:20410）,如果你觉得不舒服也可以单独购买一台低配的服务器用nginx代理的方式来实现去除端口号（本教程采用方式）。

此处说明下，我是把商城的后端服务搭建到了自己的nas电脑上，采用docker的方式部署，主要是为了后期维护的方便。

![](https://bucket.anliu.online/shop/1761967966053.png) 

## 1. 源码准备

1. [商城源码(1.4版分支）](https://gitee.com/ZhongBangKeJi/crmeb_java)

<img src="https://bucket.anliu.online/shop/1761963733708.png" /> 

2. [官方文档(1.4版本)](https://doc.crmeb.com/java/crmeb_java/2212)

## 2. 环境准备

1. 购买一台低配版本的云服务器
- 安装好docker和docker-compose环境
- docker-compose方式安装好nginx-proxy-manager

2. 购买一个域名（例如：anliu.online）
3. 具备公网ip（ddns动态解析公网ip到域名：ch.anliu.online）
4. 一台准备长期运行的nas设备（或者其他服务器、或者家用电脑）

- 安装好docker和docker-compose环境
- docker-compose方式拉取启动nginx，并映射配置文件nginx.conf
- 先拉取openjdk: 8-jdk镜像，后续用于docker方式运行jar包
- docker-compose方式拉取并启动redis，并映射配置文redis.conf，并配置redis的密码
- docker-compose方式拉取并启动mysql5，并配置文数据库用户名和密码



## 3. 构建&搭建

### 3.1 配置并构建商场后台管理系统的jar包

`application-prod.yml`

```yaml
# CRMEB 相关配置
crmeb:
  version: CRMEB-JAVA-KY-v1.4 # 当前代码版本
  imagePath: /JAVA_PROJECT/SINGLE/demo/admin/ # 服务器图片路径配置 斜杠结尾
  asyncConfig: true #是否同步config表数据到redis

server:
  port: 20410
  address: 0.0.0.0

spring:
  profiles:
    #  配置的环境
    active: prod
    #  数据库配置
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource
    driver-class-name: com.mysql.jdbc.Driver
    url: jdbc:mysql://192.168.0.41:3306/crmeb_java?characterEncoding=utf-8&useSSL=false&serverTimeZone=GMT+8
    username: 名称
    password: 密码
  redis:
    host: 192.168.0.41 #地址
    port: 6379 #端口
    password: 密码
    timeout: 10000 # 连接超时时间（毫秒）
    database: 4 #默认数据库
    jedis:
      pool:
        max-active: 200 # 连接池最大连接数（使用负值表示没有限制）
        max-wait: -1 # 连接池最大阻塞等待时间（使用负值表示没有限制）
        max-idle: 10 # 连接池中的最大空闲连接
        min-idle: 0 # 连接池中的最小空闲连接
        time-between-eviction-runs: -1 #逐出扫描的时间间隔(毫秒) 如果为负数,则不运行逐出线程, 默认-1

debug: true
logging:
  level:
    io.swagger.*: error
    com.zbjk.crmeb: debug
    org.springframework.boot.autoconfigure: ERROR
  config: classpath:logback-spring.xml
  file:
    path: ./crmeb_log

# mybatis 配置
mybatis-plus:
  # 配置sql打印日志
  configuration:
    log-impl:

#swagger 配置
swagger:
  basic:
    enable: true #是否开启界面
    check: false #是否打开验证
    username: crmeb #访问swagger的账号
    password: crmeb.com #访问swagger的密码

```

==注意：imagePath: /JAVA_PROJECT/SINGLE/demo/admin/和address: 0.0.0.0很重要==

**如果不使用oss存储的话，imagePath 为图片的服务器存储地址**

**address: 0.0.0.0 表示允许任何地址访问**

然后构建出jar包：`crmeb-admin-api.jar`



### 3.2 配置并构建商场后台管理系统的jar包

`application-prod.yml`

```yaml
# CRMEB 相关配置
crmeb:
  version: CRMEB-JAVA-KY-v1.4 # 当前代码版本
  domain: #配合swagger使用 # 待部署域名
  wechat-api-url:  #请求微信接口中专服务器
  wechat-js-api-debug: false #微信js api系列是否开启调试模式
  wechat-js-api-beta: true #微信js api是否是beta版本
  asyncConfig: true #是否同步config表数据到redis
  asyncWeChatProgramTempList: false #是否同步小程序公共模板库
  imagePath: /JAVA_PROJECT/SINGLE/demo/admin/ # 服务器图片路径配置 斜杠结尾
  captchaOn: false # 是否开启行为验证码
  demoSite: true # 是否演示站点 所有手机号码都会掩码

server:
  port: 20400
  address: 0.0.0.0

spring:
  profiles:
    #  配置的环境
    active: prod
  servlet:
    multipart:
      max-file-size: 50MB #设置单个文件大小
      max-request-size: 50MB #设置单次请求文件的总大小
    #  数据库配置
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource
    driver-class-name: com.mysql.jdbc.Driver
    url: jdbc:mysql://192.168.0.41:3306/crmeb_java?characterEncoding=utf-8&useSSL=false&serverTimeZone=GMT+8
    username: stone
    password: 密码
  redis:
    host: 192.168.0.41 #地址
    port: 6379 #端口
    password: 密码
    timeout: 10000 # 连接超时时间（毫秒）
    database: 4 #默认数据库
    jedis:
      pool:
        max-active: 200 # 连接池最大连接数（使用负值表示没有限制）
        max-wait: -1 # 连接池最大阻塞等待时间（使用负值表示没有限制）
        max-idle: 10 # 连接池中的最大空闲连接
        min-idle: 0 # 连接池中的最小空闲连接
        time-between-eviction-runs: -1 #逐出扫描的时间间隔(毫秒) 如果为负数,则不运行逐出线程, 默认-1

debug: true
logging:
  level:
    io.swagger.*: error
    com.zbjk.crmeb: debug
    org.springframework.boot.autoconfigure: ERROR
  config: classpath:logback-spring.xml
  file:
    path: ./crmeb_log

# mybatis 配置
mybatis-plus:
  # 配置sql打印日志
  configuration:
    log-impl:

#swagger 配置
swagger:
  basic:
    enable: true #是否开启界面
    check: false #是否打开验证
    username: crmeb #访问swagger的账号
    password: crmeb.com #访问swagger的密码

```

==注意：imagePath: /JAVA_PROJECT/SINGLE/demo/admin/和address: 0.0.0.0很重要==

**如果不使用oss存储的话，imagePath 为图片的服务器存储地址**

**address: 0.0.0.0 表示允许任何地址访问**

然后构建出jar包：`crmeb-front-api.jar`

### 3.3 docker-compose方式启动后台api

在nas服务器 docker-compose 的方式启动crmeb-admin-api.jar和crmeb-front-api.jar包：

```yaml
networks:
  crmeb_api_net:
    external: false

services:
  crmeb-admin-api:
    image: registry.cn-hangzhou.aliyuncs.com/stone540-images/openjdk:8-jdk  # 或者使用 openjdk:8-jre 如果只需要运行环境
    container_name: crmeb-admin-api
    restart: unless-stopped
    networks:
      - crmeb_api_net
    working_dir: /app
    ports:
      - "20400:20400"
    environment:
      - JAVA_OPTS=-Xmx512m -Xms256m -XX:+UseG1GC -Dfile.encoding=UTF-8
    volumes:
      - ./target/crmeb-admin-api.jar:/app/app.jar
      - ./admin-logs:/app/logs
      - /home/stone/WorkDir/crmeb-api/imgs:/JAVA_PROJECT/SINGLE/demo/admin
    command: ["sh", "-c", "java $$JAVA_OPTS -jar app.jar"]

  crmeb-front-api:
    image: registry.cn-hangzhou.aliyuncs.com/stone540-images/openjdk:8-jdk  # 或者使用 openjdk:8-jre 如果只需要运行环境
    container_name: crmeb-front-api
    restart: unless-stopped
    networks:
      - crmeb_api_net
    working_dir: /app
    ports:
      - "20410:20410"
    environment:
      - JAVA_OPTS=-Xmx512m -Xms256m -XX:+UseG1GC -Dfile.encoding=UTF-8
    volumes:
      - ./target/crmeb-front-api.jar:/app/app.jar
      - ./front-logs:/app/logs
      - /home/stone/WorkDir/crmeb-api/imgs:/JAVA_PROJECT/SINGLE/demo/admin
    command: ["sh", "-c", "java $$JAVA_OPTS -jar app.jar"]
```



### 3.4 配置nas环境的nginx启动商场的后台管理系统：

生产环境配置 `.env.production`:

```js
ENV = 'production'

# base api
VUE_APP_BASE_API = 'https://api-admin-crmeb.anliu.online'
```

执行打包命令：

```bash
pnpm build:prod
```

拷贝 `dist` 目录生成的静态html代码到nas服务器的nginx容器对应的html目录下的crmeb目录，

`nginx.conf` 配置：

```nginx
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    #include /etc/nginx/conf.d/*.conf;

    server {
      listen 6001;
      server_name 192.168.0.41 localhost;  # 或者你的域名

      # 设置根目录为 html 下的 creb 子目录
      root /usr/share/nginx/html/crmeb;
      index index.html index.htm;

      location / {
          index index.html;
          try_files $uri $uri/ /index.html;
          autoindex off;
      }

      # 静态资源配置
      location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
          # 直接使用 root 指令，路径会自动拼接 /static
          expires 1y;
          add_header Cache-Control "public, immutable";
          access_log off;
      }

      # favicon.ico 单独配置
      location = /favicon.ico {
          access_log off;
          log_not_found off;
          expires 1y;
          add_header Cache-Control "public, immutable";
      }

    }
}
```



### 3.5 配置云服务器上的nginx-proxy-manage：

#### 先配置域名统一ssl免费证书：

![](https://bucket.anliu.online/shop/1761977208946.png) 

#### 配置商城后台管理系统页面代理：

![](https://bucket.anliu.online/shop/1761977414223.png) 

![](https://bucket.anliu.online/shop/1761977616557.png) 

#### 配置商城后台管理系统的接口代理（https）：

![](https://bucket.anliu.online/shop/1761977823333.png) 

同上选择anliu.online证书



#### 配置商城h5和小程序的接口代理（https）：

![](https://bucket.anliu.online/shop/1761977842987.png) 

同上选择anliu.online证书



至此全部配置完毕。

商城后台管理系统访问地址为：`https://shop-admin.anliu.online`

小程序和h5商城的后台接口地址：`https://api-front-crmeb.anliu.online`

后台管理系统的后台接口地址：`https://api-admin-crmeb.anliu.online`
