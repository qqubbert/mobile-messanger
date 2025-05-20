import { View, Text, StyleSheet } from 'react-native';

export default function MessageCard({ username, content, time, isOwn }) {
  return (
    <View style={[styles.messageContainer, isOwn ? styles.ownMessage : styles.otherMessage]}>
      {!isOwn && <Text style={styles.username}>{username}</Text>}
      <Text style={styles.content}>{content}</Text>
      <Text style={styles.time}>{time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: '75%',
    marginVertical: 6,
    padding: 10,
    borderRadius: 12,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    marginRight: 10,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
    marginLeft: 10,
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#555',
  },
  content: {
    fontSize: 16,
  },
  time: {
    fontSize: 12,
    color: 'gray',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
});
