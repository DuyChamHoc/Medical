import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  Dimensions,
  ImageBackground,
  TouchableWithoutFeedback,
  FlatList,
  Keyboard,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon1 from 'react-native-vector-icons/AntDesign';
import {useTranslation} from 'react-i18next';
import firestore from '@react-native-firebase/firestore';
import {useTheme} from 'react-native-paper';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SearchComponent = () => {
  const refdata = firestore().collection('Products');
  const {t} = useTranslation();
  const [getTotalData, setTotalData] = useState('');
  useEffect(() => {
    return refdata.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        list.push(doc.data());
      });
      setTotalData(list);
    });
  }, []);
  const {colors} = useTheme();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [textInputFossued, setTextInputFossued] = useState(true);
  const textInput = useRef(0);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');

  const handleSearch = text => {
    if (text) {
      const newData = getTotalData.filter(item => {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setData(newData);
      setSearch(text);
    } else {
      setData([]);
      setSearch('');
    }
  };
  const renderItem = ({item}) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setModalVisible(false);
          setTextInputFossued(true);
          navigation.push('ProductInfo', {item: item});
        }}>
        <View style={styles.imageView}>
          <ImageBackground style={styles.image} source={{uri: item.image[0]}} />
          <View>
            <Text
              style={{
                color: colors.text,
                marginTop: 10,
                textAlign: 'center',
              }}>
              {item.name}
            </Text>
          </View>
          <View>
            <Text
              style={[
                {
                  color: 'red',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  marginTop: 10,
                },
              ]}>
              {item.gia}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <TouchableWithoutFeedback
          onPress={() => {
            setModalVisible(true);
          }}>
          <View style={styles.SearchArea}>
            <Icon
              name="search"
              style={{
                fontSize: 24,
                padding: 5,
                marginLeft: 10,
                color: colors.text,
              }}
            />
            <Text style={{fontSize: 15, marginLeft: 10, color: colors.text}}>
              {t('Tìm kiếm thuốc và dụng cụ y tế ?')}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <Modal animationType="fade" transparent={false} visible={modalVisible}>
          <View style={{flex: 1, backgroundColor: colors.background}}>
            <View style={styles.view1}>
              <View style={styles.TextInput}>
                <Animatable.View
                  animation={textInputFossued ? 'fadeInRight' : 'fadeInLeft'}
                  duration={400}>
                  <Icon
                    name={textInputFossued ? 'arrow-left' : 'search'}
                    onPress={() => {
                      if (textInputFossued) setModalVisible(false);
                      setTextInputFossued(true);
                    }}
                    style={{
                      fontSize: 24,
                      padding: 5,
                      color: colors.text,
                    }}
                    type="material"
                    iconStyle={{marginRight: 5}}
                  />
                </Animatable.View>
                <TextInput
                  style={{width: '80%', color: colors.text}}
                  placeholder=""
                  autoFocus={true}
                  ref={textInput}
                  value={search}
                  onFocus={() => {
                    setTextInputFossued(true);
                  }}
                  onChangeText={text => handleSearch(text)}
                />
                <Animatable.View
                  animation={textInputFossued ? 'fadeInLeft' : ''}
                  duration={400}>
                  <Icon1
                    name={textInputFossued ? 'close' : null}
                    iconStyle={{color: colors.grey3}}
                    type="material"
                    style={{marginRight: 10, fontSize: 20, color: colors.text}}
                    onPress={() => {
                      textInput.current.clear();
                      setTextInputFossued(false);
                      setModalVisible(false);
                      setData([]);
                      setSearch('');
                    }}
                  />
                </Animatable.View>
              </View>
            </View>
            <FlatList
              data={data}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              horizontal={false}
              showsverticalScrollIndicator={true}
              numColumns={2}
              onScroll={() => {
                Keyboard.dismiss();
              }}
            />
          </View>
        </Modal>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  text1: {
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
    height: 51,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchIcon: {
    fontSize: 24,
    padding: 5,
    marginLeft: 10,
  },

  view1: {
    height: 71,
    justifyContent: 'center',
    paddingHorizontal: 9,
  },

  view2: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },

  icon2: {
    fontSize: 24,
    padding: 5,
  },
  modal: {
    flex: 1,
  },
  imageView: {
    borderColor: '#6BC8FF',
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.45,
    height: SCREEN_WIDTH * 0.63,
    marginLeft: SCREEN_WIDTH * 0.035,
    marginBottom: SCREEN_WIDTH * 0.035,
  },

  image: {
    height: SCREEN_WIDTH * 0.4,
    width: SCREEN_WIDTH * 0.4,
    borderRadius: 10,
  },

  listHeader: {
    fontSize: 16,
    paddingBottom: 10,
    marginLeft: 12,
  },

  textView: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 52, 52,0.3)',
  },
});
export default SearchComponent;
