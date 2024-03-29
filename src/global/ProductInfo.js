import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import {colors} from '../global/styles';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderProject from '../components/HeaderProduct';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ModalPoup from './ModalPoup';
import LottieView from 'lottie-react-native';
import {useDispatch} from 'react-redux';
import {useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
const SCREEN_WIDTH = Dimensions.get('window').width;
export default function ProductInfo({navigation, route}) {
  let checkExists = false;
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [visible, setVisible] = useState(false);
  const user = auth().currentUser;
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };
  const addCart = () => {
    firestore()
      .collection('Cart')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        firestore()
          .collection('Cart')
          .doc(user.uid)
          .set({
            listcart: [...documentSnapshot.data().listcart, route.params.item],
          })
          .then(() => {
            console.log('User added! listcart');
            checkExists = false;
          });
      });
  };
  const check = async () => {
    firestore()
      .collection('Cart')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          documentSnapshot.data().listcart.map(doc => {
            if (doc.id == route.params.item.id) {
              checkExists = true;
            }
          });
          if (checkExists) {
            console.log('exists');
            setVisible(true);
          } else {
            console.log('no exists and add');
            addCart();
            setVisible(true);
          }
        } else {
          firestore()
            .collection('Cart')
            .doc(user.uid)
            .set({listcart: [route.params.item]})
            .then(() => {
              console.log('added cart 1!');
              setVisible(true);
            });
        }
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
  return (
    <View style={styles.container}>
      <HeaderProject navigation={navigation} title={t('Thông tin sản phẩm')} />
      <View
        style={{flex: 1, marginTop: 10, backgroundColor: colors.background}}>
        <ScrollView>
          <View style={{width: 380, height: 450, alignSelf: 'center'}}>
            <View
              style={{
                borderWidth: 0.6,
                borderColor: 'blue',
                width: 360,
                height: 300,
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{width: '90%', height: '90%', resizeMode: 'cover'}}
                source={{uri: route.params.item.image[0]}}
              />
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ModalPoup visible={visible}>
                  <View style={{alignItems: 'center'}}>
                    <View style={styles.header}>
                      <TouchableOpacity onPress={() => setVisible(false)}>
                        <Icon1
                          name="close"
                          style={{height: 30, width: 30, color: colors.text}}
                          size={25}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <LottieView
                    style={{height: 100, alignSelf: 'center', marginBottom: 30}}
                    source={require('../assets/animations/check-mark.json')}
                    autoPlay
                    speed={0.8}
                    loop={false}
                  />
                  <Text
                    style={{
                      marginVertical: 30,
                      fontSize: 20,
                      textAlign: 'center',
                      color: colors.text,
                      fontWeight: 'bold',
                    }}>
                    {t('Thêm sản phẩm thành công')}
                  </Text>
                </ModalPoup>
              </View>
            </View>
            <View
              style={{marginTop: 12, marginLeft: 10, alignItems: 'flex-start'}}>
              <Text
                style={{fontWeight: 'bold', fontSize: 18, color: colors.text}}>
                {route.params.item.name}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 15,
                color: colors.text,
                marginLeft: 10,
                marginTop: 10,
              }}>
              {t('Đã bán 0')}
            </Text>
            <Text
              style={{
                color: 'red',
                fontSize: 20,
                marginTop: 10,
                marginLeft: 10,
                fontWeight: 'bold',
              }}>
              {route.params.item.gia}
            </Text>
          </View>
          <View style={{height: 150, backgroundColor: colors.boxes}}>
            <View style={{flexDirection: 'row', marginLeft: 10}}>
              <View
                style={{
                  borderWidth: 0.7,
                  borderColor: colors.grey4,
                  borderRadius: 45,
                  marginTop: 20,
                  marginLeft: 10,
                  width: 50,
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  style={{
                    width: 35,
                    height: 35,
                    resizeMode: 'cover',
                    marginBottom: 5,
                  }}
                  source={{
                    uri: 'https://cdn2.iconfinder.com/data/icons/medical-77/512/39-256.png',
                  }}
                />
              </View>
              <View style={{marginTop: 20, marginLeft: 15}}>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 17,
                    fontWeight: 'bold',
                  }}>
                  {route.params.item.nhathuoc}
                </Text>
                <Text style={{color: 'red', fontSize: 15, marginTop: 5}}>
                  {t('Xem đánh giá')}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'baseline',
                marginTop: 15,
              }}>
              <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 16, color: colors.text}}>
                  {t('Đánh Giá')}
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    color: 'red',
                    fontWeight: 'bold',
                    marginTop: 7,
                  }}>
                  4.9
                </Text>
              </View>
              <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 16, color: colors.text}}>
                  {t('Sản Phẩm')}
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    color: 'red',
                    fontWeight: 'bold',
                    marginTop: 7,
                  }}>
                  13
                </Text>
              </View>
              <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 16, color: colors.text}}>
                  {t('Khoảng Cách')}
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    color: 'red',
                    fontWeight: 'bold',
                    marginTop: 7,
                  }}>
                  ~17Km
                </Text>
              </View>
            </View>
          </View>
          <View style={{marginTop: 20}}>
            <View style={{flexDirection: 'row', marginLeft: 10}}>
              <Text
                style={{color: colors.text, fontSize: 16, fontWeight: 'bold'}}>
                {t('Thông tin sản phẩm')}
              </Text>
              <TouchableOpacity onPress={handleOpen}>
                <Text
                  style={{
                    color: 'blue',
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginLeft: 150,
                  }}>
                  {isOpen == false ? t('Xem thêm') : t('Thu gọn')}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={
                isOpen == true
                  ? styles.moreDetail_close
                  : styles.moreDetail_open
              }>
              <Text style={{marginLeft: 10, color: colors.text, fontSize: 15}}>
                {route.params.item.mota}
              </Text>
            </View>
          </View>
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            height: 60,
            justifyContent: 'space-around',
            alignItems: 'center',
            borderWidth: 0.2,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              check();
            }}>
            <View style={styles.button_end}>
              <Text style={{color: 'red'}}>{t('THÊM VÀO GIỎ HÀNG')}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              selectItem(route.params.item, true);
              navigation.navigate('MyOrder', {id: 1});
            }}>
            <View style={styles.button_end1}>
              <Text style={{color: 'white'}}>{t('MUA NGAY')}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  deliveryButton: {
    paddingHorizontal: 20,
    borderRadius: 15,
    paddingVertical: 5,
  },
  imageView: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.4475,
    height: SCREEN_WIDTH * 0.7,
    marginLeft: SCREEN_WIDTH * 0.035,
    marginBottom: SCREEN_WIDTH * 0.035,
  },

  image: {
    height: SCREEN_WIDTH * 0.4475,
    width: SCREEN_WIDTH * 0.4475,
    borderRadius: 10,
  },
  deliveryText: {
    marginLeft: 5,
    fontSize: 16,
  },
  fillterView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  clockView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    backgroundColor: colors.cardbackground,
    borderRadius: 15,
    paddingHorizontal: 5,
    marginRight: 20,
  },
  addressView: {
    flexDirection: 'row',
    backgroundColor: colors.grey5,
    borderRadius: 15,
    paddingVertical: 3,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerText: {
    color: colors.grey1,
    fontSize: 22,
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  headerTextView: {
    backgroundColor: colors.grey5,
    paddingVertical: 3,
  },
  smallCard: {
    borderRadius: 30,
    backgroundColor: colors.grey5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    width: 80,
    margin: 10,
    height: 100,
  },
  smallCardSelected: {
    borderRadius: 30,
    backgroundColor: colors.buttons,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    width: 80,
    margin: 10,
    height: 100,
  },
  smallCardTextSected: {
    fontWeight: 'bold',
    color: colors.cardbackground,
  },
  smallCardText: {
    fontWeight: 'bold',
    color: colors.grey2,
  },
  floatButton: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    backgroundColor: 'white',
    elevation: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
  },
  moreDetail_close: {
    height: '64%',
    marginTop: 5,
  },
  moreDetail_open: {
    height: 100,
    marginTop: 5,
  },
  button_end: {
    borderWidth: 1,
    width: 170,
    height: 40,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'red',
  },
  button_end1: {
    borderWidth: 1,
    width: 170,
    height: 40,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'red',
    backgroundColor: 'red',
  },
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: '100%',
    height: 20,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
