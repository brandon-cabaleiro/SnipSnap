import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View, Image, Text, KeyboardAvoidingView } from 'react-native';
import UserAPI from '../API/UserAPI'

export default class SchedueleAppointment extends Component {
  constructor(props) {
    super(props)

    this.state = {
      availability: null
    }
  }

  getCalendarDayStyle (active) {
    // given today's day of the week, return a style that aligns the
    // other blocks of the days of the week appropriately
    return {
      width: 50,
      height: 60,
      backgroundColor: active ? '#24253B' : 'rgba(0, 0, 0, 0.5)',
      marginTop: 20,
      marginRight: 10,
      marginLeft: 10,
      borderRadius: 3,
  		alignItems: 'center',
  		justifyContent: 'center'
    }
  }

  getDaysAhead (i, j) {
    // given today's date, and the row & col, determine how many days
    // ahead of today this cell is

    // Step 1: Determine today's cell
    let today_ = new Date()

    let days_ahead = 0
    for (let start_row = 0; start_row < 3; ++start_row) {
      for (let start_col = start_row == 0 ? today_.getDay() : 0; start_col < 7; ++start_col) {
        ++ days_ahead;

        if (start_row == i && start_col == j) {
          console.log(`Days Ahead: ${days_ahead}`)
          return days_ahead - 1;
        }
      }
    }

    console.log(`Days Ahead: ${days_ahead}`)
    return days_ahead - 1
  }

  drawCalendar () {
    let calendar_rows = []

    // push the weekday labels
    let labels = ["S", "M", "Tu", "W", "Th", "F", "Sat"]
    let weekday_labels = []
    for (let i = 0; i < 7; ++i) {
      weekday_labels.push(<View style={styles.weekdayLabels}><Text style={{color: '#ffffff'}}>{labels[i]}</Text></View>)
    }
    calendar_rows.push(<View style={{flexDirection: 'row'}}>{weekday_labels}</View>)


    let finding_start = true;
    let todays_date = new Date();
    let next_date = new Date();
    let days_ahead = 0
    for (let i = 0; i < 3; ++i) {
      // create 7 blocks
      let calendar_cols = []
      for (let j = 0; j < 7; ++j) {

        if (finding_start && days_ahead == 0 && j == todays_date.getDay()) {
          finding_start = false
        }

        next_date.setDate(todays_date.getDate() + days_ahead)
        if (!finding_start) {
          days_ahead += 1
        }

        // only allow schedueling 14 days in advance
        if (days_ahead > 14) {
          finding_start = true;
        }

        calendar_cols.push(<TouchableOpacity key={(7 * i) + j}
          onPress={() => {
            // open modal that shows time slots of the barber's availability on this day

            // information needed:
            // - barber id
            // - date of the appointment
            let date_ = new Date()
            date_.setDate(todays_date.getDate()+this.getDaysAhead(i, j))
            this.props.navigation.navigate("Select Appointment Day Slot", {
              barber_id: this.props.route.params.barber_id,
              date: date_,
              user_id: this.props.route.params.user_id
            })
          }}
          style={this.getCalendarDayStyle(!finding_start)}
          disabled={finding_start}>
           {!finding_start && <Text style={{color: '#ffffff', fontSize: 17}}>{next_date.getDate()}</Text>}
          </TouchableOpacity>)
      }
      calendar_rows.push(<View style={{flexDirection: 'row'}}>{calendar_cols}</View>)
    }

    return calendar_rows
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

    // load the barber's availability
    let barber_id = this.props.route.params.barber_id

    UserAPI.getBarberAvailability(barber_id)
    .then(response => {
      console.log(response)
      if (response.data.success) {
        this.setState({availability: response.data.availability})
      }
    })
    .catch(err => {
      console.log(err)
    })
  }

	render() {
		return (

			// sets up containers for logo and motto and login input boxes
			// <KeyboardAvoidingView behavior="padding" style={styles.container}>
			<View style={styles.container}>

      <View style={{flex: 1, marginTop: 50}}>
      { this.drawCalendar() }
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
  weekdayLabels: {
    width: 50,
    height: 40,
    backgroundColor: '#8B8DBC',
    marginTop: 20,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 3,
		alignItems: 'center',
		justifyContent: 'center',
  }
});
