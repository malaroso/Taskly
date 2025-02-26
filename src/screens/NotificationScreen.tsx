import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCircle, faCheckCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getNotifications, markNotificationAsRead, deleteNotification, getUnreadCount } from '../services/notificationService';
import { Notification } from '../types/notificationTypes';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const NotificationScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getNotifications();
            
            if (response.status) {
                setNotifications(response.data);
            } else {
                setError(response.message || 'Bir hata oluştu');
            }
        } catch (error) {
            setError('Bildirimleri yüklerken bir hata oluştu');
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notification_id: number) => {
        try {
            const response = await markNotificationAsRead(notification_id);
            if (response.status) {
                setNotifications(notifications.map(notif => 
                    notif.notification_id === notification_id 
                        ? { ...notif, is_read: 1 }
                        : notif
                ));
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleDelete = async (notification_id: number) => {
        try {
            const response = await deleteNotification(notification_id);
            if (response.status) {
                // Bildirimi listeden kaldır
                setNotifications(notifications.filter(
                    notif => notif.notification_id !== notification_id
                ));
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high': return '#FF6B6B';
            case 'medium': return '#FFA500';
            case 'low': return '#4ECDC4';
            default: return '#666';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderNotification = ({ item }: { item: Notification }) => (
        <TouchableOpacity 
            style={[styles.notificationItem]}
            onPress={() => {/* Navigate to notification detail */}}
        >
            <TouchableOpacity 
                style={[styles.readIndicator, { backgroundColor: item.is_read ? '#4ECDC4' : '#FF6B6B' }]}
                onPress={() => !item.is_read && handleMarkAsRead(item.notification_id)}
            >
                <FontAwesomeIcon 
                    icon={item.is_read ? faCheckCircle : faCircle} 
                    size={16} 
                    color="#fff" 
                />
            </TouchableOpacity>
            <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                    <Text style={styles.notificationTitle}>{item.title}</Text>
                    <View style={styles.headerActions}>
                        <View style={styles.badges}>
                            <View style={[styles.badge, { backgroundColor: getPriorityColor(item.priority) }]}>
                                <Text style={styles.badgeText}>
                                    {item.priority.toUpperCase()}
                                </Text>
                            </View>
                            <View style={[styles.badge, { backgroundColor: item.is_read ? '#4ECDC4' : '#FF6B6B' }]}>
                                <Text style={styles.badgeText}>
                                    {item.is_read ? 'OKUNDU' : 'OKUNMADI'}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity 
                            style={styles.deleteButton}
                            onPress={() => handleDelete(item.notification_id)}
                        >
                            <FontAwesomeIcon icon={faTrash} size={16} color="#FF6B6B" />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.notificationMessage}>{item.message}</Text>
                <Text style={styles.notificationTime}>{formatDate(item.created_at)}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderContent = () => {
        if (loading) {
            return (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#4ECDC4" />
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchNotifications}>
                        <Text style={styles.retryButtonText}>Tekrar Dene</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={item => item.notification_id.toString()}
                contentContainerStyle={styles.notificationsList}
                ListEmptyComponent={
                    <View style={styles.centerContainer}>
                        <Text style={styles.emptyText}>Bildirim bulunmamaktadır</Text>
                    </View>
                }
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <FontAwesomeIcon icon={faArrowLeft} size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 24 }} />
            </View>

            {renderContent()}
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
    notificationsList: {
        padding: 15,
    },
    notificationItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 10,
        overflow: 'hidden',
    },
    unreadItem: {
        backgroundColor: '#fff',
        borderLeftWidth: 4,
        borderLeftColor: '#4ECDC4',
    },
    priorityIndicator: {
        width: 4,
        backgroundColor: '#4ECDC4',
    },
    notificationContent: {
        flex: 1,
        padding: 15,
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    notificationTitle: {
        fontSize: 16,
        fontFamily: 'Montserrat-Medium',
        flex: 1,
        marginRight: 8,
    },
    badges: {
        flexDirection: 'row',
        gap: 6,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        minWidth: 60,
        alignItems: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontFamily: 'Montserrat-Medium',
    },
    notificationMessage: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Montserrat-Regular',
        marginBottom: 8,
    },
    notificationTime: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'Montserrat-Regular',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#FF6B6B',
        textAlign: 'center',
        fontFamily: 'Montserrat-Medium',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#4ECDC4',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Montserrat-Medium',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        fontFamily: 'Montserrat-Medium',
    },
    readIndicator: {
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    deleteButton: {
        padding: 4,
    },
});

export default NotificationScreen;
