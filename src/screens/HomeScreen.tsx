import React from 'react';
import { View, Text, Alert, Button } from 'react-native';
import { useAuth } from '../context/AuthContext';

const HomeScreen = () => {
    const { onLogout } = useAuth();

    const handleLogout = () => {
        Alert.alert(
          'Çıkış Yap',
          'Uygulamadan çıkış yapmak istediğinize emin misiniz?',
          [
            { text: 'İptal', style: 'cancel' },
            { 
              text: 'Çıkış Yap', 
              onPress: () => onLogout?.(),
              style: 'destructive'
            }
          ]
        );
      };

    return (
        <View> 
            <Text>Home Screen</Text>
            <Button title="Çıkış Yap" onPress={handleLogout} />
        </View>
    );
};

export default HomeScreen;