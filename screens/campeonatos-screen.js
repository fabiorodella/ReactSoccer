var futebitsApi = require('../futebits-api.js');

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicatorIOS,
} = React;

var GruposScreen = require('./grupos-screen.js');

var CampeonatosScreen = React.createClass({

  fetchData: function() {

    var dataBlob = {};
    var sectionIDs = [];
    var rowIDs = [];

    var _this = this;

    this.setState({
      loaded: false,
      failed: false,
    });

    futebitsApi.getCampeonatos()
      .then(function(json) {

        var i = 0;
        for (var campeonatoIdx in json.campeonato) {

          var campeonato = json.campeonato[campeonatoIdx];
          for (var divisaoIdx in campeonato.divisoes) {

            var divisao = campeonato.divisoes[divisaoIdx];
            var section = campeonato.nome + ' - ' + divisao.nome;
            sectionIDs.push(section);
            dataBlob[section] = section;
            rowIDs[i] = [];

            for (var edicaoIdx in divisao.edicoes) {

              var edicao = divisao.edicoes[edicaoIdx];
              var rowData = {
                campeonato: campeonato.nome,
                divisao: divisao.nome,
                edicao: edicao,
              };

              rowIDs[i].push(edicao);
              dataBlob[section + ':' + edicao] = rowData;
            }

            i++;
          }
        }

        _this.setState({
          dataSource: _this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
          loaded: true,
        });
      })
      .catch(function(error) {

        _this.setState({
          failed: true,
        });
      });
  },

  gruposScreenRoute: function(campeonatoData) {

    return {
      component: GruposScreen,
      title: 'Grupos',
      passProps: {
        campeonato: campeonatoData,
      },
    };
  },

  onRetryButtonTapped: function() {

    this.fetchData();
  },

  onRowTapped: function(rowData) {

    this.props.navigator.push(this.gruposScreenRoute(rowData));
  },

  getInitialState: function() {

    var getSectionData = (dataBlob, sectionID) => {
      return dataBlob[sectionID];
    };

    var getRowData = (dataBlob, sectionID, rowID) => {
      return dataBlob[sectionID + ':' + rowID];
    };

    return {
      loaded: false,
      failed: false,
      dataSource: new ListView.DataSource({
        getSectionData: getSectionData,
        getRowData: getRowData,
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      }),
    };
  },

  componentDidMount: function() {

    this.fetchData();
  },

  render: function() {

    if (this.state.failed) {
      return this.renderErrorView();
    }

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

  renderErrorView: function() {

    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro ao carregar os dados.</Text>
        <TouchableHighlight style={styles.retryButton} onPress={this.onRetryButtonTapped}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableHighlight>
      </View>
    );
  },

  renderListView: function() {

    return (
      <View style={styles.container}>
        <ListView
          dataSource          = {this.state.dataSource}
          style               = {styles.listview}
          renderRow           = {this.renderRow}
          renderSectionHeader = {this.renderSectionHeader}
        />
      </View>
    );
  },

  renderRow: function(rowData, sectionID, rowID) {

    return (
      <TouchableOpacity onPress={() => this.onRowTapped(rowData)}>
        <View style={styles.row}>
          <Text style={styles.rowText}>{rowData.edicao}</Text>
        </View>
      </TouchableOpacity>
    );
  },

  renderSectionHeader: function(sectionData, sectionID) {

    return (
      <View style={styles.section}>
        <Text style={styles.sectionText}>{sectionData}</Text>
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
  errorContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#212121',
    fontSize: 16,
  },
  retryButton: {
    padding: 16,
    marginTop: 30,
    backgroundColor: '#889D47',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  row: {
    paddingVertical: 20,
    paddingLeft: 16,
    borderTopColor: 'white',
    borderLeftColor: 'white',
    borderRightColor: 'white',
    borderBottomColor: '#E0E0E0',
    borderWidth: 1,
  },
  rowText: {
    color: '#212121',
    fontSize: 16,
  },
  section: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 6,
    backgroundColor: '#2196F3',
  },
  sectionText: {
    color: 'white',
    paddingHorizontal: 8,
    fontSize: 16,
  },
});

AppRegistry.registerComponent('CampeonatosScreen', () => CampeonatosScreen);

module.exports = CampeonatosScreen;
