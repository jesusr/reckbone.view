import _ from 'overscore';
import $ from 'mquery';
import Utils from '../../helpers/Utils';
import Handlebars from 'handlebars-template-loader/runtime';

export default class View {

  constructor(opt) {
    this.opt = opt;
    this.events = this.events || opt.events ? opt.events : {};
    this.template = this.template ? this.template : opt.template ? _.template(opt.template) : null;
    this.eventsRef = [];
    this.initialize(opt);
  }

  initialize(options) {
    if (_.isUndefined(this.template)) {
      return;
    } else {
      registerTemplate.call(this);
      if (this.options.container) this.options.container.append(this.render().el);
      this.delegateEvents();
    }
  }

  static extend(protoProps, staticProps) {
    let parent = this;
    let child;
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function () {
        return parent.apply(this, arguments);
      };
    }
    _.extend(child, parent, staticProps);
    child.prototype = _.create(parent.prototype, protoProps);
    child.prototype.constructor = child;
    child.__super__ = parent.prototype;
    return child;
  }

  delegateEvents() {
    let i, keys = Object.keys(this.events);
    this.cleanEvents();
    for (i = 0; i < keys.length; i++) {
      let arr = keys[i].split(' ');
      this.eventsRef.push($(document).on(arr.shift(), getSelector.call(this, arr), this[this.events[keys[i]]].bind(this)));
    }
    this.customEventDelegation();
  }

  customEventDelegation() {
    // to be extended
  }

  hide() {
    let name = Utils.getBrowser().name;
    if (name === 'IE' || name === 'Edge') {
      /* istanbul ignore next */
      this.$el.wrap('<span>').hide();
    } else {
      this.$el.hide();
    }
  }

  show() {
    this.$el.show();
  }

  cleanEvents() {
    _.map(this.eventsRef, (o) => {
      o.off();
    });
    this.eventsRef = [];
  }

  render() {
    this.beforeRender();
    _render.call(this).afterRender();
    return this;
  }

  beforeRender() {
    // to be extended
  }

  afterRender() {
    // to be extended
  }

  onRender() {
    // to be extended
  }

  remove() {
    this.beforeRemove();
    this.cleanEvents();
    _removeElement.call(this).afterRemove();
    return this;
  }

  beforeRemove() {
    //to be overwritten
  }

  afterRemove() {
    //to be overwritten
  }
}

function getSelector(arr) {
  let selector = '#' + this.options.map.getDiv().id;
  selector += this.componentClass ? ' .' + this.componentClass + ' ' : ' ';
  selector += arr.join(' ');
  return selector;
}

function registerTemplate() {
  /* istanbul ignore next */
  if (!_.isUndefined(this.templatePartials)) {
    for (let partialName in this.templatePartials) {
      if (!this.templatePartials.hasOwnProperty(partialName)) {
        continue;
      }
      Handlebars.default.registerPartial(partialName, this.templatePartials[partialName]);
    }
  }
}

function _render() {
  _setElement.call(this, this.template(this.templateConfig)).$el.addClass(this.componentClass);
  this.onRender();
  return this;
}

function _setElement(el) {
  this.$el = typeof el === 'string' || el instanceof String ? $(el) : el;
  this.el = this.$el[0];
  return this;
}

function _removeElement() {
  this.$el.remove();
  return this;
}
