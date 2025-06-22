import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from '../types';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      setProfile(data);
    } catch (err: any) {
      console.error('Profile fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (profileData: Omit<UserProfile, 'id'>) => {
    if (!user) throw new Error('No user logged in');

    try {
      setError(null);
      
      // Validate required fields
      const requiredFields = ['name', 'age', 'gender', 'height', 'weight', 'body_type', 'fitness_goal', 'fitness_level', 'available_days', 'preferred_duration'];
      for (const field of requiredFields) {
        if (!profileData[field as keyof typeof profileData]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          ...profileData,
        }, {
          onConflict: 'id'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating/updating profile:', error);
        throw error;
      }

      setProfile(data);
      return data;
    } catch (err: any) {
      console.error('Profile creation error:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');

    try {
      setError(null);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      setProfile(data);
      return data;
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.message);
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    createProfile,
    updateProfile,
    refetch: fetchProfile,
  };
};