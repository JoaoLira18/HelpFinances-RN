import React from 'react';
import { StatusBar } from 'react-native'; 
import AppLoading from 'expo-app-loading';
import { ThemeProvider } from 'styled-components';

import 'intl';
import 'intl/locale-data/jsonp/pt-BR'

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
 } from '@expo-google-fonts/poppins'

import theme from './src/global/styles/theme';
import { Routes } from './src/routes';

import { AppRoutes } from './src/routes/app.routes';

import { AuthProvider, useAuth } from './src/hooks/auth';

import { SignIn } from './src/screens/SignIn'

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  const { userStorageLoading } = useAuth()

  if (!fontsLoaded || userStorageLoading) {
    return <AppLoading />
  }
  
  return (
    <ThemeProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar barStyle="light-content" />
          <AuthProvider>
            <Routes />
          </AuthProvider>

      </GestureHandlerRootView>
    </ThemeProvider>
  )
}