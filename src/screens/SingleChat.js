import React, {Component, useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  SectionList,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import ChatHeader from './Chat/ChatHeader';
import {useDispatch, useSelector} from 'react-redux';
import MsgComponent from './Chat/MsgComponent';
import ImgComponent from './Chat/ImgComponent';
import ImagePicker from 'react-native-image-crop-picker';
export default function SingleChat({navigation}) {
  const [msg, setMsg] = React.useState('');
  const allChat = useSelector(state => state.cartReducer.dataChat);
  const dispatch = useDispatch();

  const selectChat = () => {
    if (msg == '') {
      return;
    }
    dispatch({
      type: 'ADD_TO_CHAT',
      payload: {
        DataChat: {
          id: Math.random(),
          roll: 'user',
          message: msg.trim(),
          timestamp: Date.now(),
          type: 'mess',
        },
      },
    });
    setMsg('');
  };
  const uploadimage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
      dispatch({
        type: 'ADD_TO_CHAT',
        payload: {
          DataChat: {
            id: Math.random(),
            roll: 'user',
            message: image.path,
            timestamp: Date.now(),
            type: 'image',
          },
        },
      });
    });
  };
  const listViewRef = useRef(null);
  const listViewHeight = useRef(0);
  return (
    <View style={styles.container}>
      <ChatHeader navigation={navigation} />
      <ImageBackground
        source={require('../assets/Background.jpg')}
        style={{flex: 1}}>
        <FlatList
          style={{flex: 1}}
          data={allChat}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index}
          ref={listViewRef}
          onLayout={e => {
            listViewHeight.current = e.nativeEvent.layout.height;
          }}
          onContentSizeChange={() => {
            listViewRef.current.scrollToEnd({animated: true});
          }}
          // inverted
          renderItem={({item}) => {
            return (
              <>
                {item.type == 'mess' ? (
                  <MsgComponent sender={item.roll} item={item} />
                ) : (
                  <ImgComponent sender={item.roll} item={item} />
                )}
              </>
            );
          }}
        />
      </ImageBackground>

      <View
        style={{
          backgroundColor: '#6BC8FF',
          elevation: 5,
          height: 60,
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 7,
          justifyContent: 'space-evenly',
        }}>
        <TextInput
          style={{
            width: '70%',
            height: 40,
            backgroundColor: 'white',
            borderRadius: 20,
            paddingHorizontal: 20,
            fontSize: 16,
          }}
          placeholder="Nhập tin nhắn......"
          placeholderTextColor={'black'}
          multiline={true}
          value={msg}
          onChangeText={val => setMsg(val)}
        />
        <TouchableOpacity
          onPress={() => {
            uploadimage();
          }}>
          <Icon1
            name="images"
            style={{
              fontSize: 30,
              color: 'white',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            selectChat();
          }}>
          <Icon
            style={{
              fontSize: 30,
              color: 'white',
            }}
            name="md-send"
            type="Ionicons"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
