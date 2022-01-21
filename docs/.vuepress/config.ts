import { defineUserConfig } from "vuepress";
import type { DefaultThemeOptions } from "vuepress";

export default defineUserConfig<DefaultThemeOptions>({
  themeConfig: {
    navbar: [
      {
        children: [
          "/awesome/cli.md",
          "/awesome/mac",
          "/awesome/tmux",
          "/awesome/tool",
          "/awesome/zsh",
        ],
        text: "Awesome",
      },
    ],
  },
});
