import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLock, faQuestionCircle, faSignOut, faChevronRight, faTasks, faUser, faBell, faHistory, faPalette, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import CustomModal from '../../components/CustomModal';
import { getUserDetail } from '../../services/userService';
import { UserDetailData } from '../../types/userTypes';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';


const ProfileScreen = () => {
    const [logoutModalVisible, setLogoutModalVisible] = React.useState(false);
    const { onLogout } = useAuth();
    const [userDetail, setUserDetail] = React.useState<UserDetailData | null>(null);
    const navigation = useNavigation<RootStackParamList>();

    const userMenuItems = [
        { icon: faUser, title: 'My Profile' },
        { icon: faTasks, title: 'My Tasks' },
        { icon: faBell, title: 'Notifications', route: 'Notification' },
        { icon: faHistory, title: 'Activity History' },
    ];
    
    const menuItems = [
        { icon: faLock, title: 'Password settings' },
        { icon: faPalette, title: 'Theme' },
        { icon: faQuestionCircle, title: 'FAQ/Support', route: 'FAQ' },
        { icon: faInfoCircle, title: 'About App', route: 'AboutApp' },
    ];

    useEffect(() => {
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
    }, []);

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
                <View style={styles.profileCard}>
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            <Text style={styles.avatarText}>
                                {userDetail?.username.split(' ').map(n => n[0]).join('')}
                            </Text>
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

                    <TouchableOpacity   style={[styles.menuItem, styles.logoutButton]} onPress={() => setLogoutModalVisible(true)}>
                        <View style={styles.menuItemLeft}>
                            <FontAwesomeIcon icon={faSignOut} size={20} color="#FF6B6B" />
                            <Text style={[styles.menuItemText, styles.logoutText]}>Log out</Text>
                        </View>
                        <FontAwesomeIcon icon={faChevronRight} size={16} color="#FF6B6B" />
                    </TouchableOpacity>
                </View>
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
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4ECDC4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatarText: {
        color: '#fff',
        fontSize: 24,
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
});

export default ProfileScreen;