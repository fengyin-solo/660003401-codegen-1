import type { CognateSet, LanguageFamily, TimelineBranch, TimelineChain, TimelineEra, TimelineStage } from '../types'

export const LANGUAGE_FAMILIES: LanguageFamily[] = [
  { id: 'ie', name: '印欧语系', color: '#3b82f6', languages: ['英语','法语','德语','西班牙语','俄语','拉丁语'], era: '公元前4000年' },
  { id: 'st', name: '汉藏语系', color: '#22c55e', languages: ['汉语','藏语','缅甸语'], era: '公元前4000年' },
  { id: 'aa', name: '亚非语系', color: '#f59e0b', languages: ['阿拉伯语','希伯来语'], era: '公元前6000年' },
  { id: 'ural', name: '乌拉尔语系', color: '#8b5cf6', languages: ['芬兰语','匈牙利语'], era: '公元前5000年' },
]

export const COGNATE_SETS: CognateSet[] = [
  { root: '*pṓds', meaning: '脚/足', languages: { '英语': 'foot', '法语': 'pied', '德语': 'Fuß', '西班牙语': 'pie', '俄语': 'ступня', '拉丁语': 'pēs' }, period: 'PIE', family: 'ie' },
  { root: '*mātér', meaning: '母亲', languages: { '英语': 'mother', '法语': 'mère', '德语': 'Mutter', '西班牙语': 'madre', '俄语': 'мать', '拉丁语': 'māter' }, period: 'PIE', family: 'ie' },
  { root: '*pṓtr', meaning: '父亲', languages: { '英语': 'father', '法语': 'père', '德语': 'Vater', '西班牙语': 'padre', '俄语': 'отец', '拉丁语': 'pater' }, period: 'PIE', family: 'ie' },
  { root: '*h₂épo', meaning: '水', languages: { '英语': 'aqua', '法语': 'eau', '德语': 'Au', '西班牙语': 'agua', '俄语': 'вода', '拉丁语': 'aqua' }, period: 'PIE', family: 'ie' },
  { root: '*dʰómos', meaning: '家', languages: { '英语': 'dome', '法语': 'maison', '德语': 'Dom', '西班牙语': 'domo', '俄语': 'дом', '拉丁语': 'domus' }, period: 'PIE', family: 'ie' },
  { root: '*wḗdr̥', meaning: '水/Water', languages: { '英语': 'water', '法语': 'eau', '德语': 'Wasser', '俄语': 'вода', '拉丁语': 'unda' }, period: 'PIE', family: 'ie' },
  { root: '*sol-', meaning: '太阳', languages: { '英语': 'sun', '法语': 'soleil', '德语': 'Sonne', '西班牙语': 'sol', '俄语': 'солнце', '拉丁语': 'sol' }, period: 'PIE', family: 'ie' },
  { root: '*luks-', meaning: '光/亮', languages: { '英语': 'light', '法语': 'lumière', '德语': 'Licht', '西班牙语': 'luz', '俄语': 'луч', '拉丁语': 'lux' }, period: 'PIE', family: 'ie' },
  { root: '*nokʷt-', meaning: '夜晚', languages: { '英语': 'night', '法语': 'nuit', '德语': 'Nacht', '西班牙语': 'noche', '俄语': 'ночь', '拉丁语': 'nox' }, period: 'PIE', family: 'ie' },
  { root: '*okʷ-', meaning: '眼睛', languages: { '英语': 'eye', '法语': 'oeil', '德语': 'Auge', '西班牙语': 'ojo', '俄语': 'oko', '拉丁语': 'oculus' }, period: 'PIE', family: 'ie' },
  { root: '*ed-', meaning: '吃', languages: { '英语': 'eat', '德语': 'essen', '俄语': 'есть', '拉丁语': 'edere' }, period: 'PIE', family: 'ie' },
  { root: '*ǵneh₃-', meaning: '知道', languages: { '英语': 'know', '德语': 'kennen', '西班牙语': 'conocer', '俄语': 'знать', '拉丁语': 'gnoscere' }, period: 'PIE', family: 'ie' },
  { root: '*h₃érō', meaning: '鹰', languages: { '英语': 'eagle', '法语': 'aigle', '德语': 'Adler', '西班牙语': 'águila', '拉丁语': 'aquila' }, period: 'PIE', family: 'ie' },
  { root: '*sker-', meaning: '切割', languages: { '英语': 'shear', '德语': 'scheren', '俄语': 'резать', '拉丁语': 'scindere' }, period: 'PIE', family: 'ie' },
  { root: '*gʷen-', meaning: '女人', languages: { '英语': 'queen', '德语': 'Frau', '俄语': 'жена' }, period: 'PIE', family: 'ie' },
]

