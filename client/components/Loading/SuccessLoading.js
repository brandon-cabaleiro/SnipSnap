import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, KeyboardAvoidingView } from 'react-native';
import UserAPI from '../../API/UserAPI'

export default class SuccessLoading extends Component {
  constructor(props) {
    super(props)

    this.state = {
      validate_login: () => {
        // check if the local storage has valid token
        let _token = localStorage.getItem('token')
        // validate it
        UserAPI.validate(_token)
        .then(res => {
          if (!res.data.success) this.props.navigation.naviage("Welcome")
          else {
            console.log ("Naviage to app main page!")
            console.log (res)

            setTimeout(() => {
              this.props.navigation.navigate("Main App")
            }, 3500)
          }
        })
        .catch(err => {
          console.log(this.props)
          this.props.navigation.navigate("Welcome")
        })
      }
    }

  }

  componentDidMount () {
    // this.props.route.params
    // check if the route params have an action value
    if (!('action' in this.props.route.params)) {
      console.log(`No Action Provided...`)
      return;
    }
    // check if the given action value maps to a valid action
    if (!(this.props.route.params.action in this.state)) {
      console.log(`Invalid action provided...`)
      return;
    }

    // call the function after 3 seconds
    setTimeout(() => {
      console.log("Calling transition...")
      this.state[this.props.route.params.action]()
    })
  }

	render() {
		return (

			// sets up containers for logo and motto and login input boxes
			// <KeyboardAvoidingView behavior="padding" style={styles.container}>
			<View style={styles.container}>
        <Image
          style={styles.logo}
          source={require('../../images/logo-loading.svg')}
        />
			</View>
		);
	}
}

// stylesheet to provide letter fonts and sizes
// as well as background colors and formats
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffff',
		alignItems: 'center',
		justifyContent: 'center',
	},
  logo: {
		width: 150,
		height: 150
	}
});
