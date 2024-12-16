import instance from './index'

export async function analyzeKeyword(keyword) {
    // 假数据示例：
    return {
        status: 'success',
        data: {
            keyword: keyword,
            competition_score: 75.3,
            related_keywords: [
                { keyword: "华为", score: 70.0 },
                { keyword: "三星", score: 80.0 },
                { keyword: "小米", score: 65.2 },
                { keyword: "OPO", score: 55.0 },
                { keyword: "OPP", score: 55.0 },
                { keyword: "OPPaO", score: 55.0 },
                { keyword: "OPPOa", score: 55.0 },
                { keyword: "OPbPO", score: 55.0 },
                { keyword: "OPPcO", score: 55.0 },
                { keyword: "OPPcaO", score: 55.0 }
            ]
        }
    }
}

export const sendFeedback = async ({ keyword, positive }) => {
    // 假数据示例：
    return {
        status: 'success'
    }
}