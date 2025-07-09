import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import SessionScreen, { RootStackParamList } from './src/screens/SessionScreen';
import FileShareScreen from './src/screens/FileShareScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Image source={require('./assets/icon.png')} style={styles.logo} />
      <Text style={styles.title}>Sundora</Text>
      <Text style={styles.subtitle}>Seamless, real-time file sharing between devices.</Text>
      <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate('Session')} activeOpacity={0.8}>
        <Text style={styles.ctaText}>Start Sharing</Text>
      </TouchableOpacity>
      <Text style={styles.footer}>No sign-up. No hassle. Just share.</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Session" component={SessionScreen} />
        <Stack.Screen name="FileShare" component={FileShareScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f8fa',
    padding: 24,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 24,
    borderRadius: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  ctaButton: {
    backgroundColor: '#0ea9c5',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 32,
    shadowColor: '#0ea9c5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  ctaText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    width: '100%',
  },
}); 