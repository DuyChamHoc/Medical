import React, {useState, useEffect} from 'react';
import {colors} from '../../global/styles';
import {Button} from 'react-native-elements';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {FlatList} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import SearchBar from 'react-native-elements/dist/searchbar/SearchBar-ios';
import storage from '@react-native-firebase/storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import HomeManagerHeader from '../components/HomeManagerHeader';
GoogleSignin.configure({
  webClientId:
    '359199845323-h10e31djcqb9fbobv2vknmh1h1h5hge0.apps.googleusercontent.com',
});
const SCREEN_WIDTH = Dimensions.get('window').width;
export default function HomeManager({navigation}) {
  const [getTotalData, setTotalData] = useState([]);
  const [getTotalDataBackup, setTotalDataBackup] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [imagebackup, setimagebackup] = useState('');
  const [name1, setname1] = useState('');
  const [quantity, setquantity] = useState('');
  const [getquantityshow, setquantityshow] = useState('');
  const [render, setrender] = useState(0);
  const [search, setsearch] = useState('');
  const searchdate = val => {
    setsearch(val);
    setTotalData(getTotalDataBackup.filter(it => it.name.match(val)));
  };

  const ref = firestore().collection('Products');
  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        list.push(doc.data());
      });
      setTotalData(list);
      setTotalDataBackup(list);
    });
  }, [render]);

  const showmodal = item => {
    setquantityshow(item.quantity);
    setname1(item.name);
    setimagebackup(item.image[0]);
    setModalVisible(!modalVisible);
  };

  const GetQuantity = () => {
    if (quantity != '' && quantity <= getquantityshow) {
      firestore()
        .collection('Products')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            if (documentSnapshot.data().name == name1) {
              firestore()
                .collection('Products')
                .doc(documentSnapshot.id)
                .update({
                  quantity: getquantityshow - quantity,
                })
                .then(() => {
                  console.log('Products updated!');
                  setModalVisible(!modalVisible);
                });
            }
          });
        });
    } else {
      Alert.alert('Please enter a quantity correctly');
    }
  };

  return (
    <View>
      <HomeManagerHeader navigation={navigation} title="Home" />
      <View
        style={{
          height: 40,
          backgroundColor: '#eff2cc',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../global/image/cart_order.png')}
          style={{height: 30, width: '15%', resizeMode: 'contain'}}
        />
        <Text style={{color: 'black', fontSize: 16, fontWeight: '700'}}>
          List of medicine!
        </Text>
      </View>
      <View style={{marginTop: -15}}>
        <SearchBar
          placeholder="Search by name...?"
          onChangeText={val => searchdate(val)}
          value={search}
          autoCapitalize="none"
        />
      </View>
      <FlatList
        style={{marginLeft: 5, marginTop: -10}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 140}}
        horizontal={false}
        numColumns={2}
        data={getTotalData}
        keyExtractor={item => {
          return item.id;
        }}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <View>
            <TouchableOpacity
              onPress={() => {
                showmodal(item);
              }}>
              <View
                style={[styles.cardView, {backgroundColor: colors.background}]}>
                <View
                  style={[
                    styles.imageView,
                    {marginTop: 20},
                    {width: SCREEN_WIDTH * 0.4},
                  ]}>
                  <ImageBackground
                    style={styles.image}
                    source={{uri: item.image[0]}}
                  />
                  <Text
                    style={{
                      color: colors.text,
                      marginTop: 5,
                      marginRight: 10,
                      textAlign: 'center',
                    }}>
                    {item.name}
                  </Text>
                  <Text
                    style={[
                      {
                        color: colors.accent,
                        textAlign: 'center',
                        fontWeight: '500',
                        marginTop: 5,
                      },
                    ]}>
                    Quantity: {item.quantity}
                  </Text>
                  <Text
                    style={[
                      {
                        color: colors.accent,
                        textAlign: 'center',
                        fontWeight: '500',
                        marginTop: 5,
                      },
                    ]}>
                    {item.supplier}
                  </Text>
                  <Text
                    style={[
                      {
                        color: colors.accent,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        marginTop: 5,
                      },
                    ]}>
                    {item.gia}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* {adddddddddddddddddddddddddddddddđ} */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              padding: 20,
              backgroundColor: 'white',
              borderRadius: 20,
              shadowOpacity: 0.25,
              shadowRadius: 10,
              elevation: 10,
              width: '95%',
            }}>
            <View
              style={{
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: 'bold',
                  color: colors.blue,
                }}>
                Get Medicine
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Icon1
                  size={25}
                  name="close"
                  style={{marginTop: -25, color: colors.black, marginLeft: 310}}
                />
              </TouchableOpacity>
            </View>

            <KeyboardAwareScrollView>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <ImageBackground
                  style={{
                    height: SCREEN_WIDTH * 0.3,
                    width: SCREEN_WIDTH * 0.3,
                    marginRight: 10,
                  }}
                  source={{
                    uri: imagebackup,
                  }}
                />
              </View>
              <View
                style={{
                  marginTop: 15,
                  marginLeft: 10,
                  width: '95%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{color: 'black', fontSize: 18, fontWeight: 'bold'}}>
                  {name1}
                </Text>
                <Text
                  style={{color: 'black', fontSize: 18, fontWeight: 'bold'}}>
                  Quantity: {getquantityshow}
                </Text>
                <TextInput
                  style={{
                    marginTop: 20,
                    width: 300,
                    borderWidth: 1,
                    borderColor: '#86939e',
                    marginHorizontal: 20,
                    borderRadius: 12,
                    paddingHorizontal: 10,
                    color: colors.text,
                  }}
                  placeholder="Get quantity"
                  onChangeText={txt => setquantity(txt)}
                />
              </View>

              <View
                style={{
                  alignItems: 'flex-end',
                  marginRight: 10,
                  marginTop: 20,
                }}>
                <Button
                  title="Get"
                  buttonStyle={{
                    backgroundColor: colors.blue,
                    borderRadius: 30,
                    width: 100,
                    alignSelf: 'center',
                    marginLeft: 15,
                  }}
                  onPress={() => {
                    GetQuantity();
                  }}
                />
              </View>
            </KeyboardAwareScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    top: 730,
    borderWidth: 1,
    borderColor: '#03A9F4',
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    right: 20,
    bottom: 50,
    backgroundColor: 'white',
    borderRadius: 30,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 40,
    color: '#03A9F4',
    marginTop: -5,
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
    marginTop: -10,
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
