import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text, KeyboardAvoidingView } from 'react-native';
import UserAPI from '../API/UserAPI'
import BarberAPI from '../API/BarberAPI'

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user_data: null,
      barber_data: null,
      saved_barbers: null
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

    // load user user_data
    let user_id = localStorage.getItem(`id`)
    UserAPI.getUser(user_id)
    .then(response => {
      console.log(`User lookup`)
      console.log(response)
      if (response.data.success) {
        this.setState({user_data: response.data})

        // set the user's saved
        let barbers_ = response.data.saved.map(saved_barber => {
          return BarberAPI.getBarber(saved_barber)
        })

        Promise.all(barbers_).then(barber_info => {
          let actual_info = barber_info.map(info_ => {
            return info_.data
          })
          this.setState({saved_barbers: actual_info})
        })
      }
    })

    // load barber data
    BarberAPI.getBarberFromUser(user_id)
    .then(response => {
      console.log(`Barber lookup`)
      console.log(response)
      if (response.data.success) {
        this.setState({barber_data: response.data})
      }
    })
  }

	render() {
		return (

			// sets up containers for logo and motto and login input boxes
			// <KeyboardAvoidingView behavior="padding" style={styles.container}>
			<View style={styles.container}>
        <View style={{marginTop: 20, marginBottom: 20}}>
          <Image
            style={styles.logo}
            source={require('../images/logo2.svg')}
          />
        </View>
        <View style={{flex: 1, width: '100%', paddingLeft: 40, paddingRight: 40}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.nameText}>{this.state.user_data != null && this.state.user_data.first_name} </Text>
            <Text style={styles.nameText}>{this.state.user_data != null && this.state.user_data.last_name}</Text>
          </View>
          <Text>{this.state.barber_data == null ? 'Customer' : `Barber (${this.state.barber_data.shop_name})`}</Text>
          <TouchableOpacity
            onPress={() => {
              // clear the local storage
              localStorage.removeItem(`id`)
              localStorage.removeItem(`token`)
              // return to the welcome page
              this.props.navigation.navigate("Welcome")
            }}
            style={styles.logoutButton}><Text style={{color: 'white', fontSize: 15}}>Logout</Text></TouchableOpacity>

          <View style={styles.profileScheduleArea}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("Explore")
            }}
            style={styles.funButton}>
            <Text style={{
              color: '#ffffff',
              fontSize: 15,
              fontWeight: 'bold'
            }}>Schedule An Appointment</Text>
          </TouchableOpacity>
            <View style={{width: '100%', paddingRight: 80, paddingLeft: 80}}>
              {(this.state.user_data == null || this.state.user_data.saved.length == 0) && <Text style={{fontWeight: `italic`, color: `rgba(0, 0, 0, 0.7)`}}>You have 0 saved barbers</Text>}
              {this.state.saved_barbers != null && <Text style={{fontWeight: 'bold', fontSize: 20}}>Saved Barbers</Text>}
              {this.state.saved_barbers != null && this.state.saved_barbers.map((barber_info, index) => {

                console.log(`Barber INFo`)
                console.log(barber_info)
                return (<View
                  style={{
                    paddingTop: 10,
                    paddingBottom: 10,
                    borderWidth: 2,
                    marginTop: 10,
                    paddingLeft: 10,
                    paddingRight: 10,
                    borderRadius: 3,
                    borderColor: '#24253B'
                  }}
                  key={index}>
                          <Text style={{fontWeight: 'bold'}}>{barber_info.shop_name}</Text>
                          <TouchableOpacity 
                            onPress={() => {
                              console.log(barber_info)
                              this.props.navigation.navigate("Explore")
                              // this.props.navigation.navigate("Explore", {
                              //   visiting_barber_id: barber_info.barber_id
                              // })
                            }}
                            style={styles.goToButton}><Text style={styles.goToText}>Go To</Text></TouchableOpacity>
                        </View>)
              })}
            </View>
          </View>

          <View style={styles.becomeBarberView}>
            <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("Open Shop")
            }}
            disabled={this.state.barber_data != null}
            style={this.state.barber_data == null ? styles.becomeBarberButton : styles.alreadyBarberButton}>
              <Text style={{
                color: '#ffffff',
                fontSize: 20,
                fontWeight: 'bold'
              }}>{this.state.barber_data == null ? 'Open A Barber Shop' : `Shop Name: ${this.state.barber_data.shop_name}`}</Text>
            </TouchableOpacity>
          </View>

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
  logoutButton: {
    backgroundColor: '#d64545',
    marginTop: 20,
    height: 40,
		alignItems: 'center',
		justifyContent: 'center',
    borderRadius: 3
  },
  profileScheduleArea: {
    fles: 1,
    marginTop: 70,
		alignItems: 'center',
		justifyContent: 'center',
  },
  funButton: {
    backgroundColor: '#ff8f57',
    marginBottom: 15,
    borderRadius: 3,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10
  },
  becomeBarberView: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    left: 0,
    height: 80,
		alignItems: 'center',
		justifyContent: 'center',
  },
  alreadyBarberButton: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingLeft: 80,
    paddingRight: 80,
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 3
  },
  becomeBarberButton: {
    backgroundColor: "#ff8f57",
    paddingLeft: 80,
    paddingRight: 80,
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 3
  },
  goToButton: {
    backgroundColor: '#42f55a',
    height: 30,
    marginLeft: 10, 
    marginRight: 10,
		alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginTop: 5
  },
  goToText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 13
  }
});
