<template>
  <div class="bg-slate-800 rounded-lg p-4 border border-slate-700">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-bold text-slate-400">
        词源演化时间轴
        <span class="font-normal text-slate-600">按时代串联词根演化 · 点击节点联动查看同源词变化</span>
      </h3>
      <div class="flex gap-3 text-xs text-slate-400">
        <span v-for="(c, lang) in BRANCH_COLORS" :key="lang" class="flex items-center gap-1">
          <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: c }"></span>{{ lang }}
        </span>
        <span class="flex items-center gap-1">
          <span class="w-2.5 h-2.5 rounded-full" style="background-color:#94a3b8"></span>共同祖先
        </span>
      </div>
    </div>
    <div class="flex gap-4">
      <svg :viewBox="`0 0 ${W} ${svgHeight}`" class="flex-1 bg-slate-900 rounded select-none">
        <!-- 时代背景带 -->
        <g v-for="(era, i) in TIMELINE_ERAS" :key="era.name">
          <rect :x="x(era.start)" y="0" :width="x(era.end) - x(era.start)" :height="svgHeight"
                :fill="i % 2 ? 'rgba(148,163,184,0.055)' : 'rgba(148,163,184,0.02)'" />
          <text :x="(x(era.start) + x(era.end)) / 2" y="14" text-anchor="middle" font-size="9" fill="#64748b">{{ era.name }}</text>
        </g>
        <!-- 年代网格线 -->
        <g v-for="t in TICKS" :key="t">
          <line :x1="x(t)" :x2="x(t)" :y1="TOP - 8" :y2="svgHeight - BOTTOM + 6" stroke="#334155" stroke-width="0.5" stroke-dasharray="2 3" />
          <text :x="x(t)" :y="svgHeight - 8" text-anchor="middle" font-size="9" fill="#64748b">{{ tickLabel(t) }}</text>
        </g>
        <text v-if="!rows.length" :x="W / 2" :y="svgHeight / 2" text-anchor="middle" font-size="11" fill="#475569">无匹配词根</text>
        <!-- 词根演化行 -->
        <g v-for="row in rows" :key="row.chain.root">
          <rect v-if="row.chain.root === store.selectedCognateRoot"
                :x="0" :y="row.cy - ROW_H / 2" :width="W" :height="ROW_H" fill="#22d3ee" opacity="0.07" />
          <text :x="LEFT - 10" :y="row.cy + 3.5" text-anchor="end" font-size="10" class="cursor-pointer"
                :fill="row.chain.root === store.selectedCognateRoot ? '#22d3ee' : '#cbd5e1'"
                @click="store.selectCognate(row.chain.root)">
            {{ row.chain.root }} · {{ row.chain.meaning }}
          </text>
          <line v-for="l in row.links" :key="l.key"
                :x1="l.x1" :y1="l.y1" :x2="l.x2" :y2="l.y2" :stroke="l.color" stroke-width="1.2" opacity="0.45" />
          <g v-for="n in row.nodes" :key="n.key" class="cursor-pointer" @click="store.selectTimelineStage(row.chain.root, n)">
            <circle v-if="isSelectedNode(row.chain.root, n)" :cx="x(n.year)" :cy="row.cy + n.dy" r="9" fill="none" stroke="#22d3ee" stroke-width="1.5" />
            <circle :cx="x(n.year)" :cy="row.cy + n.dy" :r="isSelectedNode(row.chain.root, n) ? 6 : 4.5"
                    :fill="n.color" stroke="#0f172a" stroke-width="1">
              <title>{{ n.word }} · {{ n.language }} · {{ formatYear(n.year) }}{{ n.change ? ' · ' + n.change : '' }}</title>
            </circle>
            <text :x="x(n.year)" :y="row.cy + n.dy + (n.labelAbove ? -11 : 15)" text-anchor="middle" font-size="8.5"
                  :fill="n.year >= 1900 ? '#e2e8f0' : '#94a3b8'">{{ n.word }}</text>
          </g>
        </g>
      </svg>
      <!-- 联动详情面板 -->
      <div class="w-72 flex-shrink-0 bg-slate-900 rounded p-3 text-xs space-y-3 self-start">
        <template v-if="sel">
          <div>
            <div class="text-slate-500 mb-1">演化阶段</div>
            <div class="text-lg font-bold text-cyan-400 font-mono">{{ sel.stage.word }}</div>
            <div class="text-slate-400">{{ sel.stage.language }} · {{ formatYear(sel.stage.year) }}</div>
            <div class="text-slate-500">{{ eraOf(sel.stage.year) }}时期</div>
          </div>
          <div v-if="sel.stage.change" class="bg-slate-800 rounded p-2">
            <span class="text-amber-400">音变：</span>{{ sel.stage.change }}
          </div>
          <div v-if="selPath.length">
            <div class="text-slate-500 mb-1">演化路径（→ {{ selPathTo }}）</div>
            <div class="flex flex-wrap items-center gap-1">
              <template v-for="(s, i) in selPath" :key="i">
                <span class="px-1.5 py-0.5 rounded font-mono"
                      :class="isPathStage(s) ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'">{{ s.word }}</span>
                <span v-if="i < selPath.length - 1" class="text-slate-600">→</span>
              </template>
            </div>
          </div>
          <div v-if="store.selectedCognate">
            <div class="text-slate-500 mb-1">同源词变化 · {{ store.selectedCognate.meaning }}</div>
            <div class="space-y-1">
              <div v-for="(w, lang) in store.selectedCognate.languages" :key="lang"
                   class="flex justify-between bg-slate-800 rounded px-2 py-1">
                <span class="text-slate-400">{{ lang }}</span>
                <span class="font-mono text-slate-200">{{ w }}</span>
              </div>
            </div>
          </div>
        </template>
        <div v-else class="text-slate-500 leading-5">
          点击时间轴上的节点，查看该演化阶段的音变说明、演化路径与同源词变化；点击左侧词根标签可定位整条演化链。
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useEtymologyStore, TIMELINE_ERAS, BRANCH_COLORS } from '../store/etymology'
import type { TimelineChain, TimelineStage } from '../types'

