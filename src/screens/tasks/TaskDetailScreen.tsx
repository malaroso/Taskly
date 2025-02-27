import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, SafeAreaView, ScrollView, FlatList, TouchableOpacity, TextInput, Button, Modal, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { getTaskDetail, getTaskAttachments, getTaskComments, deleteTask, addComment, deleteComment, updateComment } from '../../services/taskService';
import { TaskDetail, TaskComment, TaskAttachment } from '../../types/taskTypes';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import { faArrowLeft, faShareAlt, faComment, faListDots, faAdd, faCalendar, faClock, faEdit, faFile, faDownload, faTrash, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import {getStatusColor , getPriorityColor, getStatusText, getPriorityText, formatDate} from '../../utils/taskHelpers';
import { renderAttachments, renderComments } from '../../components/TaskDetailComponents';

type TaskDetailScreenRouteProp = RouteProp<{ params: { taskID: number } }, 'params'>;

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
    const [isModalVisible, setModalVisible] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [statusModal, setStatusModal] = useState({
        visible: false,
        type: 'success',
        message: ''
    });
    const [deleteCommentModal, setDeleteCommentModal] = useState({
        visible: false,
        commentId: null as number | null
    });
    const [editCommentModal, setEditCommentModal] = useState({
        visible: false,
        commentId: null as number | null,
        commentText: ''
    });

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

    const showStatusModal = (type: 'success' | 'error', message: string) => {
        setStatusModal(prev => ({ ...prev, visible: false }));
        
        setTimeout(() => {
            setStatusModal({
                visible: true,
                type,
                message
            });

            setTimeout(() => {
                setStatusModal(prev => ({ ...prev, visible: false }));
            }, 3000);
        }, 100);
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            showStatusModal('error', 'Lütfen bir yorum yazın');
            return;
        }

        try {
            const response = await addComment(taskID, newComment.trim());
            
            if (response.status) {
                showStatusModal('success', response.message);
                console.log("response => " , response);
                
                const commentsResponse = await getTaskComments(taskID);
                if (commentsResponse.status) {
                    setComments(commentsResponse.data);
                }
    
                setModalVisible(false);
                setNewComment('');
            } else {
                showStatusModal('error', response.message);
            }
        } catch (error) {
            showStatusModal('error', 'Yorum eklenirken bir hata oluştu');
        }
    };
    const handleDeleteTask = async () => {
        try {
            const response = await deleteTask(taskID);
            
            if (response.status) {
                Alert.alert('Başarılı', response.message);
                navigation.goBack();
            } else {
                Alert.alert('Hata', response.message);
            }
        } catch (error) {
            Alert.alert('Hata', 'Görev silinirken bir hata oluştu');
        } finally {
            setDeleteModalVisible(false);
        }
    };

    const handleEditComment = (commentId: number, currentComment: string) => {
        setEditCommentModal({
            visible: true,
            commentId,
            commentText: currentComment
        });
    };

    const handleDeleteComment = (commentId: number) => {
        console.log("handleDeleteComment called with ID:", commentId);
        setDeleteCommentModal({
            visible: true,
            commentId
        });
        console.log("deleteCommentModal set to:", { visible: true, commentId });
    };

    const confirmDeleteComment = async () => {
        if (!deleteCommentModal.commentId) return;

        console.log("Confirming delete for comment ID:", deleteCommentModal.commentId);

        try {
            const response = await deleteComment(deleteCommentModal.commentId);
            console.log("Delete comment response:", response);
            
            if (response.status) {
                showStatusModal('success', response.message);
                
                const commentsResponse = await getTaskComments(taskID);
                if (commentsResponse.status) {
                    setComments(commentsResponse.data);
                }
            } else {
                showStatusModal('error', response.message);
            }
        } catch (error) {
            console.error("Delete comment error:", error);
            showStatusModal('error', 'Yorum silinirken bir hata oluştu');
        } finally {
            setDeleteCommentModal({
                visible: false,
                commentId: null
            });
        }
    };

    const confirmEditComment = async () => {
        if (!editCommentModal.commentId || !editCommentModal.commentText.trim()) return;

        try {
            const response = await updateComment(
                editCommentModal.commentId,
                editCommentModal.commentText.trim()
            );

            if (response.status) {
                showStatusModal('success', response.message);
                
                const commentsResponse = await getTaskComments(taskID);
                if (commentsResponse.status) {
                    setComments(commentsResponse.data);
                }
            } else {
                showStatusModal('error', response.message);
            }
        } catch (error) {
            showStatusModal('error', 'Yorum güncellenirken bir hata oluştu');
        } finally {
            setEditCommentModal({
                visible: false,
                commentId: null,
                commentText: ''
            });
        }
    };

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

    return (
        <>
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <FontAwesomeIcon icon={faArrowLeft} size={24} color="#000" />
                        </TouchableOpacity>
                        <View style={styles.buttonContainer}>
                            <FontAwesomeIcon icon={faAdd} size={24} color="green" />
                            <TouchableOpacity onPress={() => setModalVisible(true)}>
                                <FontAwesomeIcon icon={faComment} size={24} color="#666" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setDeleteModalVisible(true)}>
                                <FontAwesomeIcon icon={faTrash} size={24} color="#FF6B6B" />
                            </TouchableOpacity>
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
                            {activeTab === 'attachments' 
                                ? renderAttachments(attachments, loadingAttachments)
                                : renderComments(
                                    comments, 
                                    loadingComments,
                                    handleEditComment,
                                    handleDeleteComment
                                )
                            }
                        </View>
                    </View>
                    <View style={styles.clear}></View>
                </ScrollView>
            </SafeAreaView>

            {/* Add Comment Modal */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalOverlay}
                >
                    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                        <View style={styles.modalContainer}>
                            <TouchableWithoutFeedback>
                                <View style={styles.bottomSheetContent}>
                                    <View style={styles.modalHeader}>
                                        <Text style={styles.modalTitle}>Add Comment</Text>
                                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                                            <Text style={styles.cancelButtonText}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        value={newComment}
                                        onChangeText={setNewComment}
                                        placeholder="Write your comment..."
                                        multiline
                                        numberOfLines={3}
                                    />
                                    <TouchableOpacity 
                                        style={[
                                            styles.submitButton,
                                            !newComment.trim() && styles.disabledButton
                                        ]} 
                                        onPress={handleAddComment}
                                        disabled={!newComment.trim()}
                                    >
                                        <Text style={styles.submitButtonText}>Add Comment</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </Modal>

            {/* Delete Task Modal */}
            <Modal
                visible={isDeleteModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setDeleteModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={() => setDeleteModalVisible(false)}>
                        <View style={styles.modalContainer}>
                            <TouchableWithoutFeedback>
                                <View style={styles.bottomSheetContent}>
                                    <View style={styles.modalHeader}>
                                        <Text style={styles.modalTitle}>Delete Task</Text>
                                        <TouchableOpacity onPress={() => setDeleteModalVisible(false)}>
                                            <Text style={styles.cancelButtonText}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.deleteWarningText}>
                                        Are you sure you want to delete this task?
                                    </Text>
                                    <View style={styles.modalButtons}>
                                        <TouchableOpacity 
                                            style={[styles.modalButton, styles.cancelModalButton]} 
                                            onPress={() => setDeleteModalVisible(false)}
                                        >
                                            <Text style={styles.cancelButtonText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={[styles.modalButton, styles.deleteModalButton]} 
                                            onPress={handleDeleteTask}
                                        >
                                            <Text style={styles.deleteButtonText}>Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </Modal>

            {/* Delete Comment Modal */}
            <Modal
                visible={deleteCommentModal.visible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setDeleteCommentModal({ visible: false, commentId: null })}
            >
                <TouchableWithoutFeedback onPress={() => setDeleteCommentModal({ visible: false, commentId: null })}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={styles.bottomSheetContent}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Delete Comment</Text>
                                    <TouchableOpacity 
                                        onPress={() => setDeleteCommentModal({ visible: false, commentId: null })}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.deleteWarningText}>
                                    Are you sure you want to delete this comment?
                                </Text>
                                <View style={styles.modalButtons}>
                                    <TouchableOpacity 
                                        style={[styles.modalButton, styles.cancelModalButton]} 
                                        onPress={() => setDeleteCommentModal({ visible: false, commentId: null })}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[styles.modalButton, styles.deleteModalButton]} 
                                        onPress={() => {
                                            console.log("Delete button pressed with ID:", deleteCommentModal.commentId);
                                            confirmDeleteComment();
                                        }}
                                    >
                                        <Text style={styles.deleteButtonText}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Edit Comment Modal */}
            <Modal
                visible={editCommentModal.visible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setEditCommentModal({ visible: false, commentId: null, commentText: '' })}
            >
                <TouchableWithoutFeedback onPress={() => setEditCommentModal({ visible: false, commentId: null, commentText: '' })}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={styles.bottomSheetContent}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Edit Comment</Text>
                                    <TouchableOpacity 
                                        onPress={() => setEditCommentModal({ visible: false, commentId: null, commentText: '' })}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                                <TextInput
                                    style={styles.input}
                                    value={editCommentModal.commentText}
                                    onChangeText={(text) => setEditCommentModal(prev => ({ ...prev, commentText: text }))}
                                    placeholder="Edit your comment..."
                                    multiline
                                    numberOfLines={3}
                                />
                                <TouchableOpacity 
                                    style={[
                                        styles.submitButton,
                                        !editCommentModal.commentText.trim() && styles.disabledButton
                                    ]} 
                                    onPress={confirmEditComment}
                                    disabled={!editCommentModal.commentText.trim()}
                                >
                                    <Text style={styles.submitButtonText}>Update</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Status Modal */}
            <Modal
                visible={statusModal.visible}
                transparent={true}
                animationType="fade"
                statusBarTranslucent={true}
            >
                <View style={styles.statusModalContainer}>
                    <View style={[
                        styles.statusModalContent,
                        statusModal.type === 'success' ? styles.successModal : styles.errorModal
                    ]}>
                        <View style={styles.statusIconContainer}>
                            <FontAwesomeIcon 
                                icon={statusModal.type === 'success' ? faCheck : faXmark} 
                                size={24} 
                                color="#fff" 
                            />
                        </View>
                        <Text style={styles.statusModalText}>
                            {statusModal.message}
                        </Text>
                    </View>
                </View>
            </Modal>
        </>
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


    clear:{
        height: 80,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    bottomSheetContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        minHeight: 200,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat-Medium',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: '#4ECDC4',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Montserrat-Medium',
    },
    cancelButtonText: {
        color: '#FF6B6B',
        fontSize: 16,
        fontFamily: 'Montserrat-Medium',
    },
    deleteWarningText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginVertical: 20,
        fontFamily: 'Montserrat-Regular',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        gap: 10,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    deleteModalButton: {
        backgroundColor: '#FF6B6B',
    },
    cancelModalButton: {
        backgroundColor: '#f0f0f1',
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Montserrat-Medium',
    },
    disabledButton: {
        backgroundColor: '#ccc',
        opacity: 0.7,
    },
    statusModalContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        elevation: 9999,
    },
    statusModalContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        maxWidth: '80%',
        minWidth: 280,
        zIndex: 10000,
    },
    successModal: {
        backgroundColor: '#4ECDC4',
    },
    errorModal: {
        backgroundColor: '#FF6B6B',
    },
    statusIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    statusModalText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Montserrat-Medium',
        flex: 1,
    },
});

export default TaskDetailScreen; 