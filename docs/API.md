# Athena Omega Desk · 后端接口约定

给后端实现用。请按本文查库、算数、填 `data`。前端已按这些路径和字段名对接。

名词、成本口径与本文一致，展开见 [名词解释.md](./名词解释.md)。

---

## 0. 你要做的事

1. 按第 3 节把底层账（UID、成交、挂单、充提、余额）查出来。
2. 按第 4 节用同一套公式算出成本、盈亏、OBI、台阶预估卖出。
3. 按第 5 节对照表，给每个页面返回它要的 JSON。
4. **不要改字段名、单位、正负方向。** 颜色（hex）前端自己上，后端不要返回 `color` / `pnlColor` / `#xxxxxx`。

产品前提：

- 代币自发行。只存在链上仓库和本所。价格由盘面控制。
- 用户买入 = 做市卖出；用户卖出 = 做市买入。
- 做市赢面 = 代币库存大致不变，USDT 增加。
- 真实用户只说 **持仓均价**；做市只说 **库存成本**。算法相同，记账对象不同。

---

## 1. 通用约定

### 1.1 Base URL 与鉴权

- HTTP：`{VITE_API_BASE_URL || /api}` + 下文路径。例：`GET /api/dashboard`
- 请求头：`Authorization: Bearer <accessToken>`（来自 `localStorage.accessToken`）
- WebSocket：见第 19 节

### 1.2 响应信封

成功必须是下面两种之一。前端会取出 `data`。

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

HTTP 非 2xx 时用 `message`。

### 1.3 查询参数

几乎每个 GET 都带 `pair`。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `pair` | string | 交易对，如 `VBT/USDT`。必填（除 `/pairs`、`/user-profile`、`PUT /user-rules`） |
| `internalAccounts` | JSON 字符串 | 内部账户清单，见下 |
| `sleepIdleDays` | number | 几天无成交算沉睡，默认 `30` |
| `date` | `YYYY-MM-DD` | 日切片。省略 = 今日（操盘日） |
| `days` | string | 历史窗口。前端传 `'all'` = **上币日起到操盘日的全部交易日** |

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

**内部 UID 一律从真实用户统计里剔除**（成交、挂单、充提、持仓、标签）。`mm` 是做市账；其余四类是金库等，不直接买卖。

其它常见参数：

| 参数 | 说明 |
| --- | --- |
| `whaleThreshold` | 大单 / 充提警报阈值，单位万枚，默认 `50` |
| `depthLevels` | 近端盘口档位数，默认 `10` |
| `obiWarn` | OBI 告警绝对值，默认 `0.4` |
| `costDevWarn` | 持仓均价偏离告警 `%`，默认 `20` |
| `scope` | `pair` \| `all`（单 UID） |
| `robot` | JSON 字符串，机器人配置，见第 16 节 |
| `uid` | 单 UID 查询 |

### 1.4 单位（必须统一）

| 量 | 单位 | 说明 |
| --- | --- | --- |
| 代币数量 | **万枚** | `1` = 10,000 枚 |
| USDT 金额 | **万 USDT** | `1` = 10,000 USDT |
| 价格 | **USDT / 枚** | 现价、均价、成本都是这个 |
| 百分比 | 已乘 100 的数字 | `12.5` 表示 12.5% |
| OBI | −1～1 的小数 | `0.35` 表示买盘偏厚 |
| 价差 bps | 基点 | `1 bps = 0.01%` |

换算（数量已经是万枚时）：

```
金额(万USDT) = 数量(万枚) × 价格(USDT/枚)
```

数量保留 1 位小数；价格：≥1000 留 2 位，≥1 留 4 位，否则留 6 位。百分比留 1 位。

### 1.5 正负方向

| 字段 | 正数含义 |
| --- | --- |
| 做市 `buyQty` / `buyU` / `avgBuy` | 做市**买入**（对手是真实用户在卖） |
| 做市 `sellQty` / `sellU` / `avgSell` | 做市**卖出**（对手是真实用户在买） |
| 做市 `netQty` / `tokenDelta` | `buyQty − sellQty`，库存增加为正 |
| 做市 `usdtNet` | `sellU − buyU`，USDT 净增加为正 |
| 用户 `realBuy` / `realBuyU` | 真实用户买入（= 做市卖出） |
| 用户 `realSell` / `realSellU` | 真实用户卖出（= 做市买入） |
| 用户 `realNet` | `realBuy − realSell`，用户净买入为正 |
| 充提 `transferNet` | `depositAmt − withdrawAmt`，所内货增加为正 |
| 偏离 `devPct` / `mmDevPct` | `(现价 − 成本) / 成本 × 100`，现价高于成本为正 |

镜像关系（同一批「做市 ↔ 真实用户」成交，数字必须相等）：

```
用户买入 = 做市卖出
用户卖出 = 做市买入
```

自成交、内部调仓不进任何一侧。不要再按「允许自成交差」去对账。

### 1.6 颜色与状态条

**不要返回 hex。** 前端自己上色。

允许的语义字段：

| 字段 | 取值 |
| --- | --- |
| `status[].color` | `green` \| `yellow` \| `red`（状态条圆点） |
| `tagClass` / `statusTag` / `className` / `sideClass` | `success` \| `warning` \| `alert` \| `robot` \| `user` |
| `playKind` | `ok` \| `no` \| `watch` |
| `level` | `紧急` \| `预警` \| `关注` |

`status[]` 形状：`{ "color": "green", "text": "……" }`。可选 `break: true` 让该条换行。

### 1.7 日期

- `date`：`MM/DD`，给图表横轴
- `dateKey`：`YYYY-MM-DD`，给跳转日切片
- 历史 `rows`：**新 → 旧**（今天在最前）
- 历史 `series`：与 `dates` 对齐，**旧 → 新**（左旧右新）
- 小时：`["00:00","01:00",…,"23:00"]`，长度 24

---

## 2. 账户集合（先划清再算）

对某个 `pair` + `internalAccounts`：

| 集合 | 定义 |
| --- | --- |
| `MM` | `type === 'mm'` 的 UID。做市账 |
| `OWNED` | treasury / project / staff / lp |
| `INTERNAL` | `MM ∪ OWNED` |
| `REAL` | 所内持有该币、且 UID ∉ INTERNAL |

真实用户的成交、挂单、充提、持仓、标签，全部只算 `REAL`。

---

## 3. 底层数据（请先查好）

每个交易对、每个日历日，至少准备这些。后面所有 KPI 都从这里滚。

### 3.1 盘面

| 数据 | 怎么取 |
| --- | --- |
| `lastPrice` | 该币最近一笔成交价；无成交用最新中间价 |
| `circNum` | 总流通量（万枚） |
| `circOnchain` | 链上仓库（未充入本所） |
| `circExchange` | `circNum − circOnchain`（所内） |

### 3.2 每个 UID 的所内账

对每个 UID × 该币：

| 数据 | 怎么取 |
| --- | --- |
| 剩余持仓 `qty` | 所内现货余额（万枚） |
| 持仓均价 / 库存成本 `cost` | 第 4.1 节滚出来，不要用现价代替 |
| USDT 余额 | 该 UID 的 USDT（万） |
| 最近成交时间 | 该 UID 在该交易对最后一笔成交 |
| `sleepDays` | 距最近成交的日历日；从未成交可用注册日 |

做市 UID 额外拆：

| 数据 | 怎么取 |
| --- | --- |
| `tokenOwn` | 自有库存 |
| `tokenBorrowed` | 借入虚增（从用户侧借入、记在做市账上挂单用） |
| `tokenInv` | `tokenOwn + tokenBorrowed` |
| `cashTrueU` | 真实 USDT |
| `cashBorrowedU` | 借入 USDT |
| `cashU` | `cashTrueU + cashBorrowedU` |
| `invCost` | **只对 `tokenOwn` 滚**，虚增不进成本 |

### 3.3 成交

每笔：`time, uid, side(买\|卖), qty, price, notional`。

做市账户的交易相关统计，**只计做市 UID ↔ 真实用户**。

- 真实用户成交：对手是做市。剔除 INTERNAL↔INTERNAL、MM↔MM 自成交；REAL↔REAL（少见）不进做市统计，也不进真实用户买卖（两边必须能对上）。
- 做市成交：做市 UID 作为 taker/maker 的腿，且对手 ∈ REAL。自成交（两边都是 MM）、与金库等成交 **不要** 进做市买/卖/均价/人数/笔数/盈亏。

日汇总：

