import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
  }

  return token;
}

export async function scheduleDailyReminder(hour: number, minute: number) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const trigger = {
    hour,
    minute,
    repeats: true,
  };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time to Meditate! 🧘‍♂️",
      body: "Take a moment to grow your mindfulness tree and find inner peace.",
      sound: true,
    },
    trigger,
  });
}

export function configurePushNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} 