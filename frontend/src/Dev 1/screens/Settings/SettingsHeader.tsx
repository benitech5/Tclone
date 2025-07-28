import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../ThemeContext";

interface SettingsHeaderProps {
  title: string;
  onBack: () => void;
  right?: React.ReactNode;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  title,
  onBack,
  right = null,
}) => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ backgroundColor: "#dc143c" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          backgroundColor: "#dc143c",
          paddingTop: 32,
          paddingBottom: 16,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderColor: "#dc143c",
          position: "relative",
          elevation: 2,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 2,
          minHeight: 56,
        }}
      >
        <TouchableOpacity
          onPress={onBack}
          style={{
            marginRight: 16,
            justifyContent: "center",
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text
          style={{
            color: "#fff",
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "left",
            marginLeft: 8,
          }}
        >
          {title}
        </Text>
        {right && (
          <View
            style={{
              position: "absolute",
              right: 16,
              top: 0,
              bottom: 0,
              justifyContent: "center",
            }}
          >
            {right}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SettingsHeader;