export function buildGraph() {
  const nodes: any[] = []
  const links: any[] = []
  COGNATE_SETS.forEach((cs, ci) => {
    const rootId = 'root_' + ci
    nodes.push({ id: rootId, word: cs.root, language: 'Proto-IE', meaning: cs.meaning, family: 'ie', era: '公元前5000年' })
    Object.entries(cs.languages).forEach(([lang, word]) => {
      if (!word || word === '-') return
      const nid = ci + '_' + lang
      nodes.push({ id: nid, word, language: lang, meaning: cs.meaning, family: 'ie', era: '现代' })
      links.push({ source: rootId, target: nid, type: 'derived' })
    })
  })
  return { nodes, links }
}

// ---- 词源演化时间轴 ----

export const TIMELINE_ERAS: TimelineEra[] = [
  { name: '原始印欧语', start: -4500, end: -2500 },
  { name: '语族分化', start: -2500, end: -300 },
  { name: '古典时期', start: -300, end: 600 },
  { name: '中世纪', start: 600, end: 1500 },
  { name: '近现代', start: 1500, end: 2026 },
]

export const BRANCH_COLORS: Record<string, string> = {
  '英语': '#22d3ee', '法语': '#60a5fa', '德语': '#4ade80',
  '西班牙语': '#fb923c', '俄语': '#c084fc', '拉丁语': '#facc15',
}

