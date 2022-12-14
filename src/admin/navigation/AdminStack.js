import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Drawernavigation from './Drawernavigation';
import DetailCustomer from '../screen/DetailCustomer';
import DetailDiscount from '../screen/DetailDiscount';
const App = createNativeStackNavigator();

export default function AdminStack() {
  return (
    <App.Navigator>
      <App.Screen
        name="App"
        component={Drawernavigation}
        options={{
          headerShown: false,
        }}
      />
      <App.Screen
        name="DetailCustomer"
        component={DetailCustomer}
        options={{
          headerShown: false,
        }}
      />
      <App.Screen
        name="DetailDiscount"
        component={DetailDiscount}
        options={{
          headerShown: false,
        }}
      />
    </App.Navigator>
  );
}
