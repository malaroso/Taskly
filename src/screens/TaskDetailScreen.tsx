import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, SafeAreaView, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { getTaskDetail, getTaskAttachments, getTaskComments } from '../services/taskService';
import { TaskDetail, TaskComment } from '../types/taskTypes';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import { faArrowLeft, faShareAlt, faComment, faListDots, faMagnifyingGlass, faCalendar, faClock, faEdit, faFile, faDownload } from '@fortawesome/free-solid-svg-icons';

type TaskDetailScreenRouteProp = RouteProp<{ params: { taskID: number } }, 'params'>;

const getStatusColor = (status: string) => {
    switch (status) {
        case 'in_progress':
            return '#4ECDC4';  // Turkuaz
        case 'completed':
            return '#59CD90';  // Yeşil
        case 'pending':
            return '#FFB01F';  // Turuncu
        default:
            return '#FF6B6B';  // Kırmızı
    }
};

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'low':
            return '#4ECDC4';  // Turkuaz
        case 'medium':
            return '#FFB01F';  // Turuncu
        case 'high':
            return '#FF6B6B';  // Kırmızı
        default:
            return '#666';
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'in_progress':
            return 'In Progress';
        case 'completed':
            return 'Completed';
        case 'pending':
            return 'Pending';
        default:
            return status;
    }
};

