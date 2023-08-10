---
title: "探索 flex:1 常见问题与解决方案"
date: 2023-08-07T16:55:50+08:00
tags:
  - CSS
---

## flex: 1 有什么作用？

先来看一个简单的例子。

```html
<div class="container">
  <div class="menu"></div>
  <div class="main"></div>
</div>
```

```css
.container {
  display: flex;
  width: 300px;
  height: 200px;
  border: 1px solid red;
}

.menu {
  flex: 0 0 100px;
  background-color: gray;
}

.main {
  flex: 1;
  background-color: darkseagreen;
}
```

效果截图：

![CleanShot 2023-08-09 at 20.46.20@2x.png](https://raw.githubusercontent.com/zxf4399/oss/main/2023/08/09/CleanShot%202023-08-09%20at%2020.46.20@2x.png)

以上效果可以点击这里查看：[传送门](https://codepen.io/zxf4399/pen/VwVgmJa)

从代码效果可以看出 **.main** 元素的宽占据了父元素除 **.menu** 元素外的剩余宽度。

## flex: 1 的实际渲染属性

打开 Chrome 控制台可以看到：

![CleanShot 2023-08-09 at 20.47.48@2x.png](https://raw.githubusercontent.com/zxf4399/oss/main/2023/08/09/CleanShot%202023-08-09%20at%2020.47.48@2x.png)

flex: 1 实际上代表三个属性：

- flex-grow: 1
- flex-shrink: 1
- flex-basis: 0%

[MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/flex) 上关于 flex: 1 这种 **One value** 的情况。

个人认为里面 "flex-basis is then equal to 0" 这段话的表述有点模糊，因为 flex-basis 也可以表示 **0px**。

![CleanShot 2023-08-09 at 20.49.36@2x.png](https://raw.githubusercontent.com/zxf4399/oss/main/2023/08/09/CleanShot%202023-08-09%20at%2020.49.36@2x.png)

所以在这里再次强调下 flex: 1 的 flex-basis 是 **0%**。

## 使用 flex: 1 可能遇到的问题

修改一下例子中的代码：

```html
<div class="container">
  <div class="menu"></div>
  <div class="main">
    <div class="content">
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sequi provident
      molestias inventore quisquam tempore hic labore esse reprehenderit
      quibusdam, amet nisi nesciunt ab deleniti dolorem tenetur, animi, unde
      alias sint.
    </div>
  </div>
</div>
```

```css
.container {
  display: flex;
  width: 300px;
  height: 200px;
  border: 1px solid red;
}

.menu {
  flex: 0 0 100px;
  background-color: gray;
}

.main {
  flex: 1;
  background-color: darkseagreen;
}

.content {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
```

效果截图：

![CleanShot 2023-08-09 at 20.53.09@2x.png](https://raw.githubusercontent.com/zxf4399/oss/main/2023/08/09/CleanShot%202023-08-09%20at%2020.53.09@2x.png)

以上效果可以点击这里查看：[传送门](https://codepen.io/zxf4399/pen/jOQdyGd)

发现 .main 元素的宽度**超过**了父元素的宽度。

## 为什么会出现这样的问题？

在[规范](https://drafts.csswg.org/css-flexbox/#flex-common)中解释了这个情况：

![CleanShot 2023-08-09 at 20.54.24@2x.png](https://raw.githubusercontent.com/zxf4399/oss/main/2023/08/09/CleanShot%202023-08-09%20at%2020.54.24@2x.png)

**默认情况下，弹性项目不会缩小到其 minimum content size（即最长单词或固定尺寸元素的长度）**。

那什么是 minimum content size？

![CleanShot 2023-08-09 at 20.55.47@2x.png](https://raw.githubusercontent.com/zxf4399/oss/main/2023/08/09/CleanShot%202023-08-09%20at%2020.55.47@2x.png)

从中我们了解到 minimum content size 在不同的情况对应不同的值：

| container  | value                      |
| ---------- | -------------------------- |
| scroll     | 0                          |
| not scroll | content-based minimum size |

结合本文例子，我们分析一下 .main 元素为什么会出现这个情况。

.main 元素是一个不可滚动容器，所以最小宽度值 = `content-based minimum size`。

而规范中 `content-based minimum size` = Math.min(`specified size suggestion`, `content size suggestion`)。

.main 元素没有指定的 `width` 属性也没有 `aspect-ratio` 属性，所以决定 .main 元素最小宽度的是 `min-width`。

嗅探一下 .main 元素的 `min-width`:

![CleanShot 2023-08-09 at 20.58.47@2x.png](https://raw.githubusercontent.com/zxf4399/oss/main/2023/08/09/CleanShot%202023-08-09%20at%2020.58.47@2x.png)

看一下[规范](https://drafts.csswg.org/css-sizing-3/#valdef-width-auto)：

![CleanShot 2023-08-09 at 21.00.00@2x.png](https://raw.githubusercontent.com/zxf4399/oss/main/2023/08/09/CleanShot%202023-08-09%20at%2021.00.00@2x.png)

从中我们了解到，`auto` 对 `min-width`/`min-height` 来讲是一个 **`automatic minimum size`**。除非相关布局定义，一般情况下 `auto` 会被解析为 0。

`automatic minimum size` 在[规范](https://drafts.csswg.org/css-sizing-3/#ref-for-automatic-minimum-size)中的定义是：

![CleanShot 2023-08-07 at 17.04.29.png](https://raw.githubusercontent.com/zxf4399/oss/main/2023/08/07/CleanShot%202023-08-07%20at%2017.04.29.png)

从中我们了解到 `automatic minimum size` 依赖于内容。

## 如何解决这个问题？

由于 `.main` 元素的 `min-width` 的值是 `auto` 导致了这个问题。那么只要将 `min-width` 的值设置为 0 就可以解决这个问题。

```diff
.main {
  flex: 1;
  background-color: darkseagreen;
+  min-width: 0;
}
```

效果截图：

![CleanShot 2023-08-09 at 20.20.24@2x.png](https://raw.githubusercontent.com/zxf4399/oss/main/2023/08/09/CleanShot%202023-08-09%20at%2020.20.24@2x.png)

以上效果可以点击这里查看：[传送门](https://codepen.io/zxf4399/pen/WNYBOvo)

其实对于这个问题还有第二种解决方案。那就是将 `.main` 元素的 `overflow` 属性设置为 `auto`，目的是让 `.main` 元素变成一个可滚动容器。

```diff
.main {
  flex: 1;
  background-color: darkseagreen;
+  overflow: auto;
}
```

效果截图：

![CleanShot 2023-08-09 at 20.34.17@2x.png](https://raw.githubusercontent.com/zxf4399/oss/main/2023/08/09/CleanShot%202023-08-09%20at%2020.34.17@2x.png)

以上效果可以点击这里查看：[传送门](https://codepen.io/zxf4399/pen/abQrwNR)

从规范里我们了解到，不仅是 `min-width` 会受到 `automatic minimum size` 的影响，`min-height` 也会受到 `automatic minimum size` 的影响。

所以这里给大家留个例子：

```html
<div class="container">
  <div class="menu"></div>
  <div class="main">
    <div class="content">
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sit, consequatur
      voluptate nam aut fugiat vero quibusdam et, quas iure, ut eveniet nulla
      obcaecati tempora! Labore, perspiciatis quo! Assumenda, id temporibus.
      Temporibus iste dolorem minima quas maiores sapiente minus at beatae harum
      quae asperiores rerum, similique earum ad non officia eaque repellendus
      omnis quod rem dicta quasi explicabo reiciendis cupiditate! Sed!
      Blanditiis dolor sapiente ab eaque a officia enim illum facilis? Eum
      consequatur velit in consectetur molestias temporibus, voluptatem quo iure
      similique totam minima minus ipsum tempora, pariatur doloribus, dicta
      vitae!
    </div>
  </div>
</div>
```

```css
.container {
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 300px;
  border: 1px solid red;
}

.menu {
  flex: 0 0 64px;
  background-color: gray;
}

.main {
  flex: 1;
  background-color: darkseagreen;
}
```

效果截图：

![CleanShot 2023-08-09 at 20.42.23@2x.png](https://raw.githubusercontent.com/zxf4399/oss/main/2023/08/09/CleanShot%202023-08-09%20at%2020.42.23@2x.png)

相信大家已经知道怎么解决这个问题了。

## 总结

flex: 1 实际上代表三个属性：flex-grow: 1, flex-shrink: 1, flex-basis: 0%。设置 flex: 1 的元素可以占据父元素的剩余宽度/高度。但 flex: 1 的元素的宽度/高度可能会超过父元素的宽度/高度。这是因为 flex: 1 的元素的 min-width/min-height 的值是 auto，而 auto 对 min-width/min-height 来讲是一个 automatic minimum size。除非相关布局定义，一般情况下 auto 会被解析为 0。所以只要将 flex: 1 的元素的 min-width/min-height 的值设置为 0 就可以解决这个问题。也可以将 flex: 1 的元素的 overflow 属性设置为 auto，目的是让 flex: 1 的元素变成一个可滚动容器。
