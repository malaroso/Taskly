import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faLock, faArrowLeft, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import AlertComponent from '../../components/AlertComponent';
import { RootStackParamList } from '../../types/navigation';

const LoginScreen = () => {
    const { onLogin } = useAuth();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertStatus, setAlertStatus] = useState<'success' | 'error' | 'pending'>('pending');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            if (username && password) {
                const result = await onLogin?.(username, password);
                
                if (result?.success) {
                    //Bişey yapmaya gerek yok burda halihazırda context içerisinde durum güncelleniyor.
                    //ve bu güncellemeden sonra botomMenu render oluyor.
                    
                } else {
                    console.log("result mesaj => " ,result?.message);
                    setAlertTitle('Hata');
                    setAlertMessage(result?.message || 'Giriş yapılamadı');
                    setAlertVisible(true);
                    setAlertStatus('error');
                }
            } else {
                setAlertTitle('Uyarı');
                setAlertMessage('Lütfen tüm alanları doldurun!');
                setAlertVisible(true);
                setAlertStatus('pending');
            }
        } catch (error) {
            setAlertTitle('Hata');
            setAlertMessage('Bir hata oluştu');
            setAlertVisible(true);
            setAlertStatus('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container} >
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <FontAwesomeIcon icon={faArrowLeft} size={24} color="#FFF" />
                </TouchableOpacity>

                <View style={styles.logoContainer}>
                    <Image source={require('../../../assets/images/taskyl-logo-unbg.png')} style={styles.logo} />
                    <Text style={styles.logoText}>Taskyl</Text>
                </View>
                <View style={styles.titleContainer}>
                        <Text style={styles.title}>Welcome Back !</Text>
                        <Text style={styles.subtitle}><Text style={{fontWeight: 'bold'}}>Welcome to Taskly </Text>  – Your smart way to track, assign, and complete tasks with ease.</Text>
                </View>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <View style={styles.inputContainer}>
                        <FontAwesomeIcon icon={faUser} size={20} color="#4CAF50" />
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            value={username}
                            onChangeText={setUsername}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <FontAwesomeIcon icon={faLock} size={20} color="#4CAF50" />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry={secureTextEntry}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                            <FontAwesomeIcon icon={secureTextEntry ? faEyeSlash : faEye} size={20} color="#4CAF50" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.loginButtonText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.orText}>OR</Text>

                    <TouchableOpacity style={styles.googleButton}>
                        <Text style={styles.googleButtonText}>Login with Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.signUp}>
                        <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
            <AlertComponent
                visible={alertVisible}
                title={alertTitle}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
                status={alertStatus}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 20,
    },
    scrollView: {
        flexGrow: 1,
        alignItems: 'center',
        width: '100%',
    },
    titleContainer: {
        width: '100%',
        alignItems: 'flex-start',
        marginBottom: 0,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'left',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'left',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        width: '100%',
    },
    logoContainer:{
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 60,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
      
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 0,
        fontFamily: 'Montserrat-Medium',
    },
    logo: {
        width: 64,
        height: 64,
    },
    input: {
        flex: 1,
        marginLeft: 10,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: '#4CAF50',
    },
    loginButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    loginButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        width: 200,
        fontSize: 16,
        textAlign: 'center',
    },
    orText: {
        marginBottom: 20,
        color: '#666',
    },
    googleButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 15,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginBottom: 0,
    },
    googleButtonText: {
        color: '#666',
    },
    signUp: {
        marginTop: 20,
    },
    signUpText: {
        color: '#1E90FF',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 50,
    },
});

export default LoginScreen; 