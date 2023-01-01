import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import Icon3 from 'react-native-vector-icons/EvilIcons';
import HeaderSimple from '../components/HeaderSimple';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import ViewCart from './ViewCart';
import {useDispatch} from 'react-redux';
import {useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
export default function MyShoppingScreen({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const user = auth().currentUser;
  const [getdata, setdata] = useState([]);
  const [check, getcheck] = useState(false);
  useEffect(() => {
    firestore()
      .collection('Cart')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setdata(documentSnapshot.data().listcart);
        }
      });
  }, [check]);
  const addd = () => {
    getcheck(!check);
  };
  const deleteCartToFireBase = id => {
    firestore()
      .collection('Cart')
      .doc(user.uid)
      .set({
        listcart: getdata.filter(item => item.id !== id),
      })
      .then(() => {
        console.log('remove cart!');
        addd();
      });
  };

  const dispatch = useDispatch();

  const selectItem = (item, checkboxValue) =>
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        ...item,
        checkboxValue: checkboxValue,
      },
    });
  const ListItem = ({item}) => {
    return (
      <ScrollView>
        <View style={{alignSelf: 'center', width: 380}}>
          <View
            style={{
              backgroundColor: colors.boxes,
              height: 160,
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <View style={{flexDirection: 'row', marginLeft: 8}}>
              <Image
                style={{width: 22, height: 22}}
                source={require('../global/image/store.png')}
              />
              <Text
                style={{
                  color: colors.text,
                  fontWeight: 'bold',
                  fontSize: 16,
                  marginLeft: 10,
                }}>
                {item.nhathuoc}
              </Text>
              <Icon3
                name="chevron-right"
                size={30}
                color={colors.text}
                style={{marginLeft: 10}}
              />
              <Icon3
                name="close"
                size={22}
                color={colors.text}
                style={{marginLeft: 'auto', marginRight: 10}}
                onPress={() => {
                  deleteCartToFireBase(item.id);
                }}
              />
            </View>
            <View style={{flexDirection: 'row', marginTop: 15}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <BouncyCheckbox
                  style={{marginLeft: 10}}
                  iconStyle={{borderColor: 'lightgray', borderRadius: 0}}
                  fillColor="green"
                  onPress={checkboxValue => selectItem(item, checkboxValue)}
                />
                <Image
                  style={{width: 80, height: 80, resizeMode: 'cover'}}
                  source={{uri: item.image[0]}}
                />
              </View>
              <View style={{marginLeft: 10}}>
                <View style={{width: 240, height: 20}}>
                  <Text style={{color: colors.text, fontSize: 16}}>
                    {item.name}
                  </Text>
                </View>
                <Text
                  style={{
                    color: 'red',
                    fontSize: 15,
                    fontWeight: 'bold',
                    marginTop: 10,
                  }}>
                  {item.gia}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };
  return (
    <View style={styles.container}>
      <HeaderSimple navigation={navigation} title={t('Giỏ Hàng')} />
      <View
        style={{
          height: 50,
          backgroundColor: '#eff2cc',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          source={require('../global/image/cart_purchase.png')}
          style={{height: 30, width: '15%', resizeMode: 'contain'}}
        />
        <Text style={{color: 'black', fontSize: 15}}>
          {t('Vui lòng chọn sản phẩm bạn muốn mua!')}
        </Text>
      </View>
      <View style={{height: '77%'}}>
        <FlatList
          data={getdata}
          renderItem={({item, index}) => <ListItem item={item} />}
          contentContainerStyle={{paddingBottom: 100}}
          showsVerticalScrollIndicator={false}
        />
      </View>
      {getdata.length!=0 ? <ViewCart navigation={navigation} /> : <></>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 10,
  },
});
