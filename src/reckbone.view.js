import _ from 'overscore.js';
import $ from 'jquery';
import Handlebars from 'handlebars-template-loader/runtime';

export default class View {

  constructor(opt = {}) {
    this.opt = opt;
    this.componentClass = this.opt.componentClass || this.componentClass || 'without-class';
    this.isChild = this.opt.isChild || this.isChild || false;
    this.events = this.events || (opt.events ? opt.events : {});
    this.template = processTemplate(this.template ? this.template : opt.template ? opt.template : null);
    this.exTemplateConfig = opt.exTemplateConfig || null;
    this.eventsRef = [];
    this.initialize(opt);
  }

  initialize(options) {
    if (!this.template) {
      return;
    } else {
      registerTemplate.call(this);
      if (this.opt.container) this.opt.container.append(this.render().el);
      else if (this.isChild) this.render();
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
    let name = getBrowser().name;
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

function processTemplate(tpl) {
  return typeof tpl === 'string' || tpl instanceof String ?
    _.template(tpl) : tpl;
}

function getSelector(arr) {
  let selector = this.$el && this.$el.parent ? '#' + this.$el.parent.id : '';
  selector += ' .' + this.componentClass + ' ';
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

function _getTemplateConfig() {
  let keys = Object.keys(this.exTemplateConfig);
  let aux = {};
  for (let i = 0; i < keys.length; i++) {
    aux[keys[i]] = this.exTemplateConfig[keys[i]];
  }
  this.templateConfig = _.extend({}, aux);
}

function _render() {
  if (this.exTemplateConfig) {
    _getTemplateConfig.call(this);
  }
  _setElement.call(this, this.template(this.templateConfig)).$el.addClass(this.componentClass);
  this.onRender();
  return this;
}

function _setElement(el) {
  /* istanbul ignore next */
  this.$el = typeof el === 'string' || el instanceof String ? $(el) : el;
  this.el = this.$el[0];
  return this;
}

function _removeElement() {
  this.$el.remove();
  this.el = null;
  return this;
}

/* istanbul ignore next */
function getBrowser() {
  let ua = navigator.userAgent,
    tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return {
      name: 'IE',
      version: (tem[1] || '')
    };
  }
  if (/Edge\/\d./i.test(ua)) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return {
      name: 'Edge',
      version: (tem[1] || '')
    };
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR\/(\d+)/);
    if (tem !== null) {
      return {
        name: 'Opera',
        version: tem[1]
      };
    }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\/(\d+)/i)) !== null) {
    M.splice(1, 1, tem[1]);
  }
  return {
    name: M[0],
    version: M[1]
  };
}