```
做市 buyQty  = Σ 做市对真实用户买入数量
做市 sellQty = Σ 做市对真实用户卖出数量
做市 avgBuy  = Σ(做市对用户买入数量 × 价) / buyQty
做市 avgSell = Σ(做市对用户卖出数量 × 价) / sellQty
做市 buyU    = buyQty × avgBuy
做市 sellU   = sellQty × avgSell

用户 realBuy  = Σ REAL 买入数量          // = 做市 sellQty
用户 realSell = Σ REAL 卖出数量          // = 做市 buyQty
用户 avgBuy   = Σ(REAL 买入数量 × 价) / realBuy     // = 做市 avgSell
用户 avgSell  = Σ(REAL 卖出数量 × 价) / realSell    // = 做市 avgBuy
```

### 3.4 挂单

每笔未成交单：稳定 `id, price, side(买\|卖), amount, account, time, tag`。

- 真实挂单：UID ∈ REAL
- 做市挂单：UID ∈ MM
- `tag`：`user` 真实用户，`robot` 做市/量化

近端 N 档（`depthLevels`，默认 10）：按价格离现价由近到远取买/卖各 N 档。

### 3.5 充提

每笔：`time, uid, action(充值\|提现), amount, chain, address`。剔除 INTERNAL。

```
amountU = amount × 到账/出金时现价
```

### 3.6 标签（对手盘）

每个 REAL UID 打 0～n 个标签：`聪明钱` / `散户` / `羊毛党` / `吃客损KOL` / `程序化交易`。规则见第 17 节，阈值来自前端 `PUT /user-rules`。

---

## 4. 共同算法

### 4.1 移动加权成本（持仓均价 = 库存成本）

货进来加权，货出去只减数量、**不重算成本**。

```
入库后成本 = (旧成本 × 旧数量 + 本次入库量 × 入库价) / (旧数量 + 本次入库量)
出库后数量 = max(0, 旧数量 − 出库量)     // 成本不变
```

| 事件 | 入库价 |
| --- | --- |
| 买入成交 | 成交价 |
| 充值到账 | 到账时现价 |

**真实用户**：每个 UID 的所内剩余持仓。买入/充值加权入库；卖出/提现只减数量。

**做市库存成本**：只滚 `tokenOwn`。

| 事件 | 数量 | 成本 |
| --- | --- | --- |
| 买入成交（仅对真实用户） | 自有 + | 按成交价加权 |
| 充值到账 | 自有 + | 按到账现价加权 |
| 卖出成交（仅对真实用户） | 可周转 −（**先虚增、再自有**） | 碰到自有只减数量 |
| 提现 | 自有 − | 只减数量 |
| 虚增（借入） | `tokenBorrowed` + | 不动成本 |
| 还款 | `tokenBorrowed` − | 不动成本 |

不要把虚增按 0 或现价混进加权。

```
群体持仓均价 = Σ(UID剩余数量 × 该UID均价) / Σ剩余数量
偏离%        = (现价 − 成本) / 成本 × 100
浮盈亏(万)   = 剩余数量(万) × (现价 − 成本)
```

### 4.2 做市当日交易盈亏

对象：当日做市 **对真实用户** 的买入/卖出（万枚），均买/均卖，现价。自成交不进 `buyQty` / `sellQty`。

```
matched  = min(buyQty, sellQty)          // 对倒部分
netQty   = buyQty − sellQty
realizedU = matched × (avgSell − avgBuy) // 交易盈亏，万USDT
markCost  = netQty ≥ 0 ? avgBuy : avgSell
floatU    = netQty × (lastPrice − markCost)  // 今日净头寸盯市，不含期初库存
totalU    = realizedU + floatU
usdtNet   = sellU − buyU
avgNetPrice = netQty === 0 ? null : usdtNet / netQty
```

`floatU` **不是**全部库存按现价减成本；那是库存成本偏离，走 `invCost`。这里的浮盈只盯**今日净买入留下的头寸**。

### 4.3 真实 OBI

近端 N 档（`depthLevels`）：

```
bidQty    = Σ 近端买单数量（含做市）
askQty    = Σ 近端卖单数量（含做市）
mmBid     = Σ 近端做市买单
mmAsk     = Σ 近端做市卖单
realBid   = bidQty − mmBid
realAsk   = askQty − mmAsk
realObi   = (realBid − realAsk) / (realBid + realAsk)     // 没有量则为 0
grossObi  = (bidQty − askQty) / (bidQty + askQty)
bidAskRatio = askQty ? bidQty / askQty : 0
distToWarn  = obiWarn − |realObi|
alert       = |realObi| ≥ obiWarn
```

`realObiLabel` / `grossObiLabel`：正数带 `+`，两位小数，如 `+0.35`。

报价和台阶**只看真实 OBI**。毛值接近 0、真实仍偏卖 = 外面没人买。

### 4.4 价格台阶预估卖出

台阶固定 7 档：`+20, +10, +5, 0, −5, −10, −20`（相对现价 %）。

档位价格：

```
P = lastPrice × (1 + pct/100)
```

**真实挂单累积**（`cumQty` / `cumU`）：

- `pct === 0`：挂单为 0（现价是行为起点）
- `pct > 0`：现价到该价的真实用户**卖单**合计（卖墙）
- `pct < 0`：现价到该价的真实用户**买单**合计（买墙）

```
cumU   = 这些挂单的 Σ(数量 × 各自挂单价)   // 也可用档位价 × cumQty
bandQty = 本档 cumQty − 更靠近现价那一档的 cumQty     // 现价档为 0
bandU   = 同理
```

往上从 +5 起算差，往下从 −5 起算差。

**预估卖出**（用户持仓按盈亏率兑现/砍仓，不是挂单）：

对每个 REAL UID，用该档价格 `P` 和该 UID 持仓均价 `cost`：

```
pnlPct = (P − cost) / cost × 100
x      = |pnlPct|
sellRate =
  x ≤ 0  → 0
  x ≤ 5  → (x / 5) × 0.10
  x ≤ 10 → 0.10 + (x − 5) / 5 × 0.10
  x ≤ 30 → 0.20 + (x − 10) / 20 × 0.10
  否则   → 0.30
该UID预估卖出 = 剩余持仓 × sellRate
```

口算锚点：浮盈/浮亏 5% 约卖 10% 仓，10% 约卖 20%，≥30% 卖 30%。

```
expectedSell  = Σ 各UID预估卖出
expectedSellU = expectedSell × P
```

再按盈亏带汇总 `sellBands`（只返回 `holdAmt > 0` 的带）：

| key | label | kind | 条件 |
| --- | --- | --- | --- |
| `p30` | 浮盈 ≥30% | profit | pnl ≥ 30 |
| `p20` | 浮盈 20–30% | profit | 20 ≤ pnl < 30 |
| `p10` | 浮盈 10–20% | profit | 10 ≤ pnl < 20 |
| `p5` | 浮盈 5–10% | profit | 5 ≤ pnl < 10 |
| `p0` | 浮盈 0–5% | profit | 0 < pnl < 5 |
| `l0` | 浮亏 0–5% | loss | −5 < pnl ≤ 0 |
| `l5` | 浮亏 5–10% | loss | −10 < pnl ≤ −5 |
| `l10` | 浮亏 10–20% | loss | −20 < pnl ≤ −10 |
| `l20` | 浮亏 20–30% | loss | −30 < pnl ≤ −20 |
| `l30` | 浮亏 ≥30% | loss | pnl ≤ −30 |

每个 band：

```
holdAmt = 落入该带的剩余持仓合计
sellAmt = 落入该带的预估卖出合计
holdPct = holdAmt / 用户持有流通代币 × 100
sellPct = sellAmt / expectedSell × 100     // expectedSell 为 0 则 0
```

### 4.5 沉睡

```
沉睡 ⇔ sleepDays ≥ sleepIdleDays
```

所内用户代币 = 所内该币余额合计 − 金库等 OWNED 持仓（做市库存也不算用户代币）。

### 4.6 收益率六档（筹码分布饼图）

对每个 REAL UID：`pct = (现价 − 均价) / 均价 × 100`。

| name | 条件 |
| --- | --- |
| 盈利 0–20% | 0 ≤ pct < 20 |
| 盈利 20–50% | 20 ≤ pct < 50 |
| 盈利 ≥50% | pct ≥ 50 |
| 亏损 0–20% | −20 < pct < 0 |
| 亏损 20–50% | −50 < pct ≤ −20 |
| 亏损 ≥50% | pct ≤ −50 |

