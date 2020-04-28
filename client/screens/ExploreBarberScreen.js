import React, { Component } from 'react';
import { Picker, StyleSheet, View, Image, Text, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, PanResponder, Animated } from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import UserAPI from '../API/UserAPI'
import BarberAPI from '../API/BarberAPI'
import ItemMenuAPI from '../API/ItemMenuAPI'
import CustomStyles from '../styles/styles'


/*
possible sorts: (radio btn list)
- distance
- alphabetical
- most recent story

possible filters: (radio btn list)
- min distance
*/

export default class ExploreBarberScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      pan: new Animated.ValueXY(),
      touch_pan: new Animated.Value(0),
      raw_barbers: [],
      barbers: [],
      selected_barber: 0,
      image_loaded: false,
      sort_criteria: null,
      filter_criteria: null,
      filter_value: null,
      sliding_mode: true,
      loaded_item_menus: [],
      selected_item_menu: null,
      swipe_down_transition: false,
      user_data: null
    }
  }

  filterBarbers (filter_criteria, filter_value) {
    console.log("Filtering Barbers")
    console.log(`${filter_criteria}, ${filter_value}`)
    if (typeof filter_criteria != typeof "string") return;
    if (typeof filter_value != typeof 123) return;

    console.log(`Filtering...`)
    let old_barbers = this.state.raw_barbers.slice()
    if (filter_criteria == 'min_distance') {
      old_barbers = old_barbers.filter(barber => this.calculateDistance([0, 0], barber.location) < filter_value)
    }

    // update the barber list
    this.setState({selected_barber: 0, filter_criteria: filter_criteria, filter_value: filter_value, barbers: old_barbers})
  }

  sortBarbers (sort_criteria) {
    console.log("Sorting Barbers")
    if (typeof sort_criteria != typeof "string") return;

    let old_barbers = this.state.barbers.slice()
    if (sort_criteria == 'distance') {
      old_barbers.sort ((a, b) => {
        return this.calculateDistance([0, 0], a.location) - this.calculateDistance([0, 0], b.location)
      })
    }
    else if (sort_criteria == 'alphabetical') {
      old_barbers.sort ((a, b) => {
        if(a.shop_name < b.shop_name) { return -1; }
        if(a.shop_name > b.shop_name) { return 1; }
    return 0;
      })
    }
    else if (sort_criteria == 'most_recent_story') {
      // do nothing... story timers have not been implemented yet
    }

    // update the new sorting
    this.setState({selected_barber: 0, sort_criteria: sort_criteria, barbers: old_barbers})
  }

  componentWillMount() {
    // setup pan responder
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([
        null, {dx: this.state.pan.x, dy: this.state.pan.y }
      ]),
      onPanResponderRelease: (e, gestureState) => {
        // console.log(`Released: PanX = ${this.state.pan.x._value}`)
        this.evaluateTransition(this.state.pan.x._value, gestureState)

        // Animated.spring(this.state.pan, {
        //   toValue: {x: 0, y: 0}
        // }).start()
      }
    })
  }

  evaluateTransition (value_, gestureState) {
    // -150 and 150 == transition!
    if ( (value_ > -150 && value_ < 150)
    || (value_ > 150 && this.state.selected_barber == 0 )
    || (value_ < -150 && this.state.selected_barber == this.state.barbers.length - 1)) {
      console.log("Returning...")
      Animated.spring(this.state.pan, {
        toValue: {x: 0, y: 0}
      }).start(({finished}) => {
        console.log("Finished!")
      })
    }
    else if (value_ > 150){
      Animated.spring(this.state.pan, {
        toValue: {x: 370, y: 0}
      }).start(({finished}) => {
        let next_index = (this.state.selected_barber - 1) == -1 ? this.state.barbers.length - 1 : this.state.selected_barber - 1
        console.log(`next index; ${next_index}`)
        this.setState({
          selected_barber: next_index
        }, () => {
          this.state.pan.flattenOffset()
          this.state.pan.setValue({x: 0, y: 0})
        })
      })
    }
    else if (value_ < -150){
      Animated.spring(this.state.pan, {
        toValue: {x: -370, y: 0}
      }).start(({finished}) => {
        let next_index = (this.state.selected_barber + 1) % (this.state.barbers.length)
        console.log(`prev index; ${next_index}`)
        this.setState({
          selected_barber: next_index
        }, () => {
          this.state.pan.flattenOffset()
          this.state.pan.setValue({x: 0, y: 0})
        })
      })
    }
  }

  calculateDistance (start, end) {
    // direct distance in raw units
    let raw = Math.sqrt( Math.pow(start[0] + end[0], 2) + Math.pow(start[1] + end[1], 2) )
    // raw == 2 meters per
    let transformed = (2 * raw) / 1609.34
    return transformed.toFixed(1)
  }

  componentDidMount () {
    console.log("Explorer Page Mounting...")
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

    // load barbers
    BarberAPI.getBarbers(10, 0)
    .then(response => {
      this.setState({barbers: response.data.barbers, raw_barbers: response.data.barbers})
    })
    .catch(err => {
      console.log(`Problem retrieving barbers...`)
    })

    this.state.touch_pan.addListener((x) => {
      this.forceUpdate()
    })

    this.updateUserData()
  }

  expandCard() {
    console.log("Clicked!")
    // this.setState({sliding_mode: false})

    Animated.spring(this.state.touch_pan, {
      toValue: 1
    }).start(({finished}) => {
      console.log("Finished")
      this.state.touch_pan.flattenOffset()
      this.state.touch_pan.setValue(1)

      this.setState({
        sliding_mode: false,
        loaded_item_menus: []
      }, () => {
        // load the item menus for this barber
        ItemMenuAPI.getMenus( this.state.barbers[ this.state.selected_barber ]._id )
        .then(response => {
          if (response.data.success) {
            let new_item_menus = response.data.itemized_menus
            this.setState({
              loaded_item_menus: new_item_menus,
              selected_item_menu: new_item_menus.length == 0 ? null : new_item_menus[0].menu_name,
              swipe_down_transition: false
             })

          }
          else {
            console.log(`Retrieving item menus returned false`)
          }
        })
        .catch(err => {
          console.log(`Problem loading barber's menus`)
        })

      })
    })
  }

  getSourceImage() {
    if (this.state.selected_barber < this.state.barbers.length && 'recent_story' in this.state.barbers[this.state.selected_barber]) {
      return this.state.barbers[this.state.selected_barber].recent_story
    }
    return 'no image'
  }

  updateUserData() {
    let user_id = localStorage.getItem(`id`)
    UserAPI.getUser(user_id)
    .then(user_data => {
      this.setState({user_data: user_data.data})
    })
    .catch(err => {
      console.log(`User data failed to load`)
    })
  }

  getCardStyle (expand_lerp) {

    return {
      width: `${100 + (20 * expand_lerp)}%`,
      height: 200 + (400 * expand_lerp),
      backgroundColor: 'white',
      borderRadius: 8,
      paddingLeft: 35,
      paddingRight: 35,
      paddingTop: 20,
      zIndex: 4,
      shadowColor: 'black',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.2,
      shadowRadius: 5
    }
  }

  setImageStyle() {
    return {
      width: "100%",
      height: "100%",
      zIndex: 0
    }

  }

  barberSaved (barber_id) {
    console.log(`Barber Saved ? ${barber_id}`)
    console.log(`User data...`)
    console.log(this.state.user_data)
    // check if the barber_id is in our user_data's saved barbers
    if (this.state.user_data != null && 'saved' in this.state.user_data && typeof this.state.user_data.saved == typeof []) {
      console.log(`=> saved: ${this.state.user_data.saved.includes(barber_id)}`)
      return this.state.user_data.saved.includes(barber_id)
    }
    console.log(`=> saved default: false`)
    return false
  }

  showMenuOptions() {

    let index_ = this.getItemMenuIndex()
    console.log('Item menu index: ' + index_)
    if (index_ == -1) {
      return (<View></View>)
    }

    let menu_options_list = this.state.loaded_item_menus[this.getItemMenuIndex()].menu_options.map(option_ => {
      return (<View style={{
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.25)',
        height: 30
      }}>
        <Text style={{marginLeft: 20}}>{option_.option_name}</Text>
        <Text style={{ color: '#2BA72F', marginLeft: 'auto', marginRight: 30}}>${!('price_min' in option_) || option_.price_min == 0 ? 5 : option_.price_min}</Text>
      </View>)
    })

    return menu_options_list
  }

  getLeftOffset(x) {
    if (x > this.state.selected_barber) {
      return (370 * (x - this.state.selected_barber)) + 100 + (30 * this.state.touch_pan._value)
    }
    else if (x < this.state.selected_barber) {
      return (370 * (x - this.state.selected_barber)) + 100 - (30 * this.state.touch_pan._value)
    }
  }

  getItemMenuIndex() {
    if (this.state.selected_item_menu == null) {
      console.log(`Selected item menu is null`)
      return -1
    }

    for (let i in this.state.loaded_item_menus) {
      let item_menu = this.state.loaded_item_menus[i]
      if (item_menu.menu_name == this.state.selected_item_menu) {
        console.log (`Index found: ${i}`)
        return i
      }
    }
    console.log(`Could not find in existing options`)
    return -1
  }

  // <Image
  //   source = {this.getSourceImage()}
  //   style = {this.setImageStyle()}
  // />

	render() {
		return (

			// sets up containers for logo and motto and login input boxes
			// <KeyboardAvoidingView behavior="padding" style={styles.container}>
			<View style={styles.container}>

      <View style={styles.topLeftExplore}>
        <TouchableOpacity
          onPress={ () => this.props.navigation.navigate('Filter Barbers', {
            filterBarbers: this.filterBarbers.bind(this),
            filter_criteria: this.state.filter_criteria,
            filter_value: this.state.filter_value
          }) } // when Sign Up is pressed go to the sign up page
          style={styles.orderButton}>
          <Image style={{width: 25, height: 25}} source={require('../images/filter.svg')} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={ () => this.props.navigation.navigate('Sort Barbers', {
            sortBarbers: this.sortBarbers.bind(this),
            sort_criteria: this.state.sort_criteria
          }) } // when Sign Up is pressed go to the sign up page
          style={styles.orderButton}>
          <Image style={{width: 25, height: 25}} source={require('../images/sort.svg')} />
        </TouchableOpacity>
      </View>

      <View style={styles.topRightExplore}>
        <Text style={styles.timeText}>2 days ago</Text>
      </View>

      <Image
        source = {require('../images/logo-loading.svg')}
        style = {{ width: 100, height: 100, position: 'absolute', zIndex: 0 }}
      />

        <Image
          source = {this.getSourceImage()}
          style = {this.setImageStyle()}
        />

        {this.state.barbers.map((barber, ind) => {
          // create animated item for the barber
          // if (ind == this.state.selected_barber) {
            if (this.state.sliding_mode) {
              return (<Animated.View style={{
                    transform: [
                    { translateX: this.state.pan.x }
                  ],
                    width: '60%',
                    position: 'absolute',
                    bottom: 80,
                    left: ind == this.state.selected_barber ? (370 * (ind - this.state.selected_barber)) + 100 - (30 * this.state.touch_pan._value) : this.getLeftOffset(ind)
                  }}
                  {...this._panResponder.panHandlers}
                  key={ind}
                >

                <TouchableWithoutFeedback onPress={() => {
                  if (ind == this.state.selected_barber) this.expandCard()
                }}>
                <View style={ ind == this.state.selected_barber ? this.getCardStyle(this.state.touch_pan._value) : [styles.card] }>
                    <Text style={styles.cardTitle}>{barber.shop_name}</Text>
                    <View style={styles.cardDistanceView}>
                      <Text style={styles.cardDistanceText}>{this.calculateDistance([0, 0], barber.location)} miles away</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
                </Animated.View>)
            }
            else {
              if (this.state.selected_barber == ind) {
                return (
                  <View style={{
                    width: '60%',
                    position: 'absolute',
                    bottom: 80,
                    left: 100 - (30 * this.state.touch_pan._value)
                  }}>
                  <View style={this.getCardStyle(this.state.touch_pan._value)} key={ind}>

                  {!this.state.swipe_down_transition && <GestureRecognizer
                    onSwipe={(direction, state) => {}}
                    onSwipeUp={(state) => {}}
                    onSwipeDown={(state) => {
                      // start swiping down the view down
                      this.setState({swipe_down_transition: true})
                      // set the touch_pan value to 0
                      Animated.spring(this.state.touch_pan, {
                        toValue: 0
                      }).start(({finished}) => {
                        console.log("Finished")
                        this.state.touch_pan.flattenOffset()
                        this.state.touch_pan.setValue(0)
                        this.setState({sliding_mode: true})
                      })

                    }}
                    onSwipeLeft={(state) => {}}
                    onSwipeRight={(state) => {}}
                    config={{
                      velocityThreshold: 0.3,
                      directionalOffsetThreshold: 80
                    }}
                    style={{
                      height: 40,
                    }}
                    >
                    <View style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      borderRadius: 3,
                      height: 8,
                      marginBottom: 20
                    }}></View>
                  </GestureRecognizer>}

                    <Text style={styles.cardTitle}>{barber.shop_name}</Text>
                    {!this.state.swipe_down_transition && <View style={styles.cardDistanceViewExpand}>
                      <Text style={styles.cardDistanceText}>{this.calculateDistance([0, 0], barber.location)} miles away</Text>

                      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
                        <TouchableOpacity onPress={() => {
                          // call the save user api

                          console.log(`User ID: ${this.state.user_data.user_id}`)
                          if (this.barberSaved(barber._id)) {
                            // unsave it
                            UserAPI.unsaveBarber(this.state.user_data == null ? null : this.state.user_data.user_id, barber._id)
                            .then (response => {
                              // update the user's data
                              console.log(`Barber unsaved`)
                              console.log(response)
                              this.updateUserData ()
                            })
                            .catch (err => {
                              `Problem unsaving barber`
                            })
                          }
                          else {
                            // save it
                            UserAPI.saveBarber(this.state.user_data == null ? null : this.state.user_data.user_id, barber._id)
                            .then (response => {
                              console.log(`Barber saved`)
                              console.log(response)
                              this.updateUserData ()
                            })
                            .catch (err => {
                              `Problem saving barber`
                            })
                          }

                        }} style={this.barberSaved(barber._id) ? styles.barberInteractButtonActive : styles.barberInteractButton}>
                          <Text style={this.barberSaved(barber._id) ? styles.barberInteractTextActive : styles.barberInteractionText}>{this.barberSaved(barber._id) ? 'Saved' : 'Save'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                          this.props.navigation.navigate("Scheduele an Appointment", {
                            barber_id: barber._id,
                            user_id: this.state.user_data.user_id
                          })
                        }} style={styles.barberInteractButton}>
                          <Text style={styles.barberInteractionText}>Schedule</Text>
                        </TouchableOpacity>
                      </View>

                    <View style={{ width: '100%', height: 2, borderTopWidth: 1, borderColor: 'rgba(0, 0, 0, 0.6)', marginTop: 30}}></View>

                    <View style={{
                      marginTop: 30
                    }}>

                    </View>

                      <View style={{
                        flexDirection: 'row',
                        height: 45,
                        alignItems: 'center'
                      }}>
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>Services</Text>

                        <Picker
                          selectedValue={this.state.loaded_item_menus.length == 0 ? '' : this.state.loaded_item_menus[0].menu_name}
                          style={{
                            height: 40,
                            width: 180,
                            borderWidth: 1,
                            borderColor: 'rgba(0, 0, 0, 0.8)',
                            borderRadius: 3,
                            position: 'absolute',
                            right: 0,
                            paddingLeft: 20
                          }}
                          onValueChange={(value, index) => {
                            // set the value of selected_item_menu
                            this.setState({ selected_item_menu: value })
                          }}
                          >
                          {this.state.loaded_item_menus.map(menu_ => {
                            return (<Picker.Item label={menu_.menu_name} value={menu_.menu_name} />)
                          })}
                        </Picker>

                      </View>

                      <View style={{marginTop: 30}}>
                        { this.showMenuOptions() }
                      </View>

                    </View>}
                  </View>
                </View>)
              }
              else {
                return (<Animated.View style={{
                      transform: [
                      { translateX: this.state.pan.x }
                    ],
                      width: '60%',
                      position: 'absolute',
                      bottom: 80,
                      left: this.getLeftOffset(ind)
                    }}
                    key={ind}
                  >

                  <TouchableWithoutFeedback onPress={() => {
                    console.log("Clicked!")
                    this.setState({sliding_mode: false})
                  }}>
                  <View style={ [styles.card] }>
                      <Text style={styles.cardTitle}>{barber.shop_name}</Text>
                      <View style={styles.cardDistanceView}>
                        <Text style={styles.cardDistanceText}>{this.calculateDistance([0, 0], barber.location)} miles away</Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                  </Animated.View>)
              }
            }
        })}

			</View>
		);
	}
}

