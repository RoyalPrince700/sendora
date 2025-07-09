import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Session: undefined;
  FileShare: { code: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Session'>;

function generateRepeatedDigitCode(): string {
  const digit = Math.floor(Math.random() * 10).toString();
  return digit.repeat(4);
}

export default function SessionScreen({ navigation }: Props) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await axios.post('https://inshare-backend-c9p8.onrender.com/api/session');
      setCode(res.data.code || '');
      Alert.alert('Session Created', `Code: ${res.data.code}`);
      navigation.navigate('FileShare', { code: res.data.code });
    } catch (err) {
      Alert.alert('Error', 'Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = () => {
    if (code.length !== 4 || !/^([0-9])\1{3}$/.test(code)) {
      Alert.alert('Invalid Code', 'Enter a valid 4-digit repeated code.');
      return;
    }
    navigation.navigate('FileShare', { code });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session Management</Text>
      <TouchableOpacity
        style={[styles.sessionButton, loading && { opacity: 0.7 }]}
        onPress={handleCreate}
        activeOpacity={0.8}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.sessionButtonText}>Create Session</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.or}>OR</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter 4-digit code"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={4}
      />
      <TouchableOpacity
        style={[styles.sessionButton, styles.outlinedButton]}
        onPress={handleJoin}
        activeOpacity={0.8}
      >
        <Text style={styles.outlinedButtonText}>Join Session</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  or: {
    marginVertical: 16,
    fontSize: 16,
    color: '#888',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    width: '80%',
    marginBottom: 16,
    fontSize: 18,
    textAlign: 'center',
  },
  sessionButton: {
    backgroundColor: '#0ea9c5',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 16,
    shadowColor: '#0ea9c5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  sessionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  outlinedButton: {
    backgroundColor: '#fff', // white fill
    borderWidth: 2,
    borderColor: '#0ea9c5',
  },
  outlinedButtonText: {
    color: '#0ea9c5',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
}); 