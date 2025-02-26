import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faGlobe, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

const APP_VERSION = '1.0.0';
const COMPANY_WEBSITE = 'https://www.yourcompany.com';
const SUPPORT_EMAIL = 'support@yourcompany.com';

const AboutAppScreen = () => {
    const navigation = useNavigation();

    const openWebsite = () => {
        Linking.openURL(COMPANY_WEBSITE);
    };

    const openEmail = () => {
        Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <FontAwesomeIcon icon={faArrowLeft} size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About App</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.logoContainer}>
                    <Image 
                        source={require('../../../assets/images/taskyl-logo-unbg.png')} 
                        style={styles.logo}
                    />
                    <Text style={styles.appName}>Taskly</Text>
                    <Text style={styles.version}>Version {APP_VERSION}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <Text style={styles.description}>
                        Taskly is a powerful task management application designed to help teams collaborate effectively and manage projects efficiently. With features like task tracking, team collaboration, and real-time updates, Taskly makes project management simple and intuitive.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Features</Text>
                    <View style={styles.featuresList}>
                        {[
                            'Task Management',
                            'Team Collaboration',
                            'Real-time Updates',
                            'File Sharing',
                            'Progress Tracking',
                            'Notifications'
                        ].map((feature, index) => (
                            <View key={index} style={styles.featureItem}>
                                <View style={styles.featureDot} />
                                <Text style={styles.featureText}>{feature}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.contactSection}>
                    <TouchableOpacity style={styles.contactButton} onPress={openWebsite}>
                        <FontAwesomeIcon icon={faGlobe} size={20} color="#4ECDC4" />
                        <Text style={styles.contactButtonText}>Visit Website</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.contactButton} onPress={openEmail}>
                        <FontAwesomeIcon icon={faEnvelope} size={20} color="#4ECDC4" />
                        <Text style={styles.contactButtonText}>Contact Support</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.copyright}>
                    © 2024 Your Company. All rights reserved.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f1',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Montserrat-Bold',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginVertical: 30,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 15,
    },
    appName: {
        fontSize: 24,
        fontFamily: 'Montserrat-Bold',
        marginBottom: 5,
    },
    version: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Montserrat-Regular',
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        marginBottom: 15,
    },
    description: {
        fontSize: 14,
        lineHeight: 24,
        color: '#666',
        fontFamily: 'Montserrat-Regular',
    },
    featuresList: {
        gap: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    featureDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4ECDC4',
        marginRight: 12,
    },
    featureText: {
        fontSize: 14,
        color: '#333',
        fontFamily: 'Montserrat-Medium',
    },
    contactSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    contactButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginHorizontal: 5,
        gap: 8,
    },
    contactButtonText: {
        fontSize: 14,
        color: '#333',
        fontFamily: 'Montserrat-Medium',
    },
    copyright: {
        textAlign: 'center',
        fontSize: 12,
        color: '#666',
        fontFamily: 'Montserrat-Regular',
        marginBottom: 20,
    },
});

export default AboutAppScreen;
