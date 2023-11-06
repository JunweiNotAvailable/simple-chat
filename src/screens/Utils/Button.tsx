import { View, ViewStyle, TextStyle, Text, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { globalStyles } from '../../utils/Constants'

interface ButtonProps {
  key_?: string
  onPress: () => void
  icon?: React.ReactNode
  text?: string
  style?: ViewStyle
  textStyle?: TextStyle
}

const Button: React.FC<ButtonProps> = ( props ) => {
  return (
    <TouchableWithoutFeedback onPress={props.onPress} key={props.key_ || ''}>
      <View style={[props.style]}>
        {props.icon ? props.icon : <></>}
        {props.text && <Text style={props.textStyle}>{props.text}</Text>}
      </View>
    </TouchableWithoutFeedback>
  )
}

export default Button