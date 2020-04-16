import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text, KeyboardAvoidingView } from 'react-native';
import UserAPI from '../API/UserAPI'

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount () {
    // check if user is logged in
    console.log(`In Login`)
    UserAPI.loggedIn()
    .then(res => {
      console.log(`Login Check: ${res}`)
      // navigate to
    })
    .catch(err => {
      console.log(`${err}`)
      this.props.navigation.navigate("Welcome")
    })
  }

	render() {
		return (

			// sets up containers for logo and motto and login input boxes
			// <KeyboardAvoidingView behavior="padding" style={styles.container}>
			<View style={styles.container}>
        <View style={{marginTop: 20, marginBottom: 20}}>
          <Image
            style={styles.logo}
            source={require('../images/logo2.svg')}
          />
        </View>
        <View style={{flex: 1, width: '100%', paddingLeft: 40, paddingRight: 40}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.nameText}>FirstName </Text>
            <Text style={styles.nameText}>LastName</Text>
          </View>
          <Text>Customer</Text>
          <TouchableOpacity style={styles.logoutButton}><Text style={{color: 'white', fontSize: 15}}>Logout</Text></TouchableOpacity>

          <View>
            <Text>Schedules</Text>
          </View>

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
		alignItems: 'center',
		justifyContent: 'center',
	},
  logo: {
		width: 80,
		height: 80,
	},
  nameText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'rgba(0, 0, 0, 0.8)',
		alignItems: 'flex-start',
		justifyContent: 'left',
  },
  logoutButton: {
    backgroundColor: '#d64545',
    marginTop: 20,
    height: 40,
		alignItems: 'center',
		justifyContent: 'center',
    borderRadius: 3
  }
});
