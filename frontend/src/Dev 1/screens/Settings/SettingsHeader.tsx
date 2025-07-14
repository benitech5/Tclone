import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../../ThemeContext';

interface SettingsHeaderProps {
  title: string;
  onBack: () => void;
  right?: React.ReactNode;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({ title, onBack, right = null }) => {
  const { theme } = useTheme();
  
  return (
    <SafeAreaView style={{ backgroundColor: theme.background }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.background,
        paddingTop: 32,
        paddingBottom: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: theme.border,
        position: 'relative',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 2,
        minHeight: 56,
      }}>
        <TouchableOpacity onPress={onBack} style={{ position: 'absolute', left: 16, top: 0, bottom: 0, justifyContent: 'center' }}>
          <Text style={{ color: theme.text, fontSize: 28, fontWeight: 'bold' }}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={{ color: theme.text, fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>{title}</Text>
        {right && <View style={{ position: 'absolute', right: 16, top: 0, bottom: 0, justifyContent: 'center' }}>{right}</View>}
      </View>
    </SafeAreaView>
  );
};

export default SettingsHeader; 