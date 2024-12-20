export interface MeditationStats {
  id: number;
  user_id: string;
  total_minutes: number;
  total_sessions: number;
  current_streak: number;
  tree_height: number;
  last_session_date: string | null;
}

export interface MeditationSession {
  id: number;
  user_id: string;
  duration: number;
  created_at: string;
} 