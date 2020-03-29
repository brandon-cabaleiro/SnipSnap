import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, StatusBar, Alert, KeyboardAvoidingView,
			TouchableWithoutFeedback, Keyboard } from 'react-native';
import data from '../../credentials.json';

export default class SignUpForm extends Component {

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

	_handlePress() {

		// console.log(this.state.first);
		// console.log(this.state.last);
		// console.log(this.state.email);
		// console.log(this.state.username);
		// console.log(this.state.password);
		// console.log(this.state.cpassword);

		// JUST FOR TESTING PURPOSES
		// Once you "created a new user", go ahead and test it by logging in.
		// To get back test as username and test as password,
		//	simply open, save, and close credentials.json.
		// ***********************************
		data.username = this.state.username;
		data.password = this.state.password;
		// ***********************************

		this.firstInput.clear();
		this.lastInput.clear();
		this.emailInput.clear();
		this.userInput.clear();
		this.passwordInput.clear();
		this.cpasswordInput.clear();

		this.state = {
    		first: '',
    		last: '',
    		email: '',
      		username: '',
      		password: '',
      		cpassword: ''
		}

		Alert.alert("Account Created!");

		this.clear_inputs();
	}

	validate() {

		let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

		// checks if all input boxes are filled
		if (this.state.first == '' || this.state.last == '' || this.state.email == '' || this.state.username == ''
			|| this.state.password == '' || this.state.cpassword == '') {
			Alert.alert("Please fill in any empty inputs!");
		}

		// checks to see that the password is the same in both input boxes
		else if (this.state.password != this.state.cpassword) {
			Alert.alert("Passwords do not match!");
		}
		else {
			// checks to see that the email is in proper format
			if (reg.test(this.state.email) == false) {
				Alert.alert("Invalid Email!");
			}
			else {
				this._handlePress();
			}
		}
	}

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
					onSubmitEditing = { () => this.validate() }
					onChangeText = { (text) => this.setState({cpassword:text}) }
				/>

				<TouchableOpacity
					onPress={ () => this.validate() }
					style={styles.buttonContainer}>
					<Text style={styles.buttonText}>Create Account</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

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