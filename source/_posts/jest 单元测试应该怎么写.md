---
title: 前端单元测试应该怎么写
date: 2022-12-21 15:15:05
tags:
---

## 背景

简单介绍下背景，笔者在工作中负责开发前端 SDK，测试框架使用 jest。

我们项目对代码测试覆盖率有一定的要求，需要满足：

```json
{
  "branches": 80,
  "functions": 80,
  "lines": 80,
  "statements": 80
}
```

团队成员为了达到这个要求，写出了一些诡异的测试代码，比如我们需要测试这个函数：

```js
export const getConfig = (name) => {
  return {
    foo: () => {},
    name: name || "Anonymous",
  };
};
```

我们的测试测试用例一般是这样的：

```js
describe("getConfig", () => {
  test("should return name if have the paramter", () => {
    const name = "zxf4399";
    const config = getConfig(name);

    expect(config.name).toBe(name);
  });

  test("should return default name if doesn't have the paramter", () => {
    const config = getConfig();

    expect(config.name).toBe("Anonymous");
  });
});
```

执行结果如下：

```bash
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |     100 |      100 |      50 |     100 |
 index.js |     100 |      100 |      50 |     100 |
----------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        0.395 s, estimated 1 s
```
