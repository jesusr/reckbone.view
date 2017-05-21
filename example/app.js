import Reckbone from './reckbone';
import $ from 'jquery';

class App {
  constructor(config = {}) {
    this.config = config;
  }
  initialize() {
    this.app = new Reckbone({
      components: ['View']
    });
    this.app.header = new this.app.View({
      template: '<div id="header"><h1>View example</h1></div>',
      container: $('#main')
    }).render();
    this.app.body = new this.app.View({
      template: '<div id="body">{{variable}}</div>',
      container: $('#main'),
      exTemplateConfig: {
        variable: 'Prueba de concepto'
      }
    }).render();
  }
}

if (window) window.App = App;

export default App;
