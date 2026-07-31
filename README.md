# 抽张好牌

一个适合手机微信打开的轻量 H5 扑克牌抽取器，采用 Next.js App Router 与纯前端状态管理。

## 功能

- 可开关大小王；切换后会自动重置牌堆
- 每次抽取 5 张且当前牌局内不重复
- 简约暗色移动端界面与发牌动画
- 一键重新开局
- 为未来 Supabase 接入保留 `.env.example`，不含任何硬编码密钥

## 本地运行

```bash
npm install
npm run dev
