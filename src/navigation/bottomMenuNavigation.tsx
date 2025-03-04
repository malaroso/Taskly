import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faList, faFile, faPlus, faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons';
import HomeScreen from '../screens/HomeScreen';
import TasksScreen from '../screens/tasks/TasksScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import AddTaskScreen from '../screens/tasks/AddTaskScreen';
import Messages from '../screens/Messages';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }: { children: React.ReactNode, onPress: () => void }) => (
  <TouchableOpacity
    style={styles.customButton}
    onPress={onPress}
  >
    {children}
  </TouchableOpacity>
);

const BottomMenuNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = faList;
          } else if (route.name === 'Tasks') {
            iconName = faFile;
          } else if (route.name === 'Add') {
            iconName = faPlus;
          } else if (route.name === 'Chat') {
            iconName = faPaperPlane;
          } else if (route.name === 'Profile') {
            iconName = faUser;
          }

          return <FontAwesomeIcon icon={iconName as IconProp} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6A5ACD',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen
        name="Add"
        component={AddTaskScreen  }
        options={{
          tabBarButton: (props) => (
            <CustomTabBarButton {...props}>
              <FontAwesomeIcon icon={faPlus} size={24} color="#fff" />
            </CustomTabBarButton>
          ),
        }}
      />
      <Tab.Screen name="Chat" component={Messages} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: '#fff',
    height: 70,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: '#ddd',
    paddingTop: 10,
    borderWidth: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    justifyContent: 'center',
  },
  customButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6A5ACD',
    borderRadius: 35,
    width: 70,
    height: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default BottomMenuNavigation; 