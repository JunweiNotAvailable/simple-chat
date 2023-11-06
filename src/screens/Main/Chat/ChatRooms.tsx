import { SafeAreaView, StyleSheet, View, Text } from 'react-native'
import React from 'react'
import { useAppState } from '../../../../AppContext'
import { useChatState } from './ChatContext'
import { globalStyles } from '../../../utils/Constants'
import Topbar from '../../Utils/Topbar'
import Button from '../../Utils/Button'
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native'

const ChatRooms = () => {

  const navigation = useNavigation();
  const props = { ...useAppState(), ...useChatState() };

  return (
    <SafeAreaView style={[globalStyles.safeArea, styles.container]}>
      
      {/* topbar */}
      <Topbar/>

      {/* search bar */}
      <View style={styles.searchBarContainer}>
        <Button 
          style={styles.searchBar}
          icon={<View style={styles.searchBarContent}>
            <Icon name='search' size={16} color={'#646464'}/>
            <Text style={{ marginLeft: 8, color: '#646464' }}>搜尋</Text>
          </View>}
          onPress={() => navigation.navigate('Search' as never)}
        />
      </View>

      {/* chat rooms */}

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBarContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  searchBar: {
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 10,
  },
  searchBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export default ChatRooms