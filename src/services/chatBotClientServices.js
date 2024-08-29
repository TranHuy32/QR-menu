import mysql from 'mysql2/promise';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
});

const getchatBot = async (req, res) => {
    const userMessage = req.body.message;
    const OPEN_AI_ENDPOINT = process.env.OPEN_AI_ENDPOINT;
    const chatGPTKey = process.env.OPENAI_API_KEY;

    if (!OPEN_AI_ENDPOINT || !chatGPTKey) {
        return res.status(500).json({ error: 'API endpoint or key not configured properly' });
    }

    if (!userMessage || typeof userMessage !== 'string' || userMessage.trim() === '') {
        return res.status(400).json({ error: 'Invalid message content' });
    }

    try {
        // Lấy danh sách các bảng cần lấy dữ liệu
        const tableNames = ['Categories', 'Dishes', 'Options'];

        let allData = {};

        for (let tableName of tableNames) {
            const [data] = await pool.query(`SELECT * FROM ${tableName}`);
            allData[tableName] = data;
        }

        // Tạo ngữ cảnh cho ChatGPT với dữ liệu từ cơ sở dữ liệu
        // Tạo ngữ cảnh cho ChatGPT với dữ liệu từ cơ sở dữ liệu và yêu cầu trả lời phù hợp
        const context = `
        Tôi đang phát triển một chatbot để trò chuyện với khách hàng trên trang web bán đồ ăn của mình. 
        Dưới đây là dữ liệu về các món ăn và tùy chọn mà tôi có trong cơ sở dữ liệu:

        ${JSON.stringify(allData)}

        Khi khách hàng hỏi về các món ăn, danh mục hoặc tùy chọn, bạn hãy trả lời một cách rõ ràng, thân thiện và dễ hiểu. 
        Hãy cung cấp thông tin chính xác về món ăn, giá cả, mô tả, và không được trả ra id của các bảng. 
        Nếu có thể, hãy đưa ra gợi ý thêm về các món ăn hoặc tùy chọn mà khách hàng có thể thích.

        Bây giờ, hãy trả lời câu hỏi sau từ khách hàng: "${userMessage}".`;


        // Gọi API của ChatGPT
        const response = await axios.post(
            `${OPEN_AI_ENDPOINT}/chat/completions`,
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: context }],
                temperature: 0.9,
                max_tokens: 150,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${chatGPTKey}`,
                },
            }
        );


        const botMessage = response.data.choices[0].message.content;
        return botMessage
    } catch (error) {
        console.error('Error communicating with OpenAI:', error.response ? error.response.data : error.message);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

export { getchatBot };
