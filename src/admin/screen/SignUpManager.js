import React, {useState, useEffect} from 'react';
import {colors} from '../../global/styles';
import {Button, Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Icon3 from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import HomeAdminHeader from '../components/HomeAdminHeader';
import ImagePicker from 'react-native-image-crop-picker';
import {FlatList} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import DatetimePicker from '@react-native-community/datetimepicker';
import {Avatar} from 'react-native-elements';
GoogleSignin.configure({
  webClientId:
    '359199845323-h10e31djcqb9fbobv2vknmh1h1h5hge0.apps.googleusercontent.com',
});
const SCREEN_WIDTH = Dimensions.get('window').width;
export default function SignUpManager({navigation}) {
  const [addmodalVisible, setaddModalVisible] = useState(false);
  const [updatemodalVisible, setupdateModalVisible] = useState(false);
  const [getVisible, setVisible] = useState(false);
  const [employeemanager, setemployeemanager] = useState([]);

  const [imagebackup, setimagebackup] = useState('');
  const [getName, setName] = useState('');
  const [getAddress, setAddress] = useState('');
  const [getPhone, setPhone] = useState('');
  const [getEmail, setEmail] = useState('');
  const [getPassword, setPassword] = useState('');
  const [date, setdate] = useState('');
  const [datetime, setdatetime] = useState(new Date());
  const [image1, setimage1] = useState('');
  const [mode, setmode] = useState('date');
  const [show, setShow] = useState(false);
  const [check, getcheck] = useState(false);
  const [getuid, setuid] = useState('');

  //date
  const showMode = currentMode => {
    setShow(true);
    setmode(currentMode);
  };
  const showDatepicker = () => {
    showMode('date');
  };
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setdatetime(currentDate);
    setdate(
      currentDate.getDate() +
        '/' +
        (currentDate.getMonth() + 1) +
        '/' +
        currentDate.getFullYear(),
    );
  };
  //

  const showmodal = () => {
    setName('');
    setAddress('');
    setPhone('');
    setdate('');
    setEmail('');
    setPassword('');
    setaddModalVisible(!addmodalVisible);
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

  const create = async () => {
    if (
      getPassword !== '' &&
      getEmail !== '' &&
      getName !== '' &&
      getAddress !== '' &&
      getPhone !== '' &&
      date !== ''
    ) {
      auth()
        .createUserWithEmailAndPassword(getEmail, getPassword)
        .then(async () => {
          console.log('User account created');
          firestore()
            .collection('Employee')
            .doc(auth().currentUser.uid)
            .set({
              uid: auth().currentUser.uid,
              name: getName,
              address: getAddress,
              phone: getPhone,
              date: date,
              roll: 2,
              image: image1,
            })
            .then(async () => {
              console.log('Account added list!');
              setaddModalVisible(!addmodalVisible);
              setimagebackup('');
              firestore()
                .collection('Users')
                .doc(auth().currentUser.uid)
                .set({
                  roll: 2,
                })
                .then(async () => {
                  console.log('User added!');
                  await auth().signInWithEmailAndPassword(
                    'admin@gmail.com',
                    '123456',
                  );
                  navigation.navigate('employeemanager');
                });
            });
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
          }

          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
          }
          console.error(error);
        });
    }
  };

  const update = () => {
    firestore()
      .collection('Employee')
      .doc(getuid)
      .set({
        uid: getuid,
        name: getName,
        address: getAddress,
        phone: getPhone,
        date: date,
        roll: 2,
        image: image1,
      })
      .then(() => {
        console.log('Employee update!');
        setupdateModalVisible(!updatemodalVisible);
        setimagebackup('');
      });
  };
  const ref = firestore().collection('Employee');
  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        list.push(doc.data());
      });
      setemployeemanager(list);
    });
  }, [check]);
  const dataupdate = item => {
    setName(item.name);
    setAddress(item.address);
    setPhone(item.phone);
    setimage1(item.image);
    setdate(item.date);
    setuid(item.uid);
    setupdateModalVisible(!updatemodalVisible);
  };
  const deleteEmployee = () => {
    firestore()
      .collection('Employee')
      .doc(getuid)
      .delete()
      .then(() => {
        console.log('Employee deleted!');
        firestore()
          .collection('Users')
          .doc(getuid)
          .delete()
          .then(() => {
            console.log('User deleted!');
            setupdateModalVisible(!updatemodalVisible);
            setimagebackup('');
          });
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
              <Avatar
                size={80}
                rounded
                source={{
                  uri: item.image,
                }}
              />
            </View>
            <View style={{marginLeft: 30}}>
              <Text style={{fontWeight: '500', fontSize: 16, color: 'black'}}>
                Phone: {item.phone}
              </Text>
              <Text style={{fontWeight: '500', fontSize: 16, color: 'black'}}>
                Address: {item.address}
              </Text>
              <Text style={{fontWeight: '500', fontSize: 16, color: 'black'}}>
                Name: {item.name}
              </Text>
              <Text style={{fontWeight: '500', fontSize: 16, color: 'black'}}>
                Date of birth: {item.date}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View>
      <HomeAdminHeader navigation={navigation} title="Employee Manager" />
      <FlatList
        data={employeemanager}
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
          <Icon3 name="user" size={30} />
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
              Create Account
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
            <TextInput
              style={{
                height: 42,
                marginTop: 10,
                width: 320,
                borderWidth: 1,
                borderColor: '#86939e',
                marginHorizontal: 30,
                borderRadius: 12,
                paddingHorizontal: 10,
                color: colors.text,
              }}
              placeholder="Address"
              value={getAddress}
              onChangeText={txt => setAddress(txt)}
            />
            <TextInput
              style={{
                height: 42,
                marginTop: 10,
                width: 320,
                borderWidth: 1,
                borderColor: '#86939e',
                marginHorizontal: 30,
                borderRadius: 12,
                paddingHorizontal: 10,
                color: colors.text,
              }}
              placeholder="Phone Number"
              value={getPhone}
              onChangeText={txt => setPhone(txt)}
            />
            <View style={{width: 320, flexDirection: 'row'}}>
              <TextInput
                style={{
                  height: 42,
                  marginTop: 10,
                  width: 150,
                  borderWidth: 1,
                  borderColor: '#86939e',
                  marginHorizontal: 30,
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  color: colors.text,
                }}
                placeholder="Date of Birth"
                value={date}
                onChangeText={txt => setdate(txt)}
              />
              <Icon1
                size={30}
                name="calendar"
                style={{
                  marginLeft: 10,
                  marginTop: 15,
                  color: colors.text,
                }}
                onPress={showDatepicker}
              />
              {show && (
                <DatetimePicker
                  testID="dateTimePicker"
                  value={datetime}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                />
              )}
            </View>
            <TextInput
              style={{
                height: 42,
                marginTop: 10,
                width: 320,
                borderWidth: 1,
                borderColor: '#86939e',
                marginHorizontal: 30,
                borderRadius: 12,
                paddingHorizontal: 10,
                color: colors.text,
              }}
              placeholder="Email"
              value={getEmail}
              onChangeText={txt => setEmail(txt)}
            />

            <View style={styles.view14}>
              <TextInput
                placeholder="Password"
                style={{flex: 1, marginLeft: 5}}
                onChangeText={txt => setPassword(txt)}
                value={getPassword}
                secureTextEntry={getVisible ? false : true}
              />
              <Animatable.View duration={400}>
                <Icon
                  name={getVisible ? 'visibility' : 'visibility-off'}
                  iconStyle={{color: colors.grey3, marginRight: 10}}
                  type="material"
                  onPress={() => {
                    setVisible(!getVisible);
                  }}
                />
              </Animatable.View>
            </View>

            <View style={{alignItems: 'flex-end', marginRight: 30}}>
              <Button
                title="Create"
                buttonStyle={{
                  marginTop: 5,
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
              Update Account
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
                marginTop: 10,
              }}>
              <Avatar
                size={110}
                rounded
                source={{uri: imagebackup ? imagebackup.path : image1}}
              />
            </View>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: -30,
                marginLeft: 120,
              }}>
              <Icon2
                size={50}
                name="camera"
                onPress={() => {
                  uploadimage();
                }}
                style={{color: colors.text}}
              />
            </View>
            <TextInput
              style={{
                marginTop: 10,
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
              placeholder="Address"
              value={getAddress}
              onChangeText={txt => setAddress(txt)}
            />
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
              placeholder="Phone Number"
              value={getPhone}
              onChangeText={txt => setPhone(txt)}
            />
            <View style={{width: 320, flexDirection: 'row'}}>
              <TextInput
                style={{
                  marginTop: 15,
                  width: 150,
                  borderWidth: 1,
                  borderColor: '#86939e',
                  marginHorizontal: 30,
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  color: colors.text,
                }}
                placeholder="Date of Birth"
                value={date}
                onChangeText={txt => setdate(txt)}
              />
              <Icon1
                size={30}
                name="calendar"
                style={{
                  marginLeft: 10,
                  marginTop: 25,
                  color: colors.text,
                }}
                onPress={showDatepicker}
              />
              {show && (
                <DatetimePicker
                  testID="dateTimePicker"
                  value={datetime}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                />
              )}
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginLeft: 120,
                marginBottom: 10,
                marginTop: 10,
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
                  deleteEmployee();
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
    // top: 740,
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
