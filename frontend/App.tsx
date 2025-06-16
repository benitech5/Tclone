// App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/Dev 2/store/store';
import RootNavigator from './src/Dev 2/navigation/RootNavigator';

export default function App() {
    return (
        <Provider store={store}>
            <RootNavigator />
        </Provider>
    );
}
