import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../ThemeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../types/navigation";
import { setAppLanguage, getAppLanguage } from "../../i18n";
import { useTranslation } from "react-i18next";

type LanguageScreenProps = {
  navigation: NativeStackNavigationProp<MainStackParamList, "Language">;
};

interface LanguageOption {
  id: string;
  name: string;
  nativeName: string;
  code: string;
}

const LanguageScreen: React.FC<LanguageScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(
    i18n.language || "en"
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const lng = await getAppLanguage();
      setSelectedLanguage(lng);
      if (lng !== i18n.language) {
        await i18n.changeLanguage(lng);
      }
      setLoading(false);
    })();
  }, []);

  const languages: LanguageOption[] = [
    { id: "en", name: "English", nativeName: "English", code: "EN" },
    { id: "es", name: "Spanish", nativeName: "Español", code: "ES" },
    { id: "fr", name: "French", nativeName: "Français", code: "FR" },
    { id: "de", name: "German", nativeName: "Deutsch", code: "DE" },
    { id: "it", name: "Italian", nativeName: "Italiano", code: "IT" },
    { id: "pt", name: "Portuguese", nativeName: "Português", code: "PT" },
    { id: "ru", name: "Russian", nativeName: "Русский", code: "RU" },
    { id: "zh", name: "Chinese", nativeName: "中文", code: "ZH" },
    { id: "ja", name: "Japanese", nativeName: "日本語", code: "JA" },
    { id: "ko", name: "Korean", nativeName: "한국어", code: "KO" },
    { id: "ar", name: "Arabic", nativeName: "العربية", code: "AR" },
    { id: "hi", name: "Hindi", nativeName: "हिन्दी", code: "HI" },
    { id: "tr", name: "Turkish", nativeName: "Türkçe", code: "TR" },
    { id: "nl", name: "Dutch", nativeName: "Nederlands", code: "NL" },
    { id: "pl", name: "Polish", nativeName: "Polski", code: "PL" },
    { id: "sv", name: "Swedish", nativeName: "Svenska", code: "SV" },
    { id: "da", name: "Danish", nativeName: "Dansk", code: "DA" },
    { id: "no", name: "Norwegian", nativeName: "Norsk", code: "NO" },
    { id: "fi", name: "Finnish", nativeName: "Suomi", code: "FI" },
    { id: "cs", name: "Czech", nativeName: "Čeština", code: "CS" },
    { id: "hu", name: "Hungarian", nativeName: "Magyar", code: "HU" },
    { id: "ro", name: "Romanian", nativeName: "Română", code: "RO" },
    { id: "bg", name: "Bulgarian", nativeName: "Български", code: "BG" },
    { id: "hr", name: "Croatian", nativeName: "Hrvatski", code: "HR" },
    { id: "sk", name: "Slovak", nativeName: "Slovenčina", code: "SK" },
    { id: "sl", name: "Slovenian", nativeName: "Slovenščina", code: "SL" },
    { id: "et", name: "Estonian", nativeName: "Eesti", code: "ET" },
    { id: "lv", name: "Latvian", nativeName: "Latviešu", code: "LV" },
    { id: "lt", name: "Lithuanian", nativeName: "Lietuvių", code: "LT" },
    { id: "mt", name: "Maltese", nativeName: "Malti", code: "MT" },
    { id: "ga", name: "Irish", nativeName: "Gaeilge", code: "GA" },
    { id: "cy", name: "Welsh", nativeName: "Cymraeg", code: "CY" },
    { id: "eu", name: "Basque", nativeName: "Euskara", code: "EU" },
    { id: "ca", name: "Catalan", nativeName: "Català", code: "CA" },
    { id: "gl", name: "Galician", nativeName: "Galego", code: "GL" },
    { id: "is", name: "Icelandic", nativeName: "Íslenska", code: "IS" },
    { id: "mk", name: "Macedonian", nativeName: "Македонски", code: "MK" },
    { id: "sq", name: "Albanian", nativeName: "Shqip", code: "SQ" },
    { id: "sr", name: "Serbian", nativeName: "Српски", code: "SR" },
    { id: "bs", name: "Bosnian", nativeName: "Bosanski", code: "BS" },
    { id: "me", name: "Montenegrin", nativeName: "Crnogorski", code: "ME" },
    { id: "th", name: "Thai", nativeName: "ไทย", code: "TH" },
    { id: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", code: "VI" },
    {
      id: "id",
      name: "Indonesian",
      nativeName: "Bahasa Indonesia",
      code: "ID",
    },
    { id: "ms", name: "Malay", nativeName: "Bahasa Melayu", code: "MS" },
    { id: "tl", name: "Filipino", nativeName: "Filipino", code: "TL" },
    { id: "bn", name: "Bengali", nativeName: "বাংলা", code: "BN" },
    { id: "ur", name: "Urdu", nativeName: "اردو", code: "UR" },
    { id: "fa", name: "Persian", nativeName: "فارسی", code: "FA" },
    { id: "he", name: "Hebrew", nativeName: "עברית", code: "HE" },
    { id: "am", name: "Amharic", nativeName: "አማርኛ", code: "AM" },
    { id: "sw", name: "Swahili", nativeName: "Kiswahili", code: "SW" },
    { id: "zu", name: "Zulu", nativeName: "isiZulu", code: "ZU" },
    { id: "af", name: "Afrikaans", nativeName: "Afrikaans", code: "AF" },
    { id: "xh", name: "Xhosa", nativeName: "isiXhosa", code: "XH" },
    { id: "yo", name: "Yoruba", nativeName: "Yorùbá", code: "YO" },
    { id: "ig", name: "Igbo", nativeName: "Igbo", code: "IG" },
    { id: "ha", name: "Hausa", nativeName: "Hausa", code: "HA" },
    { id: "so", name: "Somali", nativeName: "Soomaali", code: "SO" },
    { id: "rw", name: "Kinyarwanda", nativeName: "Ikinyarwanda", code: "RW" },
    { id: "lg", name: "Luganda", nativeName: "Luganda", code: "LG" },
    { id: "ny", name: "Chichewa", nativeName: "Chichewa", code: "NY" },
    { id: "st", name: "Sesotho", nativeName: "Sesotho", code: "ST" },
    { id: "tn", name: "Setswana", nativeName: "Setswana", code: "TN" },
    { id: "ss", name: "Swati", nativeName: "SiSwati", code: "SS" },
    { id: "ve", name: "Tshivenda", nativeName: "Tshivenda", code: "VE" },
    { id: "ts", name: "Xitsonga", nativeName: "Xitsonga", code: "TS" },
    {
      id: "nr",
      name: "Southern Ndebele",
      nativeName: "isiNdebele",
      code: "NR",
    },
    {
      id: "nd",
      name: "Northern Ndebele",
      nativeName: "isiNdebele",
      code: "ND",
    },
  ];

  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLanguageSelect = async (languageId: string) => {
    setSelectedLanguage(languageId);
    await setAppLanguage(languageId);
    await i18n.changeLanguage(languageId);
  };

  const renderLanguageItem = ({ item }: { item: LanguageOption }) => (
    <TouchableOpacity
      style={[
        styles.languageCard,
        { backgroundColor: theme.card, shadowColor: theme.text },
        selectedLanguage === item.id && styles.languageCardSelected,
      ]}
      onPress={() => handleLanguageSelect(item.id)}
      disabled={loading}
      activeOpacity={0.8}
    >
      <View style={styles.languageTextContainer}>
        <Text style={[styles.languageName, { color: theme.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.languageNative, { color: theme.subtext }]}>
          {item.nativeName}
        </Text>
      </View>
      <View style={styles.checkmarkContainer}>
        {selectedLanguage === item.id ? (
          <MaterialIcons name="check-circle" size={26} color={theme.accent} />
        ) : (
          <MaterialIcons
            name="radio-button-unchecked"
            size={26}
            color={theme.subtext}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Section Header */}
      <Text style={[styles.sectionHeader, { color: theme.text }]}>
        {t("select_language")}
      </Text>

      {/* Search Bar */}
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: theme.card, shadowColor: theme.text },
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={theme.subtext}
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder={t("select_language")}
          placeholderTextColor={theme.subtext}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={theme.subtext} />
          </TouchableOpacity>
        )}
      </View>

      {/* Language List */}
      <FlatList
        data={filteredLanguages}
        renderItem={renderLanguageItem}
        keyExtractor={(item) => item.id}
        style={styles.languageList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.languageListContent}
        extraData={selectedLanguage}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 8,
    marginLeft: 24,
    letterSpacing: 0.2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  languageList: {
    flex: 1,
  },
  languageListContent: {
    paddingBottom: 20,
    paddingHorizontal: 8,
  },
  languageCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    marginVertical: 6,
    marginHorizontal: 8,
    paddingHorizontal: 18,
    paddingVertical: 18,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#eee",
  },
  languageCardSelected: {
    borderColor: "#e53935",
    shadowOpacity: 0.13,
    elevation: 4,
  },
  languageTextContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 2,
  },
  languageNative: {
    fontSize: 14,
    fontWeight: "400",
    opacity: 0.8,
  },
  checkmarkContainer: {
    marginLeft: 18,
  },
});

export default LanguageScreen;
