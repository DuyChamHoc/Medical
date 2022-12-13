import React from 'react'
import { View, StatusBar, StyleSheet } from 'react-native'
import { colors } from './src/global/styles'
import RootNavigator from './src/navigation/rootNavigation';
import { SignInContextProvider } from './src/contexts/authContext'
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications


export default function App() {
  return (
    <SignInContextProvider>
      <View style={styles.container}>
        <StatusBar
          barStyle='light-content'
          backgroundColor={colors.statusbar}
        />
        <RootNavigator />
      </View>
    </SignInContextProvider>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 }
})