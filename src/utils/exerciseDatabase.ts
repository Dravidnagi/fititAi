// src/lib/exerciseDatabase.ts
import { Exercise } from '../types';

export const exerciseDatabase: Exercise[] = [
  {
    id: 'pushup',
    name: 'Push-ups',
    category: 'strength',
    difficulty: 'beginner',
    sets: 3,
    reps: '15',
    restTime: 60,
    description: 'Keep elbows at 45 degrees',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    equipment: ['none']
  },
  {
    id: 'squat',
    name: 'Bodyweight Squats',
    category: 'strength',
    difficulty: 'beginner',
    sets: 3,
    reps: '20',
    restTime: 60,
    description: 'Keep back straight',
    muscleGroups: ['quadriceps', 'hamstrings', 'glutes'],
    equipment: ['none']
  },
  {
    id: 'plank',
    name: 'Plank',
    category: 'core',
    difficulty: 'beginner',
    sets: 3,
    reps: '30s',
    restTime: 60,
    description: 'Hold for 30 seconds each',
    muscleGroups: ['abs', 'core', 'shoulders'],
    equipment: ['none']
  },
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    category: 'warmup',
    difficulty: 'beginner',
    sets: 2,
    reps: '30',
    restTime: 30,
    description: 'Light warm-up',
    muscleGroups: ['full body'],
    equipment: ['none']
  },
  {
    id: 'stretching',
    name: 'Stretching',
    category: 'cooldown',
    difficulty: 'beginner',
    sets: 1,
    reps: '20s',
    restTime: 0,
    description: 'Hold each stretch for 20 seconds',
    muscleGroups: ['full body'],
    equipment: ['none']
  }
];
