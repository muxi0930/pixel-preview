# 像素预览

在画布中按 1×、2× 或 5× 预览 PNG 像素图，保留像素颜色和透明度。

An [OhMyGame](https://github.com/WhiteTowerAI/ohmygame) plugin, `muxi0930/pixel-preview`.

## Develop

1. `npm install`
2. In OhMyGame, open **Plugins › Add plugin › This computer**, choose this
   folder and turn on **Develop**. The app reloads the plugin when a file
   changes, with the files a release includes.
3. `npm run check` checks the package the way OhMyGame does when it's added.

Translate `locales/zh-CN.json`; until then it repeats `locales/en.json`.

## Publish

OhMyGame's market lists plugins released on GitHub, in a public repository
with the topic `ohmygame-plugin` owned by the user or organization whose
name, lowercased, is the publisher `muxi0930`. For each release:

1. Raise `version` in both `package.json` and
   `.ohmygame-plugin/plugin.json`.
2. Publish it from OhMyGame's Plugin Builder (**Publish to GitHub**), or push
   the tag `v<version>`: in a folder exported from OhMyGame,
   `.github/workflows/release.yml` packs the plugin and attaches it to the
   tag's release as a `.zip`, making the release if there isn't one.

Released under the [MIT License](LICENSE).
