import { View, StyleSheet, Text } from 'react-native'
import React from 'react'
import { globalStyles } from '../../utils/Constants';
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native';

interface Props {
  title?: string
  back?: boolean
  logo?: React.ReactNode
}

const Topbar: React.FC<Props> = ({ logo, title, back }) => {

  const navigation = useNavigation();

  return (
    <View style={[styles.container]}>
      {back && <Icon name='chevron-left' size={26} onPress={navigation.goBack}/>}
      {logo}
      {title && <Text style={styles.title}>{title}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    height: 50,
  },
  title: { 
    fontWeight: 'bold', 
    fontSize: 18, 
    marginLeft: 8, 
  },
});

export default Topbar