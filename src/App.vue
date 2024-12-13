<template>
  <div class="min-h-screen flex flex-col bg-[#1a1a1a] text-white">
    <!-- Header -->
    <header class="flex items-center justify-between p-4 bg-black shadow-md">
      <div class="flex items-center space-x-2">
        <h1 class="font-bold text-xl text-gray-200">Keyword Analysis</h1>
      </div>
      <nav class="flex space-x-6">
        <router-link
            to="/"
            class="hover:underline text-gray-400 hover:text-gray-100 transition"
            active-class="text-white font-semibold">Home</router-link>
        <router-link
            to="/analysis"
            class="hover:underline text-gray-400 hover:text-gray-100 transition"
            active-class="text-white font-semibold">Analysis</router-link>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="flex-grow">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="p-4 text-center text-gray-400 text-sm bg-black">
      © 2024 Keyword Analysis, Inc.
    </footer>
  </div>
</template>

<style>
/* 全局样式调整，清理默认边距 */
html, body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 自定义样式（如果需要更精细调整） */
</style>