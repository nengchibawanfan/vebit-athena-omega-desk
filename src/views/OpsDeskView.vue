<template>
  <div class="page">
    <PageState :loading="loading && !data" :error="error">
      <template v-if="data">
        <div class="card">
          <div class="card-header">
            <span>{{ header.title }}</span>
            <span class="badge">{{ header.badge }}</span>
          </div>
          <p v-if="kind === 'ladder'" class="blurb">{{ data.ladderBlurb }}</p>
          <p v-else-if="kind === 'dump'" class="blurb">
            做市账户{{ dumpIsToday ? '今日' : data.dump.dateLabel }}卖出 / 买入。用户买你就卖，用户卖你就买。
            <router-link v-if="!dumpIsToday" class="inline-link" to="/ops/dump">看今日</router-link>
            <router-link class="inline-link" to="/ops/dump/history">历史交易情况</router-link>
            <router-link class="inline-link" to="/desk/mm">今日资产情况</router-link>
          </p>
          <p v-else-if="kind === 'absorb'" class="blurb">
            真实用户所内 USDT 和代币。不含做市 / 金库等。
            <router-link v-if="!absorbIsToday" class="inline-link" to="/ops/absorb">看今日</router-link>
            <router-link class="inline-link" to="/ops/absorb/history">历史资产情况</router-link>
            <router-link class="inline-link" to="/desk/users">今日交易情况</router-link>
          </p>
          <div v-if="kind !== 'absorb'" class="monitor-status">
            <div class="status-item">
              <span class="status-dot" :class="data.stance.actionColor"></span>
              现价 {{ data.stance.lastPrice }}
            </div>
            <div class="status-item">
              <span class="status-dot" :class="Number(data.stance.mmDevPct) >= 0 ? 'green' : 'yellow'"></span>
              做市账户库存成本 {{ fmtPrice(data.stance.mmCost) }} · 偏离 {{ signed(data.stance.mmDevPct) }}%
            </div>
            <div class="status-item">
              <span class="status-dot" :class="Number(data.stance.devPct) >= 0 ? 'yellow' : 'green'"></span>
              真实用户持仓均价 {{ data.stance.avgCost }} · 偏离 {{ signed(data.stance.devPct) }}%
            </div>
          </div>
        </div>

        <template v-if="kind === 'dump'">
          <div class="kpi-grid">
            <div class="kpi-item" @click="$router.push('/desk/mm')">
              <div class="label">{{ dumpWord }}卖出</div>
              <div class="kpi-metrics">
                <div class="value" style="color:#ff5a7a;">{{ fmtQty(data.dump.sellHigh) }}<span class="unit">万</span></div>
                <div class="qty">收回 {{ fmtQty(data.dump.usdtIn30) }}<span class="unit">万USDT</span></div>
              </div>
              <div class="sub">均卖 {{ data.dump.avgSell }} · 均卖比均买高 {{ data.dump.spreadPct }}%</div>
            </div>
            <div class="kpi-item" @click="$router.push('/desk/mm')">
              <div class="label">{{ dumpWord }}买入</div>
              <div class="kpi-metrics">
                <div class="value" style="color:#6a9aff;">{{ fmtQty(data.dump.buyLow) }}<span class="unit">万</span></div>
                <div class="qty">花出 {{ fmtQty(data.dump.usdtOut30) }}<span class="unit">万USDT</span></div>
              </div>
              <div class="sub">均买 {{ data.dump.avgBuy }} · 用户在卖</div>
            </div>
            <div class="kpi-item">
              <div class="label">代币净变动</div>
              <div class="kpi-metrics">
                <div class="value" :style="{ color: Math.abs(Number(data.dump.tokenDelta) || 0) < Math.abs(Number(data.dump.dumpable) || 1) * 0.08 ? '#4cd9a0' : '#ffb347' }">
                  {{ signedQty(data.dump.tokenDelta) }}<span class="unit">万</span>
                </div>
              </div>
              <div class="sub">买入 − 卖出</div>
            </div>
            <div class="kpi-item">
              <div class="label">USDT 净增加</div>
              <div class="kpi-metrics">
                <div class="value" :style="{ color: Number(data.dump.usdtNet30) >= 0 ? '#4cd9a0' : '#ff5a7a' }">
                  {{ signedQty(data.dump.usdtNet30) }}<span class="unit">万USDT</span>
                </div>
              </div>
              <div class="sub">收回 USDT − 花出 USDT</div>
            </div>
            <div class="kpi-item" @click="$router.push('/desk/mm')">
              <div class="label">{{ pairBase }}余额</div>
              <div class="kpi-metrics">
                <div class="value" style="color:#a78bfa;">{{ fmtQty(data.dump.dumpable) }}<span class="unit">万{{ pairBase }}</span></div>
                <div class="qty">自有 {{ fmtQty(data.dump.tokenOwn) }} · 借入虚增 {{ fmtQty(data.dump.tokenBorrowed) }}</div>
              </div>
              <div class="sub">做市账户库存 · 卖出用的货</div>
            </div>
            <div class="kpi-item" @click="$router.push('/desk/mm')">
              <div class="label">{{ pairQuote }}余额</div>
              <div class="kpi-metrics">
                <div class="value" :style="{ color: Number(data.dump.ownUsdt) >= 0 ? '#4cd9a0' : '#ff5a7a' }">
                  {{ signedQty(data.dump.ownUsdt) }}<span class="unit">万{{ pairQuote }}</span>
                </div>
                <div class="qty">真实 {{ signedQty(data.dump.cashTrueU) }} · 借入 {{ fmtQty(data.dump.cashBorrowedU) }}</div>
              </div>
              <div class="sub">真实余额 + 借入金额 · 买入用的钱</div>
            </div>
          </div>
          <div class="kpi-grid">
            <div class="kpi-item">
              <div class="label">对倒量</div>
              <div class="kpi-metrics">
                <div class="value">{{ fmtQty(data.dump.matched) }}<span class="unit">万</span></div>
              </div>
              <div class="sub">{{ dumpWord }}买卖重叠的部分</div>
            </div>
            <div class="kpi-item">
              <div class="label">交易盈亏</div>
              <div class="kpi-metrics">
                <div class="value" :style="{ color: Number(data.dump.realizedU) >= 0 ? '#4cd9a0' : '#ff5a7a' }">
                  {{ signedQty(data.dump.realizedU) }}<span class="unit">万USDT</span>
                </div>
              </div>
              <div class="sub">均卖 − 均买 · 对倒部分</div>
            </div>
            <div class="kpi-item">
              <div class="label">存货浮盈</div>
              <div class="kpi-metrics">
                <div class="value" :style="{ color: Number(data.dump.floatU) >= 0 ? '#4cd9a0' : '#ff5a7a' }">
                  {{ signedQty(data.dump.floatU) }}<span class="unit">万USDT</span>
                </div>
              </div>
              <div class="sub">净库存按现价 {{ data.dump.lastPrice }} 计价</div>
            </div>
            <div class="kpi-item">
              <div class="label">{{ dumpWord }}盈亏</div>
              <div class="kpi-metrics">
                <div class="value" :style="{ color: Number(data.dump.totalU) >= 0 ? '#4cd9a0' : '#ff5a7a' }">
                  {{ signedQty(data.dump.totalU) }}<span class="unit">万USDT</span>
                </div>
              </div>
              <div class="sub">交易盈亏 + 存货浮盈</div>
            </div>
            <div class="kpi-item">
              <div class="label">均卖比均买高</div>
              <div class="kpi-metrics">
                <div class="value" style="color:#ffb347;">{{ data.dump.spreadPct }}<span class="unit">%</span></div>
              </div>
              <div class="sub">(均卖 − 均买) ÷ 均买</div>
            </div>
            <div class="kpi-item">
              <div class="label">平均价格</div>
              <div class="kpi-metrics">
                <div class="value">{{ data.dump.avgNetPrice == null ? '--' : data.dump.avgNetPrice }}</div>
              </div>
              <div class="sub">USDT 净增加 ÷ 代币净变动</div>
            </div>
          </div>
          <div class="grid-2">
            <div class="card">
              <div class="card-header">
                <span>📤 {{ dumpWord }}拆腿</span>
                <span class="badge">均卖 {{ data.dump.avgSell }} · 均买 {{ data.dump.avgBuy }}</span>
              </div>
              <div class="trade-board">
                <div class="trade-legs">
                  <div class="trade-leg is-sell">
                    <div class="mini-label">卖出</div>
                    <div class="mini-value">{{ fmtQty(data.dump.sellHigh) }}<span>万</span></div>
                    <div class="mini-sub">收回 {{ fmtQty(data.dump.usdtIn30) }}万USDT · 均价 {{ data.dump.avgSell }}</div>
                  </div>
                  <div class="trade-leg is-buy">
                    <div class="mini-label">买入</div>
                    <div class="mini-value">{{ fmtQty(data.dump.buyLow) }}<span>万</span></div>
                    <div class="mini-sub">花出 {{ fmtQty(data.dump.usdtOut30) }}万USDT · 均价 {{ data.dump.avgBuy }}</div>
                  </div>
                </div>
                <div class="trade-meta">
                  <div>
                    <div class="mini-label">USDT 净增加</div>
                    <div class="mini-value" :style="{ color: Number(data.dump.usdtNet30) >= 0 ? '#4cd9a0' : '#ff5a7a' }">
                      {{ signedQty(data.dump.usdtNet30) }}<span>万USDT</span>
                    </div>
                  </div>
                  <div>
                    <div class="mini-label">代币净变动</div>
                    <div class="mini-value">{{ signedQty(data.dump.tokenDelta) }}<span>万</span></div>
                  </div>
                  <div>
                    <div class="mini-label">平均价格</div>
                    <div class="mini-value">{{ data.dump.avgNetPrice == null ? '--' : data.dump.avgNetPrice }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="card-header">
                <span>🎯 对手是谁</span>
                <span class="badge">用户买 = 你卖 · 用户卖 = 你买</span>
              </div>
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>对手</th>
                      <th>买(万)</th>
                      <th>卖(万)</th>
                      <th>净(万)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>散户</td>
                      <td style="color:#6a9aff;">{{ fmtQty(data.dump.retailBuy) }}</td>
                      <td style="color:#ff5a7a;">{{ fmtQty(data.dump.retailSell) }}</td>
                      <td>{{ signedQty(data.dump.retailNet) }}</td>
                    </tr>
                    <tr>
                      <td>聪明钱</td>
                      <td style="color:#6a9aff;">{{ fmtQty(data.dump.smartBuy) }}</td>
                      <td style="color:#ff5a7a;">{{ fmtQty(data.dump.smartSell) }}</td>
                      <td>{{ signedQty(data.dump.smartNet) }}</td>
                    </tr>
                    <tr>
                      <td>真实用户</td>
                      <td style="color:#6a9aff;">{{ fmtQty(data.dump.realBuy) }}</td>
                      <td style="color:#ff5a7a;">{{ fmtQty(data.dump.realSell) }}</td>
                      <td>{{ signedQty(data.dump.realNet) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <span>📈 {{ dumpWord }}现价 / 库存成本 / 净买入</span>
              <span class="badge">现价 {{ fmtPrice(data.dump.lastPrice) }} · 库存成本 {{ fmtPrice(data.dump.invCost) }} · 柱在零上=买入</span>
            </div>
            <ChartBox size="combo" :option="dumpFlowOption" />
          </div>
          <div class="card">
            <div class="card-header">
              <span>⏱ {{ dumpWord }}分时</span>
              <span class="badge">做市卖出 / 买入 · 万枚</span>
            </div>
            <ChartBox size="xlarge" :option="dumpHourOption" />
          </div>
          <div class="card">
            <div class="card-header">
              <span>📋 {{ dumpWord }}成交明细</span>
              <span class="badge">做市视角 · {{ (data.dump.fills || []).length }} 笔 · 点 UID 进用户</span>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>时间</th>
                    <th>方向</th>
                    <th>数量(万)</th>
                    <th>价格</th>
                    <th>金额(万USDT)</th>
                    <th>对手 UID</th>
                    <th>标签</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, index) in data.dump.fills"
                    :key="`${row.time}-${row.uid}-${index}`"
                    class="row-link"
                    @click="$router.push(userDetailPath(row.uid))"
                  >
                    <td>{{ row.time }}</td>
                    <td><span class="tag" :class="row.sideClass">{{ row.side }}</span></td>
                    <td :style="{ color: row.side === '卖出' ? '#ff5a7a' : '#6a9aff' }">{{ fmtQty(row.qty) }}</td>
                    <td>{{ fmtPrice(row.price) }}</td>
                    <td>{{ fmtQty(row.usdt) }}</td>
                    <td>{{ row.uid }}</td>
                    <td><span class="tag" :class="row.tagClass">{{ row.tag }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>

        <template v-else-if="kind === 'absorb'">
          <div class="kpi-grid">
            <div class="kpi-item">
              <div class="label">平台用户USDT</div>
              <div class="kpi-metrics">
                <div class="value" style="color:#4cd9a0;">{{ fmtQty(data.absorb.userCashU) }}<span class="unit">万USDT</span></div>
              </div>
              <div class="sub">所内真实用户余额 · 卖出时接你货的钱</div>
            </div>
            <div class="kpi-item" @click="$router.push('/chips/user')">
              <div class="label">平台用户代币</div>
              <div class="kpi-metrics">
                <div class="value" style="color:#ffb347;">{{ fmtQty(data.absorb.userToken) }}<span class="unit">万</span></div>
                <div class="qty">{{ fmtQty(data.absorb.userTokenU) }}<span class="unit">万USDT</span></div>
              </div>
              <div class="sub">所内真实用户手里的量 · 不含做市</div>
            </div>
            <div class="kpi-item">
              <div class="label">用户资产合计</div>
              <div class="kpi-metrics">
                <div class="value">{{ fmtQty(data.absorb.assetsU) }}<span class="unit">万USDT</span></div>
              </div>
              <div class="sub">USDT + 代币市值</div>
            </div>
            <div class="kpi-item" @click="$router.push('/chips/user')">
              <div class="label">持仓用户</div>
              <div class="kpi-metrics">
                <div class="value">{{ data.absorb.holders }}<span class="unit">人</span></div>
              </div>
              <div class="sub">所内仍有代币的真实 UID</div>
            </div>
          </div>
          <div class="kpi-grid">
            <div class="kpi-item" @click="$router.push('/ops/stance')">
              <div class="label">现价下跌5% 用户买单数量</div>
              <div class="kpi-metrics">
                <div class="value" style="color:#6a9aff;">{{ fmtQty(data.absorb.bid5Qty) }}<span class="unit">万</span></div>
                <div class="qty">2% {{ fmtQty(data.absorb.bid2Qty) }} · 10% {{ fmtQty(data.absorb.bid10Qty) }}</div>
              </div>
              <div class="sub">{{ fmtQty(data.absorb.bid5U) }}万USDT</div>
            </div>
            <div class="kpi-item" @click="$router.push('/ops/stance')">
              <div class="label">现价上涨5% 用户卖单数量</div>
              <div class="kpi-metrics">
                <div class="value" style="color:#ff5a7a;">{{ fmtQty(data.absorb.ask5Qty) }}<span class="unit">万</span></div>
                <div class="qty">2% {{ fmtQty(data.absorb.ask2Qty) }} · 10% {{ fmtQty(data.absorb.ask10Qty) }}</div>
              </div>
              <div class="sub">{{ fmtQty(data.absorb.ask5U) }}万USDT</div>
            </div>
            <div class="kpi-item" @click="$router.push('/whales/exchange')">
              <div class="label">近端充值进所</div>
              <div class="kpi-metrics">
                <div class="value" style="color:#ffb347;">{{ fmtQty(data.absorb.inboundQty) }}<span class="unit">万</span></div>
              </div>
              <div class="sub">供给进所 · 低位可以买回来</div>
            </div>
            <div class="kpi-item" @click="$router.push('/desk/users')">
              <div class="label">用户净买入</div>
              <div class="kpi-metrics">
                <div class="value" :style="{ color: data.users.realNet >= 0 ? '#6a9aff' : '#ffb347' }">
                  {{ signedQty(data.users.realNet) }}<span class="unit">万</span>
                </div>
              </div>
              <div class="sub">{{ absorbIsToday ? '今日' : '当日' }}真实 UID</div>
            </div>
          </div>
          <div class="grid-2">
            <div class="card">
              <div class="card-header"><span>💰 用户 USDT 分档</span><span class="badge">按余额</span></div>
              <ChartBox :option="cashPieOption" />
            </div>
            <div class="card">
              <div class="card-header"><span>📋 分档明细</span><span class="badge">{{ data.absorb.cashBands.length }} 档</span></div>
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr><th>余额</th><th>人数</th><th>USDT(万)</th></tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in data.absorb.cashBands" :key="row.name">
                      <td>{{ row.name }}</td>
                      <td>{{ row.users }}</td>
                      <td>{{ fmtQty(row.cashU) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="kpi-grid">
            <div class="kpi-item" @click="$router.push('/chips/user')">
              <div class="label">盘面代币</div>
              <div class="kpi-metrics">
                <div class="value" style="color:#ffb347;">{{ fmtQty(data.surfaceToken) }}<span class="unit">万</span></div>
              </div>
              <div class="sub">所内用户手里现在的量 · 不含做市</div>
            </div>
            <div class="kpi-item">
              <div class="label">现价</div>
              <div class="kpi-metrics">
                <div class="value">{{ data.stance.lastPrice }}</div>
              </div>
              <div class="sub">做市成本 {{ data.stance.mmCost ?? '--' }} · 用户均价 {{ data.stance.avgCost }}</div>
            </div>
            <div class="kpi-item">
              <div class="label">+10% · {{ step10?.price }}</div>
              <div class="kpi-metrics">
                <div class="value" style="color:#ff5a7a;">预估卖出 {{ fmtQty(step10?.expectedSell) }}<span class="unit">万</span></div>
                <div class="qty" style="color:#6a9aff;">预估买入 {{ fmtQty(step10?.expectedBuy) }}<span class="unit">万</span></div>
              </div>
              <div class="sub">{{ step10?.play }} · 维持 +10%</div>
            </div>
            <div class="kpi-item">
              <div class="label">-10% · {{ stepDown10?.price }}</div>
              <div class="kpi-metrics">
                <div class="value" style="color:#ff5a7a;">预估卖出 {{ fmtQty(stepDown10?.expectedSell) }}<span class="unit">万</span></div>
                <div class="qty" style="color:#6a9aff;">预估买入 {{ fmtQty(stepDown10?.expectedBuy) }}<span class="unit">万</span></div>
              </div>
              <div class="sub">{{ stepDown10?.play }} · 维持 -10%</div>
            </div>
          </div>

          <div class="card gloss-card">
            <div class="card-header">
              <span>预估买入卖出</span>
              <span class="badge">维持这一档价格</span>
            </div>
            <div class="gloss-grid four">
              <div class="gloss-item">
                <div class="gloss-name">涨为什么会卖</div>
                <p>{{ data.ladderGloss.upSell }}</p>
                <table class="gloss-mini">
                  <thead>
                    <tr>
                      <th>浮盈</th>
                      <th>可能卖出</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in data.ladderGloss.upSellRates" :key="row.pnl">
                      <td>{{ row.pnl }}</td>
                      <td>{{ row.pct }}%仓位</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="gloss-item">
                <div class="gloss-name">涨为什么会买</div>
                <p>{{ data.ladderGloss.upBuy }}</p>
                <table class="gloss-mini">
                  <thead>
                    <tr>
                      <th>台阶</th>
                      <th>占闲置 USDT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in data.ladderGloss.upBuyRates" :key="row.step">
                      <td>{{ row.step }}</td>
                      <td>{{ row.pct }}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="gloss-item">
                <div class="gloss-name">跌为什么会卖</div>
                <p>{{ data.ladderGloss.downSell }}</p>
                <table class="gloss-mini">
                  <thead>
                    <tr>
                      <th>浮亏</th>
                      <th>可能卖出</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in data.ladderGloss.downSellRates" :key="row.pnl">
                      <td>{{ row.pnl }}</td>
                      <td>{{ row.pct }}%仓位</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="gloss-item">
                <div class="gloss-name">跌为什么会买</div>
                <p>{{ data.ladderGloss.downBuy }}</p>
                <table class="gloss-mini">
                  <thead>
                    <tr>
                      <th>台阶</th>
                      <th>占闲置 USDT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in data.ladderGloss.downBuyRates" :key="row.step">
                      <td>{{ row.step }}</td>
                      <td>{{ row.pct }}{{ row.pct === '—' ? '' : '%' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <span>📋 台阶明细</span>
              <span class="badge">盘面代币 {{ fmtQty(data.surfaceToken) }}万 · 价格 = 现价 {{ data.stance.lastPrice }} × (1 + 台阶)</span>
            </div>
            <div class="table-wrap ladder-wrap">
              <table class="ladder-table">
                <thead>
                  <tr>
                    <th>台阶</th>
                    <th>价格</th>
                    <th class="num">盘面代币</th>
                    <th class="num">预估卖出</th>
                    <th class="num">预估买入</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="row in data.ladder"
                    :key="row.pct"
                    :class="{ 'is-blocked': row.playKind === 'no', 'is-spot': row.side === 'spot', 'is-up': row.side === 'up', 'is-down': row.side === 'down' }"
                  >
                    <td><div class="step-name">{{ row.label }}</div></td>
                    <td class="step-price">{{ row.price }}</td>
                    <td class="num">{{ fmtQty(row.surfaceToken) }}<span class="unit">万</span></td>
                    <td class="num flow-cell">
                      <div class="cell-main" style="color:#ff5a7a;">{{ fmtQty(row.expectedSell) }}<span class="unit">万</span></div>
                      <div v-if="sellBar(row).length" class="flow-bar is-sell">
                        <div
                          v-for="band in sellBar(row)"
                          :key="band.key"
                          class="flow-seg"
                          :class="[band.kind, band.key]"
                          :style="{ flex: Math.max(Number(band.sellPct) || 0, 1) }"
                        >
                          <span v-if="Number(band.sellPct) >= 10" class="flow-seg-pct">{{ band.sellPct }}%</span>
                          <div class="flow-tip">
                            <div class="tip-row"><span>盈亏范围</span>{{ band.label }}</div>
                            <div class="tip-row"><span>占比</span>{{ band.sellPct }}%</div>
                            <div class="tip-row"><span>数量</span>{{ fmtQty(band.sellAmt) }}万</div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="num flow-cell">
                      <div class="cell-main" style="color:#6a9aff;">{{ fmtQty(row.expectedBuy) }}<span class="unit">万</span></div>
                      <div v-if="buyBar(row).length" class="flow-bar is-buy">
                        <div
                          v-for="band in buyBar(row)"
                          :key="band.key"
                          class="flow-seg"
                          :class="[band.kind, band.key]"
                          :style="{ flex: Math.max(Number(band.buyPct) || 0, 1) }"
                        >
                          <span v-if="Number(band.buyPct) >= 10" class="flow-seg-pct">{{ band.buyPct }}%</span>
                          <div class="flow-tip">
                            <div class="tip-row"><span>来源</span>{{ band.label }}</div>
                            <div class="tip-row"><span>占比</span>{{ band.buyPct }}%</div>
                            <div class="tip-row"><span>数量</span>{{ fmtQty(band.buyAmt) }}万</div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>
      </template>
    </PageState>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/api'
import { appState } from '@/stores/app'
import { userDetailPath } from '@/utils/uid'
import { usePageData } from '@/composables/usePageData'
import ChartBox from '@/components/ChartBox.vue'
import PageState from '@/components/PageState.vue'
import { mmFlowChartOption } from '@/utils/mmFlowChart'

const route = useRoute()
const kind = computed(() => route.meta.opsKind || 'dump')
const dayDate = computed(() => {
  if ((kind.value === 'dump' || kind.value === 'absorb') && typeof route.query.date === 'string') return route.query.date
  return ''
})
const { loading, error, data, bindPair, load } = usePageData(() =>
  api.getOpsDesk(appState.currentPair, appState.config.sleepIdleDays, appState.config.internalAccounts || [], dayDate.value)
)
bindPair()
watch([kind, dayDate], () => {
  if (kind.value === 'dump' || kind.value === 'absorb') load()
})

const dumpIsToday = computed(() => data.value?.dump?.isToday !== false)
const absorbIsToday = computed(() => data.value?.absorb?.isToday !== false)
const dumpWord = computed(() => (dumpIsToday.value ? '今日' : '当日'))
const pairBase = computed(() => String(appState.currentPair || '').split('/')[0] || 'TOKEN')
const pairQuote = computed(() => String(appState.currentPair || '').split('/')[1] || 'USDT')

const header = computed(() => {
  if (kind.value === 'absorb') {
    if (!absorbIsToday.value) {
      return {
        title: `💰 真实用户${data.value?.absorb?.dateTitle || '当日'}资产情况`,
        badge: `${data.value?.absorb?.dateLabel || ''} · 不含做市 / 金库等`
      }
    }
    return { title: '💰 真实用户今日资产情况', badge: '所内 USDT + 代币 · 不含做市 / 金库等' }
  }
  if (kind.value === 'ladder') return { title: '🪜 价格台阶', badge: '盘面代币 · 维持该价的预估买入 / 预估卖出' }
  if (!dumpIsToday.value) {
    return {
      title: `📤 做市账户${data.value?.dump?.dateTitle || '当日'}交易情况`,
      badge: `${data.value?.dump?.dateLabel || ''} 做市成交`
    }
  }
  return { title: '📤 做市账户今日交易情况', badge: '今日做市成交 · 单日看历史' }
})

const ladderRows = computed(() => data.value?.ladder || [])
const step10 = computed(() => ladderRows.value.find((row) => row.pct === 10))
const stepDown10 = computed(() => ladderRows.value.find((row) => row.pct === -10))

const cashPieOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: (item) => `${item.name}<br/>${item.value} 万USDT` },
  series: [{
    type: 'pie',
    radius: ['42%', '68%'],
    data: (data.value?.absorb?.cashBands || []).map((item) => ({
      name: item.name,
      value: item.cashU,
      itemStyle: { color: item.color }
    })),
    label: { color: '#b0c8e8', fontSize: 9, formatter: '{b}\n{d}%' },
    labelLine: { lineStyle: { color: '#2a3a5a' } }
  }]
}))

const dumpHourOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['卖出', '买入'], textStyle: { color: '#4a6080', fontSize: 10 }, top: 0 },
  grid: { left: '8%', right: '4%', top: '16%', bottom: '12%' },
  xAxis: {
    data: data.value?.dump?.hours || [],
    axisLabel: { color: '#4a6080', fontSize: 8 }
  },
  yAxis: {
    splitLine: { lineStyle: { color: '#111927' } },
    axisLabel: { color: '#4a6080', fontSize: 8 }
  },
  series: [
    { name: '卖出', type: 'bar', data: data.value?.dump?.sellHour || [], itemStyle: { color: '#ff5a7a' }, barWidth: '28%' },
    { name: '买入', type: 'bar', data: data.value?.dump?.buyHour || [], itemStyle: { color: '#6a9aff' }, barWidth: '28%' }
  ]
}))

