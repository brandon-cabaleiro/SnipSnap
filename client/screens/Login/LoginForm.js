import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, StatusBar, Alert, KeyboardAvoidingView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios'; 

export default class LoginForm extends Component {

	// Creates attributes for LoginForm object
	constructor(props) {
    	super(props);
    	this.state = {
      		username: '',
      		password: '',
		}
	}

	// Submits login data via POST request.
	_handlePress() {
		axios.post('http://localhost:8090/api/userLogin', {
			username: this.state.username, 
			password: this.state.password
		})
		.then((response) => {
			console.log(response.data);
			if(response.data.success == true) {
				alert("Login Successful")
				this.props.navigation.navigate("Home")
			} else if(response.data.success == false) {
				alert("Login Failed")
			}
		})
		.catch((error) => {
			console.log(error); 
		});

		// Reset forms and state.
		this.userInput.clear();
		this.passwordInput.clear();
		this.state = {
      		username: '',
      		password: ''
		}
	}

	// Sets up container for input boxes.
	// Each input box has a setting for user input and outlook.
	render() {
		return (
			<View style={styles.container}>
				<StatusBar barStyle="dark-content"/>

				<TextInput 
					placeholder="Username"
					returnKeyType="next"
					// go to password input box
					onSubmitEditing={() => this.passwordInput.focus()}
					keyboardType="email-address"
					autoCapitalize="none"
					autoCorrect={false}
					style={styles.input}
					ref={ (input) => this.userInput = input }
					onChangeText = { (text) => this.setState({username:text}) } 
				/>

				<TextInput
					placeholder="Password"
					secureTextEntry
					returnKeyType="send"
					autoCapitalize="none"
					autoCorrect={false}
					style={styles.input}
					ref={ (input) => this.passwordInput = input}
					onChangeText = { (text) => this.setState({password:text}) }
					// Call _handlePress when the user hits Submit on the iphone keyboard
					onSubmitEditing = { () => this._handlePress() }
				/>

				<TouchableOpacity
					// Call _handlePress when the user hits LOGIN
					onPress={ () => this._handlePress() }
					style={styles.buttonContainer}>
					<Text style={styles.buttonText}>LOGIN</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

// Stylesheet to provide letter fonts and sizes
// as well as background colors and formats.
const styles = StyleSheet.create({
	container: {
		padding: 30
	},

	input: {
		height: 40,
		marginBottom: 10,
		color: '#000',
		paddingHorizontal: 10,
		backgroundColor: '#bdc3c7'
	},

	buttonContainer: {
		paddingVertical: 15,
		backgroundColor: '#bdc3c7',
		marginTop: 20
	},

	buttonText: {
		textAlign: 'center'
	}
});