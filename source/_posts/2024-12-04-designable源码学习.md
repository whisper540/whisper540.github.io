---
title: designable源码学习
date: 2024-12-04 11:08:31
author: 石头
top: false
hide: false
cover: true
toc: false
mathjax: false
summary: 学习designable源码
categories: Frontend
tags:
  - 博客
  - 技术
  - frontend
  - designable
  - formily
---

designable+formily是一个低代码平台的解决方案，代码比较优秀，值得深入学习。

## 项目源码阅读顺序
1. 先看项目结构
2. 先看工具函数(shared)
3. 再看核心代码(core)
4. 最后看示例项目(examples)

## 项目结构

## 项目源码阅读

### 工具函数(shared)

### 核心代码(core)
#### 1. drivers
描述：包含了所有的DOM事件进行交互的事件驱动。注册事件、移除事件、发数据。

#### 2. effects
描述：核心逻辑，注重业务逻辑，完全不需要关系DOM级别，
data-content-editable="x-component-props.title"表示组件的title属性可以编辑。

#### 3. events
描述：

#### 4. models
描述：

#### 5. shortcuts
描述：

#### 6. 
描述：

### 示例项目(examples)