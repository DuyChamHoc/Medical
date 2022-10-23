import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import HeaderSimple from '../components/HeaderSimple';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import {useTheme} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import {useTranslation} from 'react-i18next';
import i18n from '../assets/language/i18n';
import moment from 'moment/moment';
const SCREEN_WIDTH = Dimensions.get('window').width;
export default function MyOrderComplete({navigation}) {
  const {t, i18n} = useTranslation();
  const [currentLanguage, setLanguage] = useState('');
  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
    addd();
  }, [currentLanguage]);
  const {colors} = useTheme();
  const user = auth().currentUser;
  const [loading, setLoading] = useState(false);
  const [check, getcheck] = useState(true);
  const [getdata, setdata] = useState([]);
  const ref = firestore()
    .collection('order' + user.uid)
    .orderBy('date', 'asc');
  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        list.push(doc.data());
      });
      setdata(list);
    });
  }, [check]);
  const addd = () => {
    getcheck(!check);
  };
  const deleteCartToFireBase = id => {
    firestore()
      .collection('order' + user.uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data().id == id) {
            deletecart(documentSnapshot.id);
          }
        });
      });
  };
  const deletecart = item => {
    firestore()
      .collection('order' + user.uid)
      .doc(item)
      .delete()
      .then(() => {
        firestore()
          .collection('order' + user.uid)
          .get()
          .then(querySnapshot => {
            if (querySnapshot.size == 0) {
              firestore()
                .collection('Admin')
                .get()
                .then(querySnapshot => {
                  querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().uid == user.uid) {
                      deleteAdmin(documentSnapshot.id);
                    }
                  });
                });
            }
            querySnapshot.forEach(documentSnapshot => {});
          });
        console.log('order deleted!');
        addd();
      });
  };
  const deleteAdmin = item => {
    firestore()
      .collection('Admin')
      .doc(item)
      .delete()
      .then(() => {
        console.log('delete admin!');
      });
  };
  const addCartToFireBase = item => {
    setLoading(true);
    firestore()
      .collection('lastorder' + user.uid)
      .add({
        nhathuocchung: item.nhathuocchung,
        date: moment().format('DD/MM/YYYY hh:mm'),
        items: item.items,
        name: item.name,
        phone: item.phone,
        address: item.address,
        ship: item.ship,
        total: item.total,
      })
      .then(() => {
        deleteCartToFireBase(item.id);
        firestore()
          .collection('AdminSales')
          .add({
            nhathuocchung: item.nhathuocchung,
            date: moment().format('DD/MM/YYYY hh:mm'),
            items: item.items,
            name: item.name,
            phone: item.phone,
            address: item.address,
            ship: item.ship,
            total: item.total,
          })
          .then(() => {});
        setTimeout(() => {
          setLoading(false);
          navigation.navigate('MyLastOrder');
        }, 1000);
      });
  };
  const List = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginTop: 15,
          backgroundColor: colors.boxes,
          height: 100,
          borderRadius: 10,
          width: SCREEN_WIDTH - 20,
          marginLeft: 10,
        }}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginLeft: 15}}>
          <Image
            style={{width: 80, height: 80, resizeMode: 'cover'}}
            source={{uri: item.image}}
          />
        </View>
        <View style={{marginLeft: 10, marginTop: 10}}>
          <View style={{width: 265, height: 20}}>
            <Text style={{color: colors.text, fontSize: 15}}>{item.name}</Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text style={{color: 'red', fontSize: 15, fontWeight: 'bold'}}>
              {item.gia}
            </Text>
          </View>
        </View>
        <Text
          style={{
            marginLeft: 'auto',
            fontWeight: 'bold',
            fontSize: 14,
            marginTop: 3,
            marginRight: 10,
            alignSelf: 'center',
            color: colors.text,
          }}>
          x{item.SL}
        </Text>
      </View>
    );
  };
  const ListItem = ({item}) => {
    return (
      <View
        style={{
          marginTop: 10,
          marginBottom: 10,
          backgroundColor: colors.backgroundColor,
        }}>
        <View style={{justifyContent: 'center'}}>
          <View style={{flexDirection: 'row', marginTop: 8, marginLeft: 15}}>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderBottomColor: colors.text,
              }}>
              <Image
                style={{width: 20, height: 20}}
                source={require('../global/image/store.png')}
              />
              <Text
                style={{
                  color: colors.text,
                  fontWeight: 'bold',
                  fontSize: 17,
                  marginLeft: 10,
                }}>
                {item.nhathuocchung}
              </Text>
            </View>
            <Text
              style={{
                color: 'red',
                fontSize: 14.5,
                marginLeft: 'auto',
                marginRight: 20,
                fontWeight: '500',
              }}>
              {t(item.status)}
            </Text>
          </View>
          <FlatList
            data={item.items}
            renderItem={({item, index}) => <List item={item} />}
            showsVerticalScrollIndicator={false}
            style={{marginBottom: 15}}
          />
        </View>
        <View>
          <View style={{marginBottom: 20, height: 40}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderTopWidth: 0.5,
                borderBottomWidth: 0.5,
                borderBottomColor: colors.text,
                borderTopColor: colors.text,
              }}>
              <View style={{marginLeft: 15, marginTop: 10, marginBottom: 10}}>
                <Text style={{color: colors.text, fontSize: 16}}>
                  {t('Sản phẩm:')}{' '}
                  {<Text style={{color: 'red'}}>{item.items.length}</Text>}
                </Text>
                <Text style={{color: colors.text, fontSize: 16}}>
                  {t('Ngày đặt:')}{' '}
                  {<Text style={{color: 'red'}}>{item.date} phút</Text>}
                </Text>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                  }}>
                  {t('Thành tiền:')}{' '}
                  {<Text style={{color: 'red'}}>{item.total}.000đ</Text>}{' '}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 20,
              justifyContent: 'flex-end',
              marginTop: 30,
            }}>
            <TouchableOpacity
              style={
                item.status == 'Đang xử lý'
                  ? {}
                  : {
                      borderRadius: 10,
                      marginLeft: 40,
                      backgroundColor: '#36a0ef',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 120,
                    }
              }
              onPress={() => {
                addCartToFireBase(item);
              }}>
              <View
                style={{
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{color: 'white'}}>{t('Đã nhận hàng')}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                item.status == 'Đang xử lý'
                  ? {
                      borderRadius: 10,
                      marginLeft: 40,
                      backgroundColor: '#36a0ef',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 120,
                      marginRight: 20,
                    }
                  : {}
              }
              onPress={() => {
                deleteCartToFireBase(item.id);
              }}>
              <View
                style={{
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{color: 'white'}}>
                  {item.status == 'Đang xử lý' ? t('Huỷ') : ''}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  return (
    <>
      <SafeAreaView style={styles.container}>
        <HeaderSimple title={t('Đang xử lý')} navigation={navigation} />
        <View
          style={{
            height: 50,
            backgroundColor: '#eff2cc',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 16,
              fontWeight: 'bold',
              marginLeft: 25,
            }}>
            {t('Cảm ơn bạn đã đặt thuốc!')}
          </Text>
          <Icon
            name="reload"
            size={20}
            color="red"
            onPress={() => {
              addd();
            }}
            style={{marginLeft: 'auto', marginRight: 20}}
          />
        </View>
        <View style={{height: '100%'}}>
          <FlatList
            data={getdata}
            renderItem={({item, index}) => <ListItem item={item} />}
            contentContainerStyle={{paddingBottom: 100}}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
      {loading ? (
        <View
          style={{
            backgroundColor: 'black',
            position: 'absolute',
            opacity: 0.6,
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
          }}>
          <LottieView
            style={{height: 200}}
            source={require('../assets/animations/102058-order-completed.json')}
            autoPlay
            speed={3}
          />
        </View>
      ) : (
        <></>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listTab: {
    alignSelf: 'center',
    flexDirection: 'row',
  },
  btnTab: {
    width: Dimensions.get('window').width / 3.5,
    flexDirection: 'row',
    borderWidth: 0.5,
    padding: 10,
    borderColor: '#EBEBEB',
    justifyContent: 'center',
  },
  textTab: {
    fontSize: 16,
  },
  btnTabActive: {
    backgroundColor: '#E6838D',
  },
  textTabActive: {
    color: '#fff',
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 15,
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 10,
  },
});