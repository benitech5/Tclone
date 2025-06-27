// App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/Dev2/store/store';
import { AuthProvider } from './src/Dev2/store/AuthContext';
import RootNavigator from './src/Dev2/navigation/RootNavigator';

export default function App() {
    return (
        <Provider store={store}>
            <AuthProvider>
                <RootNavigator />
            </AuthProvider>
        </Provider>
    );
}
