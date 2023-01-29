import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import Icon1 from 'react-native-vector-icons/AntDesign';
import ModalPoup from '../global/ModalPoup';
import LottieView from 'lottie-react-native';
import {useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
export default function ViewCart({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [visible, setVisible] = useState(false);
  const items = useSelector(state => state.cartReducer.selectedItems.items);
  const returnCost = gia => {
    let a = gia.split(' ');
    return a[0];
  };
  const total = items
    .map(item => parseFloat(returnCost(item.gia)))
    .reduce((prev, curr) => prev + curr, 0);
  return (
    <View
      style={{
        flexDirection: 'row',
        height: 50,
        justifyContent: 'flex-end',
        borderTopWidth: 0.5,
        borderTopColor: 'blue',
      }}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
            style={{height: 100, alignSelf: 'center', marginBottom: 10}}
            source={require('../assets/animations/error.json')}
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
            {t('Không có sản phẩm nào được chọn.')}
          </Text>
        </ModalPoup>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style={{width: 300, alignItems: 'center', flexDirection: 'row'}}>
          <Text
            style={{
              color: colors.text,
              fontSize: 20,
              marginLeft: 60,
              fontWeight: 'bold',
            }}>
            {t('Tổng tiền:')}
          </Text>
          <Text
            style={{
              color: 'red',
              fontWeight: 'bold',
              marginLeft: 5,
              fontSize: 18,
            }}>
            {total
              ? new Intl.NumberFormat('en-VI').format(total) + ' VND'
              : '0 VND'}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            width: 120,
            backgroundColor: 'red',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            if (total != 0) {
              navigation.navigate('MyOrder', {id: 2});
            } else {
              setVisible(true);
            }
          }}>
          <View>
            <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
              {t('Mua Hàng')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
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