不要用深套/浅套/小赚/大赚。不要返回 `color`。

### 4.7 库存带

做市库存占所内流通的百分比 `robotInv`：

```
bandStatus = robotInv < 40 ? '库存偏低' : robotInv > 60 ? '库存偏高' : '安全区间'
```

（前端配置里还有 `inventoryLow`/`inventoryHigh` 展示用，计算用 40/60。）

---

## 5. 页面 → 接口（只实现这些）

| 页面 | 路由 | 请求 |
| --- | --- | --- |
| 顶栏交易对 | 全局 | `GET /pairs` |
| 总览 | `/` | `GET /dashboard` |
| 做市今日 | `/ops/dump` | `GET /ops/desk` |
| 做市历史 | `/ops/dump/history` | `GET /ops/dump/history` + `GET /desk/mm/history` |
| 真实用户今日 | `/desk/users` | `GET /desk/users` + `GET /ops/desk`（取 `absorb`） |
| 真实用户历史 | `/desk/users/history` | `GET /desk/users/history` + `GET /ops/absorb/history` |
| 筹码分布 | `/desk/users/chips` | `GET /holders` |
| 单 UID | `/desk/user` | `GET /exchange-user` |
| 价格台阶 | `/ops/ladder` | `GET /ops/desk` + `/orderbook/obi` + `/position/cost-dev` + `/orderbook/blocks` + 挂单 WS |
| 今日充提 | `/whales/exchange` | `GET /whales/exchange` |
| 历史充提 | `/whales/exchange/history` | `GET /whales/exchange/history` |
| 金库等 | `/chips/internal` | `GET /internal-chips` |
| 机器人状态 | `/robots` | `GET /robot-status` |
| 机器人配置 | `/robots/config` | **无接口**，前端本地；状态接口收 `robot` JSON |
| 对手盘总览 | `/user-profile` | `GET /user-profile` |
| 散户/聪明钱等 | `/user-profile/{type}` | `GET /user-profile/{type}` ；保存 `PUT /user-rules` |
| 报警 | `/alerts` | `GET /alerts` |

下面按接口写字段和计算。JSON 只列前端会读的键。

---

## 6. `GET /pairs`

无查询参数。

`data`：字符串数组。

```json
["VBT/USDT", "BXT/USDT"]
```

---

## 7. `GET /dashboard`

**Query：** `pair`, `internalAccounts`, `sleepIdleDays`

总览。供给拆分 + 做市今日买卖 + 台阶预览 + 待处理警报。

### 7.1 供给拆分 `kpis`

先算：

```
circOnchain   = 链上仓库
circExchange  = circNum − circOnchain
mmQty         = 做市 tokenInv（不超过 circExchange）
exchUser      = circExchange − mmQty          // 所内用户代币
activeExchange = REAL 中未沉睡 UID 的持仓合计
sleepExchange  = exchUser − activeExchange
activeOnchain  = 链上仓库里「可随时充回」的估计；没有链上活跃标记时，用未锁仓、近 sleepIdleDays 有过充提的量
sleepOnchain   = circOnchain − activeOnchain
```

| 字段 | 计算 |
| --- | --- |
| `exchUser` | 所内用户代币 |
| `activeExchange` | 所内活跃 |
| `sleepExchange` | 所内沉睡 |
| `circExchange` | 所内流通 = 活跃 + 沉睡 + 做市 |
| `circOnchain` | 链上仓库 |
| `mmQty` | 做市库存 |
| `activeOnchain` | 链上可充回 |
| `sleepOnchain` | 链上沉睡 |

总览还展示 `ops.dump` / `ops.absorb` / `ops.stance` / `ops.ladder`，形状与第 8 节相同。

### 7.2 `mm`（今日做市买卖）

| 字段 | 计算 |
| --- | --- |
| `lastPrice` | 现价 |
| `sellQty` / `sellU` / `avgSell` | 做市对真实用户卖出。不含自成交 |
| `buyQty` / `buyU` / `avgBuy` | 做市对真实用户买入。不含自成交 |
| `usdtNet` | `sellU − buyU` |
| `netQty` | `buyQty − sellQty` |
| `avgNetPrice` | `usdtNet / netQty`，净数量为 0 时 `null` |
| `matchedQty` | `min(buyQty, sellQty)` |
| `realizedU` / `floatU` / `totalU` | 第 4.2 节 |
| `tokenInv` / `tokenOwn` / `tokenBorrowed` | 可周转 / 自有 / 虚增 |
| `tokenU` | `tokenInv × lastPrice` |
| `cashU` / `cashTrueU` / `cashBorrowedU` | 可周转 USDT / 真实 / 借入 |
| `equityU` | `cashU + tokenU` |
| `spreadPct` | `(avgSell − avgBuy) / avgBuy × 100` |
| `online` | `"在线数/配置数"`，如 `"2/2"` |
| `bandStatus` | 第 4.7 节 |

### 7.3 `users`

| 字段 | 计算 |
| --- | --- |
| `realUsers` | 当日 REAL 中有成交的 UID 数 |
| `holders` | REAL 中持仓 > 0 的 UID 数 |
| `tradedPct` | `realUsers / holders × 100` |
| `realBuy` / `realSell` / `realNet` | 第 3.3 节 |
| `realBuyU` / `realSellU` | 数量 × 对应均价 |
| `newTraders` | 当日首次在该交易对成交的 REAL UID |
| `retailBuy` / `retailSell` / `retailNet` | 标签=散户的买/卖/净 |
| `smartBuy` / `smartSell` / `smartNet` | 标签=聪明钱 |

### 7.4 警报摘要

| 字段 | 说明 |
| --- | --- |
| `alertSummary` | 一句摘要，如 `"3 条待处理"` |
| `alertItems` | 待处理列表，最多约 8 条 |

`alertItems[]`：

```json
{ "time": "10:21:06", "level": "紧急", "text": "UID 104821 充值 80万", "to": "/whales/exchange" }
```

`to` 用前端路由：`/alerts` `/ops/dump` `/ops/ladder` `/desk/users` `/whales/exchange` `/robots` `/chips/internal` `/user-profile/smart` 等。

---

## 8. `GET /ops/desk`

**Query：** `pair`, `sleepIdleDays`, `internalAccounts`, `date?`

做市今日、真实用户资产块、价格台阶都吃这一包。`date` 有值且不是今日时，返回那一天的日终切片（小时序列可空或按当日实际小时）。

### 8.1 `stance`

| 字段 | 计算 |
| --- | --- |
| `lastPrice` | 现价（展示字符串或数字均可） |
| `avgCost` | 真实用户群体持仓均价 |
| `devPct` | `(现价 − avgCost) / avgCost × 100` |
| `mmCost` | 做市库存成本 `invCost` |
| `mmDevPct` | `(现价 − mmCost) / mmCost × 100` |
| `action` | 建议动作文案，见下 |
| `actionColor` | `green` \| `yellow` \| `red` |
| `actionWhy` | 一句原因 |
| `nextStop` / `nextStopPrice` | 往上第一档 `play !== '可卖出'` 的 label / price |
| `nextFloor` / `nextFloorPrice` | 往下最后一档 `play === '可买入'` |

`action` 建议：

```
用户净买入 > 0 且 偏离 < 16% 且 用户USDT > 近端−5%买墙金额 → 「可拉，卖出」
偏离 ≥ 16% 且 用户净买入 > 0 → 「停拉，等高位卖完」
用户净买入 < 0 且 −5%买墙能盖住 3 倍净卖出 → 「可砸，买入」
当日大额充值进所较多 → 「先别拉」
否则 → 「别动」
```

### 8.2 `dump`（做市今日）

在第 7.2 节 `mm` 之上再给这些名字（页面读的是 dump 字段名）：

