import axios from 'axios';

export async function generateImage(prompt) {
  const API_KEY = 'your api key';
  const API_URL = 'https://api.openai.com/v1/images/generations';

  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'image-alpha-001',
        prompt: prompt,
        size: '512x512',
        response_format: 'url',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`API returned status code ${response.status}`);
    }

    const generatedImageUrl = response.data.data[0].url;
    return generatedImageUrl;
  } catch (error) {
    console.error(error);
    // Display user-friendly error message
    alert('Error generating image');
    throw error;
  }
}
