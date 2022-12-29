import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useTheme} from 'react-native-paper';
import HeaderManagerOrder from '../components/HeaderManagerOrder';
const SCREEN_WIDTH = Dimensions.get('window').width;
export default function DetailCustomerManager({route, navigation}) {
  const {colors} = useTheme();
  const user = auth().currentUser;
  const [check, getcheck] = useState(false);
  const [getdata, setdata] = useState([]);
  const [getUser, setUser] = useState('');
  useEffect(() => {
    firestore()
      .collection('Employee')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUser(documentSnapshot.data());
        }
      });
  }, []);
  useEffect(() => {
    firestore()
      .collection('Order')
      .doc(route.params.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setdata(documentSnapshot.data().listorder);
        }
      });
  }, [check]);
  const addd = () => {
    getcheck(!check);
  };
  const UpdateStatus = id => {
    firestore()
      .collection('Order')
      .doc(route.params.uid)
      .update({
        listorder: getdata.map(item =>
          item.id === id
            ? {...item, status: 'Inprogress', manager: getUser.name}
            : item,
        ),
      })
      .then(() => {
        addd();
        console.log('status updated!');
      });
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
            source={{uri: item.image[0]}}
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
  const ListItem = ({item, index}) => {
    return (
      <View
        style={{
          borderWidth: 3,
          margin: 5,
          borderRadius: 10,
          borderColor: '#6BC8FF',
        }}>
        <View
          style={{
            borderColor: '#6BC8FF',
            borderRadius: 15,
            borderWidth: 1,
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginLeft: 10,
              marginRight: 10,
              marginTop: 10,
            }}>
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15}}>
              Username: {item.name}
            </Text>
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15}}>
              Phone: {item.phone}
            </Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 10, marginLeft: 10}}>
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15}}>
              Delivery address:{' '}
            </Text>
            <View style={{width: 245, height: '100%'}}>
              <Text
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: 15,
                  marginBottom: 10,
                }}>
                {item.address}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            marginTop: 10,
            marginBottom: 10,
          }}>
          <View style={{justifyContent: 'center'}}>
            <View style={{flexDirection: 'row', marginTop: 8, marginLeft: 15}}>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  borderBottomColor: '#6BC8FF',
                }}>
                <Text
                  style={{
                    color: colors.text,
                    fontWeight: 'bold',
                    fontSize: 17,
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
                {item.status}
              </Text>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <FlatList
                data={item.items}
                renderItem={({item, index}) => <List item={item} />}
                showsVerticalScrollIndicator={false}
                style={{marginBottom: 15}}
              />
            </View>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '98%',
              marginLeft: 4,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderRadius: 10,
                borderColor: '#6BC8FF',
              }}>
              <View style={{marginLeft: 15, marginTop: 10, marginBottom: 10}}>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: '700',
                  }}>
                  Product:{' '}
                  {
                    <Text style={{color: 'red', fontWeight: '700'}}>
                      {item.items.length}
                    </Text>
                  }
                </Text>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: '700',
                  }}>
                  Booking date:{' '}
                  {
                    <Text style={{color: 'red', fontWeight: '700'}}>
                      {item.date}
                    </Text>
                  }
                </Text>
              </View>
              <Text
                style={{
                  marginTop: -25,
                  marginLeft: 'auto',
                  marginRight: 15,
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: '700',
                }}>
                Total money:{' '}
                {
                  <Text style={{color: 'red', fontWeight: '700'}}>
                    {new Intl.NumberFormat('en-VI').format(item.total)} VND
                  </Text>
                }{' '}
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'flex-end',
                marginTop: 15,
                marginLeft: 180,
              }}>
              {item.status == 'Pending' ? (
                <TouchableOpacity
                  style={{
                    borderRadius: 10,
                    marginLeft: 40,
                    backgroundColor: '#36a0ef',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 140,
                  }}
                  onPress={() => {
                    UpdateStatus(item.id);
                  }}>
                  <View
                    style={{
                      height: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 16,
                      }}>
                      Confirm
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <></>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={{flex: 1}}>
      <HeaderManagerOrder navigation={navigation} title="Detail order" />
      <FlatList
        data={getdata}
        renderItem={({item, index}) => <ListItem item={item} index={index} />}
        contentContainerStyle={{paddingBottom: 20}}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