| 字段 | 等于 |
| --- | --- |
| `sellHigh` | `sellQty` |
| `buyLow` | `buyQty` |
| `usdtIn30` | `sellU` |
| `usdtOut30` | `buyU` |
| `usdtNet30` | `usdtNet` |
| `tokenDelta` | `netQty` |
| `matched` | `matchedQty` |
| `ownUsdt` | `cashU` |
| `dumpable` | `tokenInv` |
| `dumpableU` | `tokenU` |
| `invCost` | 第 4.1 节滚完的库存成本 |
| `lastPrice` | 现价 |
| `avgSell` / `avgBuy` | 做市均卖 / 均买 |
| `avgNetPrice` | 第 4.2 节 |
| `realizedU` / `floatU` / `totalU` | 第 4.2 节 |
| `tokenOwn` / `tokenBorrowed` / `cashTrueU` / `cashBorrowedU` / `cashOwnU` | 拆账；`cashOwnU = cashTrueU` |
| `sellUsers` / `buyUsers` | 当日被做市卖掉/买到的 REAL UID 数 |
| `sellFills` / `buyFills` | 对应成交笔数 |
| `retailBuy` … `smartNet` / `realBuy` … | 对手构成，用户口径 |
| `hours` / `sellHour` / `buyHour` | 24 点；卖出/买入小时量，合计分别等于 `sellHigh`/`buyLow` |
| `lastHour` / `costHour` / `netHour` | 小时现价、小时末库存成本、小时净买入 |
| `fills` | 做市视角成交明细，只含对手为真实用户的腿 |
| `dateKey` / `dateLabel` / `dateTitle` / `isToday` | 日切片元数据 |

`fills[]`：

