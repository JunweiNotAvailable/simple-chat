import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { AppStateProvider } from './AppContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './src/screens/Splash/Splash';
import Main from './src/screens/Main/Main';
import Auth from './src/screens/Auth/Auth';
import { Amplify } from 'aws-amplify';
import { config } from './src/utils/Config';

const Stack = createNativeStackNavigator();

Amplify.configure({
  Auth: {
    mandatorySignId: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  }
})

export default function App() {
  return (
    <AppStateProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Splash' screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen name="Splash" component={Splash}/>
          <Stack.Screen name="Main" component={Main}/>
          <Stack.Screen name="Auth" component={Auth}/>
        </Stack.Navigator>
      </NavigationContainer>
    </AppStateProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
