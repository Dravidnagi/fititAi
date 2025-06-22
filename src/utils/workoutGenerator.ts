import { UserProfile, WorkoutPlanType, WorkoutDay } from '../types';
import { getGeminiWorkoutPlan } from './geminiWorkoutGenerator';
import {
  getDayName,
  getDayFocus,
  getMainExercises,
  getWarmupExercises,
  getCooldownExercises,
  getPlanDescription,
  getPlanName
} from './workoutUtils';
import { exerciseDatabase } from './exerciseDatabase';

export const generateWorkoutPlan = async (profile: UserProfile): Promise<WorkoutPlanType> => {
  console.log('Starting workout plan generation with profile:', profile);

  if (
    !profile ||
    !profile.fitness_goal ||
    !profile.fitness_level ||
    !profile.available_days ||
    !profile.preferred_duration
  ) {
    console.error('Invalid profile data:', profile);
    throw new Error('Invalid profile data provided to workout generator');
  }

  try {
    console.log('Attempting to generate plan with Gemini...');
    const geminiPlan = await getGeminiWorkoutPlan(profile);
    console.log('Gemini plan result:', geminiPlan);
    
    if (geminiPlan?.name && geminiPlan?.days?.length > 0) {
      console.log('Using Gemini-generated plan');
      return geminiPlan;
    }
    console.log('Gemini plan invalid or empty, falling back to rule-based generator');
  } catch (err) {
    console.warn('Gemini plan generation failed:', err);
  }

  console.log('Generating rule-based plan...');
  const availableExercises = exerciseDatabase.filter(exercise => {
    if (profile.fitness_level === 'beginner') {
      return exercise.difficulty === 'beginner';
    } else if (profile.fitness_level === 'intermediate') {
      return exercise.difficulty !== 'advanced';
    } else {
      return true;
    }
  });

  const workoutDays: WorkoutDay[] = [];

  for (let day = 1; day <= profile.available_days; day++) {
    const focus = getDayFocus(day, profile.available_days, profile.fitness_goal);
    workoutDays.push({
      day,
      name: getDayName(day, profile.available_days, profile.fitness_goal),
      focus,
      duration: profile.preferred_duration,
      warmup: getWarmupExercises(availableExercises),
      exercises: getMainExercises(availableExercises, focus, profile.fitness_level, profile.preferred_duration),
      cooldown: getCooldownExercises(availableExercises)
    });
  }

  const plan = {
    id: `plan-${Date.now()}`,
    name: getPlanName(profile.fitness_goal, profile.fitness_level),
    description: getPlanDescription(profile.fitness_goal, profile.body_type, profile.available_days),
    totalWeeks: 4,
    daysPerWeek: profile.available_days,
    estimatedDuration: profile.preferred_duration,
    difficulty: profile.fitness_level,
    days: workoutDays
  };

  console.log('Generated rule-based plan:', plan);
  return plan;
};
