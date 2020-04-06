import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, StatusBar, Alert, KeyboardAvoidingView,
			TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios'; 

export default class SignUpForm extends Component {

	// Creates attributes for SignUpForm object.
	constructor(props){
    	super(props);
    	this.state = {
    		first: '',
    		last: '',
    		email: '',
      		username: '',
      		password: '',
      		cpassword: ''
		}
	}

	// Clears this objects state & form fields.
	clear_inputs() {
		this.state = {
    		first: '',
    		last: '',
    		email: '',
      		username: '',
      		password: '',
      		cpassword: ''
		}
		this.firstInput.clear();
		this.lastInput.clear();
		this.emailInput.clear();
		this.userInput.clear();
		this.passwordInput.clear();
		this.cpasswordInput.clear();
	}

	// Submits Sign Up data via POST request.
	_handlePress() {
		axios.post('http://localhost:8090/api/createUser', {
				first_name: this.state.first, 
				last_name: this.state.last, 
				email: this.state.email, 
				username: this.state.username, 
				password: this.state.password 
		},)
		.then((response) => {
			console.log(response.data); 
			if(response.data.success == true) {
				alert("Account Created!")
			} else if(response.data.success == false) {
				alert("Signup Failed")
			}
		})
		.catch((error) => {
			console.log(error); 
		});
		this.clear_inputs();
	}

	// Validates the the format of the user's inputted information, checking
	// for empty fields, email formatting, and password consistency.
	validate() {
		let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

		// Checks if all input boxes are filled.
		if (this.state.first == '' || this.state.last == '' || this.state.email == '' || this.state.username == ''
			|| this.state.password == '' || this.state.cpassword == '') {
			alert("Please fill in any empty inputs!");
		}

		// Checks to see that the password is the same in both input boxes.
		else if (this.state.password != this.state.cpassword) {
			alert("Passwords do not match!");
		} else {
			// Checks to see that the email is in proper format.
			if (reg.test(this.state.email) == false) {
				alert("Invalid Email!");
			} else {
				this._handlePress();
			}
		}
	}

	// Sets up container for input boxes, where each input box has a setting
	// for user input and outlook.
	render() {
		return (
			<View style={ styles.container }>

				<StatusBar barStyle="dark-content"/>

				<Text style={styles.text}>Enter your first name:</Text>
				<TextInput
					placeholder="First Name"
					returnKeyType="next"
					onSubmitEditing={() => this.lastInput.focus()}
					keyboardType="email-address"
					autoCapitalize="none"
					autoCorrect={false}
					style={styles.input}
					ref={ (input) => this.firstInput = input }
					onChangeText = { (text) => this.setState({first: text}) } 
				/>

				<Text style={styles.text}>Enter your last name:</Text>
				<TextInput
					placeholder="Last Name"
					returnKeyType="next"
					onSubmitEditing={() => this.emailInput.focus()}
					keyboardType="email-address"
					autoCapitalize="none"
					autoCorrect={false}
					style={styles.input}
					ref={ (input) => this.lastInput = input }
					onChangeText = { (text) => this.setState({last: text}) } 
				/>

				<Text style={styles.text}>Enter your email address:</Text>
				<TextInput
					placeholder="Email Address"
					returnKeyType="next"
					onSubmitEditing={() => this.userInput.focus()}
					keyboardType="email-address"
					autoCapitalize="none"
					autoCorrect={false}
					style={styles.input}
					ref={ (input) => this.emailInput = input }
					onChangeText = { (text) => this.setState({email:text.toLowerCase()}) } 
				/>

				<Text style={styles.text}>Create a username:</Text>
				<TextInput
					placeholder="Username"
					returnKeyType="next"
					onSubmitEditing={() => this.passwordInput.focus()}
					keyboardType="email-address"
					autoCapitalize="none"
					autoCorrect={false}
					style={styles.input}
					ref={ (input) => this.userInput = input }
					onChangeText = { (text) => this.setState({username:text.toLowerCase()}) } 
				/>

				<Text style={styles.text}>Create a password:</Text>
				<TextInput
					placeholder="Password"
					secureTextEntry
					returnKeyType="next"
					onSubmitEditing={() => this.cpasswordInput.focus()}
					autoCapitalize="none"
					autoCorrect={false}
					style={styles.input}
					ref={ (input) => this.passwordInput = input}
					onChangeText = { (text) => this.setState({password:text}) }
				/>


				<Text style={styles.text}>Reenter your password:</Text>
				<TextInput
					placeholder="Confirm Password"
					secureTextEntry
					returnKeyType="send"
					autoCapitalize="none"
					autoCorrect={false}
					style={styles.input}
					ref={ (input) => this.cpasswordInput = input}
					// call validate when the user hits Submit on the iphone keyboard
					onSubmitEditing = { () => this.validate() }
					onChangeText = { (text) => this.setState({cpassword:text}) }
				/>

				<TouchableOpacity
					// call validate when the user hits Submit on the iphone keyboard
					onPress={ () => this.validate() }
					style={styles.buttonContainer}>
					<Text style={styles.buttonText}>Create Account</Text>
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
	},

	text: {
		fontWeight: 'bold'
	}
});