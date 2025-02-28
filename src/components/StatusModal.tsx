import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { StatusModalType } from '../types/modalTypes';

interface StatusModalProps {
    visible: boolean;
    type: StatusModalType;
    message: string;
}

export const StatusModal: React.FC<StatusModalProps> = ({ visible, type, message }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
        >
            <View style={styles.container}>
                <View style={[
                    styles.content,
                    type === 'success' ? styles.successContent : styles.errorContent
                ]}>
                    <View style={styles.iconContainer}>
                        <FontAwesomeIcon 
                            icon={type === 'success' ? faCheckCircle : faTimesCircle} 
                            size={24} 
                            color="#fff" 
                        />
                    </View>
                    <Text style={styles.message}>{message}</Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
    },
    content: {
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
    },
    successContent: {
        backgroundColor: '#4ECDC4',
    },
    errorContent: {
        backgroundColor: '#FF6B6B',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    message: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Montserrat-Medium',
        flex: 1,
    },
}); 