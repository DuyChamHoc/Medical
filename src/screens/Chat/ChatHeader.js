import Icon from 'react-native-vector-icons/Ionicons';
import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {Avatar} from 'react-native-elements/dist/avatar/Avatar';

const ChatHeader = ({navigation}) => {
  // const { data } = props;

  const [lastSeen, setlastSeen] = useState('');
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#6BC8FF"
        translucent={false}
      />
      <Icon
        style={{
          marginLeft: 5,
          color: 'white',
          fontSize: 35,
        }}
        name="chevron-back"
        type="Ionicons"
        onPress={() => {
          navigation.goBack();
        }}
      />
      <Avatar source={require('../../assets/logo.png')} rounded size={45} />
      <View style={{marginLeft: 10}}>
        <Text
          style={{
            color: '#fff',
            fontSize: 20,
            fontWeight: 'bold',
          }}>
          Medeli
        </Text>

        <TouchableOpacity
          onPress={() => {
            dispatch({
              type: 'ADD_TO_CHAT',
              payload: {
                DataChat: {
                  id: 2,
                  roll: 'admin',
                  message: 'admin reply',
                  timestamp: Date.now(),
                  type: 'mess',
                },
              },
            });
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: 14,
            }}>
            Tư vấn khách hàng
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'android' ? 60 : 60,
    backgroundColor: '#6BC8FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingvertical: 10,
  },
});

//make this component available to the app
export default ChatHeader;
