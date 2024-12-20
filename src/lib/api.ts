import { supabase } from './supabase';
import type { MeditationStats, MeditationSession } from '../types/supabase';
import Constants from 'expo-constants';

// Get the current URL for redirects
const getURL = () => {
  const url = Constants.expoConfig?.hostUri
    ? `exp://${Constants.expoConfig.hostUri}`
    : 'exp://localhost:8081';
  return url;
};

// Get user's meditation stats
export const getMeditationStats = async (): Promise<MeditationStats> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // First try to get existing stats
  const { data: existingStats, error: fetchError } = await supabase
    .from('meditation_stats')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();  // Use maybeSingle instead of single to handle no rows gracefully

  // If we got stats back, return them
  if (existingStats) {
    return existingStats;
  }

  // If no stats exist, create initial stats
  const initialStats = {
    user_id: user.id,
    total_minutes: 0,
    total_sessions: 0,
    current_streak: 0,
    tree_height: 0,
    last_session_date: null
  };

  const { data: newStats, error: insertError } = await supabase
    .from('meditation_stats')
    .insert(initialStats)
    .select()
    .single();

  if (insertError) throw insertError;
  return newStats;
};

// Record a new meditation session
export const recordMeditationSession = async (duration: number): Promise<number> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in to record a session');

  const { error } = await supabase
    .from('meditation_sessions')
    .insert({
      user_id: user.id,
      duration
    });

  if (error) throw error;
  // Return the duration for the success message
  return Math.floor(duration / 60); // Convert seconds to minutes
};

// Get recent meditation sessions
export const getRecentSessions = async (limit: number = 10): Promise<MeditationSession[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('meditation_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

// Authentication
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data.user;
};

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getURL(),
      data: {
        created_at: new Date().toISOString(),
      }
    }
  });
  if (error) throw error;

  // Initial stats will be created when first accessed
  return data.user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}; 