import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import i18n from '../../assets/language/i18n';
import HomeAdminHeader from '../components/HomeAdminHeader';
import ViewSales from '../components/ViewSales';
const SCREEN_WIDTH = Dimensions.get('window').width;
export default function Sales({navigation}) {
  const {t, i18n} = useTranslation();
  const [currentLanguage, setLanguage] = useState('');
  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
    addd();
  }, [currentLanguage]);
  const {colors} = useTheme();
  const [check, getcheck] = useState(false);
  const ref = firestore().collection('AdminSales');
  const [getdata, setdata] = useState([]);
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
                borderColor: colors.text,
              }}>
              <Image
                style={{width: 20, height: 20}}
                source={require('../../global/image/store.png')}
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
              Delivered
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
          <View style={{marginBottom: 20, height: 95}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderTopWidth: 0.5,
                borderBottomColor: colors.text,
                borderTopColor: colors.text,
                borderBottomWidth: 0.5,
              }}>
              <View style={{marginLeft: 15, marginTop: 10, marginBottom: 10}}>
                <Text style={{color: colors.text, fontSize: 16}}>
                  Products:{' '}
                  {<Text style={{color: 'red'}}>{item.items.length}</Text>}
                </Text>
                <Text style={{color: colors.text, fontSize: 16}}>
                  Received date:{' '}
                  {<Text style={{color: 'red'}}>{item.date}</Text>}
                </Text>
                <Text style={{color: colors.text, fontSize: 16}}>
                  User: {<Text style={{color: 'red'}}>{item.name}</Text>}
                </Text>
                <Text style={{color: colors.text, fontSize: 16}}>
                  Phone number:{' '}
                  {<Text style={{color: 'red'}}>{item.phone}</Text>}
                </Text>
                <Text style={{color: colors.text, fontSize: 16}}>
                  Adress: {<Text style={{color: 'red'}}>{item.address}</Text>}
                </Text>
              </View>
              <Text
                style={{
                  marginLeft: 'auto',
                  marginRight: 15,
                  color: colors.text,
                  fontSize: 16,
                }}>
                Total:{<Text style={{color: 'red'}}>{item.total}k</Text>}{' '}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <HomeAdminHeader navigation={navigation} title={'Revenue'} />
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
          Information on all delivered orders
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
      <View style={{height: '81%'}}>
        <FlatList
          data={getdata}
          renderItem={({item, index}) => <ListItem item={item} />}
          contentContainerStyle={{paddingBottom: 100}}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <ViewSales></ViewSales>
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
