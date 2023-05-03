---
title: "轻松定位前端源码：探索 LocatorJS 的优势与使用方法"
date: 2023-04-09T21:09:53+08:00
tags:
  - 浏览器插件
---

## 背景

在前端项目开发过程中，快速定位 DOM 元素对应的源码对于开发者来说非常重要。通常，开发者可能会根据 DOM 元素的 class 名称或文案来查找。然而，[LocatorJS](https://www.locatorjs.com/) 作为一款优秀的工具，能够帮助您快速定位源码。

## 了解 click-to-component

在介绍 LocatorJS 之前，我们先来了解一下 [click-to-component](https://github.com/ericclemmons/click-to-component) 这个 npm 包。它的功能是：通过点击浏览器中的 React 组件，就能在 VSCode 中打开对应的源代码。

本文重点在于 LocatorJS，因此仅介绍在 `Create React App` 中使用 `click-to-component` 的方法。其他使用方法可参考其[官方文档](https://github.com/ericclemmons/click-to-component#usage)。

首先，在项目中安装 `click-to-component`：

```bash
# 可以选择使用 yarn 或 pnpm 安装
npm install click-to-react-component
```

然后在代码中引入 `click-to-component`：

```diff
+import { ClickToComponent } from 'click-to-react-component';
 import React from 'react';
 import ReactDOM from 'react-dom/client';
 import './index.css';
@@ -8,7 +7,6 @@ import reportWebVitals from './reportWebVitals';
 const root = ReactDOM.createRoot(document.getElementById('root'));
 root.render(
   <React.StrictMode>
+    <ClickToComponent />
     <App />
   </React.StrictMode>
 );
```

最终效果：

![cra](https://cdn.jsdelivr.net/gh/zxf4399/oss/2023/04/10/cra.gif)

尽管看起来不错，但从实际应用角度来看，`click-to-component` 存在一些局限：

1. 仅支持 React
2. 需要在项目中引入 `npm` 包

接下来我们将介绍 LocatorJS 如何解决这些问题。

## LocatorJS 的优势

产品形态：浏览器插件，支持 Chrome (包括基于 Chromium 项目的 Edge, Opera 等) 和 Firefox

前端框架支持：React, SolidJS, Preact, Svelte(实验性支持), Vue(实验性支持)

显然，LocatorJS 通过浏览器插件解决了前面提到的问题，并支持更多前端框架。

下面我们将介绍如何使用 LocatorJS。

## 如何使用 LocatorJS

以 React 项目为例，首先我们需要安装 LocatorJS 的[浏览器插件](https://chrome.google.com/webstore/detail/locatorjs/npbfdllefekhdplbkdigpncggmojpefi)。

安装完成后，我们需要在项目中修改 `@babel/preset-react` 的 `development` 字段：

```js
{
  "presets": [
    [
      "@babel/preset-react",
      {
        // 根据你的项目实际情况修改
        "development": process.env.NODE_ENV === "development"
      }
    ]
  ]
}
```

注意：如果你使用的是 `create-react-app`、`create-next-app` 等高级脚手架，那么你无需进行任何修改，因为这些脚手架已经帮你处理了这个问题。

最终效果：

![demo](https://cdn.jsdelivr.net/gh/zxf4399/oss/2023/04/11/demo.gif)

LocatorJS 也可以作为 `npm` 包引入，有兴趣的同学可以自行[查看](https://www.locatorjs.com/install/react)。

## 总结

LocatorJS 提供了点击浏览器中的 DOM 元素后直接跳转至源码的功能。相较于 `click-to-component`，LocatorJS 以浏览器插件的形式实现了这一功能，无需在项目中引入额外的 `npm` 包，且支持更多的前端框架。

> 本作品系原创，采用[《署名-非商业性使用-禁止演绎 4.0 国际》](https://creativecommons.org/licenses/by-nc-nd/4.0/)许可协议
