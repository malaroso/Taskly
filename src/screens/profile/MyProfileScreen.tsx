import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faEnvelope, faPhone, faLocationDot, faCity, faGlobe, faPen } from '@fortawesome/free-solid-svg-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getUserDetail } from '../../services/userService';

const MyProfileScreen = () => {
    const navigation = useNavigation();
    const [userDetail, setUserDetail] = useState<any>(null);

 
    useFocusEffect(
        useCallback(() => {
            const fetchUserDetail = async () => {
                try {
                    const response = await getUserDetail();
                    if (response.status) {
                        setUserDetail(response.data[0]);
                    }
                } catch (error) {
                    console.error('Error fetching user detail:', error);
                }
            };

            fetchUserDetail();
        }, [])
    );


    const handleEdit = () => {
        navigation.navigate('MyProfileEdit', { userDetail });
    };

    if (!userDetail) {
        return null;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesomeIcon icon={faArrowLeft} size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                    <FontAwesomeIcon icon={faPen} size={20} color="#4ECDC4" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.profileSection}>
                    <View style={styles.avatarSection}>
                        <Image 
                            source={{ uri: userDetail.profile_image }} 
                            style={styles.profileImage}
                        />
                        <View style={styles.nameSection}>
                            <Text style={styles.userName}>{userDetail.username}</Text>
                            <Text style={styles.userRole}>{userDetail.role_description}</Text>
                        </View>
                    </View>

                    <View style={styles.infoCard}>
                        <Text style={styles.sectionTitle}>Contact Information</Text>
                        <View style={styles.infoItem}>
                            <FontAwesomeIcon icon={faEnvelope} size={20} color="#666" />
                            <Text style={styles.infoText}>{userDetail.email}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <FontAwesomeIcon icon={faPhone} size={20} color="#666" />
                            <Text style={styles.infoText}>{userDetail.phone_number}</Text>
                        </View>
                    </View>

                    <View style={styles.infoCard}>
                        <Text style={styles.sectionTitle}>Location</Text>
                        <View style={styles.infoItem}>
                            <FontAwesomeIcon icon={faLocationDot} size={20} color="#666" />
                            <Text style={styles.infoText}>{userDetail.address}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <FontAwesomeIcon icon={faCity} size={20} color="#666" />
                            <Text style={styles.infoText}>{userDetail.city}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <FontAwesomeIcon icon={faGlobe} size={20} color="#666" />
                            <Text style={styles.infoText}>{userDetail.country}</Text>
                        </View>
                    </View>

                    <View style={styles.infoCard}>
                        <Text style={styles.sectionTitle}>Permissions</Text>
                        <View style={styles.permissionsContainer}>
                            {userDetail.permissions.split(',').map((permission: string, index: number) => (
                                <View key={index} style={styles.permissionTag}>
                                    <Text style={styles.permissionText}>
                                        {permission.split('_').join(' ')}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
                <View style={styles.clear}></View>
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
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#fff',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Montserrat-Bold',
    },
    editButton: {
        padding: 5,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    profileSection: {
        gap: 20,
    },
    avatarSection: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
    },
    nameSection: {
        alignItems: 'center',
    },
    userName: {
        fontSize: 24,
        fontFamily: 'Montserrat-Bold',
        marginBottom: 5,
    },
    userRole: {
        fontSize: 16,
        color: '#4ECDC4',
        fontFamily: 'Montserrat-Medium',
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        marginBottom: 15,
        color: '#333',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginBottom: 15,
    },
    infoText: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'Montserrat-Regular',
        flex: 1,
    },
    permissionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    permissionTag: {
        backgroundColor: '#f0f0f1',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    permissionText: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'Montserrat-Medium',
        textTransform: 'capitalize',
    },
    clear: {
        height: 40,
    },
});

export default MyProfileScreen; 