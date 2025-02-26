import React from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '../utils/taskHelpers';

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

export const renderComments = (comments: any[], loadingComments: boolean) => {
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
    commentsList: {
        padding: 15,
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

})