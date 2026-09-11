import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { COGNATE_SETS, LANGUAGE_FAMILIES, buildGraph, buildTimeline, TIMELINE_ERAS, BRANCH_COLORS } from '../mock/data'
import type { TimelineStage } from '../types'
export { LANGUAGE_FAMILIES, COGNATE_SETS, TIMELINE_ERAS, BRANCH_COLORS }

export const useEtymologyStore = defineStore('etymology', () => {
  const graph = ref(buildGraph())
  const timeline = ref(buildTimeline())
  const selectedNode = ref<any>(null)
  const selectedCognateRoot = ref<string | null>(null)
  const selectedTimelineStage = ref<{ root: string; stage: TimelineStage } | null>(null)
  const searchQuery = ref('')
  const selectedFamily = ref('all')

  const filteredCognates = computed(() =>
    COGNATE_SETS.filter(cs => {
      const q = searchQuery.value.toLowerCase()
      const matchSearch = !q || cs.root.toLowerCase().includes(q) || cs.meaning.includes(q) || Object.values(cs.languages).some((w: string) => w.toLowerCase().includes(q))
      const matchFamily = selectedFamily.value === 'all' || cs.family === selectedFamily.value
      return matchSearch && matchFamily
    })
  )

  const selectedCognate = computed(() =>
    COGNATE_SETS.find(cs => cs.root === selectedCognateRoot.value) || null
  )

  function syncGraphSelection(root: string) {
    const idx = COGNATE_SETS.findIndex(cs => cs.root === root)
    const gn = graph.value.nodes.find((n: any) => n.id === 'root_' + idx)
    if (gn) selectedNode.value = gn
  }

  // 时间轴节点点击：联动高亮同源词表行与力导向图根节点
  function selectTimelineStage(root: string, stage: TimelineStage) {
    selectedCognateRoot.value = root
    selectedTimelineStage.value = { root, stage }
    syncGraphSelection(root)
  }

  // 同源词表/词根标签点击：定位到该词根演化链的末端形态
  function selectCognate(root: string) {
    selectedCognateRoot.value = root
    const chain = timeline.value.find(c => c.root === root)
    const br = chain?.branches[0]
    if (br) selectedTimelineStage.value = { root, stage: br.stages[br.stages.length - 1] }
    syncGraphSelection(root)
  }

  return {
    graph, timeline, selectedNode, selectedCognateRoot, selectedTimelineStage, selectedCognate,
    searchQuery, selectedFamily, filteredCognates, selectTimelineStage, selectCognate,
  }
})