```json
{
  "time": "10:21:06",
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

`side` 只允许 `卖出` | `买入`（做市方向）。`usdt = qty × price`。对手必须是真实用户，不要把自成交写进这张表。

小时成本序列：从日初自有库存和成本出发，每个小时按第 4.1 节滚；该小时买入按该小时均买入库，卖出先虚增再自有。`invCost` = 最后一小时末的成本。

### 8.3 `absorb`（真实用户资产，今日页会再取一次）

| 字段 | 计算 |
| --- | --- |
| `userToken` | 所内 REAL 持仓合计 |
| `userTokenU` | `userToken × lastPrice` |
| `userCashU` | REAL 的 USDT 余额合计 |
| `assetsU` | `userCashU + userTokenU` |
| `holders` | 持仓用户数 |
| `newMoneyU` | 近 30 日净充值进所、目前仍在账上的 USDT（估） |
| `oldMoneyU` | `userCashU − newMoneyU` |
| `bid2Qty` / `bid5Qty` / `bid10Qty` | 现价 −2%/−5%/−10% 以内真实买单 |
| `ask2Qty` / `ask5Qty` / `ask10Qty` | 现价 +2%/+5%/+10% 以内真实卖单 |
| `bid2U` 等 | 对应数量 × 现价（或挂单价合计） |
| `cashBands` | USDT 余额分档 |

`cashBands[]`：`{ name, users, cashU }`。建议档：`<1万USDT` / `1–10万` / `10–50万` / `≥50万`。不要 `color`。

### 8.4 `ladder[]`（7 档）

每档：

| 字段 | 计算 |
| --- | --- |
| `pct` | ±20/10/5/0 |
| `side` | `up` \| `down` \| `spot` |
| `label` | `现价` / `+10%` / `-5%` |
| `price` | 档位价 |
| `cumQty` / `cumU` | 第 4.4 节真实挂单累积 |
| `bandQty` / `bandU` | 本档增量 |
| `expectedSell` / `expectedSellU` | 第 4.4 节 |
| `sellBands` | 第 4.4 节 |
| `profitAmt` / `profitPct` | 该档价下成本 < P 的持仓及占比 |
| `lossAmt` / `lossPct` | 成本 ≥ P 的持仓 |
| `play` | `可卖出` / `可买入` / `对手接不住` / `余额不够` / `看` |
| `playKind` | `ok` / `no` / `watch` |
| `playWhy` / `whySell` / `whyBuy` | 给人看的短句 |

`play` 规则：

```
往上：expectedBuy(该档真实买墙) ≥ max(做市库存×0.2, 1) → 可卖出，否则 对手接不住
往下：做市 cashU ≥ expectedSellU × 0.55 → 可买入，否则 余额不够
现价：expectedBuy ≥ expectedSell → 可卖出，否则 可买入
```

总览台阶预览读 `label, price, side, bandQty, bandU, cumQty, cumU`。

### 8.5 `mmToday`

做市账户分 UID。没有配置 mm UID 时 `accounts` 为空数组。

`accounts[]`：

| 字段 | 计算 |
| --- | --- |
| `uid` / `remark` | 配置里的 |
| `status` | `运行中` / `离线` / `已停止` / `告警` |
| `statusTag` | `success` / `alert` / `warning` |
| `tokenOwn` / `tokenBorrowed` / `cashU` / `cashTrueU` / `cashBorrowedU` | 该 UID 账 |
| `buyFill` / `sellFill` | 该 UID 当日买/卖量 |
| `netQty` | `buyFill − sellFill` |
| `realizedU` / `floatU` | 该 UID 按 4.2 节 |

`history`（做市今日分时，给机器人页也可复用）：

```json
{
  "hours": ["00:00", "01:00"],
  "buyHour": [10.2],
  "sellHour": [8.1],
  "invHour": [420.0],
  "realizedHour": [0.3],
  "floatHour": [0.1],
  "netHour": [2.1]
}
```

`invHour[i]` = 该小时末 `tokenInv`。`realizedHour` 为累计交易盈亏。

### 8.6 其它

| 字段 | 说明 |
| --- | --- |
| `surfaceToken` | = `absorb.userToken` |
| `users` | 同第 7.3 节 |
| `ladderGloss` | 可原样返回预估卖出口径说明；前端有兜底文案 |

---

## 9. 做市历史

两个接口前端会一起请求。`days=all`。

### 9.1 `GET /ops/dump/history`

交易历史（日卖出/买入/盈亏/库存成本）。

`kpis`：

| 字段 | 计算 |
| --- | --- |
| `periodSell` / `periodBuy` | 区间做市卖/买合计 |
| `periodSellU` / `periodBuyU` | 金额合计 |
| `periodToken` | `periodBuy − periodSell` |
| `periodUsdt` | 区间 `usdtNet` 合计 |
| `avgSell` / `avgBuy` | 区间数量加权均价 |
| `matched` / `realizedU` / `floatU` / `totalU` | 用区间合计买/卖 + 期末现价走 4.2 |
| `endLast` / `endCost` | 期末现价 / 期末库存成本 |
| `sellUsers` / `buyUsers` / `sellFills` / `buyFills` | 区间去重人数、笔数 |
| `retailBuy` … `realNet` | 区间对手构成 |

`series`：`dates, sellQty, buyQty, usdtNet, lastPrice, invCost, netQty`（旧→新）。

`rows[]`（新→旧）每日：

```
date, dateKey, sellQty, buyQty, avgSell, avgBuy, sellU, buyU,
netQty（或 tokenDelta）, usdtNet, realizedU, lastPrice, invCost
```

日 `invCost`：从上币日滚到该日终，规则同 4.1，**不要**用当日均买冒充期末成本。

### 9.2 `GET /desk/mm/history`

资产历史（库存、USDT 拆账）。

`kpis`：

| 字段 | 计算 |
| --- | --- |
| `endInv` / `endTokenOwn` / `endTokenBorrowed` | 期末库存拆账 |
| `endCash` / `endCashTrue` / `endCashBorrowed` | 期末 USDT 拆账 |

`series`：`dates, tokenInv, tokenOwn, tokenBorrowed, cash, cashOwn, cashBorrowed, equity, buyQty, sellQty`。

`rows[]` 每日：`date, dateKey, tokenInv, tokenOwn, tokenBorrowed, cashU, cashTrueU, cashBorrowedU, equityU, buyQty, sellQty, netQty, realizedU`。

`accountBooks[]`：每个做市 UID 一份日账，字段与 `rows` 相同，按该 UID 实际余额，不要简单按比例拆（最后一只 UID 用合计减其它，避免四舍五入对不齐）。

```json
{ "uid": "88001", "remark": "做市主账户", "rows": [ ] }
```

做市历史页把 9.1 的交易 KPI 和 9.2 的期末余额拼在一起。两接口期末日必须对齐「今日」。

---

## 10. 真实用户今日 / 历史

### 10.1 `GET /desk/users`

**Query：** `pair`, `internalAccounts`, `date?`

`kpis`：第 7.3 节全部 + 

| 字段 | 计算 |
| --- | --- |
| `buyUsers` / `sellUsers` | 当日买过 / 卖过的 REAL UID（可重叠） |
| `returning` | `realUsers − newTraders` |
| `avgTicket` | `(realBuy + realSell) / realUsers` |
| `avgBuy` / `avgSell` | 用户买入均价 / 卖出均价 |
| `lastPrice` | 现价 |
| `realBuyU` / `realSellU` | 金额 |

`status[]`：4 条左右，最后一条固定提示不含内部 UID。

`history`：

```json
{
  "hours": ["00:00"],
  "buyHour": [1.2],
  "sellHour": [0.8],
  "userHour": [12],
  "newHour": [1]
}
```

小时买/卖合计 = 当日 `realBuy`/`realSell`。`userHour` = 该小时有成交的人数。`newHour` 合计 = `newTraders`。

`priceFlow`：按成交价分布，不是按时间。

```json
{
  "labels": ["0.8900", "0.9000"],
  "prices": [0.89, 0.9],
  "buy": [12.0, 8.4],
  "sell": [3.1, 10.2],
  "lastPrice": 0.9124,
  "avgBuy": 0.905,
  "avgSell": 0.918
}
```

`buy[]`/`sell[]` 合计分别等于 `realBuy`/`realSell`。把当日每笔真实成交按价格落到区间。

`tags[]`：

```json
{
  "name": "散户",
  "className": "warning",
  "users": 80,
  "ratio": 62.5,
  "buy": 40.1,
  "sell": 38.2,
  "net": 1.9
}
```

`name` 必须是：`聪明钱` / `散户` / `羊毛党` / `程序化`（不要在这张表放 KOL）。`ratio` 是人数占 `realUsers` 的 %。

`traders[]`：当日成交用户抽样（建议按 |净买入| 或成交额取前 50～200）：

```json
{
  "uid": "104821",
  "tag": "散户",
  "tagClass": "warning",
  "buy": 3.2,
  "sell": 1.1,
  "net": 2.1,
  "trades": 8,
  "avgPrice": 0.91,
  "firstTime": "09:12",
  "kind": "新增"
}
```

`kind`：`新增` | `回流`。

### 10.2 `GET /desk/users/history`

区间交易。`days=all`。

`kpis`：

| 字段 | 计算 |
| --- | --- |
| `endUsers` / `endHolders` | 期末交易用户 / 持仓用户 |
| `periodBuy` / `periodSell` / `periodNet` | 区间用户买/卖/净 |
| `periodBuyU` / `periodSellU` | 金额 |
| `avgBuy` / `avgSell` | 区间数量加权 |
| `endAvgTicket` | 期末人均成交 |

`series`：`dates, realUsers, holders, newTraders, realBuy, realSell, realNet`。

`rows[]` 每日：`date, dateKey, realUsers, holders, newTraders, returning, realBuy, realSell, realNet, realBuyU, realSellU, avgBuy, avgSell, tradedPct, avgTicket, holdQty, avgCost`。

`holdQty` = 该日终 REAL 持仓合计。`avgCost` = 该日终群体持仓均价。从期末倒推时：`昨日持仓 ≈ 今日持仓 − 今日净买入`（再加减充提）。

### 10.3 `GET /ops/absorb/history`

区间资产。前端按 `dateKey` 合并进 10.2 的日表。

`rows[]` 每日：`date, dateKey, cashU, tokenQty, tokenU, assetsU, holders, cashPct`。

```
cashPct = cashU / assetsU × 100
tokenU  = tokenQty × 当日现价（或日终价）
assetsU = cashU + tokenU
```

`series` 可选：`dates, cashU, tokenQty, tokenU, assetsU`。

期末必须对齐今日 `absorb`。

---

## 11. `GET /holders`

**Query：** `pair`, `sleepIdleDays`, `internalAccounts`

筹码分布。只含 REAL。

### 11.1 `kpis`

| 字段 | 计算 |
| --- | --- |
| `totalAmount` | REAL 持仓合计 |
| `userCount` | 持仓人数 |
| `activeAmount` / `activeUsers` | 未沉睡 |
| `sleepAmount` / `sleepUsers` / `sleepRatio` | 沉睡；`sleepRatio = sleepAmount / totalAmount × 100` |
| `lastPrice` / `lastPriceLabel` | 现价 |
| `avgCost` / `avgCostLabel` | 数量加权持仓均价 |
| `medianCost` / `medianCostLabel` | 按持仓量累加到 50% 时的均价 |
| `devPct` | `(现价 − avgCost) / avgCost × 100` |
| `profitAmount` / `profitPct` / `profitUsers` | 均价 < 现价 |
| `lossAmount` / `lossPct` / `lossUsers` | 均价 ≥ 现价 |
| `denseName` / `densePct` / `denseUsers` | 持仓量最大的成本档 |
| `mostUsersName` / `mostUsers` / `mostUsersPct` | 人数最多的成本档 |
| `sleepIdleDays` | 回传请求值 |

### 11.2 `rows[]`（UID 明细）

```json
{
  "id": "104821",
  "amount": 12.4,
  "cost": 0.88,
  "costLabel": "0.88",
  "pnlWan": 0.4,
  "ratio": "+3.6%",
  "sleepDays": 2,
  "days": 18,
  "lastActive": "今日 09:12",
  "status": "活跃",
  "statusTag": "user",
  "costBand": "0.85–0.90"
}
```

```
pnlWan = amount × (lastPrice − cost)
ratio  = (lastPrice − cost) / cost × 100，带符号百分号字符串
status = sleepDays ≥ sleepIdleDays ? '沉睡' : (sleepDays ≤ 2 ? '活跃' : '监控中')
statusTag = 沉睡 warning / 活跃 user / 监控中 robot
```

**不要** `pnlColor`。按 `amount` 降序。

### 11.3 `costBands[]`

按持仓均价直方图。步长建议：均价 ≥1000 用 100，≥100 用 10，≥10 用 5，否则 0.05。从 `min(各UID成本, 现价)` 对齐到 `max`。

| 字段 | 计算 |
| --- | --- |
| `name` | `"0.85–0.90"` |
| `min` / `max` | 左闭右开（最后一档右闭） |
| `amount` / `users` | 落入该档 |
| `ofTotal` | `amount / totalAmount × 100` |
| `activeAmount` / `sleepAmount` / `activeUsers` / `sleepUsers` | 档内拆沉睡 |
| `vsPct` | `(现价 − 档中点) / 档中点 × 100` |
| `vsLabel` | 带符号百分号 |
| `stance` | 档上限 ≤ 现价 → `浮盈`；档下限 ≥ 现价 → `浮亏`；否则 `跨现价` |
| `stanceTag` | 浮盈 `user` / 浮亏 `alert` / 跨现价 `warning` |
| `containsPrice` | 现价落在该档 |

### 11.4 `pnlBuckets[]`

第 4.6 节六档。每档：`name, amount, users, pct`。`pct = amount / totalAmount × 100`。不要 `color`。

### 11.5 `concentration[]`

前 5 名 + 其他：

```json
[
  { "name": "用户104821", "value": 12.4 },
  { "name": "其他用户", "value": 80.1 }
]
```

### 11.6 `idleDist[]`

按无成交天数：`0–2天` / `3–7天` / `8–14天` / `15–29天` / `30–59天` / `60天+`。

```json
{ "name": "30–59天", "value": 20.1, "users": 8, "sleeping": true }
```

`sleeping = 该档下限 ≥ sleepIdleDays`。

### 11.7 `history`

近 30 日：`dates, sleepAmounts, activeAmounts, sleepRatios`。期末对齐今日。

---

## 12. 价格台阶配套接口

台阶页同时请求 `/ops/desk`、本节三个 HTTP，以及挂单 WS。

### 12.1 `GET /orderbook/obi`

**Query：** `pair`, `depthLevels`, `obiWarn`

`kpis`：第 4.3 节全部，外加：

| 字段 | 计算 |
| --- | --- |
| `levels` | 回传 `depthLevels` |
| `warn` | 回传 `obiWarn` |
| `bias` | `realObi≥0.35 买盘强势`；`≥0.15 买盘偏厚`；`≤−0.35 卖盘强势`；`≤−0.15 卖盘偏厚`；否则 `买卖均衡` |
| `peak` / `trough` | 近 24 点 `realSeries` 最大/最小 |

`history`：

```json
{
  "hours": ["00:00"],
  "realSeries": [0.12],
  "grossSeries": [0.05],
  "bidSeries": [80.1],
  "askSeries": [70.2]
}
```

半小时或 1 小时均可，长度与 `hours` 一致。最后一点 = 当前 `realObi`。

台阶页 KPI 用：`realObi, realObiLabel, grossObiLabel, realBid, realAsk, bidQty, askQty, levels`。

### 12.2 `GET /position/cost-dev`

**Query：** `pair`, `costDevWarn`

与 `/holders` 同一批 REAL、同一个群体均价。

`kpis`：

| 字段 | 计算 |
| --- | --- |
| `lastPrice` | 现价 |
| `avgCost` | 群体持仓均价 |
| `dev` | `(lastPrice − avgCost) / avgCost × 100` |
| `devLabel` | 带符号字符串，如 `"+12.4"` |
| `profitRatio` | 浮盈筹码占比 %（均价 < 现价的持仓 / 总持仓 × 100） |
| `underwater` | `100 − profitRatio` |
| `warn` | 回传 `costDevWarn` |
| `alert` | `|dev| ≥ warn` |

### 12.3 `GET /orderbook/blocks`

**Query：** `pair`, `whaleThreshold`, `internalAccounts`

当日 REAL 成交里 `qty ≥ whaleThreshold` 的大单。

`kpis`：

| 字段 | 计算 |
| --- | --- |
| `buyAmt` / `buyCount` / `buyU` | 用户大额买入合计 / 笔数 / 金额 |
| `sellAmt` / `sellCount` / `sellU` | 用户大额卖出 |
| `tradeNet` | `buyAmt − sellAmt`（用户净买入） |
| `tradeVolume` | `buyAmt + sellAmt` |
| `alertCount` | 未处理且标红的条数 |
| `pending` | 状态不是「已处理」的条数 |

标红建议：单笔 ≥ `whaleThreshold × 1.6`，或人工未处理。

`rows[]`（新→旧）。页面表格只用：`time, uid, tag, tagClass, side, amount, amountU`。

```json
{
  "time": "10:21:06",
  "uid": "104821",
  "tag": "大户",
  "tagClass": "warning",
  "side": "买",
  "action": "大额买入",
  "amount": 80.0,
  "amountU": 73.0
}
```

`side`：`买` | `卖`。用户买 = 做市卖出。不要依赖 `impact` / `status` / `note`（可以不传）。

`status[]` 两句即可：净买入/净卖出；阈值与待处理。

### 12.4 `GET /orders` + `WS /ws/orders`

真实用户挂单。REST 给首屏快照；之后用 WS 推。不要靠轮询整表。

`data`：

```json
{
  "badge": "共128笔挂单 · 实时",
  "rows": [
    {
      "id": "ord-1001",
      "price": "0.9100",
      "side": "买",
      "tag": "user",
      "amount": 12.4,
      "account": "104821",
      "time": "10:21:06"
    }
  ]
}
```

| 字段 | 说明 |
| --- | --- |
| `id` | 稳定 ID，增量删除靠它 |
| `price` | 字符串或数字 |
| `side` | `买` \| `卖` |
| `tag` | 真实用户必须 `user`；做市单不要进这张表（页面是「真实用户挂单」） |
| `amount` | 未成交剩余，万枚 |
| `account` | UID 或脱敏展示 |
| `time` | 挂单时间 `HH:mm:ss` |

同价多笔**不要合并**，前端会标「同价 n笔」。`≥ whaleThreshold` 的前端自己高亮。

「至该价累计」前端自己算，后端不用给。

可选 `volumeByPrice` / `cancelTop`，当前台阶页不用。

WS 见第 19 节。

---

## 13. `GET /exchange-user`

**Query：** `pair`, `uid`, `scope=pair|all`

`scope=pair`：只当前交易对。`all`：该 UID 全部代币，数量类 KPI 改为万 USDT。

### 13.1 头

| 字段 | 说明 |
| --- | --- |
| `uid` | 回传 |
| `pair` / `token` | 当前交易对 / 基准币 |
| `scope` | `pair` \| `all` |
| `scopeLabel` | `当前代币 · VBT` 或 `全部代币` |
| `qtyUnit` | `pair` → `万`；`all` → `万USDT` |
| `qtyNote` | 一句说明 |
| `cashU` | 现金余额（与 `kpis.cashU` 相同） |

`profile`：`registered, lastActive, kyc, vip, days, region`。

`tags[]`：`{ label, className, to }`。`to` 如 `/user-profile/smart`。

### 13.2 `kpis`

| 字段 | 计算 |
| --- | --- |
| `equityU` | `cashU + tokenU` |
| `cashU` | USDT 余额 |
| `tokenU` | 代币市值合计 |
| `posQty` | `pair`：该币持仓；`all`：可仍给合计数量，页面主要看 `tokenU` |
| `avgCost` / `lastPrice` | 该币（或组合加权） |
| `pnlU` | `Σ amount × (现价 − 成本)` |
| `pnlPct` | `pnlU / (tokenU − pnlU) × 100`，分母接近 0 时给 0 |
| `todayBuy` / `todaySell` / `todayNet` | 今日买/卖/净；`all` 用万 USDT |
| `totalBuy` / `totalSell` | 注册以来 |
| `winRate` | 近 30 日已实现：盈利笔数 / 有已实现盈亏的笔数 × 100 |
| `profitRatio` | 近 30 日 `Σ盈利金额绝对值 / Σ亏损金额绝对值` |
| `trades30` | 近 30 日成交笔数 |
| `tradeDays` | 近 30 日有成交的日历日 |
| `avgHoldHours` | 近 30 日已平仓周期的平均持仓小时 |
| `cancelRatio` | 撤单笔数 / 挂单笔数 × 100 |
| `avgTicket` | 近 30 日均笔数量 |
| `openOrders` | **= `orders.length`** |
| `deposit30` / `withdraw30` | 近 30 日充/提，万 USDT |

### 13.3 `orders[]`（当前挂单，放在成交纪录前面）

```json
{
  "time": "10:21:06",
  "pair": "VBT/USDT",
  "token": "VBT",
  "side": "买",
  "tag": "user",
  "qty": 2.4,
  "price": 0.905,
  "notional": 2.17
}
```

`side`：`买` | `卖`。`notional = qty × price`。按价格降序。

### 13.4 `assets[]`

```json
{
  "token": "VBT",
  "pair": "VBT/USDT",
  "qty": 12.4,
  "price": 0.9124,
  "cost": 0.88,
  "valueU": 11.3,
  "pnl": 0.4,
  "pnlPct": 3.7,
  "weight": 100.0
}
```

```
valueU = qty × price
pnl    = qty × (price − cost)
pnlPct = (price − cost) / cost × 100
weight = valueU / ΣvalueU × 100
```

不要 `color`。

### 13.5 `fills[]`

```json
{
  "time": "08/28 10:21",
  "pair": "VBT/USDT",
  "token": "VBT",
  "side": "买入",
  "tag": "user",
  "qty": 1.2,
  "price": 0.91,
  "fee": 0.001,
  "notional": 1.09
}
```

`side`：`买入` | `卖出`。

### 13.6 `transfers[]`

```json
{
  "time": "08/28 09:10",
  "pair": "VBT/USDT",
  "token": "VBT",
  "action": "充值",
  "amount": 8.0,
  "amountU": 7.3,
  "chain": "BSC",
  "address": "0x…",
  "status": "已处理",
  "statusTag": "success"
}
```

`scope=pair` 时只留当前币。

### 13.7 `history`

近 30 日：`dates, buy, sell, pos, pnl`。`all` 时再给 `tokens: [{ name, buy[], pos[] }]`。期末对齐当前持仓和浮盈。

### 13.8 `habits[]`

```json
{ "label": "平均持仓", "value": "6.2小时", "note": "日内" }
```

四条：平均持仓、挂撤比、单笔规模、成交频率。

`status[]`：KYC、今日净买卖、浮盈亏、近 30 日成交。

---

## 14. 充提

剔除 INTERNAL。充值 = 所内可卖供给增加；提现 = 货离开本所。

### 14.1 `GET /whales/exchange`

**Query：** `pair`, `whaleThreshold`, `internalAccounts`, `date?`

`kpis`：

| 字段 | 计算 |
| --- | --- |
| `depositAmt` / `depositU` / `depositCount` / `depositUsers` | 当日充值数量/金额/笔数/人数 |
| `withdrawAmt` / `withdrawU` / `withdrawCount` / `withdrawUsers` | 提现 |
| `transferNet` / `transferNetU` | `deposit − withdraw` |
| `depositVsPrev` / `withdrawVsPrev` | 相对前一日数量差（万枚） |
| `topDepositShare` | 充值金额前 3 UID 占充值合计 % |
| `alertCount` / `pending` | 标红 / 未处理 |
| `largestAmt` / `largestU` / `largestUid` / `largestAction` / `largestTime` / `largestTag` / `largestTagClass` / `largestChain` / `largestStatus` / `largestStatusTag` | 当日单笔最大；没有则金额 0、UID `"—"` |

标红：单笔 ≥ `whaleThreshold × 1.7`（或你们风控规则），且未处理。

`rows[]`：

```json
{
  "time": "10:21:06",
  "uid": "104821",
  "tag": "大户",
  "tagClass": "warning",
  "action": "充值",
  "amount": 80.0,
  "amountU": 73.0,
  "chain": "BSC",
  "address": "0x…",
  "status": "红色",
  "statusTag": "alert"
}
```

`action`：`充值` | `提现`。`status`：`红色` | `监控中` | `已处理`。

`topDeposits` / `topWithdraws`：按 UID 汇总，最多 6 条：

```json
{ "uid": "104821", "tag": "大户", "tagClass": "warning", "amount": 80.0, "count": 2, "lastTime": "10:21:06" }
```

`hours`：`labels, deposit, withdraw, net`。`net[i] = deposit[i] − withdraw[i]`。合计对齐当日 KPI。

### 14.2 `GET /whales/exchange/history`

`days=all`。

`kpis`：`periodDeposit, periodWithdraw, periodNet` 及对应 `*U`；`netInDays`（净充≥0 的天数）；`maxDeposit` / `maxWithdraw`。

`series`：`dates, depositAmt, withdrawAmt, netAmt`。

`rows[]` 每日：`date, dateKey, depositAmt, depositU, withdrawAmt, withdrawU, netAmt, netU, depositCount, withdrawCount, depositUsers, withdrawUsers`。

期末日对齐今日。

---

## 15. `GET /internal-chips`

**Query：** `pair`, `internalAccounts`

金库等 + 做市库存对照。买卖不在这本账。

`kpis`：

| 字段 | 计算 |
| --- | --- |
| `internalPct` / `internalAmount` | INTERNAL 持仓 / 占流通 % |
| `ownedPct` / `ownedAmount` | OWNED（不含 mm） |
| `dumpable` / `ownUsdt` | 做市 `tokenInv` / `cashU` |
| `tokenOwn` / `tokenBorrowed` / `cashTrueU` / `cashBorrowedU` | 做市拆账 |
| `robotInv` | 做市库存占所内流通 % |
| `bandStatus` | 第 4.7 节 |
| `lockedRatio` / `lockedAmount` | OWNED 中状态含「锁」的量 / 占 ownedAmount |
| `ownedChange30` / `ownedChange30Amount` | 近 30 日 OWNED 占比差、数量差 |
| `invChange30` / `invChange30Amount` | 近 30 日做市库存 % 差、数量差 |
| `targetLow` / `targetHigh` | `40` / `60` |
| `ownedAccountCount` | OWNED UID 数 |
| `internalSub` / `ownedSub` | 短说明 |

`history` 近 30 日：`dates, percents, amounts, inventory, ownedPercents, ownedAmounts, borrowedAmounts`。

- `percents[i]` = 当日内部合计占流通 %
- `inventory[i]` = 做市库存占流通 %
- `ownedPercents[i] = percents − inventory`
- 数量数组用流通 × 对应 %

`composition[]`：`{ name, value }`，name 为 `做市账户` / `平台金库` / `项目方` / `内部人员` / `LP 底池`，value 万枚。不要 `color`。

`accounts[]`：

```json
{
  "uid": "71001",
  "remark": "平台金库多签",
  "type": "平台金库",
  "borrowed": false,
  "amount": 120.0,
  "ratio": 40.0,
  "cost": 0.72,
  "pnl": 24.0,
  "lastMove": "今日 10:12",
  "status": "锁定",
  "statusTag": "user",
  "tag": { "className": "user" }
}
```

```
ratio = amount / internalAmount × 100
pnl   = amount × (lastPrice − cost)
borrowed = (typeKey === 'mm')
```

做市行 `cost` 用库存成本；金库等用该 UID 自己的移动加权。

`rebalance[]`：近 7 日内部调仓 `time, from, to, amount, reason`。

---

## 16. 机器人

配置页**不请求后端**，JSON 存在浏览器。运行状态页把整份配置当查询参数传上来。

### 16.1 `GET /robot-status`

**Query：** `pair`, `internalAccounts`, `robot`（JSON 字符串）

`robot` 形状：

```json
{
  "enabled": true,
  "strategies": {
    "quote": {
      "order": {
        "bid": [{ "id": 1, "minPrice": 0.1, "maxPrice": 0.3, "minAmt": 10000, "maxAmt": 20000, "count": 5, "intervalMs": 1000 }],
        "ask": [{ "id": 1, "minPrice": 0.1, "maxPrice": 0.3, "minAmt": 10000, "maxAmt": 20000, "count": 5, "intervalMs": 1000 }]
      },
      "wash": { "minIntervalMs": 1000 },
      "quote": {
        "spreadType": "fixed",
        "bidSpread": 0.1,
        "askSpread": 0.1,
        "minDistance": 0.1,
        "maxDistance": 0.2,
        "priceRandom": 1
      }
    }
  },
  "bots": [
    { "uid": "88001", "running": true, "strategy": "quote", "wash": true }
  ]
}
```

策略 key：`quote` | `guard` | `inventory` | `follow` | `passive`。

挂单规则：`minPrice`/`maxPrice` 是相对现价的千分比（`0.1` = 0.1% = 千分之一）。`minAmt`/`maxAmt` 是每单金额 **USDT（不是万）**。`count` 档位数。`intervalMs` 相邻两笔挂单间隔。

只统计 `internalAccounts` 里 `type=mm` 且出现在 `bots` 里的 UID。

`kpis`：

| 字段 | 计算 |
| --- | --- |
| `robotCount` | 配置的做市 UID 数 |
| `onlineCount` | 心跳正常且 `running` 且总开关 `enabled` |
| `borrowedAmount` | 做市 `tokenInv` |
| `tokenOwn` / `tokenBorrowed` | 拆账 |
| `bandStatus` | 第 4.7 节 |
| `dayPnlU` / `realizedU` / `floatU` | 全部做市 UID 合计，4.2 节（只计对真实用户） |
| `turnover` | `Σ buyFill + Σ sellFill`，只计对真实用户 |
| `turnoverU` | `turnover × lastPrice` |
| `bsRatio` | `ΣbuyFill / ΣsellFill`，卖为 0 则 0 |
| `avgSpread` | 各 UID 报价价差均值，bps |
| `cover` | 近端档位被自有挂单覆盖的比例 % |

`robots[]`：

| 字段 | 说明 |
| --- | --- |
| `uid` / `remark` / `strategy` | 配置 |
| `strategyLabel` | `做市报价` / `护盘托价` / `库存回归` / `跟价推进` / `仅挂不吃` |
| `running` / `online` / `washOn` | 布尔 |
| `status` | `运行中` / `离线` / `已停止` / `告警` |
| `statusTag` | `success` / `alert` / `warning` |
| `amount` | 该 UID 的 tokenInv |
| `tokenOwn` / `tokenBorrowed` | 拆账 |
| `ratio` | `amount / 合计 tokenInv × 100` |
| `buyFill` / `sellFill` / `dayPnl` / `realizedU` / `floatU` | 当日对真实用户；自成交不进 |
| `spread` | 该 UID 价差 bps |
| `cancelRate` | 撤单 / 挂单 × 100 |
| `quotes` | 当前挂单档数 |
| `latency` | 心跳延迟 ms |
| `heartbeat` | 如 `"16ms · 8秒前"` 或 `"失联"` / `"已停止"` |

`history`：近 24 小时 `hours, inventory, buyVol, sellVol, pnl, spread`。`inventory` 可以是占流通 % 或万枚，与 KPI 库存带一致即可。`pnl` 为累计盈亏。

`events[]`：`time, uid, type, detail, tag`。`tag` 用 className。

`status[]`：在线、库存带、报价覆盖、自成交开/关、今日盈亏。

---

## 17. 对手盘

### 17.1 标签规则（用 `PUT /user-rules` 的阈值）

只对 REAL。一个 UID 可多标签。默认阈值：

| 标签 | 命中条件（AND） |
| --- | --- |
| 聪明钱 | 近 30 日成交笔数 ≥ `smartTradeCount`，胜率 ≥ `smartWinRate`%，盈亏比 ≥ `smartProfitRatio`，单笔仓位（相对净值）≥ `smartPosition` |
| 散户 | 笔数 ≥ `retailTradeCount`，净收益符号 = `retailNetProfit`（`negative`/`positive`），胜率 ≤ `retailWinRate`%，持仓时间比 ≥ `retailHoldRatio`，强平率 ≥ `retailLiquidation`% |
| 羊毛党 | 同设备指纹 UID 数 ≥ `woolDevice`，**或** 同 C 段 IP UID 数 ≥ `woolIP` |
| 吃客损KOL | 跟风散户 ≥ `kolFollowMin`，喊单后 `kolDumpWindow` 分钟内本人净卖，反向成交占比 ≥ `kolReverseRatio`% |
| 程序化 | 持仓生命周期 ≤ `progHoldTime` 分钟，挂撤比 ≥ `progCancelRatio` |

胜率 / 盈亏比：近 30 日已实现，算法同单 UID。持仓时间比 = 平均持仓小时 / 该 UID 有仓的小时。挂撤比 = 挂单笔数 / 成交笔数。

### 17.2 `GET /user-profile`

无 `pair`（全站）。不要返回 tags 上的 hex `color`。

```json
{
  "total": 1284,
  "activeToday": 312,
  "tags": [
    { "name": "聪明钱", "key": "smart", "to": "/user-profile/smart", "value": 42, "ratio": "3.3%" }
  ],
  "trend": {
    "dates": ["08/21", "08/22"],
    "smart": [38, 42],
    "retail": [880, 892],
    "wool": [60, 67],
    "kol": [18, 23],
    "prog": [32, 38]
  },
  "users": [
    {
      "id": "104821",
      "registered": "2026-08-20",
      "trades": 28,
      "winRate": "72%",
      "profitRatio": 2.1,
      "tags": [{ "label": "聪明钱", "className": "success" }]
    }
  ]
}
```

`tags` 五个都要：`smart` / `retail` / `wool` / `kol` / `prog`。`ratio` 是占 `total` 的字符串百分比。`users` 抽样列表，点 UID 进 `/desk/user?uid=`。

### 17.3 `GET /user-profile/{type}`

`type`：`smart` | `retail` | `wool` | `kol` | `prog`。**Query：** `pair`

| 字段 | 说明 |
| --- | --- |
| `key` / `name` / `className` | 与 PERSONA 一致 |
| `blurb` | 可空。羊毛/KOL/程序化给一句人话 |
| `status[]` | 覆盖人数、规则摘要 |
| `kpis[]` | `{ label, value, unit?, qty?, sub? }` 不要 hex |
| `charts[]` | `{ title, badge, x[], legend[], series: [{ name, type: "line"|"bar", data[] }] }` 不要 series.color |
| `notes[]` | 可 `[]` |
| `columns[]` / `rows[]` | 名单 |

**散户名单列（只要这些）：** `id, winRate, position, pnl, holdDays`。不要追涨次数、不要状态列。

```json
{
  "columns": [
    { "key": "id", "label": "UID" },
    { "key": "winRate", "label": "胜率" },
    { "key": "position", "label": "当前仓位", "format": "qty", "unit": "万" },
    { "key": "pnl", "label": "浮盈亏", "format": "signed", "unit": "万" },
    { "key": "holdDays", "label": "持仓(天)" }
  ],
  "rows": [
    { "id": "104821", "winRate": "32%", "position": 3.6, "pnl": -1.2, "holdDays": 5 }
  ]
}
```

**聪明钱列：** `id, winRate, profitRatio, position, net`（今日净买）。

**羊毛：** 按簇，列 `cluster, device, ip, accounts, size, last`。

**KOL：`columns: []`, `rows: []`。** 页面不展示名单。KPI 和图表仍要。

**程序化列：** `id, style, holdSec, cancel, turnover, latency`。

`format`：`qty` 数量、`signed` 带符号。没有 format 当文本。

### 17.4 `PUT /user-rules`

Body 为完整规则对象（前端会把五类字段合并后提交）：

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

存下来，画像接口按新阈值重算。返回存后的对象即可。

---

## 18. `GET /alerts`

**Query：** `pair`, `whaleThreshold`, `costDevWarn`, `depthLevels`, `obiWarn`, `internalAccounts`, `excludedAddresses`

全站待处理。去重键：`time + text`。

`kpis`：

| 字段 | 计算 |
| --- | --- |
| `total` | 今日条数 |
| `urgent` / `warn` / `watch` | 级别计数 |
| `pending` | `status !== '已处理'` |
| `handled` | `total − pending` |

建议生成规则（级别 / 来源 / 跳转）：

| 条件 | level | source | to |
| --- | --- | --- | --- |
| 充提 `status=红色` | 紧急 | 充提 | `/desk/user/{uid}` |
| 盘口大单标红 | 紧急 | 盘口大单 | `/desk/user/{uid}` |
| `|realObi| ≥ obiWarn` | 预警 | 盘口 | `/ops/ladder` |
| `|dev| ≥ costDevWarn` | 预警 | 价格台阶 | `/ops/ladder` |
| 台阶 `playKind=no` | 预警 | 价格台阶 | `/ops/ladder` |
| 做市 `cashU` 过薄 | 紧急 | 自己的账 | `/ops/dump` |
| 做市离线 / 库存带 | 预警 | 做市 | `/robots` |
| 聪明钱净买 > 0 | 关注 | 聪明钱 | `/user-profile/smart` |

`rows[]`：

```json
{
  "id": "alert-1",
  "time": "10:21:06",
  "level": "紧急",
  "source": "充提",
  "text": "UID 104821 充值 80万",
  "detail": "",
  "status": "未处理",
  "statusTag": "alert",
  "to": "/desk/user/104821"
}
```

`status`：`未处理` | `监控中` | `已处理`。`statusTag`：未处理 `alert`，监控中 `warning`，已处理 `success`。

`sources`：来源去重数组。`byLevel` / `bySource`：`{ name, value }`，不要 `color`。

总览 `alertItems` 用同一套里 `pending` 的前几条。

---

## 19. WebSocket 挂单

- 开发代理：`/ws` → 后端（已开 `ws: true`）
- 默认：`ws(s)://{host}/ws/orders?pair=VBT/USDT&accessToken=`
- 也可 `VITE_WS_BASE_URL`，例如 `ws://localhost:8080/ws`

