import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Modal,
} from 'react-native';
import HeaderOrder from '../components/HeaderOrder';
import {RadioButton} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ProductOrder from '../components/ProductOrder';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {useTheme} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import {useTranslation} from 'react-i18next';
import moment from 'moment/moment';
export default function MyOrder({navigation, route}) {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const {colors} = useTheme();
  const [fullname, setfullname] = useState('');
  const [phonenumber, setphonenumber] = useState('');
  const [address, setaddress] = useState('');
  const [checked, setChecked] = useState('first');
  const [modalVisible, setModalVisible] = useState(false);
  const [name_dis, setName_dis] = useState('');
  const [num_dis, setNum_dis] = useState(0);
  const [choise_dis, setChoise_dis] = useState(-1);
  const items = useSelector(state => state.cartReducer.selectedItems.items);
  const count = items.length;
  var cost = 0,
    s = 0;
  const user = auth().currentUser;
  const [getDiscount, setDiscount] = useState('');

  useEffect(() => {
    firestore()
      .collection('Discount')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setDiscount(documentSnapshot.data().listdis);
        }
      });
  }, []);
  for (var i = 0; i <= items.length - 1; i++) {
    s = parseInt(items[i].gia);
    cost += s * items[i].SL;
  }

  const addCartToFireBase = () => {
    setLoading(true);
    firestore()
      .collection('Discount')
      .doc(user.uid)
      .update({
        listdis: getDiscount.filter(item => item.id !== choise_dis),
      })
      .then(() => {
        console.log('discount removed!');
      });
    const data = {
      nhathuocchung: items[0].nhathuoc,
      date: moment().format('DD/MM/YYYY hh:mm'),
      items: items,
      name: fullname,
      phone: phonenumber,
      address: address,
      ship: 50 - num_dis * 50,
      total: cost + 50 - num_dis * 50,
      id: Math.random(),
      status: 'Pending',
    };
    firestore()
      .collection('Order')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          firestore()
            .collection('Order')
            .doc(user.uid)
            .set({
              dateorder: moment().format('DD/MM/YYYY hh:mm'),
              uid: user.uid,
              username: fullname,
              listorder: [...documentSnapshot.data().listorder, data],
            })
            .then(() => {
              console.log('User added! listorder');
              setTimeout(() => {
                setLoading(false);
                setnull([], false);
                navigation.navigate('MyOrderComplete');
              }, 1500);
            });
        } else {
          firestore()
            .collection('Order')
            .doc(user.uid)
            .set({
              uid: user.uid,
              username: fullname,
              listorder: [data],
              dateorder: moment().format('DD/MM/YYYY hh:mm'),
            })
            .then(() => {
              console.log('added order 1!');
              setTimeout(() => {
                setLoading(false);
                setnull([], false);
                navigation.navigate('MyOrderComplete');
              }, 1500);
            });
        }
      });
  };
  const dispatch = useDispatch();
  const setnull = (item, checkboxValue) => {
    dispatch({
      type: 'DELETE_TO_CART',
      payload: {
        ...item,
        checkboxValue: checkboxValue,
      },
    });
  };
  useEffect(() => {
    firestore()
      .collection('Users')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setfullname(documentSnapshot.data().full_name);
          setphonenumber(documentSnapshot.data().phone_number);
          setaddress(documentSnapshot.data().address);
        }
      });
  }, []);
  return (
    <>
      <View style={{flex: 1}}>
        <HeaderOrder
          navigation={navigation}
          id={route.params.id}
          title={t('Thanh toán')}
        />
        <ScrollView style={{height: '100%'}}>
          <View style={{marginTop: 15, marginLeft: 12, marginRight: 12}}>
            <View>
              <Text
                style={{
                  color: colors.text,
                  fontWeight: 'bold',
                  fontSize: 18,
                }}>
                {t('Thông tin giao hàng')}
              </Text>
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <Text
                  style={{
                    color: colors.text,
                    fontWeight: 'bold',
                    fontSize: 15,
                  }}>
                  {fullname}
                </Text>
                <Text style={[styles.textStyle, {color: colors.text}]}>|</Text>
                <Text style={[styles.textStyle, {color: colors.text}]}>
                  {phonenumber}
                </Text>
              </View>
              <View style={{marginTop: 5}}>
                <Text style={{color: colors.text}}>{address}</Text>
              </View>
            </View>
            <View>
              {items.map((item, index) => (
                <View key={index}>
                  <ProductOrder item={item} />
                </View>
              ))}
            </View>
            <View style={{marginTop: 20, marginBottom: 10, height: '15%'}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginRight: 10,
                }}>
                <Text style={{color: 'red', fontWeight: 'bold', fontSize: 16}}>
                  {count} {t('Sản phẩm')}
                </Text>
                <Text
                  style={{
                    color: colors.text,
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}>
                  {cost}.000 đ
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginRight: 10,
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    color: colors.text,
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}>
                  {t('Phí vận chuyển')}
                </Text>
                <Text
                  style={{
                    color: colors.text,
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}>
                  50.0000 đ
                </Text>
              </View>
              <View style={num_dis == 0 ? styles.hideDis : styles.showDis}>
                <Text
                  style={{
                    color: colors.text,
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}>
                  {name_dis}
                </Text>
                <Text
                  style={{color: 'green', fontWeight: 'bold', fontSize: 16}}>
                  -{num_dis * 50}.000đ
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 20,
                }}>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}>
                  {t('Khuyễn mãi:')} {getDiscount.length}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(true);
                  }}>
                  <View
                    style={{
                      borderWidth: 1,
                      marginRight: 10,
                      width: 75,
                      height: 25,
                      borderColor: 'red',
                      alignItems: 'center',
                      borderRadius: 5,
                      justifyContent: 'center',
                    }}>
                    <Text style={{color: 'red', fontWeight: 'bold'}}>
                      {t('Chọn')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{marginTop: 30, marginBottom: 10}}>
                <Text
                  style={{
                    color: colors.text,
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}>
                  {t('Chọn hình thức thanh toán')}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <RadioButton
                    value="first"
                    status={checked === 'first' ? 'checked' : 'unchecked'}
                    onPress={() => setChecked('first')}
                  />
                  <Image
                    source={require('../global/image/Cash.png')}
                    style={{
                      height: 43,
                      width: '25%',
                      resizeMode: 'contain',
                      marginRight: 10,
                    }}
                  />
                  <Text style={{color: colors.text}}>
                    {t('Thanh toán khi nhận hàng (COD)')}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <RadioButton
                    value="second"
                    status={checked === 'second' ? 'checked' : 'unchecked'}
                    onPress={() => setChecked('second')}
                  />
                  <Image
                    source={require('../global/image/MoMo_Logo.png')}
                    style={{
                      height: '100%',
                      width: '25%',
                      resizeMode: 'contain',
                      marginRight: 10,
                    }}
                  />
                  <Text style={{color: colors.text}}>{t('Ví MoMo')}</Text>
                </View>
              </View>
              <View
                style={{
                  marginTop: 20,
                  marginBottom: 10,
                  flexDirection: 'row',
                  width: 350,
                }}>
                <Image
                  source={require('../global/image/doc_rule.png')}
                  style={{
                    height: '100%',
                    width: '8%',
                    resizeMode: 'contain',
                    marginRight: 10,
                  }}
                />
                <Text
                  style={{color: colors.text, fontSize: 15, marginRight: 10}}>
                  {t(
                    'Nhấn Đặt hàng đồng nghĩa với việc bạn đồng ý tuân theo các điều khoản của chúng tôi',
                  )}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modal}>
            <View style={styles.modalContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 20,
                }}>
                <Text
                  style={{color: 'black', fontWeight: 'bold', fontSize: 16}}>
                  {t('Chọn mã giảm giá')}
                </Text>
                <Text style={{color: 'black', fontSize: 14}}>
                  {t(' Áp dụng tối đa: 1')}
                </Text>
              </View>
              <FlatList
                data={getDiscount}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <ScrollView style={{marginTop: 20}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '94%',
                        backgroundColor: 'white',
                        height: 80,
                        alignSelf: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={{uri: item.image}}
                        style={{height: 55, width: 55, resizeMode: 'contain'}}
                      />
                      <View
                        style={{
                          marginLeft: 15,
                          flexDirection: 'row',
                          width: 300,
                        }}>
                        <View>
                          <Text
                            style={{
                              fontSize: 16,
                              color: 'black',
                              fontWeight: 'bold',
                            }}>
                            {item.name}
                          </Text>
                          <View style={{flexDirection: 'row', marginTop: 8}}>
                            <View style={{flexDirection: 'row'}}>
                              <Image
                                source={require('../global/image/time.png')}
                                style={{
                                  height: 20,
                                  width: 20,
                                  resizeMode: 'contain',
                                }}
                              />
                              <Text style={{color: 'red', marginLeft: 5}}>
                                {t('Hạn dùng:')} {item.endDate}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            if (choise_dis == item.id) {
                              setChoise_dis(-1);
                              setName_dis('');
                              setNum_dis(0);
                              setModalVisible(false);
                            } else {
                              setChoise_dis(item.id);
                              setName_dis(item.name);
                              setNum_dis(item.discount);
                              setModalVisible(false);
                            }
                          }}
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: 'auto',
                            marginRight: 40,
                          }}>
                          <Text style={{color: 'red', fontWeight: 'bold'}}>
                            {choise_dis == item.id
                              ? t('Bỏ chọn')
                              : t('Sử dụng')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </ScrollView>
                )}
              />
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                }}>
                <View
                  style={{
                    backgroundColor: 'red',
                    borderRadius: 15,
                    height: 40,
                    width: '90%',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: 'white', fontSize: 17}}>
                    {t('Xong')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View
          style={{
            height: 50,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            borderTopWidth: 1,
            borderTopColor: '#6BC8FF',
          }}>
          <View
            style={{
              marginRight: 40,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: 'bold',
                marginRight: 5,
              }}>
              {t('Tổng thanh toán:')}
            </Text>
            <Text style={{color: 'red', fontSize: 18, fontWeight: 'bold'}}>
              {cost + 50 - num_dis * 50}.000đ
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: 'red',
              width: 130,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              addCartToFireBase();
            }}>
            <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
              {t('Đặt hàng')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
        <View
          style={{
            backgroundColor: 'black',
            position: 'absolute',
            opacity: 0.7,
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
          }}>
          <LottieView
            style={{height: 400}}
            source={require('../assets/animations/72243-order-placed.json')}
            autoPlay
            speed={2}
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
    backgroundColor: 'white',
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 10,
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',
    height: '80%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    elevation: 20,
  },
  showDis: {
    height: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 10,
    marginTop: 10,
  },
  hideDis: {
    height: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 10,
  },
});
