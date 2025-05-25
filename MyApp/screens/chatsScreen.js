import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ChatCard from '../entities/chatCard';
// import { API_URL } from '@env';
import { API_URL, WS_URL } from '../MainApp';
import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { UserContext } from '../context/userData';

export default function ChatsScreen() {
  const [chatsArr, setChatsArr] = useState([]);
  const navigation = useNavigation();
  const {userData} = useContext(UserContext)
  const ws = useRef(null);

  async function getChats() {
    try {
      const response = await fetch(`${API_URL}users/${userData.id}/chats`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const responseData = await response.json();
        setChatsArr(responseData); 
        // console.log("chat:", responseData);
      } else {
        console.log("Ошибка при запросе чатов ");
      }
    } catch (error) { 
      console.log("Ошибка сети: ", error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getChats();
      wsConnect();
    }, [])
  );

  useEffect(()=>{
    getChats();
  }, [])

  const wsConnect = () => {
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => { 
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      
      if (data.type === 'new_message') {
        // Обновляем локальные сообщения новым сообщением
        getChats();
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
      <ScrollView style={styles.scrollContent}>
        {chatsArr.map((chat, i) => (
          <ChatCard
            chatName={chat.participants.find(p => p.id !== userData.id)?.username || 'Unknown'}
            lastMessage={chat.last_message_content}
            lastMessageUsername={chat.last_message_username}
            lastMessageUserId={chat.last_message_user_id}
            time={chat.last_message_created_at?.slice(11, 16)}
            key={chat.chat_id}
            onPress={() => navigation.navigate('ChatView', {
              chatId: chat.chat_id,
              chatName: chat.participants.find(p => p.id !== userData.id)?.username
            })}
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
