var futebitsApi = require('../futebits-api.js');

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PickerIOS,
  TouchableHighlight,
  ActivityIndicatorIOS,
} = React;

var PickerItemIOS = PickerIOS.Item;

var RodadaScreen = require('./rodada-screen.js');

var GruposScreen = React.createClass({

  fetchFases: function() {

    var camp = this.props.campeonato;

    var _this = this;

    futebitsApi.getFasesEdicao(camp.campeonato, camp.divisao, camp.edicao)
      .then(function(json) {

        var firstFase = null;

        if (json.length > 0) {
          firstFase = json[0];
          _this.fetchGrupos(firstFase.nome);
        }

        _this.setState({
          fasesLoaded: true,
          gruposLoaded: false,
          fases: json,
          grupos: [],
          selectedFase: firstFase,
          selectedGrupo: null,
        });
      })
      .catch(function(error) {

        console.log(error);
      });
  },

  fetchGrupos: function(fase) {

    var camp = this.props.campeonato;

    var _this = this;

    futebitsApi.getGruposFase(camp.campeonato, camp.divisao, camp.edicao, fase)
      .then(function(json) {

        var firstGrupo = null;

        if (json.length > 0) {
          firstGrupo = json[0];
        }

        _this.setState({
          gruposLoaded: true,
          grupos: json,
          selectedGrupo: firstGrupo,
        });
      })
      .catch(function(error) {

        console.log(error);
      });
  },

  rodadaScreenRoute: function(fase, grupo) {

    return {
      component: RodadaScreen,
      title: 'Jogos',
      passProps: {
        campeonato: this.props.campeonato,
        fase: fase,
        grupo: grupo,
      },
    };
  },

  onFaseSelected: function(fase) {

    this.setState({
      selectedFase: fase,
      selectedGrupo: null,
      gruposLoaded: false,
      grupos: [],
    });

    this.fetchGrupos(fase);
  },

  onGrupoSelected: function(grupo) {

    this.setState({
      selectedGrupo: grupo,
    });
  },

  onNextButtonTapped: function() {

    if (this.state.selectedFase !== null && this.state.selectedGrupo !== null) {
      this.props.navigator.push(this.rodadaScreenRoute(this.state.selectedFase, this.state.selectedGrupo));
    }
  },

  getInitialState: function() {

    return {
      fasesLoaded: false,
      gruposLoaded: false,
      fases: [],
      grupos: [],
      selectedFase: null,
      selectedGrupo: null,
    };
  },

  componentDidMount: function() {

    this.fetchFases();
  },

  renderFasePicker: function() {

    var fasePicker = null;
    if (this.state.fasesLoaded) {
      fasePicker = (
        <PickerIOS selectedValue={this.state.selectedFase} onValueChange={(fase) => this.onFaseSelected(fase)} style={styles.picker}>
          {this.state.fases.map((faseData) => (
            <PickerItemIOS
              key={faseData.nome}
              value={faseData.nome}
              label={faseData.nome}
              />
            )
          )}
        </PickerIOS>
      );
    } else {
      fasePicker = (
        <ActivityIndicatorIOS
          animating={true}
          size='large'
        />
      );
    }

    return fasePicker;
  },

  renderGrupoPicker: function() {

    var grupoPicker = null;
    if (this.state.fasesLoaded && this.state.gruposLoaded) {
      grupoPicker = (
        <PickerIOS selectedValue={this.state.selectedGrupo} onValueChange={(grupo) => this.onGrupoSelected(grupo)} style={styles.picker}>
          {this.state.grupos.map((grupo) => (
            <PickerItemIOS
              key={grupo}
              value={grupo}
              label={grupo}
              />
            )
          )}
        </PickerIOS>
      );
    } else if (this.state.fasesLoaded) {
      grupoPicker = (
        <ActivityIndicatorIOS
          animating={true}
          size='large'
        />
      );
    }

    return grupoPicker;
  },

  render: function() {

    return (
      <View style={styles.container}>
        <View style={styles.pickerContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Selecione uma fase:</Text>
          </View>
          {this.renderFasePicker()}
        </View>
        <View style={styles.pickerContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>E um grupo:</Text>
          </View>
          {this.renderGrupoPicker()}
        </View>
        <TouchableHighlight style={styles.button} onPress={this.onNextButtonTapped}>
          <Text style={styles.buttonText}>Ver Jogos</Text>
        </TouchableHighlight>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingTop: 64,
  },
  pickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  header: {
    backgroundColor: '#2196F3',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  headerText: {
    padding: 8,
    fontSize: 16,
    color: 'white',
  },
  errorText: {
    color: '#212121',
    fontSize: 16,
  },
  button: {
    padding: 16,
    marginTop: 0,
    backgroundColor: '#889D47',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

AppRegistry.registerComponent('GruposScreen', () => GruposScreen);

module.exports = GruposScreen;
