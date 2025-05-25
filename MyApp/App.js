import React from 'react';
import UserProvider from './context/userData'; // Оборачиваем основную логику в контекст для работы с данными пользователя
import MainApp from './MainApp'; // Вынесение основную логику в отдельный файл

export default function App() {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
}
