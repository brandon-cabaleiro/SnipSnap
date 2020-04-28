import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, Image, Text, KeyboardAvoidingView } from 'react-native';
import UserAPI from '../API/UserAPI'
import BarberAPI from '../API/BarberAPI'
import CustomStyle from '../styles/styles'

export default class OpenBarberShop extends Component {
  constructor(props) {
    super(props)

    this.state = {
      shop_name: ""
    }
  }

  componentDidMount () {
    // check if user is logged in
    console.log(`In Login`)
    UserAPI.loggedIn()
    .then(res => {
      console.log(`Login Check: ${res}`)
      // navigate to
    })
    .catch(err => {
      console.log(`${err}`)
      this.props.navigation.navigate("Welcome")
    })
  }

  makeShop () {
    console.log(`Creating shop with name: ${this.state.shop_name}`)

    if (this.valid()) {
      let user_id = localStorage.getItem(`id`)
      console.log(`user id: ${user_id}`)
      BarberAPI.makeShop(user_id, this.state.shop_name)
      .then(response => {
        console.log(response)
        if (response.data.success) {
          this.props.navigation.pop ()
        }
        else {
          console.log(`Response failed`)
        }
      })
      .catch(err => {
        console.log(`Problem creating barber shop`)
        console.log(err)
      })
    }
  }

  valid () {
    return this.state.shop_name.length > 5
  }

	render() {
		return (

			// sets up containers for logo and motto and login input boxes
			// <KeyboardAvoidingView behavior="padding" style={styles.container}>
			<View style={styles.container}>

        <View style={{flex: 1, marginTop: 100, width: '80%'}}>
          <TextInput
            placeholder="Shop Name"
            returnKeyType="next"
            // go to password input box
            onSubmitEditing={() => { this.makeShop() }}
            autoCapitalize="none"
            autoCorrect={false}
            style={CustomStyle.mainInputField}
            ref={ (input) => this.shopNameInput = input }
            onChangeText = { (text) => this.setState({shop_name:text}) }
          />
        </View>

        <View style={styles.bottomButtonBox}>
          <TouchableOpacity
            onPress={() => {
              this.makeShop()
            }}
            disabled={!this.valid()}
            style={this.valid() ? styles.bottomButton : styles.bottomInvalidButton}>
            <Text style={{color: '#ffffff', fontSize: 20, fontWeight: 'bold'}}>Create</Text>
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
		flex: 1,
		backgroundColor: '#ffff',
		alignItems: 'center',
		justifyContent: 'center',
	},
  logo: {
		width: 80,
		height: 80,
	},
  nameText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'rgba(0, 0, 0, 0.8)',
		alignItems: 'flex-start',
		justifyContent: 'left',
  },
  bottomButtonBox: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    left: 0,
    height: 80,
		alignItems: 'center',
		justifyContent: 'center',
  },
  bottomButton: {
    backgroundColor: "#ff8f57",
    paddingLeft: 80,
    paddingRight: 80,
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 3
  },
  bottomInvalidButton: {
    backgroundColor: "rgba(255, 143, 87, 0.6)",
    paddingLeft: 80,
    paddingRight: 80,
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 3
  }
});
