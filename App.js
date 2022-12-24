import React from 'react';
import {View, StatusBar, StyleSheet, Text, Image} from 'react-native';
import {colors} from './src/global/styles';
import RootNavigator from './src/navigation/rootNavigation';
import {SignInContextProvider} from './src/contexts/authContext';
import {useNetInfo} from '@react-native-community/netinfo';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']);
LogBox.ignoreAllLogs();

export default function App() {
  const netInfo = useNetInfo();
  console.log();
  return (
    <SignInContextProvider>
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.statusbar}
        />
        <>
          {netInfo.isConnected ? (
            <RootNavigator />
          ) : (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <View>
                <Image
                  style={{height: 150, width: 150}}
                  source={{
                    uri: 'https://www.citypng.com/public/uploads/small/31634946988mnswcxlimpkw4u1dflkxmry9lkvhan6y0zukhxgmhftfygemlw8wrubzyjgz0wlvqb07vf4llhsd3vwsdspxx2wn63ba15lvswlr.png',
                  }}
                />
                <Text>No network connection</Text>
              </View>
            </View>
          )}
        </>
        {/*   */}
      </View>
    </SignInContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
});
