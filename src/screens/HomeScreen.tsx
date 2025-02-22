import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Modal, Image, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faTasks, faClipboardCheck, faTimesCircle, faFilter, faChevronRight, faCheckSquare, faBell, faCalendar, faRefresh, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { getUserTasks } from '../services/taskService';
import { Task } from '../types/taskTypes';
import AlertComponent from '../components/AlertComponent';
import CustomModal from '../components/CustomModal';
import { useAuth } from '../context/AuthContext';

const HomeScreen = () => {
    const [filter, setFilter] = useState('All Tasks');
    const [modalVisible, setModalVisible] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);

    const { onLogout } = useAuth();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await getUserTasks();
                if (response.status) {
                    setTasks(response.data);
                    console.log(response.data);
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
                AlertComponent({
                    title: 'Error',
                    message: 'Error fetching tasks',
                    status: 'error',
                    visible: true,
                    onClose: () => {},
                });
            }
        };

        fetchTasks();
    }, []);

    const filteredTasks = filter === 'All Tasks' ? tasks : tasks.filter(task => {
        switch (filter) {
            case 'Ongoing':
                return task.status === 'in_progress';
            case 'In Process':
                return task.status === 'pending';
            case 'Complete':
                return task.status === 'success';
            case 'Cancel':
                return task.status === 'cancel';
            default:
                return true;
        }
    });

    const renderTask = ({ item }: { item: Task }) => {
      let iconName;

      switch (item.status) {
        case 'Ongoing':
          iconName = faTasks;
          break;
        case 'In Process':
          iconName = faRefresh;
          break;
        case 'Complete':
          iconName = faCheckSquare;
          break;
        case 'Cancel':
          iconName = faTimesCircle;
          break;
        default:
          iconName = faTasks;
      }

      return (
        <View style={styles.taskContainer}>
          <FontAwesomeIcon icon={iconName} size={20} color="#666" style={styles.taskIcon} />
          <View style={styles.taskInfo}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskDescription}>{item.description}</Text>
          </View>
          <View style={styles.taskUsers}>
            {item.other_user_images.slice(0, 3).map((user: string, index: number) => (
              <Image key={index} source={{ uri: user }} style={[styles.userAvatar, { left: index * -12 }]} />
            ))}
          </View>
          <FontAwesomeIcon icon={faChevronRight} size={20} color="#666" />
        </View>
      );
    };

    const handleLogout = () => {
        setLogoutModalVisible(true);
    };

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.topContainer}>
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <FontAwesomeIcon icon={faCalendar} size={24} color="#333" />
                  <Text style={styles.date}>Jun 20, 2020</Text>
                </View>
                <TouchableOpacity onPress={handleLogout}> 
                  <FontAwesomeIcon icon={faSignOut} size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <Text style={styles.title}>Today</Text>
              <View style={styles.cardContainer}>
                  <View style={styles.cardRow}>
                      <TouchableOpacity style={[styles.card, styles.ongoing]}>
                          <View style={styles.bubble} />
                          <Text style={styles.cardText}>Ongoing</Text>
                          <FontAwesomeIcon icon={faTasks} size={24} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.card, styles.inProcess]}>
                          <Text style={styles.cardText}>In Process</Text>
                          <View style={styles.bubble2} />
                          <FontAwesomeIcon icon={faClipboardCheck} size={24} color="#fff" />
                      </TouchableOpacity>
                  </View>
                  <View style={styles.cardRow}>
                      <TouchableOpacity style={[styles.card, styles.complete]}>
                          <View style={styles.bubble3} />
                          <Text style={styles.cardText}>Complete</Text>
                          <FontAwesomeIcon icon={faClipboardCheck} size={24} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.card, styles.cancel]}>
                          <View style={styles.bubble4} />
                          <Text style={styles.cardText}>Cancel</Text>
                          <FontAwesomeIcon icon={faTimesCircle} size={24} color="#fff" />
                      </TouchableOpacity>
                  </View>
              </View>      
            </View>

            <View style={styles.tasksArea}>
              <View style={styles.taskHeader}>
                  <TouchableOpacity style={styles.addTaskButton}>
                    <Text style={styles.addTask}>Add Task</Text>
                    <View style={styles.addTaskIcon}>
                      <FontAwesomeIcon icon={faPlus} size={18}  color="#FFF" />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.filterButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.filterText}>{filter}</Text>
                    <FontAwesomeIcon icon={faFilter} size={18} color="#FFF" />
                  </TouchableOpacity>
                </View>
                <FlatList
                    data={filteredTasks}
                    renderItem={renderTask}
                    keyExtractor={item => item.task_id.toString()}
                />
            </View>
          </View>
          <View style={styles.clearArea} />
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {['All Tasks', 'Ongoing', 'In Process', 'Complete', 'Cancel'].map(status => (
                <TouchableOpacity
                  key={status}
                  style={styles.modalButton}
                  onPress={() => {
                    setFilter(status);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalButtonText}>{status}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        <CustomModal
          visible={logoutModalVisible}
          title="Çıkış Yap"
          message="Çıkmak ister misiniz?"
          onConfirm={() => {
            setLogoutModalVisible(false);
            onLogout();
          }}
          onCancel={() => setLogoutModalVisible(false)}
        />

      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f1',
    },
    topContainer:{
      backgroundColor: '#fff',
      padding: 20,
      borderBottomLeftRadius: 40,
      borderBottomRightRadius: 40,
      marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    date: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'Montserrat-Medium',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        fontFamily: 'Montserrat-Medium',
    },
    cardContainer: {
        marginBottom: 20,
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    card: {
        width: '48%',
        height: 100,
        borderRadius: 10,
        fontFamily: 'Montserrat-Medium',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ongoing: {
        backgroundColor: '#6A5ACD',
    },
    inProcess: {
        backgroundColor: '#FFA500',
    },
    complete: {
        backgroundColor: '#4CAF50',
    },
    cancel: {
        backgroundColor: '#FF6347',
    },
    headerLeft:{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    cardText: {
        color: '#fff',
        fontWeight: 'bold',
        fontFamily: 'Montserrat-Medium',
        marginBottom: 10,
    },
    taskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    addTask: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Montserrat-Medium',
    },
    tasksArea: {
      paddingLeft: 20,
      paddingRight: 20,
    },
    taskContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
    },
    taskIcon: {
        marginRight: 10,
    },
    taskInfo: {
        flex: 1,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Montserrat-Medium',
    },
    taskDescription: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Montserrat-Medium',
    },
    taskUsers: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        width: 70,
        overflow: 'hidden',
    },
    userAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        left: 0,
        zIndex: 1,
        borderWidth: 2,
        borderColor: '#f0f0f1',
    },
    addTaskIcon:{
      backgroundColor: '#FFA500',
      padding: 7,
      borderRadius: 40,
    },
    taskStatus: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskStatusText: {
        marginRight: 5,
        color: '#666',
    },
    bubble: {
      position: 'absolute',
      width: 100,
      height: 100,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 50,
      top: -20,
      left: -20,
  },
  bubble2: {
    position: 'absolute',
    width: 70,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    right: -20,
    top: -20,
  },
  bubble3: {
    position: 'absolute',
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    right: -40,
    bottom: -20,
  },
  bubble4: {
    position: 'absolute',
    width: 56,
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    left: 0,
    top: -10,
  },
  addTaskButton: {
    padding: 10,
    gap: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    padding: 10,
    backgroundColor: '#FFA500',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    fontFamily: 'Montserrat-Medium',
    alignItems: 'center',
  },
  modalButton: {
    padding: 10,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#f0f0f1',
    borderRadius: 5,
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: '#333',
  },
  clearArea:{
    height: 100,
  }
});

export default HomeScreen;