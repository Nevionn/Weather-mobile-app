import React from 'react';
import MainPage from './src/page/MainPage';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaProvider>
      <MainPage />
    </SafeAreaProvider>
  );
};

export default App;
