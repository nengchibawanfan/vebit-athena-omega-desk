# ATHENA

前后端分离的 Vue 3 前端项目。页面只负责请求接口并渲染，后端由其他同学提供。

当前默认走本地 mock，界面可独立运行；后端就绪后改环境变量即可切到真实接口。

## 在线演示

公开 mock 预览：https://nengchibawanfan.github.io/vebit-athena-omega-desk/

推送到 `main` 后会自动更新这个预览。这是前端 mock，不接真实后端。

## 启动

```bash
npm install
npm run dev
```

浏览器打开 http://localhost:5173

```bash
npm run build      # 生产构建
npm run preview    # 预览构建结果
```

## 对接后端

1. 把 `.env.development` 里的 `VITE_USE_MOCK` 改成 `false`
2. 把 `VITE_API_PROXY_TARGET` 改成后端地址，例如 `http://localhost:8080`
3. 接口路径默认是 `/api/...`，由 Vite 代理转发

生产环境使用 `.env.production`。后端未就绪时保持 `VITE_USE_MOCK=true`；接口可用后改为 `false`，并把 `VITE_API_BASE_URL` 配成线上 API 地址。

如果后端返回 `{ code: 0, data: ... }` 或 `{ success: true, data: ... }`，`src/api/http.js` 会自动取出 `data`。

## 口径

每个页面上的名词和怎么算，只看 [docs/页面名词.md](docs/页面名词.md)。不再另写接口字段文档。

所有 GET 都带查询参数 `pair`（如 `VBT/USDT`）。历史接口前端传 `days=all`（全部历史，不是 7/15/30）。

挂单明细在 REST 快照之后走 **WebSocket 实时推送**，不要靠轮询刷新整表。WS 连续失败约 4 次后会短暂降级为 REST 轮询，连上后再切回推送。

- 开发代理：`/ws` → `VITE_API_PROXY_TARGET`（已开 `ws: true`）
- 默认地址：`ws(s)://当前域名/ws/orders?pair=BTC/USDT`
- 也可设 `VITE_WS_BASE_URL`，例如 `ws://localhost:8080/ws`
- 客户端连上后发送：`{ "type": "subscribe", "channel": "orders", "pair": "BTC/USDT" }`
- 服务端推送整表：`{ "type": "snapshot", "pair": "BTC/USDT", "data": { "badge", "rows", "volumeByPrice", "cancelTop" } }`
- 或增量：`{ "type": "delta", "upserts": [...], "removes": ["id"] }`，`rows[]` 需带稳定 `id`
- `VITE_USE_MOCK=true` 时前端自己模拟推送，不连真实 WS

改接口只动 `src/api/index.js` / `src/api/ws.js`，页面不用改。

## 目录

```
src/
  api/            请求封装 + mock
  components/     侧栏、顶栏、图表
  views/          11 个业务页面
  stores/         当前交易对、本地配置
  router/         路由
  styles/         全局样式
```

原始单文件原型保留为 `test.html`，可对照查看。
