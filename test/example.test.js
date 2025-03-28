const { KeywordUtils } = require("./keywordUtils");
// 测试用例数据
const TEST_TEXT = `
  The quick brown fox jumps over the lazy dog. 
  The fox is very quick and the dog is very lazy.
`;

describe('关键词提取算法测试', () => {
  // 测试词频统计
  test('统计词频（包含停用词）', () => {
    const frequency = KeywordUtils.getWordFrequency(TEST_TEXT);
    expect(frequency['the']).toBe(4);
    expect(frequency['fox']).toBe(2);
    expect(frequency['is']).toBe(2);
  });

  // 测试过滤停用词
  test('过滤停用词', () => {
    const frequency = KeywordUtils.getWordFrequency(TEST_TEXT);
    const filtered = KeywordUtils.filterStopWords(frequency);
    expect(filtered['the']).toBeUndefined();
    expect(filtered['fox']).toBe(2);
  });


  // 边界测试：空文本
  test('处理空文本', () => {
    const frequency = KeywordUtils.getWordFrequency('');
    expect(frequency).toEqual({});
  });
});