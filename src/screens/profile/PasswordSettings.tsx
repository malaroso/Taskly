import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { updatePassword } from '../../services/userService';

const PasswordSettingsScreen = () => {
    const navigation = useNavigation();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleUpdatePassword = async () => {
        try {
            setError('');
            setSuccess('');

            // Validations
            if (!currentPassword || !newPassword || !confirmPassword) {
                setError('Lütfen tüm alanları doldurun');
                return;
            }

            if (newPassword !== confirmPassword) {
                setError('Yeni şifreler eşleşmiyor');
                return;
            }

            if (newPassword.length < 6) {
                setError('Yeni şifre en az 6 karakter olmalıdır');
                return;
            }

            const response = await updatePassword(currentPassword, newPassword);
            
            if (response.status) {
                setSuccess(response.message);
                // Reset form
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setError(response.message);
            }
        } catch (error) {
            setError('Şifre güncellenirken bir hata oluştu');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesomeIcon icon={faArrowLeft} size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Password Settings</Text>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.infoArea}>
                    <Text style={styles.infoTitle}>Password Requirements</Text>
                    <View style={styles.infoList}>
                        <View style={styles.infoItem}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.infoText}>At least 8 characters long</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.infoText}>Include uppercase letters (A-Z)</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.infoText}>Include lowercase letters (a-z)</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.infoText}>Include numbers (0-9)</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.infoText}>Include special characters (!@#$%^&*)</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.formContainer}>
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    {success ? <Text style={styles.successText}>{success}</Text> : null}

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Current Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.input}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                secureTextEntry={!showCurrentPassword}
                                placeholder="Enter your current password"
                            />
                            <TouchableOpacity 
                                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                                style={styles.eyeIcon}
                            >
                                <FontAwesomeIcon 
                                    icon={showCurrentPassword ? faEyeSlash : faEye} 
                                    size={20} 
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>New Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.input}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry={!showNewPassword}
                                placeholder="Enter your new password"
                            />
                            <TouchableOpacity 
                                onPress={() => setShowNewPassword(!showNewPassword)}
                                style={styles.eyeIcon}
                            >
                                <FontAwesomeIcon 
                                    icon={showNewPassword ? faEyeSlash : faEye} 
                                    size={20} 
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirm New Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.input}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                                placeholder="Enter your new password again"
                            />
                            <TouchableOpacity 
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={styles.eyeIcon}
                            >
                                <FontAwesomeIcon 
                                    icon={showConfirmPassword ? faEyeSlash : faEye} 
                                    size={20} 
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity 
                        style={[
                            styles.updateButton,
                            (!currentPassword || !newPassword || !confirmPassword) && styles.disabledButton
                        ]} 
                        onPress={handleUpdatePassword}
                        disabled={!currentPassword || !newPassword || !confirmPassword}
                    >
                        <Text style={styles.updateButtonText}>Update Password</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.clear}></View>
            </ScrollView>
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
        padding: 20,
        backgroundColor: '#fff',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Montserrat-Bold',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontFamily: 'Montserrat-Medium',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
    },
    input: {
        flex: 1,
        padding: 12,
        fontSize: 16,
        fontFamily: 'Montserrat-Regular',
    },
    eyeIcon: {
        padding: 12,
    },
    updateButton: {
        backgroundColor: '#4ECDC4',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Montserrat-Medium',
    },
    disabledButton: {
        backgroundColor: '#ccc',
        opacity: 0.7,
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 14,
        fontFamily: 'Montserrat-Medium',
        marginBottom: 15,
        textAlign: 'center',
    },
    successText: {
        color: '#4ECDC4',
        fontSize: 14,
        fontFamily: 'Montserrat-Medium',
        marginBottom: 15,
        textAlign: 'center',
    },
    infoArea: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
    },
    infoTitle: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'Montserrat-Bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    infoList: {
        gap: 8,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    bulletPoint: {
        fontSize: 16,
        color: '#4ECDC4',
        marginRight: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Montserrat-Regular',
        flex: 1,
    },
    clear: {
        height: 100,
    },
});

export default PasswordSettingsScreen;  