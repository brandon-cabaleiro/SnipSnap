import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as WebBrowser from 'expo-web-browser';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { MonoText } from '../components/StyledText';

export default class SnipSnap extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image 
            style={styles.logo} 
            source={require('../images/logo.png')} 
          />

          <Text style={styles.title}>
            "We'll snip that snap real quick"
          </Text>
        </View>

        <TouchableOpacity
          onPress={ () => this.props.navigation.navigate('Login') }
          style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={ () => this.props.navigation.navigate('Sign Up') }
          style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    padding: 30
  },

  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 125,
    marginBottom: 50
  },

  logo: {
    width: 100,
    height: 100
  },

  buttonContainer: {
    paddingVertical: 15,
    backgroundColor: '#bdc3c7',
    marginTop: 30
  },

  buttonText: {
    textAlign: 'center'
  }
});
