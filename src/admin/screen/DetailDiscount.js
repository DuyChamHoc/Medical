import React, {useState, useEffect} from 'react';
import {colors} from '../../global/styles';
import {Button} from 'react-native-elements';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Image,
} from 'react-native';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon4 from 'react-native-vector-icons/Entypo';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import HeaderAdminOrder from '../components/HeaderAdminOrder';
import {FlatList} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
GoogleSignin.configure({
  webClientId:
    '359199845323-h10e31djcqb9fbobv2vknmh1h1h5hge0.apps.googleusercontent.com',
});
const SCREEN_WIDTH = Dimensions.get('window').width;
export default function DetailDiscount({route, navigation}) {
  const [addmodalVisible, setaddModalVisible] = useState(false);
  const [updatemodalVisible, setupdateModalVisible] = useState(false);
  const [getdiscount, setdiscount] = useState([]);

  const [getPercent, setPersent] = useState('');
  const [getNamedis, setNamedis] = useState('');
  const [getid, setid] = useState('');
  const [check, getcheck] = useState(false);

  useEffect(() => {
    firestore()
      .collection('Discount')
      .doc(route.params.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('User data: ', documentSnapshot.data());
          setdiscount(documentSnapshot.data().listdis);
        }
      });
  }, [check]);

  const showmodal = () => {
    setPersent('');
    setNamedis('');
    setid('');
    setaddModalVisible(!addmodalVisible);
  };

  const create = async () => {
    const data = {
      id: Math.random(),
      discount: getPercent / 100,
      name: getNamedis,
      image:
        'https://cdn3.iconfinder.com/data/icons/livico-shop-e-commerce/128/shopify_pastel-14-256.png',
    };
    firestore()
      .collection('Discount')
      .doc(route.params.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          firestore()
            .collection('Discount')
            .doc(route.params.uid)
            .set({
              listdis: [...documentSnapshot.data().listdis, data],
            })
            .then(() => {
              console.log('Added discount');
              setaddModalVisible(!addmodalVisible);
              addd();
            });
        } else {
          firestore()
            .collection('Discount')
            .doc(route.params.uid)
            .set({
              listdis: [data],
            })
            .then(() => {
              console.log('added discount 1!');
              setaddModalVisible(!addmodalVisible);
              addd();
            });
        }
      });
  };

  const update = () => {
    firestore()
      .collection('Discount')
      .doc(route.params.uid)
      .update({
        listdis: getdiscount.map(item =>
          item.id == getid
            ? {...item, discount: getPercent / 100, name: getNamedis}
            : item,
        ),
      })
      .then(() => {
        console.log('Discount update!');
        setupdateModalVisible(!updatemodalVisible);
        addd();
      });
  };

  const addd = () => {
    getcheck(!check);
  };
  const dataupdate = item => {
    setPersent(String(item.discount * 100));
    setNamedis(item.name);
    setid(item.id);
    setupdateModalVisible(!updatemodalVisible);
  };
  const deletediscount = () => {
    firestore()
      .collection('Discount')
      .doc(route.params.uid)
      .update({
        listdis: getdiscount.filter(item => item.id !== getid),
      })
      .then(() => {
        console.log('discount removed!');
        setupdateModalVisible(!updatemodalVisible);
        addd();
      });
  };
  const ListItem = ({item, index}) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            dataupdate(item);
          }}>
          <View
            style={{
              margin: 10,
              borderRadius: 10,
              flex: 1,
              borderWidth: 1,
              borderColor: colors.blue,
              width: '95%',
              height: 100,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <View style={{marginLeft: 30}}>
              <Image
                style={{height: 50, width: 50}}
                source={{uri: item.image}}
              />
            </View>
            <View style={{marginLeft: 10}}>
              <Text style={{fontWeight: '500', fontSize: 16, color: 'black'}}>
                Percent: {item.discount * 100}%
              </Text>
              <Text style={{fontWeight: '500', fontSize: 16, color: 'black'}}>
                Name: {item.name}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View>
      <HeaderAdminOrder navigation={navigation} title="Detail order" />
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
          Add and update detail discount!
        </Text>
      </View>
      <FlatList
        data={getdiscount}
        renderItem={({item, index}) => <ListItem item={item} />}
        contentContainerStyle={{paddingBottom: 100}}
        showsVerticalScrollIndicator={false}
      />
      {!addmodalVisible && !updatemodalVisible ? (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            showmodal();
          }}>
          <Text style={styles.fabIcon}>+</Text>
          <Icon4 name="price-tag" size={30} />
        </TouchableOpacity>
      ) : (
        <></>
      )}

      {/* {addddddddddddddddddddddddddddddddddddddddddd} */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addmodalVisible}
        style={{backgroundColor: colors.background}}
        onRequestClose={() => {
          setaddModalVisible(!addmodalVisible);
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              borderWidth: 1,
              backgroundColor: 'white',
              width: 380,
              alignSelf: 'center',
              borderRadius: 30,
            }}>
            <Text
              style={{
                fontSize: 21,
                fontWeight: 'bold',
                color: colors.blue,
                alignSelf: 'center',
                marginTop: 10,
              }}>
              Create Discount
            </Text>
            <TouchableOpacity
              onPress={() => {
                setaddModalVisible(!addmodalVisible);
              }}>
              <Icon1
                size={23}
                name="close"
                style={{marginTop: -25, color: colors.black, marginLeft: 330}}
              />
            </TouchableOpacity>
            <TextInput
              style={{
                height: 42,
                marginTop: 20,
                width: 320,
                borderWidth: 1,
                borderColor: '#86939e',
                marginHorizontal: 30,
                borderRadius: 12,
                paddingHorizontal: 10,
                color: colors.text,
              }}
              placeholder="Percent"
              value={getPercent}
              onChangeText={txt => setPersent(txt)}
            />
            <TextInput
              style={{
                height: 42,
                marginTop: 20,
                width: 320,
                borderWidth: 1,
                borderColor: '#86939e',
                marginHorizontal: 30,
                borderRadius: 12,
                paddingHorizontal: 10,
                color: colors.text,
              }}
              placeholder="Name discount"
              value={getNamedis}
              onChangeText={txt => setNamedis(txt)}
            />
            <View style={{alignItems: 'flex-end', marginRight: 30}}>
              <Button
                title="Create"
                buttonStyle={{
                  marginTop: 20,
                  marginBottom: 10,
                  backgroundColor: colors.blue,
                  borderRadius: 30,
                  width: 100,
                  alignSelf: 'center',
                  marginLeft: 15,
                }}
                onPress={() => {
                  create();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* updatedddddddddddddddddddddddddddd */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={updatemodalVisible}
        style={{backgroundColor: colors.background}}
        onRequestClose={() => {
          setupdateModalVisible(!updatemodalVisible);
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              borderWidth: 1,
              backgroundColor: 'white',
              width: 380,
              alignSelf: 'center',
              borderRadius: 30,
            }}>
            <Text
              style={{
                fontSize: 21,
                fontWeight: 'bold',
                color: colors.blue,
                alignSelf: 'center',
                marginTop: 5,
              }}>
              Update discount
            </Text>
            <TouchableOpacity
              onPress={() => {
                setupdateModalVisible(!updatemodalVisible);
              }}>
              <Icon1
                size={23}
                name="close"
                style={{marginTop: -25, color: colors.black, marginLeft: 330}}
              />
            </TouchableOpacity>

            <TextInput
              style={{
                marginTop: 15,
                width: 320,
                borderWidth: 1,
                borderColor: '#86939e',
                marginHorizontal: 30,
                borderRadius: 12,
                paddingHorizontal: 10,
                color: colors.text,
              }}
              placeholder="Percent"
              value={getPercent}
              onChangeText={txt => setPersent(txt)}
            />
            <TextInput
              style={{
                marginTop: 20,
                width: 320,
                borderWidth: 1,
                borderColor: '#86939e',
                marginHorizontal: 30,
                borderRadius: 12,
                paddingHorizontal: 10,
                color: colors.text,
              }}
              placeholder="Name"
              value={getNamedis}
              onChangeText={txt => setNamedis(txt)}
            />

            <View
              style={{
                flexDirection: 'row',
                marginLeft: 120,
                marginBottom: 10,
                marginTop: 20,
              }}>
              <Button
                title="Delete"
                buttonStyle={{
                  backgroundColor: colors.blue,
                  borderRadius: 30,
                  width: 100,
                  alignSelf: 'center',
                  marginLeft: 15,
                }}
                onPress={() => {
                  deletediscount();
                }}
              />
              <Button
                title="Update"
                buttonStyle={{
                  backgroundColor: colors.blue,
                  borderRadius: 30,
                  width: 100,
                  alignSelf: 'center',
                  marginLeft: 15,
                }}
                onPress={() => {
                  update();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  view14: {
    height: 42,
    width: 320,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#86939e',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 30,
  },
  fab: {
    flexDirection: 'row',
    top: SCREEN_WIDTH * 1.65,
    borderWidth: 1,
    borderColor: '#03A9F4',
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 50,
    backgroundColor: 'white',
    borderRadius: 30,
    elevation: 8,
  },
  fabIcon: {
    marginTop: -5,
    fontSize: 20,
    color: '#03A9F4',
  },
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
    height: SCREEN_WIDTH * 0.7,
    marginLeft: SCREEN_WIDTH * 0.035,
    marginBottom: SCREEN_WIDTH * 0.035,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },

  image: {
    height: SCREEN_WIDTH * 0.35,
    width: SCREEN_WIDTH * 0.35,
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
