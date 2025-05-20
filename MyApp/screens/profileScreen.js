import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useContext } from 'react';
import { UserContext } from '../context/userData';

export default function ProfileScreen() {
  const { userData, setIsLogged } = useContext(UserContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профиль</Text>
      <Text style={styles.info}>Имя пользователя: {userData?.username}</Text>
      <Text style={styles.info}>Email: {userData?.email}</Text>

      <TouchableOpacity style={styles.button} onPress={()=>{setIsLogged(false)}}>
        <Text style={styles.buttonText}>Выйти</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16,
  },
  title: {
    fontSize: 24, marginBottom: 24,
  },
  info: {
    fontSize: 16, marginBottom: 8,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#FF5252',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff', fontSize: 16,
  },
});
