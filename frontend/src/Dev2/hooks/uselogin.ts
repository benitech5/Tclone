import { useAppDispatch } from '../store/store';
import { login } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLogin = () => {
    const dispatch = useAppDispatch();

    const saveSession = async (token: string, name: string, email: string) => {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('name', name);
        await AsyncStorage.setItem('email', email);
        dispatch(login({ name, email }));
    };

    const logoutUser = async () => {
        await AsyncStorage.clear();
        dispatch({ type: 'auth/logout' });
    };

    return { saveSession, logoutUser };
};
