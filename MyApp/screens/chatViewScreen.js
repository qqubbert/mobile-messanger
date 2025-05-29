import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import MessageCard from '../entities/messageCard';
// import { API_URL } from '@env';
import { API_URL } from '../MainApp';
import { WS_URL } from '../MainApp';
import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { UserContext } from '../context/userData';
import { useFocusEffect } from '@react-navigation/native';

export default function ChatViewScreen({ route }) {
  const { chatId, chatName } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const {userData} = useContext(UserContext);

  const ws = useRef(null);

  async function getMessages() {
    try {
      const response = await fetch(`${API_URL}chats/${chatId}/messages`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const responseData = await response.json();
        const messagesWithOwnership = responseData.map(msg => ({
          ...msg,
          isOwn: msg.user_id === userData.id
        }));
        setMessages(messagesWithOwnership);
        console.log("messagesWithOwnership: ", messagesWithOwnership);
      } else {
        console.log("Ошибка при запросе сообщений");
      }
    } catch (error) {
      console.log("Ошибка сети: ", error);
    }
  }

  const wsConnect = () => {
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => { 
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      
      if (data.type === 'new_message') {
        // Обновляем локальные сообщения новым сообщением
        console.log('new_message')
        getMessages();
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

  useFocusEffect(
    useCallback(() => {
      wsConnect();
    }, [])
  );

  async function sendMessage() {
    if (newMessage.trim() === '') return;

    try {
      const response = await fetch(`${API_URL}chats/${chatId}/messages`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify({ content: newMessage, userId: userData.id }),
      });

      if (response.ok) {
        setNewMessage('');
        getMessages();  // обновляем список сообщений после отправки
      } else {
        console.log("Ошибка при отправке сообщения");
      }
    } catch (error) {
      console.log("Ошибка сети: ", error);
    }
  }

  useEffect(()=>{
    getMessages();
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Чат с {chatName}</Text>
      <Text>ID чата: {chatId}</Text>

      <ScrollView style={styles.messagesContainer}>
        {messages && messages.map((message) => (
          <MessageCard
            key={message.id}
            username={message.username}
            content={message.content}
            time={message.created_at.slice(11, 16) || "14:30"}
            isOwn={message.isOwn}
          />
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Введите сообщение..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Отправить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
    marginTop: 12,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
