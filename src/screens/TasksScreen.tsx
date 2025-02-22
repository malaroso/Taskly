import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar, faSearch, faBars, faCircle } from '@fortawesome/free-solid-svg-icons';
import { getUserTasks } from '../services/taskService';
import { Task } from '../types/taskTypes';
import { useNavigation } from '@react-navigation/native';

const TasksScreen = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await getUserTasks();
                if (response.status) {
                    setTasks(response.data);
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, []);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return '#FF6347'; // Red
            case 'medium':
                return '#FFA500'; // Orange
            case 'low':
                return '#4CAF50'; // Green
            default:
                return '#ccc'; // Default color
        }
    };

    const renderTask = ({ item }: { item: Task }) => (
        <TouchableOpacity onPress={() => navigation.navigate('TaskDetail', { taskID: item.task_id })}>
            <View style={[styles.taskContainer, { borderRightColor: getPriorityColor(item.priority) }]}>
                <View style={styles.priorityLabel}>
                    <FontAwesomeIcon icon={faCircle} size={10} color={getPriorityColor(item.priority)} />
                    <Text style={styles.priorityText}>
                        {item.priority === 'high' ? 'High Priority' : item.priority === 'medium' ? 'Medium Priority' : 'Low Priority'}
                    </Text>
                </View>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskDescription}>{item.description}</Text>
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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTitleContainer}>
                    <Image source={require('../../assets/images/taskyl-logo-unbg.png')} style={styles.logo} />
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

            <FlatList
                style={{ margin: 20 }}
                data={tasks}
                renderItem={renderTask}
                keyExtractor={item => item.task_id.toString()}
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
});

export default TasksScreen; 