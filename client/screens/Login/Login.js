import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, KeyboardAvoidingView } from 'react-native';
import LoginForm from './LoginForm';
import UserAPI from '../../API/UserAPI'

export default class Login extends Component {

	componentDidMount () {
    // check if user is logged in
    console.log(`In Login`)
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

	render() {
		console.log(this.props)
		return (

			// sets up containers for logo and motto and login input boxes
			// <KeyboardAvoidingView behavior="padding" style={styles.container}>
			<View style={styles.container}>
				<View style={styles.logoContainer}>
					<Image
						style={styles.logo}
						source={require('../../images/logo2.svg')}
					/>

				</View>

				<LoginForm navigation={this.props.navigation} />
			</View>
		);
	}
}

// Stylesheet to provide letter fonts and sizes
// as well as background colors and formats.
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffff'
	},

	logoContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 0
	},

	logo: {
		width: 130,
		height: 130
	},

	title: {
		marginTop: 10,
		width: 160,
		textAlign: 'center',
	}
});
