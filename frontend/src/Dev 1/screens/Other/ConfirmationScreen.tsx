import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

interface ConfirmationParams {
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

const ConfirmationScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { message, onConfirm, onCancel } = (route.params || {}) as ConfirmationParams;

  const handleYes = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleNo = () => {
    if (onCancel) onCancel();
    else navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <View style={styles.buttonRow}>
        <Pressable style={styles.button} onPress={handleNo}>
          <Text style={styles.buttonText}>No</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.yesButton]} onPress={handleYes}>
          <Text style={styles.buttonText}>Yes</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
    color: '#222',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  button: {
    backgroundColor: '#aaa',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  yesButton: {
    backgroundColor: '#d32f2f',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ConfirmationScreen; 