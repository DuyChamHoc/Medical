import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/AntDesign';
import HomeAdmin from '../screen/HomeAdmins';
import ListOrder from '../screen/ListOrder';
import DrawerContent from '../components/DrawerContent';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/Entypo';
import Icon4 from 'react-native-vector-icons/MaterialIcons';
import Sales from '../screen/Sales';
import SignUpManager from '../screen/SignUpManager';
import DiscountAdmin from '../screen/DiscountAdmin';
import Category from '../screen/Category';
const Drawer = createDrawerNavigator();

export default function Drawernavigation() {
  return (
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="Home"
        component={HomeAdmin}
        options={{
          headerShown: false,
          title: 'Home',
          drawerIcon: ({color, size}) => (
            <Icon2 name="home" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="ListOrder"
        component={ListOrder}
        options={{
          headerShown: false,
          title: 'User Order',
          drawerIcon: ({color, size}) => (
            <Icon name="user" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Sales"
        component={Sales}
        options={{
          headerShown: false,
          title: 'Revenue',
          drawerIcon: ({color, size}) => (
            <Icon1 name="skype-business" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="discount"
        component={DiscountAdmin}
        options={{
          headerShown: false,
          title: 'Discount',
          drawerIcon: ({color, size}) => (
            <Icon3 name="price-tag" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="employeemanager"
        component={SignUpManager}
        options={{
          headerShown: false,
          title: 'Employee',
          drawerIcon: ({color, size}) => (
            <Icon name="addusergroup" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="category"
        component={Category}
        options={{
          headerShown: false,
          title: 'Category',
          drawerIcon: ({color, size}) => (
            <Icon4 name="category" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
