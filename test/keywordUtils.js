/**
 * 关键词提取工具类（示例算法）
 */
const KeywordUtils = {
    // 统计词频
    getWordFrequency: (text) => {
      const words = text.toLowerCase().match(/\b\w+\b/g) || [];
      const frequency = {};
      words.forEach(word => {
        frequency[word] = (frequency[word] || 0) + 1;
      });
      return frequency;
    },
  
    // 过滤停用词
    filterStopWords: (wordMap, stopWords = ['a', 'the', 'is']) => {
      const filtered = {};
      for (const word in wordMap) {
        if (!stopWords.includes(word)) {
          filtered[word] = wordMap[word];
        }
      }
      return filtered;
    },
  
    // 提取前N个高频词
    getTopKeywords: (wordMap, topN = 3) => {
      return Object.entries(wordMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)
        .map(item => item[0]);
    }
  };

module.exports = { KeywordUtils };
