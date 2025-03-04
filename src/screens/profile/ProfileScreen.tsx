import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLock, faQuestionCircle, faSignOut, faChevronRight, faTasks, faUser, faBell, faHistory, faPalette, faInfoCircle, faExclamationTriangle, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import CustomModal from '../../components/CustomModal';
import { getUserDetail } from '../../services/userService';
import { UserDetailData } from '../../types/userTypes';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const ProfileScreen = () => {
    const [logoutModalVisible, setLogoutModalVisible] = React.useState(false);
    const { onLogout } = useAuth();
    const [userDetail, setUserDetail] = React.useState<UserDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigation = useNavigation<RootStackParamList>();

    const userMenuItems = [
        { icon: faUser, title: 'My Profile details', route: 'MyProfile' },
        { icon: faTasks, title: 'My Tasks', route: 'Tasks' },
        { icon: faBell, title: 'Notifications', route: 'Notification' },
        { icon: faHistory, title: 'Activity History' },
    ];
    
    const menuItems = [
        { icon: faLock, title: 'Password settings', route: 'PasswordSettings' },
        { icon: faPalette, title: 'Theme' },
        { icon: faQuestionCircle, title: 'FAQ/Support', route: 'FAQ' },
        { icon: faInfoCircle, title: 'About App', route: 'AboutApp' },
    ];

    const fetchUserDetail = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getUserDetail();
            if (response.status) {
                setUserDetail(response.data[0]);
            }
        } catch (error: any) {
            console.error('Error fetching user detail:', error);
            setError(error.message || "Bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchUserDetail();
        }, [])
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <View style={styles.emptyContainer}>
                    <LottieView
                        source={require('../../../assets/images/loader.json')}
                        autoPlay
                        loop
                        style={styles.lottieAnimation}
                    />
                    <Text style={styles.emptyTitle}>Loading...</Text>
                    <Text style={styles.emptySubtitle}>
                        Please wait while we load your profile details
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <View style={styles.errorContainer}>
                    <FontAwesomeIcon icon={faExclamationTriangle} size={60} color="#FF6B6B" />
                    <Text style={styles.errorTitle}>Bağlantı Hatası</Text>
                    <Text style={styles.errorMessage}>{error}</Text>
                    <TouchableOpacity 
                        style={styles.retryButton}
                        onPress={fetchUserDetail}
                    >
                        <FontAwesomeIcon icon={faRefresh} size={16} color="#fff" style={styles.retryIcon} />
                        <Text style={styles.retryButtonText}>Yeniden Dene</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTitleContainer}>
                    <Image source={require('../../../assets/images/taskyl-logo-unbg.png')} style={styles.logo} />
                    <View>
                        <Text style={styles.headerTitle}>Taskly</Text>
                        <Text style={styles.headerTitleSub}>Profile - Page</Text>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content}>
                {userDetail ? (
                    <>
                        <View style={styles.profileCard}>
                            <View style={styles.profileHeader}>
                                <View style={styles.avatarContainer}>
                                    {userDetail?.profile_image ? (
                                        <Image 
                                            source={{ uri: userDetail.profile_image }} 
                                            style={styles.avatarImage}
                                        />
                                    ) : (
                                        <Text style={styles.avatarText}>
                                            {userDetail?.username.split(' ').map(n => n[0]).join('')}
                                        </Text>
                                    )}
                                </View>
                                <View style={styles.profileInfo}>
                                    <Text style={styles.userName}>{userDetail?.username}</Text>
                                    <Text style={styles.userRole}>{userDetail?.role_description}</Text>
                                    <Text style={styles.userEmail}>{userDetail?.email}</Text>
                                </View>
                            </View>
                            <View style={styles.permissionsContainer}>
                                {userDetail?.permissions.split(',').map((permission, index) => (
                                    <View key={index} style={styles.permissionTag}>
                                        <Text style={styles.permissionText}>
                                            {permission.split('_').join(' ')}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <Text style={styles.sectionTitle}>Profile</Text>
                        <View style={styles.menuContainer}>
                            {userMenuItems.map((item, index) => (
                                <TouchableOpacity key={index} style={styles.menuItem} onPress={() => item.route && navigation.navigate(item.route)}>
                                    <View style={styles.menuItemLeft}>
                                        <FontAwesomeIcon icon={item.icon} size={20} color="#666" />
                                        <Text style={styles.menuItemText}>{item.title}</Text>
                                    </View>
                                    <FontAwesomeIcon icon={faChevronRight} size={16} color="#666" />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={styles.sectionTitle}>Other settings</Text>
                        <View style={styles.menuContainer}>
                            {menuItems.map((item, index) => (
                                <TouchableOpacity 
                                    key={index} 
                                    style={styles.menuItem}
                                    onPress={() => item.route && navigation.navigate(item.route)}
                                >
                                    <View style={styles.menuItemLeft}>
                                        <FontAwesomeIcon icon={item.icon} size={20} color="#666" />
                                        <Text style={styles.menuItemText}>{item.title}</Text>
                                    </View>
                                    <FontAwesomeIcon icon={faChevronRight} size={16} color="#666" />
                                </TouchableOpacity>
                            ))}

                            <TouchableOpacity style={[styles.menuItem, styles.logoutButton]} onPress={() => setLogoutModalVisible(true)}>
                                <View style={styles.menuItemLeft}>
                                    <FontAwesomeIcon icon={faSignOut} size={20} color="#FF6B6B" />
                                    <Text style={[styles.menuItemText, styles.logoutText]}>Log out</Text>
                                </View>
                                <FontAwesomeIcon icon={faChevronRight} size={16} color="#FF6B6B" />
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <View style={styles.noDataContainer}>
                        <FontAwesomeIcon icon={faUser} size={60} color="#ccc" />
                        <Text style={styles.noDataText}>Kullanıcı bilgileri bulunamadı</Text>
                        <TouchableOpacity 
                            style={styles.refreshButton}
                            onPress={fetchUserDetail}
                        >
                            <Text style={styles.refreshButtonText}>Yenile</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <View style={styles.clear}></View>
            </ScrollView>

            <CustomModal 
                visible={logoutModalVisible}
                title="Logout"
                message="Are you sure you want to logout?"
                onConfirm={() => {
                    setLogoutModalVisible(false);
                    onLogout?.();
                }}
                onCancel={() => setLogoutModalVisible(false)}
            />
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
        backgroundColor: '#fff',
        padding: 20,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'Montserrat-Bold',
    },
    logo: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    headerTitleSub: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'Montserrat-Regular',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontFamily: 'Montserrat-Medium',
        marginBottom: 10,
        marginTop: 20,
    },
    menuContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f1',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuItemText: {
        fontSize: 16,
        fontFamily: 'Montserrat-Medium',
        color: '#333',
    },
    logoutButton: {
        borderBottomWidth: 0,
    },
    logoutText: {
        color: '#FF6B6B',
    },
    clear: {
        height: 120,
    },
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 10,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#4ECDC4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    avatarText: {
        fontSize: 28,
        color: '#fff',
        fontFamily: 'Montserrat-Bold',
    },
    profileInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        marginBottom: 4,
    },
    userRole: {
        fontSize: 14,
        color: '#4ECDC4',
        fontFamily: 'Montserrat-Medium',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Montserrat-Regular',
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f1',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        fontFamily: 'Montserrat-Medium',
        color: '#666',
    },
    noDataContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
    },
    noDataText: {
        fontSize: 16,
        fontFamily: 'Montserrat-Medium',
        color: '#666',
        marginTop: 15,
        marginBottom: 15,
    },
    refreshButton: {
        backgroundColor: '#4ECDC4',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    refreshButtonText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Montserrat-Medium',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        marginTop: -100,
        alignItems: 'center',
        padding: 20,
    },
    lottieAnimation: {
        width: width * 0.7,
        height: width * 0.7,
    },
    loadingAnimation: {
        width: width * 0.5,
        height: width * 0.5,
    },
    emptyTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        color: '#333',
        marginTop: -20,
        marginBottom: 10,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        color: '#666',
        textAlign: 'center',
        maxWidth: '80%',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorTitle: {
        fontSize: 22,
        fontFamily: 'Montserrat-Bold',
        color: '#333',
        marginTop: 15,
        marginBottom: 10,
    },
    errorMessage: {
        fontSize: 16,
        fontFamily: 'Montserrat-Regular',
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        maxWidth: '90%',
    },
    retryButton: {
        flexDirection: 'row',
        backgroundColor: '#4ECDC4',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Montserrat-Medium',
    },
    retryIcon: {
        marginRight: 8,
    },
});

export default ProfileScreen;