import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, KeyboardAvoidingView } from 'react-native';
import UserAPI from '../API/UserAPI'
import LottieView from 'lottie-react-native';

export default class TransitionScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      animation: null,
      message: null,
      destination: null
    }
  }

  // this.props.route.params.

  componentDidMount () {
    let animation = this.props.route.params.animation
    let message = 'mesage' in this.props.route.params ? this.props.route.params.message : null
    let destination = this.props.route.params.destination

    this.setState({
      animation: animation,
      message: message,
      destination: destination
    })
  }

	render() {
		return (
      <View>
        {this.state.animation != null && <LottieView source={require(`../images/${this.state.animation}.json`)} autoPlay loop />}
        <Text>{this.state.message == null ? '' : this.state.message}</Text>
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