const store = useEtymologyStore()

const W = 960
const LEFT = 128, RIGHT = 20, TOP = 30, ROW_H = 30, BOTTOM = 26
const DOMAIN: [number, number] = [-4500, 2026]
const TICKS = [-4000, -3000, -2000, -1000, 0, 1000, 2000]

const x = (year: number) => LEFT + ((year - DOMAIN[0]) / (DOMAIN[1] - DOMAIN[0])) * (W - LEFT - RIGHT)

interface TlNode extends TimelineStage {
  key: string; color: string; dy: number; labelAbove: boolean
}
interface TlLink { key: string; x1: number; y1: number; x2: number; y2: number; color: string }

const visibleChains = computed<TimelineChain[]>(() => {
  const roots = new Set(store.filteredCognates.map(cs => cs.root))
  return store.timeline.filter(c => roots.has(c.root))
})

const svgHeight = computed(() => TOP + visibleChains.value.length * ROW_H + BOTTOM)

const stageKey = (s: TimelineStage) => `${s.word}|${s.language}|${s.year}`

// 每行：跨分支去重节点（共享祖先节点标灰）、同年节点纵向错开、分支连线去重
const rows = computed(() => visibleChains.value.map((chain, i) => {
  const cy = TOP + i * ROW_H + ROW_H / 2
  const nodeMap = new Map<string, TlNode & { colors: string[] }>()
  chain.branches.forEach(b => b.stages.forEach(s => {
    const key = stageKey(s)
    const exist = nodeMap.get(key)
    if (exist) exist.colors.push(b.color)
    else nodeMap.set(key, { ...s, key, colors: [b.color], color: b.color, dy: 0, labelAbove: false })
  }))
  const nodes = [...nodeMap.values()].sort((a, b) => a.year - b.year)
  const byYear = new Map<number, typeof nodes>()
  nodes.forEach(n => {
    const g = byYear.get(n.year) || []
    g.push(n)
    byYear.set(n.year, g)
  })
  byYear.forEach(g => g.forEach((n, k) => { n.dy = g.length > 1 ? (k - (g.length - 1) / 2) * 11 : 0 }))
  nodes.forEach((n, idx) => {
    if (n.colors.length > 1) n.color = '#94a3b8'
    n.labelAbove = n.dy !== 0 ? n.dy < 0 : idx % 2 === 0
  })
  const links: TlLink[] = []
  const linkKeys = new Set<string>()
  chain.branches.forEach(b => {
    for (let k = 0; k < b.stages.length - 1; k++) {
      const a = nodeMap.get(stageKey(b.stages[k]))!
      const c = nodeMap.get(stageKey(b.stages[k + 1]))!
      const lk = a.key + '->' + c.key
      if (linkKeys.has(lk)) continue
      linkKeys.add(lk)
      links.push({ key: lk, x1: x(a.year), y1: cy + a.dy, x2: x(c.year), y2: cy + c.dy, color: b.color })
    }
  })
  return { chain, cy, nodes, links }
}))

const sel = computed(() => store.selectedTimelineStage)

// 选中阶段所在的演化分支路径
const selPath = computed<TimelineStage[]>(() => {
  if (!sel.value) return []
  const chain = store.timeline.find(c => c.root === sel.value!.root)
  const br = chain?.branches.find(b => b.stages.some(s => stageKey(s) === stageKey(sel.value!.stage)))
  return br?.stages || []
})
const selPathTo = computed(() => {
  if (!sel.value) return ''
  const chain = store.timeline.find(c => c.root === sel.value!.root)
  return chain?.branches.find(b => b.stages.some(s => stageKey(s) === stageKey(sel.value!.stage)))?.to || ''
})

const isSelectedNode = (root: string, n: TimelineStage) =>
  !!sel.value && sel.value.root === root && stageKey(sel.value.stage) === stageKey(n)

const isPathStage = (s: TimelineStage) => !!sel.value && stageKey(s) === stageKey(sel.value.stage)

const eraOf = (year: number) => TIMELINE_ERAS.find(e => year >= e.start && year < e.end)?.name || ''

const formatYear = (y: number) => y < 0 ? `公元前${-y}年` : y >= 1900 ? '现代' : `公元${y}年`
const tickLabel = (y: number) => y < 0 ? `前${-y}` : y === 0 ? '元年' : `${y}`
</script>
