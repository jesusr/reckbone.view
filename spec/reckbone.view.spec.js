var chai = require('chai'),
  should, expect;
import Reckbone from '../example/reckbone';
import View from '../src/reckbone.view';
import $ from 'jquery';
import _ from 'overscore';

describe('Reckbone.View initialize', () => {
  should = chai.should();
  expect = chai.expect;
  describe('Constructor and initialize', () => {
    describe('with default values', () => {
      it('View class is attached', () => {
        let app = new Reckbone({
          components: ['View']
        });
        app.View.should.be.deep.equal(View);
      });
      it('View constructor', () => {
        let view = new View();
        view.opt.should.be.deep.equal({});
        view.events.should.be.deep.equal({});
      });
    });
    describe('with values', () => {
      it('View constructor', () => {
        let opt = {
          template: '<div id="body">{{variable}}</div>',
          container: $('#main'),
          exTemplateConfig: {
            variable: 'Prueba de concepto'
          },
          events: {
            'click .t': 'show'
          }
        };
        let view = new View(opt);
        view.opt.should.be.deep.equal(opt);
        view.events.should.be.deep.equal(opt.events);
        view.template.toString().should.be.deep.equal(_.template(opt.template).toString());
        view.exTemplateConfig.should.be.deep.equal(opt.exTemplateConfig);
      });
      it('View class is attached', () => {
        
      });
    });
  });
});
