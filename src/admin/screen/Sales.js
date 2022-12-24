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
import SearchBar from 'react-native-elements/dist/searchbar/SearchBar-ios';
import firestore from '@react-native-firebase/firestore';
import {useTheme} from '@react-navigation/native';
import HomeAdminHeader from '../components/HomeAdminHeader';
import ViewSales from '../components/ViewSales';
const SCREEN_WIDTH = Dimensions.get('window').width;
export default function Sales({navigation}) {
  const {colors} = useTheme();
  const [check, getcheck] = useState(false);
  const ref = firestore().collection('Revenue');
  const [getdata, setdata] = useState([]);
  const [getdataBackup, setdataBackup] = useState([]);
  const [search, setsearch] = useState('');
  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        list.push(doc.data());
      });
      setdata(list);
      setdataBackup(list);
    });
  }, [check]);
  const addd = () => {
    getcheck(!check);
  };

  const searchdate = val => {
    setsearch(val);
    setdata(getdataBackup.filter(it => it.datereceivedcheck.match(val)));
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
            borderColor: '#6BC8FF',
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
          width: '99%',
          marginTop: 5,
          marginBottom: 10,
          borderWidth: 2,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: '#6BC8FF',
        }}>
        <View style={{justifyContent: 'center'}}>
          <View style={{flexDirection: 'row', marginTop: 8, marginLeft: 15}}>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderColor: '#6BC8FF',
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
                fontSize: 18,
                marginLeft: 'auto',
                marginRight: 20,
                fontWeight: 'bold',
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
          <View style={{marginBottom: 20}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderTopWidth: 0.8,
                borderBottomWidth: 0.8,
                borderColor: '#6BC8FF',
              }}>
              <View style={{marginLeft: 15, marginTop: 10, marginBottom: 10}}>
                <Text
                  style={{color: colors.text, fontSize: 16, fontWeight: '600'}}>
                  Products:{' '}
                  {<Text style={{color: 'red'}}>{item.items.length}</Text>}
                </Text>
                <Text
                  style={{color: colors.text, fontSize: 16, fontWeight: '600'}}>
                  Phone: {<Text style={{color: 'red'}}>{item.phone}</Text>}
                </Text>
                <Text
                  style={{color: colors.text, fontSize: 16, fontWeight: '600'}}>
                  Adress: {<Text style={{color: 'red'}}>{item.address}</Text>}
                </Text>
                <Text
                  style={{color: colors.text, fontSize: 16, fontWeight: '600'}}>
                  User: {<Text style={{color: 'red'}}>{item.name}</Text>}
                </Text>
                <Text
                  style={{color: colors.text, fontSize: 16, fontWeight: '600'}}>
                  Order manager:{' '}
                  {<Text style={{color: 'red'}}>{item.manager}</Text>}
                </Text>
                <Text
                  style={{color: colors.text, fontSize: 16, fontWeight: '600'}}>
                  Received date:{' '}
                  {<Text style={{color: 'red'}}>{item.datereceived}</Text>}
                </Text>
              </View>
              <Text
                style={{
                  fontWeight: '600',
                  marginLeft: 'auto',
                  marginRight: 15,
                  color: colors.text,
                  fontSize: 16,
                }}>
                Total: {<Text style={{color: 'red'}}>{item.total}.000 VND</Text>}
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
          height: 35,
          backgroundColor: '#eff2cc',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../global/image/cart_order.png')}
          style={{height: 30, width: '15%', resizeMode: 'contain'}}
        />
        <Text style={{color: 'black', fontSize: 16, fontWeight: '700'}}>
          Information on all delivered orders!
        </Text>
      </View>
      <View style={{marginTop: -10}}>
        <SearchBar
          placeholder="Search by date..."
          onChangeText={val => searchdate(val)}
          value={search}
          autoCapitalize="none"
          // containerStyle={styles.searchContainer}
          // inputStyle={styles.searchInput}
        />
      </View>
      <View
        style={{
          height: '76%',
          marginTop: -15,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 2,
        }}>
        <FlatList
          data={getdata}
          renderItem={({item, index}) => <ListItem item={item} />}
          contentContainerStyle={{paddingBottom: 100}}
          showsVerticalScrollIndicator={false}
        />
      </View>
      {getdata == '' ? <></> : <ViewSales data={getdata} />}
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
