import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, StatusBar, Alert, KeyboardAvoidingView } from 'react-native';
import data from '../../credentials.json';
import axios from 'axios'; 

export default class LoginForm extends Component {

	constructor(props) {

		// creates attributes for LoginForm object

    	super(props);
    	this.state = {
      		username: '',
      		password: '',
		}
	}

	_handlePress() {

		axios.post('/api/userLogin/', {

			existing_user: {
				username: this.userInput, 
				password: this.passwordInput
			}

		},)
		.then((response) => {
		   
			console.log(response.data); 

		})
		.catch((error) => {
		   // Handle returned errors here
			console.log(error); 
		});



		// this function checks that the inputted username and password are correct

		// if (this.state.username == data.username && this.state.password == data.password) {
		// 	Alert.alert("Login Successful");
		// }
		// else {
		// 	Alert.alert("Login Failed");
		// }

		this.userInput.clear();
		this.passwordInput.clear();

		this.state = {
      		username: '',
      		password: ''
		}
	}

	render() {
		return (

			// sets up container for input boxes
			// each input box has a setting for user input and outlook
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
					// call _handlePress when the user hits Submit on the iphone keyboard
					onSubmitEditing = { () => this._handlePress() }
				/>

				<TouchableOpacity
					// call _handlePress when the user hits LOGIN
					onPress={ () => this._handlePress() }
					style={styles.buttonContainer}>
					<Text style={styles.buttonText}>LOGIN</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

// stylesheet to provide letter fonts and sizes
// as well as background colors and formats
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