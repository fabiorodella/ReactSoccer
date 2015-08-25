var futebitsApi = require('../futebits-api.js');

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  ActivityIndicatorIOS,
} = React;

var RodadaScreen = React.createClass({

  fetchRodada: function() {

    var camp = this.props.campeonato;
    var fase = this.props.fase;
    var grupo = this.props.grupo;

    var _this = this;

    futebitsApi.getRodadaAtual(camp.campeonato, camp.divisao, camp.edicao, fase.nome, grupo)
      .then(function(json) {

        _this.setState({
          loaded: true,
          dataSource: _this.state.dataSource.cloneWithRows(json.jogos),
        });
      })
      .catch(function(error) {

        console.log(error);
      });
  },

  getInitialState: function() {

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    return {
      loaded: false,
      dataSource: ds.cloneWithRows([]),
    };
  },

  componentDidMount: function() {

    this.fetchRodada();
  },

  render: function() {

    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return this.renderListView();
  },

  renderLoadingView: function() {

    return (
      <View style={styles.activityContainer}>
        <ActivityIndicatorIOS
          animating={true}
          size='large'
        />
      </View>
    );
  },

  renderListView: function() {

    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          />
      </View>
    );
  },

  renderRow: function(rowData, sectionID, rowID) {

    var escudoMandante = rowData.escudo_equipe_mandante['100x100'];
    var escudoVisitante = rowData.escudo_equipe_visitante['100x100'];

    return (
      <View style={styles.row}>
        <Text style={styles.matchInfo}>{rowData.estadio} - {rowData.cidade}</Text>
        <View style={styles.teamsContainer}>
          <View style={styles.teamContainer}>
            <Image source={{uri: escudoMandante}} style={styles.teamLogo}/>
            <Text style={styles.teamName}>{rowData.nome_equipe_mandante}</Text>
          </View>
          <Text style={styles.teamGoals}>{rowData.gols_mandante}</Text>
          <Text style={styles.teamsSeparator}>X</Text>
          <Text style={styles.teamGoals}>{rowData.gols_visitante}</Text>
          <View style={styles.teamContainer}>
            <Image source={{uri: escudoVisitante}} style={styles.teamLogo}/>
            <Text style={styles.teamName}>{rowData.nome_equipe_visitante}</Text>
          </View>
        </View>
        <Text style={styles.matchInfo}>{rowData.data} - {rowData.hora}</Text>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activityContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    paddingVertical: 20,
    paddingLeft: 16,
    borderTopColor: 'white',
    borderLeftColor: 'white',
    borderRightColor: 'white',
    borderBottomColor: '#E0E0E0',
    borderWidth: 1,
    alignItems: 'center',
  },
  matchInfo: {
    fontSize: 14,
    color: '#999999',
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  teamsSeparator: {
    marginLeft: 8,
    marginRight: 8,
    fontSize: 20,
    color: '#DDDDDD',
  },
  teamContainer: {
    alignItems: 'center',
    width: 120,
  },
  teamName: {
    fontSize: 16,
  },
  teamGoals: {
    fontSize: 20,
  },
  teamLogo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});

AppRegistry.registerComponent('RodadaScreen', () => RodadaScreen);

module.exports = RodadaScreen;
