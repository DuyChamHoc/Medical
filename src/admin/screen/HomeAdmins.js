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
} from 'react-native';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import HomeAdminHeader from '../components/HomeAdminHeader';
import ImagePicker from 'react-native-image-crop-picker';
import {FlatList} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import SearchBar from 'react-native-elements/dist/searchbar/SearchBar-ios';
import storage from '@react-native-firebase/storage';
GoogleSignin.configure({
  webClientId:
    '359199845323-h10e31djcqb9fbobv2vknmh1h1h5hge0.apps.googleusercontent.com',
});
const SCREEN_WIDTH = Dimensions.get('window').width;
export default function HomeAdmin({navigation}) {
  const [getTotalData, setTotalData] = useState([]);
  const [getTotalDataBackup, setTotalDataBackup] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [gia1, setgia1] = useState('');
  const [image1, setimage1] = useState('');
  const [imagebackup, setimagebackup] = useState('');
  const [mota1, setmota1] = useState('');
  const [name1, setname1] = useState('');
  const [nhathuoc1, setnhathuoc1] = useState('');
  const [itemthuoc, setitemthuoc] = useState('');
  const [render, setrender] = useState(0);
  const [search, setsearch] = useState('');
  const searchdate = val => {
    setsearch(val);
    setTotalData(getTotalDataBackup.filter(it => it.name.match(val)));
  };

  useEffect(() => {
    firestore()
      .collection('Data')
      .doc('TotalData')
      .get()
      .then(documentSnapshot => {
        const data = documentSnapshot.data();
        setTotalData(data.TotalData);
        setTotalDataBackup(data.TotalData);
      });
  }, [render]);

  const showmodal = () => {
    setgia1('');
    setname1('');
    setimage1('');
    setmota1('');
    setnhathuoc1('');
    setModalVisible(!modalVisible);
  };

  const uploadimage = () => {
    ImagePicker.openPicker({
      cropping: true,
    }).then(async image => {
      setimagebackup(image);
      let imgName = image.path.substring(image.path.lastIndexOf('/') + 1);
      const reference = storage().ref(imgName);
      await reference.putFile(image.path);
      setimage1(await storage().ref(imgName).getDownloadURL());
    });
  };

  const add = () => {
    const a = Math.random();
    firestore()
      .collection('Data')
      .doc('TotalData')
      .get()
      .then(documentSnapshot => {
        updatethuoc([
          ...documentSnapshot.data().TotalData,
          {
            SL: 1,
            gia: gia1,
            id: a,
            image: image1,
            mota: mota1,
            name: name1,
            nhathuoc: nhathuoc1,
          },
        ]);
      });
    setModalVisible(!modalVisible);
    setimagebackup('');
    setrender(Math.random());
  };

  const showmodal1 = item => {
    setgia1(item.gia);
    setimage1(item.image);
    setmota1(item.mota);
    setname1(item.name);
    setnhathuoc1(item.nhathuoc);
    setitemthuoc(item);
    setModalVisible1(!modalVisible1);
  };

  const update = item => {
    firestore()
      .collection('Data')
      .doc('TotalData')
      .get()
      .then(documentSnapshot => {
        documentSnapshot.data().TotalData.map(items => {
          if (items.id == item.id) {
            (items.gia = gia1),
              (items.image = image1),
              (items.mota = mota1),
              (items.name = name1),
              (items.nhathuoc = nhathuoc1);
            updatethuoc(documentSnapshot.data().TotalData);
          }
        });
      });
    setModalVisible1(!modalVisible1);
    setitemthuoc('');
    setgia1('');
    setname1('');
    setimage1('');
    setmota1('');
    setnhathuoc1('');
    setrender(Math.random());
  };

  const updatethuoc = add => {
    firestore()
      .collection('Data')
      .doc('TotalData')
      .update({
        TotalData: add,
      })
      .then(() => {
        console.log('Thuoc updated!');
        setrender(Math.random());
      });
  };

  const deleteItem = item => {
    firestore()
      .collection('Data')
      .doc('TotalData')
      .get()
      .then(documentSnapshot => {
        updatethuoc(
          documentSnapshot
            .data()
            .TotalData.filter(items => items.id != item.id),
        );
      });
    setModalVisible1(!modalVisible1);
    setitemthuoc('');
  };

  return (
    <View>
      <HomeAdminHeader navigation={navigation} title="Home" />
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
          placeholder="Search by date..."
          onChangeText={val => searchdate(val)}
          value={search}
          autoCapitalize="none"
          // containerStyle={styles.searchContainer}
          // inputStyle={styles.searchInput}
        />
      </View>
      <FlatList
        style={{marginLeft: 5, marginTop: -10}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 80}}
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
                showmodal1(item);
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
                    source={{uri: item.image}}></ImageBackground>
                  <View>
                    <Text
                      style={{
                        color: colors.text,
                        marginTop: 10,
                        marginRight: 10,
                        textAlign: 'center',
                      }}>
                      {item.name}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={[
                        {
                          color: colors.accent,
                          textAlign: 'center',
                          fontWeight: 'bold',
                          marginTop: 10,
                        },
                      ]}>
                      {item.gia}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* updatedđdddddddddddddddddddddddđ */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible1}
        style={{backgroundColor: colors.background}}
        onRequestClose={() => {
          setModalVisible1(!modalVisible1);
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
                marginTop: -10,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: 'bold',
                  color: colors.blue,
                  alignSelf: 'center',
                }}>
                Update Medicine
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible1(!modalVisible1);
                  setimagebackup('');
                }}>
                <Icon1
                  size={25}
                  name="close"
                  style={{marginTop: -25, color: colors.black, marginLeft: 330}}
                />
              </TouchableOpacity>
            </View>

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
                  marginRight: 15,
                }}
                source={{uri: imagebackup ? imagebackup.path : image1}}
              />
            </View>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: -20,
                marginLeft: 180,
              }}>
              <Icon2
                size={60}
                name="camera"
                onPress={() => {
                  uploadimage();
                }}
                style={{color: colors.text}}
              />
            </View>

            <TextInput
              style={{
                marginTop: 5,
                width: 320,
                borderWidth: 1,
                borderColor: '#86939e',
                marginHorizontal: 20,
                borderRadius: 12,
                paddingHorizontal: 10,
                color: colors.text,
              }}
              placeholder="Name medicine"
              value={name1}
              onChangeText={txt => setname1(txt)}
            />
            <TextInput
              style={{
                marginTop: 10,
                width: 150,
                borderWidth: 1,
                borderColor: '#86939e',
                marginHorizontal: 20,
                borderRadius: 12,
                paddingHorizontal: 10,
                color: colors.text,
              }}
              placeholder="Price"
              value={gia1}
              onChangeText={txt => setgia1(txt)}
            />
            <TextInput
              style={{
                marginTop: 10,
                width: 320,
                borderWidth: 1,
                borderColor: '#86939e',
                marginHorizontal: 20,
                borderRadius: 12,
                paddingHorizontal: 10,
                color: colors.text,
              }}
              placeholder="Pharmacy"
              value={nhathuoc1}
              onChangeText={txt => setnhathuoc1(txt)}
            />
            <TextInput
              style={{
                marginTop: 10,
                width: 320,
                borderWidth: 1,
                borderColor: '#86939e',
                marginHorizontal: 20,
                borderRadius: 12,
                marginBottom: 10,
                paddingHorizontal: 10,
                color: colors.text,
              }}
              placeholder="Description"
              value={mota1}
              onChangeText={txt => setmota1(txt)}
            />
            <View style={{flexDirection: 'row'}}>
              <Button
                onPress={() => {
                  deleteItem(itemthuoc);
                  setimagebackup('');
                }}
                title="Delete"
                buttonStyle={{
                  backgroundColor: colors.blue,
                  borderRadius: 30,
                  width: 100,
                  marginLeft: 130,
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
                  update(itemthuoc);
                  setimagebackup('');
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {!modalVisible && !modalVisible1 ? (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            showmodal();
          }}>
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      ) : (
        <></>
      )}

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
                marginTop: -10,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: 'bold',
                  color: colors.blue,
                }}>
                Add Medicine
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setimagebackup('');
                }}>
                <Icon1
                  size={25}
                  name="close"
                  style={{marginTop: -25, color: colors.black, marginLeft: 330}}
                />
              </TouchableOpacity>
            </View>

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
                  uri: imagebackup
                    ? imagebackup.path
                    : 'https://ps.w.org/file-upload-types/assets/icon-256x256.png?rev=2243278',
                }}
              />
            </View>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: -20,
                marginLeft: 160,
              }}>
              <Icon2
                size={60}
                name="camera"
                onPress={() => {
                  uploadimage();
                }}
                style={{color: colors.text}}
              />
            </View>
            <TextInput
              style={{
                marginTop: 5,
                width: 320,
                borderWidth: 1,
                borderColor: '#86939e',
                marginHorizontal: 20,
                borderRadius: 12,
                paddingHorizontal: 10,
                color: colors.text,
              }}
              placeholder="Name medicine"
              value={name1}
              onChangeText={txt => setname1(txt)}
            />
            <TextInput
              style={{
                marginTop: 10,
                width: 150,
                borderWidth: 1,
                borderColor: '#86939e',
                marginHorizontal: 20,
                borderRadius: 12,
                paddingHorizontal: 10,
                color: colors.text,
              }}
              placeholder="Price"
              value={gia1}
              onChangeText={txt => setgia1(txt)}
            />
            <TextInput
              style={{
                marginTop: 10,
                width: 320,
                borderWidth: 1,
                borderColor: '#86939e',
                marginHorizontal: 20,
                borderRadius: 12,
                paddingHorizontal: 10,
                color: colors.text,
              }}
              placeholder="Pharmacy"
              value={nhathuoc1}
              onChangeText={txt => setnhathuoc1(txt)}
            />
            <TextInput
              style={{
                marginTop: 10,
                width: 320,
                borderWidth: 1,
                borderColor: '#86939e',
                marginHorizontal: 20,
                borderRadius: 12,
                marginBottom: 10,
                paddingHorizontal: 10,
                color: colors.text,
              }}
              placeholder="Description"
              value={mota1}
              onChangeText={txt => setmota1(txt)}
            />
            <View style={{alignItems: 'flex-end', marginRight: 10}}>
              <Button
                title="Add"
                buttonStyle={{
                  backgroundColor: colors.blue,
                  borderRadius: 30,
                  width: 100,
                  alignSelf: 'center',
                  marginLeft: 15,
                }}
                onPress={() => {
                  add();
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
  fab: {
    top: 730,
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
    fontSize: 40,
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
