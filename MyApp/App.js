import React from 'react';
import UserProvider from './context/userData';
import MainApp from './MainApp'; // выделим основную логику в отдельный файл

export default function App() {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
}
