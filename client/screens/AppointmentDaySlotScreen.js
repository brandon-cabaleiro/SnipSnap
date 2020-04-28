import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Text, KeyboardAvoidingView } from 'react-native';
import UserAPI from '../API/UserAPI'

export default class AppointmentDaySlotScreen extends Component {
  constructor(props) {
    super(props)
    this.state ={
      available_today: null,
      selected: null
    }
  }

  getRealHour (k) {
    if (k == 0) return `12:00am`
    else if (k < 12) return `${k}:00am`
    else if (k == 12) return `12:00pm`
    else return `${k%12}:00pm`
  }

  showHoursAvailable () {
    let hours_dom = []
    if (this.state.available_today != null) {
      // move 1 hour from each pair
      let i = 0;
      while (i < this.state.available_today.length) {

        let start_time = new Date(this.state.available_today[i])
        let end_time = new Date(this.state.available_today[i+1])

        // from start_time to end_time, add options in increments of 1 hour
        let start_hour = start_time.getHours()
        let end_hour = end_time.getHours()

        if (start_hour < end_hour) {

          for (let k = start_hour; k < end_hour; ++k) {
            hours_dom.push(<TouchableOpacity
                onPress={() => {
                  this.setState({selected: k})
                }}
                style={this.state.selected == k ? styles.timeSelectionActive : styles.timeSelection}>
                <Text style={this.state.selected == k ? styles.selectedText : styles.plainText}>{this.getRealHour(k)} - {this.getRealHour(k+1)}</Text>
              </TouchableOpacity>)
          }

        }

        i += 2
      }
    }
    return (<View style={{width: '100%'}}>{hours_dom}</View>)
  }

  scheduleAppointment(){
    // scheduele the appointment with barber: this.props.route.params.barber_id
    // on day: this.props.route.params.date
    // at time: Hour = this.state.selected, Min = 0, Second = 0
    let barber_id = this.props.route.params.barber_id
    let user_id = this.props.route.params.user_id
    let schedule_date = this.props.route.params.date

    // set the time value
    schedule_date.setHours(this.state.selected, 0, 0)

    // now call the api

    console.log(`User ${user_id} makes appointment with barber ${barber_id} at time`)
    console.log(schedule_date)

    UserAPI.makeAppointment(user_id, barber_id, schedule_date)
    .then (response => {
      if (response.data.success) {
        console.log(`Appointment made !`)
        this.forceUpdate()
        this.props.navigation.navigate('Barber Explorer');
        // this.props.navigation.navigate("Transition Screen", {
        //   animation: 'check',
        //   message: 'Successfully Created Appointment',
        //   destination: 'Barber Explorer'
        // })
      }
      else {
        console.log(`Problem making appointment`)
        console.log(`${response.data.error}`)
      }
    })
    .catch (err => {
      console.log(`Error making appointment`)
    })
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

    // check the params
    let barber_id = this.props.route.params.barber_id
    let date = this.props.route.params.date

    console.log(`In Appointment Day Slot Screen`)
    console.log(`Barber ID: ${barber_id}`)
    console.log(`Date: `)
    console.log(date)

    // get the barber's availabilities and
    // the barber's already-schedueled times for this day
    UserAPI.getBarberAvailability(barber_id)
    .then(response => {
      if (response.data.success) {
        let day = date.getDay ()
        if (day < response.data.availability.length){
          this.setState({ available_today: response.data.availability[day] })
        }
      }
    })
  }

	render() {
		return (

			// sets up containers for logo and motto and login input boxes
			// <KeyboardAvoidingView behavior="padding" style={styles.container}>
			<View style={styles.container}>
        <View style={{flex: 1, width: '100%'}}>
          {this.showHoursAvailable()}
        </View>
        <View style={{marginBottom: 30}}>
          <TouchableOpacity
          style={this.state.selected == null ? styles.disabledButton : styles.bigButton}
          onPress={() => {
            console.log(`Schedueling the appointment !`)
            this.scheduleAppointment()
          }} disabled={this.state.selected == null}>
            <Text style={{ color: `#ffffff`, fontWeight: 'bold', fontSize: 17}}>Schedule</Text>
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
		width: 150,
		height: 150
	},
  plainText: {
    color: '#000000'
  },
  selectedText: {
    color: '#ffffff'
  },
  timeSelection: {
    width: '100%',
    height: 50,
		justifyContent: 'center',
		alignItems: 'left',
    paddingLeft: 50,
    paddingRight: 50,
    fontSize: 20
  },
  timeSelectionActive: {
    width: '100%',
    height: 50,
		justifyContent: 'center',
		alignItems: 'left',
    paddingLeft: 50,
    paddingRight: 50,
    fontSize: 20,
    backgroundColor: '#24253B'
  },
  bigButton: {
    backgroundColor: '#4fdb62',
    width: 200,
    height: 50,
		alignItems: 'center',
		justifyContent: 'center',
    borderRadius: 3
  },
  disabledButton: {
    backgroundColor: 'rgba(79, 219, 98, 0.4)',
    width: 200,
    height: 50,
		alignItems: 'center',
		justifyContent: 'center',
    borderRadius: 3
  }
});
