import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, View, Image, Text, KeyboardAvoidingView } from 'react-native';
import SignUpForm from './SignUpForm';
import Isemail from 'isemail'
import UserAPI from "../../API/UserAPI"

import CustomStyle from '../../styles/styles'

class SignupPart3 extends Component {

	constructor(props) {

		// creates attributes for LoginForm object

			super(props);
			this.state = {
				password: '',
				confirm: '',
				attempted: false
		}
	}

	valid = () => {
		// TODO use isemail
		if (this.state.password.length < 7) {
			// this.setState({errorMessage: "Password must be at least 7 characters long"})
			return false
		}
		if (this.state.password != this.state.confirm) {
			// this.setState({errorMessage: "Passwords do not match"})
			return false
		}
		return true
	}

	goNext = () => {

		// Move to next view
		if (this.valid()){

		let signupDetails = {
			first_name: this.props.route.params.signupDetails.firstName,
			last_name: this.props.route.params.signupDetails.lastName,
			username: this.props.route.params.signupDetails.username,
			email: this.props.route.params.signupDetails.email,
			password: this.state.password
		}

		UserAPI.createUser(
			this.props.route.params.signupDetails.username,
			this.state.password,
			this.props.route.params.signupDetails.email,
			this.props.route.params.signupDetails.firstName,
			this.props.route.params.signupDetails.lastName
		)
			.then(res => {
				console.log(res)

				if (res.data.success) {
					localStorage.setItem(`token`, response.data.access_token)
					localStorage.setItem('id', response.data.user_id)
					// redirect to home page
					this.props.navigation.navigate("Success Loading", {
						action: 'validate_login'
					})
				}
				else {
					// problem logging in
					this.props.navigation.navigate("Welcome")
				}

			})
			.catch(err => {
				this.props.navigation.navigate("Welcome")
			})
		}

		this.setState({attempted: true})
	}

	render () {
		return (

			<View style={styles.container}>
				<View style={styles.logoContainer}>
					<Image
						style={styles.logo}
						source={require('../../images/logo2.svg')}
					/>

				</View>

				<View style={styles.formContainer}>
					<View style={CustomStyle.semiSpacious}>
						<TextInput
							placeholder="Password"
							returnKeyType="next"
							// go to password input box
							onSubmitEditing={() => this.confirmPasswordInput.focus()}
							autoCapitalize="none"
							secureTextEntry
							autoCorrect={false}
							style={CustomStyle.mainInputField}
							ref={ (input) => this.passwordInput = input }
							onChangeText = { (text) => this.setState({password:text}) }
						/>
					</View>

					<View style={CustomStyle.semiSpacious}>
						<TextInput
							placeholder="Confirm"
							returnKeyType="next"
							// go to password input box
							onSubmitEditing={() => this.goNext() }
							autoCapitalize="none"
							secureTextEntry
							autoCorrect={false}
							style={CustomStyle.mainInputField}
							ref={ (input) => this.confirmPasswordInput = input }
							onChangeText = { (text) => this.setState({confirm:text}) }
						/>
					</View>
				</View>

				<View style={CustomStyle.bottomButtonBox}>
					{this.state.attempted && !this.valid() && <Text style={CustomStyle.invalidText}>Problem with login</Text>}
					<TouchableOpacity
						// call _handlePress when the user hits LOGIN
						style={CustomStyle.mainButtonContainer}
						onPress={ () => this.goNext() }>
						<Text style={CustomStyle.mainButtonText}>Complete</Text>
					</TouchableOpacity>
				</View>

			</View>

		);
	}

}

class SignupPart2 extends Component {

	constructor(props) {

		// creates attributes for LoginForm object

    	super(props);
    	this.state = {
				email: '',
				confirm: '',
				attempted: false
		}
	}

	valid = () => {
		// TODO use isemail
		return Isemail.validate(this.state.email) == true && this.state.email == this.state.confirm
	}

	goNext = () => {

		// Move to next view
		if (this.valid())
			this.props.navigation.navigate("Sign Up Part 3", {
				signupDetails: {
					firstName: this.props.route.params.signupDetails.firstName,
					lastName: this.props.route.params.signupDetails.lastName,
					username: this.props.route.params.signupDetails.username,
					email: this.state.email
				}
			})


		this.setState({attempted: true})
	}

