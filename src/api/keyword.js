import axios from 'axios';

export async function analyzeKeyword(keyword) {
    console.log("!!!"*100)
    try {
        // 发送 API 请求，获取真实数据
        const response = await axios.get('http://192.168.178.252:9031/api/keywords/compkey/reco_words', {
            params: {
                word: keyword,
                limit: 10,
                offset: 0
            }
        });

        // 检查后端返回数据的格式
        if (response.data.code !== 0 || !response.data.data) {
            throw new Error('Invalid API response');
        }

        // 数据结构转换
        const transformedData = response.data.data.map(item => ({
            keyword: item.word,        // word -> keyword
            score: item.recoScoreScaled      // compScore -> score
        }));

        // 返回符合前端格式的数据
        return {
            status: 'success',
            data: {
                keyword: keyword,
                competition_score: 75.3, // 保留原来的 competition_score 字段，可以根据需求修改
                related_keywords: transformedData
            }
        };
    } catch (error) {
        console.error('Error fetching or processing data:', error);
        return {
            status: 'error',
            message: error.message
        };
    }
}
// export async function analyzeKeyword(keyword) {
//     // 假数据示例：
//     return {
//         status: 'success',
//         data: {
//             keyword: keyword,
//             competition_score: 75.3,
//             related_keywords: [
//                 { keyword: "华为", score: 70.0 },
//                 { keyword: "三星", score: 80.0 },
//                 { keyword: "小米", score: 65.2 },
//                 { keyword: "OPO", score: 55.0 },
//                 { keyword: "OPP", score: 55.0 },
//                 { keyword: "OPPaO", score: 55.0 },
//                 { keyword: "OPPOa", score: 55.0 },
//                 { keyword: "OPbPO", score: 55.0 },
//                 { keyword: "OPPcO", score: 55.0 },
//                 { keyword: "OPPcaO", score: 55.0 }
//             ]
//         }
//     }
// }

export const sendFeedback = async ({ keyword, positive }) => {
    // 假数据示例：
    return {
        status: 'success'
    }
}