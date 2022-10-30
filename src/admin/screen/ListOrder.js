import React, {useState, useEffect, useRef} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import HomeAdminHeader from '../components/HomeAdminHeader';
import {useTheme} from 'react-native-paper';
GoogleSignin.configure({
  webClientId:
    '359199845323-h10e31djcqb9fbobv2vknmh1h1h5hge0.apps.googleusercontent.com',
});

export default function ListOrder({navigation}) {
  const {colors} = useTheme();
  const ref = firestore().collection('Admin');
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
          navigation.navigate('DetailCustomer', {uid: item.uid});
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.boxes,
            width: 300,
            height: 50,
            marginTop: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 17, color: 'black'}}>
            User: {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{flex: 1}}>
      <HomeAdminHeader navigation={navigation} title="User" />
      <View style={{alignSelf: 'center'}}>
        <View>
          <Text
            style={{
              fontWeight: 'bold',
              color: 'black',
              fontSize: 20,
              marginTop: 20,
            }}>
            List of users
          </Text>
          <FlatList
            data={getdata}
            renderItem={({item, index}) => (
              <ListItem item={item} index={index} />
            )}
            contentContainerStyle={{paddingBottom: 20}}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </View>
  );
}
