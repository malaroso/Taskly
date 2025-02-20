import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
import AppNavigation from './src/navigation/appNavigation';
import { AuthProvider } from './src/context/AuthContext';

const fetchFonts = () => {
    return Font.loadAsync({
      'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
      'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
      'Montserrat-Thin': require('./assets/fonts/Montserrat-Thin.ttf'),
    });
};

const App = () => {
    const [fontsLoaded] = useFonts({
      'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
      'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
      'Montserrat-Thin': require('./assets/fonts/Montserrat-Thin.ttf'),
    });

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <AuthProvider>
            <AppNavigation />
        </AuthProvider>
    );
};

export default App;
