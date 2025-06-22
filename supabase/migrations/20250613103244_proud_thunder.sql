/*
  # Create user profiles and workout data tables

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `age` (integer)
      - `gender` (text)
      - `height` (integer, in cm)
      - `weight` (integer, in kg)
      - `body_type` (text)
      - `fitness_goal` (text)
      - `fitness_level` (text)
      - `available_days` (integer)
      - `preferred_duration` (integer, in minutes)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `workout_plans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `name` (text)
      - `description` (text)
      - `total_weeks` (integer)
      - `days_per_week` (integer)
      - `estimated_duration` (integer)
      - `difficulty` (text)
      - `plan_data` (jsonb, stores the complete plan structure)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `workout_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `workout_plan_id` (uuid, references workout_plans)
      - `day_id` (integer)
      - `exercise_id` (text)
      - `completed` (boolean)
      - `completed_at` (timestamp)
      - `notes` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  age integer NOT NULL,
  gender text NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  height integer NOT NULL,
  weight integer NOT NULL,
  body_type text NOT NULL CHECK (body_type IN ('ectomorph', 'mesomorph', 'endomorph')),
  fitness_goal text NOT NULL CHECK (fitness_goal IN ('fat_loss', 'muscle_gain', 'flexibility', 'endurance', 'strength')),
  fitness_level text NOT NULL CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
  available_days integer NOT NULL CHECK (available_days >= 1 AND available_days <= 7),
  preferred_duration integer NOT NULL CHECK (preferred_duration > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create workout_plans table
CREATE TABLE IF NOT EXISTS workout_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  total_weeks integer NOT NULL DEFAULT 4,
  days_per_week integer NOT NULL,
  estimated_duration integer NOT NULL,
  difficulty text NOT NULL,
  plan_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create workout_progress table
CREATE TABLE IF NOT EXISTS workout_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  workout_plan_id uuid NOT NULL REFERENCES workout_plans(id) ON DELETE CASCADE,
  day_id integer NOT NULL,
  exercise_id text NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create policies for workout_plans
CREATE POLICY "Users can read own workout plans"
  ON workout_plans
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own workout plans"
  ON workout_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own workout plans"
  ON workout_plans
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own workout plans"
  ON workout_plans
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create policies for workout_progress
CREATE POLICY "Users can read own workout progress"
  ON workout_progress
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own workout progress"
  ON workout_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own workout progress"
  ON workout_progress
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own workout progress"
  ON workout_progress
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_plans_updated_at
  BEFORE UPDATE ON workout_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();