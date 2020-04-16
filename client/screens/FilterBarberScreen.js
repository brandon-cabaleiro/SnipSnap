import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { RadioButton } from 'react-native-paper';
import UserAPI from '../API/UserAPI'

export default class FilterBarberScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: null,
      value: null
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
    let filter_criteria = this.props.route.params.filter_criteria
    if (filter_criteria != null){
      this.setState({selected: filter_criteria})
    }

    let filter_value = this.props.route.params.filter_value
    if (filter_value != null){
      this.setState({value: filter_value})
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
              value="min_distance"
              status={this.state.selected == 'min_distance' ? 'checked' : 'unchecked'}
              onPress={() => { this.setState({ selected: 'min_distance' }); }}
            />
            <Text style={styles.radioText}>Min. Distance</Text>
        </View>

        {this.state.selected == 'min_distance' && <View>
          {[5, 10, 15, 20, 25].map(dist_value => {

            return (<View style={styles.radioSubRow}>
                    <RadioButton
                        status={this.state.value == dist_value ? 'checked' : 'unchecked'}
                        onPress={() => { this.setState({ value: dist_value }); }}
                      />
                      <Text style={styles.radioText}>{dist_value}</Text>
                    </View>)

          })}
        </View>}
      </View>

      <View style={{ position: 'absolute', bottom: 30 }}>
        <TouchableOpacity
          onPress={ () => {
            // call the sort function
            if (this.state.selected != null && this.state.value != null )  {
              this.props.route.params.filterBarbers(this.state.selected, this.state.value)
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
  radioSubRow: {
    flexDirection: 'row',
    height: 40,
		alignItems: 'center',
    width: '100%',
    paddingLeft: 80
  },
  radioList: {
    width: '100%',
    flex: 1,
    paddingTop: 30
  }
});
