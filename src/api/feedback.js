export async function sendFeedback(keywordId, isThumbsUp, relatedKeywords) {

    // 根据 isThumbsUp 调整 relatedKeywords 中 keywordId 的排名
    const index = relatedKeywords.findIndex(keyword => keyword.id === keywordId);

    if (index === -1) {
        console.error('没有找到对应的关键词');
        return { status: 'error', message: '没有找到对应的关键词' };
    }

    const keyword = relatedKeywords[index];

    if (isThumbsUp) {
        console.log('用户点赞了');
        // 将分数加 10
        keyword.score += 1;
    } else {
      console.log('用户点踩了');
        // 将分数减 10
        keyword.score -= 1;
    }

    // 打印调整后的 relatedKeywords（调试用）
    console.log('调整后的 relatedKeywords:', relatedKeywords);

    // 直接返回成功，不实际存储
    return {
        status: 'success',
        message: '反馈已提交并调整排名',
        updatedKeywords: relatedKeywords
    };
}
