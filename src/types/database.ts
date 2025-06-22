export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          name: string;
          age: number;
          gender: 'male' | 'female' | 'other';
          height: number;
          weight: number;
          body_type: 'ectomorph' | 'mesomorph' | 'endomorph';
          fitness_goal: 'fat_loss' | 'muscle_gain' | 'flexibility' | 'endurance' | 'strength';
          fitness_level: 'beginner' | 'intermediate' | 'advanced';
          available_days: number;
          preferred_duration: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          age: number;
          gender: 'male' | 'female' | 'other';
          height: number;
          weight: number;
          body_type: 'ectomorph' | 'mesomorph' | 'endomorph';
          fitness_goal: 'fat_loss' | 'muscle_gain' | 'flexibility' | 'endurance' | 'strength';
          fitness_level: 'beginner' | 'intermediate' | 'advanced';
          available_days: number;
          preferred_duration: number;
        };
        Update: {
          name?: string;
          age?: number;
          gender?: 'male' | 'female' | 'other';
          height?: number;
          weight?: number;
          body_type?: 'ectomorph' | 'mesomorph' | 'endomorph';
          fitness_goal?: 'fat_loss' | 'muscle_gain' | 'flexibility' | 'endurance' | 'strength';
          fitness_level?: 'beginner' | 'intermediate' | 'advanced';
          available_days?: number;
          preferred_duration?: number;
        };
      };
      workout_plans: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          total_weeks: number;
          days_per_week: number;
          estimated_duration: number;
          difficulty: string;
          plan_data: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          name: string;
          description: string;
          total_weeks?: number;
          days_per_week: number;
          estimated_duration: number;
          difficulty: string;
          plan_data: any;
        };
        Update: {
          name?: string;
          description?: string;
          total_weeks?: number;
          days_per_week?: number;
          estimated_duration?: number;
          difficulty?: string;
          plan_data?: any;
        };
      };
      workout_progress: {
        Row: {
          id: string;
          user_id: string;
          workout_plan_id: string;
          day_id: number;
          exercise_id: string;
          completed: boolean;
          completed_at: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          workout_plan_id: string;
          day_id: number;
          exercise_id: string;
          completed?: boolean;
          completed_at?: string | null;
          notes?: string | null;
        };
        Update: {
          completed?: boolean;
          completed_at?: string | null;
          notes?: string | null;
        };
      };
    };
  };
}