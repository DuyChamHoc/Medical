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
import auth from '@react-native-firebase/auth';
import HeaderSimple from '../components/HeaderSimple';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
const SCREEN_WIDTH = Dimensions.get('window').width;
export default function MyLastOrder({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const user = auth().currentUser;
  const [getdata, setdata] = useState([]);
  const [check, getcheck] = useState(false);
  useEffect(() => {
    firestore()
      .collection('Completed')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setdata(documentSnapshot.data().listcompleted);
        }
      });
  }, [check]);
  const List = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.push('ProductInfo', {item: item});
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 15,
            backgroundColor: colors.boxes,
            height: 100,
            borderRadius: 10,
            width: SCREEN_WIDTH - 20,
            marginLeft: 5,
            marginRight: 5,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 15,
            }}>
            <Image
              style={{width: 80, height: 80, resizeMode: 'cover'}}
              source={{uri: item.image}}
            />
          </View>
          <View style={{marginLeft: 10, marginTop: 10}}>
            <View style={{width: 265, height: 20}}>
              <Text style={{color: colors.text, fontSize: 15}}>
                {item.name}
              </Text>
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
      </TouchableOpacity>
    );
  };
  const ListItem = ({item}) => {
    return (
      <View
        style={{
          borderColor: '#6BC8FF',
          marginTop: 10,
          marginBottom: 10,
          borderWidth: 3,
          borderRadius: 10,
          width: '100%',
        }}>
        <View style={{justifyContent: 'center'}}>
          <View style={{flexDirection: 'row', marginTop: 8, marginLeft: 15}}>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderColor: colors.text,
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
              {t('Đã giao')}
            </Text>
          </View>
          <FlatList
            data={item.items}
            renderItem={({item, index}) => <List item={item} />}
            showsVerticalScrollIndicator={false}
            style={{marginBottom: 15}}
          />
        </View>
        <View
          style={{
            marginBottom: 10,
            borderTopWidth: 0.5,
            borderBottomWidth: 0.5,
            borderRadius: 10,
            borderColor: '#6BC8FF',
          }}>
          <View style={{marginLeft: 15, marginTop: 10, marginBottom: 10}}>
            <Text style={{color: colors.text, fontSize: 16, fontWeight: '600'}}>
              {t('Sản phẩm:')}{' '}
              {<Text style={{color: 'red'}}>{item.items.length}</Text>}
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: '600',
              }}>
              {t('Tổng tiền:')}{' '}
              {<Text style={{color: 'red'}}>{item.total}.000 đ</Text>}{' '}
            </Text>
            <Text style={{color: colors.text, fontSize: 16, fontWeight: '600'}}>
              {t('Người nhận:')}{' '}
              {<Text style={{color: 'red'}}>{item.name}</Text>}
            </Text>
            <Text style={{color: colors.text, fontSize: 16, fontWeight: '600'}}>
              {t('Địa chỉ nhận hàng:')}{' '}
              {<Text style={{color: 'red'}}>{item.address}</Text>}
            </Text>
            <Text style={{color: colors.text, fontSize: 16, fontWeight: '600'}}>
              {t('Ngày nhận hàng:')}{' '}
              {<Text style={{color: 'red'}}>{item.datereceived}</Text>}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <HeaderSimple title={t('Đã nhận hàng')} navigation={navigation} />
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
