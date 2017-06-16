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
      it('View constructor with template', () => {
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
      it('View child', () => {
        let opt = {
          template: '<div id="body">{{variable}}</div>',
          isChild: true,
          exTemplateConfig: {
            variable: 'Prueba de concepto'
          },
          events: {
            'click .t': 'show'
          }
        };
        let view = new View(opt);
        view.opt.should.be.deep.equal(opt);
        view.el.should.not.be.undefined;
        view.$el.should.not.be.undefined;
      });
      it('View class without container and not isChild', () => {
        let opt = {
          template: '<div id="body">{{variable}}</div>',
          exTemplateConfig: {
            variable: 'Prueba de concepto'
          },
          events: {
            'click .t': 'show'
          }
        };
        let view = new View(opt);
        view.opt.should.be.deep.equal(opt);
        expect(view.el).to.be.undefined;
        expect(view.$el).to.be.undefined;
      });
    });
    describe('Methods', () => {
      describe('Show', () => {
        it('Regular behaviour', () => {
          let opt = {
            template: '<div id="body">{{variable}}</div>',
            isChild: true,
            exTemplateConfig: {
              variable: 'Prueba de concepto'
            },
            events: {
              'click .t': 'show'
            }
          };
          let view = new View(opt);
          view.show();
          view.$el.css('display').should.not.be.equal('none');
        });
      });
      describe('Hide', () => {
        it('Regular behaviour', () => {
          let opt = {
            template: '<div id="body">{{variable}}</div>',
            isChild: true,
            exTemplateConfig: {
              variable: 'Prueba de concepto'
            },
            events: {
              'click .t': 'show'
            }
          };
          let view = new View(opt);
          view.hide();
          view.$el.css('display').should.be.equal('none');
        });
      });
			describe('CleanEvents', () => {
        it('Regular behaviour', () => {
          let opt = {
            template: '<div id="body">{{variable}}</div>',
            isChild: true,
            exTemplateConfig: {
              variable: 'Prueba de concepto'
            },
            events: {
              'click .t': 'show'
            }
          };
          let view = new View(opt);
          view.cleanEvents();
          view.eventsRef.should.be.deep.equal([]);
        });
      });
			describe('Remove', () => {
        it('Regular behaviour', () => {
          let opt = {
            template: '<div id="body">{{variable}}</div>',
            isChild: true,
            exTemplateConfig: {
              variable: 'Prueba de concepto'
            },
            events: {
              'click .t': 'show'
            }
          };
          let view = new View(opt);
          view.remove();
          expect(view.el).to.be.equal(null);
        });
      });
    });
  });
  describe('Class extend', () => {
    describe('with template', () => {
      it('and constructor', () => {
        let SubView = View.extend({
          constructor: function (conf) {
            // to force the constructor case
            View.prototype.constructor.call(this, conf);
          },
          template: '<div id="header"><h1>View example</h1></div>',
          isChild: true
        });
        let subView = new SubView();
        subView.el.should.not.be.undefined;
        subView.$el.should.not.be.undefined;
      });
      it('and without constructor', () => {
        let SubView = View.extend({
          template: '<div id="header"><h1>View example</h1></div>',
          isChild: true
        });
        let subView = new SubView();
        subView.el.should.not.be.undefined;
        subView.$el.should.not.be.undefined;
      });
    });
  });
});