// 各词根的历史演化链（PIE 起点由 buildTimeline 自动补齐），year 为约略年代（负数为公元前）
const TIMELINE_BRANCHES: Record<string, { to: string; stages: TimelineStage[] }[]> = {
  '*pṓds': [
    { to: '英语', stages: [
      { word: '*fōts', language: '原始日耳曼语', year: -500, change: 'Grimm定律: p→f' },
      { word: 'fōt', language: '古英语', year: 900 },
      { word: 'fot', language: '中古英语', year: 1300 },
      { word: 'foot', language: '英语', year: 2000 },
    ]},
    { to: '法语', stages: [
      { word: 'pēs', language: '拉丁语', year: -100 },
      { word: 'pié', language: '古法语', year: 1100, change: 'pēd- 缩约为 pié' },
      { word: 'pied', language: '法语', year: 2000 },
    ]},
  ],
  '*mātér': [
    { to: '英语', stages: [
      { word: '*mōdēr', language: '原始日耳曼语', year: -500 },
      { word: 'mōdor', language: '古英语', year: 900 },
      { word: 'moder', language: '中古英语', year: 1300 },
      { word: 'mother', language: '英语', year: 2000 },
    ]},
    { to: '法语', stages: [
      { word: 'māter', language: '拉丁语', year: -100 },
      { word: 'mere', language: '古法语', year: 1100 },
      { word: 'mère', language: '法语', year: 2000 },
    ]},
  ],
  '*pṓtr': [
    { to: '英语', stages: [
      { word: '*fadēr', language: '原始日耳曼语', year: -500, change: 'Grimm定律: p→f, t→d' },
      { word: 'fæder', language: '古英语', year: 900 },
      { word: 'fader', language: '中古英语', year: 1300 },
      { word: 'father', language: '英语', year: 2000 },
    ]},
    { to: '法语', stages: [
      { word: 'pater', language: '拉丁语', year: -100 },
      { word: 'pedre', language: '古法语', year: 1100 },
      { word: 'père', language: '法语', year: 2000 },
    ]},
  ],
  '*h₂épo': [
    { to: '法语', stages: [
      { word: 'aqua', language: '拉丁语', year: -100 },
      { word: 'ewe', language: '古法语', year: 1100, change: 'aqua 缩约音变' },
      { word: 'eau', language: '法语', year: 2000 },
    ]},
    { to: '英语', stages: [
      { word: 'aqua', language: '拉丁语', year: -100 },
      { word: 'aqua', language: '英语', year: 1600, change: '拉丁语借词' },
    ]},
  ],
  '*dʰómos': [
    { to: '英语', stages: [
      { word: 'domus', language: '拉丁语', year: -100 },
      { word: 'dome', language: '英语', year: 1600, change: '经法语借入' },
    ]},
    { to: '俄语', stages: [
      { word: '*domъ', language: '原始斯拉夫语', year: 400 },
      { word: 'дом', language: '俄语', year: 2000 },
    ]},
  ],
  '*wḗdr̥': [
    { to: '英语', stages: [
      { word: '*watōr', language: '原始日耳曼语', year: -500 },
      { word: 'wæter', language: '古英语', year: 900 },
      { word: 'water', language: '中古英语', year: 1300 },
      { word: 'water', language: '英语', year: 2000 },
    ]},
    { to: '德语', stages: [
      { word: '*watōr', language: '原始日耳曼语', year: -500 },
      { word: 'wazzar', language: '古高地德语', year: 800 },
      { word: 'Wasser', language: '德语', year: 2000 },
    ]},
  ],
  '*sol-': [
    { to: '英语', stages: [
      { word: '*sunnōn', language: '原始日耳曼语', year: -500 },
      { word: 'sunne', language: '古英语', year: 900 },
      { word: 'sun', language: '英语', year: 2000 },
    ]},
    { to: '法语', stages: [
      { word: 'sol', language: '拉丁语', year: -100 },
      { word: 'soleil', language: '古法语', year: 1100 },
      { word: 'soleil', language: '法语', year: 2000 },
    ]},
  ],
  '*luks-': [
    { to: '英语', stages: [
      { word: '*leuhtą', language: '原始日耳曼语', year: -500 },
      { word: 'lēoht', language: '古英语', year: 900 },
      { word: 'light', language: '中古英语', year: 1300 },
      { word: 'light', language: '英语', year: 2000 },
    ]},
    { to: '法语', stages: [
      { word: 'lux', language: '拉丁语', year: -100 },
      { word: 'lumiere', language: '古法语', year: 1100 },
      { word: 'lumière', language: '法语', year: 2000 },
    ]},
  ],
  '*nokʷt-': [
    { to: '英语', stages: [
      { word: '*nahts', language: '原始日耳曼语', year: -500, change: 'kʷ→h' },
      { word: 'niht', language: '古英语', year: 900 },
      { word: 'night', language: '中古英语', year: 1300 },
      { word: 'night', language: '英语', year: 2000 },
    ]},
    { to: '法语', stages: [
      { word: 'nox', language: '拉丁语', year: -100 },
      { word: 'nuit', language: '古法语', year: 1100 },
      { word: 'nuit', language: '法语', year: 2000 },
    ]},
  ],
  '*okʷ-': [
    { to: '英语', stages: [
      { word: '*augō', language: '原始日耳曼语', year: -500 },
      { word: 'ēage', language: '古英语', year: 900 },
      { word: 'eye', language: '中古英语', year: 1300 },
      { word: 'eye', language: '英语', year: 2000 },
    ]},
    { to: '法语', stages: [
      { word: 'oculus', language: '拉丁语', year: -100 },
      { word: 'oil', language: '古法语', year: 1100 },
      { word: 'œil', language: '法语', year: 2000 },
    ]},
  ],
  '*ed-': [
    { to: '英语', stages: [
      { word: '*etaną', language: '原始日耳曼语', year: -500 },
      { word: 'etan', language: '古英语', year: 900 },
      { word: 'eat', language: '英语', year: 2000 },
    ]},
    { to: '德语', stages: [
      { word: '*etaną', language: '原始日耳曼语', year: -500 },
      { word: 'ezzan', language: '古高地德语', year: 800 },
      { word: 'essen', language: '德语', year: 2000 },
    ]},
  ],
  '*ǵneh₃-': [
    { to: '英语', stages: [
      { word: '*knēaną', language: '原始日耳曼语', year: -500, change: '腭音 ǵ→k' },
      { word: 'cnāwan', language: '古英语', year: 900 },
      { word: 'know', language: '英语', year: 2000 },
    ]},
    { to: '拉丁语', stages: [
      { word: 'gnōscere', language: '拉丁语', year: -100 },
    ]},
  ],
  '*h₃érō': [
    { to: '法语', stages: [
      { word: 'aquila', language: '拉丁语', year: -100 },
      { word: 'egle', language: '古法语', year: 1100 },
      { word: 'aigle', language: '法语', year: 2000 },
    ]},
    { to: '英语', stages: [
      { word: 'aquila', language: '拉丁语', year: -100 },
      { word: 'egle', language: '古法语', year: 1100 },
      { word: 'eagle', language: '英语', year: 1400, change: '古法语借词' },
    ]},
  ],
  '*sker-': [
    { to: '英语', stages: [
      { word: '*skeraną', language: '原始日耳曼语', year: -500 },
      { word: 'scieran', language: '古英语', year: 900 },
      { word: 'shear', language: '英语', year: 2000 },
    ]},
    { to: '德语', stages: [
      { word: '*skeraną', language: '原始日耳曼语', year: -500 },
      { word: 'sceran', language: '古高地德语', year: 800 },
      { word: 'scheren', language: '德语', year: 2000 },
    ]},
  ],
  '*gʷen-': [
    { to: '英语', stages: [
      { word: '*kwēniz', language: '原始日耳曼语', year: -500, change: 'gʷ→kw' },
      { word: 'cwēn', language: '古英语', year: 900 },
      { word: 'queen', language: '英语', year: 2000 },
    ]},
    { to: '俄语', stages: [
      { word: '*žena', language: '原始斯拉夫语', year: 400, change: 'gʷ→ž' },
      { word: 'жена', language: '俄语', year: 2000 },
    ]},
  ],
}

export function buildTimeline(): TimelineChain[] {
  return COGNATE_SETS.map(cs => {
    const branches: TimelineBranch[] = (TIMELINE_BRANCHES[cs.root] || []).map(b => ({
      to: b.to,
      color: BRANCH_COLORS[b.to] || '#94a3b8',
      stages: [{ word: cs.root, language: '原始印欧语', year: -4000 }, ...b.stages],
    }))
    return { root: cs.root, meaning: cs.meaning, branches }
  })
}
