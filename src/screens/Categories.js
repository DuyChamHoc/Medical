import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {colors} from '../global/styles';
import ProductCard from '../components/ProductCard';
import HomeHeader from '../components/HomeHeader';
import SearchComponent from '../components/SearchComponent';
import {useTranslation} from 'react-i18next';
import firestore from '@react-native-firebase/firestore';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Categories({navigation}) {
  const {t} = useTranslation();
  const [getCate, setCate] = useState([]);
  const refdata = firestore().collection('Products');
  const refcate = firestore().collection('categories');
  const [selected, setSelected] = useState();
  const [data, setData] = useState([]);
  useEffect(() => {
    return refcate.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        list.push(doc.data());
      });
      setCate(list);
      setSelected(list[0].name);
    });
  }, []);
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

  const handleSelected = value => {
    setSelected(value);
    return refdata.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        if (doc.data().category == value) list.push(doc.data());
      });
      setData(list);
    });
  };

  return (
    <View style={styles.container}>
      <View>
        <HomeHeader navigation={navigation} title={t('Tìm kiếm')} />
        <SearchComponent navigation={navigation} />
      </View>

      <View style={{marginTop: 70, marginLeft: 10, marginBottom: 10}}>
        <View>
          <FlatList
            showsVerticalScrollIndicator={false}
            horizontal={true}
            data={getCate}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => (
              <View key={item.id}>
                <CategoriesCard
                  image={item.image}
                  title={item.name}
                  onPress={handleSelected}
                  value={selected}
                />
              </View>
            )}
          />
        </View>
      </View>

      <View>
        <FlatList
          style={{marginLeft: 5, marginBottom: 10}}
          showsVerticalScrollIndicator={false}
          horizontal={false}
          numColumns={2}
          data={data}
          extraData={data}
          contentContainerStyle={{paddingBottom: 280}}
          keyExtractor={item => {
            return item.id;
          }}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <ProductCard
              navigation={navigation}
              screenWidth={SCREEN_WIDTH * 0.4}
              item={item}
            />
          )}
        />
      </View>
    </View>
  );
}

function CategoriesCard({image, title, onPress, value}) {
  return (
    <TouchableOpacity onPress={() => onPress(title)}>
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
    height: SCREEN_WIDTH * 0.4475,
    width: SCREEN_WIDTH * 0.4475,
    borderRadius: 10,
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
});
