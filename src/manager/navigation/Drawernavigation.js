import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import ListOrder from '../screen/ListOrder';
import DrawerContent from '../components/DrawerContent';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeManager from '../screen/HomeManager';
const Drawer = createDrawerNavigator();

export default function Drawernavigation() {
  return (
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="Home"
        component={HomeManager}
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
          title: 'User order',
          drawerIcon: ({color, size}) => (
            <Icon name="user" color={color} size={size} />
          ),
        }}
      />
      {/* <Drawer.Screen
        name="Sales"
        component={Sales}
        options={{
          headerShown: false,
          title: 'Revenue',
          drawerIcon: ({color, size}) => (
            <Icon1 name="skype-business" color={color} size={size} />
          ),
        }}
      /> */}
      {/* <Drawer.Screen
        name="employeemanager"
        component={SignUpManager}
        options={{
          headerShown: false,
          title: 'Employee Manager',
          drawerIcon: ({color, size}) => (
            <Icon name="user" color={color} size={size} />
          ),
        }}
      /> */}
    </Drawer.Navigator>
  );
}
