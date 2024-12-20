import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Session {
  duration: number;
  date: string;
}

interface MeditationState {
  sessions: Session[];
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  treeHeight: number;
  lastSession: string | null;
}

const initialState: MeditationState = {
  sessions: [],
  totalSessions: 0,
  totalMinutes: 0,
  currentStreak: 0,
  treeHeight: 1,
  lastSession: null,
};

const isSameDay = (date1: string, date2: string) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

const calculateStreak = (sessions: Session[]): number => {
  if (sessions.length === 0) return 0;

  // Sort sessions by date in descending order
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Get unique dates (to handle multiple sessions in one day)
  const uniqueDates = sortedSessions.reduce((dates: string[], session) => {
    const sessionDate = session.date.split('T')[0]; // Get just the date part
    if (!dates.includes(sessionDate)) {
      dates.push(sessionDate);
    }
    return dates;
  }, []);

  let streak = 1;
  const today = new Date();
  const lastSessionDate = new Date(uniqueDates[0]);

  // If the last session is not from today or yesterday, reset streak
  if (!isSameDay(lastSessionDate.toISOString(), today.toISOString()) && 
      (today.getTime() - lastSessionDate.getTime()) > 24 * 60 * 60 * 1000) {
    return 0;
  }

  // Count consecutive days
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const currentDate = new Date(uniqueDates[i]);
    const nextDate = new Date(uniqueDates[i + 1]);
    const dayDifference = Math.floor(
      (currentDate.getTime() - nextDate.getTime()) / (24 * 60 * 60 * 1000)
    );

    if (dayDifference === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

const meditationSlice = createSlice({
  name: 'meditation',
  initialState,
  reducers: {
    addSession: (state, action: PayloadAction<Session>) => {
      state.sessions.push(action.payload);
      state.totalSessions = state.sessions.length;
      state.totalMinutes += action.payload.duration;
      state.lastSession = action.payload.date;
      state.currentStreak = calculateStreak(state.sessions);
      state.treeHeight = Math.min(10, 1 + Math.floor(state.totalMinutes / 10));
    },
    resetProgress: (state) => {
      state.sessions = [];
      state.totalSessions = 0;
      state.totalMinutes = 0;
      state.currentStreak = 0;
      state.treeHeight = 1;
      state.lastSession = null;
    },
  },
});

export const { addSession, resetProgress } = meditationSlice.actions;

export const store = configureStore({
  reducer: {
    meditation: meditationSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
