import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigation from './navigation/appNavigation';

const App = () => {
    return (
        <AuthProvider>
            <AppNavigation />
        </AuthProvider>
    );
};

export default App;