连上后客户端发送：

```json
{ "type": "subscribe", "channel": "orders", "pair": "VBT/USDT" }
```

心跳：每 15s `{ "type": "ping", "pair": "VBT/USDT" }`。请回 `pong` 或忽略。

整表快照：

```json
{
  "type": "snapshot",
  "pair": "VBT/USDT",
  "data": { "badge": "共128笔挂单 · 实时", "rows": [ ] }
}
```

`data` 与 `GET /orders` 相同。

增量：

```json
{
  "type": "delta",
  "pair": "VBT/USDT",
  "upserts": [ { "id": "ord-1001", "price": "0.91", "side": "买", "tag": "user", "amount": 10.0, "account": "104821", "time": "10:22:01" } ],
  "removes": ["ord-1002"]
}
```

错误：`{ "type": "error", "message": "……" }`。

WS 连续失败约 4 次后前端会短暂改 REST 轮询，连上再切回。

---

## 20. 验收清单

请后端自测这些对齐，前端才能对上：

1. **单位**：数量万枚、金额万 USDT、`金额 = 数量 × 价格`。
2. **镜像**：用户买入合计 = 做市卖出合计（同一批对真实用户成交；自成交不进任何一侧）。
3. **成本**：用户持仓均价与做市库存成本都按 4.1 滚；虚增不进做市成本。
4. **USDT 拆账**：KPI 第二行是 `自有 n · 借入虚增 n`，中间用点号，不要加号。
5. **内部 UID**：成交、挂单、充提、持仓、标签全部剔除。
6. **历史**：`days=all` 从上市日到今日；期末日 = 今日接口同一数字。
7. **台阶**：7 档；现价挂单 0；`expectedSell` 用 4.4 的分段卖出率；`sellBands` 按盈亏带。
8. **OBI**：真实剔除做市；页面主数字是真实，含做市放在 qty 行。
9. **pnlBuckets**：六档名称与 4.6 完全一致。
10. **挂单**：真实用户、未合并同价、带稳定 `id`、WS 能 snapshot/delta。
11. **单 UID**：`orders[]` 在成交前；`openOrders === orders.length`。
12. **KOL 画像**：空名单。散户名单无追涨次数、无状态列。
13. **不要 hex**。状态条只用 `green|yellow|red`。
14. **机器人**：读 `robot` JSON；`intervalMs` 按规则执行挂单节奏。

字段对不上时优先改后端对齐本文，不要让前端猜。
