<template>
  <div class="bg-white rounded-xl shadow-md p-4">
    <h2 class="text-lg font-semibold mb-2">关键词分析结果</h2>
    <p class="text-sm mb-4">主关键词：{{ mainKeyword }} | 竞争得分：{{ competitionScore.toFixed(2) }}</p>
    <div class="flex flex-col space-y-1">
      <div
          v-for="(kw, index) in relatedKeywords"
          :key="index"
          class="flex justify-between bg-gray-50 rounded px-2 py-1 items-center"
      >
        <span class="font-medium">{{ kw.keyword }}</span>
        <span class="text-gray-500">{{ kw.score.toFixed(2) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResultList',
  props: {
    mainKeyword: String,
    competitionScore: {
      type: Number,
      default: 0
    },
    relatedKeywords: {
      type: Array,
      default: () => []
    }
  }
}
</script>
