import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { createAppContainer } from 'react-navigation'
import SvgIcon from '@material-ui/core/SvgIcon';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './src/config.json';

import BottomTabNavigator from './navigation/BottomTabNavigator';
import useLinking from './navigation/useLinking';

import FilterBarberScreen from './screens/FilterBarberScreen'
import SortBarberScreen from './screens/SortBarberScreen'
import ExploreBarberScreen from './screens/ExploreBarberScreen'
import ProfileScreen from './screens/ProfileScreen'
import Welcome from './screens/HomeScreen';
import Login from './components/Login/Login';
import {Signup, SignupPart2, SignupPart3} from './components/SignUp/SignUp';
import SuccessLoading from './components/Loading/SuccessLoading'
import ScheduleIcon from './images/calendar.svg'
import Icon from 'react-native-vector-icons/FontAwesome';

// const Icon = createIconSetFromFontello(fontelloConfig);
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Tab_ = createMaterialBottomTabNavigator()

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

class BarberExplorer extends Component {
  constructor (props) {
    super (props)
  }

  render () {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Barber Explorer" component={ExploreBarberScreen} options={{headerShown: false}} />
        <Stack.Screen name="Filter Barbers" component={FilterBarberScreen} />
        <Stack.Screen name="Sort Barbers" component={SortBarberScreen} />
      </Stack.Navigator>
    )
  }
}

class MainAppScreen extends Component {
  constructor (props) {
    super (props)
  }

  render () {
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          taBarIcon: ({ focused, color, size }) => {
          return <Icon name="rocket" size={80} color="#000000" />;

            let icon_name;
            if (route.name == 'Schedule') icon_name = 'calendar';
            else if (route.name == 'Explore') icon_name = 'logo';
            else if (route.name == 'Profile') icon_name = 'comb';

            if (false) return <Icon name="" size={size} color={color} />
          }
        })}
        tabBarOptions={{
          activeTintColor: 'red',
          inactiveTintColor: 'green'
        }}
      >
        <Tab.Screen name="Schedule" component={ProfileScreen} />
        <Tab.Screen name="Explore" component={BarberExplorer} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    )
  }
}

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  // load the stack navigator for navigating through the screens
  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
          <Stack.Navigator screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
          }}>
            <Stack.Screen name="Welcome" component={Welcome} options={{headerShown: false}} />
            <Stack.Screen name="Login" component={Login} options={{title: '', headerStyle: {
              elevation: 0, shadowOpacity: 0, borderBottomWidth: 0
            }}} />


            <Stack.Screen name="Sign Up" component={Signup} options={{title: '', headerStyle: {
              elevation: 0, shadowOpacity: 0, borderBottomWidth: 0
            }}} />

            <Stack.Screen name="Sign Up Part 2" component={SignupPart2} options={{title: '', headerStyle: {
              elevation: 0, shadowOpacity: 0, borderBottomWidth: 0
            }}} />

            <Stack.Screen name="Sign Up Part 3" component={SignupPart3} options={{title: '', headerStyle: {
              elevation: 0, shadowOpacity: 0, borderBottomWidth: 0
            }}} />

            <Stack.Screen name="Success Loading" component={SuccessLoading} options={{headerShown: false}} />

            <Stack.Screen name="Main App" component={MainAppScreen} options={{headerShown: false}} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});

// <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
//   <Stack.Navigator screenOptions={{
//     cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
//   }}>
//     <Stack.Screen name="Welcome" component={Welcome} options={{headerShown: false}} />
//     <Stack.Screen name="Login" component={Login} options={{title: '', headerStyle: {
//       elevation: 0, shadowOpacity: 0, borderBottomWidth: 0
//     }}} />
//
//
//     <Stack.Screen name="Sign Up" component={Signup} options={{title: '', headerStyle: {
//       elevation: 0, shadowOpacity: 0, borderBottomWidth: 0
//     }}} />
//
//     <Stack.Screen name="Sign Up Part 2" component={SignupPart2} options={{title: '', headerStyle: {
//       elevation: 0, shadowOpacity: 0, borderBottomWidth: 0
//     }}} />
//
//     <Stack.Screen name="Sign Up Part 3" component={SignupPart3} options={{title: '', headerStyle: {
//       elevation: 0, shadowOpacity: 0, borderBottomWidth: 0
//     }}} />
//
//     <Stack.Screen name="Success Loading" component={SuccessLoading} options={{headerShown: false}} />
//   </Stack.Navigator>
//   <Tab.Navigator>
//     <Tab.Screen name="Explore" component={ExploreBarberScreen} />
//     <Tab.Screen name="Profile" component={ProfileScreen} />
//   </Tab.Navigator>
// </NavigationContainer>
