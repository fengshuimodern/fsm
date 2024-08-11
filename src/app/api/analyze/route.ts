import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const {
      userName,
      age,
      gender,
      element,
      luckyDirection,
      floorPlanImage,
      uploadedFiles
    } = await req.json();

    // Prepare the prompt for GPT-4
    const prompt = `Analyze the Feng Shui of a room based on the following information:
    User: ${userName}
    Age: ${age}
    Gender: ${gender}
    Feng Shui Element: ${element}
    Lucky Direction: ${luckyDirection}
    Floor Plan Image: ${floorPlanImage}
    Additional Images: ${uploadedFiles.map(file => file.name).join(', ')}

    Please provide a detailed Feng Shui analysis and recommendations for improving the space.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const analysis = completion.choices[0].message.content;

    // Here you would typically save the analysis to your database
    // For this example, we'll just generate a random ID
    const analysisId = Math.random().toString(36).substr(2, 9);

    return NextResponse.json({ analysisId, analysis });
  } catch (error) {
    console.error('Error during analysis:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
