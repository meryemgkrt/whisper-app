import { View, Text, ScrollView} from 'react-native';
import * as Sentry from '@sentry/react-native';

export default function HomeScreen() {
  return (
    <ScrollView 
      className="flex-1 bg-surface"
      contentContainerClassName="items-center justify-center flex-grow"
    >
      <Text className="text-2xl font-bold text-amber-500">Whisper</Text>
     
    </ScrollView>
  );
}