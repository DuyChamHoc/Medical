import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  ImageBackground,
  Modal,
  TextInput,
} from 'react-native';
import {colors} from '../../global/styles';
import firestore from '@react-native-firebase/firestore';
const SCREEN_WIDTH = Dimensions.get('window').width;
import {Avatar, Button, Icon} from 'react-native-elements';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import HomeAdminHeader from '../components/HomeAdminHeader';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

export default function Category({navigation}) {
  const [imagebackup, setimagebackup] = useState('');
  const [addmodalVisible, setaddModalVisible] = useState(false);
  const [updatemodalVisible, setupdateModalVisible] = useState(false);
  const [image1, setimage1] = useState('');
  const [getName, setName] = useState('');
  const [getCate, setCate] = useState([]);
  const [getItem, setItem] = useState();
  const refdata = firestore().collection('Products');
  const refcate = firestore().collection('categories');
  const [selected, setSelected] = useState();
  const [data, setData] = useState([]);
  const [render, setrender] = useState(0);

  useEffect(() => {
    return refcate.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        list.push(doc.data());
      });
      setCate(list);
      setSelected(list[0].name);
      setItem(list[0]);
    });
  }, [render]);

  useEffect(() => {
    return refdata.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        if (getCate != [] && doc.data().category == getCate[0].name)
          list.push(doc.data());
      });
      setData(list);
    });
  }, [getCate]);

  const handleSelected = (value, item) => {
    setItem(item);
    setSelected(value);
    return refdata.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        if (doc.data().category == value) list.push(doc.data());
      });
      setData(list);
    });
  };
  const showmodal = () => {
    setName('');
    setaddModalVisible(!addmodalVisible);
  };
  const showmodalupdate = () => {
    setName(getItem.name);
    setimagebackup(getItem.image);
    setupdateModalVisible(!updatemodalVisible);
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

  const create = () => {
    firestore()
      .collection('categories')
      .add({
        name: getName,
        image: image1,
      })
      .then(() => {
        console.log('categories added!');
        setaddModalVisible(!addmodalVisible);
        setrender(Math.random());
      });
  };

  const updateCate = () => {
    firestore()
      .collection('categories')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data().name == getItem.name) {
            firestore()
              .collection('categories')
              .doc(documentSnapshot.id)
              .update({
                image: image1,
                name: getName,
              })
              .then(() => {
                console.log('categories updated!');
              });
          }
        });
      });
    setName(''), setimagebackup(''), setimage1('');
    setrender(Math.random());
    setupdateModalVisible(!updatemodalVisible);
  };
  const deleteCate = () => {
    firestore()
      .collection('categories')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data().name == getItem.name) {
            firestore()
              .collection('categories')
              .doc(documentSnapshot.id)
              .delete()
              .then(() => {
                console.log('categories deleted!');
              });
          }
        });
      });
    setupdateModalVisible(!updatemodalVisible);
    setName(''), setimagebackup(''), setimage1('');
  };
  return (
    <View style={{flex: 1}}>
      <HomeAdminHeader navigation={navigation} title="Category" />
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
          List of categories!
        </Text>
      </View>
      <View style={{marginLeft: 5, marginBottom: 10}}>
        <View>
          <FlatList
            showsVerticalScrollIndicator={false}
            horizontal={true}
            data={getCate}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => (
              <CategoriesCard
                image={item.image}
                title={item.name}
                onPress={handleSelected}
                value={selected}
                item={item}
              />
            )}
          />
        </View>
      </View>

      <View>
        <FlatList
          style={{marginLeft: 5, marginBottom: 10}}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={data}
          extraData={data}
          contentContainerStyle={{paddingBottom: 260}}
          keyExtractor={item => {
            return item.id;
          }}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <ProductCard screenWidth={SCREEN_WIDTH * 0.4} item={item} />
          )}
        />
      </View>
      {!addmodalVisible && !updatemodalVisible ? (
        <TouchableOpacity
          style={styles.fabupdate}
          onPress={() => {
            showmodalupdate();
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.fabIcon}>-</Text>
            <Icon3 name="category" size={28} style={{marginTop: 10}} />
          </View>
        </TouchableOpacity>
      ) : (
        <></>
      )}
      {!addmodalVisible && !updatemodalVisible ? (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            showmodal();
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.fabIcon}>+</Text>
            <Icon3 name="category" size={28} style={{marginTop: 10}} />
          </View>
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
              Add categories !
            </Text>
            <TouchableOpacity
              onPress={() => {
                setaddModalVisible(!addmodalVisible);
                setimagebackup('');
              }}>
              <Icon1
                size={23}
                name="close"
                style={{marginTop: -25, color: colors.black, marginLeft: 330}}
              />
            </TouchableOpacity>

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <Avatar
                size={105}
                rounded
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
                marginTop: -30,
                marginLeft: 130,
              }}>
              <Icon2
                size={45}
                name="camera"
                onPress={() => {
                  uploadimage();
                }}
                style={{color: colors.text}}
              />
            </View>
            <TextInput
              style={{
                height: 42,
                marginTop: 5,
                width: 320,
                borderWidth: 1,
                borderColor: '#86939e',
                marginHorizontal: 30,
                borderRadius: 12,
                paddingHorizontal: 10,
                color: colors.text,
              }}
              placeholder="Name"
              value={getName}
              onChangeText={txt => setName(txt)}
            />
            <View style={{alignItems: 'flex-end', marginRight: 30}}>
              <Button
                title="Create"
                buttonStyle={{
                  marginTop: 5,
                  marginBottom: 20,
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

      {/* {updatedddddddddddddddddddddddddddddd} */}
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
                marginTop: 10,
              }}>
              Add categories !
            </Text>
            <TouchableOpacity
              onPress={() => {
                setupdateModalVisible(!updatemodalVisible);
                setimagebackup('');
              }}>
              <Icon1
                size={23}
                name="close"
                style={{marginTop: -25, color: colors.black, marginLeft: 330}}
              />
            </TouchableOpacity>

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <Avatar
                size={105}
                rounded
                source={{
                  uri: imagebackup.path ? imagebackup.path : imagebackup,
                }}
              />
            </View>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: -30,
                marginLeft: 130,
              }}>
              <Icon2
                size={45}
                name="camera"
                onPress={() => {
                  uploadimage();
                }}
                style={{color: colors.text}}
              />
            </View>
            <TextInput
              style={{
                height: 42,
                marginTop: 5,
                width: 320,
                borderWidth: 1,
                borderColor: '#86939e',
                marginHorizontal: 30,
                borderRadius: 12,
                paddingHorizontal: 10,
                color: colors.text,
              }}
              placeholder="Name"
              value={getName}
              onChangeText={txt => setName(txt)}
            />
            <View
              style={{
                marginTop: 20,
                marginLeft: 110,
                marginRight: 30,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Button
                title="Delete"
                buttonStyle={{
                  marginTop: 5,
                  marginBottom: 20,
                  backgroundColor: colors.blue,
                  borderRadius: 30,
                  width: 100,
                  alignSelf: 'center',
                  marginLeft: 15,
                }}
                onPress={() => {
                  deleteCate();
                }}
              />
              <Button
                title="Update"
                buttonStyle={{
                  marginTop: 5,
                  marginBottom: 20,
                  backgroundColor: colors.blue,
                  borderRadius: 30,
                  width: 100,
                  alignSelf: 'center',
                  marginLeft: 15,
                }}
                onPress={() => {
                  updateCate();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function ProductCard({screenWidth, item}) {
  return (
    <View style={[styles.cardView, {backgroundColor: colors.background}]}>
      <View style={[styles.imageView1, {marginTop: 20}, {width: screenWidth}]}>
        <ImageBackground style={styles.image} source={{uri: item.image[0]}} />
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
  );
}

function CategoriesCard({image, title, onPress, value, item}) {
  return (
    <TouchableOpacity onPress={() => onPress(title, item)}>
      <View
        style={[
          value === title
            ? {...styles.smallCardSelected}
            : {...styles.smallCard},
        ]}>
        <Image style={{height: 75, width: 100}} source={{uri: image}} />
        <View>
          <Text
            style={[
              value === title
                ? {...styles.smallCardTextSelected}
                : {...styles.smallCardText},
            ]}>
            {title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  fabupdate: {
    // top: 730,
    top: SCREEN_WIDTH * 1.48,
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
  fab: {
    // top: 730,
    top: SCREEN_WIDTH * 1.65,
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
    fontSize: 28,
    color: '#03A9F4',
    marginTop: 5,
  },
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },

  text1: {
    color: colors.text,
    fontSize: 16,
  },

  TextInput: {
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 0,
    borderColor: '#86939e',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },

  SearchArea: {
    marginTop: 10,
    width: 375,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.grey4,
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchIcon: {
    fontSize: 24,
    padding: 5,
    color: colors.grey2,
    marginLeft: 10,
  },

  view1: {
    height: 70,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },

  view2: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },

  icon2: {
    fontSize: 24,
    padding: 5,
    color: colors.grey2,
  },
  modal: {
    flex: 1,
  },
  imageView: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.4475,
    height: SCREEN_WIDTH * 0.7,
    marginLeft: SCREEN_WIDTH * 0.035,
    marginBottom: SCREEN_WIDTH * 0.035,
  },

  image: {
    height: SCREEN_WIDTH * 0.3,
    width: SCREEN_WIDTH * 0.3,
    borderRadius: 10,
    marginRight: 15,
    marginTop: 15,
  },

  listHeader: {
    fontSize: 16,
    color: colors.grey2,
    paddingBottom: 10,
    marginLeft: 12,
  },

  textView: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 52, 52,0.3)',
  },

  smallCardSelected: {
    borderRadius: 20,
    backgroundColor: colors.buttons,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    width: 170,
    margin: 10,
    height: 120,
  },

  smallCard: {
    borderRadius: 20,
    backgroundColor: colors.grey5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    width: 170,
    margin: 10,
    height: 120,
  },

  smallCardText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.grey2,
  },

  smallCardTextSelected: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.cardbackground,
  },
  frame: {},
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
  imageView1: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_WIDTH * 0.5,
    marginLeft: SCREEN_WIDTH * 0.035,
    marginBottom: SCREEN_WIDTH * 0.035,
  },
});