// stylesheet to provide letter fonts and sizes
// as well as background colors and formats
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
	},
  logo: {
		width: 150,
		height: 150
	},
  card: {
    width: '100%',
    height: 200,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingLeft: 35,
    paddingRight: 35,
    paddingTop: 20,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 1
  },
  rightInactiveCard: {
    width: '80%',
    height: 180,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8
  },
  leftInactiveCard: {
    width: '100%',
    height: 180,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    transform: [ {translateX: -370} ]
  },
  bottomCard: {
    position: 'absolute'
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 25,
    color: 'rgba(0, 0, 0, 0.85)'
  },
  cardDistanceText: {
    color: '#2557CC',
      fontSize: 20
  },
  cardDistanceView: {
    justifyContent: 'center',
		alignItems: 'center',
    paddingTop: 20
  },
  cardDistanceViewExpand: {
		alignItems: 'left',
    paddingTop: 20,
    paddingLeft: 20
  },
  topLeftExplore: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 4,
    flexDirection: 'row'
  },
  topRightExplore: {
    position: 'absolute',
    top: 30,
    right: 25,
    zIndex: 4,
    flexDirection: 'row'
  },
  timeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  orderButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    marginRight: 15,
    borderRadius: 5
  },
  barberInteractButton: {
    height: 50,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 3,
    marginRight: 8,
    marginLeft: 8
  },
  barberInteractButtonActive: {
      height: 50,
      width: 120,
      backgroundColor: '#000000',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#000000',
      borderRadius: 3,
      marginRight: 8,
      marginLeft: 8
  },
  barberInteractTextActive: {
    color: '#ffffff'
  },
  barberInteractionText: {
    fontSize: 17,
  }
});

// <Animated.View style={{
//   transform: [
//   { translateX: this.state.pan.x }
// ],
//   width: '60%',
//   position: 'absolute',
//   bottom: 90}}
//   ref={ (x) => this.leftModal = x }
// >
//   <View style={[styles.leftInactiveCard]}>
//   </View>
// </Animated.View>
//
// <Animated.View style={{
//   transform: [
//   { translateX: this.state.pan.x }
// ],
//   width: '60%',
//   position: 'absolute',
//   bottom: 80}}
// {...this._panResponder.panHandlers}
// ref={ (x) => this.centerModal = x }
// >
//   <View style={ [styles.card] }>
//     <Text style={styles.cardTitle}>Sanchez's Barber Shop</Text>
//     <View style={styles.cardDistanceView}>
//       <Text style={styles.cardDistanceText}>X miles away</Text>
//     </View>
//   </View>
// </Animated.View>
//
// <Animated.View style={{
//   transform: [
//   { translateX: this.state.pan.x }
// ],
//   width: '60%',
//   position: 'absolute',
//   bottom: 90}}
// {...this._panResponder.panHandlers}
// ref={ (x) => this.rightModal = x }
// >
//   <View style={[styles.rightInactiveCard]}>
//   </View>
// </Animated.View>
