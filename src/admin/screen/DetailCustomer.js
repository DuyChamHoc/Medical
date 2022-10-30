import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import i18n from '../../assets/language/i18n';
import Icon1 from 'react-native-vector-icons/Ionicons';
import HeaderAdminOrder from '../components/HeaderAdminOrder';
const SCREEN_WIDTH = Dimensions.get('window').width;
export default function DetailCustomer({route, navigation}) {
  const {colors} = useTheme();
  const {t, i18n} = useTranslation();
  const [check, getcheck] = useState(false);
  const ref = firestore().collection('order' + route.params.uid);
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
  const UpdateStatus = id => {
    firestore()
      .collection('order' + route.params.uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data().id == id) {
            Update(documentSnapshot.id);
          }
        });
      });
  };
  const Update = item => {
    firestore()
      .collection('order' + route.params.uid)
      .doc(item)
      .update({
        status: 'Delivery in progress',
      })
      .then(() => {
        console.log('User updated!');
        addd();
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
  const ListItem = ({item, index}) => {
    return (
      <View>
        <View style={index == 0 ? {} : {height: 0}}>
          <View
            style={{
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
                Tên: {item.name}
              </Text>
              <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15}}>
                SDT: {item.phone}
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 10, marginLeft: 10}}>
              <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15}}>
                Delivery address:{' '}
              </Text>
              <View style={{width: 245, marginLeft: 10, height: '100%'}}>
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
          <Text
            style={{
              color: colors.text,
              fontWeight: 'bold',
              fontSize: 16,
              marginLeft: 10,
              marginTop: 10,
            }}>
            Orders:
          </Text>
        </View>
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
                  borderBottomColor: colors.text,
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
                  fontSize: 14.5,
                  marginLeft: 'auto',
                  marginRight: 20,
                  fontWeight: '500',
                }}>
                {item.status}
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
            <View style={{marginBottom: 20, height: 40}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderTopWidth: 0.5,
                  borderBottomWidth: 0.5,
                  borderBottomColor: colors.text,
                  borderTopColor: colors.text,
                }}>
                <View style={{marginLeft: 15, marginTop: 10, marginBottom: 10}}>
                  <Text style={{color: colors.text, fontSize: 16}}>
                    Product:
                    {<Text style={{color: 'red'}}>{item.items.length}</Text>}
                  </Text>
                  <Text style={{color: colors.text, fontSize: 16}}>
                    Booking date:{' '}
                    {<Text style={{color: 'red'}}>{item.date}</Text>}
                  </Text>
                </View>
                <Text
                  style={{
                    marginLeft: 'auto',
                    marginRight: 15,
                    color: colors.text,
                    fontSize: 16,
                  }}>
                  Total money:{' '}
                  {<Text style={{color: 'red'}}>{item.total}k</Text>}{' '}
                </Text>
              </View>
            </View>
            <View
              style={
                item.status == 'Delivery in progress'
                  ? {height: 0}
                  : {
                      flexDirection: 'row',
                      marginRight: 10,
                      justifyContent: 'flex-end',
                      marginTop: 15,
                    }
              }>
              <TouchableOpacity
                style={{
                  borderRadius: 10,
                  marginLeft: 40,
                  backgroundColor: '#36a0ef',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 150,
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
                  <Text style={{color: 'white'}}>Order confirmation</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={{flex: 1}}>
      <HeaderAdminOrder navigation={navigation} title="Order" />
      <View style={{marginTop: 10}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginRight: 10,
            marginLeft: 10,
          }}>
          <Text
            style={{
              color: colors.text,
              fontWeight: 'bold',
              fontSize: 16,
              marginRight: 150,
            }}>
            Customer information
          </Text>
          <Icon1
            name="reload"
            size={20}
            color="red"
            onPress={() => {
              addd();
            }}
            style={{marginLeft: 'auto', marginRight: 20}}
          />
        </View>
      </View>
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
