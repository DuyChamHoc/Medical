import React, {useState, useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import RootClientTabs from './ClientTabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import 'react-native-gesture-handler';
import DrawerContent from '../components/DrawerContent';
import {colors} from '../global/styles';
import Help from '../screens/Help';
import DiscountScreen from '../screens/Discount';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';
const Drawer = createDrawerNavigator();
const getCurrentImage = () => {
  ImagePicker.openPicker({
    width: 300,
    height: 400,
    cropping: true,
  }).then(image => {
    console.log(image);
  });
};

export default function DrawerNavigator() {
  const {t} = useTranslation();
  return (
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="RootClientTabs"
        component={RootClientTabs}
        options={{
          headerShown: false,
          title: t('Màn hình chính'),
          drawerIcon: ({focussed, size}) => (
            <Icon
              name="home"
              color={focussed ? '#7cc' : colors.grey2}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Promotions"
        component={DiscountScreen}
        options={{
          headerShown: false,
          title: t('Mã giảm giá'),
          drawerIcon: ({color, size}) => (
            <Icon2 name="tag-heart" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Trợ giúp"
        component={Help}
        options={{
          headerShown: false,
          title: t('Trợ giúp'),
          drawerIcon: ({color, size}) => (
            <Icon2
              name="lifebuoy"
              color={color}
              size={size}
              onPress={() => {
                getCurrentImage();
              }}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
