import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateWorkoutGemini(userProfile: any) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `
You are a certified fitness coach. Create a personalized 7-day fitness plan for the following user:
- Age: ${userProfile.age}
- Gender: ${userProfile.gender}
- Height: ${userProfile.height} cm
- Weight: ${userProfile.weight} kg
- Body Type: ${userProfile.body_type}
- Goal: ${userProfile.fitness_goal}
- Level: ${userProfile.fitness_level}
- Available Days: ${userProfile.available_days}
- Session Duration: ${userProfile.preferred_duration} minutes

Format your response as valid JSON:
{
  "plan": [
    {
      "day": "Day 1",
      "focus": "Upper Body",
      "exercises": [
        {
          "name": "Push-ups",
          "sets": 3,
          "reps": 15,
          "rest": "60s",
          "notes": "Keep elbows at 45 degrees"
        }
      ]
    },
    ...
  ]
}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const match = text.match(/\{[\s\S]*\}/); // Extract JSON block
    if (match) {
      const parsed = JSON.parse(match[0]);
      return parsed.plan;
    } else {
      throw new Error('Could not parse workout plan from Gemini response.');
    }
  } catch (error) {
    console.error('Error generating plan:', error);
    return null;
  }
}
