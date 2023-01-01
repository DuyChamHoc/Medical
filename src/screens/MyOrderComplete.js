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
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import HeaderSimple from '../components/HeaderSimple';
import auth from '@react-native-firebase/auth';
import {useTheme} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import {useTranslation} from 'react-i18next';
import moment from 'moment/moment';
export default function MyOrderComplete({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const user = auth().currentUser;
  const [loading, setLoading] = useState(false);
  const [check, getcheck] = useState(true);
  const [getdata, setdata] = useState([]);
  const [getusername, setusername] = useState('');
  useEffect(() => {
    firestore()
      .collection('Order')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setdata(documentSnapshot.data().listorder);
          setusername(documentSnapshot.data().username);
        }
      });
  }, [check]);
  const addd = () => {
    getcheck(!check);
  };
  const deleteCartToFireBase = id => {
    if (getdata.length == 1) {
      firestore()
        .collection('Order')
        .doc(user.uid)
        .delete()
        .then(() => {
          console.log('Order deleted!');
          getcheck(!check);
          setdata([]);
          addd();
        });
    } else {
      firestore()
        .collection('Order')
        .doc(user.uid)
        .set({
          uid: user.uid,
          username: getusername,
          listorder: getdata.filter(item => item.id !== id),
        })
        .then(() => {
          console.log('remove order!');
          addd();
        });
    }
  };

  const addCartToFireBase = item => {
    setLoading(true);
    const data = {
      nhathuocchung: item.nhathuocchung,
      datereceived: moment().format('DD/MM/YYYY hh:mm'),
      items: item.items,
      name: item.name,
      phone: item.phone,
      address: item.address,
      ship: item.ship,
      total: item.total,
    };
    firestore()
      .collection('Completed')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        firestore()
          .collection('Revenue')
          .add({
            manager: item.manager,
            nhathuocchung: item.nhathuocchung,
            datereceived: moment().format('DD/MM/YYYY hh:mm'),
            datereceivedcheck: moment().format('DD/MM/YYYY'),
            items: item.items,
            name: item.name,
            phone: item.phone,
            address: item.address,
            ship: item.ship,
            total: item.total,
          })
          .then(() => {
            console.log('added listrevenue!');
          });
        if (documentSnapshot.exists) {
          firestore()
            .collection('Completed')
            .doc(user.uid)
            .set({
              uid: user.uid,
              username: getusername,
              listcompleted: [...documentSnapshot.data().listcompleted, data],
            })
            .then(() => {
              console.log('listcompleted added! listcompleted');
              deleteCartToFireBase(item.id);
              setTimeout(() => {
                setLoading(false);
                navigation.navigate('MyLastOrder');
              }, 1000);
              deleteCartToFireBase(item.id);
            });
        } else {
          firestore()
            .collection('Completed')
            .doc(user.uid)
            .set({username: getusername, listcompleted: [data]})
            .then(() => {
              console.log('added listcompleted 1!');
              deleteCartToFireBase(item.id);
              setTimeout(() => {
                setLoading(false);
                navigation.navigate('MyLastOrder');
              }, 1000);
              deleteCartToFireBase(item.id);
            });
        }
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
          width: '98%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginLeft: 15}}>
          <Image
            style={{width: 80, height: 80, resizeMode: 'cover'}}
            source={{uri: item.image[0]}}
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
            marginTop: 15,
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
          borderWidth: 3,
          borderColor: '#6BC8FF',
          borderRadius: 10,
        }}>
        <View style={{justifyContent: 'center'}}>
          <View style={{flexDirection: 'row', marginTop: 8, marginLeft: 15}}>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderBottomColor: '#6BC8FF',
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
                fontSize: 16,
                marginLeft: 'auto',
                marginRight: 20,
                fontWeight: 'bold',
              }}>
              {t(item.status)}
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 5,
            }}>
            <FlatList
              data={item.items}
              renderItem={({item, index}) => <List item={item} />}
              showsVerticalScrollIndicator={false}
              style={{marginBottom: 15}}
            />
          </View>
        </View>
        <View>
          <View style={{marginBottom: 20, height: 50}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderTopWidth: 0.5,
                borderBottomWidth: 0.5,
                borderColor: '#6BC8FF',
              }}>
              <View style={{marginLeft: 15, marginTop: 10, marginBottom: 10}}>
                <Text
                  style={{color: colors.text, fontSize: 16, fontWeight: '600'}}>
                  {t('Sản phẩm:')}{' '}
                  {<Text style={{color: 'red'}}>{item.items.length}</Text>}
                </Text>
                <Text
                  style={{
                    fontWeight: '600',
                    color: colors.text,
                    fontSize: 16,
                  }}>
                  {t('Thành tiền:')}{' '}
                  {
                    <Text style={{color: 'red'}}>
                      {new Intl.NumberFormat('en-VI').format(item.total)} VND
                    </Text>
                  }{' '}
                </Text>

                <Text
                  style={{color: colors.text, fontSize: 16, fontWeight: '600'}}>
                  {t('Số điện thoại')}
                  {': '}
                  {<Text style={{color: 'red'}}>{item.phone}</Text>}
                </Text>
                <Text
                  style={{color: colors.text, fontSize: 16, fontWeight: '600'}}>
                  {t('Địa chỉ nhận hàng:')}{' '}
                  {<Text style={{color: 'red'}}>{item.address}</Text>}
                </Text>
                <Text
                  style={{color: colors.text, fontSize: 16, fontWeight: '600'}}>
                  {t('Ngày đặt:')}{' '}
                  {<Text style={{color: 'red'}}>{item.date} phút</Text>}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 10,
              justifyContent: 'flex-end',
              marginTop: 80,
              marginRight: 10,
            }}>
            <TouchableOpacity
              style={{
                borderRadius: 10,
                marginLeft: 40,
                backgroundColor: '#36a0ef',
                justifyContent: 'center',
                alignItems: 'center',
                width: 120,
              }}
              onPress={() => {
                if (
                  item.status == 'Chưa giải quyết' ||
                  item.status == 'Pending'
                ) {
                  Alert.alert('Delete Order', 'Do you want to delete order?', [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {text: 'OK', onPress: () => deleteCartToFireBase(item.id)},
                  ]);
                } else {
                  addCartToFireBase(item);
                }
              }}>
              <View
                style={{
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                  {' '}
                  {item.status == 'Chưa giải quyết' || item.status == 'Pending'
                    ? t('Huỷ')
                    : t('Đã nhận hàng')}
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
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
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
