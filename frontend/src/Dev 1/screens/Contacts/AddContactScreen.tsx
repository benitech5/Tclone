import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

interface AddContactScreenProps {
  onClose: () => void;
}

const AddContactScreen: React.FC<AddContactScreenProps> = ({ onClose }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [slideAnim] = useState(new Animated.Value(height));
  const [dragAnim] = useState(new Animated.Value(0));

  // Animate slide up on mount
  React.useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, []);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: dragAnim } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationY, velocityY } = event.nativeEvent;

      // If dragged down more than 100px or with high velocity, close the screen
      if (translationY > 100 || velocityY > 500) {
        handleBack();
      } else {
        // Snap back to original position
        Animated.spring(dragAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      }
    }
  };

  const handleBack = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleCreateContact = () => {
    if (!firstName.trim()) {
      // Show error for required first name
      return;
    }

    // Handle contact creation
    console.log("Creating contact:", { firstName, lastName, phoneNumber });

    // Close the screen
    handleBack();
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={handleBack} />
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY: slideAnim }, { translateY: dragAnim }],
            },
          ]}
        >
          <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#dc143c" />

            {/* Header */}
            <View style={styles.header}>
              {/* Drag Handle */}
              <View style={styles.dragHandle} />
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Contacts</Text>
              <View style={styles.headerSpacer} />
            </View>

            {/* New Contact Form */}
            <View style={styles.formContainer}>
              <ScrollView
                style={styles.formContent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                <Text style={styles.formTitle}>New Contact</Text>

                {/* First Name */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>First name (required)</Text>
                  <TextInput
                    style={[styles.input, styles.requiredInput]}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Enter first name"
                    placeholderTextColor="#999"
                  />
                </View>

                {/* Last Name */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Last name (optional)</Text>
                  <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Enter last name"
                    placeholderTextColor="#999"
                  />
                </View>

                {/* Phone Number */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Phone number</Text>
                  <View style={styles.phoneInputContainer}>
                    <View style={styles.countryCode}>
                      <Text style={styles.flag}>🇬🇭</Text>
                      <Text style={styles.countryCodeText}>+233</Text>
                    </View>
                    <TextInput
                      style={[styles.input, styles.phoneInput]}
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      placeholder="Enter phone number"
                      placeholderTextColor="#999"
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                {/* Create Contact Button - Now part of scrollable content */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.createButton,
                      !firstName.trim() && styles.createButtonDisabled,
                    ]}
                    onPress={handleCreateContact}
                    disabled={!firstName.trim()}
                  >
                    <Text style={styles.createButtonText}>Create Contact</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </SafeAreaView>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdrop: {
    flex: 1,
  },
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.7,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    backgroundColor: "#dc143c",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "relative",
  },
  dragHandle: {
    position: "absolute",
    top: 8,
    left: "50%",
    marginLeft: -20,
    width: 40,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSpacer: {
    width: 40,
  },
  formContainer: {
    backgroundColor: "#fff",
    flex: 1,
  },
  formContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingVertical: 24,
    paddingBottom: 40,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#dc143c",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  requiredInput: {
    borderColor: "#dc143c",
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  countryCode: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRightWidth: 0,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  flag: {
    fontSize: 16,
    marginRight: 8,
  },
  countryCodeText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  phoneInput: {
    flex: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  buttonContainer: {
    marginTop: 20,
  },
  createButton: {
    backgroundColor: "#dc143c",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  createButtonDisabled: {
    backgroundColor: "#ccc",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddContactScreen;
