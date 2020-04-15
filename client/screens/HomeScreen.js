import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as WebBrowser from 'expo-web-browser';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MonoText } from '../components/StyledText';
import UserAPI from '../API/UserAPI'
import CustomStyles from '../styles/styles'

export default class SnipSnap extends React.Component {

  componentDidMount () {
    // check if user is logged in
    console.log(`In Home Screen`)
    UserAPI.loggedIn()
    .then(res => {
      console.log(`Login Check: ${res}`)
      // navigate to
      this.props.navigation.navigate("Main App")
    })
    .catch(err => {
      console.log(`${err}`)
    })
  }

  // sets a container to display logo, motto, and buttons
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../images/logo2.svg')}
          />
        </View>

        <View style={CustomStyles.mainButtonBox}>
          <TouchableOpacity
            onPress={ () => this.props.navigation.navigate('Login') } // when Login is pressed go to the login page
            style={CustomStyles.mainButtonContainer}>
            <Text style={CustomStyles.mainButtonText}>Login</Text>
          </TouchableOpacity>
        </View>

        <View style={CustomStyles.mainButtonBox}>
          <TouchableOpacity
            onPress={ () => this.props.navigation.navigate('Sign Up') } // when Sign Up is pressed go to the sign up page
            style={CustomStyles.mainButtonContainer}>
            <Text style={CustomStyles.mainButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

// stylesheet to provide letter fonts and sizes
// as well as background colors and formats
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    padding: 30,
    header: null
  },

  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 125,
    marginBottom: 50
  },

  logo: {
    width: 130,
    height: 130
  },
});
