---
title: 快速入门
date: 2023-02-03 15:46:58
tags: 前端
---

Turborepo 是一个针对 **JavaScript** 和 **Typescript** 代码库优化的智能构建系统。

一般代码库会有一些脚本，比如 `lint`, `build`, `test` 等，但他们**并不能运行的很快**。Turborepo 使用缓存的能力来加速这些脚本的运行。

Turborepo 支持：

- 添加到现有的项目中
- 创建一个新的 monorepo 代码库
- 添加到现有的 monorepo 代码库中

特性：

- 想同的工作不做两遍 (Turborepo 会记住你的任务的结果，下次运行时会跳过已经完成的工作)
- 尽可能的并行化任务 (即使你运行任务的方式可能没有经过优化，Turborepo 会智能调度任务，最大限度地减少空闲的 CPU)

<!-- more -->

## 使用 Turborepo

### 将 Turborepo 添加到现有的项目中

TurboRepo 可以添加到**任何**的项目中来加速 `package.json` 脚本的执行速度。

1. 安装 Turborepo

   ```bash
   # npm
   npm install turbo --global
   # yarn
   yarn global add turbo
   # pnpm
   pnpm install turbo --global
   ```

2. 项目根目录添加 `turbo.json` 文件

   turbo.json 更多配置可以参考：<https://turbo.build/repo/docs/reference/configuration>

   ```json
   {
     "$schema": "https://turbo.build/schema.json",
     "pipeline": {
       "build": {
         // next
         "outputs": [".next/**"]
         // vite
         //   "outputs": ["dist/**"]
       },
       "lint": {}
     }
   }
   ```

   如果你使用 vite cli 创建项目 `package.json` 看起来像是这样:

   ```json
   {
     "scripts": {
       "build": "tsc && vite build"
     }
   }
   ```

   那么你需要修改为:

   ```json
   {
     "scripts": {
       "build": "vite build",
       "lint": "tsc"
     }
   }
   ```

   这可以让 Turborepo 分别调度 `build` 和 `lint`。

3. 修改 `.gitignore`

   ```diff
   + .turbo
   ```

4. 尝试通过 `turbo` 运行 `build` 和 `lint`

   ```bash
   turbo build lint
   ```

5. 不修改代码，再次运行 `build` 和 `lint`

   ```bash
   turbo build lint
   ```

   你可以看到 terminal 输出:

   ```bash
   Tasks:    2 successful, 2 total
   Cached:    2 cached, 2 total
   Time:    185ms >>> FULL TURBO
   ```

6. 尝试通过 `turbo` 运行 `dev`

   ```bash
   turnbo dev
   ```

   你可以看到 `dev` 命令启动成功。你可以使用 `turbo` 运行 package.json 的任何脚本。

### 创建一个新的 monorepo 代码库

#### 1. 运行 `create-turbo`

```bash
npx create-turbo@latest
```

安装过程中，你将会被询问几个问题：

**你喜欢在哪里创建你的 turorepo 代码库？**

选择任意一个你喜欢的目录。默认是 `./my-turborepo`。

**你想用什么包管理器？**

- [npm](https://www.npmjs.com/)
- [pnpm](https://pnpm.io/)
- [yarn](https://yarnpkg.com/)

推荐使用 `pnpm`，如果你还没有安装 `pnpm`，可以参考 [pnpm install](https://pnpm.io/installation)。

#### 2. 探索你的代码库

`create-turbo` 向你描述了你的代码库的结构：

```bash
>>> Creating a new turborepo with the following:
 - apps/web: Next.js with TypeScript
 - apps/docs: Next.js with TypeScript
 - packages/ui: Shared React component library
 - packages/eslint-config-custom: Shared configuration (ESLint)
 - packages/tsconfig: Shared TypeScript `tsconfig.json`
```

每一个都是一个 workspace - 一个包含 `package.json` 的文件夹。每个 workspace 都可以声明它的依赖关系，运行自己的脚本，以及使用其他 workspace 的代码。

##### 了解 `packages/ui`
