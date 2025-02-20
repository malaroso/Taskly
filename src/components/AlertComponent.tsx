import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faExclamationCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';

type AlertComponentProps = {
    visible: boolean;
    title: string;
    message: string;
    onClose: () => void;
    status: 'success' | 'error' | 'pending';
};

const AlertComponent: React.FC<AlertComponentProps> = ({ visible, title, message, onClose, status }) => {
    const getIcon = () => {
        switch (status) {
            case 'success':
                return <FontAwesomeIcon icon={faCheckCircle} size={24} color="#4CAF50" />;
            case 'error':
                return <FontAwesomeIcon icon={faExclamationCircle} size={24} color="#FF0000" />;
            case 'pending':
                return <FontAwesomeIcon icon={faSpinner} size={24} color="#FFA500" />;
            default:
                return null;
        }
    };

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.alertBox}>
                    <View style={styles.iconContainer}>{getIcon()}</View>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>Tamam</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    alertBox: {
        width: 320,
        padding: 25,
        backgroundColor: '#fff',
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    iconContainer: {
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    message: {
        fontSize: 16,
        marginBottom: 25,
        textAlign: 'center',
        color: '#555',
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default AlertComponent;