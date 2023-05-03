---
title: "精读 echarts-for-react 源码"
date: 2022-12-19T20:16:35+08:00
tags:
  - 源码
---

## 引言

[echarts](https://echarts.apache.org) 可以轻松实现数据可视化图表，在工作中我通常使用其 React 封装版本 [echarts-for-react](https://github.com/hustcc/echarts-for-react) 让我们看一下它的封装思路。

 <!-- more -->

## 简介

echarts-for-react 提供了 `option` 属性传入图表配置项，API 如下：

```jsx
import ReactEcharts from "echarts-for-react";
import React from "react";

const Component = () => {
  const getOption = () => {
    return {
      title: {
        text: "ECharts 入门示例",
      },
      tooltip: {},
      legend: {
        data: ["销量"],
      },
      xAxis: {
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
      },
      yAxis: {},
      series: [
        {
          name: "销量",
          type: "bar",
          data: [5, 20, 36, 10, 10, 20],
        },
      ],
    };
  };

  return <ReactEcharts option={getOption()} />;
};
```

与官方 [5 分钟上手 Echarts](https://echarts.apache.org/zh/tutorial.html#5%20%E5%88%86%E9%92%9F%E4%B8%8A%E6%89%8B%20ECharts) 不同的是，echarts-for-react 不需要设置宽高的实例容器，初始化 echarts 实例，并通过 [setOption](https://echarts.apache.org/zh/api.html#echartsInstance.setOption) 方法生成图形。

echarts-for-react 还支持下列参数：

- `notMerge`：可选，是否不跟之前设置的 option 进行合并，默认为 false，即合并。
- `lazyUpdate`：可选，在设置完 option 后是否不立即更新图表，默认为 false，即立即更新。
- `style`：可选，echarts DOM 元素的 style 属性，默认为 `{ height: '300px' }`。
- `className`：可选，echarts DOM 元素的 class 属性。
- `theme`：可选，应用的主题。使用前需要 `registerTheme` ，代码如下：

```jsx
  // import echarts
  import echarts from 'echarts';
  ...
  // register theme object
  echarts.registerTheme('my_theme', {
  backgroundColor: '#f4cccc'
  });
  ...
  // render the echarts use option `theme`
  <ReactEcharts
  option={this.getOption()}
  style={{height: '300px', width: '100%'}}
  className='echarts-for-echarts'
  theme='my_theme' />
```

- `onChartReady`：可选，当图表渲染完成，将会以 echarts 实例回调这个方法。
- `loadingOption`：可选，[加载动画配置项](https://echarts.apache.org/api.html#echartsInstance.showLoading)。
- `showLoading`：可选，显示加载动画效果，默认为 false，即隐藏。
- `onEvents`：可选，绑定 echarts 事件，通过 echarts [事件对象](https://echarts.apache.org/zh/api.html#events.%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6) 回调，代码如下：

```jsx
  let onEvents = {
  'click': this.onChartClick,
  'legendselectchanged': this.onChartLegendselectchanged
  }
  ...
  <ReactEcharts
  option={this.getOption()}
  style={{height: '300px', width: '100%'}}
  onEvents={onEvents} />
```

更多事件名，[请参考](https://echarts.apache.org/api.html#events)。

- `opts`：可选，echarts 附加参数，将在 echarts 实例初始化时被使用，[文档](https://echarts.apache.org/zh/api.html#echarts.init)，代码如下：

```jsx
<ReactEcharts
  option={this.getOption()}
  style={{ height: "300px" }}
  opts={{ renderer: "svg" }} // use svg to render the chart.
/>
```

## 精读

首先从声明周期 `componentDidMount` 开始解读，组件挂载完成调用 `rerender` 方法：

```jsx
// first add
componentDidMount() {
  this.rerender();
}
```

获取 `echart` 实例，绑定 echarts 监听函数，如果 `onChartReady` 存在并且类型为函数，则调用。若存在 echarts 的 DOM 元素，则绑定该元素 `resize` 事件，使图表自适应窗口大小。

```jsx
rerender = () => {
  const { onEvents, onChartReady } = this.props;

  const echartObj = this.renderEchartDom();
  this.bindEvents(echartObj, onEvents || {});

  // on chart ready
  if (typeof onChartReady === "function") this.props.onChartReady(echartObj);
  // on resize
  if (this.echartsElement) {
    bind(this.echartsElement, () => {
      try {
        echartObj.resize();
      } catch (e) {
        console.warn(e);
      }
    });
  }
};
```

首先来看一下 `renderEchartDom`，获取 `echarts` 实例，通过 `setOption` 绘制图表，如果 `props` 存在 `showLoading` 调用 `echarts` 实例的 `showLoading`, 最终返回 `echarts` 实例对象。

```jsx
// render the dom
renderEchartDom = () => {
  // init the echart object
  const echartObj = this.getEchartsInstance();
  // set the echart option
  echartObj.setOption(
    this.props.option,
    this.props.notMerge || false,
    this.props.lazyUpdate || false
  );
  // set loading mask
  if (this.props.showLoading)
    echartObj.showLoading(this.props.loadingOption || null);
  else echartObj.hideLoading();

  return echartObj;
};
```

那么 `bindEvents` 干了什么呢？遍历 `events`，`pick` 合适属性挂载到 `echarts` 实例上。

```js
// bind the events
bindEvents = (instance, events) => {
  const _bindEvent = (eventName, func) => {
    // ignore the event config which not satisfy
    if (typeof eventName === "string" && typeof func === "function") {
      // binding event
      // instance.off(eventName); // 已经 dispose 在重建，所以无需 off 操作
      instance.on(eventName, (param) => {
        func(param, instance);
      });
    }
  };

  // loop and bind
  for (const eventName in events) {
    if (Object.prototype.hasOwnProperty.call(events, eventName)) {
      _bindEvent(eventName, events[eventName]);
    }
  }
};
```

组件更新，若 `shouldSetOption` 方法返回 `false`，不更新图表。判定 `theme`、`opts`、`onEvents` 值更新时，先销毁实例，再重建图表。当部分特定属性更新的时候，不 `setOption` 图表，并考虑了样式修改带来的边界情况。

```jsx
// update
componentDidUpdate(prevProps) {
  // 判断是否需要 setOption，由开发者自己来确定。默认为 true
  if (typeof this.props.shouldSetOption === 'function' && !this.props.shouldSetOption(prevProps, this.props)) {
    return;
  }

  // 以下属性修改的时候，需要 dispose 之后再新建
  // 1. 切换 theme 的时候
  // 2. 修改 opts 的时候
  // 3. 修改 onEvents 的时候，这样可以取消所有之前绑定的事件 issue #151
  if (
    !isEqual(prevProps.theme, this.props.theme) ||
    !isEqual(prevProps.opts, this.props.opts) ||
    !isEqual(prevProps.onEvents, this.props.onEvents)
  ) {
    this.dispose();

      this.rerender(); // 重建
      return;
    }

    // 当这些属性保持不变的时候，不 setOption
    const pickKeys = ['option', 'notMerge', 'lazyUpdate', 'showLoading', 'loadingOption'];
    if (isEqual(pick(this.props, pickKeys), pick(prevProps, pickKeys))) {
      return;
    }

    const echartObj = this.renderEchartDom();
    // 样式修改的时候，可能会导致大小变化，所以触发一下 resize
    if (!isEqual(prevProps.style, this.props.style) || !isEqual(prevProps.className, this.props.className)) {
      try {
        echartObj.resize();
      } catch (e) {
        console.warn(e);
      }
    }

}
```

组件卸载时调用 `dispose`，删除 `echarts` DOM 容器，`echarts` 实例。

```jsx
// dispose echarts and clear size-sensor
dispose = () => {
  if (this.echartsElement) {
    try {
      clear(this.echartsElement);
    } catch (e) {
      console.warn(e);
    }
    // dispose echarts instance
    this.echartsLib.dispose(this.echartsElement);
  }
};
```

## 总结

- 将原生 API 逻辑封装在 `React` 特有 API，减少使用成本。
- 声明周期处理边界情况，比如组件挂载完成初始化 `echarts` 实例，组件卸载**删除** `echarts` 实例。

> 本作品系原创，采用[《署名-非商业性使用-禁止演绎 4.0 国际》](https://creativecommons.org/licenses/by-nc-nd/4.0/)许可协议
