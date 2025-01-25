import axios from "axios";

export async function generateResponse(prompt: string) {
  const response = await axios.post("https://api.deepseek.com/v1/generate", {
    prompt: prompt,
    max_tokens: 150,
  });
  return response.data.choices[0].text;
}