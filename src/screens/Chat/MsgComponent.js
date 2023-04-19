import moment from 'moment';
import React, {Component} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
// import TimeDelivery from './TimeDelivery';

const MsgComponent = props => {
  const {sender, item} = props;
  return (
    <Pressable style={{marginHorizontal: 5}}>
      <View
        style={[
          styles.TriangleShapeCSS,
          sender === 'user' ? styles.right : [styles.left],
        ]}
      />
      <View
        style={[
          styles.masBox,
          {
            alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
            borderWidth: 1,
            borderColor: sender === 'user' ? '#20abfd' : 'white',
            backgroundColor: sender === 'user' ? '#20abfd' : 'white',
            elevation: 5,
          },
        ]}>
        <Text
          style={{color: sender === 'user' ? 'white' : 'black', fontSize: 15}}>
          {item.message}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  masBox: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
    marginVertical: 5,
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
  },
  timeText: {
    fontFamily: 'AveriaSerifLibre-Light',
    fontSize: 10,
  },
  dayview: {
    alignSelf: 'center',
    height: 30,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginTop: 10,
  },
  iconView: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  TriangleShapeCSS: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 5,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  left: {
    borderBottomColor: 'white',
    left: 2,
    bottom: 10,
    transform: [{rotate: '10deg'}],
  },
  right: {
    borderBottomColor: '#20abfd',
    right: 0,
    bottom: 10,
    transform: [{rotate: '90deg'}],
  },
});

export default MsgComponent;
