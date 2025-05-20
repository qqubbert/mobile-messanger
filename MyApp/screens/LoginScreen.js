import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useState, useContext } from 'react';
import { API_URL } from '../MainApp';
import { UserContext } from '../context/userData';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {isLogged, setIsLogged, userData, setUserData} = useContext(UserContext);

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log('Успешный вход:', data);
        // сохранить токен или перейти дальше
        setUserData(data);
        setIsLogged(true);
      } else {
        alert(data.error || 'Ошибка входа');
      }
    } catch (err) {
      console.error('Ошибка при входе:', err);
      alert('Ошибка соединения с сервером');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Авторизация</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Войти</Text>
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
  input: {
    width: '100%',
    maxWidth: 400,
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
