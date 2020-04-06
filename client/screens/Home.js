import React, { Component } from 'react';
import {StyleSheet, Text, View, SafeAreaView, SectionList} from "react-native";
import { ScrollView } from 'react-native-gesture-handler';
import Constants from "expo-constants";

const DATA = [
	{
	  title: "Barber #1",
	  data: ["Fade: $5", "Haircut + Wash: $10", "Premium: $30"]
	},
	{
	  title: "Barber #2",
	  data: ["All styles men: $15", "All styles women: $15", "Kids: $10"]
	},
	{
	  title: "Barber #3",
	  data: ["Haircut: $15", "Haircut + Beard: $20", "Haircut + Eyebrows: $17"]
	}
];

const Item = ({ title }) => (
	<View style={styles.item}>
	  <Text style={styles.title}>{title}</Text>
	</View>
);

export default class Home extends Component {

	render() {
		return (
			<View>
				{/* <Text>This is the home page.</Text>
				<Text>From here you will be able to navigate to barber pages.</Text> */}
				<SafeAreaView style={styles.container}>
					<SectionList
					sections={DATA}
					keyExtractor={(item, index) => item + index}
					renderItem={({ item }) => <Item title={item} />}
					renderSectionHeader={({ section: { title } }) => (
						<Text style={styles.header}>{title}</Text>
					)}
					/>
				</SafeAreaView>
			</View> 
		)
	}
}

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  marginTop: Constants.statusBarHeight,
	  marginHorizontal: 16
	},
	item: {
	  backgroundColor: "yellow",
	  padding: 20,
	  marginVertical: 8
	},
	header: {
	  fontSize: 32,
	  backgroundColor: "#fff"
	},
	title: {
	  fontSize: 24
	}
  });