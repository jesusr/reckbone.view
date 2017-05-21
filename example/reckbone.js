import View from 'reckbone.view';

function Reckbone(config = {}) {
  config.components = config.components ? config.components : comps;
  this.config = config;
  addComp.call(this, config.components);
  Reckbone.initialize(config);
}
Reckbone.initialize = function (config = {}) {
  // to be override
};
let comps = ['View'];

function addComp(comps) {
  if (comps.indexOf('View') > -1) this.View = View;
}

module.exports = Reckbone;