import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { RadioButton } from 'react-native-paper';
import UserAPI from '../API/UserAPI'

/*
possible sorts: (radio btn list)
- distance
- alphabetical
- most recent story
*/

export default class SortBarberScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: null
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

    // set the selected value
    let selected_criteria = this.props.route.params.sort_criteria
    if (selected_criteria != null){
      this.setState({selected: selected_criteria})
    }
  }

	render() {
		return (

			// sets up containers for logo and motto and login input boxes
			// <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={styles.container}>

      <View style={styles.radioList}>
        <View style={styles.radioRow}>
          <RadioButton
              value="distance"
              status={this.state.selected == 'distance' ? 'checked' : 'unchecked'}
              onPress={() => { this.setState({ selected: 'distance' }); }}
            />
            <Text style={styles.radioText}>Distance</Text>
        </View>

        <View style={styles.radioRow}>
          <RadioButton
              value="alphabetical"
              status={this.state.selected == 'alphabetical' ? 'checked' : 'unchecked'}
              onPress={() => { this.setState({ selected: 'alphabetical' }); }}
            />
            <Text style={styles.radioText}>Alphabetical</Text>
        </View>

        <View style={styles.radioRow}>
          <RadioButton
              value="most_recent_story"
              status={this.state.selected == 'most_recent_story' ? 'checked' : 'unchecked'}
              onPress={() => { this.setState({ selected: 'most_recent_story' }); }}
            />
            <Text style={styles.radioText}>Recent Story</Text>
        </View>
      </View>

      <View style={{ position: 'absolute', bottom: 30 }}>
        <TouchableOpacity
          onPress={ () => {
            // call the sort function
            if (this.state.selected != null )  {
              this.props.route.params.sortBarbers(this.state.selected)
              this.props.navigation.goBack()
            }
          } } //this.props.navigation.navigate('Sort Barbers') } // when Sign Up is pressed go to the sign up page
          style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
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
  saveButton: {
    backgroundColor: '#4fdb62',
    width: 200,
    height: 50,
		alignItems: 'center',
		justifyContent: 'center',
    borderRadius: 3
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  radioText: {
    fontSize: 18,
    paddingLeft: 20
  },
  radioRow: {
    flexDirection: 'row',
    height: 50,
		alignItems: 'center',
    width: '100%',
    paddingLeft: 40
  },
  radioList: {
    width: '100%',
    flex: 1,
    paddingTop: 30
  }
});
