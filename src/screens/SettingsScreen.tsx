import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { useDispatch } from 'react-redux';
import { resetProgress } from '../store';
import { scheduleDailyReminder, registerForPushNotificationsAsync } from '../utils/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearState } from '../utils/storage';

const REMINDER_TIME_KEY = '@meditation_reminder_time';
const REMINDER_ENABLED_KEY = '@meditation_reminder_enabled';

const SettingsScreen: React.FC = () => {
  const dispatch = useDispatch();
  const [isReminderEnabled, setIsReminderEnabled] = useState(false);
  const defaultReminderTime = { hour: 8, minute: 0 }; // 8:00 AM default

  useEffect(() => {
    loadReminderSettings();
  }, []);

  const loadReminderSettings = async () => {
    try {
      const enabled = await AsyncStorage.getItem(REMINDER_ENABLED_KEY);
      setIsReminderEnabled(enabled === 'true');
    } catch (error) {
      console.error('Error loading reminder settings:', error);
    }
  };

  const handleReminderToggle = async (value: boolean) => {
    try {
      setIsReminderEnabled(value);
      await AsyncStorage.setItem(REMINDER_ENABLED_KEY, value.toString());
      
      if (value) {
        await registerForPushNotificationsAsync();
        await scheduleDailyReminder(defaultReminderTime.hour, defaultReminderTime.minute);
        Alert.alert(
          'Reminder Set',
          `You'll receive daily meditation reminders at ${defaultReminderTime.hour}:00 AM`
        );
      }
    } catch (error) {
      console.error('Error setting reminder:', error);
      Alert.alert('Error', 'Could not set reminder');
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your meditation progress? This cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            dispatch(resetProgress());
            await clearState();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Daily Reminder</Text>
            <Switch
              value={isReminderEnabled}
              onValueChange={handleReminderToggle}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isReminderEnabled ? '#2E8B57' : '#f4f3f4'}
            />
          </View>
          <Text style={styles.settingDescription}>
            Receive daily reminders to meditate
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={handleReset}
        >
          <Text style={styles.settingTextDanger}>Reset Progress</Text>
          <Text style={styles.settingDescription}>
            Clear all meditation history and reset tree growth
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: 20,
    paddingBottom: 10,
  },
  settingItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  settingTextDanger: {
    fontSize: 16,
    color: '#DC143C',
    marginBottom: 5,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default SettingsScreen; 