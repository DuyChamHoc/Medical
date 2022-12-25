import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, Image} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import HomeManagerHeader from '../components/HomeManagerHeader';
import {useTheme} from 'react-native-paper';
GoogleSignin.configure({
  webClientId:
    '359199845323-h10e31djcqb9fbobv2vknmh1h1h5hge0.apps.googleusercontent.com',
});

export default function ListOrder({navigation}) {
  const {colors} = useTheme();
  const ref = firestore().collection('Order');
  const [getdata, setdata] = useState([]);
  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        list.push(doc.data());
      });
      setdata(list);
    });
  }, []);
  const ListItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('DetailCustomerManager', {uid: item.uid});
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.boxes,
            width: 380,
            height: 65,
            borderWidth: 1,
            marginTop: 10,
            borderColor: '#6BC8FF',
            justifyContent: 'center',
            borderRadius: 10,
          }}>
          <View style={{marginLeft: 45}}>
            <Text style={{fontWeight: 'bold', fontSize: 17, color: 'black'}}>
              User: {item.username}
            </Text>
            <Text style={{fontWeight: '400', fontSize: 15, color: 'black'}}>
              Recent order time: {item.dateorder}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{flex: 1}}>
      <HomeManagerHeader navigation={navigation} title="User order" />
      <View
        style={{
          height: 50,
          backgroundColor: '#eff2cc',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../global/image/cart_order.png')}
          style={{height: 30, width: '15%', resizeMode: 'contain'}}
        />
        <Text style={{color: 'black', fontSize: 16, fontWeight: '700'}}>
          List of users order!
        </Text>
      </View>
      <View style={{alignSelf: 'center'}}>
        <FlatList
          data={getdata}
          renderItem={({item, index}) => <ListItem item={item} index={index} />}
          contentContainerStyle={{paddingBottom: 20}}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
