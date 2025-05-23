import { View, StyleSheet, ScrollView } from 'react-native';
import UserCard from '../entities/userCard';
// import { API_URL } from '@env';
import { API_URL } from '../MainApp';
import { useState, useEffect, useContext, useCallback } from 'react';
import { UserContext } from '../context/userData';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function UsersScreen({}) { 
  const [usersArr, setUsersArr] = useState([]);
  const { userData } = useContext(UserContext);
  const navigation = useNavigation();

  const currentUserId = userData.id;

  const handleUserPress = async (targetUser) => {
    try {
      // 1. Попробовать найти чат
      const response = await fetch(`${API_URL}get-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          user1_id: currentUserId,
          user2_id: targetUser.id, 
        }),
      });

      const chat = await response.json();
      console.log('Чат найден или создан:', chat);

      // 2. Перейти к экрану чата
      // Например, если используешь react-navigation:
      navigation.navigate("ChatView", {
          chatId: chat.id,
          chatName: targetUser.username
        });

    } catch (error) {
      console.error('Ошибка при обработке пользователя:', error);
    }
  };

  async function getUsers() {
    try { 
      const response = await fetch(`${API_URL}users`, {
        method: "GET",
        credentials: "include",
      });
       
      console.log("Response status: ", response.status);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log("Users:", responseData);
        setUsersArr(responseData);
      } else {
        console.log("Ошибка при запросе пользователей ");
      }
    } catch (error) {
      console.log("Ошибка сети: ", error);
    }
  };
  
  // useEffect(()=>{
  //   console.log(`${API_URL}users`);
  //   console.log('trying to get users');
  //   getUsers();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      getUsers();
    }, [])
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {usersArr && usersArr.map((user, i) => (
          <UserCard
            key={i}
            name={user.username}
            status="Онлайн"
            onPress={() => {console.log('Переход к чату'); handleUserPress(user)}}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Обязательно, чтобы ScrollView занимал весь экран
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingVertical: 10,
  },
});
