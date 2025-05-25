import { View, Text, StyleSheet, Image, TouchableOpacity  } from 'react-native';

export default function UserCard({ name, status, avatar, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* <Image source={{ uri: avatar }} style={styles.avatar} /> */}
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        {/* <Text style={styles.status}>{status}</Text> */}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    color: 'gray',
  },
});
