//TODO: Dışarıdan import edilen fonksiyonlar (AddTaskScreen.tsx) için burdan kullanılabilir. Ancak şuan sayfa içerisindeki yapıyı bozmadım

import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Modal, 
    TouchableOpacity, 
    FlatList, 
    ActivityIndicator,
    Image,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    Keyboard
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faImage } from '@fortawesome/free-solid-svg-icons';
import { User, Attachment } from '../types/taskTypes';

interface SelectionItem {
    value: string;
    label: string;
}

export const renderSelectionModal = (
    visible: boolean,
    onClose: () => void,
    items: SelectionItem[],
    onSelect: (value: string) => void,
    title: string
) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{title}</Text>
                            <FlatList
                                data={items}
                                keyExtractor={(item) => item.value}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.modalItem}
                                        onPress={() => {
                                            onSelect(item.value);
                                            onClose();
                                        }}
                                    >
                                        <Text style={styles.modalItemText}>{item.label}</Text>
                                    </TouchableOpacity>
                                )}
                                ItemSeparatorComponent={() => <View style={styles.separator} />}
                            />
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export const renderUsersModal = (
    visible: boolean,
    onClose: () => void,
    users: User[],
    selectedUsers: number[],
    onUserSelect: (userId: number) => void,
    loading: boolean
) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Select Team Members</Text>
                            {loading ? (
                                <ActivityIndicator size="large" color="#4ECDC4" />
                            ) : (
                                <FlatList
                                    data={users}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.userItem}
                                            onPress={() => onUserSelect(item.id)}
                                        >
                                            <View style={styles.userInfo}>
                                                {item.profile_image ? (
                                                    <Image
                                                        source={{ uri: item.profile_image }}
                                                        style={styles.userAvatar}
                                                    />
                                                ) : (
                                                    <View style={styles.userAvatarPlaceholder}>
                                                        <Text style={styles.userAvatarText}>
                                                            {item.name.charAt(0)}
                                                        </Text>
                                                    </View>
                                                )}
                                                <View>
                                                    <Text style={styles.userName}>{item.name}</Text>
                                                    <Text style={styles.userEmail}>{item.email}</Text>
                                                </View>
                                            </View>
                                            {selectedUsers.includes(item.id) && (
                                                <View style={styles.selectedIndicator}>
                                                    <FontAwesomeIcon icon={faCheck} size={16} color="#fff" />
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    )}
                                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                                />
                            )}
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export const renderAttachmentModal = (
    visible: boolean,
    onClose: () => void,
    attachments: Attachment[],
    description: string,
    onDescriptionChange: (text: string) => void,
    onAddPhoto: () => void,
    onRemovePhoto: (index: number) => void,
    onDone: () => void
) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView 
                    style={styles.modalOverlay}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={0}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {attachments.length > 0 
                                    ? `${attachments.length} Photo Selected`
                                    : 'Add Photo'
                                }
                            </Text>
                            <View style={styles.modalHeaderButtons}>
                                <TouchableOpacity 
                                    style={styles.cancelButton}
                                    onPress={onClose}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.doneButton}
                                    onPress={onDone}
                                >
                                    <Text style={styles.doneButtonText}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={styles.descriptionInput}
                                value={description}
                                onChangeText={onDescriptionChange}
                                placeholder="Enter description"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.selectedPhotosContainer}>
                            {attachments.map((attachment, index) => (
                                <View key={index} style={styles.selectedPhotoItem}>
                                    <TouchableOpacity 
                                        style={styles.removeButton}
                                        onPress={() => onRemovePhoto(index)}
                                    >
                                        <Text style={styles.removeButtonText}>×</Text>
                                    </TouchableOpacity>
                                    <Image
                                        source={{ uri: attachment.file_path }}
                                        style={styles.selectedPhotoImage}
                                    />
                                    <Text 
                                        style={styles.selectedPhotoText}
                                        numberOfLines={1}
                                    >
                                        {attachment.description || 'No description'}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <TouchableOpacity 
                            style={[styles.attachmentButton, styles.photoButton]}
                            onPress={onAddPhoto}
                        >
                            <FontAwesomeIcon icon={faImage} size={20} color="#fff" />
                            <Text style={styles.attachmentButtonText}>
                                {attachments.length > 0 
                                    ? `Add More (${attachments.length})` 
                                    : 'Select Photo'
                                }
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '100%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        marginBottom: 20,
    },
    modalItem: {
        paddingVertical: 15,
    },
    modalItemText: {
        fontSize: 16,
        fontFamily: 'Montserrat-Regular',
    },
    separator: {
        height: 1,
        backgroundColor: '#e0e0e0',
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userAvatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4ECDC4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    userAvatarText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
    },
    userName: {
        fontSize: 16,
        fontFamily: 'Montserrat-Medium',
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Montserrat-Regular',
    },
    selectedIndicator: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#4ECDC4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalHeaderButtons: {
        flexDirection: 'row',
    },
    cancelButton: {
        marginRight: 15,
    },
    cancelButtonText: {
        color: '#FF6B6B',
        fontSize: 16,
        fontFamily: 'Montserrat-Medium',
    },
    doneButton: {
        backgroundColor: '#4ECDC4',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
    },
    doneButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Montserrat-Medium',
    },
    formGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontFamily: 'Montserrat-Medium',
    },
    descriptionInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        fontFamily: 'Montserrat-Regular',
    },
    selectedPhotosContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 15,
    },
    selectedPhotoItem: {
        width: 80,
        alignItems: 'center',
        position: 'relative',
    },
    selectedPhotoImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginBottom: 4,
        resizeMode: 'cover',
    },
    selectedPhotoText: {
        fontSize: 10,
        color: '#666',
        textAlign: 'center',
        fontFamily: 'Montserrat-Regular',
    },
    removeButton: {
        position: 'absolute',
        top: -5,
        right: -5,
        zIndex: 1,
        backgroundColor: '#FF6B6B',
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeButtonText: {
        color: 'white',
        fontSize: 16,
        lineHeight: 18,
        fontWeight: 'bold',
    },
    attachmentButton: {
        backgroundColor: '#4ECDC4',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 8,
        gap: 10,
        marginTop: 20,
    },
    photoButton: {
        backgroundColor: '#4ECDC4',
    },
    attachmentButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Montserrat-Medium',
    },
}); 