import { NextResponse } from 'next/server'
 
const API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request) {
    const req = await request.json();

    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-4.1-mini',
            messages: [
                {
                    role: "user",
                    content: req.message
                }
            ]
        })
    };
 
    const response = await fetch("https://api.openai.com/v1/chat/completions", options)
    const data = await response.json()
 
  return NextResponse.json(data);
};