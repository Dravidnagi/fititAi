import { UserProfile, WorkoutPlanType } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Check if API key is available
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
console.log('Environment check - API Key exists:', !!apiKey);
console.log('Environment check - API Key length:', apiKey?.length);

if (!apiKey) {
  console.error('Gemini API key is missing! Please check your .env file.');
  throw new Error('Gemini API key is not configured');
}

const genAI = new GoogleGenerativeAI(apiKey);

export const getGeminiWorkoutPlan = async (profile: UserProfile): Promise<WorkoutPlanType | null> => {
  console.log('=== Gemini Workout Plan Generation Started ===');
  console.log('Profile received:', JSON.stringify(profile, null, 2));
  
  try {
    console.log('Initializing Gemini model...');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    console.log('Gemini model initialized successfully');

    const prompt = `
Create a personalized workout plan for the following user profile:
- Age: ${profile.age}
- Gender: ${profile.gender}
- Height: ${profile.height} cm
- Weight: ${profile.weight} kg
- Body Type: ${profile.body_type}
- Fitness Goal: ${profile.fitness_goal}
- Fitness Level: ${profile.fitness_level}
- Available Days: ${profile.available_days}
- Preferred Duration: ${profile.preferred_duration} minutes

Return the response in this exact JSON format:
{
  "name": "string",
  "description": "string",
  "totalWeeks": 4,
  "daysPerWeek": number,
  "estimatedDuration": number,
  "difficulty": "beginner|intermediate|advanced",
  "days": [
    {
      "day": number,
      "name": "string",
      "focus": "string",
      "duration": number,
      "warmup": [
        {
          "id": "string",
          "name": "string",
          "category": "string",
          "sets": number,
          "reps": "string",
          "restTime": number,
          "description": "string",
          "muscleGroups": ["string"],
          "equipment": ["string"],
          "difficulty": "beginner|intermediate|advanced"
        }
      ],
      "exercises": [
        {
          "id": "string",
          "name": "string",
          "category": "string",
          "sets": number,
          "reps": "string",
          "restTime": number,
          "description": "string",
          "muscleGroups": ["string"],
          "equipment": ["string"],
          "difficulty": "beginner|intermediate|advanced"
        }
      ],
      "cooldown": [
        {
          "id": "string",
          "name": "string",
          "category": "string",
          "sets": number,
          "reps": "string",
          "restTime": number,
          "description": "string",
          "muscleGroups": ["string"],
          "equipment": ["string"],
          "difficulty": "beginner|intermediate|advanced"
        }
      ]
    }
  ]
}
`;

    console.log('Sending request to Gemini API...');
    console.log('Prompt length:', prompt.length);
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    console.log('Received response from Gemini API');
    
    const response = await result.response;
    const text = response.text();
    console.log('Raw Gemini response:', text);
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in response. Full response:', text);
      throw new Error('No valid JSON found in Gemini response');
    }
    
    console.log('Extracted JSON:', jsonMatch[0]);
    const plan = JSON.parse(jsonMatch[0]) as WorkoutPlanType;
    
    // Validate required fields
    if (!plan.name) {
      console.error('Missing plan name in response');
      throw new Error('Invalid workout plan: missing name');
    }
    if (!plan.days || !Array.isArray(plan.days) || plan.days.length === 0) {
      console.error('Invalid or empty days array in response');
      throw new Error('Invalid workout plan: missing or invalid days array');
    }
    
    console.log('Successfully parsed and validated workout plan');
    return plan;
  } catch (error) {
    console.error('=== Gemini API Error ===');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    console.error('=== End Error Details ===');
    return null;
  }
};
