import { Exercise } from '../types';

export const getDayName = (day: number, totalDays: number, goal: string): string => {
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return dayNames[(day - 1) % 7];
};

export const getDayFocus = (day: number, totalDays: number, goal: string): string => {
  const focuses = {
    fat_loss: ['Full Body', 'Upper Body', 'Lower Body', 'Core'],
    muscle_gain: ['Chest & Triceps', 'Back & Biceps', 'Legs', 'Shoulders & Arms'],
    strength: ['Push', 'Pull', 'Legs', 'Full Body'],
    endurance: ['Cardio', 'HIIT', 'Circuit', 'Recovery'],
    flexibility: ['Dynamic Stretch', 'Static Stretch', 'Mobility', 'Recovery']
  } as const;
  return focuses[goal as keyof typeof focuses][(day - 1) % 4];
};

export const getWarmupExercises = (exercises: Exercise[]): Exercise[] => {
  return exercises
    .filter(ex => ex.category === 'warmup')
    .slice(0, 3);
};

export const getMainExercises = (
  exercises: Exercise[],
  focus: string,
  level: string,
  duration: number
): Exercise[] => {
  return exercises
    .filter(ex => ex.category !== 'warmup' && ex.category !== 'cooldown')
    .slice(0, Math.floor(duration / 15)); // Roughly 15 minutes per exercise
};

export const getCooldownExercises = (exercises: Exercise[]): Exercise[] => {
  return exercises
    .filter(ex => ex.category === 'cooldown')
    .slice(0, 2);
};

export const getPlanName = (goal: string, level: string): string => {
  return `${level.charAt(0).toUpperCase() + level.slice(1)} ${goal.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')} Program`;
};

export const getPlanDescription = (goal: string, bodyType: string, days: number): string => {
  return `A ${days}-day ${goal.split('_').join(' ')} program designed for ${bodyType} body type.`;
}; 