<template>
  <div class="max-w-lg mx-auto mt-20 text-center">
    <div class="max-w-lg mx-auto text-center">
      <!-- 动态打字效果的标题 -->
      <h2 class="text-4xl font-bold mb-6 text-white">
        {{ displayedTitle }}
        <span class="cursor" v-if="isTyping">|</span>
      </h2>
      <p class="text-gray-300 mb-8">
        输入你的关键词，了解它的竞争情况。尝试使用AI深度搜索，让分析更智能。
      </p>
      <SearchBar @search="goAnalysis" />
    </div>
  </div>
</template>

<script>
import SearchBar from '../components/SearchBar.vue'

export default {
  name: 'Home',
  components: {SearchBar},
  data() {
    return {
      fullTitle: '欢迎来到关键词分析平台',
      displayedTitle: '',
      currentIndex: 0,
      typingSpeed: 150, // 每个字符的打字间隔时间（毫秒）
      isTyping: true, // 控制是否正在打字
      loopDelay: 2000, // 完成后等待的时间（毫秒）
    }
  },
  mounted() {
    this.startTyping()
  },
  methods: {
    startTyping() {
      if (this.currentIndex < this.fullTitle.length) {
        this.displayedTitle += this.fullTitle.charAt(this.currentIndex)
        this.currentIndex++
        setTimeout(this.startTyping, this.typingSpeed)
      } else {
        // 完成一次打字后，等待一段时间然后重新开始
        this.isTyping = false
        setTimeout(this.resetTyping, this.loopDelay)
      }
    },
    resetTyping() {
      this.displayedTitle = ''
      this.currentIndex = 0
      this.isTyping = true
      this.startTyping()
    },
    goAnalysis(keyword) {
      this.$router.push({path: '/analysis', query: {q: keyword}})
    }
  }
}
</script>

<style scoped>
/* 光标闪烁动画 */
@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.cursor {
  display: inline-block;
  width: 1ch;
  animation: blink 1s step-start infinite;
}

/* 可选：调整光标颜色 */
.cursor {
  color: white;
}
</style>