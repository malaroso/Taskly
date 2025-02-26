import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

interface FAQItem {
    question: string;
    answer: string;
}

const FAQ_DATA: FAQItem[] = [
    {
        question: "How do I create a new task?",
        answer: "To create a new task, go to the home screen and tap the '+' button. Fill in the task details such as title, description, due date, and assign team members if needed."
    },
    {
        question: "Can I assign multiple team members to a task?",
        answer: "Yes, you can assign multiple team members to a single task. When creating or editing a task, you can select multiple team members from your team list."
    },
    {
        question: "How do I track task progress?",
        answer: "You can track task progress by updating the task status. Available statuses include 'Pending', 'In Progress', 'Completed', and 'Cancelled'. The task status is visible on the task details screen."
    },
    {
        question: "How do notifications work?",
        answer: "You'll receive notifications for task assignments, updates, mentions in comments, and approaching deadlines. You can manage your notification preferences in the settings."
    },
    {
        question: "Can I attach files to tasks?",
        answer: "Yes, you can attach files to tasks. Supported file types include images, documents, and PDFs. Simply tap the attachment icon in the task details screen."
    },
    {
        question: "How do I change my password?",
        answer: "To change your password, go to Profile > Password Settings. You'll need to enter your current password and then set a new one."
    }
];

const FAQScreen = () => {
    const navigation = useNavigation();
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const toggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <FontAwesomeIcon icon={faArrowLeft} size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>FAQ</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.faqContainer}>
                    {FAQ_DATA.map((item, index) => (
                        <TouchableOpacity 
                            key={index}
                            style={[
                                styles.faqItem,
                                index === FAQ_DATA.length - 1 && styles.lastItem
                            ]}
                            onPress={() => toggleExpand(index)}
                        >
                            <View style={styles.questionContainer}>
                                <Text style={styles.question}>{item.question}</Text>
                                <FontAwesomeIcon 
                                    icon={expandedIndex === index ? faChevronUp : faChevronDown} 
                                    size={16} 
                                    color="#666" 
                                />
                            </View>
                            {expandedIndex === index && (
                                <Text style={styles.answer}>{item.answer}</Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
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
        flex: 1,
        padding: 20,
    },
    faqContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
    },
    faqItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f1',
    },
    lastItem: {
        borderBottomWidth: 0,
    },
    questionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    question: {
        fontSize: 16,
        fontFamily: 'Montserrat-Medium',
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    answer: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        color: '#666',
        marginTop: 10,
        lineHeight: 20,
    },
});

export default FAQScreen;
