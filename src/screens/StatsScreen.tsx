import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getMeditationStats, getRecentSessions, signOut } from '../lib/api';
import type { MeditationStats, MeditationSession } from '../types/supabase';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Stats: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Stats'>;

const StatsScreen = () => {
  const [stats, setStats] = useState<MeditationStats | null>(null);
  const [recentSessions, setRecentSessions] = useState<MeditationSession[]>([]);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          onPress={handleLogout}
          style={{ marginRight: 15 }}
        >
          <Text style={{ color: '#fff', fontSize: 14 }}>Sign Out</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const statsData = await getMeditationStats();
      setStats(statsData);
      const sessions = await getRecentSessions(5);
      setRecentSessions(sessions);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // Navigation will be handled by the auth state change
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Sessions</Text>
          <Text style={styles.statValue}>{stats?.total_sessions || 0}</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Minutes</Text>
          <Text style={styles.statValue}>{Math.round(stats?.total_minutes || 0)}</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Current Streak</Text>
          <Text style={styles.statValue}>{stats?.current_streak || 0} days</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Tree Height</Text>
          <Text style={styles.statValue}>{Math.round((stats?.tree_height || 0) * 10) / 10}</Text>
        </View>

        <Text style={styles.subtitle}>Recent Sessions</Text>
        {recentSessions.map((session, index) => (
          <View key={session.id} style={styles.sessionItem}>
            <Text style={styles.sessionText}>
              {new Date(session.created_at).toLocaleDateString()}: {Math.floor(session.duration / 60)} minutes
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  statsContainer: {
    padding: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginTop: 20,
    marginBottom: 10,
  },
  statBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  sessionItem: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  sessionText: {
    color: '#666',
    fontSize: 14,
  },
});

export default StatsScreen; 