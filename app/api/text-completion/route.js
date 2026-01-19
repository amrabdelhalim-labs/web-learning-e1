import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
    if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json(
            {
                error: "يرجى التأكد من إضافتك ال API_KEY الخاص بك ومن صلاحيته!"
            },
            {
                status: 500
            }
        );
    };

    const req = await request.json();

    if (!req.message) {
        return NextResponse.json(
            {
                error: "يجب إرسال message!"
            },
            {
                status: 400
            }
        );
    }

    try {
        const response = await openai.completions.create({
            model: "gpt-3.5-turbo-instruct",
            prompt: req.message,
            temperature: 0,
            max_tokens: 200
        });

        return NextResponse.json({ text: response.choices[0].text });
    } catch (error) {
        if (error.status === 401) {
            return NextResponse.json(
                {
                    error: "يرجى التأكد من إضافتك ال API_KEY الخاص بك ومن صلاحيته!"
                },
                {
                    status: 401
                }
            );
        } else if (error.status === 429) {
            return NextResponse.json(
                {
                    error: "حدث خطأ في الاستجابة من الخادم بسبب أنك قمت بأكثر من طلب خلال فترة زمنية قصيرة، يرجى الانتظار قليلًا ومن ثم المحاولة مرة أخرى!"
                },
                {
                    status: 429
                }
            );
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);

            return NextResponse.json(
                {
                    error: "هنالك مشكلة في الخادم، نرجو المحاولة لاحقًا!"
                },
                {
                    status: 500
                }
            );
        };
    };
};
