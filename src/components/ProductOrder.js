import React, { useState} from 'react';
import { View, Text,TouchableOpacity,Image} from 'react-native';
import Icon3 from 'react-native-vector-icons/EvilIcons'
import Icon4 from 'react-native-vector-icons/AntDesign'
import { useDispatch } from "react-redux";
import { useTheme } from 'react-native-paper';

export default function ProductOrder({ item }) {
    const { colors } = useTheme();
    const [num, setNum] = useState(1);
    const handlePlus = () => {
        setNum(num + 1);
    }
    const handleMinus = () => {
        if (num > 1) {
            setNum(num - 1);
        }
    }
    const dispatch = useDispatch();
    const selectItem = (item, checkboxValue, SL) =>
        dispatch({
            type: "UPDATE_TO_CART",
            payload: {
                ...item,
                checkboxValue: checkboxValue,
                SL: SL,
            },
        });
    return (
        <View style={{ alignSelf: 'center', width: 380 }}>
            <View style={{ backgroundColor: colors.boxes, height: 160, justifyContent: 'center', marginTop: 10 }}>
                <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                    <Image
                        style={{ width: 22, height: 22, }}
                        source={require('../global/image/store.png')} />
                    <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 16, marginLeft: 10 }}>{item.nhathuoc}</Text>
                    <Icon3
                        name='chevron-right'
                        size={30}
                        color={colors.text}
                        style={{ marginLeft: 10 }}
                    />
                </View>
                <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            style={{ width: 80, height: 80, resizeMode: "cover" }}
                            source={{ uri: item.image[0] }} />
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <View style={{ width: 240, height: 20 }}>
                            <Text style={{ color: colors.text, fontSize: 16 }}>{item.name}</Text>
                        </View>
                        <Text style={{ color: 'red', fontSize: 15, fontWeight: 'bold', marginTop: 10 }}>{item.gia}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    handleMinus()
                                    if (num > 1) {
                                        selectItem(item, false, num - 1)
                                    }
                                }}
                            >
                                <View style={{ borderWidth: 1, borderColor: 'grey' }}>
                                    <Icon4
                                        name='minus'
                                        size={20}
                                        color={colors.text}
                                    />
                                </View>
                            </TouchableOpacity>
                            <View style={{ borderWidth: 1, borderColor: 'grey', width: 40, alignItems: 'center' }}>
                                <Text style={{ color: colors.text }}>{num}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    handlePlus()
                                    selectItem(item, false, num + 1)
                                }}
                            >
                                <View style={{ borderWidth: 1, borderColor: 'grey' }}>
                                    <Icon4
                                        name='plus'
                                        size={20}
                                        color={colors.text}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}