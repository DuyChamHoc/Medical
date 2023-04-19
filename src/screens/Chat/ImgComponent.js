import {View, ImageBackground} from 'react-native';
import React from 'react';

export default function ImgComponent({sender, item}) {
  return (
    <View
      style={[
        {
          borderRadius: 10,
          margin: 10,
          alignItems: sender === 'user' ? 'flex-end' : 'flex-start',
        },
      ]}>
      <ImageBackground
        style={{width: 200, height: 150, borderRadius: 10}}
        source={{uri: item.message}}
      />
    </View>
  );
}
