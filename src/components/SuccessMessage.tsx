import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface SuccessMessageProps {
  minutes: number;
  onDismiss: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ minutes, onDismiss }) => {
  const opacity = new Animated.Value(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => onDismiss());
    }, 7000); // Show for 7 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={styles.messageBox}>
        <Text style={styles.title}>Great job! 🎉</Text>
        <Text style={styles.message}>
          You meditated for {minutes} {minutes === 1 ? 'minute' : 'minutes'}
        </Text>
        <Text style={styles.submessage}>
          Your tree is growing stronger
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '10%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  messageBox: {
    backgroundColor: '#2E8B57',
    padding: 20,
    borderRadius: 15,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 5,
  },
  submessage: {
    color: '#E8F5E9',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default SuccessMessage; 