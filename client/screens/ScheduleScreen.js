import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text, KeyboardAvoidingView } from 'react-native';
import UserAPI from '../API/UserAPI'
import BarberAPI from '../API/BarberAPI'

export default class ScheduleScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      schedule: null,
      barbers: null
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

    // get schedule data
    this.fetchScheduleData ()
  }

  fetchScheduleData () {
    let user_id = localStorage.getItem(`id`)
    UserAPI.getSchedule(user_id)
    .then(response => {
      console.log(`Schedule Data`)
      console.log(response)
      if (response.data.success) {
        // set the schedule data
        this.setState({schedule: response.data.schedules})
        // find the barbers...
        let all_barbers = response.data.schedules.map(schedule_ => {
          return BarberAPI.getBarber(schedule_.barber)
        })

        Promise.all(all_barbers).then(barbers_ => {
          console.log(`barbers:`)
          console.log(barbers_)

          let actual_barber_data = barbers_.map(barber_info => {
            if (barber_info.data.success) return barber_info.data
            else return null
          })

          this.setState({barbers: actual_barber_data}, () => {
            console.log(`State barbers`)
            console.log(this.state.barbers)
          })
        })
      }
    })
  }

  getHourString (hour_) {
    if (hour_ == 0) return `12:00am`
    else if (hour_ == 12) return `12:00pm`
    else if (hour_ < 12) return `${hour_}:00am`
    else return `${hour_%12}:00pm`
  }

  showDate (date_) {
    let date = new Date(date_)
    const month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${month_names[date.getMonth()]} ${date.getDay()} ${date.getFullYear()} at ${this.getHourString(date.getHours())}`
  }

  cancelAppointment (i) {
    console.log(`Canceling appointment ${i}`)

    if (this.state.schedule != null && i < this.state.schedule.length) {
      let schedule_id = this.state.schedule[i]._id
      UserAPI.cancelAppointment(schedule_id)
      .then(result => {
        if (result.data.success) {
          console.log(`Successfully canceled appointment`)
          this.fetchScheduleData ()
        }
        else {
          console.log(`Problem canceling appointment`)
          console.log(res.data.error)
        }
      })
      .catch(err => {
        console.log(`Error trying to cancel appointment`)
      })
    }
  }

  showScheduled () {
    if (this.state.schedule == null) {
      return (<View>
        <View style={styles.profileScheduleArea}>
          <Text style={{fontWeight: `italic`, color: `rgba(0, 0, 0, 0.7)`}}>You have 0 schedueled appointments</Text>
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
        </View>
        </View>)
    }
    else {
      return (<View style={styles.bodyContent}>
        <Text style={{
          fontSize: 18,
        }}>You have {this.state.schedule.length} appointments</Text>
        {this.state.schedule != null && this.state.schedule.map((item, i) => {

          if (this.state.barbers == null || i >= this.state.barbers.length || this.state.barbers[i] == null) {
            return (<View key={i} style={styles.scheduleItemView}><Text>Problem Loading barber data...</Text></View>)
          }
          else return (<View key={i} style={styles.scheduleItemView}>
              <Text style={{fontWeight: 'bold', fontSize: 17}}>Appointment With {this.state.barbers[i].shop_name}</Text>
              <Text style={{marginTop: 10, fontSize: 16, paddingLeft: 15}}>Date: {this.showDate(item.time)}</Text>

            <TouchableOpacity
            onPress={() => {
              this.cancelAppointment(i)
            }}
            style={styles.alertButton}>
              <Text style={{color: '#ffffff', fontWeight: 'bold'}}>Cancel Appointment</Text>
            </TouchableOpacity>
            </View>)
        })}
      </View>)
    }
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
        <Text style={styles.headerText}>Schedueled Appointments</Text>
        {this.showScheduled()}
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
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20
  },
  bodyContent: {
    flex: 1,
		justifyContent: 'left',
    width: '100%',
    paddingLeft: 50,
    paddingRight: 50,
    marginTop: 30
  },
  profileScheduleArea: {
    fles: 1,
    height: 150,
    marginTop: 0,
		alignItems: 'center',
		justifyContent: 'center',
  },
  funButton: {
    backgroundColor: '#ff8f57',
    marginTop: 25,
    borderRadius: 3,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10
  },
  scheduleItemView: {
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#24253B',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  alertButton: {
    width: '100%',
    height: 35,
    backgroundColor: '#d93f3f',
    marginTop: 20,
    borderRadius: 3,
		alignItems: 'center',
		justifyContent: 'center',
  }
});