const dumpFlowOption = computed(() => mmFlowChartOption({
  labels: data.value?.dump?.hours || [],
  lastHour: data.value?.dump?.lastHour || [],
  costHour: data.value?.dump?.costHour || [],
  netHour: data.value?.dump?.netHour || [],
  interval: 2
}))

function sellBar(row) {
  return (row?.sellBands || []).filter((band) => Number(band.sellAmt) > 0)
}

function buyBar(row) {
  return (row?.buyBands || []).filter((band) => Number(band.buyAmt) > 0)
}

function fmtQty(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  return n.toLocaleString('zh-CN', { maximumFractionDigits: 1 })
}

function signedQty(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  const text = n.toLocaleString('zh-CN', { maximumFractionDigits: 1 })
  return n > 0 ? `+${text}` : text
}

function signed(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  return n > 0 ? `+${n}` : String(n)
}

function fmtPrice(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  if (n >= 1000) return n.toLocaleString('zh-CN', { maximumFractionDigits: 2 })
  if (n >= 1) return n.toLocaleString('zh-CN', { maximumFractionDigits: 4 })
  return n.toLocaleString('zh-CN', { maximumFractionDigits: 6 })
}
</script>

<style scoped>
.blurb {
  margin: 4px 0 10px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-muted, #9ab0cc);
}
.inline-link {
  margin-left: 8px;
  color: #6a9aff;
  text-decoration: none;
  font-size: 12px;
}
.inline-link:hover {
  text-decoration: underline;
}
.row-link {
  cursor: pointer;
}
.row-link:hover td {
  color: var(--text-title);
}
.trade-board {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 2px 2px 8px;
}
.trade-legs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.trade-leg {
  padding: 10px 12px;
  border-radius: 8px;
  text-align: left;
}
.trade-leg.is-sell {
  background: rgba(255, 90, 122, 0.08);
}
.trade-leg.is-buy {
  background: rgba(106, 154, 255, 0.08);
}
.trade-leg.is-sell .mini-value {
  color: #ff5a7a;
}
.trade-leg.is-buy .mini-value {
  color: #6a9aff;
}
.trade-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 2px 4px 0;
}
.mini-label {
  font-size: 10px;
  color: var(--text-muted);
}
.mini-value {
  margin-top: 4px;
  font-size: 18px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.mini-value span {
  margin-left: 2px;
  font-size: 11px;
  font-weight: 400;
  color: var(--text-soft);
}
.mini-sub {
  margin-top: 2px;
  font-size: 11px;
  color: var(--text-muted);
}
.kpi-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.kpi-metrics {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 2px;
  padding: 8px 0 6px;
}
.value.range {
  font-size: 18px;
}
.qty {
  font-size: 12px;
  color: var(--text-qty);
  font-weight: 600;
}
.qty .unit {
  font-size: 10px;
  color: var(--text-soft);
  font-weight: 400;
  margin-left: 1px;
}
.is-blocked td {
  color: #d8c8a8;
}
.play-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 700;
}
.play-ok {
  color: #4cd9a0;
  background: rgba(76, 217, 160, 0.12);
}
.play-no {
  color: #ff5a7a;
  background: rgba(255, 90, 122, 0.12);
}
.play-watch {
  color: #ffb347;
  background: rgba(255, 179, 71, 0.12);
}
.is-spot td {
  font-weight: 600;
}
.step-name {
  font-weight: 700;
}
.is-up .step-name {
  color: #ffb347;
}
.is-down .step-name {
  color: #6a9aff;
}
.step-price {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-variant-numeric: tabular-nums;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-title, #e8f0ff);
}
.is-spot .step-price {
  color: #4cd9a0;
}
.ladder-table th.num,
.ladder-table td.num {
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.ladder-table td .unit {
  margin-left: 2px;
  font-size: 10px;
  color: var(--text-soft);
  font-weight: 400;
}
.ladder-table tbody tr.is-spot {
  background: rgba(76, 217, 160, 0.06);
}
.ladder-wrap {
  overflow: visible;
}
.flow-cell {
  min-width: 220px;
  padding-bottom: 8px;
}
.flow-cell .cell-main {
  font-weight: 700;
}
.flow-bar {
  display: flex;
  width: 100%;
  height: 20px;
  margin-top: 6px;
  overflow: visible;
  border-radius: 5px;
}
.flow-bar.is-sell {
  background: rgba(255, 90, 122, 0.1);
}
.flow-bar.is-buy {
  background: rgba(106, 154, 255, 0.1);
}
.flow-seg {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 4px;
  height: 100%;
  cursor: default;
}
.flow-seg + .flow-seg {
  box-shadow: inset 1px 0 0 rgba(8, 14, 24, 0.35);
}
.flow-seg:first-child {
  border-radius: 5px 0 0 5px;
}
.flow-seg:last-child {
  border-radius: 0 5px 5px 0;
}
.flow-seg:only-child {
  border-radius: 5px;
}
.flow-seg.profit.p20 { background: #ff5a7a; }
.flow-seg.profit.p10 { background: #ff7a94; }
.flow-seg.profit.p5 { background: #d96a80; }
.flow-seg.profit.p0 { background: #c45d72; }
.flow-seg.loss.l0 { background: #8eb0ff; }
.flow-seg.loss.l5 { background: #6a9aff; }
.flow-seg.loss.l10 { background: #547fe0; }
.flow-seg.loss.l20 { background: #3d63b8; }
.flow-seg.wall { background: #6a9aff; }
.flow-seg.idle { background: #4cd9a0; }
.flow-seg.fresh { background: #a78bfa; }
.flow-seg:hover {
  filter: brightness(1.12);
  z-index: 3;
}
.flow-seg-pct {
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.35);
  pointer-events: none;
}
.flow-tip {
  display: none;
  position: absolute;
  left: 50%;
  top: calc(100% + 8px);
  z-index: 8;
  min-width: 148px;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: #0e1622;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
  transform: translateX(-50%);
  text-align: left;
  white-space: nowrap;
  font-size: 11px;
  line-height: 1.55;
  font-weight: 400;
  color: var(--text-title, #e8f0ff);
}
.flow-tip .tip-row {
  display: flex;
  gap: 10px;
}
.flow-tip .tip-row span {
  width: 56px;
  color: var(--text-muted, #9ab0cc);
  font-weight: 400;
}
.flow-seg:hover .flow-tip {
  display: block;
}
.gloss-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 4px 2px 8px;
}
.gloss-grid.four {
  grid-template-columns: 1fr 1fr 1fr 1fr;
  align-items: stretch;
}
.gloss-item {
  display: flex;
  flex-direction: column;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-elevated);
}
.gloss-name {
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-title, #e8f0ff);
}
.gloss-item p {
  margin: 0 0 10px;
  min-height: 56px;
  font-size: 12px;
  line-height: 1.55;
  color: var(--text-muted, #9ab0cc);
}
.gloss-mini {
  width: 100%;
  margin-top: auto;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}
.gloss-mini th,
.gloss-mini td {
  height: 26px;
  padding: 0 8px 0 0;
  border-bottom: 1px solid var(--border);
  font-size: 11px;
  line-height: 26px;
  text-transform: none;
  letter-spacing: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}
.gloss-mini th:first-child,
.gloss-mini td:first-child {
  width: 52px;
  padding-left: 0;
}
.gloss-mini th {
  color: var(--text-muted, #9ab0cc);
  font-weight: 500;
}
.gloss-mini td {
  color: #b0c8e8;
}
.gloss-mini th:nth-child(n + 2),
.gloss-mini td:nth-child(n + 2) {
  text-align: right;
}
.gloss-mini tr:last-child td {
  border-bottom: 0;
}
.gloss-grid.three {
  grid-template-columns: 1fr 1fr 1fr;
}
@media (max-width: 720px) {
  .gloss-grid,
  .gloss-grid.three,
  .gloss-grid.four,
  .trade-legs,
  .trade-meta {
    grid-template-columns: 1fr;
  }
}
</style>
