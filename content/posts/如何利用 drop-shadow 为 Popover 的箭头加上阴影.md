---
title: "如何利用 drop-shadow 为 Popover 的箭头加上阴影"
date: 2023-08-27T21:01:45+08:00
tags:
  - CSS
---

## 背景

有一天 PM 跟我说，你看下这个 Popover 。为什么它的箭头没有阴影？

我瞅了一眼 CSS：

```css
.tooltip {
  position: relative;
  box-shadow: 0px 4px 4px 0 rgba(0, 0, 0, 0.5);
  padding: 4px 6px;
  display: inline-block;
  margin: 4px;
  background: #fff;
}

.tooltip::after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  left: 50%;
  margin-left: -3px;
  bottom: -12px;
  border: 6px solid black;
  border-color: #fff transparent transparent transparent;
}
```

没毛病，我又没给箭头加阴影。如果箭头要有阴影，需要为箭头加一些额外的样式：

```css
.tooltip::after {
  transform: rotate(-45deg);
  border-color: transparent transparent #fff #fff;
  transform-origin: 0 0;
  box-shadow: -4px 4px 4px 0 rgba(0, 0, 0, 0.5);
}
```

[传送门](https://codepen.io/zxf4399/pen/abPdEmN)。

产品过来一看，嗯，不错。

但 Code Review 的时候，有同事提出了一个 idea：

可以用 [drop-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/drop-shadow)，修改的代码更少，而且不用为阴影设置额外的 `box-shadow`。

## 神奇的 drop-shadow

我赶紧试了一手 `drop-shadow`：

```css
.tooltip {
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.5));
}
```

[传送门](https://codepen.io/zxf4399/pen/YzdwYdL)

咦，确实可以啊，就加了一行代码，效果就出来了。

细心的同学可能发现了，`drop-shadow` 里的参数相比 `box-shadow` 少了一个 **0**。

这个参数是 `spread-radius`，对于 `box-shadow` 来说，它的作用是扩大或缩小阴影的面积。

可惜的是`drop-shadow` 没有这个参数。

不仅如此 `drop-shadow` 对于 `inset` 关键字也不支持。

好在其他参数，比如 `x-offset`、`y-offset`、`blur-radius`、`color` 都是支持的。

但这不意味着相同的参数有相同的渲染效果。

## drop-shadow vs box-shadow

先看 `box-shadow` 的 CSS：

```css
p {
  margin: 20px auto;
  padding: 10px;
  border: 2px solid #333;
  width: 30%;
  text-align: center;
  background: #fff;
  box-shadow: 10px 5px 5px #333;
}
```

效果：

![CleanShot%202023-08-31%20at%2020.58.40@2x.png](https://raw.githubusercontent.com/zxf4399/oss/main/2023/08/31/CleanShot%202023-08-31%20at%2020.58.40@2x.png)

再看下 `drop-shadow` 的 CSS：

```css
p {
  margin: 20px auto;
  padding: 10px;
  border: 2px solid #333;
  width: 30%;
  text-align: center;
  background: #fff;
  filter: drop-shadow(10px 5px 5px #333);
}
```

效果：

![CleanShot%202023-08-31%20at%2021.03.29@2x.png](https://raw.githubusercontent.com/zxf4399/oss/main/2023/08/31/CleanShot%202023-08-31%20at%2021.03.29@2x.png)

结果还是比较明显的，`drop-shadow` 的阴影比 `box-shadow` 的阴影要淡一些。

细心的同学可能发现我加了个 `background: #fff`。这是因为如果刚才的例子不加这个背景色，渲染出来的效果很奇怪：

![CleanShot%202023-08-31%20at%2021.09.21@2x.png](https://raw.githubusercontent.com/zxf4399/oss/main/2023/08/31/CleanShot%202023-08-31%20at%2021.09.21@2x.png)

正如[MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/drop-shadow)描述的那样：

A drop shadow is effectively a blurred, offset version of the input image's alpha mask, drawn in a specific color and composited below the image.

投影 = 输入图像的模糊、偏移版本 + 特定颜色 + 组合在图像下方

其实这也从侧面证明了浏览器的默认背景色不是白色的。

如果你理解了这句话，接下来看到的例子也就不难理解了：

![CleanShot2023-08-31at21.16.24@2x](https://raw.githubusercontent.com/zxf4399/oss/main/2023/08/31/CleanShot%202023-08-31%20at%2021.16.24@2x.png)

为什么 `drop-shadow` 的阴影部分居然是跟图片类似，有弧度的。

这是因为这个图片有部分是透明的，而 `drop-shadow` 的阴影效果忽略了这部分。

当然，跟 `box-shadow` 可以对一个元素设置多个一样，`drop-shadow` 也是可以的：

```css
.img {
  filter: drop-shadow(6px 6px 6px red) drop-shadow(10px 10px 10px blue);
}
```

![CleanShot2023-08-31at21.24.59@2x](https://raw.githubusercontent.com/zxf4399/oss/main/2023/08/31/CleanShot%202023-08-31%20at%2021.24.59@2x.png)

## 兼容性

这么酷炫的 `drop-shadow` 兼容性怎么样的？

![CleanShot 2023-08-29 at 07.10.33@2x.png](https://raw.githubusercontent.com/zxf4399/oss/main/2023/08/29/CleanShot%202023-08-29%20at%2007.10.33@2x.png)

从中可以看出，在 IE 退役的今天，使用 `drop-shadow` 是没有问题的。

## 总结

虽然 `box-shadow` 和 `drop-shadow` 都可以为 Popover 的箭头添加阴影效果，但是 `box-shadow` 的代码实现更复杂，而 `drop-shadow` 相对来说更简单。

`drop-shadow` 跟 `box-shadow` 比缺少 `spread-radius` 和 `inset`，但 `drop-shadow` 在渲染一些带透明度的图片的时候，效果更好。

`drop-shadow` 同样支持 multiple 调用，效果看上去也不错。

在今天，`drop-shadow` 的兼容性也不再是问题，可以放心大胆的去使用。
