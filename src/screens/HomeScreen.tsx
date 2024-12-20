import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';
import { getMeditationStats, recordMeditationSession } from '../lib/api';
import type { MeditationStats } from '../types/supabase';
import SuccessMessage from '../components/SuccessMessage';

type RootStackParamList = {
  Home: undefined;
  Stats: undefined;
  Settings: undefined;
};

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

interface TreeProps {
  height: number;
}

const Tree: React.FC<TreeProps> = ({ height }) => {
  const scale = Math.min(1 + (height - 1) * 0.2, 2.5);
  
  return (
    <Svg height="300" width="200" viewBox="0 0 100 100">
      {/* Simple trunk */}
      <Path
        d={`M47,90 L53,90 L53,${75 - height * 15} L47,${75 - height * 15} Z`}
        fill="#795548"
      />
      
      {/* Simple triangular crown */}
      <Path
        d={`M50,${30 - height * 10} 
            L${35 + height * 2},${70 - height * 10} 
            L${65 - height * 2},${70 - height * 10} Z`}
        fill="#4CAF50"
      />
      
      {/* Optional: Second layer for depth */}
      <Path
        d={`M50,${40 - height * 10} 
            L${38 + height},${75 - height * 10} 
            L${62 - height},${75 - height * 10} Z`}
        fill="#388E3C"
      />
    </Svg>
  );
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState<MeditationStats | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastSessionMinutes, setLastSessionMinutes] = useState(0);

  // Fetch meditation stats
  const fetchStats = async () => {
    try {
      const data = await getMeditationStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setMessage('Error loading meditation stats');
    }
  };

  // Load stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval!);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  const handleStartStop = async () => {
    if (isActive) {
      // End session
      try {
        // Send duration in seconds to the API
        const minutes = await recordMeditationSession(seconds);
        setLastSessionMinutes(minutes);
        setShowSuccess(true);
        // Refresh stats after recording session
        await fetchStats();
      } catch (error) {
        console.error('Error recording session:', error);
        setMessage('Error saving meditation session');
      }
      setSeconds(0);
    }
    setIsActive(!isActive);
  };

  return (
    <View style={styles.container}>
      {showSuccess && (
        <SuccessMessage
          minutes={lastSessionMinutes}
          onDismiss={() => setShowSuccess(false)}
        />
      )}
      <TouchableOpacity
        onPress={() => setMessage('Keep growing your mindfulness tree!')}
        style={styles.treeContainer}
      >
        <Tree height={stats?.tree_height || 1} />
      </TouchableOpacity>

      <Text style={styles.timerText}>
        {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
      </Text>

      <TouchableOpacity
        style={[styles.button, isActive ? styles.stopButton : styles.startButton]}
        onPress={handleStartStop}
      >
        <Text style={styles.buttonText}>
          {isActive ? 'Stop Meditation' : 'Start Meditation'}
        </Text>
      </TouchableOpacity>

      {message ? (
        <Text style={styles.message}>{message}</Text>
      ) : null}

      <TouchableOpacity
        style={styles.statsButton}
        onPress={() => navigation.navigate('Stats')}
      >
        <Text style={styles.statsButtonText}>View Progress</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  treeContainer: {
    marginBottom: 40,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#2E8B57',
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#2E8B57',
  },
  stopButton: {
    backgroundColor: '#DC143C',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    color: '#2E8B57',
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  statsButton: {
    marginTop: 20,
    padding: 10,
  },
  statsButtonText: {
    color: '#2E8B57',
    fontSize: 16,
  },
});

export default HomeScreen; 