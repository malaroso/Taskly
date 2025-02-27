import React from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFile, faEdit, faTrash, faDownload } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '../utils/taskHelpers';
import { useAuth } from '../context/AuthContext';

const isImageFile = (filePath: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const extension = filePath.toLowerCase().substring(filePath.lastIndexOf('.'));
    return imageExtensions.includes(extension);
};

export const renderAttachments = (attachments: any[], loadingAttachments: boolean) => {
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

export const renderComments = (
    comments: any[], 
    loading: boolean,
    onEditComment?: (commentId: number, currentComment: string) => void,
    onDeleteComment?: (commentId: number) => void
) => {
    const { authState } = useAuth();
    const currentUserId = authState?.userId;
   

    if (loading) {
        return <ActivityIndicator size="large" color="#4ECDC4" style={styles.loader} />;
    }

    if (!comments || comments.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Henüz yorum yapılmamış</Text>
            </View>
        );
    }

    return (
        <View style={styles.commentsContainer}>
            {comments.map((comment, index) => {

                return (
                    <View key={index} style={styles.commentItem}>
                        <View style={styles.commentHeader}>
                            <View style={styles.userInfo}>
                                <Image 
                                    source={{ uri: comment.user_profile_image }} 
                                    style={styles.userImage} 
                                />
                                <View>
                                    <Text style={styles.userName}>{comment.user_name}</Text>
                                    <Text style={styles.commentDate}>
                                        {formatDate(comment.created_at)}
                                    </Text>
                                </View>
                            </View>
                            
                            {currentUserId === comment.user_id && (
                                <View style={styles.commentActions}>
                                    <TouchableOpacity 
                                        style={styles.actionButton}
                                        onPress={() => onEditComment && onEditComment(comment.id, comment.comment)}
                                    >
                                        <FontAwesomeIcon icon={faEdit} size={16} color="#4ECDC4" />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.actionButton}
                                        onPress={() => {
                                            console.log("Attempting to delete comment:", comment);
                                            const commentId = comment.id || comment.comment_id;
                                            if (commentId) {
                                                onDeleteComment && onDeleteComment(commentId);
                                            } else {
                                                console.error("No comment ID found in:", comment);
                                            }
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrash} size={16} color="#FF6B6B" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                        <Text style={styles.commentText}>{comment.comment}</Text>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    placeholderContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
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
    commentsContainer: {
        padding: 15,
    },
    commentItem: {
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    userName: {
        fontSize: 14,
        fontFamily: 'Montserrat-Medium',
        color: '#333',
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
    },
    commentActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        padding: 4,
    },
    loader: {
        padding: 20,
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        color: '#666',
        fontSize: 14,
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
})