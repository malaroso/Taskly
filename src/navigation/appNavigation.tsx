import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import { useAuth } from '../context/AuthContext';
import BottomMenuNavigation from './bottomMenuNavigation';
import TaskDetailScreen from '../screens/TaskDetailScreen';

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
                        <Stack.Screen name="Main" component={BottomMenuNavigation} />
                        <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigation; 