import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UserContext } from '../context/userData';
import { useContext } from 'react';

export default function ChatCard({ lastMessageUsername, lastMessageUserId, chatName, lastMessage, time, onPress }) {
  const {userData} = useContext(UserContext);
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.name}>{chatName}</Text>
          <Text style={styles.message}>{lastMessageUserId == userData.id ? ("Вы: ") : ""}{lastMessage}</Text>
        </View>
        <Text style={styles.time}>{time}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  textBlock: {
    flex: 1,
    marginRight: 8,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: 'gray',
  },
  time: {
    fontSize: 12,
    color: 'gray',
  },
});
