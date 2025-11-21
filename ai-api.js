// AI API Integration
import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/completions';
const OPENAI_API_KEY = 'your-api-key';

export async function getAIResponse(prompt) {
    try {
        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: 'text-davinci-003',
                prompt: prompt,
                max_tokens: 150,
                temperature: 0.7
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                }
            }
        );
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error fetching AI response:', error);
        throw error;
    }
}

// Example usage
// const response = await getAIResponse('What is design thinking?');
// console.log(response);