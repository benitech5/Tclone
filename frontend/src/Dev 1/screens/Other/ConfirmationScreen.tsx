import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch } from '../../store/store';
import { logout } from '../../store/authSlice';

interface ConfirmationParams {
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

const ConfirmationScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useAppDispatch();
  const params = (route.params || {}) as { message?: string; action?: string };
  const message = params.message || 'Are you sure?';
  const action = params.action;

  const handleYes = () => {
    console.log('Yes pressed', action);
    if (action === 'logout' || action === 'addAccount') {
      dispatch(logout());
      (navigation as any).reset({
        index: 0,
        routes: [{ name: 'Onboarding' }],
      });
    }
    // Add more actions as needed
  };

  const handleNo = () => {
    navigation.goBack();
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