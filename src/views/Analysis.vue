<template>
  <div class="flex h-screen bg-[#1a1a1a] text-white">
    <!-- Sidebar -->
    <aside class="w-1/4 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-4 overflow-y-auto shadow-lg flex flex-col">
      <h2 class="text-lg font-semibold mb-4 text-gray-200">竞争性关键字</h2>
      <ul class="flex-grow">
        <li
            v-for="keyword in sortedRelatedKeywords"
            :key="keyword.id"
            class="flex items-center justify-between bg-gray-700 bg-opacity-60 p-2 mb-2 rounded-lg hover:bg-gray-600 transition"
        >
          <div class="flex flex-col">
            <span class="text-gray-300">{{ keyword.id }} ({{ keyword.score.toFixed(2) }})</span>
            <span v-if="feedbackStatus[keyword.id]" class="text-sm text-green-400 mt-1">
              反馈已提交
            </span>
          </div>
          <div class="flex space-x-2">
            <button
                @click="submitFeedback(keyword.id, true)"
                class="text-green-500 hover:text-green-300 transition"
                aria-label="点赞"
                :disabled="isFeedbackDisabled( keyword.id)"
            >
              <!-- 大拇指图标 -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 011.415-1.5H5V5a3 3 0 013-3h4.586a1.5 1.5 0 011.06.44l2.828 2.829a1.5 1.5 0 010 2.122l-8.485 8.486a1.5 1.5 0 01-2.122 0l-3-3A1.5 1.5 0 012 10.5z" />
              </svg>
            </button>
            <button
                @click="submitFeedback(keyword.id, false)"
                class="text-red-500 hover:text-red-300 transition"
                aria-label="点踩"
                :disabled="isFeedbackDisabled(keyword.id)"
            >
              <!-- 小拇指图标 -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 9.5a1.5 1.5 0 00-1.415-1.5H15V5a3 3 0 00-3-3H7.414a1.5 1.5 0 00-1.06.44L3.526 8.273a1.5 1.5 0 000 2.122l8.485 8.486a1.5 1.5 0 002.122 0l3-3A1.5 1.5 0 0018 9.5z" />
              </svg>
            </button>
            <button
                @click="fetchAIDetailedAnalysis(keyword.id)"
                class="text-blue-500 hover:text-blue-300 transition"
                aria-label="AI 竞争度分析"
            >
              <!-- AI 分析图标 -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12H9v-2h2v2zm0-4H9V6h2v4z" />
              </svg>
            </button>
          </div>
        </li>
      </ul>

      <!-- AI 深度搜索按钮 -->
      <div class="mt-4">
        <button
            @click="performDeepSearch"
            :disabled="isDeepSearchLoading || hasPerformedDeepSearch"
            class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition flex items-center justify-center disabled:bg-green-400"
            aria-label="AI 深度搜索"
        >
          <!-- 搜索图标 -->
          <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>
            {{ isDeepSearchLoading ? '搜索中...' : (hasPerformedDeepSearch ? '已搜索' : 'AI 深度搜索') }}
          </span>
          <!-- 加载指示器 -->
          <svg
              v-if="isDeepSearchLoading"
              class="animate-spin h-5 w-5 ml-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
          >
            <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
            ></circle>
            <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <section class="flex-grow p-4 relative">
      <NodeGraph
          :nodes="graphNodes"
          :links="graphLinks"
          @node-clicked="handleNodeClick"
          class="w-full h-full bg-black rounded-xl shadow relative"
      />

      <!-- Feedback Submission Message -->
      <div v-if="submissionMessage" class="absolute top-4 right-4 bg-gray-700 bg-opacity-80 text-gray-200 px-4 py-2 rounded">
        {{ submissionMessage }}
      </div>

      <!-- AI 分析模态框 -->
      <div v-if="showAnalysisModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg w-3/4 max-w-lg relative flex flex-col h-[80vh]">
          <!-- Modal Header -->
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold text-gray-200">AI 竞争度分析: {{ currentAnalysis.keyword }}</h3>
            <div class="flex space-x-2">
              <button
                  @click="copyToClipboard"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition flex items-center"
                  aria-label="复制"
              >
                <!-- Copy 图标 -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16h8M8 12h8m-8-4h8M6 18L18 6M6 6l12 12" />
                </svg>
                {{ copySuccess ? '已复制' : '复制' }}
              </button>
              <button @click="closeAnalysisModal" class="text-gray-400 hover:text-gray-200" aria-label="关闭">
                <!-- 关闭图标 -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Modal Content -->
          <div class="flex-grow overflow-y-auto">
            <!-- 加载指示器 -->
            <div v-if="isLoadingAnalysis" class="flex justify-center items-center my-4">
              <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            </div>

            <!-- AI 分析内容 -->
            <div v-else class="text-gray-300 whitespace-pre-wrap">
              {{ currentAnalysis.content }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import NodeGraph from '../components/NodeGraph.vue'
import { analyzeKeyword } from '../api/keyword'
import { sendFeedback } from '../api/feedback'
import { getAIDetailedAnalysis, deepSearchKeyword } from '../api/ai'
import axios from "axios"; // 导入 deepSearchKeyword

export default {
  name: 'Analysis',
  components: { NodeGraph },
  data() {
    return {
      keyword: this.$route.query.q || '苹果',
      graphNodes: [],
      graphLinks: [],
      relatedKeywords: [], // 存储竞争性关键字
      feedbackStatus: {}, // 跟踪每个关键字的反馈状态
      submissionMessage: '', // 提交反馈后的提示信息
      messageTimeout: null, // 用于清除提示信息的定时器
      showAnalysisModal: false, // 控制模态框显示
      currentAnalysis: { keyword: '', content: '' }, // 当前分析的关键字和内容
      isLoadingAnalysis: false, // 控制加载指示器显示
      copySuccess: false, // 控制复制成功的反馈
      isDeepSearchLoading: false, // 控制深度搜索加载指示器显示
      hasPerformedDeepSearch: false, // 新增：是否已执行深度搜索

      userFeedbackCounts: this.getUserFeedbackCounts(),
    }
  },
  computed: {
    sortedRelatedKeywords() {
      return this.relatedKeywords
          .slice() // 防止修改原数组
          .sort((a, b) => b.score - a.score); // 按照分数降序排序
    }
  },

  async mounted() {
    await this.loadKeywordData(this.keyword);
    this.userFeedbackCounts = { true: 0, false: 0 }; // 重置用户的反馈计数
    this.getUserIP(); // 获取用户的IP
  },
  methods: {
    async loadKeywordData(keyword) {
      const res = await analyzeKeyword(keyword)
      if (res.status === 'success') {
        const related = res.data.related_keywords

        // 更新 relatedKeywords 列表
        this.relatedKeywords = related.map(r => ({
          id: r.keyword,
          score: r.score
        }))

        // 重置深度搜索状态
        this.hasPerformedDeepSearch = false

        // 构造中心节点
        this.graphNodes = [{ id: "keyword", type: 'center' }]

        // 构造竞争节点和虚化小节点
        related.forEach((r) => {
          // 竞争节点
          this.graphNodes.push({ id: r.keyword, type: 'competitor'})
          // 为竞争节点添加小型虚化节点
          for (let i = 0; i < 3; i++) {
            this.graphNodes.push({
              id: `${r.keyword}_sub_${i}`,
              type: 'small',
              parent: r.keyword
            })
          }
        })

        // 构造与中心节点的连接
        this.graphLinks = related.map((r) => ({
          source: "keyword",
          target: r.keyword,
        }))

        // 构造小型节点的连接
        related.forEach((r) => {
          for (let i = 0; i < 3; i++) {
            this.graphLinks.push({
              source: r.keyword,
              target: `${r.keyword}_sub_${i}`,
              value: 0.5
            })
          }
        })
      }
    },
    async handleNodeClick(node) {
      if (node.type === 'competitor') {
        this.keyword = node.id
        await this.loadKeywordData(node.id)
      }
    },

    // 获取用户的IP
    getUserIP() {
      // 使用 axios 请求 ipify API 获取用户的真实IP
      axios.get('https://api.ipify.org?format=json')
          .then(response => {
            const userIP = response.data.ip;
            console.log('用户IP:', userIP); // 打印 IP 地址
            this.checkFeedbackStatus(userIP); // 根据 IP 地址检查用户反馈
          })
          .catch(error => {
            console.error('获取用户 IP 出错:', error);
          });
    },

    // 用来检查用户的反馈状态
    checkFeedbackStatus(userIP) {
      if (!this.feedbackStatus[userIP]) {
        this.feedbackStatus[userIP] = { true: 0, false: 0 };
      }
    },

    // 获取用户的点赞和点踩次数
    getUserFeedbackCounts() {
      const userIP = this.getUserIP();
      const feedbackCounts = JSON.parse(localStorage.getItem('userFeedbackCounts') || '{}');
      if (!feedbackCounts[userIP]) {
        feedbackCounts[userIP] = { true: 0, false: 0 }; // 初始次数为0
      }
      return feedbackCounts[userIP];
    },

    async submitFeedback(keywordId, isThumbsUp) {

      const userIP = this.getUserIP();
      if (this.userFeedbackCounts[isThumbsUp] < 5){
        // 增加反馈次数
        this.userFeedbackCounts[isThumbsUp]++;
        this.feedbackStatus[keywordId] = isThumbsUp;
        // 更新localStorage中的反馈次数
        const feedbackCounts = JSON.parse(localStorage.getItem('userFeedbackCounts') || '{}');
        feedbackCounts[userIP] = this.userFeedbackCounts;
        localStorage.setItem('userFeedbackCounts', JSON.stringify(feedbackCounts));



        try {
          console.log('this.feedbackStatus:', this.feedbackStatus);
          const response = await sendFeedback(keywordId, isThumbsUp, this.relatedKeywords)
          console.log('已反馈的状态:', response.status)
          if (response.status === 'success') {
            // 标记该关键字已反馈
            this.feedbackStatus[keywordId]=true
            console.log('this.feedbackStatus:', this.feedbackStatus);
            // 更新 relatedKeywords 为返回的更新后的值
            this.relatedKeywords = response.updatedKeywords;
            // 显示反馈成功的提示信息
            this.showSubmissionMessage('反馈已提交，谢谢您的参与！')
          } else {
            // 反馈失败，显示错误信息
            this.showSubmissionMessage('反馈提交失败，请稍后再试。')
          }
        } catch (error) {
          console.error('反馈提交错误:', error)
          console.error('错误详情:', error.response || error.message || error)
          this.showSubmissionMessage('发生错误，请检查网络或稍后再试。')
        }
      }
      else {
        // 超过限制次数，提示
        this.submissionMessage = `您已超过最多的${isThumbsUp === true ? '点赞' : '点踩'}次数限制。`;
        this.showSubmissionMessage(this.submissionMessage)
      }
    },
    // 判断是否禁用按钮
    isFeedbackDisabled( keywordId) {
      return this.userFeedbackCounts[true] >= 5 || this.feedbackStatus[keywordId] ||this.userFeedbackCounts[true] >= 5;
    },
    showSubmissionMessage(message) {
      this.submissionMessage = message
      // 清除之前的定时器
      if (this.messageTimeout) {
        clearTimeout(this.messageTimeout)
      }
      // 3秒后清除提示信息
      this.messageTimeout = setTimeout(() => {
        this.submissionMessage = ''
      }, 3000)
    },
    async fetchAIDetailedAnalysis(keywordId) {
      if (this.isLoadingAnalysis) {
        // 避免重复请求
        return
      }

      this.showAnalysisModal = true // 立即显示模态框
      this.isLoadingAnalysis = true
      this.copySuccess = false // 重置复制状态

      try {
        const response = await getAIDetailedAnalysis(keywordId)
        if (response.status === 'success') {
          this.currentAnalysis = {
            keyword: keywordId,
            content: response.data.analysis
          }
        } else {
          this.showSubmissionMessage('AI 分析获取失败，请稍后再试。')
        }
      } catch (error) {
        console.error('获取 AI 分析错误:', error)
        this.showSubmissionMessage('发生错误，请检查网络或稍后再试。')
      } finally {
        this.isLoadingAnalysis = false
      }
    },
    closeAnalysisModal() {
      this.showAnalysisModal = false
      this.currentAnalysis = {keyword: '', content: ''}
      this.copySuccess = false // 在关闭模态框时重置复制状态
    },
    copyToClipboard() {
      const text = this.currentAnalysis.content
      if (!text) return

      navigator.clipboard.writeText(text).then(() => {
        this.copySuccess = true
        // 不再自动重置 copySuccess
      }).catch(err => {
        console.error('复制失败:', err)
        this.showSubmissionMessage('复制失败，请手动复制。')
      })
    },
    async performDeepSearch() {
      if (this.isDeepSearchLoading || this.hasPerformedDeepSearch) {
        // 避免重复请求或已执行过深度搜索
        return
      }

      this.isDeepSearchLoading = true

      try {
        const response = await deepSearchKeyword(this.keyword)
        if (response.status === 'success') {
          const related = response.data.related_keywords

          // 更新 relatedKeywords 列表
          this.relatedKeywords = related.map(r => ({
            id: r.keyword,
            score: r.score
          }))

          // 更新图表数据
          this.graphNodes = [{id: "keyword", type: 'center'}]

          related.forEach((r) => {
            // 竞争节点
            this.graphNodes.push({id: r.keyword, type: 'competitor', score: r.score})
            // 为竞争节点添加小型虚化节点
            for (let i = 0; i < 3; i++) {
              this.graphNodes.push({
                id: `${r.keyword}_sub_${i}`,
                type: 'small',
                parent: r.keyword
              })
            }
          })

          // 构造与中心节点的连接
          this.graphLinks = related.map((r) => ({
            source: "keyword",
            target: r.keyword,
            value: r.score
          }))

          // 构造小型节点的连接
          related.forEach((r) => {
            for (let i = 0; i < 3; i++) {
              this.graphLinks.push({
                source: r.keyword,
                target: `${r.keyword}_sub_${i}`,
                value: 0.5
              })
            }
          })

          // 标记已执行深度搜索
          this.hasPerformedDeepSearch = true

          this.showSubmissionMessage('AI 深度搜索完成，图表已更新。')
        } else {
          this.showSubmissionMessage('AI 深度搜索失败，请稍后再试。')
        }
      } catch (error) {
        console.error('AI 深度搜索错误:', error)
        this.showSubmissionMessage('发生错误，请检查网络或稍后再试。')
      } finally {
        this.isDeepSearchLoading = false
      }
    }
  }
}
</script>

<style scoped>
/* 侧边栏项的悬停效果 */
aside ul li:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* 按钮的过渡效果 */
aside button {
  transition: color 0.3s;
}

/* 禁用按钮样式 */
aside button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* AI 深度搜索按钮禁用状态的背景色 */
button:disabled {
  background-color: #48bb78; /* bg-green-400 */
}

/* 反馈提交提示信息的样式 */
/* 已在模板中使用绝对定位 */

/* 模态框样式 */
.fixed {
  z-index: 50; /* 确保模态框在最上层 */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .flex {
    flex-direction: column;
  }

  aside {
    width: 100%;
    height: 40vh;
  }

  section {
    height: 60vh;
  }
}

/* 加载指示器样式 */
/* 使用 Tailwind 的内置类，无需额外定义 */
</style>