import React from 'react';
import { FlatList, StyleSheet, Text, View, Image, ImageSourcePropType } from 'react-native';

// Type definition for our contact
type Contact = {
    id: string;
    name: string;
    status: string;
};

// Mock contact data with proper typing
const mockContacts: Contact[] = [
    {
        id: '1',
        name: 'Alice Smith',
        status: 'online',
    },
    {
        id: '2',
        name: 'Bob Johnson',
        status: 'last seen 1 hour ago',
    },
];

// Main component
const ContactsScreen: React.FC = () => {
    // Properly typed renderItem function
    const renderItem = ({ item }: { item: Contact }) => (
        <View style={styles.contactItem}>
            <View style={styles.contactInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.status}>{item.status}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={mockContacts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

// Stylesheet with proper typing
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    contactItem: {
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    contactInfo: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    status: {
        fontSize: 14,
        color: '#888',
        marginTop: 3,
    },
});

export default ContactsScreen;