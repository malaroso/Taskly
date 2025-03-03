import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Image, ActivityIndicator, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar, faSearch, faBars, faCircle, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { getUserTasks } from '../../services/taskService';
import { Task } from '../../types/taskTypes';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getPriorityColor } from '../../utils/taskHelpers';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
    TaskDetail: { taskID: number };
    // ... diğer ekranlar gerekirse eklenir
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TasksScreen = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<NavigationProp>();

    useFocusEffect(
        useCallback(() => {
            const fetchTasks = async () => {
                setLoading(true);
                try {
                    const response = await getUserTasks();
                    if (response.status) {
                        setTasks(response.data);
                    } else {
                        // API başarılı yanıt verdi ama veri yok
                        setTasks([]);
                    }
                } catch (error) {
                    console.error('Error fetching tasks:', error);
                    setTasks([]);
                } finally {
                    setLoading(false);
                }
            };

            fetchTasks();
        }, [])
    );


    const renderTask = ({ item }: { item: Task }) => (
        <TouchableOpacity onPress={() => navigation.navigate('TaskDetail', { taskID: item.task_id })}>
            <View style={[styles.taskContainer, { borderRightColor: getPriorityColor(item.priority) }]}>
                <View style={styles.priorityLabel}>
                    <FontAwesomeIcon icon={faCircle} size={10} color={getPriorityColor(item.priority)} />
                    <Text style={styles.priorityText}>
                        {item.priority === 'high' ? 'High Priority' : item.priority === 'medium' ? 'Medium Priority' : 'Low Priority'}
                    </Text>
                </View>
                <Text style={styles.taskTitle} numberOfLines={1} ellipsizeMode="tail">
                    {item.title}
                </Text>
                <Text style={styles.taskDescription} numberOfLines={2} ellipsizeMode="tail">
                    {item.description}
                </Text>
                <View style={styles.taskUsers}>
                    {item.other_user_images.slice(0, 6).map((user: string, index: number) => (
                        <Image key={index} source={{ uri: user }} style={[styles.userAvatar, { left: index * -12 }]} />
                    ))}
                </View>
                <View style={styles.taskDateContainer}>
                    <FontAwesomeIcon icon={faCalendar} size={16} color="#666" />
                    <Text style={styles.taskDate}>{item.created_at}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <LottieView
                source={require('../../../assets/images/planetr.json')}
                autoPlay
                loop
                style={styles.lottieAnimation}
            />
            <Text style={styles.emptyTitle}>There are no tasks!</Text>
            <Text style={styles.emptySubtitle}>
                Create a new task by clicking the + button in the top right corner
            </Text>
        </View>
    );

    const renderLoading = () => (
        <View style={styles.emptyContainer}>
            <LottieView
                source={require('../../../assets/images/loader.json')}
                autoPlay
                loop
                style={styles.loadingAnimation}
            />
            <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTitleContainer}>
                    <Image source={require('../../../assets/images/taskyl-logo-unbg.png')} style={styles.logo} />
                    <View>
                        <Text style={styles.headerTitle}>Taskly</Text>
                        <Text style={styles.headerTitleSub}>Tasks - Page</Text>
                    </View>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity>
                        <FontAwesomeIcon icon={faSearch} size={20} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <FontAwesomeIcon icon={faBars} size={20} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? renderLoading() : (
                <FlatList
                    style={{ margin: 20, marginBottom: 80 }}
                    data={tasks}
                    renderItem={renderTask}
                    keyExtractor={item => item.task_id.toString()}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmptyList}
                    contentContainerStyle={tasks.length === 0 ? { flex: 1 } : null}
                />
            )}
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
        fontWeight: 'bold',
    },
    logo: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 15,
    },
    taskContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        borderRightWidth: 5, // Right colored border
    },
    priorityLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    priorityText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 5,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    taskDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    taskUsers: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        width: 220,
        overflow: 'hidden',
        marginBottom: 10,
    },
    userAvatar: {
        width: 36,
        height: 36,
        borderRadius: 30,
        left: 0,
        zIndex: 1,
        borderWidth: 2,
        borderColor: '#f0f0f1',
    },
    taskDateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskDate: {
        fontSize: 12,
        color: '#666',
        marginLeft: 5,
    },
    headerTitleSub: {
        fontSize: 12,
        color: '#666',
    },
    clear:{
        height: 100,
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
    loadingText: {
        fontSize: 16,
        fontFamily: 'Montserrat-Medium',
        color: '#666',
        marginTop: 10,
    }
});

export default TasksScreen; 