import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, KeyboardAvoidingView } from 'react-native';
import LoginForm from './LoginForm';

export default class Login extends Component {

	// sets a container to display logo, motto, and buttons
	render() {
		return (
			<KeyboardAvoidingView behavior="padding" style={styles.container}>
				<View style={styles.logoContainer}>
					<Image 
						style={styles.logo} 
						source={require('../../images/logo.png')} 
					/>

					<Text style={styles.title}>
						"We'll snip that snap real quick"
					</Text>

				</View>

				// loads the login form
				<View style={styles.formContainer}>
					<LoginForm />
				</View>
			</KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffff'
	},

	logoContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 50
	},

	logo: {
		width: 100,
		height: 100
	},

	title: {
		marginTop: 10,
		width: 160,
		textAlign: 'center',
	}
});