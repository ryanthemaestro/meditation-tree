import AsyncStorage from '@react-native-async-storage/async-storage';
import { MeditationState } from '../store';

const STORAGE_KEY = '@meditation_app_state';

export async function saveState(state: MeditationState) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving state:', error);
  }
}

export async function loadState(): Promise<MeditationState | null> {
  try {
    const jsonState = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonState ? JSON.parse(jsonState) : null;
  } catch (error) {
    console.error('Error loading state:', error);
    return null;
  }
}

export async function clearState() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing state:', error);
  }
} 