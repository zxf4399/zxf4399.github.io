---
title: "Surge 如何与 VPN 共存"
date: 2023-06-19T21:43:02+08:00
tags:
  - Surge
---

## 背景

由于最近一段时间因为脚伤不得不在家办公，只能通过 VPN 访问公司的内网服务。但使用公司的 VPN 软件免不了每次需要输入 password 以及后续的 one-time password，甚至有的时候 VPN 软件总是会莫名其妙的崩溃，导致我不得不多次执行繁琐的操作。

## 使用命令行工具

为了解决这个问题，我用 [openfortivpn](https://github.com/adrienverge/openfortivpn) 替换了公司的 VPN 软件，这样我就可以在命令行里写死 password。至于 one-time password 可以用 [oathtool](https://www.nongnu.org/oath-toolkit/oathtool.1.html)。

## Surge

但做到这一步还不够，因为我用 Surge 做无障碍网络访问，所以我的网络要求会更高一点。我期望：

- 内网服务走 VPN
- 外网服务走 Surge 的规则

经过摸索，我在 Surge 上新增了一个 🔐 CorpVPN 节点：

```txt
[Proxy]
🔐 CorpVPN = direct, interface=ppp0, allow-other-interface=true
```

简单解释下这行配置：
🔐 CorpVPN 节点强制走 ppp0 网络接口，如果 ppp0 不可用走默认的网络接口。

然后在 Rule 配置内网服务。
因为 Surge 接管了 DNS 所以还需要加上内网服务的 DNS server。

## 总结

Surge 的社区做的比较好，有什么问题基本都能在上面得到答案。🔐 CorpVPN 这段配置更是写在了官方手册上，解决这个问题的难点是如何写命令行的参数使其于 Surge 共存。

## 2023/08/13 更新

其实之前的方案存在一个问题：内网服务的 IP 我是写死在 Surge 的配置文件中的。

可想而知这样带来的问题：需要时刻更新 Surge 配置文件。

所以我想了一个新的方案解决这个问题：**使用 VPN DNS server**。

启动命令方面我去掉了原先的 `--no-routes`，`--no-dns`，`--pppd-use-peerdns=0`。

在 Surge 的配置文件上，我新增了 VPN 的 DNS server，删除了那一坨内网域名对应的 IP。

但这样还有一个问题：_我的 DNS server 是自己写死的并没有灵活的读取 openfortivpn 运行后的 DNS server_。
