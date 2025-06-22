import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { WorkoutPlanType, WorkoutProgress } from '../types';

export const useWorkoutPlans = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<WorkoutPlanType[]>([]);
  const [currentPlan, setCurrentPlan] = useState<WorkoutPlanType | null>(null);
  const [progress, setProgress] = useState<WorkoutProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchPlans();
      fetchProgress();
    } else {
      setPlans([]);
      setCurrentPlan(null);
      setProgress([]);
      setLoading(false);
    }
  }, [user]);

  const fetchPlans = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching workout plans for user:', user.id);
      
      const { data, error } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching plans:', error);
        throw error;
      }

      console.log('Raw plans data from database:', data);

      const workoutPlans = data.map(plan => ({
        ...plan.plan_data,
        id: plan.id,
      }));

      console.log('Processed workout plans:', workoutPlans);

      setPlans(workoutPlans);
      if (workoutPlans.length > 0) {
        setCurrentPlan(workoutPlans[0]);
        console.log('Set current plan to:', workoutPlans[0]);
      }
    } catch (err: any) {
      console.error('Plans fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    if (!user) return;

    try {
      console.log('Fetching workout progress for user:', user.id);
      
      const { data, error } = await supabase
        .from('workout_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching progress:', error);
        throw error;
      }

      console.log('Fetched progress data:', data);
      setProgress(data || []);
    } catch (err: any) {
      console.error('Progress fetch error:', err);
      setError(err.message);
    }
  };

  const savePlan = async (plan: WorkoutPlanType) => {
    if (!user) throw new Error('No user logged in');

    try {
      setError(null);
      
      console.log('Saving workout plan:', plan);
      
      const { data, error } = await supabase
        .from('workout_plans')
        .insert({
          user_id: user.id,
          name: plan.name,
          description: plan.description,
          total_weeks: plan.totalWeeks,
          days_per_week: plan.daysPerWeek,
          estimated_duration: plan.estimatedDuration,
          difficulty: plan.difficulty,
          plan_data: plan,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving plan:', error);
        throw error;
      }

      console.log('Plan saved successfully:', data);

      const newPlan = { ...plan, id: data.id };
      setPlans(prev => [newPlan, ...prev]);
      setCurrentPlan(newPlan);
      
      return newPlan;
    } catch (err: any) {
      console.error('Plan save error:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateProgress = async (dayId: number, exerciseId: string, completed: boolean, planId?: string) => {
    if (!user || !currentPlan) return;

    const workoutPlanId = planId || currentPlan.id;

    try {
      setError(null);
      
      // Check if progress entry exists
      const { data: existingProgress } = await supabase
        .from('workout_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('workout_plan_id', workoutPlanId)
        .eq('day_id', dayId)
        .eq('exercise_id', exerciseId)
        .single();

      if (existingProgress) {
        // Update existing progress
        const { error } = await supabase
          .from('workout_progress')
          .update({
            completed,
            completed_at: completed ? new Date().toISOString() : null,
          })
          .eq('id', existingProgress.id);

        if (error) throw error;
      } else {
        // Create new progress entry
        const { error } = await supabase
          .from('workout_progress')
          .insert({
            user_id: user.id,
            workout_plan_id: workoutPlanId,
            day_id: dayId,
            exercise_id: exerciseId,
            completed,
            completed_at: completed ? new Date().toISOString() : null,
          });

        if (error) throw error;
      }

      // Refresh progress
      await fetchProgress();
    } catch (err: any) {
      console.error('Progress update error:', err);
      setError(err.message);
      throw err;
    }
  };

  return {
    plans,
    currentPlan,
    progress,
    loading,
    error,
    savePlan,
    updateProgress,
    refetch: fetchPlans,
  };
};