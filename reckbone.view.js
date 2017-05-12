import _ from 'underscore';
import $ from 'jquery';
import Utils from '../../helpers/Utils';
import Handlebars from 'handlebars-template-loader/runtime';

function getSelector(arr) {
  let selector = '#' + this.options.map.getDiv().id;
  selector += this.componentClass ? ' .' + this.componentClass + ' ' : ' ';
  selector += arr.join(' ');
  return selector;
}

export default class View {

  constructor(options) {
    if (!this.events) {
      this.events = options.events ? options.events : {};
    }
    if (!this.template && options.template) {
      this.template = _.template(options.template);
    }
    this.options = options;
    this.position = options.position || 'TOP_LEFT';
    this.identifier = options.identifier || null;
    this.eventsReference = [];
    this.initialize(options);
  }

  initialize(options) {
    if (_.isUndefined(this.template)) {
      return;
    }
    /* istanbul ignore next */
    if (!_.isUndefined(this.templatePartials)) {
      for (let partialName in this.templatePartials) {
        if (!this.templatePartials.hasOwnProperty(partialName)) {
          continue;
        }
        Handlebars.default.registerPartial(partialName, this.templatePartials[partialName]);
      }
    }
    if (this.options.container) {
      this.options.container.append(this.render().el);
    }
    this.delegateEvents();
  }

  delegateEvents() {
    let i, keys = Object.keys(this.events);
    this.cleanEvents();
    for (i = 0; i < keys.length; i++) {
      let arr = keys[i].split(' '),
        eventTarget = arr.shift(),
        functionTarget = this[this.events[keys[i]]];
      this.eventsReference.push(
        $(document)
        .on(eventTarget, getSelector.call(this, arr), functionTarget
          .bind(this))
      );
    }
    this.customEventDelegation();
  }

  customEventDelegation() {
    // to be overwritten
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
    _.map(this.eventsReference, (o) => {
      o.off();
      return false;
    });
    this.eventsReference = [];
  }

  render() {
    this.beforeRender();
    this.renderInternal();
    this.afterRender();
    return this;
  }

  renderInternal() {
    let classComp = (this.isChild) ? 'component' : 'componentOnMap';
    this.setElement(this.template(this.templateConfig));
    this.$el.addClass(this.componentClass).addClass(Utils.formatCssClass(classComp));
    if (!_.isNull(this.identifier)) {
      this.$el.addClass(Utils.formatCssClass(this.identifier));
    }
    this.onRender();
  }

  beforeRender() {
    // to be overwritten
  }

  afterRender() {
    // to be overwritten
  }

  onRender() {
    // to be overwritten
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

  setElement(el) {
    this.$el = typeof el === 'string' || el instanceof String ? $(el) : el;
    this.el = this.$el[0];
    return this;
  }

  remove() {
    this.beforeRemove();
    this._removeElement();
    this.cleanEvents();
    this.afterRemove();
    return this;
  }

  beforeRemove() {
    //to be overwritten
  }

  afterRemove() {
    //to be overwritten
  }

  _removeElement() {
    this.$el.remove();
  }
}