const getPriorityText = (priority: string) => {
    switch (priority) {
        case 'low':
            return 'Low';
        case 'medium':
            return 'Medium';
        case 'high':
            return 'High';
        default:
            return priority;
    }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const isImageFile = (filePath: string) => {
    if (filePath.includes('encrypted-tbn0.gstatic.com')) {
        return true;
    }
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const extension = filePath.toLowerCase().substring(filePath.lastIndexOf('.'));
    return imageExtensions.includes(extension);
};

const TaskDetailScreen = () => {
    const route = useRoute<TaskDetailScreenRouteProp>();
    const navigation = useNavigation();
    const { taskID } = route.params;
    const [taskDetail, setTaskDetail] = useState<TaskDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'attachments' | 'comments'>('attachments');
    const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
    const [loadingAttachments, setLoadingAttachments] = useState(false);
    const [comments, setComments] = useState<TaskComment[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);

    useEffect(() => {
        const fetchTaskDetail = async () => {
            try {
                const response = await getTaskDetail(taskID);
                if (response.status) {
                    setTaskDetail(response.data);
                }
            } catch (error) {
                console.error('Error fetching task detail:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTaskDetail();
    }, [taskID]);

    useEffect(() => {
        const fetchAttachments = async () => {
            if (activeTab === 'attachments') {
                setLoadingAttachments(true);
                try {
                    console.log("consol => " , taskID);
                    const response = await getTaskAttachments(taskID);
                    if (response.status) {
                        setAttachments(response.data);
                        console.log(response.data);
                    }
                } catch (error) {
                    console.error('Error fetching attachments:', error);
                } finally {
                    setLoadingAttachments(false);
                }
            }
        };

        fetchAttachments();
    }, [taskID, activeTab]);

    useEffect(() => {
        const fetchComments = async () => {
            if (activeTab === 'comments') {
                setLoadingComments(true);
                try {
                    const response = await getTaskComments(taskID);
                    if (response.status) {
                        setComments(response.data);
                    }
                } catch (error) {
                    console.error('Error fetching comments:', error);
                } finally {
                    setLoadingComments(false);
                }
            }
        };

        fetchComments();
    }, [taskID, activeTab]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!taskDetail) {
        return <Text>Error loading task details.</Text>;
    }

    const teamMembers = JSON.parse(taskDetail.assigned_users).map((user: any) => ({
        id: user.user_id,
        image: user.profile_image,
        username: user.username
    }));

    const renderAttachments = () => {
        if (loadingAttachments) {
            return (
                <View style={styles.placeholderContent}>
                    <ActivityIndicator color="#4ECDC4" />
                </View>
            );
        }

        if (attachments.length === 0) {
            return (
                <View style={styles.placeholderContent}>
                    <Text style={styles.placeholderText}>No attachments yet</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={attachments}
                keyExtractor={(item, index) => `${item.file_path}-${index}`}
                renderItem={({ item }) => (
                    <View style={styles.attachmentItem}>
                        {isImageFile(item.file_path) ? (
                            <Image 
                                source={{ uri: item.file_path }} 
                                style={styles.attachmentImage}
                                resizeMode="contain"
                            />
                        ) : (
                            <View style={styles.attachmentHeader}>
                                <FontAwesomeIcon icon={faFile} size={20} color="#4ECDC4" />
                                <Text style={styles.fileName}>
                                    {item.file_path.split('/').pop()}
                                </Text>
                            </View>
                        )}
                        <View style={styles.attachmentContent}>
                            <Text style={styles.attachmentDescription}>{item.description}</Text>
                            <View style={styles.attachmentFooter}>
                                <Text style={styles.uploadInfo}>
                                    Uploaded by {item.uploaded_by_name}
                                </Text>
                                <Text style={styles.uploadDate}>
                                    {formatDate(item.created_at)}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
                contentContainerStyle={styles.attachmentsList}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
            />
        );
    };

    const renderComments = () => {
        if (loadingComments) {
            return (
                <View style={styles.placeholderContent}>
                    <ActivityIndicator color="#4ECDC4" />
                </View>
            );
        }

        if (comments.length === 0) {
            return (
                <View style={styles.placeholderContent}>
                    <Text style={styles.placeholderText}>No comments yet</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={comments}
                keyExtractor={(item, index) => `${item.user_id}-${index}`}
                renderItem={({ item }) => (
                    <View style={styles.commentItem}>
                        <View style={styles.commentHeader}>
                            <Image 
                                source={{ uri: item.user_profile_image }} 
                                style={styles.commentUserImage} 
                            />
                            <View style={styles.commentUserInfo}>
                                <Text style={styles.commentUserName}>{item.user_name}</Text>
                                <Text style={styles.commentDate}>
                                    {formatDate(item.created_at)}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.commentText}>{item.comment}</Text>
                    </View>
                )}
                contentContainerStyle={styles.commentsList}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <FontAwesomeIcon icon={faArrowLeft} size={24} color="#000" />
                    </TouchableOpacity>
                    <View style={styles.buttonContainer}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} size={24} color="#000" />
                        <FontAwesomeIcon icon={faListDots} size={24} color="#000" />
                    </View>
                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{taskDetail.title}</Text>
                    <Text style={styles.description}>{taskDetail.description}</Text>
                </View>

                <View style={styles.teamContainer}>
                    <Text style={styles.sectionTitle}>Takım Üyeleri</Text>
                    <View style={styles.teamWrapper}>
                        <FlatList
                            horizontal
                            data={teamMembers}
                            renderItem={({ item }) => (
                                <View style={styles.teamMemberContainer}>
                                    <Image source={{ uri: item.image }} style={styles.teamImage} />
                                    <Text style={styles.teamMemberName}>
                                        {item.username}
                                    </Text>
                                </View>
                            )}
                            ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
                        />
                    </View>
                </View>
                <View style={styles.dateContainer}>
                    <Text style={styles.sectionTitle}>Tarihler</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.datesWrapper}>
                            <View style={styles.dateItem}>
                                <FontAwesomeIcon icon={faCalendar} size={20} color="#FF6B6B" />
                                <View>
                                    <Text style={styles.dateLabel}>Due Date</Text>
                                    <Text style={styles.date}>{formatDate(taskDetail.due_date)}</Text>
                                </View>
                            </View>
                            
                            <View style={styles.dateItem}>
                                <FontAwesomeIcon icon={faClock} size={20} color="#4ECDC4" />
                                <View>
                                    <Text style={styles.dateLabel}>Created At</Text>
                                    <Text style={styles.date}>{formatDate(taskDetail.created_at)}</Text>
                                </View>
                            </View>

                            <View style={styles.dateItem}>
                                <FontAwesomeIcon icon={faEdit} size={20} color="#45B7D1" />
                                <View>
                                    <Text style={styles.dateLabel}>Updated At</Text>
                                    <Text style={styles.date}>{formatDate(taskDetail.updated_at)}</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>

                <View style={styles.statusContainer}>
                    <Text style={styles.sectionTitle}>Status & Priority</Text>
                    <View style={styles.statusWrapper}>
                        <View style={styles.statusItem}>
                            <View style={[styles.statusDot, { backgroundColor: getStatusColor(taskDetail.status) }]} />
                            <View>
                                <Text style={styles.statusLabel}>Status</Text>
                                <Text style={styles.statusText}>
                                    {getStatusText(taskDetail.status)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.statusItem}>
                            <View style={[styles.statusDot, { backgroundColor: getPriorityColor(taskDetail.priority) }]} />
                            <View>
                                <Text style={styles.statusLabel}>Priority</Text>
                                <Text style={styles.statusText}>
                                    {getPriorityText(taskDetail.priority)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.tabContainer}>
                    <View style={styles.tabHeader}>
                        <TouchableOpacity 
                            style={[styles.tabButton, activeTab === 'attachments' && styles.activeTabButton]} 
                            onPress={() => setActiveTab('attachments')}
                        >
                            <FontAwesomeIcon 
                                icon={faFile} 
                                size={18} 
                                color={activeTab === 'attachments' ? '#4ECDC4' : '#666'} 
                            />
                            <Text style={[
                                styles.tabButtonText,
                                activeTab === 'attachments' && styles.activeTabText
                            ]}>
                                Attachments
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.tabButton, activeTab === 'comments' && styles.activeTabButton]} 
                            onPress={() => setActiveTab('comments')}
                        >
                            <FontAwesomeIcon 
                                icon={faComment} 
                                size={18} 
                                color={activeTab === 'comments' ? '#4ECDC4' : '#666'} 
                            />
                            <Text style={[
                                styles.tabButtonText,
                                activeTab === 'comments' && styles.activeTabText
                            ]}>
                                Comments
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.tabContent}>
                        {activeTab === 'attachments' ? renderAttachments() : renderComments()}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f1',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingTop: 20,
        paddingRight: 20,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 20,
    },
    titleContainer: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Montserrat-Medium',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
    },
    teamContainer: {
        paddingHorizontal: 20,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: 'Montserrat-Medium',
        marginBottom: 10,
        color: '#666',
    },
    teamWrapper: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
    },
    teamMemberContainer: {
        alignItems: 'center',
        gap: 5,
    },
    teamImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    teamMemberName: {
        fontSize: 12,
        fontFamily: 'Montserrat-Medium',
        color: '#666',
        textAlign: 'center',
        width: 80,
    },
    dateContainer: {
        paddingHorizontal: 20,
        marginTop: 10,
    },
    datesWrapper: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        gap: 20,
    },
    dateItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        minWidth: 160,
    },
    dateLabel: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'Montserrat-Regular',
    },
    date: {
        fontSize: 13,
        fontFamily: 'Montserrat-Medium',
    },
    statusContainer: {
        paddingHorizontal: 20,
        marginTop: 10,
    },
    statusWrapper: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        justifyContent: 'space-around',
    },
    statusItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    statusLabel: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'Montserrat-Regular',
    },
    statusText: {
        fontSize: 13,
        fontFamily: 'Montserrat-Medium',
        color: '#000',
    },
    tabContainer: {
        paddingHorizontal: 20,
        marginTop: 10,
    },
    tabHeader: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 5,
        marginBottom: 10,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 8,
        borderRadius: 8,
    },
    activeTabButton: {
        backgroundColor: '#F8F8F8',
    },
    tabButtonText: {
        fontSize: 14,
        fontFamily: 'Montserrat-Medium',
        color: '#666',
    },
    activeTabText: {
        color: '#4ECDC4',
    },
    tabContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        minHeight: 200,
    },
    placeholderContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    placeholderText: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Montserrat-Regular',
    },
    attachmentsList: {
        padding: 15,
    },
    attachmentItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
    },
    attachmentImage: {
        width: '100%',
        height: 200,
        backgroundColor: '#f8f8f8',
    },
    attachmentContent: {
        padding: 15,
    },
    attachmentDescription: {
        fontSize: 14,
        color: '#000',
        marginBottom: 10,
        fontFamily: 'Montserrat-Regular',
    },
    attachmentFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    uploadInfo: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'Montserrat-Regular',
    },
    uploadDate: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'Montserrat-Regular',
    },
    attachmentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 5,
    },
    fileName: {
        fontSize: 14,
        fontFamily: 'Montserrat-Medium',
        color: '#000',
    },
    commentsList: {
        padding: 15,
    },
    commentItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    commentUserImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    commentUserInfo: {
        flex: 1,
    },
    commentUserName: {
        fontSize: 14,
        fontFamily: 'Montserrat-Medium',
        color: '#000',
    },
    commentDate: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'Montserrat-Regular',
    },
    commentText: {
        fontSize: 14,
        color: '#333',
        fontFamily: 'Montserrat-Regular',
        lineHeight: 20,
    },
});

export default TaskDetailScreen; 