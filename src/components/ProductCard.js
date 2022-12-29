import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../global/styles';
import Icon1 from 'react-native-vector-icons/AntDesign';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ModalPoup from '../global/ModalPoup';
import LottieView from 'lottie-react-native';
import {useDispatch} from 'react-redux';
import {useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
const SCREEN_WIDTH = Dimensions.get('window').width;
export default function ProductCard({navigation, screenWidth, item}) {
  const {t} = useTranslation();
  const user = auth().currentUser;
  const {colors} = useTheme();
  const [visible, setVisible] = useState(false);
  let checkExists = false;

  const addCart = () => {
    firestore()
      .collection('Cart')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        firestore()
          .collection('Cart')
          .doc(user.uid)
          .set({listcart: [...documentSnapshot.data().listcart, item]})
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
            if (doc.id == item.id) {
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
            .set({listcart: [item]})
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
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.push('ProductInfo', {item: item});
      }}>
      <View style={[styles.cardView, {backgroundColor: colors.background}]}>
        <View style={[styles.imageView, {marginTop: 20}, {width: screenWidth}]}>
          <ImageBackground style={styles.image} source={{uri: item.image[0]}} />
          <View>
            <Text
              style={{
                color: colors.text,
                marginTop: 10,
                marginRight: 10,
                textAlign: 'center',
              }}>
              {item.name}
            </Text>
          </View>
          <View>
            <Text
              style={[
                {
                  color: colors.accent,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  marginTop: 10,
                },
              ]}>
              {item.gia}
            </Text>
          </View>
          <View style={{flexDirection: 'row', marginBottom: 15, marginTop: 12}}>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
            <TouchableOpacity
              style={{
                borderWidth: 0.7,
                borderRadius: 5,
                marginRight: 30,
                width: 50,
                height: 40,
                alignItems: 'center',
                borderColor: colors.tertiary,
              }}>
              <Icon1
                onPress={() => {
                  check();
                }}
                name="shoppingcart"
                style={{color: colors.secondary, justifyContent: 'center'}}
                size={35}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                selectItem(item, true);
                navigation.navigate('MyOrder', {id: 1});
              }}
              style={{
                borderWidth: 1.25,
                borderRadius: 5,
                height: 40,
                width: 85,
                alignItems: 'center',
                marginRight: 10,
                borderColor: colors.secondary,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  marginTop: 10,
                  color: colors.secondary,
                }}>
                {t('MUA NGAY')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  cardView: {
    padding: 5,
    marginBottom: 10,
    marginHorizontal: 5,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderColor: colors.buttons,
    borderWidth: 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },

  imageView: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_WIDTH * 0.5,
    marginLeft: SCREEN_WIDTH * 0.035,
    marginBottom: SCREEN_WIDTH * 0.035,
  },

  image: {
    height: SCREEN_WIDTH * 0.2,
    width: SCREEN_WIDTH * 0.2,
    borderRadius: 10,
    marginRight: 15,
  },

  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  ProductName: {
    fontSize: 17,
    fontWeight: 'semibold',
    color: colors.grey1,
    marginTop: 20,
    marginLeft: 10,
  },

  Price: {
    flex: 4,
    flexDirection: 'row',
    borderRightColor: colors.grey4,
    paddingHorizontal: 5,
    // borderRightWidth: 1,
  },
  UnitCurrency: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingTop: 5,
    color: colors.price,
  },

  address: {
    fontSize: 12,
    paddingTop: 5,
    color: colors.grey2,
    paddingHorizontal: 10,
  },

  average: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -3,
  },
  numberOfReview: {
    color: 'white',
    fontSize: 13,
    marginRight: 0,
    marginLeft: 0,
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
