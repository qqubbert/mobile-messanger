import { View, StyleSheet, ScrollView } from 'react-native';
import UserCard from '../entities/userCard';
import { API_URL, WS_URL } from '../MainApp';
import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { UserContext } from '../context/userData';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function UsersScreen({}) { 
  const [usersArr, setUsersArr] = useState([]);
  const { userData } = useContext(UserContext);
  const navigation = useNavigation();

  const currentUserId = userData.id;
  const ws = useRef(null);

  const handleUserPress = async (targetUser) => {
    try {
      // Попытка найти чат
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

      // Перейти к экрану чата
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

  useFocusEffect(
    useCallback(() => {
      getUsers();
      wsConnect();
    }, [])
  );

  const wsConnect = () => {
    ws.current = new WebSocket(WS_URL);
  
    ws.current.onopen = () => { 
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      
      if (data.type === 'new_user') {
        // Обновляем локальные сообщения новым сообщением
        getUsers();
      }

      // Можно добавить обработку новых чатов и других типов событий
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.current.close();
    };
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {usersArr && usersArr.map((user, i) => (
          <UserCard
            key={i}
            name={user.username}
            onPress={() => {console.log('Переход к чату'); handleUserPress(user)}}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingVertical: 10,
  },
});
