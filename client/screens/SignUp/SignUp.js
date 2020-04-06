import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, KeyboardAvoidingView } from 'react-native';
import SignUpForm from './SignUpForm';

export default class Signup extends Component {
	
	// Sets up containers for logo and motto and sign up input boxes.
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
				<View>
					<SignUpForm navigation={this.props.navigation}/>
				</View>
			</KeyboardAvoidingView>
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