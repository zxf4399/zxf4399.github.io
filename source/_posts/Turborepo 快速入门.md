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

你也可以 clone [Turborepo examples](https://github.com/vercel/turbo/tree/main/examples) 来创建一个新的 monorepo 代码库。

在安装过程中，你将会被询问几个问题：

**你喜欢在哪里创建你的 turorepo 代码库？**

选择任意一个你喜欢的目录。默认是 `./my-turborepo`。

**你想用什么包管理器？**

- [npm](https://www.npmjs.com/)
- [pnpm](https://pnpm.io/)
- [yarn](https://yarnpkg.com/)

推荐使用 `pnpm`，如果你还没有安装 `pnpm`，可以参考 [pnpm install](https://pnpm.io/installation)。

#### 2. 探索你的代码库

`create-turbo` 给了你一个包含以下内容的代码库：

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

首先，打开 `./packages/ui/package.json`。你会发现包名是 `ui`。

然后，打开 `./apps/web/package.json`。你会发现包名是 `web`。同时，你会发现 `web` 依赖 `ui`。

如果你使用的包管理器是 `pnpm` 的话，你会发现：

```json
// apps/web/package.json
{
  "dependencies": {
    "ui": "workspace:*"
  }
}
```

这意味着我们的 **web app 依赖我们的本地 `ui` 包**

如果你往里看 `apps/docs/package.json`，你会发现同样的事。

`web` 和 `docs` 都依赖 `ui` - 一个共享的组件包。

通过这种模式共享代码在 monorepo 中是非常常见的 - 这样可以避免重复的代码，同时也可以在多个项目中使用。

##### 理解 imports 和 exports

在 `./apps/docs/pages/index.tsx` 中。 `docs` 和 `web` 都是 [Next.js](https://nextjs.org/) 应用，并且它们使用 `ui` 包也是想同的方式。

```tsx
// apps/docs/pages/index.tsx
import { Button } from "ui";
//       ^^^^^^         ^^

export default function Docs() {
  return (
    <div>
      <h1>Docs</h1>
      <Button />
    </div>
  );
}
```

它们直接从 `ui` 包中导入 `Button` 组件。`Button` 组件来自哪里？

打开 `packages/ui/package.json`。你会发现这两个属性：

```json
{
  "main": "./index.tsx",
  "types": "./index.tsx"
}
```

当 workspaces 从 `ui` 导入，`main` 会告诉它们从哪里导入。`types` 会告诉它们从哪里导入类型定义。

所以让我们看看 `./packages/ui/index.tsx`：

```tsx
import * as React from "react";
export * from "./Button";
```

这个文件的所有内容都可以被依赖 `ui` 包的 workspaces 使用。

`index.tsx` 导出了 `Button` 的所有内容，让我们看看 `./packages/ui/Button.tsx`：

```tsx
import * as React from "react";

export const Button = () => {
  return <button>Boop</button>;
};
```

我们找到了我们的 button! 在这个文件里所做的改动都会被 `web` 和 `docs` 应用所使用。

##### 理解 `tsconfig.json`

我们来看这两个 workspace，`tsconfig` 和 `eslint-config-custom`。每一个都是一个配置文件，它们可以被其他 workspace 使用。让我们来看 `tsconfig`：

```json
// packages/tsconfig/tsconfig.json
{
  "name": "tsconfig",
  "files": ["base.json", "nextjs.json", "react-library.json"]
}
```

这里，我们在 `files` 属性中列出了 3 个被导出的文件。依赖 `tsconfig` 的包能直接使用这些文件。

例如，`packages/ui` 依赖 `tsconfig`：

```json
// packages/ui/package.json
{
  "devDependencies": {
    "tsconfig": "workspace:*"
  }
}
```

在 `tsconfig.json` 文件中，它通过 `extends` 属性导入它：

```json
// packages/ui/tsconfig.json
{
  "extends": "tsconfig/react-library.json"
}
```

这个模式允许在 monorepo 的各个 workspaces 中使用同一份 `tsconfig.json`，减少代码重复。

##### 理解 `eslint-config-custom`

我们最后的 workspace 是 `eslint-config-custom`。

你会发现它的与其他的 workspaces 略有不同。它不如 `ui`，`tsconfig` 那么简略。让我们通过项目根目录的 `.eslintrc.js` 来查明原因：

```js
// .eslintrc.js
module.exports = {
  // This tells ESLint to load the config from the workspace `eslint-config-custom`
  extends: ["custom"],
};
```

[ESLint](https://eslint.org/) 通过查找 workspaces 名为 `eslint-config-*` 的包来解析配置。 这样我们可以写下 `extends: ['custom']` 让 ESLint 找到我们的本地 workspace。

但为什么这个文件位于 monorepo 的根目录？

ESLint 查找它配置文件的方法是通过查找最近的 `.eslintrc.js` 。如果它不能找到，它会继续向上查找，直到找到为止。

所以这意味着如果我们在 `packages/ui`（没有 `.eslintrc.js`） 中编写代码它会用根目录的 `.eslintrc.js`。

Apps 的 `.eslintrc.js` 可以通过相同的方式使用 `custom`。例如，在 `docs` 中：

```js
// apps/docs/.eslintrc.js
module.exports = {
  root: true,
  extends: ["custom"],
};
```

就像 `tsconfig`，`eslint-config-custom` 让我们在 monorepo 中使用同一份 ESLint 配置，减少代码重复。

##### 总结
