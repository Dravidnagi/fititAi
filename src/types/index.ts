export interface UserProfile {
  id?: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  body_type: 'ectomorph' | 'mesomorph' | 'endomorph';
  fitness_goal: 'fat_loss' | 'muscle_gain' | 'flexibility' | 'endurance' | 'strength';
  fitness_level: 'beginner' | 'intermediate' | 'advanced';
  available_days: number;
  preferred_duration: number; // in minutes
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  sets: number;
  reps: string;
  duration?: number;
  restTime: number;
  description: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  videoId?: string; // Tavus video ID
  audioInstructions?: string; // ElevenLabs audio instructions
}

export interface WorkoutDay {
  day: number;
  name: string;
  focus: string;
  duration: number;
  exercises: Exercise[];
  warmup: Exercise[];
  cooldown: Exercise[];
}

export interface WorkoutPlanType {
  id: string;
  name: string;
  description: string;
  totalWeeks: number;
  daysPerWeek: number;
  estimatedDuration: number;
  difficulty: string;
  days: WorkoutDay[];
}

export interface WorkoutProgress {
  dayId: number;
  exerciseId: string;
  completed: boolean;
  completedAt?: Date;
  notes?: string;
}