---
title: "管理本地 Git 仓库的 cli 工具"
date: 2023-03-06T20:30:58+08:00
tags:
  - 轮子
---

## 背景

在日常工作中，我们经常需要 clone 远程的 Git 仓库。

一般我会创建一个文件夹，比如 `~/code`。然后在这个文件夹下 clone Git 仓库。

但这样做会导致一些问题：

- 遇到同名的 Git 仓库，会报 `fatal: destination path 'xxx' already exists and is not an empty directory.` 的错误。

- 公司内部的 Git 仓库和开源的 Git 仓库，用户名和邮箱不一样，需要对全局的 Git 配置做修改。

本文将介绍一款自己开源的的 cli 工具：[mgre](https://github.com/zxf4399/mgre) 帮助大家解决这些问题。

![git_clone_to_local_repo](https://raw.githubusercontent.com/zxf4399/oss/main/2023/03/07/1623155541-103268.png)

<!-- more -->

## 如何解决

通过调研发现，已经有一些类似的工具，比如 [projj](https://github.com/popomore/projj), [tanyao](https://github.com/xn-sakina/tanyao) 等工具实现了类似的功能。

但是这些工具都有一些问题：

- `projj` 已经很久没有更新了，issue 和 pr 都没有人处理。
- `tanyao` 提供的功能比较少，只能 clone 仓库。

所以我决定自己开发一个工具，实现自己想要的功能。

## 如何使用 mgre

### 安装

```bash
# With pnpm
$ pnpm install -g mgre
# With yarn
$ yarn global add mgre
# With npm
$ npm install -g mgre
```

### Clone

当我们需要 clone 一个仓库时，只需要执行 `mgre clone` 命令即可，比如

```bash
# support clone pattern like git clone
mgre clone https://github.com/zxf4399/mgre.git
# or
mgre clone git@github.com:zxf4399/mgre.git
```

在执行过程中，如果是首次执行，会提示你设置 `base` 目录（本地 Git 仓库的根目录）。

`base` 目录的默认值是 `join(homedir(), ".mgre")`，支持修改。（在这台 ubuntu 云主机中就是 `/home/ubuntu/.mgre`）

![what_is_the_base_directory](https://raw.githubusercontent.com/zxf4399/oss/main/2023/03/06/oz6ivU.jpg)

设置完 `base` 目录后，会继续提示你输入 Git 用户名和邮箱。（当然你也可以选择 `Yes` 跳过）

![git_username_email](https://raw.githubusercontent.com/zxf4399/oss/main/2023/03/06/keMUlk.png)

> 然而，需要注意的是，配置的 Git 用户名和邮箱仅适用于 `github.com` 仓库。如果你 clone 其他域名的 Git 仓库，您可能仍会看到输入 Git 用户名和邮箱的提示。

设置完 Git 用户名和邮箱后，就是熟悉的 `git clone` 过程了，只是仓库被 clone 到了 `base` 目录下。

```bash
base
├── config.json
├── github.com
│   └── zxf4399
│       └── mgre
└── mgre.db
```

### Find

当我们需要查找一个仓库时，只需要执行 `mgre find` 命令即可，比如

```bash
# find support fuzzy search
mgre find zxf4399/mgre
```

![find](https://raw.githubusercontent.com/zxf4399/oss/main/2023/03/07/hCZHLr.png)

### Import

如果你已经 clone 了一些仓库，但是没有使用 `mgre` 管理，那么你可以使用 `mgre import` 命令导入这些仓库。

```bash
# For example, if the repository's local path is ~/code/mgre
mgre import ~/code/mgre
```

导入完成后， 这些仓库将会被移动到 `base` 目录下。

```bash
base
├── config.json
├── github.com
│   └── zxf4399
│       ├── mgre
│       └── zxf4399.github.io
└── mgre.db

```

### rm

如果你想删除 `mgre` 的配置文件，可以使用 `mgre rm` 命令。

```bash
mgre rm
```

## 总结

本文介绍了 [mgre](https://github.com/zxf4399/mgre)，一款解决 Git 仓库 clone 过程中遇到的问题的 CLI 工具。该工具具有 clone、find、import 和 rm 命令等基本功能，可有效管理 Git 仓库。

如有任何问题或建议，请在下方留言，或者在 [mgre_issue](https://github.com/zxf4399/mgre/issues) 中提出。

如果你觉得这个工具还不错，欢迎给我点个 star。Thanks♪(･ω･)ﾉ
