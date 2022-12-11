import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function ViewSales({data}) {
  const [isValue, setValue] = useState(0);
  var s = 0;
  useEffect(() => {
    s = data.map(doc => {
      s = s + doc.total;
      setValue(s);
    });
  }, [data]);
  return (
    <View
      style={{
        height: 50,
        backgroundColor: '#36a0ef',
        borderTopColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text
        style={{
          color: 'white',
          fontWeight: 'bold',
          fontSize: 20,
        }}>
        Total revenue: {isValue}.000đ
      </Text>
    </View>
  );
}
