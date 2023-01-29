import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import HeaderAdress from '../components/HeaderAdress';
import {useTranslation} from 'react-i18next';
import {useSelector, useDispatch} from 'react-redux';
import {useTheme} from 'react-native-paper';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import firestore from '@react-native-firebase/firestore';
const InforShipping = ({navigation}) => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const data = useSelector(state => state.dataReducer.dataUser);
  const [name, setname] = useState(data.full_name);
  const [phonenumber, setphonenumber] = useState(data.phone_number);
  const [address, setaddress] = useState(data.address);
  const [check, setcheck] = useState();

  async function update() {
    const newdata = {...data};
    newdata.full_name = name;
    newdata.phone_number = phonenumber;
    newdata.address = address;
    console.log(newdata)
    if (check) {
      firestore()
        .collection('Users')
        .doc(data.uid)
        .set({
          phone_number: phonenumber,
          full_name: name,
          datetime: data.datetime,
          sex: data.sex,
          address: address,
          roll: 3,
          isLanguage: data.isLanguage,
          isDarkMode: data.isDarkMode,
          uid: data.uid,
        })
        .then(() => {
          console.log('User updated!');
        });
    }
    dispatch({type: 'ADD_DATA', payload: newdata});
    navigation.goBack();
  }
  return (
    <View style={{flex: 1}}>
      <HeaderAdress navigation={navigation} title={t('Thông tin giao hàng')} />
      <View style={{padding: 10}}>
        <View style={{marginTop: 10}}>
          <Text style={{color: colors.text, fontSize: 16}}>
            {t('Tên người dùng')}
          </Text>
          <View style={styles.view6}>
            <TextInput
              placeholder={t('Tên người dùng')}
              style={styles.input1}
              autoFocus={true}
              onChangeText={txt => setname(txt)}
              value={name}
            />
          </View>
        </View>
        <View style={{marginTop: 10}}>
          <Text style={{color: colors.text, fontSize: 16}}>
            {t('Số điện thoại')}
          </Text>
          <View style={styles.view6}>
            <TextInput
              placeholder={t('Số điện thoại')}
              style={styles.input1}
              keyboardType="number-pad"
              autoFocus={true}
              onChangeText={txt => setphonenumber(txt)}
              value={phonenumber}
            />
          </View>
        </View>
        <View style={{marginTop: 10}}>
          <Text style={{color: colors.text, fontSize: 16}}>{t('Địa chỉ')}</Text>
          <View style={styles.view6}>
            <TextInput
              placeholder={t('Địa chỉ')}
              style={styles.input1}
              autoFocus={true}
              onChangeText={txt => setaddress(txt)}
              value={address}
            />
          </View>
        </View>
        <View
          style={{flexDirection: 'row', marginTop: 30, alignItems: 'center'}}>
          <BouncyCheckbox
            style={{fontSize: 15}}
            iconStyle={{borderColor: 'lightgray', borderRadius: 15}}
            fillColor="green"
            onPress={checkboxValue => setcheck(checkboxValue)}
          />
          <Text>{t('Sử dụng mặc định thông tin này')}</Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: 'red',
            width: '100%',
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
            borderRadius: 10,
          }}
          onPress={() => {
            update();
          }}>
          <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
            {t('Xong')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InforShipping;

const styles = StyleSheet.create({
  view6: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    paddingLeft: 5,
    marginTop: 10,
    height: 50,
  },
  input1: {
    fontSize: 16,
  },
});
