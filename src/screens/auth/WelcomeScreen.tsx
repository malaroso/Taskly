import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSquareArrowUpRight } from '@fortawesome/free-solid-svg-icons';
import { RootStackParamList } from '../../types/navigation';

type WelcomeScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.companyNameContainer}> 
                <Image source={require('../../../assets/images/taskyl-logo-unbg.png')} style={styles.logoImage} />
                <Text style={styles.companyName}>Taskly</Text>
            </View>

            <Image source={require('../../../assets/images/agency.png')} style={styles.image} />

            <Text style={styles.title}>Stay Organized, Stay Productive!</Text>
            <Text style={styles.subtitle}>
                 Effortlessly manage your tasks, assign jobs, and track progress in one place.
         
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>Get Started</Text>
                <FontAwesomeIcon icon={faSquareArrowUpRight} size={20} color="#FFF" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 20,
    },
    companyNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: 50,
        left: 20,
    },
    logoImage: {
        width: 60,
        height: 60,
        marginRight: 0,
    },
    companyName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: 'Montserrat-Bold',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 30,
        fontFamily: 'Montserrat-Medium',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 20,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        justifyContent: 'center',
        position: 'absolute',
        bottom: 30,
        right: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Montserrat-Medium',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default WelcomeScreen; 