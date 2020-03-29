import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, KeyboardAvoidingView } from 'react-native';
import SignUpForm from './SignUpForm';

export default class Signup extends Component {

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

				<View style={styles.formContainer}>
					<SignUpForm />
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