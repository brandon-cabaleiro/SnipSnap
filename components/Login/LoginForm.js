import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, StatusBar, Alert } from 'react-native';
import data from '../../credentials.json'

export default class LoginForm extends Component {

	constructor(props){
    	super(props);
    	this.state = {
      		username: '',
      		password: '',
		}
	}

	_handlePress() {
		if (this.state.username == data.username && this.state.password == data.password) {
			console.log("Login Successful");
			Alert.alert("Login Successful");
		}
		else {
			console.log("Login Failed");
			Alert.alert("Login Failed");
		}

		this.userInput.clear();
		this.passwordInput.clear();

		this.state = {
      		username: '',
      		password: '',
		}
	}

	render() {
		return (
			<View style={styles.container}>

				<StatusBar barStyle="dark-content"/>

				<TextInput 
					placeholder="Username"
					returnKeyType="next"
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
					onSubmitEditing = { () => this._handlePress() }
				/>

				<TouchableOpacity
					onPress={ () => this._handlePress() }
					style={styles.buttonContainer}>
					<Text style={styles.buttonText}>LOGIN</Text>
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
	}
});