	render () {
		return (

			<View style={styles.container}>
				<View style={styles.logoContainer}>
					<Image
						style={styles.logo}
						source={require('../../images/logo2.svg')}
					/>

				</View>

				<View style={styles.formContainer}>
					<View style={CustomStyle.semiSpacious}>
						<TextInput
							placeholder="Email"
							returnKeyType="next"
							// go to password input box
							onSubmitEditing={() => this.emailConfirmInput.focus()}
							keyboardType="email-address"
							autoCapitalize="none"
							autoCorrect={false}
							style={CustomStyle.mainInputField}
							ref={ (input) => this.emailInput = input }
							onChangeText = { (text) => this.setState({email:text}) }
						/>
					</View>

					<View style={CustomStyle.semiSpacious}>
						<TextInput
							placeholder="Confirm"
							returnKeyType="next"
							// go to password input box
							onSubmitEditing={() => this.goNext()}
							keyboardType="email-address"
							autoCapitalize="none"
							autoCorrect={false}
							style={CustomStyle.mainInputField}
							ref={ (input) => this.emailConfirmInput = input }
							onChangeText = { (text) => this.setState({confirm:text}) }
						/>
					</View>
				</View>

				<View style={CustomStyle.bottomButtonBox}>
					{this.state.attempted && !this.valid() && <Text style={CustomStyle.invalidText}>Emails do not match</Text>}
					<TouchableOpacity
						// call _handlePress when the user hits LOGIN
						style={CustomStyle.mainButtonContainer}
						onPress={ () => this.goNext() }>
						<Text style={CustomStyle.mainButtonText}>Continue</Text>
					</TouchableOpacity>
				</View>

			</View>

		);
	}

}

class Signup extends Component {

	componentDidMount () {
    // check if user is logged in
    console.log(`In Sign Up`)
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

	constructor(props) {

		// creates attributes for LoginForm object

    	super(props);
    	this.state = {
      		firstName: '',
      		lastName: '',
					username: '',
					attempted: false
		}
	}

	valid = () => {
		return this.state.firstName.length >= 3 && this.state.lastName.length >= 3 && this.state.username.length >= 5
	}

	goNext = () => {

		// Move to next view
		if (this.valid())
			this.props.navigation.navigate("Sign Up Part 2", {
				signupDetails: {
					firstName: this.state.firstName,
					lastName: this.state.lastName,
					username: this.state.username
				}
			})


		this.setState({attempted: true})
	}

	render() {
		return (

			// sets up containers for logo and motto and login input boxes
			<View style={styles.container}>
				<View style={styles.logoContainer}>
					<Image
						style={styles.logo}
						source={require('../../images/logo2.svg')}
					/>

				</View>

				<View style={styles.formContainer}>
					<View style={CustomStyle.semiSpacious}>
						<TextInput
							placeholder="First Name"
							returnKeyType="next"
							// go to password input box
							onSubmitEditing={() => this.lastNameInput.focus()}
							autoCapitalize="none"
							autoCorrect={false}
							style={CustomStyle.mainInputField}
							ref={ (input) => this.firstNameInput = input }
							onChangeText = { (text) => this.setState({firstName:text}) }
						/>
					</View>

					<View style={CustomStyle.semiSpacious}>
						<TextInput
							placeholder="Last Name"
							returnKeyType="next"
							// go to password input box
							onSubmitEditing={() => this.usernameInput.focus()}
							autoCapitalize="none"
							autoCorrect={false}
							style={CustomStyle.mainInputField}
							ref={ (input) => this.lastNameInput = input }
							onChangeText = { (text) => this.setState({lastName:text}) }
						/>
					</View>

					<View style={CustomStyle.verySpacious}>
						<TextInput
							placeholder="Username"
							returnKeyType="next"
							// go to password input box
							onSubmitEditing={() => this.goNext()}
							autoCapitalize="none"
							autoCorrect={false}
							style={CustomStyle.mainInputField}
							ref={ (input) => this.usernameInput = input }
							onChangeText = { (text) => this.setState({username:text}) }
						/>
					</View>
				</View>

				<View style={CustomStyle.bottomButtonBox}>
					{this.state.attempted && !this.valid() && <Text style={CustomStyle.invalidText}>Invalid input</Text>}
					<TouchableOpacity
						// call _handlePress when the user hits LOGIN
						style={CustomStyle.mainButtonContainer}
						onPress={ () => this.goNext() }>
						<Text style={CustomStyle.mainButtonText}>Next</Text>
					</TouchableOpacity>
				</View>

			</View>
		);
	}
}

export { Signup, SignupPart2, SignupPart3 }


// stylesheet to provide letter fonts and sizes
// as well as background colors and formats
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffff',
		padding: 30
	},

	logoContainer: {
		alignItems: 'center',
		justifyContent: 'center'
	},

	logo: {
		width: 130,
		height: 130
	},

	title: {
		marginTop: 10,
		width: 160,
		textAlign: 'center',
	},

	formContainer: {
		padding: 30,
		flex: 4
	}
});
