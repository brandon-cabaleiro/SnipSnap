import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, StatusBar, Alert, KeyboardAvoidingView } from 'react-native';
import data from '../../credentials.json';
import UserAPI from "../../API/UserAPI"
import CustomStyle from '../../styles/styles'

export default class LoginForm extends Component {

	constructor(props) {

		// creates attributes for LoginForm object

    	super(props);
    	this.state = {
      		username: '',
      		password: '',
					attempted: false
		}
	}

	_handlePress() {

		UserAPI.login(this.state.username, this.state.password)
		.then(response => {
			console.log("Response")
			if (response.data.success) {
				// setup login token and log user in
				localStorage.setItem(`token`, response.data.access_token)
				localStorage.setItem('id', response.data.user_id)
				// redirect to home page
				this.props.navigation.navigate("Success Loading", {
					action: "validate_login"
				})
			}
		})
		.catch(error => {
			console.log(`Error: ${error}`)
		})
		// this function checks that the inputted username and password are correct
		this.setState({attempted: true})
	}

	render() {
		return (

			// sets up container for input boxes
			// each input box has a setting for user input and outlook
			<View style={styles.container}>

				<StatusBar barStyle="dark-content"/>

				<KeyboardAvoidingView behavior="padding" style={styles.inputContainer}>
					<View style={CustomStyle.spacious}>
						<TextInput
							placeholder="Username"
							returnKeyType="next"
							// go to password input box
							onSubmitEditing={() => this.passwordInput.focus()}
							keyboardType="email-address"
							autoCapitalize="none"
							autoCorrect={false}
							style={CustomStyle.mainInputField}
							ref={ (input) => this.userInput = input }
							onChangeText = { (text) => this.setState({username:text}) }
						/>
					</View>

					<View style={CustomStyle.spacious}>
						<TextInput
							placeholder="Password"
							secureTextEntry
							returnKeyType="send"
							autoCapitalize="none"
							autoCorrect={false}
							style={CustomStyle.mainInputField}
							ref={ (input) => this.passwordInput = input}
							onChangeText = { (text) => this.setState({password:text}) }
							// call _handlePress when the user hits Submit on the iphone keyboard
							onSubmitEditing = { () => this._handlePress() }
						/>
					</View>
				</KeyboardAvoidingView>

				<View style={CustomStyle.bottomButtonBox}>
					{this.state.attempted &&<Text style={CustomStyle.invalidText}>Problem logging in</Text>}
					<TouchableOpacity
						// call _handlePress when the user hits LOGIN
						style={CustomStyle.mainButtonContainer}
						onPress={ () => this._handlePress() }>
						<Text style={CustomStyle.mainButtonText}>Login</Text>
					</TouchableOpacity>
				</View>

			</View>
		);
	}
}

// stylesheet to provide letter fonts and sizes
// as well as background colors and formats
const styles = StyleSheet.create({
	container: {
		padding: 60,
		flex: 1
	},

	inputContainer: {
		flex: 4
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
