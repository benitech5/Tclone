import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppSelector } from '../../store/store';

type SearchNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, 'Search'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface SearchScreenProps {
  navigation: SearchNavigationProp;
}

interface SearchResult {
  id: string;
  type: 'chat' | 'message' | 'contact' | 'file';
  title: string;
  subtitle: string;
  preview?: string;
  timestamp?: Date;
  avatar?: string;
  chatId?: string;
  messageId?: string;
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    type: 'chat',
    title: 'John Doe',
    subtitle: 'Last message: Hey, how are you?',
    preview: 'Hey, how are you?',
    timestamp: new Date(Date.now() - 3600000),
    chatId: 'chat1',
  },
  {
    id: '2',
    type: 'message',
    title: 'Meeting tomorrow',
    subtitle: 'From: Jane Smith',
    preview: 'Let\'s have a meeting tomorrow at 2 PM to discuss the project progress.',
    timestamp: new Date(Date.now() - 7200000),
    chatId: 'chat2',
    messageId: 'msg1',
  },
  {
    id: '3',
    type: 'contact',
    title: 'Mike Johnson',
    subtitle: '+1234567890',
    chatId: 'chat3',
  },
  {
    id: '4',
    type: 'file',
    title: 'Project_Report.pdf',
    subtitle: 'Shared by: Sarah Wilson',
    timestamp: new Date(Date.now() - 10800000),
    chatId: 'chat4',
  },
  {
    id: '5',
    type: 'message',
    title: 'Project deadline',
    subtitle: 'From: Alex Brown',
    preview: 'The project deadline has been extended to next Friday.',
    timestamp: new Date(Date.now() - 14400000),
    chatId: 'chat5',
    messageId: 'msg2',
  },
];

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const searchInputRef = useRef<TextInput>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'chats' | 'messages' | 'contacts' | 'files'>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>(['meeting', 'project', 'john']);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Search',
      headerStyle: {
        backgroundColor: theme.background,
      },
      headerTintColor: theme.text,
      headerRight: () => (
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={clearSearch}
        >
          <Text style={[styles.clearButton, { color: theme.primary }]}>
            Clear
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme]);

  useEffect(() => {
    // Auto-focus search input
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  }, []);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`http://192.168.96.216:8082/api/search/global`, {
        params: { query, currentUserId: user?.id },
        headers: { Authorization: `Bearer ${token}` }
      });
      // Flatten and format results as needed for UI
      const results = [];
      if (response.data.chats) {
        results.push(...response.data.chats.map(chat => ({ type: 'chat', ...chat })));
      }
      if (response.data.messages) {
        results.push(...response.data.messages.map(msg => ({ type: 'message', ...msg })));
      }
      if (response.data.users) {
        results.push(...response.data.users.map(user => ({ type: 'contact', ...user })));
      }
      setSearchResults(results);
    } catch (e) {
      setSearchResults([]);
    }
    setIsSearching(false);
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (text.trim()) {
      performSearch(text);
    } else {
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    searchInputRef.current?.focus();
  };

  const addToRecentSearches = (query: string) => {
    if (!recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }
  };

  const handleResultPress = (result: SearchResult) => {
    addToRecentSearches(searchQuery);
    
    switch (result.type) {
      case 'chat':
        navigation.navigate('ChatRoom', { 
          chatId: result.chatId!, 
          chatName: result.title 
        });
        break;
      case 'message':
        navigation.navigate('ChatRoom', { 
          chatId: result.chatId!, 
          chatName: result.subtitle.replace('From: ', '') 
        });
        // TODO: Scroll to specific message
        break;
      case 'contact':
        navigation.navigate('ContactProfile', { contactId: result.id });
        break;
      case 'file':
        navigation.navigate('MediaGallery', { 
          chatId: result.chatId!, 
          chatName: result.subtitle.replace('Shared by: ', '') 
        });
        break;
    }
  };

  const handleRecentSearchPress = (query: string) => {
    setSearchQuery(query);
    performSearch(query);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'chat':
        return { name: 'chatbubble', color: theme.primary };
      case 'message':
        return { name: 'document-text', color: theme.primary };
      case 'contact':
        return { name: 'person', color: theme.primary };
      case 'file':
        return { name: 'document', color: theme.primary };
      default:
        return { name: 'search', color: theme.subtext };
    }
  };

  const renderSearchFilters = () => (
    <View style={styles.filtersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[
          { key: 'all', label: 'All' },
          { key: 'chats', label: 'Chats' },
          { key: 'messages', label: 'Messages' },
          { key: 'contacts', label: 'Contacts' },
          { key: 'files', label: 'Files' },
        ].map(filter => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              { 
                backgroundColor: activeFilter === filter.key ? theme.primary : theme.card,
                borderColor: theme.border 
              }
            ]}
            onPress={() => setActiveFilter(filter.key as any)}
          >
            <Text style={[
              styles.filterText,
              { color: activeFilter === filter.key ? '#fff' : theme.text }
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderSearchResult = ({ item }: { item: SearchResult }) => {
    const { name: iconName, color: iconColor } = getResultIcon(item.type);
    
    return (
      <TouchableOpacity
        style={[styles.resultItem, { backgroundColor: theme.card }]}
        onPress={() => handleResultPress(item)}
      >
        <View style={[styles.resultIcon, { backgroundColor: theme.background }]}>
          <Icon name={iconName} size={20} color={iconColor} />
        </View>
        
        <View style={styles.resultContent}>
          <Text style={[styles.resultTitle, { color: theme.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.resultSubtitle, { color: theme.subtext }]}>
            {item.subtitle}
          </Text>
          {item.preview && (
            <Text style={[styles.resultPreview, { color: theme.subtext }]} numberOfLines={2}>
              {item.preview}
            </Text>
          )}
        </View>
        
        {item.timestamp && (
          <Text style={[styles.resultTime, { color: theme.subtext }]}>
            {item.timestamp.toLocaleDateString()}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderRecentSearches = () => (
    <View style={styles.recentContainer}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Recent Searches
      </Text>
      <View style={styles.recentList}>
        {recentSearches.map((query, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.recentItem, { backgroundColor: theme.card }]}
            onPress={() => handleRecentSearchPress(query)}
          >
            <Icon name="time" size={16} color={theme.subtext} />
            <Text style={[styles.recentText, { color: theme.text }]}>
              {query}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="search" size={64} color={theme.subtext} />
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        {searchQuery ? 'No results found' : 'Search for anything'}
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.subtext }]}>
        {searchQuery 
          ? 'Try different keywords or check your spelling'
          : 'Search for chats, messages, contacts, or files'
        }
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Search Input */}
      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <Icon name="search" size={20} color={theme.subtext} style={styles.searchIcon} />
        <TextInput
          ref={searchInputRef}
          style={[styles.searchInput, { color: theme.text }]}
          value={searchQuery}
          onChangeText={handleSearchChange}
          placeholder="Search for anything..."
          placeholderTextColor={theme.subtext}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
            <Icon name="close-circle" size={20} color={theme.subtext} />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Filters */}
      {searchQuery.length > 0 && renderSearchFilters()}

      {/* Search Results or Recent Searches */}
      {searchQuery.length > 0 ? (
        isSearching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.subtext }]}>
              Searching...
            </Text>
          </View>
        ) : searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderSearchResult}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.resultsList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          renderEmptyState()
        )
      ) : (
        renderRecentSearches()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    padding: 8,
  },
  clearButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  clearIcon: {
    marginLeft: 8,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  resultsList: {
    paddingHorizontal: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  resultSubtitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  resultPreview: {
    fontSize: 13,
    lineHeight: 18,
  },
  resultTime: {
    fontSize: 12,
    marginLeft: 8,
  },
  recentContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  recentList: {
    gap: 8,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  recentText: {
    fontSize: 16,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default SearchScreen; 