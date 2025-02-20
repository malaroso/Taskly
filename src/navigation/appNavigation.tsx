import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import HomeScreen from '../screens/HomeScreen'; // Örnek bir ekran
import DetailsScreen from '../screens/DetailsScreen'; // Örnek bir ekran
import { useAuth } from '../context/AuthContext';
const Stack = createStackNavigator();

const AppNavigation = () => {
    const { authState } = useAuth();
    console.log('authState', authState);
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
                {!authState?.authenticated ? (
                    <>
                        <Stack.Screen name="Welcome" component={WelcomeScreen} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Details" component={DetailsScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigation; 