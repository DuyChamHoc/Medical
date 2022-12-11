import React, {useContext, useEffect, useState} from 'react';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
} from 'react-native-paper';
import AuthStack from './authStack';
import {AppStack} from './appStack';
import AdminStack from '../admin/navigation/AdminStack';
import {SignInContext} from '../contexts/authContext';
import {Provider as ReduxProvider} from 'react-redux';
import configureStore from '../../redux/store';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useTranslation} from 'react-i18next';
import ManagerStack from '../manager/navigation/ManagerStack';
const store = configureStore();
export default function RootNavigator() {
  const {i18n} = useTranslation();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const user = auth().currentUser;
  const {signedIn} = useContext(SignInContext);
  useEffect(() => {
    if (user != null) {
      i18n.changeLanguage('vi');
      firestore()
        .collection('Users')
        .doc(user.uid)
        .onSnapshot(snapshot => {
          if (snapshot.exists) {
            setIsDarkTheme(snapshot.data().isDarkMode);
            i18n.changeLanguage(snapshot.data().isLanguage);
          }
        });
    } else {
      setIsDarkTheme(false);
    }
  }, []);
  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      primary: '#6BC8FF',
      secondary: '#36a0ef',
      tertiary: '#5E6977',
      accent: '#FF5A5A',
      text: '#000000',
      text1: '#ffffff',
      boxes: '#ebf3f4',
      money: 'red',
      buttonx: '#38c3f4',
    },
  };

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#222222',
      text: '#ffffff',
      boxes: '#35373d',
      money: 'ffffff',
      buttonx: 'ffffff',
      secondary: '#ffffff',
      tertiary: '#ffffff',
    },
  };
  console.log('isDarkTheme', isDarkTheme);
  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;
  console.log(signedIn.userToken);
  return (
    <PaperProvider theme={theme}>
      <ReduxProvider store={store}>
        <NavigationContainer theme={theme}>
          {signedIn.userToken === null ? (
            <AuthStack />
          ) : (
            <>
              {signedIn.userToken === 1 ? (
                <AdminStack />
              ) : (
                <>
                  {signedIn.userToken === 3 ? <AppStack /> : <ManagerStack />}
                </>
              )}
            </>
          )}
        </NavigationContainer>
      </ReduxProvider>
    </PaperProvider>
  );
}
