import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Image, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCamera } from '@fortawesome/free-solid-svg-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { updateUser, uploadImage } from '../../services/userService';
import { StatusModal } from '../../components/StatusModal';
import { StatusModalType } from '../../types/modalTypes';

const MyProfileEditScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const userDetail = route.params?.userDetail;
    const [loading, setLoading] = useState(false);
    const [statusModal, setStatusModal] = useState<{
        visible: boolean;
        type: StatusModalType;
        message: string;
    }>({
        visible: false,
        type: 'success',
        message: ''
    });

    const [formData, setFormData] = useState({
        name: userDetail?.username || '',
        email: userDetail?.email || '',
        profile_image: userDetail?.profile_image || '',
        phone_number: userDetail?.phone_number || '',
        birth_date: userDetail?.birth_date || '',
        gender: userDetail?.gender || '',
        address: userDetail?.address || '',
        city: userDetail?.city || '',
        country: userDetail?.country || '',
        zip_code: userDetail?.zip_code || ''
    });

    const showStatusModal = (type: 'success' | 'error', message: string) => {
        setStatusModal({
            visible: true,
            type,
            message
        });

        setTimeout(() => {
            setStatusModal(prev => ({ ...prev, visible: false }));
        }, 3000);
    };

    const handleImagePick = async () => {
        try {
            const imageUri = await uploadImage();
            if (imageUri) {
                setFormData(prev => ({
                    ...prev,
                    profile_image: imageUri
                }));
            }
        } catch (error) {
            showStatusModal('error', 'Resim seçilirken bir hata oluştu');
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            // Validations
            if (!formData.name.trim()) {
                showStatusModal('error', 'İsim alanı boş bırakılamaz');
                return;
            }

            const response = await updateUser(formData);
            
            if (response.status) {
                showStatusModal('success', 'Profil başarıyla güncellendi');
                setTimeout(() => {
                    navigation.goBack();
                }, 2000);
            } else {
                showStatusModal('error', response.message || 'Güncelleme başarısız');
            }
        } catch (error) {
            showStatusModal('error', 'Profil güncellenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesomeIcon icon={faArrowLeft} size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.formSection}>
                    <View style={styles.imageSection}>
                        <TouchableOpacity 
                            style={styles.profileImageContainer}
                            onPress={handleImagePick}
                        >
                            <View style={styles.profileImage}>
                                {formData.profile_image ? (
                                    <Image 
                                        source={{ uri: formData.profile_image }} 
                                        style={styles.image}
                                    />
                                ) : (
                                    <Text style={styles.imageInitials}>
                                        {formData.name.split(' ').map(n => n[0]).join('')}
                                    </Text>
                                )}
                            </View>
                            <View style={styles.cameraButton}>
                                <FontAwesomeIcon icon={faCamera} size={20} color="#fff" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formCard}>
                        <Text style={styles.sectionTitle}>Personal Information</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.name}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                                placeholder="Enter your full name"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={[styles.input, styles.disabledInput]}
                                value={formData.email}
                                editable={false}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.phone_number}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, phone_number: text }))}
                                placeholder="Enter your phone number"
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    <View style={styles.formCard}>
                        <Text style={styles.sectionTitle}>Address Information</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Address</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.address}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
                                placeholder="Enter your address"
                                multiline
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>City</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.city}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, city: text }))}
                                placeholder="Enter your city"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Country</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.country}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, country: text }))}
                                placeholder="Enter your country"
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.clear} />
            </ScrollView>

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
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#fff',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Montserrat-Bold',
    },
    saveButton: {
        padding: 8,
        paddingHorizontal: 12,
        backgroundColor: '#4ECDC4',
        borderRadius: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Montserrat-Medium',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    formSection: {
        gap: 20,
    },
    imageSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImageContainer: {
        position: 'relative',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#4ECDC4',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageInitials: {
        fontSize: 40,
        color: '#fff',
        fontFamily: 'Montserrat-Bold',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#4ECDC4',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    formCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        marginBottom: 20,
        color: '#333',
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontFamily: 'Montserrat-Medium',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        fontFamily: 'Montserrat-Regular',
        color: '#333',
    },
    disabledInput: {
        backgroundColor: '#f8f8f8',
        color: '#666',
    },
    clear: {
        height: 40,
    },
});

export default MyProfileEditScreen; 