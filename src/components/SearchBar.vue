<template>
  <div class="relative">
    <input
        v-model="keyword"
        @keyup.enter="handleSearch"
        type="text"
        class="w-full bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-gray-300 border-opacity-30 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg transition duration-300 ease-in-out"
        :placeholder="displayedPlaceholder"
        aria-label="搜索关键词"
    />
    <button
        @click="handleSearch"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 shadow transition duration-300 ease-in-out"
        aria-label="搜索"
    >
      搜索
    </button>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    // 可以根据需要添加 props
  },
  data() {
    return {
      keyword: '',
      fullText: '请在这里输入你的关键字',
      displayedPlaceholder: '',
      currentIndex: 0,
      typingSpeed: 150, // 每个字符的间隔时间（毫秒）
      cursorVisible: true,
    }
  },
  mounted() {
    this.startTyping()
    this.startCursorBlinking()
  },
  methods: {
    handleSearch() {
      if (this.keyword.trim() !== '') {
        this.$emit('search', this.keyword.trim())
        this.keyword = ''
      }
    },
    startTyping() {
      if (this.currentIndex < this.fullText.length) {
        this.displayedPlaceholder += this.fullText.charAt(this.currentIndex)
        this.currentIndex++
        setTimeout(this.startTyping, this.typingSpeed)
      }
    },
    startCursorBlinking() {
      setInterval(() => {
        this.cursorVisible = !this.cursorVisible
      }, 500)
    },
  },
  computed: {
    displayedPlaceholderWithCursor() {
      return this.displayedPlaceholder + (this.cursorVisible ? '|' : ' ')
    }
  },
  watch: {
    displayedPlaceholder(newVal) {
      // 更新占位符以包含光标
      this.displayedPlaceholder = newVal
    }
  }
}
</script>

<style scoped>
/* 隐藏默认的输入框光标，因为我们将自定义光标 */
input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

input:focus::placeholder {
  color: transparent;
}
</style>