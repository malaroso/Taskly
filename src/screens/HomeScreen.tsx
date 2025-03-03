import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Modal, Image, ScrollView, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faTasks, faClipboardCheck, faTimesCircle, faFilter, faChevronRight, faCheckSquare, faBell, faCalendar, faRefresh, faSignOut, faB } from '@fortawesome/free-solid-svg-icons';
import { getUserTasks } from '../services/taskService';
import { Task } from '../types/taskTypes';
import AlertComponent from '../components/AlertComponent';
import CustomModal from '../components/CustomModal';
import { useAuth } from '../context/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getUnreadCount } from '../services/notificationService';
import LottieView from 'lottie-react-native';

export type RootStackParamList = {
  TaskDetail: { taskID: number };
  Notification: undefined;
  // ... diğer ekranlar gerekirse eklenir
};


const { width, height } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
    const [filter, setFilter] = useState('All Tasks');
    const [modalVisible, setModalVisible] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigation = useNavigation<NavigationProp>();
    const { onLogout } = useAuth();

    useFocusEffect(
        useCallback(() => {
            const fetchTasks = async () => {
                try {
                    const response = await getUserTasks();
                    if (response.status) {
                        setTasks(response.data);
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
            fetchUnreadCount();
        }, [])
    );

    const fetchUnreadCount = async () => {
        try {
            const response = await getUnreadCount();
            if (response.status) {
                setUnreadCount(response.count);
            }
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const filteredTasks = filter === 'All Tasks' ? tasks : tasks.filter(task => {
        switch (filter) {
            case 'Ongoing':
                return task.status === 'in_progress';
            case 'In Process':
                return task.status === 'pending';
            case 'Complete':
                return task.status === 'completed';
            case 'Cancel':
                return task.status === 'cancel';
            default:
                return true;
        }
    });

    const renderEmptyList = () => (
      <View style={styles.emptyContainer}>
          <LottieView
              source={require('../../assets/images/planetr.json')}
              autoPlay
              loop
              style={styles.lottieAnimation}
          />
          <Text style={styles.emptyTitle}>There are no tasks!</Text>
          <Text style={styles.emptySubtitle}>
              Create a new task by clicking the + button in the top right corner
          </Text>
      </View>
  );

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
        <TouchableOpacity onPress={() => navigation.navigate('TaskDetail', { taskID: item.task_id })}>
          <View style={styles.taskContainer}>
            <FontAwesomeIcon icon={iconName} size={20} color="#666" style={styles.taskIcon} />
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle} numberOfLines={2} ellipsizeMode="tail">
                {item.title}
              </Text>
              <Text style={styles.taskDescription} numberOfLines={4} ellipsizeMode="tail">
                {item.description}
              </Text>
            </View>
            <View style={styles.taskUsers}>
              {item.other_user_images.slice(0, 3).map((user: string, index: number) => (
                <Image key={index} source={{ uri: user }} style={[styles.userAvatar, { left: index * -12 }]} />
              ))}
            </View>
            <FontAwesomeIcon icon={faChevronRight} size={20} color="#666" />
          </View>
        </TouchableOpacity>
      );
    };

    const handleLogout = () => {
        setLogoutModalVisible(true);
    };

    const handleFilterChange = (newFilter: string) => {
        setFilter(newFilter);
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
                <View style={styles.headerRight}>
                  <TouchableOpacity 
                    style={styles.notificationButton} 
                    onPress={() => navigation.navigate('Notification')}
                  >
                    <FontAwesomeIcon icon={faBell} size={24} color="#333" />
                    {unreadCount > 0 && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleLogout}> 
                    <FontAwesomeIcon icon={faSignOut} size={24} color="#333" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.title}>Today</Text>
              <View style={styles.cardContainer}>
                  <View style={styles.cardRow}>
                      <TouchableOpacity 
                          style={[
                              styles.card, 
                              styles.ongoing,
                              filter === 'Ongoing' && styles.selectedCard
                          ]}
                          onPress={() => handleFilterChange('Ongoing')}
                      >
                          <View style={styles.bubble} />
                          <Text style={styles.cardText}>Ongoing</Text>
                          <FontAwesomeIcon icon={faTasks} size={24} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                          style={[
                              styles.card, 
                              styles.inProcess,
                              filter === 'In Process' && styles.selectedCard
                          ]}
                          onPress={() => handleFilterChange('In Process')}
                      >
                          <Text style={styles.cardText}>In Process</Text>
                          <View style={styles.bubble2} />
                          <FontAwesomeIcon icon={faRefresh} size={24} color="#fff" />
                      </TouchableOpacity>
                  </View>
                  <View style={styles.cardRow}>
                      <TouchableOpacity 
                          style={[
                              styles.card, 
                              styles.complete,
                              filter === 'Complete' && styles.selectedCard
                          ]}
                          onPress={() => handleFilterChange('Complete')}
                      >
                          <View style={styles.bubble3} />
                          <Text style={styles.cardText}>Complete</Text>
                          <FontAwesomeIcon icon={faClipboardCheck} size={24} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                          style={[
                              styles.card, 
                              styles.cancel,
                              filter === 'Cancel' && styles.selectedCard
                          ]}
                          onPress={() => handleFilterChange('Cancel')}
                      >
                          <View style={styles.bubble4} />
                          <Text style={styles.cardText}>Cancel</Text>
                          <FontAwesomeIcon icon={faTimesCircle} size={24} color="#fff" />
                      </TouchableOpacity>
                  </View>
              </View>      
            </View>

            <View style={styles.tasksArea}>
              <View style={styles.taskHeader}>
                  <TouchableOpacity 
                      style={[
                          styles.filterButton,
                          filter === 'All Tasks' && styles.selectedFilterButton
                      ]}
                      onPress={() => handleFilterChange('All Tasks')}
                  >
                    <Text style={styles.filterText}>
                        {filter === 'All Tasks' ? 'All Tasks' : `Filtered: ${filter}`}
                    </Text>
                    <FontAwesomeIcon icon={faFilter} size={18} color="#FFF" />
                  </TouchableOpacity>
                </View>
                <FlatList
                    data={filteredTasks}
                    renderItem={renderTask}
                    keyExtractor={item => item.task_id.toString()}
                    ListEmptyComponent={renderEmptyList}
                />
            </View>
          </View>
          <View style={styles.clearArea} />
        </ScrollView>

        <CustomModal 
            visible={logoutModalVisible} 
            title="Logout" 
            message="Are you sure you want to logout?"
            onConfirm={() => {
                setLogoutModalVisible(false);
                onLogout?.();
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
        justifyContent: 'flex-end',
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
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  notificationButton: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Montserrat-Bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: -80,
  },
  lottieAnimation: {
    width: width * 0.5,
    height: width * 0.5,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#333',
    marginTop: -20,
    marginBottom: 10,
    textAlign: 'center',
},
emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#666',
    textAlign: 'center',
    maxWidth: '80%',
},
selectedCard: {
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
},
selectedFilterButton: {
    backgroundColor: '#4ECDC4',
}
});

export default HomeScreen;