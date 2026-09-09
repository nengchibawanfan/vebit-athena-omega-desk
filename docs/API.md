# Athena Omega Desk · 后端接口约定

本文档给后端实现用。前端已按这些路径、查询参数、`data` 形状对接。字段名、单位、正负方向不要改。

**原则：代币自发行。只存在链上仓库和本所。价格由盘面控制。做市赢面 = 代币库存大致不变，USDT 增加。颜色全部前端控制，后端不要返回 `color` / hex。**

---

## 1. 通用约定

### 1.1 Base URL 与鉴权

- HTTP：`{VITE_API_BASE_URL || /api}` + 下文路径。例：`GET /api/dashboard`
- 请求头：`Authorization: Bearer <accessToken>`（来自 `localStorage.accessToken`）
- WebSocket：见 [第 7 节](#7-websocket-挂单)

### 1.2 响应信封

前端会拆 `data`。成功必须是下面两种之一：

```json
{ "code": 0, "data": { } }
```

```json
{ "success": true, "data": { } }
```

`code` 为 `0` 或 `200` 都算成功。失败：

```json
{ "code": 1, "message": "原因" }
```

HTTP 非 2xx 时用 `message` 字段。

### 1.3 查询参数（几乎每个 GET 都有）

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `pair` | string | 交易对，如 `VBT/USDT`。必填（除 `/pairs`、`/user-profile`、`PUT /user-rules`） |
| `internalAccounts` | JSON 字符串 | 内部账户清单，见下 |
| `sleepIdleDays` | number | 几天无成交算沉睡，默认 `30` |
| `date` | `YYYY-MM-DD` | 日切片。省略或等于「操盘日」= 今日 |
| `days` | string/number | 历史窗口。前端现在传 `'all'`。`all` / 缺省 / 非 `7|15|30` = **上币日起到操盘日的全部交易日** |

`internalAccounts` 示例：

```json
[
  { "uid": "88001", "type": "mm", "remark": "做市主账户" },
  { "uid": "88002", "type": "mm", "remark": "做市备用账户" },
  { "uid": "71001", "type": "treasury", "remark": "平台金库多签" },
  { "uid": "62001", "type": "project", "remark": "项目方多签" },
  { "uid": "53001", "type": "staff", "remark": "核心团队" },
  { "uid": "44001", "type": "lp", "remark": "现货底池 LP" }
]
```

`type` 只允许：`mm` | `treasury` | `project` | `staff` | `lp`。

其它常见参数：

| 参数 | 说明 |
| --- | --- |
| `whaleThreshold` | 大单阈值，单位万枚，默认 `50` |
| `depthLevels` | 盘口档位数，默认 `10` |
| `obiWarn` | OBI 告警绝对值，默认 `0.4` |
| `costDevWarn` | 成本偏离告警 `%`，默认 `20` |
| `excludedAddresses` | JSON 数组，链上排除地址 `{ address, type, remark }`，`type`: `hot_wallet` \| `lock_contract` \| `other` |
| `kind` | `exchange` \| `onchain`（流通口径） |
| `scope` | `pair` \| `all`（单 UID） |
| `robot` | JSON，机器人配置，见 `/robot-status` |

### 1.4 单位（必须统一）

| 量 | 单位 | 说明 |
| --- | --- | --- |
| 代币数量 | **万枚** | `1` = 10,000 枚 |
| USDT 金额 | **万 USDT** | `1` = 10,000 USDT |
| 价格 | 报价货币本身 | 如 `65000` 表示 1 枚 = 65000 USDT |
| 人数 / 笔数 | 整数 | 去重 UID / 成交笔 |
| 比例 | 百分数或 0–1 | 字段名带 `Pct` / `%` 的用百分数（`12.5` 表示 12.5%）；OBI 用 −1～1 |

**金额换算（生产必须用这条，不要抄 mock 里的 `/10000`）：**

```
金额(万USDT) = 数量(万枚) × 价格(USDT/枚)
```

推导：1 万枚 = 10,000 枚 × P USDT = 10,000P USDT = P 万 USDT。  
前端 mock 对 BTC 类高价 token 用了 `qty × Δprice / 10000` 把 KPI 压小，**那是演示数据，不是产品公式。**

数值建议保留 1 位小数（价格按交易对精度）。

### 1.5 状态条、标签、颜色

页面顶部 `status[]` **只给文案**，不要带颜色：

```json
{ "text": "做市库存 320.5万 · 安全区间", "break": false }
```

- `break: true` 时该条单独换行（做市历史「现价 · 库存成本」用）
- 灯色由前端根据文案和本页 KPI 自己上

表格语义标签（不是颜色）可以给：`tag` / `tagClass` / `statusTag` = `user` | `warning` | `alert` | `success` | `robot`。前端用 CSS class 上色。

**颜色全部由前端控制。** 后端不要判断、不要生成、不要返回：

- 不要 hex（`#4cd9a0` 等）
- 不要 `color` / `pnlColor` / `actionColor`
- 不要为饼图、折线、KPI、状态灯准备色值

前端根据语义自己上色：数值正负 → 赚绿亏红；`level`（紧急/预警/关注）→ 红/橙/蓝；`play` / `action` 文案 → 灯色；分档 `name`（所内活跃、沉睡、做市、深套、聪明钱…）→ 前端色板；`tag` / `key` → CSS。

### 1.6 日期

- 操盘日：交易所「今日」业务日（mock 用 `2026-08-28`，生产用服务器业务日）
- `dateKey`: `YYYY-MM-DD`
- `date`: 展示用 `MM/DD`
- 历史日表按日期**升序**给 `series`，明细表 `rows` **倒序**（最近一天在上）

---

## 2. 账本与身份（先读完再写接口）

### 2.1 谁是谁

| 名称 | 定义 |
| --- | --- |
| 做市账户 | `internalAccounts` 里 `type === 'mm'` 的 UID。默认 `88001` 主账户、`88002` 备用 |
| 真实用户 | 本所用户 **减去** mm / treasury / project / staff / lp |
| 金库等 | treasury / project / staff / lp。不直接用来买卖；可周转的账在做市账户 |
| 链上仓库 | 未充进本所的代币。不能成交，充回所内才可卖 |

### 2.2 买卖方向（整站同一套）

```
用户买入 = 做市卖出
用户卖出 = 做市买入
```

对手方表的买/卖/净一律站在 **真实用户** 一侧。做市侧字段用 `sellQty` / `buyQty`（做市自己的卖/买）。

### 2.3 做市库存与余额（可周转含借入虚增）

```
tokenInv     = tokenOwn + tokenBorrowed      // 可周转库存
cashU        = cashTrueU + cashBorrowedU     // 可周转 USDT
cashOwnU     = cashTrueU                     // 兼容旧字段，等于真实余额
tokenU       = tokenInv × lastPrice          // 库存市值，万USDT
equityU      = cashU + tokenU                // 做市资金
```

- **自有** `tokenOwn` / `cashTrueU`：账上真实有的
- **借入虚增** `tokenBorrowed` / `cashBorrowedU`：从用户侧借入记在做市账上、用来挂单周转的部分
- 做市账户只讲 **库存成本**，不讲持仓均价；算法见 2.7
- 真实用户只讲 **持仓均价**，不讲库存成本；算法见 2.6

### 2.4 库存安全带

做市库存占「交易所内流通」的比例：

```
robotInv% = tokenInv / 交易所内流通 × 100
```

| 区间 | 文案 |
| --- | --- |
| `< 40%` | 库存偏低 |
| `40%–60%` | 安全区间 |
| `> 60%` | 库存偏高 |

前端配置还有 `inventoryLow=20` / `inventoryHigh=80`，**产品口径以 40/60 为准**，阈值后端可配置。

### 2.5 沉睡 / 活跃 / 流通

```
沉睡用户     = 真实用户中，最近一次成交距今 ≥ sleepIdleDays 天
活跃用户     = 其余真实用户持仓
所内可卖     = 活跃 + 沉睡                         // 不含做市、不含金库等
交易所内流通 = 所内可卖 + 做市库存
链上仓库     = 未充进本所的流通代币
总流通       = 交易所内流通 + 链上仓库
真实浮动     = 所内可卖 + 链上仓库                  // 不含做市
```

链上沉睡：该地址 ≥ `sleepIdleDays` 天无转入转出。

### 2.6 真实用户持仓均价

和做市库存成本是同一套移动加权：货进来按入库价加权，货出去只减数量、不改成本。对象是每个真实 UID 的所内剩余持仓。不含做市 / 金库 / 项目方 / 员工 / LP。

| 事件 | 数量 | 持仓均价 |
| --- | --- | --- |
| 买入成交 | + | 按成交价加权入库 |
| 充值到账 | + | 按到账现价加权入库 |
| 卖出成交 | − | 只减数量，不重算 |
| 提现 | − | 只减数量，不重算 |

```
入库后均价 = (旧均价 × 旧数量 + 本次入库量 × 入库价) / (旧数量 + 本次入库量)
出库后数量 = max(0, 旧数量 − 出库量)     // 均价不变
持仓均价   = Σ(该 UID 剩余数量 × 入库价) / Σ剩余数量
浮盈亏(万) = 剩余数量(万) × (现价 − 均价)
偏离%      = (现价 − 均价) / 均价 × 100
```

群体持仓均价 = 各 UID 按剩余数量加权。`GET /holders` 的 `kpis.avgCost`、价格台阶 / 总览上的用户均价都用这个数。

### 2.7 做市账户库存成本

算法与 2.6 相同，只是记账对象是做市**自有库存** `tokenOwn`。可周转库存 `tokenInv = tokenOwn + tokenBorrowed` 用来挂单，但**虚增不进成本**。

| 事件 | 数量 | 库存成本 |
| --- | --- | --- |
| 买入成交 | 自有 + | 按成交价加权入库 |
| 充值到账 | 自有 + | 按到账现价加权入库 |
| 卖出成交 | 可周转 −（先虚增、再自有） | 碰到自有只减数量，不重算 |
| 提现 | 自有 − | 只减数量，不重算 |
| 虚增（借入） | `tokenBorrowed` + | 不动成本 |
| 还款 | `tokenBorrowed` − | 不动成本 |

```
入库后成本 = (旧成本 × 旧自有库存 + 本次入库量 × 入库价) / (旧自有库存 + 本次入库量)
出库后自有 = max(0, 旧自有 − 出库量)     // 成本不变
库存成本   = 自有剩余存货的移动加权成本
偏离%      = (现价 − 库存成本) / 库存成本 × 100
```

不要把虚增按 0 或现价混进加权：按 0 会把成本砸垮，按现价会让成本和现价缠在一起。`stance.mmCost`、`dump.invCost`、历史日 `invCost` 都是这个自有库存成本。小时序列 `costHour[i]` 为该小时末的同一口径。

---

## 3. 核心计算公式（所有交易 KPI 共用）

以下数量均为万枚，金额均为万 USDT，价格为 USDT/枚。

### 3.1 成交均价

某时段做市侧：

```
avgSell = Σ(卖出数量 × 成交价) / Σ卖出数量     // 做市卖出 = 用户买入
avgBuy  = Σ(买入数量 × 成交价) / Σ买入数量     // 做市买入 = 用户卖出
spreadPct = (avgSell − avgBuy) / avgBuy × 100
```

真实用户侧均买/均卖与做市对调：用户均买 ≈ 做市均卖。

### 3.2 真实交易量与做市盈亏

```
matched  = min(buyQty, sellQty)          // 真实交易量：买卖重叠
netQty   = buyQty − sellQty              // 净库存变动；>0 做市多买了货
sellU    = sellQty × avgSell             // 卖出金额
buyU     = buyQty × avgBuy               // 买入金额
usdtNet  = sellU − buyU                  // USDT 净增加；赢面看这个

realizedU = matched × (avgSell − avgBuy) // 交易盈亏：对倒部分的价差
markCost  = netQty ≥ 0 ? avgBuy : avgSell
floatU    = netQty × (lastPrice − markCost)  // 存货浮盈：净腿按现价
totalU    = realizedU + floatU           // 当日/区间盈亏
```

库存成本按 2.7：只对自有库存做移动加权，买入 / 充值入库，卖出 / 提现 / 还款不改成本。日终 `invCost` 用当日全部入库事件滚完后的自有成本，不是只用当日均买近似。

### 3.3 人数与笔数

- `sellUsers` / `buyUsers`：当日（或区间去重）真实 UID 数。做市卖出对应 **用户买入人数**
- `sellFills` / `buyFills`：成交笔数
- `realUsers`：当日有成交的真实 UID 去重
- `holders`：所内仍持有该代币的真实 UID 数
- `tradedPct` = `realUsers / holders × 100`
- `newTraders`：当日首次在本所成交该币的真实 UID
- `returning` = `realUsers − newTraders`

### 3.4 对手方（真实用户侧）

```
realBuy  = 真实用户买入量 = 做市卖出量（排除自成交后）
realSell = 真实用户卖出量 = 做市买入量
realNet  = realBuy − realSell            // 正数 = 用户在吸货 = 做市在出货
```

标签拆分（聪明钱 / 散户 / 羊毛党 / 程序化 / KOL）按 [5.26 PUT /user-rules](#526-put-user-rules) 规则把 UID 打标后，对该标签内成交加总。同一 UID 可多标签，**成交量不要重复计入多个标签的合计**（主标签优先：聪明钱 > 程序化 > KOL > 羊毛党 > 散户）。

### 3.5 价格台阶预估卖出

对每个真实用户持仓，相对台阶价 `P`：

```
pnl% = (P − 持仓均价) / 持仓均价 × 100
x    = |pnl%|
卖出比例 = 
  x ≤ 0  → 0
  x ≤ 5  → (x / 5) × 10%
  x ≤ 10 → 10% + (x − 5) / 5 × 10%
  x ≤ 30 → 20% + (x − 10) / 20 × 10%
  x > 30 → 30%
预估卖出 = 持仓数量 × 卖出比例
```

口算锚点：浮盈/浮亏 5% ≈ 卖 10% 仓，10% ≈ 卖 20%，30% ≈ 卖 30%。

预估买入（该档）= 该档及更优价位上、真实用户已挂买单数量（**不计未挂单闲置 USDT**）。

```
expectedBuyU  = expectedBuy × P
expectedSellU = expectedSell × P
youDump   = min(做市库存, expectedBuy)
youAbsorb = min(expectedSell, 做市USDT余额 / P)
cover%    = expectedBuyU / expectedSellU × 100   // 上限 999
```

台阶判定：

- 上档（`pct > 0`）：`expectedBuy ≥ max(做市库存 × 0.2, 1)` → `可卖出`，否则 `对手接不住`
- 下档（`pct < 0`）：`做市USDT ≥ expectedSellU × 0.55` → `可买入`，否则 `余额不够`
- 现价：`expectedBuy ≥ expectedSell` → `可卖出`，否则 `可买入`

### 3.6 OBI（剔除做市挂单）

近端 `depthLevels` 档：

```
realBid = 真实用户买单量
realAsk = 真实用户卖单量
realObi = (realBid − realAsk) / (realBid + realAsk)     // −1～1
grossObi = 含做市挂单的同样公式
bidAskRatio = realBid / realAsk
```

`|realObi| ≥ obiWarn` 告警。文案：`≥0.35` 买盘强势，`≥0.15` 买盘偏厚，`≤−0.35` 卖盘强势，`≤−0.15` 卖盘偏厚，否则买卖均衡。

### 3.7 充提

只统计真实用户、该代币。做市/金库等 UID 的充提不算「所内可卖供给」。

```
depositAmt / withdrawAmt     // 万枚
depositU = depositAmt × 当日现价（或到账时现价）
netAmt = depositAmt − withdrawAmt
```

大单：单笔数量 ≥ `whaleThreshold` 万枚。

---

## 4. 接口总表（前端正在用）

| 方法 | 路径 | 页面 |
| --- | --- | --- |
| GET | `/pairs` | 交易对选择 |
| GET | `/dashboard` | 今日总览 |
| GET | `/ops/desk` | 做市今日 + 价格台阶 + 真实用户资产块 |
| GET | `/desk/mm/history` | 做市历史 · 资产半边 |
| GET | `/ops/dump/history` | 做市历史 · 交易半边 |
| GET | `/desk/users` | 真实用户今日 · 交易 |
| GET | `/desk/users/history` | 真实用户历史 · 交易 |
| GET | `/ops/absorb/history` | 真实用户历史 · 资产 |
| GET | `/orderbook` | 买卖墙深度图 |
| GET | `/orders` | 挂单快照 |
| WS | `/ws/orders` | 挂单实时 |
| GET | `/orderbook/blocks` | 盘口大单 |
| GET | `/orderbook/obi` | 厚度 |
| GET | `/position/cost-dev` | 偏离 |
| GET | `/robot-status` | 机器人运行状态 |
| GET | `/holders` | 真实用户持仓均价 |
| GET | `/circ/supply` | 所内流通 / 链上仓库 |
| GET | `/whales/exchange` | 今日充提 |
| GET | `/whales/exchange/history` | 历史充提 |
| GET | `/external-chips` | 链上仓库明细 |
| GET | `/internal-chips` | 金库等 |
| GET | `/address-detail` | 链上地址 |
| GET | `/exchange-user` | 单 UID |
| GET | `/alerts` | 报警 |
| GET | `/user-profile` | 对手盘总览 |
| GET | `/user-profile/{type}` | 散户/聪明钱/羊毛党/KOL/程序化 |
| PUT | `/user-rules` | 保存标签规则 |

可选、前端暂不请求：`GET /desk/mm`（做市今日资产已嵌在 `/ops/desk.mmToday`）。

遗留、页面已并入其它入口，可不实现：`/position` `/risk` `/macro` `/chips/float` `/whales/onchain` `/stable-profit` `/trade-risk`。

---

## 5. 接口详情

### 5.1 GET `/pairs`

**请求：** 无查询参数。

**返回 `data`：** 字符串数组。

```json
["VBT/USDT", "BXT/USDT"]
```

---

### 5.2 GET `/dashboard`

**Query：** `pair`, `internalAccounts`, `sleepIdleDays`

总览。嵌一套完整 `ops`（同 `/ops/desk`），以及流通拆分。

**计算：** 第 2.5、3.2、3.6 节。`kpis` 里流通数字全部万枚。

```json
{
  "kpis": {
    "floatSupply": "1280.5",
    "floatSupplySub": "占总流通 72.1% · 不含做市",
    "circSupply": "1776.0",
    "circSupplySub": "真实浮动 + 做市库存",
    "floatOfCirc": 72.1,
    "circExchange": 1420.0,
    "circOnchain": 356.0,
    "circExchangePct": 80.0,
    "circOnchainPct": 20.0,
    "mmQty": 320.5,
    "mmOfExch": 22.6,
    "exchUser": 1099.5,
    "activeFloat": 900.0,
    "activeFloatSub": "占流通 50.7%",
    "activeExchange": 720.0,
    "activeOnchain": 180.0,
    "activeOfCirc": 50.7,
    "activeExchangeOfCirc": 40.5,
    "activeOnchainOfCirc": 10.1,
    "sleepExchange": 379.5,
    "sleepOnchain": 176.0,
    "sleepTotal": 555.5,
    "sleepOfFloat": 43.4,
    "sleepOfCirc": 31.3,
    "sleepExchangeOfCirc": 21.4,
    "sleepOnchainOfCirc": 9.9,
    "sleepExchangePct": 34.5,
    "sleepOnchainPct": 49.4,
    "sleepIdleDays": 30,
    "obi": "+0.32",
    "obiSub": "近端买盘偏厚",
    "priceDev": "+8.4%",
    "priceDevSub": "相对持仓均价 0.8620",
    "activeOrder": "128",
    "activeOrderSub": "真实用户挂单",
    "robotInv": 22.6,
    "robotInvSub": "做市账户库存 · 安全区间",
    "robotInvAmount": 320.5,
    "external": 20.0,
    "externalSub": "链上仓库",
    "externalAmount": 356.0,
    "internalPct": 80.0,
    "internalAmount": 1420.0,
    "ownedPct": 57.4,
    "ownedAmount": 1020.0
  },
  "mm": { "注释": "同 3.2 做市当日对象，字段见 5.3 dump / mmToday.kpis" },
  "users": { "注释": "同 5.6 kpis 的成交部分" },
  "ops": { "注释": "完整 GET /ops/desk" },
  "depth": [],
  "cost": [],
  "dashWhale": [],
  "whaleAlert": [],
  "alertSummary": [],
  "alertItems": [],
  "costBadge": ""
}
```

`mm` 必填字段：`lastPrice, equityU, tokenOwn, tokenBorrowed, tokenInv, tokenU, cashU, cashTrueU, cashOwnU, cashBorrowedU, buyQty, sellQty, buyU, sellU, netQty, matchedQty, avgBuy, avgSell, spreadPct, usdtNet, realizedU, floatU, totalU, bandStatus, online`

`users` 必填：`realUsers, holders, tradedPct, realBuy, realSell, realBuyU, realSellU, realNet, newTraders, retailBuy, retailSell, retailNet, smartBuy, smartSell, smartNet`

图表数组 (`depth` / `cost` / `dashWhale`) 前端总览主要读 `ops.ladder` 和 KPI，可给空数组，但不要删键。

---

### 5.3 GET `/ops/desk`

**Query：** `pair`, `sleepIdleDays`, `internalAccounts`, `date?`

**页面：** 做市账户今日（`date` 空或今日）、价格台阶、真实用户今日的资产 KPI（买墙/USDT/分档）。

`date` 不是今日时，`dump` / `absorb` / `users` 切到那一天，`isToday=false`。

#### `data` 顶层

| 字段 | 说明 |
| --- | --- |
| `stance` | 现价、用户均价偏离、做市库存成本偏离、建议动作 |
| `dump` | 做市当日交易 + 库存 + 余额 |
| `absorb` | 真实用户资产（USDT、代币、买墙卖墙、充值、现金分档） |
| `users` | 真实用户人数/买卖（可被 `date` 覆盖） |
| `ladder` | 价格台阶 `[-20,-10,-5,0,5,10,20]` |
| `mmToday` | 分 UID 做市账 + 24h 序列 |
| `ammo` | 弹药摘要 |
| `history` | 近 30 日用户持仓/做市库存/USDT 序列 |
| `ladderBlurb` / `ladderGloss` | 台阶说明文案 |

#### `stance`

```
devPct   = (现价 − 真实用户持仓均价) / 均价 × 100
mmDevPct = (现价 − 做市库存成本) / 库存成本 × 100
```

`action` 建议：偏离很大且买墙接不住 → `先别拉`；否则按台阶 `play` 汇总。给得出原因 `actionWhy`。灯色前端根据 `action` 文案上，**不要**返回 `actionColor`。

| 字段 | 类型 | 计算 |
| --- | --- | --- |
| `action` | string | 建议动作文案。前端据此上灯，不要另给颜色 |
| `actionWhy` | string | |
| `lastPrice` | string/number | 现价 |
| `avgCost` | string/number | 真实用户持仓均价 |
| `devPct` | number | 相对用户均价偏离 % |
| `mmCost` | number | 做市库存成本 |
| `mmLast` | number | 现价（数值） |
| `mmDevPct` | number | 相对库存成本偏离 % |
| `nextStop` / `nextStopPrice` | | 上档第一个不能「可卖出」的台阶 |
| `nextFloor` / `nextFloorPrice` | | 下档最后一个「可买入」的台阶 |

#### `dump`（做市今日）

方向都是 **做市自己的买卖**。

| 字段 | 计算 |
| --- | --- |
| `dumpable` / `ownedAmt` | `tokenInv` |
| `tokenOwn` / `tokenBorrowed` | 自有 / 借入虚增 |
| `dumpableU` / `tokenU` | `tokenInv × lastPrice` |
| `ownUsdt` / `cashU` | 可周转 USDT |
| `cashTrueU` / `cashOwnU` / `cashBorrowedU` | 真实 / 真实 / 借入 |
| `sellHigh` | 做市卖出量 = 用户买入 |
| `buyLow` | 做市买入量 = 用户卖出 |
| `matched` | `min(sellHigh, buyLow)` |
| `avgSell` / `avgBuy` | 做市卖/买均价 |
| `usdtIn30` / `sellU` | `sellHigh × avgSell`（字段名带 30 是历史包袱，**今日接口里表示当日**） |
| `usdtOut30` / `buyU` | `buyLow × avgBuy` |
| `usdtNet30` | `usdtIn30 − usdtOut30` |
| `tokenDelta` / `netQty` | `buyLow − sellHigh` |
| 交易均价（前端展示） | `tokenDelta > 0` 显示 **买入均价** `avgBuy`；`< 0` 显示 **卖出均价** `avgSell`；`= 0` 显示 `--` |
| `realizedU` / `floatU` / `totalU` | 第 3.2 节 |
| `spreadPct` | `(avgSell−avgBuy)/avgBuy×100` |
| `invCost` | 当日结束库存成本 |
| `lastPrice` | 该日收盘/当前现价 |
| `realBuy` / `realSell` / `realNet` | 用户侧，第 3.4 节 |
| `retailBuy` 等 | 用户侧按标签 |
| `sellUsers` / `buyUsers` / `sellFills` / `buyFills` | 用户买人数 = 做市卖的对手人数 |
| `hours` | `["00:00", …, "23:00"]` |
| `sellHour` / `buyHour` | 各小时做市卖/买，加总分别等于 `sellHigh` / `buyLow` |
| `lastHour` / `costHour` / `netHour` | 各小时末现价、库存成本、净库存 |
| `fills` | 成交明细，见下 |
| `dateKey` / `dateLabel` / `dateTitle` / `isToday` | 日切片元数据 |

`fills[]`：

```json
{
  "time": "14:22:08",
  "side": "卖出",
  "sideClass": "alert",
  "qty": 2.4,
  "price": 0.9124,
  "usdt": 2.19,
  "uid": "104821",
  "tag": "散户",
  "tagClass": "warning"
}
```

`side` 是 **做市** 的卖出/买入。`usdt = qty × price`（这里 qty 已是万枚，usdt 为万 USDT）。`fills` 两边数量加总应对齐 `sellHigh` / `buyLow`。

#### `absorb`（真实用户资产）

| 字段 | 计算 |
| --- | --- |
| `userCashU` | 真实用户该所 USDT 余额合计（万） |
| `userToken` | 真实用户该币持仓合计（万枚）= 所内可卖 |
| `userTokenU` | `userToken × lastPrice` |
| `assetsU` | `userCashU + userTokenU` |
| `holders` | 持仓人数 |
| `newMoneyU` / `oldMoneyU` | 近 N 日新充进所的 USDT / 其余；和为 `userCashU` |
| `bid2Qty` / `bid5Qty` / `bid10Qty` | 现价下 2% / 5% / 10% 真实买墙量 |
| `ask2Qty` / `ask5Qty` / `ask10Qty` | 现价上对称卖墙 |
| `bid2U` 等 | 对应数量 × 该档价格（或现价近似） |
| `inboundQty` | 当日净充值万枚（真实用户） |
| `realObi` | 字符串，如 `+0.32` |
| `coverDump` | `bid5U / dumpableU × 100`，上限 999 |
| `cashBands` | USDT 分档 |

`cashBands[]`：

```json
{ "name": "<1万USDT", "users": 80, "cashU": 12.4 }
```

分档：`<1万` / `1–10万` / `10–50万` / `≥50万`。`users` 与 `cashU` 各自加总 = `holders` 与 `userCashU`。

#### `ladder[]` 一档

| 字段 | 计算 |
| --- | --- |
| `pct` | `-20` … `20` |
| `side` | `up` / `down` / `spot` |
| `label` | `现价` / `+10%` / `-5%` |
| `price` | `last × (1 + pct/100)` |
| `profitAmt` | 持仓均价 `< price` 的数量 |
| `lossAmt` | 其余 |
| `profitPct` / `lossPct` | 占 `userToken` |
| `expectedSell` / `expectedBuy` | 第 3.5 节 |
| `expectedSellU` / `expectedBuyU` | × 该档价格 |
| `netQty` | `expectedBuy − expectedSell` |
| `cover` | 覆盖率 % |
| `youDump` / `youAbsorb` | 做市最多能卖/能买 |
| `play` | `可卖出` / `可买入` / `对手接不住` / `余额不够` / `看` |
| `playKind` | `ok` / `no` / `watch` |
| `playWhy` / `whySell` / `whyBuy` | 说明 |
| `sellBands` | 按浮盈浮亏分档的预估卖出 |
| `buyBands` | 至少 `{ key:"wall", kind:"wall", label:"已挂单买墙", buyAmt, buyPct }` |
| `wallQty` / `askQty` / `bookQty` | 该档真实买墙、卖墙、合计 |
| `chipName` / `chipAmt` / `chipPct` / `chipUsers` | 上档显示浮盈，下档显示被套 |
| `stance` | 同 `play` |

`sellBands[]`：`key, label, short, kind(profit|loss), holdAmt, sellAmt, holdPct, sellPct`

`ladderGloss`：

```json
{
  "upSell": "到了这个价格，浮盈账户按盈利率兑现一部分仓位。赚得越多，可能卖出的仓位比例越高。",
  "upSellRates": [{ "pnl": "5%", "pct": 10 }, { "pnl": "10%", "pct": 20 }, { "pnl": "30%", "pct": 30 }],
  "downSell": "到了这个价格，浮亏账户按亏损率砍掉一部分仓位。亏得越多，可能卖出的仓位比例越高。",
  "downSellRates": [{ "pnl": "5%", "pct": 10 }, { "pnl": "10%", "pct": 20 }, { "pnl": "30%", "pct": 30 }]
}
```

#### `mmToday`

| 字段 | 说明 |
| --- | --- |
| `kpis` | 同做市当日 `mm`，另加 `cashPct = cashU / equityU × 100` |
| `status` | 状态条 |
| `history` | `{ hours, buyHour, sellHour, invHour, realizedHour, floatHour, netHour, spread }`；小时序列加总/期末对齐当日 |
| `accounts[]` | 每个做市 UID |
| `capital` / `book` / `cashBook` | 饼图：现金 vs 代币市值；自有 vs 借入；真实 vs 借入 USDT |

`accounts[]`：

```json
{
  "uid": "88001",
  "remark": "做市主账户",
  "role": "主报价",
  "strategy": "quote",
  "strategyLabel": "做市报价",
  "running": true,
  "online": true,
  "status": "运行中",
  "statusTag": "success",
  "amount": 180.2,
  "tokenOwn": 120.0,
  "tokenBorrowed": 60.2,
  "cashU": 40.0,
  "cashTrueU": 28.0,
  "cashOwnU": 28.0,
  "cashBorrowedU": 12.0,
  "tokenU": 164.0,
  "buyFill": 88.0,
  "sellFill": 92.0,
  "netQty": -4.0,
  "ratio": 56.2,
  "washOn": true
}
```

各账户 `tokenInv` / `cashU` / `buyFill` / `sellFill` 加总应等于做市合计。

`realizedHour` 为从 0 点累计的交易盈亏；`floatHour` / `netHour` 为截至该小时的存货浮盈 / 净库存。

#### `ammo`

```json
{
  "ownedAmt": 320.5,
  "dumpable": 320.5,
  "borrowedAmt": 110.0,
  "mmCashU": 86.4,
  "ownedPct": 12.4,
  "lockedRatio": 40,
  "treasuryAmt": 200.0
}
```

---

### 5.4 GET `/ops/dump/history`

**Query：** `pair`, `days=all`, `internalAccounts`

做市历史 **交易**。前端与 `/desk/mm/history` 并行请求，拼在同一页。

**计算：** 上币日（或全部历史）每一自然日跑一遍 3.2。区间 KPI 用区间合计的 `buyQty/sellQty` 再算一遍 `calcMmTradingPnl`，均价为数量加权，现价用最后一日。

```json
{
  "range": 30,
  "pair": "VBT/USDT",
  "base": "VBT",
  "quote": "USDT",
  "kpis": {
    "periodSell": 2100.0,
    "periodBuy": 1980.0,
    "periodSellU": 1915.2,
    "periodBuyU": 1782.0,
    "periodToken": -120.0,
    "periodUsdt": 133.2,
    "avgSpread": 1.24,
    "matched": 1980.0,
    "realizedU": 24.6,
    "floatU": 8.1,
    "totalU": 32.7,
    "avgSell": 0.9120,
    "avgBuy": 0.9000,
    "sellUsers": 86,
    "buyUsers": 72,
    "sellFills": 420,
    "buyFills": 360,
    "retailBuy": 1200, "retailSell": 1100, "retailNet": 100,
    "smartBuy": 180, "smartSell": 200, "smartNet": -20,
    "realBuy": 2100, "realSell": 1980, "realNet": 120,
    "endSell": 88, "endBuy": 80, "endSpread": 1.1,
    "endUsdt": 6.4, "endAvgSell": 0.91, "endAvgBuy": 0.90,
    "endLast": 0.9124, "endCost": 0.8880
  },
  "status": [
    { "text": "USDT 净增加 +133.2万 · 今日 +6.4万" },
    { "text": "卖出 2100 / 买入 1980万VBT · 代币净 -120" },
    { "break": true, "text": "现价 0.9124 · 库存成本 0.8880" }
  ],
  "series": {
    "dates": ["08/01", "08/02"],
    "sellQty": [], "buyQty": [], "usdtNet": [], "spreadPct": [],
    "tokenDelta": [], "lastPrice": [], "invCost": [], "netQty": []
  },
  "rows": [
    {
      "date": "08/28",
      "dateKey": "2026-08-28",
      "sellQty": 88, "buyQty": 80,
      "avgSell": 0.912, "avgBuy": 0.90, "spreadPct": 1.33,
      "sellU": 80.3, "buyU": 72.0, "usdtNet": 8.3,
      "tokenDelta": -8, "netQty": -8,
      "realizedU": 1.1, "lastPrice": 0.9124, "invCost": 0.888
    }
  ]
}
```

`periodToken = periodBuy − periodSell`。`periodUsdt = Σ usdtNet`。`realBuy` 区间 = `periodSell`（用户买 = 做市卖）。

交易均价（前端展示，与做市今日同一口径）：`periodToken > 0` 显示 **买入均价** `avgBuy`；`< 0` 显示 **卖出均价** `avgSell`；`= 0` 显示 `--`。

每日明细还用于：卖出金额 `sellU`、买入金额 `buyU`、净买入 `tokenDelta`、已实现盈亏 `realizedU`。

---

### 5.5 GET `/desk/mm/history`

**Query：** `pair`, `days=all`, `internalAccounts`

做市历史 **资产**。每日收盘快照。

```
当日 equityU = cashU + tokenU
区间 equityChange = 末日 equity − 首日 equity
invChange = 末日 tokenInv − 首日 tokenInv
periodBuy / periodSell = Σ 当日做市买/卖
periodNet = periodBuy − periodSell
periodRealized = Σ 当日 realizedU
cashPct = cashU / equityU × 100
```

```json
{
  "range": 30,
  "pair": "VBT/USDT",
  "base": "VBT",
  "quote": "USDT",
  "kpis": {
    "startEquity": 400, "endEquity": 460,
    "equityChange": 60, "equityChangePct": 15.0,
    "startInv": 300, "endInv": 320.5, "invChange": 20.5,
    "maxInv": 340, "minInv": 280,
    "endCash": 86.4, "endTokenU": 292.0,
    "endTokenOwn": 210, "endTokenBorrowed": 110.5,
    "endCashTrue": 70, "endCashOwn": 70, "endCashBorrowed": 16.4,
    "endCashPct": 22.8, "avgCashPct": 21.0,
    "periodBuy": 1980, "periodSell": 2100, "periodNet": -120,
    "periodRealized": 24.6,
    "bandStatus": "安全区间"
  },
  "status": [],
  "series": {
    "dates": [],
    "equityU": [], "cashU": [], "cashTrueU": [], "cashBorrowedU": [],
    "tokenU": [], "tokenInv": [], "tokenOwn": [], "tokenBorrowed": [],
    "buyQty": [], "sellQty": [], "netQty": [], "cashPct": [], "realizedU": []
  },
  "rows": [],
  "accounts": [
    {
      "uid": "88001",
      "remark": "做市主账户",
      "role": "主报价",
      "rows": []
    }
  ]
}
```

`rows[]` 每日字段与 `series` 同名，外加 `date` / `dateKey`。`accounts[].rows` 是该 UID 的日切片，各 UID 同日加总 = 总表该日。

---

### 5.6 GET `/desk/users`

**Query：** `pair`, `internalAccounts`, `date?`

真实用户 **今日交易**。资产 KPI 前端会再请求 `/ops/desk` 取 `absorb`。持仓均价、沉睡筹码、用户筹码明细、收益率分档请求 `GET /holders`。页面 KPI 全部放在顶部。收益率分档用 `pnlBuckets`：`(现价 − 持仓均价) / 均价`，档为深套≥15% / 浅套0～15% / 小赚0～15% / 大赚≥15%。USDT 余额分档不再展示。

买卖是 **用户侧**。

| 字段 | 计算 |
| --- | --- |
| `realBuy` / `realSell` / `realNet` | 用户买/卖/净买 |
| `avgBuy` | 用户买入均价 ≈ 做市均卖 |
| `avgSell` | 用户卖出均价 ≈ 做市均买 |
| `avgTicket` | `(realBuy + realSell) / realUsers` |
| `buyUsers` / `sellUsers` | 买/卖人数 |
| `buyHour` / `sellHour` | 用户买/卖小时序列，加总对齐日合计；页面不再用分时买卖量 |
| `priceFlow` | 当日用户买/卖按成交价分档，数量加总对齐 `realBuy` / `realSell` |

```json
{
  "kpis": {
    "realUsers": 48, "holders": 128, "tradedPct": 37.5,
    "realBuy": 80, "realSell": 72, "realBuyU": 73, "realSellU": 64.8,
    "realNet": 8, "newTraders": 5, "returning": 43,
    "buyUsers": 26, "sellUsers": 24, "avgTicket": 3.17,
    "avgBuy": 0.912, "avgSell": 0.900, "lastPrice": 0.9124,
    "retailBuy": 50, "retailSell": 46, "retailNet": 4,
    "smartBuy": 10, "smartSell": 12, "smartNet": -2
  },
  "status": [],
  "history": {
    "hours": ["00:00"],
    "buyHour": [], "sellHour": [],
    "userHour": [],
    "newHour": []
  },
  "priceFlow": {
    "labels": ["0.890"],
    "prices": [0.890],
    "buy": [6.2],
    "sell": [4.1],
    "lastPrice": 0.9124,
    "avgBuy": 0.912,
    "avgSell": 0.900
  },
  "tags": [
    {
    { "name": "散户", "className": "warning",
      "users": 30, "ratio": 62.5, "buy": 50, "sell": 46, "net": 4
    }
  ],
  "traders": [
    {
      "uid": "104821", "tag": "散户", "tagClass": "warning",
      "buy": 12.4, "sell": 3.1, "net": 9.3,
      "trades": 14, "avgPrice": 0.91,
      "firstTime": "09:12", "kind": "回流"
    }
  ]
}
```

`userHour[i]` = 该小时有成交的真实 UID 数。`newHour` 加总 = `newTraders`。`priceFlow.buy` 加总 = `realBuy`，`priceFlow.sell` 加总 = `realSell`，横轴是成交价档。`tags[].ratio` = 该标签人数 / `realUsers × 100`。`traders` 按净买入绝对值取前约 10 名。`kind`: `新增` | `回流`。

---

### 5.7 GET `/desk/users/history`

**Query：** `pair`, `days=all`, `internalAccounts`

```
periodBuy / periodSell / periodNet = Σ 每日用户买/卖/净
periodBuyU / periodSellU = Σ 每日买/卖金额（万 USDT）
avgBuy = Σ(realBuy × 当日用户均买价) / periodBuy     // 用户买入均价 ≈ 做市均卖
avgSell = Σ(realSell × 当日用户均卖价) / periodSell   // 用户卖出均价 ≈ 做市均买
periodNew = Σ newTraders（按日加总，允许同一人多日计多次；若能做 UID 去重更好，需在 status 里写明口径）
userChange = 末日 realUsers − 首日 realUsers
holdQty = 当日所内真实用户持仓数量（万枚）
avgCost = 当日真实用户加权持仓均价
```

```json
{
  "range": 30, "pair": "VBT/USDT", "base": "VBT",
  "kpis": {
    "endUsers": 48, "startUsers": 40, "userChange": 8,
    "avgUsers": 44, "maxUsers": 52, "minUsers": 36,
    "endHolders": 128, "endTradedPct": 37.5,
    "periodNew": 60, "periodBuy": 2100, "periodSell": 1980, "periodNet": 120,
    "periodBuyU": 1915.2, "periodSellU": 1782.0,
    "avgBuy": 0.912, "avgSell": 0.900,
    "endAvgTicket": 3.17, "endNet": 8
  },
  "status": [],
  "series": {
    "dates": [], "realUsers": [], "holders": [], "newTraders": [],
    "realBuy": [], "realSell": [], "realNet": [], "tradedPct": []
  },
  "rows": [
    {
      "date": "08/28", "dateKey": "2026-08-28",
      "realUsers": 48, "holders": 128, "newTraders": 5,
      "holdQty": 1099.5, "avgCost": 0.842,
      "realBuy": 80, "realSell": 72, "realNet": 8,
      "realBuyU": 73, "realSellU": 64.8,
      "avgBuy": 0.912, "avgSell": 0.900,
      "tradedPct": 37.5
    }
  ]
}
```

---

### 5.8 GET `/ops/absorb/history`

**Query：** `pair`, `days=all`, `internalAccounts`, `sleepIdleDays`

真实用户历史 **资产**（每日收盘）。

```
assetsU = cashU + tokenU
tokenU  = tokenQty × 该日现价
cashPct = cashU / assetsU × 100
```

```json
{
  "range": 30, "pair": "VBT/USDT", "base": "VBT",
  "kpis": {
    "endCash": 220, "startCash": 180, "cashChange": 40,
    "endToken": 1099.5, "startToken": 1000, "tokenChange": 99.5,
    "endTokenU": 1003, "endAssets": 1223, "startAssets": 1100,
    "assetsChange": 123, "assetsChangePct": 11.2,
    "endHolders": 128, "startHolders": 120, "holderChange": 8,
    "endCashPct": 18.0
  },
  "status": [],
  "series": {
    "dates": [], "cashU": [], "tokenQty": [], "tokenU": [],
    "assetsU": [], "holders": [], "cashPct": []
  },
  "rows": [
    {
      "date": "08/28", "dateKey": "2026-08-28",
      "cashU": 220, "tokenQty": 1099.5, "tokenU": 1003,
      "assetsU": 1223, "holders": 128, "cashPct": 18.0
    }
  ]
}
```

---

### 5.9 GET `/orderbook`

**Query：** `pair`, `levels`（档位数）

买卖墙深度图。**必须剔除做市 UID 挂单。**

```json
{
  "bid": [80, 180, 320, 200, 90],
  "ask": [50, 90, 140, 280, 400],
  "footprintBuy": [12, 8, 15],
  "footprintSell": [9, 11, 7],
  "footprintWash": [1, 0, 2],
  "obiData": [0.12, 0.18, 0.22],
  "rows": [
    {
      "price": "0.918",
      "side": "卖",
      "tag": "user",
      "amount": 12.4,
      "account": "用户 6***1",
      "time": "14:22:01",
      "cancels": 0,
      "filled": 1.2
    }
  ]
}
```

- `bid` / `ask`：从近到远各档数量（万枚），长度 ≈ `levels`
- `footprint*`：近期时间桶的 taker 买/卖/自成交
- `obiData`：与 footprint 同长度的 OBI
- `rows`：前约 20 档挂单；`side`: `买`|`卖`；`tag`: `user`|`robot`

---

### 5.10 GET `/orders`

**Query：** `pair`

挂单明细页首屏快照，随后改走 WebSocket。剔除做市。

```json
{
  "badge": "共36笔挂单 · 实时",
  "rows": [
    {
      "id": "ord-88001-1",
      "price": "0.918",
      "side": "卖",
      "tag": "user",
      "amount": 12.4,
      "account": "用户 6***1",
      "time": "14:22:01",
      "cancels": 2,
      "filled": 1.2
    }
  ],
  "volumeByPrice": {
    "labels": ["0.900", "0.910"],
    "buy": [20.0, 8.0],
    "sell": [0, 15.0]
  },
  "cancelTop": {
    "labels": ["6***1", "机器人 #F4"],
    "values": [8, 5]
  },
  "ts": 1750000000000
}
```

`id` 必须稳定，WS 增量靠它更新/删除。`volumeByPrice` 按价格汇总未成交量。`cancelTop` 撤单次数 Top 5。

---

### 5.11 GET `/orderbook/blocks`

**Query：** `pair`, `whaleThreshold`, `internalAccounts`

盘口大额成交。真实 UID，数量 ≥ 阈值，不含做市。

```
buyAmt / sellAmt     // 大额买/卖万枚
tradeNet = buyAmt − sellAmt
tradeVolume = buyAmt + sellAmt
amountU = amount × lastPrice
```

```json
{
  "pair": "VBT/USDT",
  "base": "VBT",
  "lastPrice": 0.9124,
  "kpis": {
    "buyAmt": 180, "buyU": 164, "buyCount": 6,
    "sellAmt": 120, "sellU": 109, "sellCount": 4,
    "tradeNet": 60, "tradeNetU": 55,
    "tradeVolume": 300, "tradeVolumeU": 273,
    "alertCount": 2, "pending": 5,
    "maxImpact": 1.8, "maxImpactUid": "104821",
    "skippedInternal": 2
  },
  "status": [],
  "hours": { "labels": ["00:00"], "buy": [], "sell": [] },
  "rows": [
    {
      "time": "14:22:08",
      "uid": "104821",
      "tag": "大户",
      "tagClass": "warning",
      "action": "大额买入",
      "actionClass": "user",
      "amount": 62.0,
      "amountU": 56.6,
      "impact": 0.85,
      "side": "买",
      "status": "监控中",
      "statusTag": "warning",
      "note": ""
    }
  ]
}
```

`action`: `大额买入` | `大额卖出`。`impact` 为预估对盘口冲击 `%`。`status`: `红色` | `监控中` | `已处理`。小时序列加总对齐 `buyAmt` / `sellAmt`。

---

### 5.12 GET `/orderbook/obi`

**Query：** `pair`, `depthLevels`, `obiWarn`

计算见 3.6。

```json
{
  "kpis": {
    "realObi": 0.32,
    "realObiLabel": "+0.32",
    "grossObi": 0.26,
    "bidQty": 400, "askQty": 280, "bidAskRatio": 1.43,
    "mmBid": 80, "mmAsk": 90,
    "realBid": 320, "realAsk": 190,
    "nearTotal": 680,
    "warn": 0.4,
    "distToWarn": 0.08,
    "bias": "买盘偏厚",
    "alert": false
  },
  "status": [],
  "history": {
    "hours": ["09:00", "09:30"],
    "real": [], "gross": [], "bid": [], "ask": []
  },
  "days": { "labels": ["08/15"], "obi": [] },
  "depthRows": [
    {
      "level": 1,
      "bidPrice": "0.912", "askPrice": "0.914",
      "bid": 80, "ask": 50, "net": 30
    }
  ]
}
```

`history.hours` 建议半小时点，长度 24。`days` 近 14 日日终 OBI。`depthRows` 档数 = `depthLevels`。

---

### 5.13 GET `/position/cost-dev`

**Query：** `pair`, `costDevWarn`

```
dev% = (现价 − 真实用户持仓均价) / 均价 × 100
alert = |dev| ≥ costDevWarn
```

`stance` 文案建议：`≥20` 停拉 · 先卖出兑现；`≥8` 可拉，卖出；`≥0` 贴近成本；`≥ −8` 刚翻亏 · 可砸；更低 深套 · 再砸他们不动。

```json
{
  "kpis": {
    "dev": 8.4,
    "lastPrice": 0.9124,
    "avgCost": 0.8420,
    "warn": 20,
    "alert": false,
    "profitRatio": 58,
    "underwater": 42,
    "stance": "可拉，卖出 · 散户还在追",
    "densePeak": 0.86
  },
  "status": [],
  "bands": {
    "labels": [0.72, 0.78, 0.86, 0.91, 0.97, 1.05],
    "amounts": [80, 320, 480, 160, 90, 50]
  },
  "buckets": [
    { "name": "深套 ≤−15%", "amount": 120, "pct": 11.0 }
  ],
  "history": {
    "dates": [], "dev": [], "price": [], "cost": []
  }
}
```

`buckets` 四档：深套 ≥15%、浅套 0～15%、小赚 0～15%、大赚 ≥15%。数量加总 = 所内真实用户持仓。`bands` 为成本直方图（价格轴 + 数量）。`history` 近 30 日。

---

### 5.14 GET `/robot-status`

**Query：** `pair`, `internalAccounts`, `robot`（JSON）

`robot` 结构：每种策略一套参数，分 **挂单** `order`、**自成交** `wash`、**报价** `quote`。做市 UID 的 `strategy` 指向其中一套。旧字段 `quotes[]` 会按第一套启用配置迁移到全部策略。

挂单分 `bid` / `ask` 两个方向，每边是规则数组，可增减。规则字段：`minPrice` / `maxPrice` 为相对现价的百分比（`0.1` = 0.1% = 千分之一，`0.3` = 千分之三），`minAmt` / `maxAmt` 每单数量（USDT），`count` 该规则挂单笔数。

```json
{
  "enabled": true,
  "strategies": {
    "quote": {
      "order": {
        "bid": [{ "id": 1, "minPrice": 0.1, "maxPrice": 0.3, "minAmt": 10000, "maxAmt": 20000, "count": 5 }],
        "ask": [{ "id": 1, "minPrice": 0.1, "maxPrice": 0.3, "minAmt": 10000, "maxAmt": 20000, "count": 5 }]
      },
      "wash": { "minIntervalMs": 1000 },
      "quote": { "spreadType": "fixed", "bidSpread": 0.1, "askSpread": 0.1, "minDistance": 0.1, "maxDistance": 0.2, "priceRandom": 1 }
    }
  },
  "bots": [
    { "uid": "88001", "running": true, "strategy": "quote", "wash": true },
    { "uid": "88002", "running": true, "strategy": "inventory", "wash": false }
  ]
}
```

`strategy`: `quote` | `guard` | `inventory` | `follow` | `passive`。对应文案：做市报价 / 护盘托价 / 库存回归 / 跟价推进 / 仅挂不吃。自成交配置只保留 `minIntervalMs`（最小成交时间间隔，毫秒）。UID 的 `wash` 是该账户自成交开关。

当日盈亏用该做市 UID 集合的成交，按 3.2 计算。

```json
{
  "kpis": {
    "robotCount": 2, "onlineCount": 2,
    "robotInv": 22.6, "borrowedAmount": 320.5,
    "tokenOwn": 210, "tokenBorrowed": 110.5,
    "bandStatus": "安全区间",
    "dayPnl": 3.2, "dayPnlU": 3.2,
    "realizedU": 2.1, "floatU": 1.1, "matchedQty": 80,
    "avgBuy": 0.90, "avgSell": 0.912,
    "turnover": 168, "turnoverU": 153,
    "bsRatio": 1.05, "avgSpread": 3.4, "cover": 96.0
  },
  "status": [],
  "history": {
    "hours": ["00:00"],
    "inventory": [], "buyVol": [], "sellVol": [], "pnl": [], "spread": []
  },
  "robots": [],
  "events": [
    { "time": "10:21:06", "uid": "88001", "type": "扩买盘", "detail": "…", "tag": "success" }
  ]
}
```

`turnover = Σ(buyFill+sellFill)`。`bsRatio = 总买 / 总卖`。`cover` = 报价覆盖近端档位的百分比。`history.inventory` 为库存占流通 % 的小时序列。`robots[]` 字段同 `mmToday.accounts`，另加 `latency`（ms）、`spread`（bps）。

---

### 5.15 GET `/holders`

**Query：** `pair`, `sleepIdleDays`, `internalAccounts`

真实用户持仓均价（已并入真实用户今日）。计算见 2.6。

返回 **全部** 真实用户持仓，不要截前 N 名。`kpis.totalAmount` / `userCount` 与 `rows` 对齐。真实用户今日的持仓表也用这份数据。

```json
{
  "formula": "所内真实用户的剩余存货成本。不含做市账户，也不含金库 / 项目方 / 员工 / LP。买入按成交价入库，充值按到账现价入库；卖出只减数量。",
  "badge": "真实用户 128 人 · 不含做市 / 金库等",
  "kpis": {
    "totalAmount": 1099.5,
    "activeAmount": 720.0,
    "sleepAmount": 379.5,
    "sleepRatio": 34.5,
    "sleepUsers": 40,
    "activeUsers": 88,
    "shownCount": 128,
    "userCount": 128,
    "sleepIdleDays": 30,
    "lastPrice": 0.9124,
    "lastPriceLabel": "0.9124",
    "avgCost": 0.8420,
    "avgCostLabel": "0.8420",
    "medianCost": 0.8500,
    "profitAmount": 640.0,
    "lossAmount": 459.5,
    "change30": 1.2,
    "change30Amount": 8.0
  },
  "status": [],
  "rows": [
    {
      "id": "104821",
      "amount": 86.2,
      "cost": 0.880,
      "costLabel": "0.8800",
      "pnlWan": 2.8,
      "pnl": "+2.8万USDT",
      "ratio": "+3.7%",
      "lastActive": "今日 14:02",
      "days": 18,
      "sleepDays": 0,
      "status": "活跃",
      "statusTag": "user",
      "costBand": "0.8600–0.8800"
    }
  ],
  "costBands": [
    {
      "name": "0.8400–0.8600",
      "min": 0.84, "max": 0.86,
      "amount": 200, "users": 12, "ofTotal": 18.2,
      "activeAmount": 150, "sleepAmount": 50,
      "activeUsers": 8, "sleepUsers": 4,
      "vsPct": 8.6, "vsLabel": "+8.6%",
      "stance": "浮盈",
      "stanceTag": "user",
      "containsPrice": false
    }
  ],
  "pnlBuckets": [
    { "name": "深套 ≥15%", "minPct": null, "maxPct": -15, "amount": 80, "users": 10, "pct": 7.3 }
  ],
  "idleDist": [
    { "name": "0–2天", "value": 400, "users": 40, "sleeping": false }
  ],
  "concentration": [
    { "name": "用户104821", "value": 86.2 }
  ],
  "history": {
    "dates": [], "sleepAmounts": [], "activeAmounts": [], "sleepRatios": []
  }
}
```

`medianCost`：按持仓量累加到 50% 的那个成本。  
`idleDist` 固定桶：`0–2天` `3–7天` `8–14天` `15–29天` `30–59天` `60天+`；`sleeping` = 该桶 min ≥ `sleepIdleDays`。  
`concentration`：前 5 名 + 「其他用户」。  
`status`：`活跃`（sleepDays≤2）/ `沉睡`（≥idle）/ `监控中`。

---

### 5.16 GET `/circ/supply`

**Query：** `pair`, `kind=exchange|onchain`, `sleepIdleDays`, `internalAccounts`

`kind=exchange`：交易所内流通 = 活跃 + 沉睡 + 做市。  
`kind=onchain`：链上仓库 = 可充回（活跃）+ 沉睡仓库。做市不出现在链上页。

```json
{
  "kind": "exchange",
  "kpis": {
    "total": 1420.0,
    "active": 720.0,
    "sleep": 379.5,
    "mmQty": 320.5,
    "change30": 2.1,
    "change30Amount": 28.0,
    "netIn30": 80.0,
    "netOut30": 52.0,
    "sleepIdleDays": 30,
    "circNum": 1776.0,
    "floatNum": 1455.5
  },
  "status": [],
  "formula": "交易所内流通 = 所内活跃 + 所内沉睡 + 做市账户库存",
  "composition": [
    { "name": "所内活跃", "value": 720 },
    { "name": "所内沉睡", "value": 379.5 },
    { "name": "做市账户", "value": 320.5 }
  ],
  "buckets": [
    { "name": "所内活跃", "amount": 720, "pct": 50.7, "to": "/desk/users", "note": "近30天有成交的用户持仓", "tag": "success", "tagLabel": "活跃" }
  ],
  "history": {
    "dates": [], "active": [], "sleep": [], "mm": [], "totals": []
  },
  "rows": [
    {
      "id": "104821",
      "kind": "活跃",
      "tag": "success",
      "amount": 86.2,
      "pct": 6.1,
      "last": "今日",
      "note": "近期有成交",
      "to": "/desk/user/104821"
    }
  ]
}
```

链上 `kind`：`可充回` | `沉睡`；`to` 指向 `/chips/address?address=0x…`。做市行 `id` 用 UID，`kind`=`做市`，`to`=`/ops/dump`。

`history.totals[i] = active + sleep + (exchange ? mm : 0)`。`change30` 为总量相对 30 日前的涨跌 `%`。

---

### 5.17 GET `/whales/exchange`

**Query：** `pair`, `whaleThreshold`, `internalAccounts`, `date?`

今日充提。不含做市/金库等。

```json
{
  "pair": "VBT/USDT",
  "base": "VBT",
  "lastPrice": 0.9124,
  "kpis": {
    "depositAmt": 40.0, "depositU": 36.5, "depositCount": 12, "depositUsers": 9,
    "withdrawAmt": 18.0, "withdrawU": 16.4, "withdrawCount": 6, "withdrawUsers": 5,
    "netAmt": 22.0, "netU": 20.1,
    "largeCount": 3
  },
  "status": [],
  "hours": { "labels": ["00:00"], "deposit": [], "withdraw": [] },
  "rows": [
    {
      "time": "14:02:11",
      "uid": "104821",
      "action": "充值",
      "actionClass": "success",
      "amount": 12.0,
      "amountU": 10.9,
      "chain": "BSC",
      "address": "0xabc…",
      "status": "已处理",
      "statusTag": "success",
      "note": ""
    }
  ]
}
```

`action`: `充值` | `提现`。小时序列加总对齐日合计。`largeCount` = 数量 ≥ `whaleThreshold` 的笔数。

---

### 5.18 GET `/whales/exchange/history`

**Query：** `pair`, `days`, `whaleThreshold`, `internalAccounts`

前端充提历史目前仍可能传 `7|15|30`；也请支持 `all`。

```json
{
  "range": 15,
  "pair": "VBT/USDT",
  "base": "VBT",
  "kpis": {
    "periodDeposit": 400, "periodDepositU": 365,
    "periodWithdraw": 180, "periodWithdrawU": 164,
    "periodNet": 220, "periodNetU": 201,
    "netInDays": 10, "netOutDays": 5,
    "endDeposit": 40, "endWithdraw": 18, "endNet": 22,
    "startNet": 8, "netChange": 14,
    "maxDeposit": 55, "maxWithdraw": 30,
    "avgDeposit": 26.7, "avgWithdraw": 12.0
  },
  "status": [],
  "series": {
    "dates": [], "depositAmt": [], "withdrawAmt": [], "netAmt": []
  },
  "rows": [
    {
      "date": "08/28", "dateKey": "2026-08-28",
      "depositAmt": 40, "depositU": 36.5,
      "withdrawAmt": 18, "withdrawU": 16.4,
      "netAmt": 22, "netU": 20.1,
      "depositCount": 12, "withdrawCount": 6,
      "depositUsers": 9, "withdrawUsers": 5,
      "largestAmt": 12.0
    }
  ]
}
```

`netInDays` = `netAmt ≥ 0` 的天数。

---

### 5.19 GET `/external-chips`

**Query：** `pair`, `sleepIdleDays`, `excludedAddresses`

链上仓库明细。排除热钱包/锁仓地址后的余额。

```json
{
  "kpis": {
    "amount": 356.0,
    "pct": 20.0,
    "change30": 1.2,
    "change30Amount": 8.0,
    "net30": -4.0,
    "activeAmount": 180.0,
    "sleepAmount": 176.0,
    "sleepIdleDays": 30
  },
  "status": [],
  "history": {
    "dates": [], "dateKeys": [], "percents": [], "amounts": []
  },
  "rows": [
    {
      "address": "0x12ab…90ef",
      "fullAddress": "0x…",
      "amount": 42.0,
      "pct": 11.8,
      "source": "未知链上地址",
      "tag": { "label": "未知", "className": "warning" },
      "sleepDays": 4,
      "status": "活跃",
      "net30d": 3.2,
      "to": "/chips/address?address=0x…"
    }
  ]
}
```

`pct` 占总流通。`excludedAddresses` 匹配要忽略大小写，支持 `0x1234...abcd` 前后缀。

---

### 5.20 GET `/internal-chips`

**Query：** `pair`, `internalAccounts`

金库 / 项目方 / 员工 / LP（**不含做市账户明细**，做市库存只作为对照 KPI）。

```
内部占流通% = 做市库存% + 金库等%
lockedRatio = 状态含「锁」的非做市余额 / 金库等合计 × 100
```

```json
{
  "kpis": {
    "internalPct": 80.0, "internalAmount": 1420.0,
    "ownedPct": 57.4, "ownedAmount": 1020.0,
    "dumpable": 320.5, "ownUsdt": 86.4,
    "tokenOwn": 210, "tokenBorrowed": 110.5,
    "cashTrueU": 70, "cashOwnU": 70, "cashBorrowedU": 16.4,
    "robotInv": 22.6, "borrowedAmount": 320.5,
    "treasury": 12.4, "treasuryAmount": 220.0,
    "lockedRatio": 40,
    "bandStatus": "安全区间",
    "change30": -1.2, "ownedChange30": 0.4
  },
  "status": [],
  "accounts": [
    {
      "uid": "71001",
      "type": "treasury",
      "remark": "平台金库多签",
      "amount": 88.0,
      "borrowed": false,
      "status": "锁定",
      "statusTag": "user"
    }
  ],
  "history": {
    "dates": [], "percents": [], "amounts": [],
    "inventory": [], "ownedPercents": [], "ownedAmounts": []
  }
}
```

`accounts` **不要包含 `type=mm`**。同类型多 UID 余额加总应对齐该类型占流通。

---

### 5.21 GET `/address-detail`

**Query：** `pair`, `address`

```json
{
  "address": "0x…",
  "token": "VBT",
  "pair": "VBT/USDT",
  "kpis": {
    "amount": 42.0,
    "pct": 2.4,
    "change30": -0.8,
    "change30Amount": -1.2,
    "net30": 3.4,
    "txCount": 18,
    "lastActive": "08/28 14:02"
  },
  "history": {
    "dates": [], "amounts": [], "percents": [], "inflows": [], "outflows": []
  },
  "txs": [
    {
      "time": "08/28 14:02",
      "type": "转入",
      "tag": "success",
      "counterparty": "0x…",
      "amount": 3.2,
      "hash": "0x…",
      "status": "已确认",
      "statusTag": "success"
    }
  ]
}
```

`type`: `转入` | `转出`。转出 `amount` 为负数。`net30 = Σ转入 − Σ|转出|`（近 30 日）。`pct` 占总流通。

---

### 5.22 GET `/exchange-user`

**Query：** `pair`, `uid`, `scope=pair|all`

单 UID。`scope=pair` 只看当前交易对；`all` 数量折 USDT。

持仓均价按 2.6。`todayBuy/todaySell` 为该 UID 当日用户侧买/卖。`totalBuy/totalSell` 为上币以来累计。

成交频率：`日均笔数 = trades30 / tradeDays`；`≥4` 高频，`≥2` 中频，否则低频。

```json
{
  "uid": "104821",
  "pair": "VBT/USDT",
  "token": "VBT",
  "scope": "pair",
  "scopeLabel": "当前代币 · VBT",
  "qtyUnit": "万",
  "qtyNote": "VBT 数量",
  "profile": {
    "registered": "2024-03-12",
    "lastActive": "08/28 14:02",
    "kyc": "已认证",
    "vip": "VIP1",
    "days": 320,
    "region": "新加坡"
  },
  "tags": [{ "label": "散户", "className": "warning", "to": "/user-profile/retail" }],
  "habits": [
    { "label": "平均持仓", "value": "18小时", "note": "日内" },
    { "label": "挂撤比", "value": "12%", "note": "撤单 / 挂单" },
    { "label": "单笔规模", "value": "中单", "note": "人均约 3.2万" },
    { "label": "成交频率", "value": "中频", "note": "日均 2.4 笔" }
  ],
  "kpis": {
    "equityU": 120.0, "cashU": 40.0, "tokenU": 80.0,
    "posQty": 88.0, "avgCost": 0.88, "lastPrice": 0.9124,
    "pnlU": 2.8, "pnlPct": 3.6,
    "todayBuy": 6.4, "todaySell": 2.1, "todayNet": 4.3,
    "totalBuy": 420.0, "totalSell": 330.0,
    "trades30": 40, "winRate": 42.0, "profitRatio": 1.1,
    "avgHoldHours": 18, "cancelRatio": 12, "tradeDays": 16,
    "avgTicket": 3.2, "openOrders": 2,
    "deposit30": 20.0, "withdraw30": 5.0
  },
  "status": [],
  "assets": [
    {
      "token": "VBT", "pair": "VBT/USDT",
      "qty": 88, "price": 0.9124, "cost": 0.88,
      "valueU": 80.3, "pnl": 2.8, "pnlPct": 3.6,
      "weight": 100
    }
  ],
  "cashU": 40.0,
  "history": {
    "dates": [], "buy": [], "sell": [], "pos": [], "pnl": [],
    "tokens": [{ "name": "VBT", "buy": [], "pos": [] }]
  },
  "fills": [
    {
      "time": "08/28 14:02", "pair": "VBT/USDT", "token": "VBT",
      "side": "买入", "tag": "user",
      "qty": 2.4, "price": 0.912, "fee": 0.002, "notional": 2.19
    }
  ],
  "transfers": [
    {
      "time": "08/28 11:20",
      "pair": "VBT/USDT",
      "token": "VBT",
      "action": "充值",
      "actionClass": "deposit",
      "amount": 8.4,
      "amountU": 7.7,
      "chain": "TRC-20",
      "address": "0x…",
      "status": "已处理",
      "statusTag": "success",
      "note": "所内可卖增加"
    }
  ]
}
```

`scope=all` 时 `qtyUnit`=`万USDT`，`todayBuy` 等为折 U。`winRate` 近 30 日已实现胜率 %。`profitRatio` = 盈利绝对值 / 亏损绝对值。`cancelRatio` = 撤单数 / 挂单数 × 100（程序化规则里也可用「倍」）。`deposit30`/`withdraw30` 为近 30 日充提 **万 USDT**，口径与 `transfers` 一致。

`transfers`：`scope=pair` 只返回当前代币充提；`scope=all` 返回该 UID 全部代币充提。每行带 `token`、`pair`。

`habits` 四个 label 必须是：平均持仓、挂撤比、单笔规模、成交频率。

---

### 5.23 GET `/alerts`

**Query：** `pair`, `whaleThreshold`, `costDevWarn`, `depthLevels`, `obiWarn`, `internalAccounts`, `excludedAddresses`

汇总各子系统告警，**按 `time|text` 去重**。

触发建议（都要能落到 `rows`）：

| 条件 | level | source | to |
| --- | --- | --- | --- |
| 做市库存带离开安全区间 | 预警 | 做市 | `/robots` |
| `|realObi| ≥ obiWarn` | 预警 | 价格台阶 | `/ops/ladder` |
| `|成本偏离| ≥ costDevWarn` | 预警 | 价格台阶 | `/ops/ladder` |
| 单笔充值 ≥ whaleThreshold | 关注或预警 | 充提 | `/whales/exchange` |
| 盘口大单 status=红色 | 紧急 | 盘口 | `/orderbook` |
| 价格台阶下一档「对手接不住」且偏离大 | 预警 | 价格台阶 | `/ops/ladder` |

```json
{
  "kpis": {
    "total": 12, "urgent": 2, "warn": 5, "watch": 5,
    "open": 8, "watching": 3, "done": 1
  },
  "status": [],
  "rows": [
    {
      "id": "alert-1",
      "time": "14:22:08",
      "level": "预警",
      "rank": 2,
      "source": "盘口",
      "text": "近端 OBI +0.48，超过 0.40",
      "detail": "",
      "status": "未处理",
      "statusTag": "warning",
      "to": "/ops/ladder"
    }
  ]
}
```

`level`: `紧急` | `预警` | `关注`（rank 1/2/3）。`status`: `未处理` | `监控中` | `已处理`。`kpis.open` = 未处理，`watching` = 监控中，`done` = 已处理。

---

### 5.24 GET `/user-profile`

无 query。对手盘总览。

```json
{
  "tags": [
    { "key": "smart", "label": "聪明钱", "value": 36, "ratio": "4.2%" },
    { "key": "retail", "label": "散户", "value": 820, "ratio": "78%" },
    { "key": "wool", "label": "羊毛党", "value": 40, "ratio": "3.8%" },
    { "key": "kol", "label": "吃客损KOL", "value": 12, "ratio": "1.1%" },
    { "key": "prog", "label": "程序化交易", "value": 28, "ratio": "2.6%" }
  ],
  "trend": {
    "dates": ["08/22", "08/23", "08/24", "08/25", "08/26", "08/27", "08/28"],
    "smart": [], "retail": [], "wool": [], "kol": [], "prog": []
  },
  "notes": []
}
```

`ratio` 为占全站真实用户的百分比字符串。`trend.*` 与 `dates` 等长，近 7 日人数。

---

### 5.25 GET `/user-profile/{type}`

**Path：** `type` = `smart` | `retail` | `wool` | `kol` | `prog`  
**Query：** `pair`

规则见 7.17。命中该标签的 UID 集合上计算：

- 人数、占全站 %
- 均胜率、均盈亏比（聪明钱）
- 今日净买入（用户侧，正数 = 跟做市抢买入 / 接做市卖出）
- 今日活跃人数（有成交）

```json
{
  "key": "smart",
  "label": "聪明钱",
  "blurb": "",
  "status": [],
  "kpis": [
    { "label": "聪明钱人数", "value": 36, "unit": "人", "qty": "占全站 4.2%", "sub": "规则命中 UID" }
  ],
  "charts": [
    {
      "title": "人数趋势",
      "badge": "近7天",
      "x": ["08/22"],
      "legend": ["聪明钱"],
      "series": [{ "name": "聪明钱", "type": "line", "data": [30, 32, 36] }]
    }
  ],
  "notes": [],
  "columns": [
    { "key": "id", "label": "UID" },
    { "key": "winRate", "label": "胜率" },
    { "key": "profitRatio", "label": "盈亏比" },
    { "key": "position", "label": "当前仓位", "format": "qty", "unit": "万" },
    { "key": "net", "label": "今日净买", "format": "signed", "unit": "万" }
  ],
  "rows": [
    { "id": "104821", "winRate": "68%", "profitRatio": "1.8", "position": 12.4, "net": 2.1 }
  ],
  "rules": { "smartTradeCount": 15, "smartWinRate": 60, "smartProfitRatio": 1.5, "smartPosition": 2 }
}
```

`kpis[]` 是卡片数组，不是对象。`columns.format`: `qty` | `signed` | 缺省原样。各 type 建议列：

| type | columns |
| --- | --- |
| smart | UID, 胜率, 盈亏比, 当前仓位, 今日净买 |
| retail | UID, 胜率, 当前仓位, 浮盈亏, 持仓(天), 追涨次数, 状态 |
| wool | UID, 关联设备, 关联IP, 今日净买, 状态 |
| kol | UID, 跟风人数, 喊单后净卖, 反向占比, 状态 |
| prog | UID, 持仓寿命(分), 挂撤比, 今日净买, 状态 |

---

### 5.26 PUT `/user-rules`

**Body：** 完整规则对象（与 GET persona 的 `rules` 合并后回写）。

```json
{
  "smartTradeCount": 15,
  "smartWinRate": 60,
  "smartProfitRatio": 1.5,
  "smartPosition": 2,
  "retailTradeCount": 15,
  "retailNetProfit": "negative",
  "retailWinRate": 40,
  "retailHoldRatio": 3,
  "retailLiquidation": 50,
  "woolDevice": 3,
  "woolIP": 5,
  "kolFollowMin": 20,
  "kolDumpWindow": 15,
  "kolReverseRatio": 60,
  "progHoldTime": 1,
  "progCancelRatio": 20
}
```

**返回：** `{ "ok": true, "rules": { …保存后的对象 } }`

打标口径（近 30 日，真实用户，当前交易对除非另注）：

| 标签 | 同时满足 |
| --- | --- |
| 聪明钱 | 成交笔数 ≥ `smartTradeCount` **且** 胜率 ≥ `smartWinRate`% **且** 盈亏比 ≥ `smartProfitRatio` **且** 单笔仓位 / 净值 ≥ `smartPosition` |
| 散户 | 成交笔数 ≥ `retailTradeCount` **且** 净收益符号 = `retailNetProfit`（`negative`/`positive`）**且** 胜率 ≤ `retailWinRate`% **且** 持仓时间 / 账户寿命 ≥ `retailHoldRatio` **且** 强平率 ≥ `retailLiquidation`% |
| 羊毛党 | 同设备关联 UID ≥ `woolDevice` **或** 同 IP 段关联 UID ≥ `woolIP` |
| 吃客损KOL | 跟风散户数 ≥ `kolFollowMin` **且** 喊单后 `kolDumpWindow` 分钟内净卖 **且** 与喊单方向反向成交占比 ≥ `kolReverseRatio`% |
| 程序化 | 持仓生命周期 ≤ `progHoldTime` 分钟 **且** 挂撤比 ≥ `progCancelRatio`（此处为倍数，如 20 = 撤单量 ≥ 挂单量 × 20；若你们用百分数请与前端约定后改文档） |

羊毛党应从「真实对手盘」成交统计中剔除（做市对倒、刷量不算对手）。

---

## 6. 可选接口

### 6.1 GET `/desk/mm`

**Query：** `pair`, `internalAccounts`

返回形状 = `/ops/desk` 的 `mmToday`。当前前端不单独请求，做市今日已嵌在 `/ops/desk`。建议实现以便巡检。

---

## 7. WebSocket 挂单

- 开发：`ws://{host}/ws/orders?pair=VBT/USDT`
- 可配 `VITE_WS_BASE_URL`，再加 `channel=orders&pair=`
- Token：`?accessToken=`

客户端连上后发送：

```json
{ "type": "subscribe", "channel": "orders", "pair": "VBT/USDT" }
```

每 15 秒：

```json
{ "type": "ping", "pair": "VBT/USDT" }
```

服务端可回 `{ "type": "pong" }`。

**整表快照**（推荐每次重连先推一次）：

```json
{
  "type": "snapshot",
  "pair": "VBT/USDT",
  "data": {
    "badge": "共36笔挂单 · 实时",
    "rows": [],
    "volumeByPrice": { "labels": [], "buy": [], "sell": [] },
    "cancelTop": { "labels": [], "values": [] },
    "ts": 1750000000000
  }
}
```

`data` 与 `GET /orders` 相同。

**增量：**

```json
{
  "type": "delta",
  "pair": "VBT/USDT",
  "upserts": [ { "id": "ord-1", "price": "0.91", "side": "买", "amount": 3.2 } ],
  "removes": ["ord-2"]
}
```

`upserts` 按 `id` 覆盖；`removes` 删除。金额/数量变化后请重算 `volumeByPrice`（也可下一次 snapshot 再给）。

错误：

```json
{ "type": "error", "pair": "VBT/USDT", "message": "…" }
```

WS 连续失败约 4 次后前端会短时轮询 `GET /orders`。

---

## 8. 字段正负（颜色由前端上）

| 含义 | 正数 | 负数 |
| --- | --- | --- |
| 用户净买入 `realNet` | 用户在买、做市在卖 | 用户在卖、做市在买 |
| 做市 `usdtNet` | USDT 增加（目标） | USDT 减少 |
| 做市 `netQty` / `tokenDelta` | 库存增加 | 库存减少 |
| `realizedU` / `floatU` / `totalU` / `pnlWan` | 赚 | 亏 |
| 偏离 `devPct` / `mmDevPct` | 现价高于成本/均价 | 现价低于 |
| 充提 `netAmt` | 净充入（所内供给增加） | 净提出 |

后端只给数字和语义。灯、图表、盈亏红绿都在前端 `src/utils/palette.js`。

---

## 9. 实现注意

1. **自成交 / wash**：做市 UID 之间对敲不要计入 `realBuy`/`realSell`，不要计入真实交易量的「对手人数」。可以计入做市 `buyQty`/`sellQty`，但 `matched` 的「真实交易量」应尽量用 **与真实用户成交** 的重叠部分。产品口径：真实交易量 = 做市与真实用户成交的 min(买,卖) 对倒部分；若无法拆，则用含自成交的 min，并在 `status` 注明。
2. **借入虚增**：余额接口必须能拆出自有 / 借入。若账上暂无借入科目，返回 `tokenBorrowed=0`、`cashBorrowedU=0`，不要把真实余额藏进一个数。
3. **`days=all`**：按实际上币日到操盘日逐日输出。不要只给 30 天。
4. **内部账户变更**：每次请求带当前 `internalAccounts`。用户在前端改 UID 后，所有「真实用户」统计必须立刻换口径。
5. **精度**：数量/金额 1 位小数；价格按交易对 tick。加总后请再 round，避免 `80.0+80.0=160.0000001`。
6. **空数据**：数组给 `[]`，数字给 `0`，不要 `null`（`status`/`kpis` 对象不要缺键）。
7. **UID 打码**：列表可用 `1***21`，但 `id`/`uid` 字段必须是完整 UID，前端要点进 `/desk/user/{uid}`。
8. **不要**把 mock 的 `qty * price / 10000` 当生产公式。
9. **不要返回颜色。** 多给的 `color` / hex 前端会忽略。

---

## 10. 验收清单（联调）

- [ ] `/pairs` 返回数组，切换交易对后所有接口跟 `pair` 走
- [ ] 做市今日：`tokenInv = tokenOwn + tokenBorrowed`，`cashU = cashTrueU + cashBorrowedU`
- [ ] 用户买加总 ≈ 做市卖；用户卖加总 ≈ 做市买（剔除内部账户后）
- [ ] `matched = min(buy, sell)`，`realizedU = matched × (avgSell − avgBuy)`
- [ ] `floatU = netQty × (lastPrice − markCost)`，`totalU = realizedU + floatU`
- [ ] 历史 `days=all` 从上市日到今天，点某日 `date=` 能打开当日做市/用户页
- [ ] 持仓均价不含 mm/treasury/project/staff/lp；卖出 / 提现不改均价（2.6）
- [ ] 做市库存成本只算自有；虚增 / 还款不进成本；买入 / 充值入库（2.7）
- [ ] 沉睡天数用请求里的 `sleepIdleDays`
- [ ] 所内流通 = 活跃 + 沉睡 + 做市；链上页没有做市行
- [ ] 挂单 REST + WS 剔除做市；`id` 稳定
- [ ] 大单 / 充提阈值用 `whaleThreshold`，排除内部 UID
- [ ] 价格台阶 ±5/±10/±20 预估卖出比例符合 3.5
- [ ] PUT `/user-rules` 后 `/user-profile/{type}` 人数变化
- [ ] 金额：`万USDT = 万枚 × 价格`，抽查一笔 fills 的 `usdt`
- [ ] 响应里没有 `color` / `pnlColor` / `actionColor` / hex
