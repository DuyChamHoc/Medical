import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import {colors} from '../global/styles';
import Icon from 'react-native-vector-icons/Fontisto';
import HomeHeader from '../components/HomeHeader';
import ProductCard from '../components/ProductCard';
import CountDown from 'react-native-countdown-component';
import Swiper from 'react-native-swiper';
import {useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import firestore from '@react-native-firebase/firestore';
const SCREEN_WIDTH = Dimensions.get('window').width;
export default function HomeScreen({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const [getTotalData, setTotalData] = useState('');
  const ref = firestore().collection('Products');
  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        list.push(doc.data());
      });
      setTotalData(list);
    });
  }, []);
  return (
    <View style={styles.container}>
      <View>
        <HomeHeader navigation={navigation} title="MEDELI" />
      </View>
      <View style={{height: '30%'}}>
        <Swiper
          activeDot={
            <View
              style={{
                backgroundColor: colors.primary,
                width: 8,
                height: 8,
                borderRadius: 4,
                marginLeft: 3,
                marginRight: 3,
                marginBottom: 3,
              }}
            />
          }
          autoplay={true}
          style={{
            alignContent: 'center',
            marginLeft: 25,
            justifyContent: 'center',
            marginTop: 15,
            height: 168,
          }}>
          <View style={{height: 113, width: 348}}>
            <Image
              source={{uri: 'https://i.imgur.com/VCG7OE0.png'}}
              style={{height: '100%', width: '100%'}}
            />
          </View>
          <View style={{height: 113, width: 348}}>
            <Image
              source={{uri: 'https://i.imgur.com/mAyMAsm.png'}}
              style={{height: '100%', width: '100%'}}
            />
          </View>
          <View style={{height: 120, width: 348}}>
            <Image
              source={{uri: 'https://i.imgur.com/UX0GzXZ.png'}}
              style={{height: '100%', width: '100%'}}
            />
          </View>
        </Swiper>
      </View>
      <View style={styles.headerTextView}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.headerText}>{t('Sản phẩm thay đổi sau:')}</Text>
          <CountDown
            style={{marginTop: -5, marginLeft: 20}}
            until={3600}
            size={14}
            digitStyle={{backgroundColor: colors.primary}}
            digitTxtStyle={{color: colors.text1}}
            timeToShow={['M', 'S']}
            timeLabels={{m: 'Min', s: 'Sec'}}
            timeLabelStyle={{color: colors.text}}
          />
        </View>
      </View>
      <View>
        <FlatList
          style={{marginLeft: 5, marginBottom: 300}}
          showsVerticalScrollIndicator={false}
          horizontal={false}
          numColumns={2}
          data={getTotalData}
          keyExtractor={item => {
            return item.id;
          }}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <View>
              <ProductCard
                navigation={navigation}
                screenWidth={SCREEN_WIDTH * 0.4}
                item={item}
              />
            </View>
          )}
        />
      </View>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          navigation.navigate('Chat');
        }}>
        <Icon name="messenger" size={30} color="#03A9F4" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  fab: {
    // top: 730,
    top: SCREEN_WIDTH * 1.52,
    borderWidth: 1,
    borderColor: '#03A9F4',
    position: 'absolute',
    width: 56,
    height: 56,
    justifyContent: 'center',
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
    marginTop: -3,
  },
  deliveryButton: {
    paddingHorizontal: 20,
    borderRadius: 15,
    paddingVertical: 5,
  },
  deliveryText: {
    marginLeft: 5,
    fontSize: 16,
  },
  fillterView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  clockView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    backgroundColor: colors.cardbackground,
    borderRadius: 15,
    paddingHorizontal: 5,
    marginRight: 20,
  },
  addressView: {
    flexDirection: 'row',
    backgroundColor: colors.grey5,
    borderRadius: 15,
    paddingVertical: 3,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerText: {
    color: colors.grey1,
    fontSize: 22,
    fontWeight: 'bold',
    paddingLeft: 10,
    marginLeft: 10,
    marginTop: 20,
  },
  headerTextView: {
    marginLeft: 20,
    marginBottom: 8,
    paddingVertical: 3,
    marginTop: -20,
  },
  smallCard: {
    borderRadius: 20,
    backgroundColor: colors.grey5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    width: 150,
    margin: 10,
    height: 120,
  },
  smallCardSelected: {
    borderRadius: 20,
    backgroundColor: colors.buttons,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    width: 150,
    margin: 10,
    height: 120,
  },
  smallCardTextSected: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.cardbackground,
  },
  smallCardText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.grey2,
  },
  floatButton: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    backgroundColor: 'white',
    elevation: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
  },

  headerText: {
    color: colors.boldheader,
    fontSize: 20,
    fontWeight: '600',
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

  categoryTextView: {
    marginTop: 5,
  },
});
