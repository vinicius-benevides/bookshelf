import Constants from 'expo-constants';
import { Platform } from 'react-native';

const baseApiUrl =
  (Constants.expoConfig?.extra as { apiUrl?: string })?.apiUrl ||
  Platform.select({
    android: 'http://10.0.2.2:3333',
    ios: 'http://localhost:3333',
    default: 'http://localhost:3333',
  });

export const resolveImageUrl = (uri?: string) => {
  if (!uri) return undefined;
  if (uri.startsWith('http')) return uri;
  return `${baseApiUrl}${uri}`;
};
