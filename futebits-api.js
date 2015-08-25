const API_BASE_URL = 'http://www.futebits.com.br/ws/api/';

function fetchJson(url) {

  return fetch(url)
    .then((response) => response.json());
}

module.exports.getCampeonatos = function() {

  return fetchJson(API_BASE_URL + 'getCampeonatos');
};

module.exports.getFasesEdicao = function(campeonato, divisao, edicao) {

  return fetchJson(
    API_BASE_URL +
    'getFasesEdicao/' +
    encodeURIComponent(campeonato) + '/' +
    encodeURIComponent(divisao) + '/' +
    encodeURIComponent(edicao));
};

module.exports.getGruposFase = function(campeonato, divisao, edicao, fase) {

  return fetchJson(
    API_BASE_URL +
    'getGruposFase/' +
    encodeURIComponent(campeonato) + '/' +
    encodeURIComponent(divisao) + '/' +
    encodeURIComponent(edicao) + '/' +
    encodeURIComponent(fase));
};

module.exports.getRodadaAtual = function(campeonato, divisao, edicao, fase, grupo) {

  return fetchJson(
    API_BASE_URL +
    'getRodadaAtual/' +
    encodeURIComponent(campeonato) + '/' +
    encodeURIComponent(divisao) + '/' +
    encodeURIComponent(edicao) + '/' +
    encodeURIComponent(fase) + '/' +
    encodeURIComponent(grupo));
};
