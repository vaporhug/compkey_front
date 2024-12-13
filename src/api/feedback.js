export async function sendFeedback(keyword, action, rating) {
    // 直接返回成功，不实际存储
    return {
        status: 'success',
        data: {
            message: 'Feedback recorded.'
        }
    }
}
