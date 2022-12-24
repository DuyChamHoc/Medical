import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, Image,Dimensions} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import HomeAdminHeader from '../components/HomeAdminHeader';
import {useTheme} from 'react-native-paper';
GoogleSignin.configure({
  webClientId:
    '359199845323-h10e31djcqb9fbobv2vknmh1h1h5hge0.apps.googleusercontent.com',
});
const SCREEN_WIDTH = Dimensions.get('window').width;
export default function DiscountAdmin({navigation}) {
  const {colors} = useTheme();
  const ref = firestore().collection('Users');
  const [getdata, setdata] = useState([]);
  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        if (doc.data().roll == 3) list.push(doc.data());
      });
      setdata(list);
    });
  }, []);
  const ListItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('DetailDiscount', {uid: item.uid});
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
              User: {item.full_name ? item.full_name : ''}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{flex: 1}}>
      <HomeAdminHeader navigation={navigation} title="Discount" />
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
          List of users discount!
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
