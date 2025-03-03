import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity, 
    ScrollView,
    Platform,
    Modal,
    ActivityIndicator,
    Image,
    Alert,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
    faArrowLeft, 
    faCalendar, 
    faUserPlus, 
    faPaperclip,
    faChevronDown,
    faCheck,
    faImage,
    faFolder,
    faXmark
} from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { getAllUsers } from '../../services/userService';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import { addTask } from '../../services/taskService';
import { StatusModal } from '../../components/StatusModal';
import { StatusModalType } from '../../types/modalTypes';
import { Attachment, TaskForm, User } from '../../types/taskTypes';
import { priorities, statuses } from '../../utils/taskHelpers';

const AddTaskScreen = () => {
    const navigation = useNavigation();
    const [formData, setFormData] = useState<TaskForm>({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        due_date: new Date().toISOString().split('T')[0],
        attachments: [],
        assigned_users: []
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showPriorityModal, setShowPriorityModal] = useState(false);
    const [showStatusSelection, setShowStatusSelection] = useState(false);
    const [showUsersModal, setShowUsersModal] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [showAttachmentModal, setShowAttachmentModal] = useState(false);
    const [attachmentDescription, setAttachmentDescription] = useState('');
    const [errors, setErrors] = useState({ title: '', description: '',});
    const [statusModal, setStatusModal] = useState<{
        visible: boolean;
        type: StatusModalType;
        message: string;
    }>({
        visible: false,
        type: 'success',
        message: ''
    });



    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const response = await getAllUsers();
            if (response.status) {
                setUsers(response.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleUserSelect = (userId: number) => {
        setSelectedUsers(prev => {
            const newSelectedUsers = prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId];
            
            setFormData(prevForm => ({
                ...prevForm,
                assigned_users: newSelectedUsers
            }));

            return newSelectedUsers;
        });
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            title: '',
            description: '',
        };

        if (!formData.title.trim()) {
            newErrors.title = 'Başlık alanı zorunludur';
            isValid = false;
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Açıklama alanı zorunludur';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            Alert.alert('Hata', 'Lütfen zorunlu alanları doldurun');
            return;
        }

        try {
            const response = await addTask(formData);

            showStatusModal('success', 'Task created successfully');
            
            // Form verilerini sıfırla
            setFormData({
                title: '',
                description: '',
                status: 'pending',
                priority: 'medium',
                due_date: new Date().toISOString().split('T')[0],
                attachments: [],
                assigned_users: []
            });

            // Kullanıcı seçimlerini sıfırla
            setSelectedUsers([]);

            // Attachment açıklamasını sıfırla
            setAttachmentDescription('');

            setTimeout(() => {
                navigation.goBack();
            }, 2000);
        } catch (error) {
            showStatusModal('error', 'Görev oluşturulamadı');
        }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setFormData({
                ...formData,
                due_date: selectedDate.toISOString().split('T')[0]
            });
        }
    };

    const handleAddPhoto = async () => {
        try {
            // Açıklama kontrolü
            if (!attachmentDescription.trim()) {
                showStatusModal('error', 'Please enter a description');
                return;
            }

            // Önce izinleri kontrol edelim
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (!permissionResult.granted) {
                showStatusModal('error', 'Gallery access permission is required');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
                allowsMultipleSelection: false,
            });

            console.log("ImagePicker result:", result);

            if (!result.canceled && result.assets && result.assets.length > 0) {
                console.log("Selected image:", result.assets[0].uri);
                
                const newAttachment: Attachment = {
                    description: attachmentDescription.trim(),
                    file_path: result.assets[0].uri,
                    uploaded_by: 0 // Gerekli alan
                };

                setFormData({
                    ...formData,
                    attachments: [...formData.attachments, newAttachment]
                });
                
                // Açıklama inputunu temizle
                setAttachmentDescription('');
                showStatusModal('success', 'Photo added successfully');
            }
        } catch (error) {
            console.error('Error picking image:', error);
            showStatusModal('error', 'An error occurred while selecting the photo');
        }
    };

    const handleRemovePhoto = (index: number) => {
        const newAttachments = [...formData.attachments];
        newAttachments.splice(index, 1);
        setFormData(prev => ({
            ...prev,
            attachments: newAttachments
        }));
    };

    const saveFileLocally = async (uri: string) => {
        try {
            const fileName = uri.split('/').pop() || `file_${Date.now()}.jpg`;
            const directory = FileSystem.documentDirectory + 'uploads/';
            
            // Klasör yoksa oluştur
            await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
            
            const newPath = directory + fileName;
            
            // Dosyayı kopyala
            await FileSystem.copyAsync({
                from: uri,
                to: newPath
            });
            
            return newPath;
        } catch (error) {
            console.error('File save error:', error);
            throw new Error('Failed to save file');
        }
    };

 
    const renderSelectionModal = (  visible: boolean,  onClose: () => void, items: Array<{ value: string, label: string }>,onSelect: (value: string) => void,   title: string ) => (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <FontAwesomeIcon icon={faArrowLeft} size={24} color="#333" />
                        </TouchableOpacity>
                    </View>
                    {items.map((item) => (
                        <TouchableOpacity
                            key={item.value}
                            style={styles.modalItem}
                            onPress={() => {
                                onSelect(item.value);
                                onClose();
                            }}
                        >
                            <Text style={styles.modalItemText}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </Modal>
    );

    const renderUsersModal = () => (
        <Modal
            visible={showUsersModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowUsersModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select Users</Text>
                        <TouchableOpacity onPress={() => setShowUsersModal(false)}>
                            <FontAwesomeIcon icon={faArrowLeft} size={24} color="#333" />
                        </TouchableOpacity>
                    </View>
                    {loadingUsers ? (
                        <ActivityIndicator size="large" color="#4ECDC4" />
                    ) : (
                        <ScrollView>
                            {users.map((user) => (
                                <TouchableOpacity
                                    key={user.id}
                                    style={[
                                        styles.userItem,
                                        selectedUsers.includes(user.id) && styles.selectedUserItem
                                    ]}
                                    onPress={() => handleUserSelect(user.id)}
                                >
                                    <View style={styles.userInfo}>
                                        <Image 
                                            source={{ uri: user.profile_image }} 
                                            style={styles.userImage} 
                                        />
                                        <View>
                                            <Text style={styles.userName}>{user.name}</Text>
                                            <Text style={styles.userEmail}>{user.email}</Text>
                                        </View>
                                    </View>
                                    {selectedUsers.includes(user.id) && (
                                        <FontAwesomeIcon icon={faCheck} size={20} color="#4ECDC4" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>
            </View>
        </Modal>
    );

    const renderAttachmentModal = () => {
        return (
            <Modal
                visible={showAttachmentModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowAttachmentModal(false)}
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
                                    {formData.attachments.length > 0 
                                        ? `${formData.attachments.length} Photo Selected`
                                        : 'Add Photo'
                                    }
                                </Text>
                                <View style={styles.modalHeaderButtons}>
                                    <TouchableOpacity 
                                        style={styles.cancelButton}
                                        onPress={() => setShowAttachmentModal(false)}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.doneButton}
                                        onPress={() => setShowAttachmentModal(false)}
                                    >
                                        <Text style={styles.doneButtonText}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.span}>
                                <Text style={styles.spanText}>Please enter a description first and then select a photo</Text>
                            </View>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Description</Text>
                                <TextInput
                                    style={styles.descriptionInput}
                                    value={attachmentDescription}
                                    onChangeText={setAttachmentDescription}
                                    placeholder="Enter description"
                                    placeholderTextColor="#999"
                                />
                            </View>

                            <View style={styles.selectedPhotosContainer}>
                                {formData.attachments.map((attachment, index) => (
                                    <View key={index} style={styles.selectedPhotoItem}>
                                        <TouchableOpacity 
                                            style={styles.removeButton}
                                            onPress={() => handleRemovePhoto(index)}
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
                                style={styles.photoButton}
                                onPress={handleAddPhoto}
                                activeOpacity={0.7}
                            >
                                <FontAwesomeIcon icon={faImage} size={20} color="#fff" />
                                <Text style={styles.photoButtonText}>
                                    {formData.attachments.length > 0 
                                        ? `Add More (${formData.attachments.length})` 
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

    const showStatusModal = (type: StatusModalType, message: string) => {
        setStatusModal(prev => ({ ...prev, visible: false }));
        
        setTimeout(() => {
            setStatusModal({
                visible: true,
                type,
                message
            });

            setTimeout(() => {
                setStatusModal(prev => ({ ...prev, visible: false }));
            }, 2000);
        }, 100);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <FontAwesomeIcon icon={faArrowLeft} size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add New Task</Text>
                <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>Create</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Başlık</Text>
                    <TextInput
                        style={[
                            styles.input,
                            errors.title ? styles.inputError : null
                        ]}
                        value={formData.title}
                        onChangeText={(text) => {
                            setFormData({...formData, title: text});
                            setErrors({...errors, title: ''});
                        }}
                        placeholder="Görev başlığı"
                    />
                    {errors.title ? (
                        <Text style={styles.errorText}>{errors.title}</Text>
                    ) : null}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Açıklama</Text>
                    <TextInput
                        style={[
                            styles.input,
                            styles.textArea,
                            errors.description ? styles.inputError : null
                        ]}
                        value={formData.description}
                        onChangeText={(text) => {
                            setFormData({...formData, description: text});
                            setErrors({...errors, description: ''});
                        }}
                        placeholder="Görev açıklaması"
                        multiline
                        numberOfLines={4}
                    />
                    {errors.description ? (
                        <Text style={styles.errorText}>{errors.description}</Text>
                    ) : null}
                </View>

                <View style={styles.row}>
                    <View style={[styles.formGroup, styles.flex1]}>
                        <Text style={styles.label}>Priority</Text>
                        <TouchableOpacity 
                            style={styles.select}
                            onPress={() => setShowPriorityModal(true)}
                        >
                            <Text style={styles.selectText}>
                                {priorities.find(p => p.value === formData.priority)?.label}
                            </Text>
                            <FontAwesomeIcon icon={faChevronDown} size={16} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.formGroup, styles.flex1]}>
                        <Text style={styles.label}>Status</Text>
                        <TouchableOpacity 
                            style={styles.select}
                            onPress={() => setShowStatusSelection(true)}
                        >
                            <Text style={styles.selectText}>
                                {statuses.find(s => s.value === formData.status)?.label}
                            </Text>
                            <FontAwesomeIcon icon={faChevronDown} size={16} color="#666" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Due Date</Text>
                    <TouchableOpacity 
                        style={styles.dateButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={styles.dateButtonText}>{formData.due_date}</Text>
                        <FontAwesomeIcon icon={faCalendar} size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={new Date(formData.due_date)}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                <View style={styles.actionButtons}>
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => {
                            fetchUsers();
                            setShowUsersModal(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faUserPlus} size={20} color="#4ECDC4" />
                        <Text style={styles.actionButtonText}>
                            {selectedUsers.length > 0 
                                ? `${selectedUsers.length} Users Selected` 
                                : "Assign Users"
                            }
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => setShowAttachmentModal(true)}
                    >
                        <FontAwesomeIcon icon={faPaperclip} size={20} color="#4ECDC4" />
                        <View style={{ position: 'relative' }}>
                            <Text style={styles.actionButtonText}>Add Attachment</Text>
                            {formData.attachments.length > 0 && (
                                <View style={styles.photoCountBadge}>
                                    <Text style={styles.photoCountText}>
                                        {formData.attachments.length}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
              
                <View style={styles.attachmentsContainer}>
                    <Text style={styles.sectionTitle}>Attachments ({formData.attachments.length})</Text>
                    {formData.attachments.map((attachment, index) => (
                        <View key={index} style={styles.attachmentItem}>
                            <FontAwesomeIcon 
                                icon={attachment.file_path.endsWith('.pdf') ? faFolder : faImage} 
                                size={16} 
                                color="#666" 
                            />
                            <Text style={styles.attachmentText} numberOfLines={1}>
                                {attachment.description || 'No description'}
                            </Text>
                        </View>
                    ))}
                </View>
                <View style={styles.clear}></View>

            </ScrollView>

            {renderSelectionModal(
                showPriorityModal,
                () => setShowPriorityModal(false),
                priorities,
                (value) => setFormData({ ...formData, priority: value as TaskForm['priority'] }),
                'Select Priority'
            )}

            {renderSelectionModal(
                showStatusSelection,
                () => setShowStatusSelection(false),
                statuses,
                (value) => setFormData({ ...formData, status: value as TaskForm['status'] }),
                'Select Status'
            )}

            {renderUsersModal()}
            {renderAttachmentModal()}

            <StatusModal
                visible={statusModal.visible}
                type={statusModal.type}
                message={statusModal.message}
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
        padding: 20,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Montserrat-Bold',
    },
    content: {
        padding: 20,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontFamily: 'Montserrat-Medium',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        fontFamily: 'Montserrat-Regular',
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        gap: 15,
    },
    flex1: {
        flex: 1,
    },
    select: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectText: {
        fontSize: 16,
        fontFamily: 'Montserrat-Regular',
        color: '#333',
    },
    dateButton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateButtonText: {
        fontSize: 16,
        fontFamily: 'Montserrat-Regular',
        color: '#333',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    actionButton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
        marginHorizontal: 5,
    },
    actionButtonText: {
        color: '#4ECDC4',
        fontSize: 13,
        fontFamily: 'Montserrat-Medium',
    },
    submitButton: {
        backgroundColor: '#4ECDC4',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Montserrat-Medium',
    },
    clear: {
        height: 100,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '60%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalHeaderButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    cancelButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#f0f0f1',
    },
    cancelButtonText: {
        color: '#666',
        fontFamily: 'Montserrat-Medium',
    },
    doneButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#4ECDC4',
    },
    doneButtonText: {
        color: '#fff',
        fontFamily: 'Montserrat-Medium',
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
    },
    modalItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f1',
    },
    modalItemText: {
        fontSize: 16,
        fontFamily: 'Montserrat-Regular',
        color: '#333',
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f1',
    },
    selectedUserItem: {
        backgroundColor: '#f8f8f8',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    userName: {
        fontSize: 16,
        fontFamily: 'Montserrat-Medium',
    },
    userEmail: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'Montserrat-Regular',
    },
    descriptionInput: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 20,
    },
    attachmentButtons: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 15,
    },
    attachmentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#4ECDC4',
        gap: 8,
    },
    photoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#4ECDC4',
    },
    photoButtonText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Montserrat-Medium',
        marginLeft: 5,
    },
    attachmentsContainer: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        color: '#333',
        marginBottom: 10,
    },
    attachmentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    attachmentText: {
        fontSize: 14,
        color: '#666',
        flex: 1,
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
    photoCountBadge: {
        position: 'absolute',
        right: -8,
        top: -8,
        backgroundColor: '#FF6B6B',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    photoCountText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Montserrat-Bold',
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
    inputError: {
        borderWidth: 1,
        borderColor: '#FF6B6B',
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 12,
        marginTop: 5,
        fontFamily:     'Montserrat-Regular',
    },
    span: {
        marginTop: 10,
        marginBottom: 10,
    },
    spanText: {
        fontSize: 12,
        fontFamily: 'Montserrat-Regular',
    },
});

export default AddTaskScreen;
