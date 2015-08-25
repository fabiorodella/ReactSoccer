/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
} = React;

var CampeonatosScreen = require('./screens/campeonatos-screen.js');

var ReactSoccer = React.createClass({

  campeonatosScreenRoute: function() {

    return {
      component: CampeonatosScreen,
      title: 'Campeonatos',
    };
  },

  render: function() {

    return (
      <NavigatorIOS ref='navigator' style={styles.navigator} initialRoute={this.campeonatosScreenRoute()}/>
    );
  }
});

var styles = StyleSheet.create({
  navigator: {
    flex: 1,
  },
});

AppRegistry.registerComponent('ReactSoccer', () => ReactSoccer);
