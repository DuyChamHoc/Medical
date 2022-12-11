import React, {useState, useContext, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {
  View,
  Text,
  Alert,
  Switch,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {Avatar, Icon} from 'react-native-elements';
import {colors} from '../global/styles';
import {SignInContext} from '../contexts/authContext';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager} from 'react-native-fbsdk-next';
import firestore from '@react-native-firebase/firestore';
import {useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {Picker} from '@react-native-picker/picker';
GoogleSignin.configure({
  webClientId:
    '359199845323-h10e31djcqb9fbobv2vknmh1h1h5hge0.apps.googleusercontent.com',
});

export default function DrawerContent(props) {
  const user = auth().currentUser;
  const {colors} = useTheme();
  const {t} = useTranslation();
  const [selectedValue, setSelectedValue] = useState('');
  const {dispatchSignedIn} = useContext(SignInContext);
  const [getcart, setcart] = useState(0);
  const [getstatus, setstatus] = useState(0);
  const [DarkMode, setDarkMode] = useState(false);
  const [fullname, setfullname] = useState('');
  useEffect(() => {
    firestore()
      .collection('Users')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setDarkMode(documentSnapshot.data().isDarkMode);
          setSelectedValue(documentSnapshot.data().isLanguage);
        }
      });
    firestore()
      .collection('Cart')
      .doc(user.uid)
      .onSnapshot(snapshot => {
        if (!snapshot.exists) {
          setcart(0);
        } else {
          setcart(snapshot.data().listcart.length);
        }
      });
    firestore()
      .collection('Order')
      .doc(user.uid)
      .onSnapshot(snapshot => {
        if (!snapshot.exists) {
          setstatus(0);
        } else {
          setstatus(snapshot.data().listorder.length);
        }
      });
  }, []);
  const update = () => {
    firestore()
      .collection('Users')
      .doc(user.uid)
      .update({
        isDarkMode: !DarkMode,
      })
      .then(() => {
        console.log('User updated!');
        setDarkMode(!DarkMode);
      });
  };
  async function signOut() {
    firestore()
      .collection('User' + user.uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          update2(documentSnapshot.id);
        });
      });
    try {
      auth()
        .signOut()
        .then(() => {
          GoogleSignin.revokeAccess();
          GoogleSignin.signOut();
          LoginManager.logOut();
          dispatchSignedIn({
            type: 'UPDATE_SIGN_IN',
            payload: {userToken: null},
          });
        });
    } catch (errot) {
      Alert.alert(error.name, error.message);
    }
  }
  const updatelang = value => {
    firestore()
      .collection('Users')
      .doc(user.uid)
      .update({
        isLanguage: value,
      })
      .then(() => {
        console.log('User updated!');
      });
  };
  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View
          style={{
            backgroundColor: colors.buttons,
            marginTop: -3,
            marginBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: colors.text,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.buttons,
              paddingLeft: 20,
              paddingVertical: 10,
            }}>
            <Avatar
              size={75}
              rounded
              avatarStyle={styles.avatar}
              source={{
                uri: user.photoURL
                  ? user.photoURL
                  : 'https://i.ytimg.com/vi/jH7e1fDcZnY/maxresdefault.jpg',
              }}
            />

            <View style={{marginLeft: 15}}>
              <Text
                style={{fontWeight: 'bold', fontSize: 18, color: colors.text}}>
                {' '}
                {user.displayName ? user.displayName : fullname}
              </Text>
              <Text style={{fontSize: 13, color: colors.text}}>
                {user.email ? user.email : ''}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              paddingBottom: 15,
              paddingTop: 10,
            }}>
            <View style={{flexDirection: 'row', marginTop: 0}}>
              <View
                style={{
                  marginLeft: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: colors.text,
                    fontSize: 18,
                  }}>
                  {getstatus}
                </Text>
                <Text style={{color: colors.text, fontSize: 14}}>
                  {t('Đơn đang xử lý')}
                </Text>
              </View>
            </View>

            <View style={{flexDirection: 'row', marginTop: 0}}>
              <View
                style={{
                  marginLeft: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: colors.text,
                    fontSize: 18,
                  }}>
                  {getcart}
                </Text>
                <Text style={{color: colors.text, fontSize: 14}}>
                  {t('Giỏ hàng')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <DrawerItemList {...props} />

        <View
          style={{
            borderTopWidth: 1,
            marginTop: 5,
            borderTopColor: colors.text,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: colors.text,
              paddingTop: 15,
              paddingLeft: 20,
            }}>
            {t('Chủ đề')}
          </Text>
          <View style={styles.switchText}>
            <Text
              style={{
                fontSize: 16,
                color: colors.text,
                paddingTop: 10,
                paddingLeft: 0,
                fontWeight: 'bold',
              }}>
              {t('Ngôn ngữ')}
            </Text>
            <View style={{marginTop: 10}}>
              <Picker
                selectedValue={selectedValue}
                style={{height: 50, width: 150, color: colors.text}}
                onValueChange={(itemValue, itemIndex) => {
                  setSelectedValue(itemValue);
                  updatelang(itemValue);
                }}>
                <Picker.Item label="Việt Nam" value="vi" />
                <Picker.Item label="English" value="en" />
              </Picker>
            </View>
          </View>
          <View style={styles.switchText}>
            <Text
              style={{
                fontSize: 16,
                color: colors.text,
                paddingTop: 10,
                paddingLeft: 0,
                fontWeight: 'bold',
              }}>
              {t('Chủ đề tối')}
            </Text>
            <View style={{paddingRight: 10}}>
              <Switch
                value={DarkMode}
                onValueChange={() => {
                  update();
                }}
              />
            </View>
          </View>
        </View>
      </DrawerContentScrollView>

      <TouchableOpacity
        onPress={() => {
          signOut();
        }}>
        <DrawerItem
          label={t('Đăng xuất')}
          icon={({color, size}) => (
            <Icon
              type="material-community"
              name="logout-variant"
              color={color}
              size={40}
              onPress={() => {
                signOut();
              }}
            />
          )}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatar: {
    borderWidth: 4,
    borderColor: colors.cardbackground,
  },
  preferences: {
    fontSize: 16,
    color: colors.grey2,
    paddingTop: 10,
    paddingLeft: 20,
  },

  switchText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingVertical: 5,
    paddingRight: 10,
  },
  darkthemeText: {
    fontSize: 16,
    color: colors.grey2,
    paddingTop: 10,
    paddingLeft: 0,
    fontWeight: 'bold',
  },
});
