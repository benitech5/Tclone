import { ImageSourcePropType } from 'react-native';

export interface Contact {
    id: string;
    name: string;
    status: string;
    avatar: ImageSourcePropType;
}

export const contactsData: Contact[] = [
    {
        id: '1',
        name: 'Alice Smith',
        status: 'online',
        avatar: require('../assets/avatars/user1.png'),
    },
    {
        id: '2',
        name: 'Bob Johnson',
        status: 'last seen 1 hour ago',
        avatar: require('../assets/avatars/user2.png'),
    },
    // Add more contacts as needed
];