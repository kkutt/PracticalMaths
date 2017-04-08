(function() {
  var Component, ComponentType, DefaultProperties, FONT_FAMILY_SET, FONT_SIZE_SET, HEIGHT, Property, PropertyGroup, VISIBLE, WIDTH, bpts, compiled, compiledComponentTemplate, componentTemplate;

  window.EventDispatcher = _.clone(Backbone.Events);

  DefaultProperties = {};

  window.DefaultProperties = DefaultProperties;

  window.DESKTOP = {
    name: "desktop",
    width: 960,
    baseline: 20,
    desktop: true,
    tablet: false,
    phone: false
  };

  window.TABLET = {
    name: "tablet",
    width: 770,
    baseline: 20,
    desktop: false,
    tablet: true,
    phone: false
  };

  window.PHONE = {
    name: "phone",
    width: 320,
    baseline: 20,
    desktop: false,
    tablet: false,
    phone: true
  };

  window.BREAKPOINTS = {
    "desktop": DESKTOP,
    "tablet": TABLET,
    "phone": PHONE
  };

  window.BREAKPOINT = DESKTOP;

  window.CLICK = {
    label: 'click',
    name: 'click',
    event: 'click',
    icon: 'location-arrow',
    conditional: false,
    reversable: false
  };

  window.GROUP_CLICK = {
    label: 'click',
    name: 'group-click',
    event: 'group-click',
    icon: 'location-arrow',
    conditional: false,
    reversable: false
  };

  window.ITEM_CLICK = {
    label: 'item click',
    name: 'item-click',
    event: 'click',
    icon: 'location-arrow',
    conditional: true,
    reversable: false
  };

  window.CUSTOM_EVENT = {
    label: 'custom event',
    name: 'custom-event',
    event: 'custom-event',
    icon: 'bolt',
    conditional: true,
    reversable: false
  };

  window.CHECKED = {
    label: 'checked',
    name: 'checked',
    event: 'checked',
    icon: 'check-square-o',
    conditional: false,
    reversable: false
  };

  window.UNCHECKED = {
    label: 'unchecked',
    name: 'unchecked',
    event: 'unchecked',
    icon: 'square-o',
    conditional: false,
    reversable: false
  };

  window.LIST_CHECKED = {
    label: 'item checked',
    name: 'list-checked',
    event: 'checked',
    icon: 'check-square-o',
    conditional: true,
    reversable: false
  };

  window.LIST_UNCHECKED = {
    label: 'item unchecked',
    name: 'list-unchecked',
    event: 'unchecked',
    icon: 'square-o',
    conditional: true,
    reversable: false
  };

  window.TOGGLE = {
    label: 'selection toggle',
    name: 'toggle',
    event: 'toggle',
    icon: 'refresh',
    conditional: false,
    reversable: false
  };

  window.OPTION = {
    label: 'option selected',
    name: 'option',
    event: 'change',
    icon: 'check-circle-o',
    conditional: true,
    reversable: false
  };

  window.MOUSE_ENTER = {
    label: 'mouse enter',
    name: 'mouse-enter',
    event: 'mouseenter',
    icon: 'hand-o-up',
    conditional: false,
    reversable: true
  };

  window.CHANGE = {
    label: 'change',
    name: 'change',
    event: 'change',
    icon: 'edit',
    conditional: false,
    reversable: false
  };

  window.KEY_ENTER = {
    label: 'key enter',
    name: 'key-enter',
    event: 'key-enter',
    icon: 'level-down fa-rotate-90',
    conditional: false,
    reversable: false
  };

  window.FOCUS_IN = {
    label: 'focus in',
    name: 'focus',
    event: 'focus',
    icon: 'sign-in',
    conditional: false,
    reversable: false
  };

  window.FOCUS_OUT = {
    label: 'focus out',
    name: 'blur',
    event: 'blur',
    icon: 'sign-out',
    conditional: false,
    reversable: false
  };

  window.EVENT = {
    label: 'custom event',
    name: 'event',
    event: 'event',
    icon: 'bolt',
    conditional: false,
    reversable: false
  };

  window.ACT_ON = {
    label: 'custom action',
    name: 'act-on',
    event: 'act-on',
    icon: 'gear',
    conditional: true,
    reversable: false
  };

  window.TRIGGERS = {
    'click': CLICK,
    'group-click': GROUP_CLICK,
    'item-click': ITEM_CLICK,
    'custom-event': CUSTOM_EVENT,
    'mouse-enter': MOUSE_ENTER,
    'event': EVENT,
    'toggle': TOGGLE,
    'checked': CHECKED,
    'unchecked': UNCHECKED,
    'list-checked': LIST_CHECKED,
    'list-unchecked': LIST_UNCHECKED,
    'change': CHANGE,
    'focus': FOCUS_IN,
    'blur': FOCUS_OUT,
    'option': OPTION,
    'key-enter': KEY_ENTER,
    'act-on': ACT_ON
  };

  FONT_FAMILY_SET = {
    set: function(c, value) {
      var font;
      c.properties[this.name] = value;
      if (this.path === '@') {
        c.e.css(this.name, value);
      } else {
        c.e.find(this.path).css(this.name, value);
      }
      font = Font.byId(value);
      if (font == null) {
        return false;
      }
      if (!font.loaded) {
        return font.load();
      }
    }
  };

  FONT_SIZE_SET = {
    set: function(c, value) {
      var key, property, _i, _len, _ref;
      key = '';
      if (c.breakpoint.name !== "desktop") {
        key = c.breakpoint.name + "-" + this.name;
      } else {
        key = this.name;
      }
      c.properties[key] = value;
      if (this.path === '@') {
        c.e.css(this.name, value);
      } else {
        c.e.find(this.path).css(this.name, value);
      }
      if (this.properties) {
        _ref = this.properties;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          property = _ref[_i];
          property.set(c, property.delta(value));
        }
      }
      return value;
    },
    get: function(c) {
      var key, v;
      key = '';
      if (c.breakpoint.name !== "desktop") {
        key = c.breakpoint.name + "-" + this.name;
      } else {
        key = this.name;
      }
      v = c.properties[key];
      if (v == null) {
        v = c.properties[this.name];
      }
      if (v == null) {
        v = this["default"];
      }
      return v;
    },
    getByBreakpoint: function(c, breakpoint) {
      var key, v;
      key = '';
      if (breakpoint.name !== "desktop") {
        key = breakpoint.name + "-" + this.name;
      } else {
        key = this.name;
      }
      v = c.properties[key];
      if (v == null) {
        v = c.properties[this.name];
      }
      if (v == null) {
        v = this["default"];
      }
      return v;
    }
  };

  Property = (function() {
    function Property(path, name) {
      this.path = path != null ? path : '@';
      this.name = name;
      _.extend(this, Backbone.Events);
      this.properties = [];
      this["default"] = DefaultProperties[this.name];
    }

    Property.prototype.delta = function(value) {
      return value;
    };

    Property.prototype.add = function(name, path, extension) {
      var property;
      if (path == null) {
        path = '@';
      }
      property = new Property(path, name);
      if (extension) {
        property = _.extend(property, extension);
      }
      this.properties.push(property);
      return property;
    };

    Property.prototype.set = function(component, value) {
      var oldvalue, property, _i, _len, _ref;
      oldvalue = component.properties[this.name];
      component.properties[this.name] = value;
      if (this.path === '@') {
        component.e.css(this.name, value);
      } else {
        component.e.find(this.path).css(this.name, value);
      }
      if (this.properties) {
        _ref = this.properties;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          property = _ref[_i];
          property.set(component, property.delta(value));
        }
      }
      this.trigger("change", value, oldvalue);
      return this;
    };

    Property.prototype.get = function(component) {
      var v;
      v = component.properties[this.name];
      if (v == null) {
        v = this["default"];
      }
      return v;
    };

    Property.prototype["do"] = function(component) {
      var v;
      v = component.properties[this.name];
      if (!v) {
        v = this["default"];
      }
      return this.set(component, v);
    };

    return Property;

  })();

  window.Property = Property;

  PropertyGroup = (function() {
    function PropertyGroup(properties, components) {
      this.properties = properties;
      this.components = components;
    }

    PropertyGroup.prototype.get = function() {
      var c, i, p, v, value, _i, _len, _ref;
      value = this.properties[0].get(this.components[0]);
      _ref = this.properties;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        p = _ref[i];
        c = this.components[i];
        v = p.get(c);
        if (v !== value) {
          return p["default"];
        }
      }
      return value;
    };

    PropertyGroup.prototype.set = function(value) {
      var c, i, p, _i, _len, _ref;
      _ref = this.properties;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        p = _ref[i];
        c = this.components[i];
        p.set(c, value);
      }
      return this;
    };

    return PropertyGroup;

  })();

  window.PropertyGroup = PropertyGroup;

  window.WIDTH = WIDTH = "width";

  window.HEIGHT = HEIGHT = "height";

  window.VISIBLE = VISIBLE = "visible";

  window.FB_DATA = 'fb-data';

  window.RESIZE_ALL = 1;

  window.RESIZE_HORIZONTAL = 2;

  window.RESIZE_VERTICAL = 3;

  window.RESIZE_NONE = 4;

  window.ComponentsRepository = {};

  ComponentType = (function() {
    ComponentType.setDefaultProperties = function(type, component) {
      var p, _i, _len, _ref, _results;
      component.width(type.width).height(type.height);
      _ref = type.properties;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        _results.push(p.set(component, p["default"]));
      }
      return _results;
    };

    ComponentType.byType = function(type) {
      return ALL_TYPES[type];
    };

    function ComponentType() {
      this.deprecated = false;
      this.rotatable = false;
      this.defaults = {};
      this.properties = [];
      this.propertiez = {};
      this.events = [];
      this.pwidth = this.prop(WIDTH);
      this.pheight = this.prop(HEIGHT);
      this.prop(VISIBLE, "@", {
        set: function(c, value) {
          var v;
          v = ("" + value) === "true";
          c.properties[this.name] = v;
          if ((value == null) || v) {
            return c.show();
          } else {
            return c.hide();
          }
        }
      });
      this.resizePolicy = RESIZE_ALL;
      this.initialize();
    }

    ComponentType.prototype.initialize = function() {};

    ComponentType.prototype.makeHorizontal = function(hget) {
      this.resizePolicy = RESIZE_HORIZONTAL;
      return _.extend(this.pheight, hget, {
        set: function(c, v) {}
      });
    };

    ComponentType.prototype.makeVertical = function(wget) {
      this.resizePolicy = RESIZE_VERTICAL;
      return _.extend(this.pwidth, wget, {
        set: function(c, v) {}
      });
    };

    ComponentType.prototype.makeNonResizable = function(wget, hget) {
      this.resizePolicy = RESIZE_NONE;
      _.extend(this.pwidth, wget, {
        set: function(c, v) {}
      });
      return _.extend(this.pheight, hget, {
        set: function(c, v) {}
      });
    };

    ComponentType.prototype.set = function(type, name, width, height) {
      this.type = type;
      this.name = name;
      this.width = width;
      this.height = height;
    };

    ComponentType.prototype.load = function(data) {
      var k, keys, _i, _len, _results;
      keys = _.keys(data);
      _results = [];
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        k = keys[_i];
        _results.push(this[k] = data[k]);
      }
      return _results;
    };

    ComponentType.prototype.$new = function(definition, page) {
      var component, elm;
      if (definition == null) {
        definition = {
          x: 0,
          y: 0,
          width: this.width,
          height: this.height,
          visible: true
        };
      }
      component = new Component(this, definition, page);
      elm = this.compile(component, definition);
      return component;
    };

    ComponentType.prototype.compile = function(component, definition) {
      var d, elm, info, p, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      elm = $("<div></div>");
      dust.render("" + this.type + "Template", this.defaults, function(err, out) {
        return elm.append(out);
      });
      component.e = elm;
      elm.data(FB_DATA, component);
      component.setBreakpoint(BREAKPOINT);
      component.id = definition.id;
      component.name = definition.name;
      component.visible = definition.visible;
      if (!definition.visible) {
        component.visible = true;
      }
      if ((window.ComponentsRepository != null) && (definition.id != null)) {
        window.ComponentsRepository[definition.id] = component;
      }
      d = {};
      _ref = this.properties;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        d[p.name] = p["default"];
      }
      _.extend(d, component.properties);
      _ref1 = this.properties;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        p = _ref1[_j];
        p.set(component, d[p.name]);
      }
      _ref2 = this.events;
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        info = _ref2[_k];
        this.registerEvent(component, info);
      }
      if (this.type === "group") {
        this.registerEvent(component, {
          trigger: ACT_ON
        });
      }
      component.behaviors.checkBehaviorsMark();
      elm.attr('id', 'c' + component.id);
      return elm;
    };

    ComponentType.prototype.render = function(component) {};

    ComponentType.prototype.registerEvent = function(component, info) {
      var path, _ref, _ref1;
      path = null;
      if ((info.path != null) && info.path !== "@") {
        path = info.path;
      }
      if ((_ref = component.page) != null ? (_ref1 = _ref.project) != null ? _ref1.indesigner : void 0 : void 0) {
        return component.on(info.trigger.event, this.playEvent);
      } else {
        return component.e.on(info.trigger.event, path, function(event) {
          var $this, action, c, customEvent, eventId, eventIds, item, list, stop, trigger, _i, _j, _len, _len1, _ref2, _ref3;
          $this = $(this);
          if ($this.is(".Component")) {
            c = $this.data(FB_DATA);
          } else {
            c = $this.parents(".Component").eq(0).data(FB_DATA);
          }
          if (c == null) {
            return true;
          }
          trigger = info.trigger;
          if (trigger == null) {
            return true;
          }
          eventIds = c.behaviors.getEvents(trigger);
          item = "";
          if (trigger.conditional) {
            if ((trigger.event === CUSTOM_EVENT.event) || (trigger.event === ACT_ON.event)) {
              item = _.trim(event.item);
            } else {
              item = _.trim(c.type.getEventItem(event));
            }
          }
          stop = false;
          debug.debug("Executing event " + trigger.event);
          for (_i = 0, _len = eventIds.length; _i < _len; _i++) {
            eventId = eventIds[_i];
            list = c.behaviors.list(eventId);
            if (list == null) {
              continue;
            }
            if (trigger.conditional && ((item == null) || item.toLowerCase() !== list.type.toLowerCase())) {
              continue;
            }
            _ref2 = list.actions;
            for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
              action = _ref2[_j];
              stop = true;
              action.target = $this;
              action.execute();
            }
          }
          if (stop) {

          } else {
            if (!event.passedon && trigger.conditional && (((_ref3 = c.parent) != null ? _ref3.e : void 0) != null)) {
              customEvent = jQuery.Event(CUSTOM_EVENT.event);
              customEvent.item = item;
              customEvent.passedon = true;
              c.parent.e.trigger(customEvent);
            }
          }
          return !stop;
        });
      }
    };

    ComponentType.prototype.playEvent = function(event) {
      var action, c, customEvent, eventId, eventIds, item, kind, list, stop, trigger, _i, _j, _len, _len1, _ref;
      c = event.target;
      if (c == null) {
        return true;
      }
      trigger = event.trigger;
      if (trigger == null) {
        return true;
      }
      eventIds = c.behaviors.getEvents(trigger);
      item = "";
      kind = event.kind;
      if (trigger.conditional) {
        if ((trigger.event === CUSTOM_EVENT.event) || (trigger.event === ACT_ON.event)) {
          item = _.trim(event.item);
        } else {
          item = _.trim(c.type.getEventItem(event));
        }
      }
      stop = false;
      debug.debug("" + kind + "ing event " + trigger.event);
      for (_i = 0, _len = eventIds.length; _i < _len; _i++) {
        eventId = eventIds[_i];
        list = c.behaviors.list(eventId);
        if (list == null) {
          continue;
        }
        if (trigger.conditional && ((item == null) || item.toLowerCase() !== list.type.toLowerCase())) {
          continue;
        }
        _ref = list.actions;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          action = _ref[_j];
          stop = true;
          action.target = c;
          if (kind === 'play') {
            action.play();
          } else if (kind === 'reset') {
            action.reset();
          }
        }
      }
      if (stop) {

      } else {
        if (!event.passedon && trigger.conditional && (c.parent != null)) {
          customEvent = jQuery.Event(CUSTOM_EVENT.event);
          customEvent.item = item;
          customEvent.kind = kind;
          customEvent.passedon = true;
          customEvent.target = c.parent;
          c.parent.trigger(trigger.event, customEvent);
        }
      }
      return !stop;
    };

    ComponentType.prototype.prop = function(name, path, extension) {
      var property;
      if (path == null) {
        path = '@';
      }
      if (this.propertiez[name]) {
        property = this.propertiez[name];
      } else {
        property = new Property(path, name);
        this.propertiez[name] = property;
        this.properties.push(property);
        if (this.defaults[name]) {
          property["default"] = this.defaults[name];
        }
      }
      property.path = path;
      if (name === FONT_SIZE) {
        extension = FONT_SIZE_SET;
      }
      if (extension) {
        property = _.extend(property, extension);
      }
      return property;
    };

    ComponentType.prototype.props = function() {
      var name, path, props, ps, _i, _len;
      ps = _.flatten(arguments[0]);
      path = arguments[1];
      if (path == null) {
        path = "@";
      }
      props = [];
      for (_i = 0, _len = ps.length; _i < _len; _i++) {
        name = ps[_i];
        props.push(this.prop(name, path, arguments[2]));
      }
      return props;
    };

    ComponentType.prototype.get = function(name) {
      return this.propertiez[name];
    };

    ComponentType.prototype.getDataItemAt = function(component, item) {
      return "[item]";
    };

    ComponentType.prototype.getEventItem = function(event) {};

    ComponentType.prototype.addOverlay = function(name, translator) {
      if (this.overlays == null) {
        this.overlays = {};
      }
      return this.overlays[name] = translator;
    };

    ComponentType.prototype.isTextEditable = function() {
      return false;
    };

    ComponentType.prototype.getEditableText = function() {
      return "";
    };

    ComponentType.prototype.enhance = function(component, container) {};

    ComponentType.prototype.rotate = function(component, direction) {};

    return ComponentType;

  })();

  window.ComponentType = ComponentType;

  bpts = ["desktop", "tablet", "phone"];

  Component = (function() {
    function Component(type, definition, page) {
      var behaviormap, bp, d, _i, _len, _ref, _ref1;
      this.type = type;
      this.definition = definition;
      this.page = page;
      _.extend(this, Backbone.Events);
      _.bindAll(this);
      if (!this.definition) {
        this.definition = {
          definition: {},
          desktop: {},
          tablet: {},
          phone: {}
        };
      }
      this.definition.type = this.type.type;
      _ref = [parseInt(this.definition.x), parseInt(this.definition.y), parseInt(this.definition.width), parseInt(this.definition.height)], this.definition.x = _ref[0], this.definition.y = _ref[1], this.definition.width = _ref[2], this.definition.height = _ref[3];
      for (_i = 0, _len = bpts.length; _i < _len; _i++) {
        bp = bpts[_i];
        d = this.definition[bp];
        if (d == null) {
          d = this.definition[bp] = {
            x: this.definition.x,
            y: this.definition.y,
            width: this.definition.width,
            height: this.definition.height,
            visible: true
          };
        }
        _ref1 = [parseInt(d.x), parseInt(d.y), parseInt(d.width), parseInt(d.height)], d.x = _ref1[0], d.y = _ref1[1], d.width = _ref1[2], d.height = _ref1[3];
      }
      this.properties = this.definition.definition;
      if (!this.properties) {
        this.definition.definition = this.properties = {};
      }
      behaviormap = this.definition.behaviors;
      if (!behaviormap) {
        behaviormap = [];
      }
      this.behaviors = new BehaviorsMap(this, behaviormap);
    }

    Component.prototype.drop = function(x, y, breakpoint) {
      var b, bp, _i, _len;
      this.breakpoint = breakpoint;
      this.move(x, y);
      this.measure();
      for (_i = 0, _len = bpts.length; _i < _len; _i++) {
        bp = bpts[_i];
        b = BREAKPOINTS[bp];
        this.setBreakpointSize(b, this.x, this.y, this.width, this.height);
        if (bp !== this.breakpoint.name) {
          this.definition[bp].virgin = true;
        }
      }
      return this;
    };

    Component.prototype.resize = function(x, y, width, height, trigger) {
      var bp, d, _i, _len, _ref;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      if (trigger == null) {
        trigger = true;
      }
      if (this.page.project.indesigner) {
        d = this.definition[this.breakpoint.name];
        d.x = this.x = Math.round(this.x);
        d.y = this.y = Math.round(this.y);
        d.width = this.width = Math.round(this.width);
        d.height = this.height = Math.round(this.height);
        d.virgin = false;
        for (_i = 0, _len = bpts.length; _i < _len; _i++) {
          bp = bpts[_i];
          d = this.definition[bp];
          if (d.virgin) {
            _ref = [x, y, width, height], d.x = _ref[0], d.y = _ref[1], d.width = _ref[2], d.height = _ref[3];
          }
        }
      }
      this._resize();
      if (trigger) {
        this.trigger("resize");
      }
      return "";
    };

    Component.prototype._resize = function() {
      this.e.css({
        left: this.x,
        top: this.y
      });
      this.type.pwidth.set(this, _px(this.width));
      return this.type.pheight.set(this, _px(this.height));
    };

    Component.prototype.measure = function() {
      this.width = _npx(this.type.pwidth.get(this));
      this.height = _npx(this.type.pheight.get(this));
      this.setBreakpointSize(this.breakpoint, this.x, this.y, this.width, this.height);
      if (this.cover != null) {
        this.cover.width = this.width;
        this.cover.height = this.height;
        return this.trigger("resize");
      }
    };

    Component.prototype.setBreakpoint = function(breakpoint) {
      var d, key, pfontsize;
      this.breakpoint = breakpoint;
      if (this.breakpoint.desktop) {
        d = this.definition.desktop;
      } else if (this.breakpoint.tablet) {
        d = this.definition.tablet;
      } else if (this.breakpoint.phone) {
        d = this.definition.phone;
      }
      this.x = parseInt(d.x);
      this.y = parseInt(d.y);
      this.width = parseInt(d.width);
      this.height = parseInt(d.height);
      pfontsize = this.type.get(FONT_SIZE);
      if (pfontsize) {
        key = '';
        if (this.breakpoint.name !== "desktop") {
          key = this.breakpoint.name + "-" + FONT_SIZE;
        } else {
          key = FONT_SIZE;
        }
        if (this.properties[key]) {
          pfontsize.set(this, this.properties[key]);
        }
      }
      return this._resize();
    };

    Component.prototype.setBreakpointSize = function(breakpoint, x, y, width, height) {
      var d;
      d = this.definition[breakpoint.name];
      if (d == null) {
        d = this.definition[breakpoint.name] = {};
      }
      d.x = x;
      d.y = y;
      d.width = width;
      d.height = height;
      return this;
    };

    Component.prototype.setBreakpointVisibility = function(breakpoint, visible) {
      var d;
      d = this.definition[breakpoint.name];
      d.visible = visible;
      return this;
    };

    Component.prototype.getBreakpointVisibility = function(breakpoint) {
      var d;
      d = this.definition[breakpoint.name];
      if (d.visible == null) {
        d.visible = true;
      }
      return d.visible;
    };

    Component.prototype.move = function(x, y) {
      var bp, d, _i, _len, _ref;
      if (this.page.project.indesigner) {
        if (this.breakpoint.desktop) {
          d = this.definition.desktop;
        } else if (this.breakpoint.tablet) {
          d = this.definition.tablet;
        } else if (this.breakpoint.phone) {
          d = this.definition.phone;
        }
        d.x = x;
        d.y = y;
        d.virgin = false;
        for (_i = 0, _len = bpts.length; _i < _len; _i++) {
          bp = bpts[_i];
          d = this.definition[bp];
          if (d.virgin) {
            _ref = [x, y], d.x = _ref[0], d.y = _ref[1];
          }
        }
      }
      this.x = x;
      this.y = y;
      this.e.css({
        left: this.x,
        top: this.y
      });
      return this.trigger("move");
    };

    Component.prototype.resizePolicy = function() {
      return this.type.resizePolicy;
    };

    Component.prototype.save = function(guid, callback) {
      var data,
        _this = this;
      data = {
        type: this.type.type,
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        page: this.page.id
      };
      if (this.parent.id !== this.page.id) {
        data.group = this.parent.id;
      }
      this.guid = data.guid = guid;
      return this.page.project.server.post(ACTION_ADD, data).done(function(data) {
        _this.setId(data.id);
        if (_.isFunction(callback)) {
          return callback(data);
        }
      });
    };

    Component.prototype.setId = function(id) {
      this.id = id;
      this.definition.id = this.id;
      this.e.attr("id", "c" + this.id);
      this._updateCss();
      if (this.cover != null) {
        this.cover.id = this.id;
        return this.page.project.repository[this.id] = this.cover;
      }
    };

    Component.prototype["delete"] = function() {
      var index;
      this.e.remove();
      index = this.parent.components.indexOf(this);
      if (index > -1) {
        this.parent.components.splice(index, 1);
      }
      return this;
    };

    Component.prototype.clone = function(page, target) {
      var c, cc, copy, d, def, p, _i, _j, _len, _len1, _ref, _ref1;
      def = _.clone(this.definition);
      def.definition = _.extend(_.clone(this.definition.definition), this.properties);
      delete def.id;
      d = _.clone(this.definition.phone);
      def.phone = {
        x: parseInt(d.x),
        y: parseInt(d.y),
        width: parseInt(d.width),
        height: parseInt(d.height),
        virgin: d.virgin
      };
      d = _.clone(this.definition.tablet);
      def.tablet = {
        x: parseInt(d.x),
        y: parseInt(d.y),
        width: parseInt(d.width),
        height: parseInt(d.height),
        virgin: d.virgin
      };
      d = _.clone(this.definition.desktop);
      def.desktop = {
        x: parseInt(d.x),
        y: parseInt(d.y),
        width: parseInt(d.width),
        height: parseInt(d.height),
        virgin: d.virgin
      };
      if (this.behaviors != null) {
        def.behaviors = this.behaviors.clone();
      } else {
        def.behaviors = [];
      }
      def.components = [];
      copy = page.$new(this.type.type, def, target.container);
      if (this.type.type === "group") {
        _ref = this.components;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          cc = c.clone(page, copy);
          copy.add(cc);
        }
        copy.computeSize();
      }
      copy.oldId = this.id;
      _ref1 = this.type.properties;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        p = _ref1[_j];
        copy.set(p.name, p.get(this));
      }
      copy.resize(this.x, this.y, this.width, this.height);
      return copy;
    };

    Component.prototype.stackUp = function(tofront) {
      var i;
      i = this.parent.components.indexOf(this);
      if (i === this.parent.components.length - 1) {
        return this;
      }
      this.parent.components.splice(i, 1);
      if (tofront || (i === this.parent.components.length)) {
        this.e.insertAfter(this.e.parent().children().last());
        this.parent.components.push(this);
      } else {
        this.e.insertAfter(this.e.next());
        this.parent.components.splice(i + 1, 0, this);
      }
      return this;
    };

    Component.prototype.stackDown = function(toback) {
      var i;
      i = this.parent.components.indexOf(this);
      if (i === 0) {
        return this;
      }
      this.parent.components.splice(i, 1);
      if (toback) {
        this.e.insertBefore(this.e.parent().children().first());
        this.parent.components.splice(0, 0, this);
      } else {
        this.e.insertBefore(this.e.prev());
        this.parent.components.splice(i - 1, 0, this);
      }
      return this;
    };

    Component.prototype.stackMove = function(position) {
      var components, i;
      components = this.parent.components;
      i = components.indexOf(this);
      if (i === position || position >= components.length) {
        return this;
      }
      components.splice(i, 1);
      if (i < position) {
        this.e.insertAfter(components[position - 1].e);
        components.splice(position, 0, this);
      } else {
        this.e.insertBefore(components[position].e);
        components.splice(position, 0, this);
      }
      return this;
    };

    Component.prototype.get = function(name) {
      var p;
      p = this.type.get(name);
      if (p != null) {
        return p.get(this);
      } else {
        return null;
      }
    };

    Component.prototype.set = function(name, value) {
      var p;
      p = this.type.get(name);
      if (p != null) {
        return p.set(this, value);
      }
    };

    Component.prototype.show = function() {
      this.e.removeClass("visibility-hide").addClass("visibility-show");
      this.visible = true;
      return this.trigger("show");
    };

    Component.prototype.hide = function(half) {
      if (half == null) {
        half = false;
      }
      this.e.removeClass("visibility-show").addClass("visibility-hide");
      this.visible = false;
      if (!half) {
        return this.trigger("hide");
      }
    };

    Component.prototype.toggle = function(half) {
      if (half == null) {
        half = false;
      }
      if (this.visible) {
        return this.hide(half);
      } else {
        return this.show();
      }
    };

    Component.prototype.css = function(rule, property, value) {
      var properties;
      if (this.style == null) {
        this.style = {};
      }
      properties = this.style[rule];
      if (properties == null) {
        properties = this.style[rule] = {};
      }
      properties[property] = value;
      return this._updateCss();
    };

    Component.prototype._updateCss = function() {
      var p, properties, rule, styleCode, v, _ref;
      styleCode = "";
      _ref = this.style;
      for (rule in _ref) {
        properties = _ref[rule];
        if (rule.charAt(0) === ":") {
          styleCode += "#c" + this.id + rule + " {";
        } else {
          styleCode += "#c" + this.id + " " + rule + " {";
        }
        for (p in properties) {
          v = properties[p];
          styleCode += "" + p + ": " + v + ";";
        }
        styleCode += "}";
      }
      this.e.children("style").remove();
      return this.e.prepend("<style>" + styleCode + "</style>");
    };

    Component.prototype.setAll = function() {
      var p, _i, _len, _ref, _results;
      _ref = this.type.properties;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        if (!(p.name === WIDTH || p.name === HEIGHT) && p.path !== NON_VISUAL) {
          _results.push(p["do"](this));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return Component;

  })();

  window.Component = Component;

  compiled = dust.compile("<div class=\"vlabel\"><span>{.|s}</span></div>", "vlabel");

  dust.loadSource(compiled);

  componentTemplate = "<!doctype html>\n<html lang=\"en\" style=\"height:100%\">\n<head>\n<link href=\"http://fonts.googleapis.com/css?family=Open+Sans:400,700&amp;subset=latin-ext\" rel=\"stylesheet\" type=\"text/css\">\n<link rel=\"stylesheet\" type=\"text/css\" href=\"" + window.CDN + "/css/flairbuilder-vendor-" + window.VERSION + ".css\">\n<link rel=\"stylesheet\" type=\"text/css\" href=\"" + window.CDN + "/css/flairbuilder-viewer-" + window.VERSION + ".css\">\n\n</head>\n<body style=\"margin:0;padding:0;background:transparent;overflow:hidden;\" class=\"palettedragndrop\">\n<script type=\"text/javascript\">\nwindow.production = " + window.production + ";\nwindow.development = " + window.development + ";\nwindow.VERSION = \"" + window.VERSION + "\";\nwindow.CDN = \"" + window.CDN + "\";\n</script>\n<script type=\"text/javascript\" src=\"" + window.CDN + "/flairbuilder-vendor-" + window.VERSION + ".min.js\" " + window.ANONYMOUS + "></script>\n<script type=\"text/javascript\" src=\"" + window.CDN + "/flairbuilder-" + window.VERSION + ".js\" " + window.ANONYMOUS + "></script>\n<script type=\"text/javascript\">\n{~n}{~n}\nvar component = ComponentType.byType(\"{type}\");\nvar c = component.$new({width: component.width, height: component.height, definition : {}}); /* This is the simplest definition possible. */\nc.e.addClass(\"{type} Component\");\n$(\"body\").append(c.e);\n\n</script>\n</body>\n</html>";

  compiledComponentTemplate = dust.compile(componentTemplate, "componentTemplate");

  dust.loadSource(compiledComponentTemplate);

}).call(this);
;(function() {
  var AbstractCanvasComponent, AbstractSVGComponent, Accordion, BACKGROUND_COLOR, BORDER_COLOR, BORDER_RADIUS, BORDER_RADIUS_TRANSLATOR, BORDER_STYLE, BORDER_WIDTH, BarChart, BreadCrumbs, Button, ButtonBar, C0, COLOR, CheckBox, CheckBoxList, ComboBox, ComponentGroup, DATA, DATAGRID_COLUMN_TRANSLATOR, DIRECTION, DONUT_TRANSLATOR, DataGrid, DateChooser, DateField, Ellipse, FONT_ALIGN, FONT_AWESOME_ICONS, FONT_BOLD, FONT_FAMILY, FONT_ITALIC, FONT_SIZE, FONT_UNDERLINE, Group, HSLICE_TRANSLATOR, ICON, ICON_PICKER, IONICONS_ICONS, IPHONE_CHECK_TRANSLATOR, IPhoneCheckBox, IPhonePointyButton, Icon, IconPicker, Image, ItemEditorCover, ItemsComponent, LABEL, LINE_HEIGHT, LINE_HEIGHT_TRANSLATOR, LINK, Label, LineChart, LineHorizontal, LineVertical, Link, LinkBar, List, ListGroup, NumericStepper, PINNED, PLACEHOLDER, POPOVER_DIRECTIONS, Paragraph, PasswordInput, PieChart, PopOver, Progress, RadioButtons, Rectangle, SOURCE, SVG0, Search, ShapeType, Slider, TextArea, TextBlock, TextInput, TextType, Title, Tree, VLABEL_PATH, VLABEL_SET, VSLICE_TRANSLATOR, bpts, browser, register, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref2, _ref20, _ref21, _ref22, _ref23, _ref24, _ref25, _ref26, _ref27, _ref28, _ref29, _ref3, _ref30, _ref31, _ref32, _ref33, _ref34, _ref35, _ref36, _ref37, _ref38, _ref39, _ref4, _ref40, _ref41, _ref42, _ref43, _ref44, _ref5, _ref6, _ref7, _ref8, _ref9,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.COLOR = COLOR = "color";

  window.FONT_SIZE = FONT_SIZE = "font-size";

  window.FONT_FAMILY = FONT_FAMILY = "font-family";

  window.FONT_ITALIC = FONT_ITALIC = "font-style";

  window.FONT_BOLD = FONT_BOLD = "font-weight";

  window.FONT_UNDERLINE = FONT_UNDERLINE = "text-decoration";

  window.FONT_ALIGN = FONT_ALIGN = "text-align";

  window.LINE_HEIGHT = LINE_HEIGHT = "line-height";

  window.FONT_STYLING = [COLOR, FONT_SIZE, FONT_FAMILY, FONT_ITALIC, FONT_BOLD, FONT_UNDERLINE, FONT_ALIGN];

  window.FONT = [COLOR, FONT_SIZE, FONT_FAMILY, FONT_ITALIC, FONT_BOLD, FONT_UNDERLINE, FONT_ALIGN, LINE_HEIGHT];

  window.BORDER_COLOR = BORDER_COLOR = "border-color";

  window.BORDER_STYLE = BORDER_STYLE = "border-style";

  window.BORDER_WIDTH = BORDER_WIDTH = "border-width";

  window.BORDER_RADIUS = BORDER_RADIUS = "border-radius";

  window.BORDER = [BORDER_COLOR, BORDER_STYLE, BORDER_WIDTH, BORDER_RADIUS];

  window.BACKGROUND_COLOR = BACKGROUND_COLOR = "background-color";

  window.LINK = LINK = "link";

  window.DATA = DATA = "data";

  window.SOURCE = SOURCE = "src";

  window.PINNED = PINNED = "pinned";

  window.DIRECTION = DIRECTION = "direction";

  window.NON_VISUAL = "#";

  VLABEL_PATH = ".vlabel span";

  VLABEL_SET = {
    set: function(c, value) {
      c.properties[this.name] = value;
      return c.e.find(this.path).html(value);
    }
  };

  window.LABEL = LABEL = "label";

  window.PLACEHOLDER = PLACEHOLDER = "placeholder";

  BORDER_RADIUS_TRANSLATOR = {
    recompute: false,
    getRange: function(c, r) {
      return r.maxx = Math.floor(Math.min(c.width, c.height) / 2);
    },
    toPosition: function(v, p) {
      return p.x = v;
    },
    toValue: function(p, c) {
      return p.x;
    }
  };

  LINE_HEIGHT_TRANSLATOR = {
    recompute: true,
    getRange: function(c, r) {
      return r.maxy = 72;
    },
    toPosition: function(v, p, c) {
      return p.y = v;
    },
    toValue: function(p, c) {
      return p.y;
    }
  };

  DefaultProperties[BACKGROUND_COLOR] = "#fff";

  DefaultProperties[BORDER_COLOR] = "#6A6A6A";

  DefaultProperties[BORDER_STYLE] = "solid";

  DefaultProperties[BORDER_WIDTH] = "1px";

  DefaultProperties[BORDER_RADIUS] = "0px";

  DefaultProperties[BACKGROUND_COLOR] = "#ffffff";

  DefaultProperties[VISIBLE] = true;

  DefaultProperties[LABEL] = "Label";

  DefaultProperties[COLOR] = "#6A6A6A";

  DefaultProperties[FONT_SIZE] = "13px";

  DefaultProperties[LINE_HEIGHT] = "20px";

  DefaultProperties[FONT_FAMILY] = "Open Sans";

  DefaultProperties[FONT_ITALIC] = "normal";

  DefaultProperties[FONT_BOLD] = "normal";

  DefaultProperties[FONT_UNDERLINE] = "none";

  DefaultProperties[FONT_ALIGN] = "left";

  window.ALL_COMPONENTS = [];

  window.ALL_TYPES = {};

  register = function(component) {
    var compiled;
    ALL_COMPONENTS.push(component);
    ALL_TYPES[component.type] = component;
    compiled = dust.compile(component.template, "" + component.type + "Template");
    dust.loadSource(compiled);
    return _.bindAll(component.defaults);
  };

  window._$ = function(label) {
    return label;
  };

  window._px = function(val, min, max) {
    if (min == null) {
      min = 100000;
    }
    if (max == null) {
      max = -10000;
    }
    return Math.min(Math.max(parseFloat((val + "").replace("px", "")), max), min) + "px";
  };

  window._npx = function(val) {
    return parseInt((val + "").replace("px", ""));
  };

  window._npc = function(val) {
    return parseInt((val + "").replace("%", ""));
  };

  window._pc = function(val, min, max) {
    if (min == null) {
      min = 0;
    }
    if (max == null) {
      max = 100;
    }
    return Math.max(Math.min(parseFloat((val + "").replace("%", "")), max), min) + "%";
  };

  window._label = function(value) {
    var v;
    v = markdown.toHTML(value);
    v = v.substring(3, v.length - 4);
    v = v.replace(/\{([a-z|\-]*)\}/g, "<i class=\"fa fa-$1\"></i>");
    return v;
  };

  window.s4 = function() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  };

  window.guid = function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  };

  window.eventLocal = function(event) {
    var o;
    if (event.offsetX) {
      return {
        x: event.offsetX,
        y: event.offsetY
      };
    } else {
      o = $(event.target).offset();
      return {
        x: event.clientX - o.left,
        y: event.clientY - o.top
      };
    }
  };

  window.Color = net.brehaut.Color;

  browser = {};

  browser.mozilla = navigator.userAgent.match(/mozilla/i);

  browser.webkit = navigator.userAgent.match(/webkit/i);

  browser.ie = !browser.webkit && !browser.mozilla;

  if (browser.mozilla) {
    browser.prefix = '-moz-';
  }

  if (browser.webkit) {
    browser.prefix = '-webkit-';
  }

  if (browser.ie) {
    browser.prefix = '-ms-';
  }

  jQuery.fn.prefixcss = function(prop, value) {
    return this.each(function() {
      $(this).css(prop, browser.prefix + value);
      return self;
    });
  };

  jQuery.fn.watch = function(id, fn) {
    return this.each(function() {
      var fd, oldVal, self;
      self = this;
      oldVal = self[id];
      fd = setInterval(function() {
        if (self[id] !== oldVal) {
          fn.call(self, id, oldVal, self[id]);
          return oldVal = self[id];
        }
      }, 100);
      $(self).data('watch_timer', fd);
      return self;
    });
  };

  jQuery.fn.unwatch = function(id) {
    return this.each(function() {
      return clearInterval($(this).data('watch_timer'));
    });
  };

  jQuery.fn.insertAt = function(element, index) {
    var lastIndex, self;
    self = this;
    lastIndex = this.children().size();
    if (index < 0) {
      index = Math.max(0, lastIndex + 1 + index);
    }
    this.append(element);
    if (index < lastIndex) {
      this.children().eq(index).before(this.children().last());
    }
    return self;
  };

  FONT_AWESOME_ICONS = ["fa-glass", "fa-music", "fa-search", "fa-envelope-o", "fa-heart", "fa-star", "fa-star-o", "fa-user", "fa-film", "fa-th-large", "fa-th", "fa-th-list", "fa-check", "fa-times", "fa-search-plus", "fa-search-minus", "fa-power-off", "fa-signal", "fa-cog", "fa-trash-o", "fa-home", "fa-file-o", "fa-clock-o", "fa-road", "fa-download", "fa-arrow-circle-o-down", "fa-arrow-circle-o-up", "fa-inbox", "fa-play-circle-o", "fa-repeat", "fa-refresh", "fa-list-alt", "fa-lock", "fa-flag", "fa-headphones", "fa-volume-off", "fa-volume-down", "fa-volume-up", "fa-qrcode", "fa-barcode", "fa-tag", "fa-tags", "fa-book", "fa-bookmark", "fa-print", "fa-camera", "fa-font", "fa-bold", "fa-italic", "fa-text-height", "fa-text-width", "fa-align-left", "fa-align-center", "fa-align-right", "fa-align-justify", "fa-list", "fa-outdent", "fa-indent", "fa-video-camera", "fa-picture-o", "fa-pencil", "fa-map-marker", "fa-adjust", "fa-tint", "fa-pencil-square-o", "fa-share-square-o", "fa-check-square-o", "fa-move", "fa-step-backward", "fa-fast-backward", "fa-backward", "fa-play", "fa-pause", "fa-stop", "fa-forward", "fa-fast-forward", "fa-step-forward", "fa-eject", "fa-chevron-left", "fa-chevron-right", "fa-plus-circle", "fa-minus-circle", "fa-times-circle", "fa-check-circle", "fa-question-circle", "fa-info-circle", "fa-crosshairs", "fa-times-circle-o", "fa-check-circle-o", "fa-ban", "fa-arrow-left", "fa-arrow-right", "fa-arrow-up", "fa-arrow-down", "fa-share", "fa-resize-full", "fa-resize-small", "fa-plus", "fa-minus", "fa-asterisk", "fa-exclamation-circle", "fa-gift", "fa-leaf", "fa-fire", "fa-eye", "fa-eye-slash", "fa-exclamation-triangle", "fa-plane", "fa-calendar", "fa-random", "fa-comment", "fa-magnet", "fa-chevron-up", "fa-chevron-down", "fa-retweet", "fa-shopping-cart", "fa-folder", "fa-folder-open", "fa-resize-vertical", "fa-resize-horizontal", "fa-bar-chart-o", "fa-twitter-square", "fa-facebook-square", "fa-camera-retro", "fa-key", "fa-cogs", "fa-comments", "fa-thumbs-o-up", "fa-thumbs-o-down", "fa-star-half", "fa-heart-o", "fa-sign-out", "fa-linkedin-square", "fa-thumb-tack", "fa-external-link", "fa-sign-in", "fa-trophy", "fa-github-square", "fa-upload", "fa-lemon-o", "fa-phone", "fa-square-o", "fa-bookmark-o", "fa-phone-square", "fa-twitter", "fa-facebook", "fa-github", "fa-unlock", "fa-credit-card", "fa-rss", "fa-hdd-o", "fa-bullhorn", "fa-bell", "fa-certificate", "fa-hand-o-right", "fa-hand-o-left", "fa-hand-o-up", "fa-hand-o-down", "fa-arrow-circle-left", "fa-arrow-circle-right", "fa-arrow-circle-up", "fa-arrow-circle-down", "fa-globe", "fa-wrench", "fa-tasks", "fa-filter", "fa-briefcase", "fa-fullscreen", "fa-group", "fa-link", "fa-cloud", "fa-flask", "fa-scissors", "fa-files-o", "fa-paperclip", "fa-floppy-o", "fa-square", "fa-reorder", "fa-list-ul", "fa-list-ol", "fa-strikethrough", "fa-underline", "fa-table", "fa-magic", "fa-truck", "fa-pinterest", "fa-pinterest-square", "fa-google-plus-square", "fa-google-plus", "fa-money", "fa-caret-down", "fa-caret-up", "fa-caret-left", "fa-caret-right", "fa-columns", "fa-sort", "fa-sort-asc", "fa-sort-desc", "fa-envelope", "fa-linkedin", "fa-undo", "fa-gavel", "fa-tachometer", "fa-comment-o", "fa-comments-o", "fa-bolt", "fa-sitemap", "fa-umbrella", "fa-clipboard", "fa-lightbulb-o", "fa-exchange", "fa-cloud-download", "fa-cloud-upload", "fa-user-md", "fa-stethoscope", "fa-suitcase", "fa-bell-o", "fa-coffee", "fa-cutlery", "fa-file-text-o", "fa-building", "fa-hospital", "fa-ambulance", "fa-medkit", "fa-fighter-jet", "fa-beer", "fa-h-square", "fa-plus-square", "fa-angle-double-left", "fa-angle-double-right", "fa-angle-double-up", "fa-angle-double-down", "fa-angle-left", "fa-angle-right", "fa-angle-up", "fa-angle-down", "fa-desktop", "fa-laptop", "fa-tablet", "fa-mobile", "fa-circle-o", "fa-quote-left", "fa-quote-right", "fa-spinner", "fa-circle", "fa-reply", "fa-github-alt", "fa-folder-o", "fa-folder-open-o", "fa-expand-o", "fa-collapse-o", "fa-smile-o", "fa-frown-o", "fa-meh-o", "fa-gamepad", "fa-keyboard-o", "fa-flag-o", "fa-flag-checkered", "fa-terminal", "fa-code", "fa-reply-all", "fa-mail-reply-all", "fa-star-half-o", "fa-location-arrow", "fa-crop", "fa-code-fork", "fa-chain-broken", "fa-question", "fa-info", "fa-exclamation", "fa-superscript", "fa-subscript", "fa-eraser", "fa-puzzle-piece", "fa-microphone", "fa-microphone-slash", "fa-shield", "fa-calendar-o", "fa-fire-extinguisher", "fa-rocket", "fa-maxcdn", "fa-chevron-circle-left", "fa-chevron-circle-right", "fa-chevron-circle-up", "fa-chevron-circle-down", "fa-html5", "fa-css3", "fa-anchor", "fa-unlock-o", "fa-bullseye", "fa-ellipsis-horizontal", "fa-ellipsis-vertical", "fa-rss-square", "fa-play-circle", "fa-ticket", "fa-minus-square", "fa-minus-square-o", "fa-level-up", "fa-level-down", "fa-check-square", "fa-pencil-square", "fa-external-link-square", "fa-share-square", "fa-compass", "fa-caret-square-o-down", "fa-caret-square-o-up", "fa-caret-square-o-right", "fa-eur", "fa-gbp", "fa-usd", "fa-inr", "fa-jpy", "fa-rub", "fa-krw", "fa-btc", "fa-file", "fa-file-text", "fa-sort-alpha-asc", "fa-sort-alpha-desc", "fa-sort-amount-asc", "fa-sort-amount-desc", "fa-sort-numeric-asc", "fa-sort-numeric-desc", "fa-thumbs-up", "fa-thumbs-down", "fa-youtube-square", "fa-youtube", "fa-xing", "fa-xing-square", "fa-youtube-play", "fa-dropbox", "fa-stack-overflow", "fa-instagram", "fa-flickr", "fa-adn", "fa-bitbucket", "fa-bitbucket-square", "fa-tumblr", "fa-tumblr-square", "fa-long-arrow-down", "fa-long-arrow-up", "fa-long-arrow-left", "fa-long-arrow-right", "fa-apple", "fa-windows", "fa-android", "fa-linux", "fa-dribbble", "fa-skype", "fa-foursquare", "fa-trello", "fa-female", "fa-male", "fa-gittip", "fa-sun-o", "fa-moon-o", "fa-archive", "fa-bug", "fa-vk", "fa-weibo", "fa-renren", "fa-pagelines", "fa-stack-exchange", "fa-arrow-circle-o-right", "fa-arrow-circle-o-left", "fa-caret-square-o-left", "fa-dot-circle-o", "fa-wheelchair", "fa-vimeo-square", "fa-try"];

  IONICONS_ICONS = ["alert", "alert-circled", "android-add", "android-add-contact", "android-alarm", "android-archive", "android-arrow-back", "android-arrow-down-left", "android-arrow-down-right", "android-arrow-up-left", "android-arrow-up-right", "android-battery", "android-book", "android-calendar", "android-call", "android-camera", "android-chat", "android-checkmark", "android-clock", "android-close", "android-contact", "android-contacts", "android-data", "android-developer", "android-display", "android-download", "android-dropdown", "android-earth", "android-folder", "android-forums", "android-friends", "android-hand", "android-image", "android-inbox", "android-information", "android-keypad", "android-lightbulb", "android-locate", "android-location", "android-mail", "android-microphone", "android-mixer", "android-more", "android-note", "android-playstore", "android-printer", "android-promotion", "android-reminder", "android-remove", "android-search", "android-send", "android-settings", "android-share", "android-social", "android-social-user", "android-sort", "android-star", "android-stopwatch", "android-storage", "android-system-back", "android-system-home", "android-system-windows", "android-timer", "android-trash", "android-volume", "android-wifi", "archive", "arrow-down-a", "arrow-down-b", "arrow-down-c", "arrow-expand", "arrow-graph-down-left", "arrow-graph-down-right", "arrow-graph-up-left", "arrow-graph-up-right", "arrow-left-a", "arrow-left-b", "arrow-left-c", "arrow-move", "arrow-resize", "arrow-return-left", "arrow-return-right", "arrow-right-a", "arrow-right-b", "arrow-right-c", "arrow-shrink", "arrow-swap", "arrow-up-a", "arrow-up-b", "arrow-up-c", "at", "bag", "battery-charging", "battery-empty", "battery-full", "battery-half", "battery-low", "beaker", "beer", "bluetooth", "bookmark", "briefcase", "bug", "calculator", "calendar", "camera", "card", "chatbox", "chatbox-working", "chatboxes", "chatbubble", "chatbubble-working", "chatbubbles", "checkmark", "checkmark-circled", "checkmark-round", "chevron-down", "chevron-left", "chevron-right", "chevron-up", "clipboard", "clock", "close", "close-circled", "close-round", "cloud", "code", "code-download", "code-working", "coffee", "compass", "compose", "connection-bars", "contrast", "disc", "document", "document-text", "drag", "earth", "edit", "egg", "eject", "email", "eye", "eye-disabled", "female", "filing", "film-marker", "flag", "flash", "flash-off", "flask", "folder", "fork", "fork-repo", "forward", "game-controller-a", "game-controller-b", "gear-a", "gear-b", "grid", "hammer", "headphone", "heart", "help", "help-buoy", "help-circled", "home", "icecream", "icon-social-google-plus", "icon-social-google-plus-outline", "image", "images", "information", "information-circled", "ionic", "ios7-alarm", "ios7-alarm-outline", "ios7-albums", "ios7-albums-outline", "ios7-arrow-back", "ios7-arrow-down", "ios7-arrow-forward", "ios7-arrow-left", "ios7-arrow-right", "ios7-arrow-thin-down", "ios7-arrow-thin-left", "ios7-arrow-thin-right", "ios7-arrow-thin-up", "ios7-arrow-up", "ios7-at", "ios7-at-outline", "ios7-bell", "ios7-bell-outline", "ios7-bolt", "ios7-bolt-outline", "ios7-bookmarks", "ios7-bookmarks-outline", "ios7-box", "ios7-box-outline", "ios7-briefcase", "ios7-briefcase-outline", "ios7-browsers", "ios7-browsers-outline", "ios7-calculator", "ios7-calculator-outline", "ios7-calendar", "ios7-calendar-outline", "ios7-camera", "ios7-camera-outline", "ios7-cart", "ios7-cart-outline", "ios7-chatboxes", "ios7-chatboxes-outline", "ios7-chatbubble", "ios7-chatbubble-outline", "ios7-checkmark", "ios7-checkmark-empty", "ios7-checkmark-outline", "ios7-circle-filled", "ios7-circle-outline", "ios7-clock", "ios7-clock-outline", "ios7-close", "ios7-close-empty", "ios7-close-outline", "ios7-cloud", "ios7-cloud-download", "ios7-cloud-download-outline", "ios7-cloud-outline", "ios7-cloud-upload", "ios7-cloud-upload-outline", "ios7-cloudy", "ios7-cloudy-night", "ios7-cloudy-night-outline", "ios7-cloudy-outline", "ios7-cog", "ios7-cog-outline", "ios7-compose", "ios7-compose-outline", "ios7-contact", "ios7-contact-outline", "ios7-copy", "ios7-copy-outline", "ios7-download", "ios7-download-outline", "ios7-drag", "ios7-email", "ios7-email-outline", "ios7-eye", "ios7-eye-outline", "ios7-fastforward", "ios7-fastforward-outline", "ios7-filing", "ios7-filing-outline", "ios7-film", "ios7-film-outline", "ios7-flag", "ios7-flag-outline", "ios7-folder", "ios7-folder-outline", "ios7-gear", "ios7-gear-outline", "ios7-glasses", "ios7-glasses-outline", "ios7-heart", "ios7-heart-outline", "ios7-help", "ios7-help-empty", "ios7-help-outline", "ios7-infinite", "ios7-infinite-outline", "ios7-information", "ios7-information-empty", "ios7-information-outline", "ios7-ionic-outline", "ios7-keypad", "ios7-keypad-outline", "ios7-lightbulb", "ios7-lightbulb-outline", "ios7-location", "ios7-location-outline", "ios7-locked", "ios7-locked-outline", "ios7-medkit", "ios7-medkit-outline", "ios7-mic", "ios7-mic-off", "ios7-mic-outline", "ios7-minus", "ios7-minus-empty", "ios7-minus-outline", "ios7-monitor", "ios7-monitor-outline", "ios7-moon", "ios7-moon-outline", "ios7-more", "ios7-more-outline", "ios7-musical-note", "ios7-musical-notes", "ios7-navigate", "ios7-navigate-outline", "ios7-paperplane", "ios7-paperplane-outline", "ios7-partlysunny", "ios7-partlysunny-outline", "ios7-pause", "ios7-pause-outline", "ios7-people", "ios7-people-outline", "ios7-person", "ios7-person-outline", "ios7-personadd", "ios7-personadd-outline", "ios7-photos", "ios7-photos-outline", "ios7-pie", "ios7-pie-outline", "ios7-play", "ios7-play-outline", "ios7-plus", "ios7-plus-empty", "ios7-plus-outline", "ios7-pricetag", "ios7-pricetag-outline", "ios7-printer", "ios7-printer-outline", "ios7-rainy", "ios7-rainy-outline", "ios7-recording", "ios7-recording-outline", "ios7-redo", "ios7-redo-outline", "ios7-refresh", "ios7-refresh-empty", "ios7-refresh-outline", "ios7-reload", "ios7-rewind", "ios7-rewind-outline", "ios7-search", "ios7-search-strong", "ios7-skipbackward", "ios7-skipbackward-outline", "ios7-skipforward", "ios7-skipforward-outline", "ios7-snowy", "ios7-speedometer", "ios7-speedometer-outline", "ios7-star", "ios7-star-outline", "ios7-stopwatch", "ios7-stopwatch-outline", "ios7-sunny", "ios7-sunny-outline", "ios7-telephone", "ios7-telephone-outline", "ios7-thunderstorm", "ios7-thunderstorm-outline", "ios7-time", "ios7-time-outline", "ios7-timer", "ios7-timer-outline", "ios7-trash", "ios7-trash-outline", "ios7-undo", "ios7-undo-outline", "ios7-unlocked", "ios7-unlocked-outline", "ios7-upload", "ios7-upload-outline", "ios7-videocam", "ios7-videocam-outline", "ios7-volume-high", "ios7-volume-low", "ios7-wineglass", "ios7-wineglass-outline", "ios7-world", "ios7-world-outline", "ipad", "iphone", "ipod", "jet", "key", "knife", "laptop", "leaf", "levels", "lightbulb", "link", "load-a", "load-b", "load-c", "load-d", "location", "locked", "log-in", "log-out", "loop", "magnet", "male", "man", "map", "medkit", "mic-a", "mic-b", "mic-c", "minus", "minus-circled", "minus-round", "model-s", "monitor", "more", "music-note", "navicon", "navicon-round", "navigate", "no-smoking", "nuclear", "paper-airplane", "paperclip", "pause", "person", "person-add", "person-stalker", "pie-graph", "pin", "pinpoint", "pizza", "plane", "play", "playstation", "plus", "plus-circled", "plus-round", "pound", "power", "pricetag", "pricetags", "printer", "radio-waves", "record", "refresh", "reply", "reply-all", "search", "settings", "share", "shuffle", "skip-backward", "skip-forward", "social-android", "social-android-outline", "social-apple", "social-apple-outline", "social-bitcoin", "social-bitcoin-outline", "social-buffer", "social-buffer-outline", "social-designernews", "social-designernews-outline", "social-dribbble", "social-dribbble-outline", "social-dropbox", "social-dropbox-outline", "social-facebook", "social-facebook-outline", "social-freebsd-devil", "social-github", "social-github-outline", "social-googleplus", "social-googleplus-outline", "social-hackernews", "social-hackernews-outline", "social-linkedin", "social-linkedin-outline", "social-pinterest", "social-pinterest-outline", "social-reddit", "social-reddit-outline", "social-rss", "social-rss-outline", "social-skype", "social-skype-outline", "social-tumblr", "social-tumblr-outline", "social-tux", "social-twitter", "social-twitter-outline", "social-vimeo", "social-vimeo-outline", "social-windows", "social-windows-outline", "social-wordpress", "social-wordpress-outline", "social-yahoo", "social-yahoo-outline", "social-youtube", "social-youtube-outline", "speakerphone", "speedometer", "spoon", "star", "stats-bars", "steam", "stop", "thermometer", "thumbsdown", "thumbsup", "trash-a", "trash-b", "umbrella", "unlocked", "upload", "usb", "videocamera", "volume-high", "volume-low", "volume-medium", "volume-mute", "waterdrop", "wifi", "wineglass", "woman", "wrench", "xbox"];

  C0 = 5;

  AbstractCanvasComponent = (function(_super) {
    __extends(AbstractCanvasComponent, _super);

    function AbstractCanvasComponent() {
      _ref = AbstractCanvasComponent.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AbstractCanvasComponent.prototype.initialize = function() {
      this.template = "<canvas></canvas>";
      this.defaults = {};
      return this.pwidth.add("update", "canvas", {
        set: function(c, value) {
          c.e.find("canvas").attr("width", _npx(value) + 2 * C0).attr("height", _npx(value) + 2 * C0);
          return c.type.draw(c);
        }
      });
    };

    AbstractCanvasComponent.prototype.render = function(component) {
      var canvas, context, h, w, wrapper;
      w = component.width + 2 * C0;
      h = component.height + 2 * C0;
      wrapper = component.e.find("canvas");
      wrapper.attr("width", w).attr("height", h).css({
        "margin": "-" + C0 + "px"
      });
      canvas = wrapper.get(0);
      context = canvas.getContext('2d');
      context.translate(0.5, 0.5);
      return this.draw(component);
    };

    AbstractCanvasComponent.prototype.draw = function(component) {
      var context, h, w;
      w = component.width + 2 * C0;
      h = component.height + 2 * C0;
      context = component.e.find("canvas").get(0).getContext('2d');
      context.clearRect(-1, -1, w + 1, h + 1);
      return this.doDraw(component, context, w, h);
    };

    AbstractCanvasComponent.prototype.doDraw = function(component, context, w, h) {};

    AbstractCanvasComponent.prototype.rads = function(angle) {
      return Math.PI / 180 * (angle - 90);
    };

    return AbstractCanvasComponent;

  })(ComponentType);

  SVG0 = 5;

  AbstractSVGComponent = (function(_super) {
    __extends(AbstractSVGComponent, _super);

    function AbstractSVGComponent() {
      _ref1 = AbstractSVGComponent.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    AbstractSVGComponent.prototype.initialize = function() {
      this.template = "<svg></svg>";
      this.defaults = {};
      this.prop(BORDER_WIDTH, "svg", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.e.find("line, polyline, path").attr("stroke-width", _npx(value));
        }
      });
      this.prop(BORDER_COLOR, "svg", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.e.find("line, polyline, path").attr("stroke", value);
        }
      });
      this.prop(BACKGROUND_COLOR, "svg", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.e.find("line, polyline, path").attr("fill", value);
        }
      });
      this.prop(BORDER_STYLE, "svg", {
        set: function(c, value) {
          var d;
          c.properties[this.name] = value;
          if (value === "dashed") {
            d = "3,3";
          } else if (value === "dotted") {
            d = "1,1";
          } else {
            d = "10,0";
          }
          return c.e.find("line, polyline, path").attr("stroke-dasharray", d);
        }
      });
      this.pwidth.add("update", "svg", {
        set: function(c, value) {
          return c.type.render(c);
        }
      });
      return this.pheight.add("update", "svg", {
        set: function(c, value) {
          return c.type.render(c);
        }
      });
    };

    AbstractSVGComponent.prototype.$new = function(definition, page) {
      var component;
      component = AbstractSVGComponent.__super__.$new.call(this, definition, page);
      component.resizePolicy = function() {
        return RESIZE_ALL;
      };
      return component;
    };

    AbstractSVGComponent.prototype.render = function(component) {
      var draw, h, w;
      w = component.width + 2 * SVG0;
      h = component.height + 2 * SVG0;
      draw = SVG(component.e.find('svg').empty().get(0)).size(w, h).fixSubPixelOffset();
      this.drawSVG(component, draw, w, h);
      return component.setAll();
    };

    AbstractSVGComponent.prototype.drawSVG = function(c, draw, w, h) {};

    AbstractSVGComponent.prototype.rads = function(angle) {
      return Math.PI * angle / 180;
    };

    AbstractSVGComponent.prototype.pa = function(coords) {
      return new SVG.PathArray(coords).toString();
    };

    AbstractSVGComponent.prototype.mov = function(x, y) {
      return ['M', x, y];
    };

    AbstractSVGComponent.prototype.line = function(x, y) {
      return ['L', x, y];
    };

    AbstractSVGComponent.prototype.arc = function(radius, xrot, arcflag, sweepflag, x, y) {
      return ['A', radius, radius, xrot, arcflag, sweepflag, x, y];
    };

    return AbstractSVGComponent;

  })(ComponentType);

  ListGroup = (function(_super) {
    __extends(ListGroup, _super);

    function ListGroup() {
      _ref2 = ListGroup.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    ListGroup.prototype.initialize = function() {
      this.set("ListGroup", "List Group", 300, 200);
      this.template = "<ul></ul>";
      this.defaults = {
        data: "Cras justo odio >\nDapibus ac facilisis in\nMorbi leo risus >\nPorta ac consectetur ac\nVestibulum at eros >",
        "line-height": "20px"
      };
      this.props(FONT);
      this.prop(DATA, NON_VISUAL, {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.type.parse(c, value);
        }
      });
      this.props([BORDER_COLOR, BORDER_WIDTH, BORDER_STYLE], "a");
      this.prop(LINE_HEIGHT, "a, i.fa-chevron-right");
      this.makeHorizontal({
        get: function(c) {
          return _npx(c.e.outerHeight());
        }
      });
      this.addOverlay(LINE_HEIGHT, LINE_HEIGHT_TRANSLATOR);
      return this.events = [
        {
          trigger: ITEM_CLICK,
          path: "a.list-group-item"
        }
      ];
    };

    ListGroup.prototype.parse = function(c, data) {
      var cell, html, row, rows, _i, _len;
      rows = data.split('\n');
      html = "<div class=\"list-group\">";
      for (_i = 0, _len = rows.length; _i < _len; _i++) {
        row = rows[_i];
        cell = _label(row);
        cell = cell.replace(/(\&gt\;$)/g, "<i class=\"fa fa-chevron-right pull-right\"></i>");
        cell = cell.replace(/\(([0-9]*)\)/g, "<span class=\"badge\">$1</span>");
        html += "<a href=\"#\" class=\"list-group-item\">" + cell + "</a>";
      }
      html += "</div>";
      c.e.empty().append($(html));
      return c.setAll();
    };

    ListGroup.prototype.getDataItemAt = function(component, index) {
      var data, row, rows, suffix;
      data = component.get(DATA);
      if (data == null) {
        return "";
      }
      rows = data.split('\n');
      if (index >= rows.length) {
        return "";
      }
      row = _.trim(rows[index]);
      suffix = ">";
      if (row.indexOf(suffix, this.length - suffix.length) !== -1) {
        row = row.substring(0, row.length - suffix.length);
      }
      return _.trim(row);
    };

    ListGroup.prototype.getEventItem = function(event) {
      return $(event.target).text();
    };

    ListGroup.prototype.enhance = function(component, container) {
      return new DataEditorCover(component, container);
    };

    ListGroup.prototype.render = function(component) {
      return component.e.find("a.list-group-item").on("click", function(event) {
        var $this;
        event.preventDefault();
        $this = $(this);
        $this.trigger(ITEM_CLICK.event);
        return false;
      });
    };

    return ListGroup;

  })(ComponentType);

  register(new ListGroup());

  Button = (function(_super) {
    __extends(Button, _super);

    function Button() {
      _ref3 = Button.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    Button.prototype.initialize = function() {
      this.set("Button", "Button", 140, 32);
      this.template = "<button type=\"button\" class=\"btn\">{label}</button>";
      this.defaults = {
        label: _$("Button")
      };
      this.defaults[FONT_ALIGN] = "center";
      this.defaults[COLOR] = "#ffffff";
      this.defaults[BACKGROUND_COLOR] = "#02911F";
      this.defaults[BORDER_COLOR] = "#02911F";
      this.defaults[BORDER_RADIUS] = "4px";
      this.props(FONT);
      this.props([BORDER_COLOR, BORDER_STYLE, BORDER_WIDTH], ".btn");
      this.prop(BORDER_RADIUS, ".btn");
      this.prop(BACKGROUND_COLOR, ".btn", {
        set: function(c, value) {
          var color;
          c.properties[this.name] = value;
          color = Color(value);
          color = color.setSaturation(Math.min(color.getSaturation() + .09, 1)).setValue(Math.max(color.getValue() - .07, 0));
          c.css(".btn:hover", "background-color", color.toString());
          return c.css(".btn", "background-color", value);
        }
      });
      this.prop(LABEL, ".btn", {
        set: function(c, value) {
          c.properties[this.name] = value;
          value = _label(value);
          return c.e.find(this.path).html(value);
        }
      });
      this.addOverlay(BORDER_RADIUS, BORDER_RADIUS_TRANSLATOR);
      return this.events = [
        {
          trigger: CLICK
        }, {
          trigger: MOUSE_ENTER
        }
      ];
    };

    Button.prototype.doAction = function(action, component, target) {};

    Button.prototype.render = function(component) {};

    Button.prototype.isTextEditable = function() {
      return true;
    };

    Button.prototype.configureEditor = function(config) {
      return config.property = this.get(LABEL);
    };

    return Button;

  })(ComponentType);

  register(new Button());

  ItemsComponent = (function(_super) {
    __extends(ItemsComponent, _super);

    function ItemsComponent() {
      _ref4 = ItemsComponent.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    ItemsComponent.prototype.getDataItemAt = function(component, index) {
      var data, row, rows;
      data = component.get(DATA);
      if (data == null) {
        return "";
      }
      rows = data.split(',');
      if (index >= rows.length) {
        return "";
      }
      row = rows[index];
      return _.trim(row);
    };

    ItemsComponent.prototype.getEventItem = function(event) {
      return $(event.target).text();
    };

    ItemsComponent.prototype.render = function(component) {
      return component.e.find("input").on("click", function(event) {
        var $this;
        event.preventDefault();
        $this = $(this);
        $this.trigger(ITEM_CLICK.event);
        return false;
      });
    };

    return ItemsComponent;

  })(ComponentType);

  ButtonBar = (function(_super) {
    __extends(ButtonBar, _super);

    function ButtonBar() {
      _ref5 = ButtonBar.__super__.constructor.apply(this, arguments);
      return _ref5;
    }

    ButtonBar.prototype.initialize = function() {
      var p, _i, _len, _ref6;
      this.defaults = {
        data: "Item 1,Item 2,Item 3,Item 4"
      };
      this.defaults[FONT_ALIGN] = "center";
      this.defaults[COLOR] = "#ffffff";
      this.defaults[BACKGROUND_COLOR] = "#02911F";
      this.defaults[BORDER_RADIUS] = "4px";
      this.defaults["button-width"] = 40;
      this.set("ButtonBar", "Button Bar", 220, 32);
      this.template = "<div class=\"btn-group btn-group-justified\"></div>";
      _ref6 = this.props(FONT);
      for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
        p = _ref6[_i];
        p.path = ".btn-group";
      }
      this.prop(DATA, NON_VISUAL, {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.type.parse(c, value);
        }
      });
      p = this.prop(BACKGROUND_COLOR, ".btn", {
        set: function(c, value) {
          var color;
          c.properties[this.name] = value;
          color = Color(value);
          return c.css(".btn", "background-color", value);
        }
      });
      this.prop(BORDER_COLOR, "a.btn", {
        set: function(c, value) {
          var color, hover;
          c.properties[this.name] = value;
          color = Color(value);
          hover = "white";
          if (color.getLightness() > 0.5) {
            hover = "#333";
          }
          c.css("a.btn:hover", "color", hover);
          c.css(".btn:hover", "background-color", value);
          return c.css(".btn", "border-color", value);
        }
      });
      return this.events = [
        {
          trigger: ITEM_CLICK,
          path: "a[type='button']"
        }
      ];
    };

    ButtonBar.prototype.parse = function(c, data) {
      var cell, html, row, rows, _i, _len;
      rows = data.split(',');
      html = "<div class=\"btn-group btn-group-justified\">";
      for (_i = 0, _len = rows.length; _i < _len; _i++) {
        row = rows[_i];
        cell = _label(row);
        html += "<a type=\"button\" class=\"btn\">" + cell + "</a>";
      }
      html += "</div>";
      c.e.empty().append($(html));
      return c.setAll();
    };

    ButtonBar.prototype.enhance = function(component, container) {
      return new DataEditorCover(component, container);
    };

    return ButtonBar;

  })(ItemsComponent);

  register(new ButtonBar());

  BreadCrumbs = (function(_super) {
    __extends(BreadCrumbs, _super);

    function BreadCrumbs() {
      _ref6 = BreadCrumbs.__super__.constructor.apply(this, arguments);
      return _ref6;
    }

    BreadCrumbs.prototype.initialize = function() {
      var self;
      if (this.disableLastItem == null) {
        this.disableLastItem = true;
      }
      this.defaults = {
        data: "Item 1,Item 2,Item 3,Item 4"
      };
      this.defaults[COLOR] = "#707070";
      this.defaults[BORDER_COLOR] = "#303030";
      this.set("BreadCrumbs", "Bread Crumbs", 235, 32);
      this.template = "<ul class=\"breadcrumb\">{#labels}<li><a href=\"#\">{.}</a></li>{/labels}</ul>";
      this.props(FONT);
      this.prop(COLOR, "@", {
        set: function(c, value) {
          var color;
          c.properties[this.name] = value;
          color = Color(value);
          color = color.setSaturation(Math.min(color.getSaturation() + .09, 1)).setValue(Math.max(color.getValue() - .07, 0));
          return c.css("li > a", "color", value);
        }
      });
      this.prop(BACKGROUND_COLOR, ".breadcrumb");
      this.prop(BORDER_COLOR, ".breadcrumb > li", {
        set: function(c, value) {
          c.properties[this.name] = value;
          c.css(".breadcrumb > li + li:before", "color", value);
          return c.css("li.active", "color", value);
        }
      });
      this.makeHorizontal({
        get: function(c) {
          return _npx(c.e.find("ul").outerHeight());
        }
      });
      if (this.separator == null) {
        this.separator = "'\\00BB'";
      }
      self = this;
      this.prop(DATA, NON_VISUAL, {
        set: function(c, value) {
          c.properties[this.name] = value;
          c.type.parse(c, value);
          return c.css(".breadcrumb > li + li:before", "content", self.separator);
        }
      });
      return this.events = [
        {
          trigger: ITEM_CLICK,
          path: "a"
        }
      ];
    };

    BreadCrumbs.prototype.parse = function(c, data) {
      var cell, html, index, row, rows, _i, _len;
      rows = data.split(',');
      html = "<ul class=\"breadcrumb\">";
      for (index = _i = 0, _len = rows.length; _i < _len; index = ++_i) {
        row = rows[index];
        cell = _label(row);
        if (this.disableLastItem && index === rows.length - 1) {
          html += "<li class=\"active\">" + cell + "</li>";
        } else {
          html += "<li><a href=\"#\">" + cell + "</a></li>";
        }
      }
      html += "</ul>";
      c.e.empty().append($(html));
      return c.setAll();
    };

    BreadCrumbs.prototype.enhance = function(component, container) {
      return new DataEditorCover(component, container);
    };

    BreadCrumbs.prototype.getDataItemAt = function(component, index) {
      var data, row, rows;
      data = component.get(DATA);
      if (data == null) {
        return "";
      }
      rows = data.split(',');
      if (index >= rows.length) {
        return "";
      }
      row = rows[index];
      return _.trim(row);
    };

    BreadCrumbs.prototype.getEventItem = function(event) {
      return $(event.target).text();
    };

    return BreadCrumbs;

  })(ItemsComponent);

  register(new BreadCrumbs());

  LinkBar = (function(_super) {
    __extends(LinkBar, _super);

    function LinkBar() {
      _ref7 = LinkBar.__super__.constructor.apply(this, arguments);
      return _ref7;
    }

    LinkBar.prototype.initialize = function() {
      this.disableLastItem = false;
      this.separator = "'\\007C'";
      LinkBar.__super__.initialize.call(this);
      return this.set("LinkBar", "Link Bar", 235, 32);
    };

    return LinkBar;

  })(BreadCrumbs);

  register(new LinkBar());

  Link = (function(_super) {
    __extends(Link, _super);

    function Link() {
      _ref8 = Link.__super__.constructor.apply(this, arguments);
      return _ref8;
    }

    Link.prototype.initialize = function() {
      this.set("Link", "Link", 60, 32);
      this.template = "{>vlabel:label/}";
      this.defaults = {
        label: _$("Link")
      };
      this.defaults[FONT_ALIGN] = "center";
      this.defaults[BACKGROUND_COLOR] = "white";
      this.defaults[BORDER_COLOR] = "white";
      this.props([FONT, BACKGROUND_COLOR], "div");
      this.props(BORDER, "div");
      this.prop(BACKGROUND_COLOR, "div", {
        set: function(c, value) {
          var color;
          c.properties[this.name] = value;
          color = Color(value);
          color = color.setSaturation(Math.min(color.getSaturation() + .09, 1)).setValue(Math.max(color.getValue() - .07, 0));
          c.css("div.vlabel", "background-color", value);
          return c.css("div.vlabel:hover", "background-color", color.toString());
        }
      });
      this.prop(LABEL, VLABEL_PATH, VLABEL_SET);
      this.addOverlay(BORDER_RADIUS, BORDER_RADIUS_TRANSLATOR);
      return this.events = [
        {
          trigger: CLICK
        }, {
          trigger: MOUSE_ENTER
        }
      ];
    };

    Link.prototype.isTextEditable = function() {
      return true;
    };

    Link.prototype.configureEditor = function(config) {
      return config.property = this.get(LABEL);
    };

    return Link;

  })(ComponentType);

  register(new Link());

  DONUT_TRANSLATOR = {
    recompute: false,
    getRange: function(c, r) {
      return r.maxx = c.width / 2;
    },
    toPosition: function(v, p, c) {
      return p.x = Math.min(c.width / 2, _npx(v));
    },
    toValue: function(p, c) {
      return _npx(p.x);
    }
  };

  C0 = 5;

  PieChart = (function(_super) {
    __extends(PieChart, _super);

    function PieChart() {
      _ref9 = PieChart.__super__.constructor.apply(this, arguments);
      return _ref9;
    }

    PieChart.prototype.initialize = function() {
      PieChart.__super__.initialize.call(this);
      this.set("PieChart", "Pie Chart", 100, 100);
      this.defaults["radius"] = 25;
      this.defaults[BACKGROUND_COLOR] = "#999";
      this.defaults["data"] = "30, 90, 120, 360";
      this.prop(DATA, NON_VISUAL, {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.type.parse(c, value);
        }
      });
      this.prop(BACKGROUND_COLOR, "canvas", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.type.draw(c);
        }
      });
      this.prop("radius", NON_VISUAL, {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.type.draw(c);
        }
      });
      this.makeHorizontal({
        get: function(c) {
          return c.width;
        }
      });
      this.addOverlay("radius", DONUT_TRANSLATOR);
      return this.events = [
        {
          trigger: CLICK
        }, {
          trigger: MOUSE_ENTER
        }
      ];
    };

    PieChart.prototype.doDraw = function(component, context, w, h) {
      var a, color, i, l, ri, start, _i, _len, _ref10, _results;
      if (component.angles == null) {
        return;
      }
      ri = component.width / 2 - Math.min(component.get("radius"), component.width / 2);
      start = 0;
      color = Color(component.get(BACKGROUND_COLOR));
      _ref10 = component.angles;
      _results = [];
      for (i = _i = 0, _len = _ref10.length; _i < _len; i = ++_i) {
        a = _ref10[i];
        this.drawSector(context, w / 2, w / 2, component.width / 2, ri, start, a);
        context.fillStyle = color.toString();
        context.fill();
        context.strokeStyle = "rgba(255, 255, 255, 0)";
        context.lineWidth = 0;
        context.stroke();
        start = a;
        l = color.getLightness();
        l = l + 0.25;
        if (l > 1) {
          l = l - 1;
        }
        _results.push(color = color.setLightness(l));
      }
      return _results;
    };

    PieChart.prototype.drawSector = function(c, cx, cy, r1, r2, a1, a2) {
      var end, inr, outr, start;
      start = Math.min(a1, a2);
      end = Math.max(a1, a2);
      inr = Math.min(r1, r2);
      outr = Math.max(r1, r2);
      c.beginPath();
      c.arc(cx, cy, outr, this.rads(start), this.rads(end), false);
      c.arc(cx, cy, inr, this.rads(end), this.rads(start), true);
      return c.closePath();
    };

    PieChart.prototype.enhance = function(component, container) {
      return new DataEditorCover(component, container);
    };

    PieChart.prototype.parse = function(c, data) {
      var angles, v, values, _i, _len;
      values = data.split(",");
      angles = [];
      for (_i = 0, _len = values.length; _i < _len; _i++) {
        v = values[_i];
        v = parseInt(_.trim(v));
        angles.push(v);
      }
      c.angles = angles;
      return this.draw(c);
    };

    return PieChart;

  })(AbstractCanvasComponent);

  register(new PieChart());

  LineChart = (function(_super) {
    __extends(LineChart, _super);

    function LineChart() {
      _ref10 = LineChart.__super__.constructor.apply(this, arguments);
      return _ref10;
    }

    LineChart.prototype.initialize = function() {
      LineChart.__super__.initialize.call(this);
      this.set("LineChart", "Line Chart", 100, 100);
      this.defaults["radius"] = 10;
      this.defaults[BACKGROUND_COLOR] = "#999";
      this.defaults[BORDER_COLOR] = "#333";
      this.defaults["data"] = "30, 90, 120, 160\n20, 80, 20, 120";
      this.prop(DATA, NON_VISUAL, {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.type.parse(c, value);
        }
      });
      this.prop(BORDER_COLOR, "canvas", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.type.draw(c);
        }
      });
      this.prop(BACKGROUND_COLOR, "canvas", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.type.draw(c);
        }
      });
      this.prop(BORDER_WIDTH, "canvas", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.type.draw(c);
        }
      });
      this.prop("radius", NON_VISUAL, {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.type.draw(c);
        }
      });
      this.addOverlay("radius", {
        recompute: false,
        getRange: function(c, r) {
          return r.maxx = 10;
        },
        toPosition: function(v, p, c) {
          return p.x = Math.min(10, _npx(v));
        },
        toValue: function(p, c) {
          return _npx(p.x);
        }
      });
      return this.events = [
        {
          trigger: CLICK
        }, {
          trigger: MOUSE_ENTER
        }
      ];
    };

    LineChart.prototype.doDraw = function(component, context, w, h) {
      var bgcolor, brcolor, i, max, min, points, _i, _j, _len, _len1, _ref11, _ref12;
      if (component.datapoints == null) {
        return;
      }
      bgcolor = Color(component.get(BACKGROUND_COLOR));
      brcolor = Color(component.get(BORDER_COLOR));
      min = 1000000;
      max = -1000000;
      _ref11 = component.datapoints;
      for (_i = 0, _len = _ref11.length; _i < _len; _i++) {
        points = _ref11[_i];
        min = Math.min(min, Math.min(0, Math.min.apply(0, points)));
        max = Math.max(max, Math.max.apply(0, points));
      }
      _ref12 = component.datapoints.slice(0).reverse();
      for (i = _j = 0, _len1 = _ref12.length; _j < _len1; i = ++_j) {
        points = _ref12[i];
        if (i === component.datapoints.length - 1) {
          bgcolor = Color(component.get(BACKGROUND_COLOR));
          brcolor = Color(component.get(BORDER_COLOR));
        } else {
          brcolor = this.lightness(brcolor);
          bgcolor = this.lightness(bgcolor);
        }
        this.drawSeries(points, context, component, w, h, min, max, brcolor.toString(), bgcolor.toString());
      }
      return false;
    };

    LineChart.prototype.lightness = function(color) {
      var l;
      l = color.getLightness();
      l = l + 0.25;
      if (l > 1) {
        l = l - 1;
      }
      return color = color.setLightness(l);
    };

    LineChart.prototype.drawSeries = function(points, context, component, w, h, min, max, brcolor, bgcolor) {
      var brwidth, chartheight, dataheight, i, p, prev, r, step, x1, x2, y1, y2, _i, _j, _len, _len1, _results;
      r = Math.min(10, component.get("radius"));
      dataheight = max - min;
      step = component.width / (points.length - 1);
      chartheight = component.height;
      context.beginPath();
      context.moveTo(C0, h - C0);
      for (i = _i = 0, _len = points.length; _i < _len; i = ++_i) {
        p = points[i];
        if (i === 0) {
          context.lineTo(C0 + i * step, h - C0 - (p - min) / dataheight * chartheight);
        } else {
          x1 = C0 + (i - 1) * step;
          y1 = h - C0 - (prev - min) / dataheight * chartheight;
          x2 = C0 + i * step;
          y2 = h - C0 - (p - min) / dataheight * chartheight;
          if (r === 0) {
            context.lineTo(x2, y2);
          } else {
            context.bezierCurveTo(x1 + r, y1, x2 - r, y2, x2, y2);
          }
        }
        prev = points[i];
      }
      context.lineTo(w - C0, h - C0);
      context.closePath();
      context.fillStyle = bgcolor;
      context.fill();
      brwidth = _npx(component.get(BORDER_WIDTH));
      _results = [];
      for (i = _j = 0, _len1 = points.length; _j < _len1; i = ++_j) {
        p = points[i];
        if (i === 0) {
          _results.push(prev = points[i]);
        } else {
          context.beginPath();
          x1 = C0 + (i - 1) * step;
          y1 = h - C0 - (prev - min) / dataheight * chartheight;
          context.moveTo(x1, y1);
          x2 = C0 + i * step;
          y2 = h - C0 - (p - min) / dataheight * chartheight;
          if (r === 0) {
            context.lineTo(x2, y2);
          } else {
            context.bezierCurveTo(x1 + r, y1, x2 - r, y2, x2, y2);
          }
          prev = points[i];
          context.strokeStyle = brcolor;
          context.lineWidth = brwidth;
          _results.push(context.stroke());
        }
      }
      return _results;
    };

    LineChart.prototype.enhance = function(component, container) {
      return new DataEditorCover(component, container);
    };

    LineChart.prototype.parse = function(c, data) {
      var datapoints, row, rows, series, v, values, _i, _j, _len, _len1;
      rows = data.split('\n');
      series = [];
      for (_i = 0, _len = rows.length; _i < _len; _i++) {
        row = rows[_i];
        values = row.split(",");
        datapoints = [];
        for (_j = 0, _len1 = values.length; _j < _len1; _j++) {
          v = values[_j];
          v = parseInt(_.trim(v));
          datapoints.push(v);
        }
        series.push(datapoints);
      }
      c.datapoints = series;
      return this.draw(c);
    };

    return LineChart;

  })(AbstractCanvasComponent);

  register(new LineChart());

  BarChart = (function(_super) {
    __extends(BarChart, _super);

    function BarChart() {
      _ref11 = BarChart.__super__.constructor.apply(this, arguments);
      return _ref11;
    }

    BarChart.prototype.initialize = function() {
      BarChart.__super__.initialize.call(this);
      this.set("BarChart", "Bar Chart", 100, 100);
      this.defaults["gap"] = 10;
      this.defaults[BACKGROUND_COLOR] = "#999";
      this.defaults[BORDER_COLOR] = "#333";
      this.defaults["data"] = "30, 90, 120, 160\n20, 80, 20, 120";
      this.prop(DATA, NON_VISUAL, {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.type.parse(c, value);
        }
      });
      this.prop(BORDER_COLOR, "canvas", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.type.draw(c);
        }
      });
      this.prop(BACKGROUND_COLOR, "canvas", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.type.draw(c);
        }
      });
      this.prop(BORDER_WIDTH, "canvas", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.type.draw(c);
        }
      });
      this.prop("gap", NON_VISUAL, {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.type.draw(c);
        }
      });
      this.addOverlay("gap", {
        recompute: false,
        getRange: function(c, r) {
          return r.maxx = 10;
        },
        toPosition: function(v, p, c) {
          return p.x = Math.min(10, _npx(v));
        },
        toValue: function(p, c) {
          return _npx(p.x);
        }
      });
      return this.events = [
        {
          trigger: CLICK
        }, {
          trigger: MOUSE_ENTER
        }
      ];
    };

    BarChart.prototype.doDraw = function(component, context, w, h) {
      var bgcolor, brcolor, brwidth, chartheight, dataheight, i, max, min, n, p, points, r, step, v, x, _i, _j, _k, _len, _len1, _len2, _ref12, _ref13;
      if (component.datapoints == null) {
        return;
      }
      bgcolor = Color(component.get(BACKGROUND_COLOR));
      brcolor = Color(component.get(BORDER_COLOR));
      brwidth = _npx(component.get(BORDER_WIDTH));
      min = 1000000;
      max = -1000000;
      _ref12 = component.datapoints;
      for (_i = 0, _len = _ref12.length; _i < _len; _i++) {
        points = _ref12[_i];
        min = Math.min(min, Math.min(0, Math.min.apply(0, points)));
        max = Math.max(max, Math.max.apply(0, points));
      }
      chartheight = component.height;
      r = Math.min(10, component.get("gap"));
      _ref13 = component.datapoints.slice(0).reverse();
      for (_j = 0, _len1 = _ref13.length; _j < _len1; _j++) {
        points = _ref13[_j];
        dataheight = max - min;
        n = points.length;
        step = Math.round((component.width - (n + 1) * r) / n);
        for (i = _k = 0, _len2 = points.length; _k < _len2; i = ++_k) {
          p = points[i];
          context.fillStyle = bgcolor.toString();
          x = C0 + r + i * (step + r) + brwidth / 2;
          v = Math.round((p - min) / dataheight * chartheight);
          context.fillRect(x - brwidth / 2, h - C0 - v, step, v);
          context.strokeStyle = brcolor.toString();
          context.lineWidth = brwidth;
          context.strokeRect(x, h - C0 - v + brwidth / 2, step - brwidth, v - brwidth);
        }
        brcolor = this.lightness(brcolor);
        bgcolor = this.lightness(bgcolor);
      }
      return false;
    };

    BarChart.prototype.lightness = function(color) {
      var l;
      l = color.getLightness();
      l = l + 0.25;
      if (l > 1) {
        l = l - 1;
      }
      return color = color.setLightness(l);
    };

    BarChart.prototype.enhance = function(component, container) {
      return new DataEditorCover(component, container);
    };

    BarChart.prototype.parse = function(c, data) {
      var datapoints, row, rows, series, v, values, _i, _j, _len, _len1;
      rows = data.split('\n');
      series = [];
      for (_i = 0, _len = rows.length; _i < _len; _i++) {
        row = rows[_i];
        values = row.split(",");
        datapoints = [];
        for (_j = 0, _len1 = values.length; _j < _len1; _j++) {
          v = values[_j];
          v = parseInt(_.trim(v));
          datapoints.push(v);
        }
        series.push(datapoints);
      }
      c.datapoints = series;
      return this.draw(c);
    };

    return BarChart;

  })(AbstractCanvasComponent);

  register(new BarChart());

  window.ItemEditor = (function() {
    function ItemEditor() {}

    ItemEditor.prototype.edit = function(container, elements, direction) {
      var editor;
      this.container = container;
      this.elements = elements;
      this.direction = direction;
      editor = this;
      this.covers = [];
      return this.elements.each(function() {
        var cover, element;
        element = $(this);
        cover = new ItemEditorCover(editor.container, element, editor.direction);
        cover.editor = editor;
        return editor.covers.push(cover);
      });
    };

    ItemEditor.prototype.updateCovers = function() {
      var cover, _i, _len, _ref12, _results;
      _ref12 = this.covers;
      _results = [];
      for (_i = 0, _len = _ref12.length; _i < _len; _i++) {
        cover = _ref12[_i];
        _results.push(cover.position());
      }
      return _results;
    };

    ItemEditor.prototype.update = function() {
      return this.updateCovers();
    };

    ItemEditor.prototype.remove = function(cover) {
      this.covers.slice(this.covers.indexOf(cover), 1);
      this.resizeTool.update();
      return this.updateCovers();
    };

    ItemEditor.prototype.showCovers = function(show) {
      var cover, _i, _len, _ref12;
      if (show == null) {
        show = true;
      }
      _ref12 = this.covers;
      for (_i = 0, _len = _ref12.length; _i < _len; _i++) {
        cover = _ref12[_i];
        cover.show(show);
      }
      if (show) {
        return this.resizeTool.show();
      } else {
        return this.resizeTool.hide();
      }
    };

    return ItemEditor;

  })();

  ItemEditorCover = (function() {
    function ItemEditorCover(container, element, direction) {
      var d, origin, position, stage0,
        _this = this;
      this.container = container;
      this.element = element;
      this.direction = direction;
      d = "";
      if (this.direction === "horizontal") {
        d = "fa-rotate-90";
      }
      this.cover = $("<div class=\"element-cover\"><i class=\"fa fa-reorder " + d + "\"></i><i class=\"fa fa-remove\"></i></div>");
      stage0 = this.container.parents("#designstage").offset();
      origin = this.container.offset();
      position = this.element.position();
      this.position();
      this.cover.appendTo(this.container);
      this.cover.on("mousedown", function(event) {
        var local, offset;
        event.preventDefault();
        offset = _this.container.offset();
        local = {
          x: event.pageX - offset.left,
          y: event.pageY - offset.top
        };
        _this.editor.resizeTool.doStartDrag(local);
        return false;
      });
      this.cover.find("i.fa-remove").on("click", function(event) {
        event.preventDefault();
        _this.element.remove();
        _this.editor.remove(_this);
        return false;
      });
      this.cover.find("i.fa-reorder").on("mousedown", function(event) {
        var clone, div, list, local, offset, replacement, vertical, wrapper;
        event.preventDefault();
        _this.editor.showCovers(false);
        replacement = _this.element;
        position = _this.element.position();
        wrapper = $("<div class=\"element-wrapper\"><div></div></div>");
        wrapper.appendTo(_this.element.parents(".pagestage"));
        div = wrapper.find("div");
        div.attr("class", _this.element.parent().parent().attr("class"));
        div.attr("style", _this.element.parent().parent().attr("style"));
        offset = _this.element.position();
        div.css({
          "top": -offset.top,
          "left": -offset.left,
          "width": _this.element.parent().outerWidth(),
          "height": _this.element.parent().outerHeight()
        });
        clone = _this.element.parent().clone();
        div.append(clone);
        offset = _this.element.offset();
        wrapper.css({
          left: offset.left,
          top: offset.top,
          width: _this.element.outerWidth(),
          height: _this.element.outerHeight()
        });
        offset = _this.cover.offset();
        position = _this.cover.position();
        local = {
          x: event.pageX - offset.left,
          y: event.pageY - offset.top
        };
        list = _this.element.parent().children();
        vertical = _this.direction === "vertical";
        _this.element.css("opacity", 0);
        $(document).on('mousemove.reorder', function(event) {
          var h, w, x, xy0, y;
          event.preventDefault();
          x = event.pageX - local.x - stage0.left;
          y = event.pageY - local.y - stage0.top;
          xy0 = replacement.offset();
          if (vertical) {
            if (y < xy0.top - replacement.prev().outerHeight() / 2) {
              while (y < xy0.top && replacement.index() > 0) {
                replacement.insertBefore(replacement.prev());
                xy0 = replacement.offset();
              }
            } else if (y > xy0.top + replacement.next().outerHeight() / 2) {
              h = replacement.next().outerHeight();
              while (y > xy0.top + h / 2 && replacement.index() < list.length - 1) {
                replacement.insertAfter(replacement.next());
                xy0 = replacement.offset();
                h = replacement.next().outerHeight();
              }
            }
          } else {
            if (x < xy0.left - replacement.prev().outerWidth() / 2) {
              while (x < xy0.left && replacement.index() > 0) {
                replacement.insertBefore(replacement.prev());
                xy0 = replacement.offset();
              }
            } else if (x > xy0.left + replacement.next().outerWidth() / 2) {
              w = replacement.next().outerWidth();
              while (x > xy0.left + w / 2 && replacement.index() < list.length - 1) {
                replacement.insertAfter(replacement.next());
                xy0 = replacement.offset();
                w = replacement.next().outerWidth();
              }
            }
          }
          if (vertical) {
            _this.cover.css("top", y - origin.top + stage0.top);
            wrapper.css("top", y);
          } else {
            _this.cover.css("left", x - origin.left + stage0.left);
            wrapper.css("left", x);
          }
          return false;
        });
        $(document).on('mouseup.reorder', function(event) {
          event.preventDefault();
          $(document).off('.reorder');
          _this.element.css("opacity", 1);
          wrapper.remove();
          _this.editor.updateCovers();
          _this.editor.showCovers();
          return false;
        });
        return false;
      });
    }

    ItemEditorCover.prototype.placehold = function(item) {
      var attributes, replacement;
      replacement = $("<" + (item.prop('tagName')) + ">");
      attributes = item.prop("attributes");
      $.each(attributes, function() {
        return replacement.attr(this.name, this.value);
      });
      replacement.css({
        "width": item.outerWidth(),
        "height": item.outerHeight(),
        "opacity": 0
      });
      return replacement;
    };

    ItemEditorCover.prototype.position = function() {
      var position;
      position = this.element.position();
      return this.cover.css({
        left: position.left,
        top: position.top,
        width: this.element.outerWidth() - 2,
        height: this.element.outerHeight() - 2
      });
    };

    ItemEditorCover.prototype.show = function(show) {
      if (show == null) {
        show = true;
      }
      if (show) {
        this.cover.css("opacity", 1).css("pointer-events", "auto");
      }
      if (!show) {
        return this.cover.css("opacity", 0).css("pointer-events", "none");
      }
    };

    return ItemEditorCover;

  })();

  Accordion = (function(_super) {
    __extends(Accordion, _super);

    function Accordion() {
      _ref12 = Accordion.__super__.constructor.apply(this, arguments);
      return _ref12;
    }

    Accordion.prototype.initialize = function() {
      var p;
      this.set("Accordion", "Accordion", 150, 250);
      this.template = "{#labels}{>vlabel:./}{/labels}";
      this.defaults = {
        labels: [_$("Tab 1"), _$("Tab 2"), _$("Tab 3")]
      };
      this.props(FONT);
      p = this.prop(BORDER_COLOR);
      p.add(BORDER_COLOR, "div");
      p = this.prop(BORDER_WIDTH);
      p.add("margin", "div", {
        set: function(c, value) {
          var v;
          return v = "-" + (_npx(value)) + "px";
        }
      });
      p.add("border-bottom-width", "div");
      this.pwidth.add('width', "div", {
        set: function(c, value) {
          var v;
          return v = _npx(value);
        }
      });
      p = this.prop(BORDER_STYLE);
      p.add("border-bottom-style", "div");
      return p = this.prop(BACKGROUND_COLOR, "div");
    };

    Accordion.prototype.render = function(component) {
      var tabs;
      return tabs = component.e.find("div").addClass("tab");
    };

    Accordion.prototype.enhance = function(component, container) {
      var bw, h, hpx;
      h = component.e.find("div").outerHeight();
      h = _npx(h);
      hpx = _px(h);
      bw = _npx(component.type.get(BORDER_WIDTH).get(component));
      container.append("<div class=\"accordion-tab-handle\" style=\"top: 0px; height: " + hpx + ";\"></div>");
      container.append("<div class=\"accordion-tab-handle\" style=\"top: " + h + "px; height: " + hpx + ";\"></div>");
      container.append("<div class=\"accordion-tab-handle\" style=\"top: " + (2 * h) + "px; height: " + hpx + ";\"></div>");
      container.find(".accordion-tab-handle").dblclick(function(event) {
        var index, tab;
        tab = $(event.target);
        index = tab.index();
        return alert("Editing this tab with index " + index);
      });
      return container.find(".accordion-tab-handle").click(function(event) {
        var index, tab;
        tab = $(event.target);
        return index = tab.index();
      });
    };

    return Accordion;

  })(ComponentType);

  window.DATA_EDITOR = null;

  DATAGRID_COLUMN_TRANSLATOR = {
    recompute: true,
    getRange: function(c, r) {
      r.minx = this.width(c, this.index - 1);
      r.maxx = this.width(c, this.index + 1);
      r.minx = c.width * r.minx / 100;
      r.maxx = c.width * r.maxx / 100;
      return r;
    },
    width: function(c, indx) {
      var i, v, _i;
      v = 0;
      if (indx === -1) {
        return v;
      }
      if (indx === c.columns.length) {
        return Math.round((c.width - 10) / c.width * 100);
      }
      for (i = _i = 0; 0 <= indx ? _i <= indx : _i >= indx; i = 0 <= indx ? ++_i : --_i) {
        v += c.columns[i].width;
      }
      return v;
    },
    toPosition: function(v, p, c) {
      var _v;
      _v = this.width(c, this.index);
      return p.x = _v * c.width / 100;
    },
    toValue: function(p, c) {
      var v, x;
      v = this.width(c, this.index - 1);
      x = v * c.width / 100;
      x = _npx(p.x) - x;
      v = _pc(Math.round(x / c.width * 100));
      return v;
    }
  };

  window.DATA_GRID = 'DataGrid';

  window.COLUMNS = 'columns';

  DataGrid = (function(_super) {
    __extends(DataGrid, _super);

    function DataGrid() {
      _ref13 = DataGrid.__super__.constructor.apply(this, arguments);
      return _ref13;
    }

    DataGrid.prototype.initialize = function() {
      this.set(DATA_GRID, "Data Table", 460, 151);
      this.template = "<table></table>";
      this.defaults = {
        data: "Column 1, Column 2, Column 3, []\n*Italic text*, **Bold text**, _Italic again_, []\nDefault text, Default style, Default color, [x]\nLinks, Are like this, [Example link](http://example.com/ \"With a Title\"), [x]\nYou can change, row height, and column width, [x]",
        "line-height": "30px",
        columns: "25,25,35"
      };
      this.props(FONT);
      this.prop(DATA, NON_VISUAL, {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.type.parse(c, value);
        }
      });
      this.prop(COLUMNS, "div", {
        set: function(c, value) {
          var i, v, values, _i, _len, _results;
          c.properties[this.name] = value;
          values = [];
          if (value != null) {
            values = value.split(",");
          }
          c.columns = [];
          _results = [];
          for (i = _i = 0, _len = values.length; _i < _len; i = ++_i) {
            v = values[i];
            values[i] = _npc(v);
            c.e.find("td:nth-child(" + (i + 1) + "), th:nth-child(" + (i + 1) + ")").css("width", "" + values[i] + "%");
            _results.push(c.columns.push({
              width: values[i],
              index: i
            }));
          }
          return _results;
        }
      });
      this.prop(BACKGROUND_COLOR, "table", {
        set: function(c, value) {
          var color;
          c.properties[this.name] = value;
          c.e.find(this.path).css(BACKGROUND_COLOR, value);
          color = Color(value).darkenByAmount(.1);
          return c.e.find("thead tr").css(BACKGROUND_COLOR, color.toString());
        }
      });
      this.prop(LINE_HEIGHT, "tr", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.e.find(this.path).height(value);
        }
      });
      this.prop(BORDER_COLOR, "td, th");
      this.prop(BORDER_STYLE, "td, th");
      this.prop(BORDER_WIDTH, "td, th");
      this.makeHorizontal({
        get: function(c) {
          return _npx(c.e.find("table").outerHeight());
        }
      });
      return this.addOverlay(LINE_HEIGHT, LINE_HEIGHT_TRANSLATOR);
    };

    DataGrid.prototype.parse = function(c, data) {
      var cell, cells, colcount, html, i, row, rows, style, t, _i, _j, _len, _len1;
      rows = data.split('\n');
      html = "<table>";
      i = 0;
      colcount = 0;
      for (_i = 0, _len = rows.length; _i < _len; _i++) {
        row = rows[_i];
        if (i === 0) {
          t = "th";
        }
        if (i !== 0) {
          t = "td";
        }
        if (i === 0) {
          html += "<thead><tr>";
        }
        if (i !== 0) {
          html += "<tr>";
        }
        cells = row.split(",");
        colcount = Math.max(cells.length, colcount);
        for (_j = 0, _len1 = cells.length; _j < _len1; _j++) {
          cell = cells[_j];
          style = "";
          cell = _label(cell);
          cell = cell.replace(/\[\]/g, "<input type=\"checkbox\">");
          cell = cell.replace(/\[x\]/g, "<input type=\"checkbox\" checked=\"checked\">");
          if (cell.indexOf('type="checkbox"') > -1) {
            style = "style=\"text-align:center;\" ";
          }
          html += "<" + t + " " + style + ">" + cell + "</" + t + ">";
        }
        if (i === 0) {
          html += "</tr></thead></tbody>";
        }
        if (i !== 0) {
          html += "</tr>";
        }
        i++;
      }
      html += "</tbody>";
      html += "</table>";
      c.e.empty().append($(html));
      return c.setAll();
    };

    DataGrid.prototype.enhance = function(component, container) {
      return new DataEditorCover(component, container);
    };

    DataGrid.prototype.getOverlays = function(component) {
      var column, i, overlays, _i, _len, _ref14;
      overlays = {};
      _ref14 = component.columns;
      for (i = _i = 0, _len = _ref14.length; _i < _len; i = ++_i) {
        column = _ref14[i];
        overlays["_column" + column.index] = _.extend({
          index: parseInt(column.index + "")
        }, DATAGRID_COLUMN_TRANSLATOR);
      }
      overlays[LINE_HEIGHT] = LINE_HEIGHT_TRANSLATOR;
      return overlays;
    };

    DataGrid.prototype.get = function(name) {
      var index, prop;
      if (name.indexOf("_column") === 0) {
        prop = new Property('colgroup col', name);
        index = parseInt(name.substring("_column".length));
        prop = _.extend(prop, {
          index: index,
          set: function(c, value) {
            var col, d, v, ws, _i, _len, _ref14;
            v = _npc(value);
            d = v - c.columns[this.index].width;
            c.columns[this.index].width = v;
            c.e.find("td:nth-child(" + (this.index + 1) + "), th:nth-child(" + (this.index + 1) + ")").css("width", _pc(v));
            if (this.index < c.columns.length - 1) {
              c.columns[this.index + 1].width -= d;
              v = c.columns[this.index + 1].width;
              c.e.find("td:nth-child(" + (this.index + 2) + "), th:nth-child(" + (this.index + 2) + ")").css("width", _pc(v));
            }
            ws = [];
            _ref14 = c.columns;
            for (_i = 0, _len = _ref14.length; _i < _len; _i++) {
              col = _ref14[_i];
              ws.push(col.width);
            }
            v = ws.join(",");
            return c.set(COLUMNS, v);
          },
          get: function(c) {
            return c.columns[this.index].width;
          }
        });
        return prop;
      } else {
        return DataGrid.__super__.get.call(this, name);
      }
    };

    return DataGrid;

  })(ComponentType);

  register(new DataGrid());

  List = (function(_super) {
    __extends(List, _super);

    function List() {
      _ref14 = List.__super__.constructor.apply(this, arguments);
      return _ref14;
    }

    List.prototype.initialize = function() {
      this.set("List", "List", 300, 200);
      this.template = "<table></table>";
      this.defaults = {
        data: "Item 1\nItem 2\nItem 3\nItem 4",
        "line-height": "20px"
      };
      this.props(FONT, "a");
      this.prop(DATA, NON_VISUAL, {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.type.parse(c, value);
        }
      });
      this.props([BORDER_COLOR, BORDER_STYLE, BORDER_WIDTH, BORDER_RADIUS]);
      this.prop(BACKGROUND_COLOR);
      this.addOverlay(LINE_HEIGHT, LINE_HEIGHT_TRANSLATOR);
      this.addOverlay(BORDER_RADIUS, BORDER_RADIUS_TRANSLATOR);
      return this.events = [
        {
          trigger: ITEM_CLICK,
          path: "a"
        }, {
          trigger: LIST_CHECKED,
          path: "input"
        }, {
          trigger: LIST_UNCHECKED,
          path: "input"
        }
      ];
    };

    List.prototype.parse = function(c, data) {
      var cell, html, row, rows, _i, _len;
      rows = data.split('\n');
      html = "<div class=\"list\">";
      for (_i = 0, _len = rows.length; _i < _len; _i++) {
        row = rows[_i];
        cell = _label(row);
        cell = cell.replace(/\[\]/g, "<input type=\"checkbox\">");
        cell = cell.replace(/\[x\]/g, "<input type=\"checkbox\" checked=\"checked\">");
        html += "<a href=\"#\">" + cell + "</a>";
      }
      html += "</div>";
      c.e.empty().append($(html));
      return c.setAll();
    };

    List.prototype.enhance = function(component, container) {
      return new DataEditorCover(component, container);
    };

    List.prototype.getDataItemAt = function(component, index) {
      var data, row, rows;
      data = component.get(DATA);
      if (data == null) {
        return "";
      }
      rows = data.split('\n');
      if (index >= rows.length) {
        return "";
      }
      row = _.trim(rows[index]);
      row = row.replace(/\[\]/g, "");
      row = row.replace(/\[x\]/g, "");
      return _.trim(row);
    };

    List.prototype.getEventItem = function(event) {
      var $this;
      $this = $(event.target);
      if ($this.is("a")) {
        return $this.text();
      } else if ($this.is("input")) {
        return $this.parent().text();
      }
    };

    List.prototype.render = function(component) {
      component.e.find("a").on("click", "a", function(event) {
        var $this;
        event.preventDefault();
        $this = $(this).eq(0);
        $this.trigger(ITEM_CLICK.event);
        return false;
      });
      return component.e.find("input").on("click", function(event) {
        var $this;
        event.stopImmediatePropagation();
        $this = $(this).eq(0);
        if ($this.checked) {
          $this.trigger(LIST_CHECKED.event);
        } else {
          $this.trigger(LIST_UNCHECKED.event);
        }
        return true;
      });
    };

    return List;

  })(ComponentType);

  register(new List());

  Tree = (function(_super) {
    __extends(Tree, _super);

    function Tree() {
      _ref15 = Tree.__super__.constructor.apply(this, arguments);
      return _ref15;
    }

    Tree.prototype.initialize = function() {
      this.set("Tree", "Tree", 300, 200);
      this.template = "<div></div>";
      this.defaults = {
        data: "{folder-open-alt} Item 1\n-{folder-open-alt} Item 2\n--{file} Item 3\n{file} Item 4",
        "line-height": "32px"
      };
      this.props(FONT);
      this.prop(DATA, NON_VISUAL, {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.type.parse(c, value);
        }
      });
      this.props([BORDER_COLOR, BORDER_STYLE, BORDER_WIDTH, BORDER_RADIUS]);
      this.prop(BACKGROUND_COLOR);
      this.addOverlay(LINE_HEIGHT, LINE_HEIGHT_TRANSLATOR);
      return this.addOverlay(BORDER_RADIUS, BORDER_RADIUS_TRANSLATOR);
    };

    Tree.prototype.parse = function(c, data) {
      var html, node, rows,
        _this = this;
      rows = data.split('\n');
      html = "<div class=\"tree\">";
      while (rows.length > 0) {
        node = this.parseNode(rows);
        html += node;
      }
      html += "</div>";
      c.e.empty().append($(html));
      c.e.find(".item .tree-item-expand").click(function(event) {
        var ticker;
        ticker = $(event.currentTarget);
        return ticker.parent().siblings(".children").slideToggle(300, function() {
          return ticker.toggleClass("fa-caret-down fa-caret-right");
        });
      });
      return c.setAll();
    };

    Tree.prototype.parseNode = function(rows) {
      var cell, children, depth, expand, node, row;
      row = rows[0];
      depth = 0;
      while (row.charAt(0) === '-') {
        row = row.substring(1);
        depth++;
      }
      cell = _label(row);
      cell = cell.replace(/\[\]/g, "<input type=\"checkbox\">");
      cell = cell.replace(/\[x\]/g, "<input type=\"checkbox\" checked=\"checked\">");
      rows.splice(0, 1);
      children = this.parseChildren(rows, depth);
      expand = '';
      if (children.length > "<div class=\"children\"></div>".length) {
        expand = "<i class=\"fa fa-caret-down tree-item-expand\"></i> ";
      }
      node = "<div class=\"node\"><div class=\"item\">" + expand + cell + "</div>\n" + children + "</div>";
      return node;
    };

    Tree.prototype.parseChildren = function(rows, parentDepth) {
      var children, depth, node, row;
      children = '';
      children += "<div class=\"children\">";
      while (rows.length > 0) {
        row = rows[0];
        depth = 0;
        while (row.charAt(0) === '-') {
          row = row.substring(1);
          depth++;
        }
        if (depth <= parentDepth) {
          break;
        }
        node = this.parseNode(rows);
        children += node;
      }
      children += "</div>";
      return children;
    };

    Tree.prototype.enhance = function(component, container) {
      return new DataEditorCover(component, container);
    };

    return Tree;

  })(ComponentType);

  register(new Tree());

  window.DataEditor = (function() {
    function DataEditor(project) {
      var DATA_EDITOR, html,
        _this = this;
      this.project = project;
      DATA_EDITOR = this;
      this.visible = false;
      this.wrapper = $("<div class=\"dataeditor-wrapper\" style=\"display: none;\"></div>");
      this.wrapper.appendTo($("body"));
      html = "<div class=\"dataeditor-toolbar\"></div><div class=\"dataeditor-container\"><div id=\"ace-editor\"></div></div><div style=\"width: 600px;margin: 0 auto;padding: 10px 0;display: block;\"> <button class=\"btn btn-success pull-right\">OK</button><a class=\"btn btn-link pull-right\">Cancel</a></div>";
      html = $(html);
      html.appendTo(this.wrapper);
      this.wrapper.find(".btn-success").click(function(event) {
        return _this.editor.execCommand("commit_dataeditor", {
          source: "ace"
        });
      });
      this.wrapper.find(".btn-link").click(function(event) {
        return _this.editor.execCommand("close_dataeditor", {
          source: "ace"
        });
      });
      this.editor = ace.edit("ace-editor");
      this.editor.setTheme("ace/theme/crimson_editor");
      this.editor.getSession().setMode("ace/mode/markdown");
      this.editor.setShowPrintMargin(false);
      this.editor.renderer.setShowGutter(false);
      this.editor.commands.addCommand({
        name: 'close_dataeditor',
        bindKey: {
          win: 'esc',
          mac: 'esc'
        },
        exec: function(editor) {
          return _this.hide();
        },
        readOnly: false
      });
      this.editor.commands.addCommand({
        name: 'commit_dataeditor',
        bindKey: {
          win: 'ctrl+enter',
          mac: 'command+enter'
        },
        exec: function(editor) {
          _this.hide();
          return _this.handler(_this.editor.getValue());
        },
        readOnly: false
      });
      this.project.on("escape", function(escape) {
        if (_this.visible) {
          _this.hide();
          return escape.cancel = true;
        }
      });
    }

    DataEditor.prototype.show = function(data, handler) {
      this.handler = handler;
      this.visible = true;
      this.wrapper.css("display", "block");
      this.editor.setValue(data);
      return this.editor.focus();
    };

    DataEditor.prototype.hide = function() {
      this.visible = false;
      return this.wrapper.css("display", "none");
    };

    return DataEditor;

  })();

  window.DataEditorCover = (function() {
    function DataEditorCover(component, container) {
      var _this = this;
      this.element = $("<div style=\"width:100%;height:100%;\"></div>");
      container.append(this.element);
      this.element.on("dblclick", function(event) {
        var text;
        if (window.DATA_EDITOR == null) {
          window.DATA_EDITOR = new DataEditor(component.page.project);
        }
        text = component.get(DATA);
        window.DATA_EDITOR.show(text, function(text) {
          var data, oldValue;
          oldValue = component.get(DATA);
          component.set(DATA, text);
          data = {
            name: DATA,
            oldValue: [oldValue],
            newValue: text
          };
          _this.selection.push(ACTION_UPDATE, data);
          _this.selection.checkSize();
          return _this.selection.page.project.trigger(CMD_UPDATE, _this.selection, data);
        });
        return _this;
      });
      this.element.on("mousedown", function(event) {
        var local, offset;
        event.preventDefault();
        offset = container.offset();
        local = {
          x: event.pageX - offset.left,
          y: event.pageY - offset.top
        };
        _this.resizeTool.doStartDrag(local);
        return false;
      });
    }

    return DataEditorCover;

  })();

  TextInput = (function(_super) {
    __extends(TextInput, _super);

    function TextInput() {
      _ref16 = TextInput.__super__.constructor.apply(this, arguments);
      return _ref16;
    }

    TextInput.prototype.initialize = function() {
      this.set("TextInput", "Text Input", 220, 32);
      this.template = "<input class=\"form-control\" type=\"text\" placeholder=\"{placeholder}\" />";
      this.defaults = {
        placeholder: _$("Text")
      };
      this.defaults[FONT_ALIGN] = "left";
      this.props([FONT, BORDER], "input");
      this.prop(BACKGROUND_COLOR, "input");
      this.prop(BORDER_RADIUS, "input");
      this.prop(LABEL, "input", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.e.find(this.path).val(value);
        }
      });
      this.prop(PLACEHOLDER, "input", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.e.find(this.path).attr("placeholder", value).val("");
        }
      });
      this.addOverlay(BORDER_RADIUS, BORDER_RADIUS_TRANSLATOR);
      return this.events = [
        {
          trigger: CHANGE
        }, {
          trigger: FOCUS_IN,
          path: "input"
        }, {
          trigger: FOCUS_OUT,
          path: "input"
        }, {
          trigger: KEY_ENTER
        }
      ];
    };

    TextInput.prototype.isTextEditable = function() {
      return true;
    };

    TextInput.prototype.configureEditor = function(config) {
      config.property = this.get(PLACEHOLDER);
      config.hidevalue = function(c) {
        return c.e.find("input").attr("placeholder", "").css("color", "rgba(0, 0, 0, 0)");
      };
      return config.showvalue = function(c) {
        return c.e.find("input").attr("placeholder", c.get(PLACEHOLDER)).css("color", c.get(COLOR));
      };
    };

    TextInput.prototype.render = function(component) {
      component.set(LABEL, "");
      return component.e.find("input").on("keyup", function(event) {
        var $parent, $this;
        $this = $(this);
        $parent = $this.parents(".Component");
        $parent.trigger(CHANGE.event);
        if (event.which === 13) {
          $parent.trigger(KEY_ENTER.event);
        }
        return true;
      });
    };

    return TextInput;

  })(ComponentType);

  register(new TextInput());

  PasswordInput = (function(_super) {
    __extends(PasswordInput, _super);

    function PasswordInput() {
      _ref17 = PasswordInput.__super__.constructor.apply(this, arguments);
      return _ref17;
    }

    PasswordInput.prototype.initialize = function() {
      PasswordInput.__super__.initialize.call(this);
      this.defaults[PLACEHOLDER] = _$("Password");
      this.set("PasswordInput", "Password Input", 220, 32);
      return this.template = "<input type=\"password\" placeholder=\"{placeholder}\" />";
    };

    return PasswordInput;

  })(TextInput);

  register(new PasswordInput());

  TextArea = (function(_super) {
    __extends(TextArea, _super);

    function TextArea() {
      _ref18 = TextArea.__super__.constructor.apply(this, arguments);
      return _ref18;
    }

    TextArea.prototype.initialize = function() {
      this.set("TextArea", "Text Area", 220, 100);
      this.template = "<textarea class=\"form-control\"></textarea>";
      this.defaults = {
        label: _$("TextArea")
      };
      this.defaults[FONT_ALIGN] = "left";
      this.props([FONT, BORDER], "textarea");
      this.prop(BACKGROUND_COLOR, "textarea");
      this.prop(BORDER_RADIUS, "textarea");
      this.prop(LABEL, "textarea", {
        set: function(c, value) {
          value = value.replace(/\n/g, "<br>");
          c.properties[this.name] = value;
          value = value.replace(/<br>/g, "\n");
          return c.e.find(this.path).val(value).attr("placeholder", "");
        }
      });
      this.prop(PLACEHOLDER, "textarea", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.e.find(this.path).attr("placeholder", value).val("");
        }
      });
      this.addOverlay(BORDER_RADIUS, BORDER_RADIUS_TRANSLATOR);
      this.addOverlay(LINE_HEIGHT, LINE_HEIGHT_TRANSLATOR);
      return this.events = [
        {
          trigger: CHANGE,
          path: "textarea"
        }
      ];
    };

    TextArea.prototype.isTextEditable = function() {
      return true;
    };

    TextArea.prototype.configureEditor = function(config) {
      config.property = this.get(PLACEHOLDER);
      config.multiline = true;
      config.align = "top";
      config.hidevalue = function(c) {
        return c.e.find("textarea").attr("placeholder", "").css("color", "rgba(0, 0, 0, 0)");
      };
      return config.showvalue = function(c) {
        return c.e.find("textarea").attr("placeholder", c.get(PLACEHOLDER)).css("color", c.get(COLOR));
      };
    };

    TextArea.prototype.render = function(component) {
      return component.set(LABEL, "");
    };

    return TextArea;

  })(ComponentType);

  register(new TextArea());

  Search = (function(_super) {
    __extends(Search, _super);

    function Search() {
      _ref19 = Search.__super__.constructor.apply(this, arguments);
      return _ref19;
    }

    Search.prototype.initialize = function() {
      this.deprecated = true;
      this.set("Search", "Search Input", 220, 32);
      this.template = "<div class=\"input-group\">\n<input type=\"text\" class=\"form-control\" value=\"{label}\">\n<span class=\"input-group-addon\"><i class=\"fa fa-search\"></span>\n</div>";
      this.defaults = {
        label: _$("Search")
      };
      this.defaults[FONT_ALIGN] = "left";
      this.props([FONT_STYLING, BORDER], "input");
      this.prop(BORDER_COLOR, "input, .input-group-addon", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.e.find(this.path).css(BORDER_COLOR, value);
        }
      });
      this.prop(BORDER_STYLE, "input, .input-group-addon", {
        set: function(c, value) {
          c.properties[this.name] = value;
          c.e.find(this.path).css(BORDER_STYLE, value);
          return c.e.find(".input-group-addon").css("border-left-style", "none");
        }
      });
      this.prop(BORDER_WIDTH, "input, .input-group-addon", {
        set: function(c, value) {
          var d, v;
          c.properties[this.name] = value;
          d = _npx(value);
          v = _px(c.height - 2 * _npx(value));
          c.e.find(this.path).css(BORDER_WIDTH, value);
          return c.e.find("input").css("line-height", v);
        }
      });
      this.prop(BACKGROUND_COLOR, "input", {
        set: function(c, value) {
          c.properties[this.name] = value;
          c.e.find(this.path).css("background-color", value);
          return c.e.find(".input-group-addon").css("color", value);
        }
      });
      this.prop(BORDER_RADIUS, "input", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.e.find(this.path).css("border-top-left-radius", value).css("border-bottom-left-radius", value);
        }
      });
      this.prop(LABEL, "input", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.e.find(this.path).val(value);
        }
      });
      this.addOverlay(BORDER_RADIUS, BORDER_RADIUS_TRANSLATOR);
      return this.events = [
        {
          trigger: CHANGE,
          path: "input"
        }
      ];
    };

    Search.prototype.isTextEditable = function() {
      return true;
    };

    Search.prototype.configureEditor = function(config) {
      return config.property = this.get(LABEL);
    };

    return Search;

  })(ComponentType);

  register(new Search());

  NumericStepper = (function(_super) {
    __extends(NumericStepper, _super);

    function NumericStepper() {
      _ref20 = NumericStepper.__super__.constructor.apply(this, arguments);
      return _ref20;
    }

    NumericStepper.prototype.initialize = function() {
      this.set("NumericStepper", "Numeric Stepper", 80, 32);
      this.template = "<div><input class=\"form-control\" type=\"text\" value=\"{label}\" /></div>";
      this.defaults = {
        label: _$("1")
      };
      this.defaults[FONT_ALIGN] = "left";
      this.props([FONT, BORDER], "input");
      this.prop(BACKGROUND_COLOR, "input");
      this.prop(BORDER_COLOR, "input", {
        set: function(c, value) {
          c.properties[this.name] = value;
          c.e.find(this.path).css(this.name, value);
          return c.css("i", COLOR, value);
        }
      });
      this.prop(BORDER_RADIUS, "input");
      this.pheight.add("down icon", ".fa.fa-chevron-down", {
        set: function(c, value) {
          var v;
          v = _npx(value);
          return c.e.find(this.path).css("top", _px(v - 14));
        }
      });
      this.prop(LABEL, "input", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.e.find(this.path).val(value);
        }
      });
      this.addOverlay(BORDER_RADIUS, BORDER_RADIUS_TRANSLATOR);
      return this.events = [
        {
          trigger: CHANGE,
          path: "input"
        }
      ];
    };

    NumericStepper.prototype.isTextEditable = function() {
      return true;
    };

    NumericStepper.prototype.configureEditor = function(config) {
      return config.property = this.get(LABEL);
    };

    NumericStepper.prototype.render = function(component) {
      return component.e.find("input").spinedit();
    };

    return NumericStepper;

  })(ComponentType);

  register(new NumericStepper());

  Slider = (function(_super) {
    __extends(Slider, _super);

    function Slider() {
      _ref21 = Slider.__super__.constructor.apply(this, arguments);
      return _ref21;
    }

    Slider.prototype.initialize = function() {
      this.set("Slider", "Slider Input", 160, 16);
      this.template = "<div class=\"slider-track\"><div class=\"slider-value\"></div><div class=\"slider-thumb\"></div></div>";
      this.defaults = {
        value: 30
      };
      this.defaults[FONT_ALIGN] = "left";
      this.prop("value", ".slider-track", {
        set: function(c, value) {
          var v;
          c.properties[this.name] = value;
          v = Math.round(value * (c.width - 8) / 100);
          c.e.find(".slider-value").width("" + value + "%");
          return c.e.find(".slider-thumb").css("left", v);
        }
      });
      this.pwidth.add("value", ".slider-track", {
        set: function(c, value) {
          var l, v;
          v = c.properties[this.name];
          l = Math.round(v * (_npx(value) - 8) / 100);
          return c.e.find(".slider-thumb").css("left", l);
        }
      });
      this.prop(BACKGROUND_COLOR, ".slider-track", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.e.find(".slider-value").css("background-color", value).css("border-color", value);
        }
      });
      this.prop(BORDER_COLOR, ".slider-track", {
        set: function(c, value) {
          var color;
          c.properties[this.name] = value;
          c.e.find(".slider-track").css("background-color", value).css("border-color", value);
          color = Color(value);
          color.lightenByRatio(0.1);
          return c.e.find(".slider-thumb").css("border-color", color.toString());
        }
      });
      this.addOverlay("value", {
        recompute: false,
        getRange: function(c, r) {
          return r.maxx = c.width;
        },
        toPosition: function(v, p, c) {
          return p.x = Math.round((c.width - 8) * v / 100 + 8);
        },
        toValue: function(p, c) {
          return Math.round((_npx(p.x) - 8) / (c.width - 8) * 100);
        }
      });
      this.makeHorizontal({
        get: function(c) {
          return _npx(16);
        }
      });
      return this.events = [
        {
          trigger: CHANGE
        }
      ];
    };

    Slider.prototype.render = function(component) {
      var _this = this;
      return component.e.find(".slider-thumb").on("mousedown", function(event) {
        var left, local, thumb, width;
        event.preventDefault();
        thumb = $(event.target);
        local = eventLocal(event);
        left = thumb.parent().offset().left;
        width = thumb.parents(".slider-track").width();
        $(document).on("mousemove.slider", function(event) {
          var value;
          event.preventDefault();
          value = event.pageX - local.x - left;
          value = Math.max(value, 0);
          value = Math.min(value, width - 16);
          value = Math.round(value / (width - 8) * 100);
          _this.get("value").set(component, value);
          return false;
        });
        $(document).on("mouseup.slider", function(event) {
          event.preventDefault();
          $(document).off(".slider");
          thumb.parents(".Component").trigger("change");
          return false;
        });
        return false;
      });
    };

    return Slider;

  })(ComponentType);

  register(new Slider());

  CheckBox = (function(_super) {
    __extends(CheckBox, _super);

    function CheckBox() {
      _ref22 = CheckBox.__super__.constructor.apply(this, arguments);
      return _ref22;
    }

    CheckBox.prototype.initialize = function() {
      this.set("CheckBox", "CheckBox", 140, 32);
      this.template = "<label class=\"checkbox\"> <input type=\"checkbox\" /><span>{label}</span></label>";
      this.defaults = {
        label: _$("Please check me.")
      };
      this.defaults[FONT_ALIGN] = "left";
      this.defaults[LINE_HEIGHT] = "20px";
      this.makeHorizontal({
        get: function(c) {
          return _npx(c.e.find("label").height());
        }
      });
      this.props(FONT);
      this.addOverlay(LINE_HEIGHT, LINE_HEIGHT_TRANSLATOR);
      this.pwidth.add("text-height-bogus", "@", {
        set: function(c, value) {
          var h, lh;
          h = c.e.find("label").height();
          lh = _npx(c.type.get(LINE_HEIGHT).get(c));
          return c.height = Math.max(h, lh);
        }
      });
      this.get(LINE_HEIGHT).add("text-height-bogus", "label", {
        set: function(c, value) {
          var check, h, label, v;
          label = c.e.find(this.path);
          check = c.e.find("input");
          v = _npx(value);
          check.css("margin-top", Math.round((v - 12) / 2));
          label.css(LINE_HEIGHT, _px(value));
          h = Math.max(label.height(), v);
          c.height = h;
          return c.type.pheight.set(c, h);
        }
      });
      this.prop(LABEL, "label span", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.e.find(this.path).html(value);
        }
      });
      return this.events = [
        {
          trigger: CHECKED
        }, {
          trigger: UNCHECKED
        }, {
          trigger: TOGGLE
        }
      ];
    };

    CheckBox.prototype.isTextEditable = function() {
      return true;
    };

    CheckBox.prototype.configureEditor = function(config) {
      config.property = this.get(LABEL);
      config.padding = 10;
      return config.align = "top";
    };

    CheckBox.prototype.render = function(component) {
      return component.e.find("input").on("change", function(event) {
        var $parent, $this;
        $this = $(this);
        $parent = $this.parents(".Component");
        if (this.checked) {
          $parent.trigger(CHECKED.event);
        } else {
          $parent.trigger(UNCHECKED.event);
        }
        return $parent.trigger(TOGGLE.event);
      });
    };

    return CheckBox;

  })(ComponentType);

  register(new CheckBox());

  CheckBoxList = (function(_super) {
    __extends(CheckBoxList, _super);

    function CheckBoxList() {
      _ref23 = CheckBoxList.__super__.constructor.apply(this, arguments);
      return _ref23;
    }

    CheckBoxList.prototype.initialize = function() {
      this.set("CheckBoxList", "CheckBox List", 140, 120);
      this.template = "<div class=\"clearfix\">{#labels}<label class=\"checkbox\"> <input type=\"checkbox\" /><span>{.}</span></label>{/labels}</div>";
      this.defaults = {
        data: "Item 1\nItem 2\nItem 3\nItem 4"
      };
      this.defaults[FONT_ALIGN] = "left";
      this.defaults[LINE_HEIGHT] = "20px";
      this.makeHorizontal({
        get: function(c) {
          return _npx(c.e.find("div").height());
        }
      });
      this.props(FONT);
      this.addOverlay(LINE_HEIGHT, LINE_HEIGHT_TRANSLATOR);
      this.pwidth.add("text-height-bogus", "@", {
        set: function(c, value) {
          var h, lh;
          h = c.e.find("div").height();
          lh = _npx(c.type.get(LINE_HEIGHT).get(c));
          return c.height = Math.max(h, 3 * lh);
        }
      });
      this.prop(DATA, NON_VISUAL, {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.type.parse(c, value);
        }
      });
      this.get(LINE_HEIGHT).add("text-height-bogus", "label", {
        set: function(c, value) {
          var check, h, label, v;
          label = c.e.find(this.path);
          check = c.e.find("input");
          v = _npx(value);
          check.css("margin-top", Math.round((v - 12) / 2));
          label.css(LINE_HEIGHT, _px(value));
          h = Math.max(c.e.find("div").height(), v);
          c.height = h;
          return c.type.pheight.set(c, h);
        }
      });
      return this.events = [
        {
          trigger: LIST_CHECKED
        }, {
          trigger: LIST_UNCHECKED
        }
      ];
    };

    CheckBoxList.prototype.parse = function(c, data) {
      var cell, html, row, rows, _i, _len;
      rows = data.split('\n');
      html = "<div class=\"clearfix\">";
      for (_i = 0, _len = rows.length; _i < _len; _i++) {
        row = rows[_i];
        cell = _label(row);
        html += "<label class=\"checkbox\"><input type=\"checkbox\" /><span>" + cell + "</span></label>";
      }
      html += "</div>";
      c.e.empty().append($(html));
      return c.setAll();
    };

    CheckBoxList.prototype.enhance = function(component, container) {
      return new DataEditorCover(component, container);
    };

    CheckBoxList.prototype.getDataItemAt = function(component, index) {
      var data, row, rows;
      data = component.get(DATA);
      if (data == null) {
        return "";
      }
      rows = data.split('\n');
      if (index >= rows.length) {
        return "";
      }
      row = rows[index];
      return row;
    };

    CheckBoxList.prototype.getEventItem = function(event) {
      return $(event.target).parent().find("span").text();
    };

    CheckBoxList.prototype.render = function(component) {
      return component.e.find("input").on("change", function(event) {
        var $parent, $this;
        $this = $(this);
        $parent = $this.parents(".Component");
        if (this.checked) {
          return $this.trigger(LIST_CHECKED.event);
        } else {
          return $this.trigger(LIST_UNCHECKED.event);
        }
      });
    };

    return CheckBoxList;

  })(ComponentType);

  register(new CheckBoxList());

  RadioButtons = (function(_super) {
    __extends(RadioButtons, _super);

    function RadioButtons() {
      _ref24 = RadioButtons.__super__.constructor.apply(this, arguments);
      return _ref24;
    }

    RadioButtons.prototype.initialize = function() {
      this.set("RadioButtons", "Radio Buttons List", 140, 120);
      this.template = "<div class=\"clearfix\">{#labels}<label class=\"radio\"> <input type=\"radio\" /><span>{.}</span></label>{/labels}</div>";
      this.defaults = {
        data: "Item 1\nItem 2\nItem 3\nItem 4"
      };
      this.defaults[FONT_ALIGN] = "left";
      this.defaults[LINE_HEIGHT] = "30px";
      this.makeHorizontal({
        get: function(c) {
          return _npx(c.e.find("div").height());
        }
      });
      this.props(FONT);
      this.prop(DATA, NON_VISUAL, {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.type.parse(c, value);
        }
      });
      this.addOverlay(LINE_HEIGHT, LINE_HEIGHT_TRANSLATOR);
      this.pwidth.add("text-height-bogus", "@", {
        set: function(c, value) {
          var h, lh;
          h = c.e.find("div").height();
          lh = _npx(c.type.get(LINE_HEIGHT).get(c));
          return c.height = Math.max(h, 3 * lh);
        }
      });
      this.get(LINE_HEIGHT).add("text-height-bogus", "label", {
        set: function(c, value) {
          var check, h, label, v;
          label = c.e.find(this.path);
          check = c.e.find("input");
          v = _npx(value);
          check.css("margin-top", Math.floor((v - 15) / 2));
          label.css(LINE_HEIGHT, _px(value));
          h = Math.max(c.e.find("div").height(), v);
          c.height = h;
          return c.type.pheight.set(c, h);
        }
      });
      return this.events = [
        {
          trigger: OPTION,
          path: "input"
        }
      ];
    };

    RadioButtons.prototype.parse = function(c, data) {
      var cell, html, row, rows, _i, _len;
      rows = data.split('\n');
      html = "<div class=\"clearfix\">";
      for (_i = 0, _len = rows.length; _i < _len; _i++) {
        row = rows[_i];
        cell = _label(row);
        html += "<label class=\"radio\"><input type=\"radio\" name=\"" + c.id + "\" /><span>" + cell + "</span></label>";
      }
      html += "</div>";
      c.e.empty().append($(html));
      return c.setAll();
    };

    RadioButtons.prototype.enhance = function(component, container) {
      return new DataEditorCover(component, container);
    };

    RadioButtons.prototype.getDataItemAt = function(component, index) {
      var data, row, rows;
      data = component.get(DATA);
      if (data == null) {
        return "";
      }
      rows = data.split('\n');
      if (index >= rows.length) {
        return "";
      }
      row = rows[index];
      return row;
    };

    RadioButtons.prototype.getEventItem = function(event) {
      return $(event.target).parent().find("span").text();
    };

    return RadioButtons;

  })(ComponentType);

  register(new RadioButtons());

  ComboBox = (function(_super) {
    __extends(ComboBox, _super);

    function ComboBox() {
      _ref25 = ComboBox.__super__.constructor.apply(this, arguments);
      return _ref25;
    }

    ComboBox.prototype.initialize = function() {
      this.set("ComboBox", "ComboBox", 140, 32);
      this.template = "<div class=\"btn-group\">\n<button type=\"button\" class=\"btn combobox-value\">Select...</button>\n<button type=\"button\" class=\"btn dropdown-toggle\" data-toggle=\"dropdown\">\n  <span class=\"caret\"></span>\n</button>\n<ul class=\"dropdown-menu\" role=\"menu\"></ul>\n</div>";
      this.defaults = {
        data: "Select option\nItem 1\nItem 2\nItem 3\nItem 4"
      };
      this.props(FONT, "button.btn:first-child, ul");
      this.props([BORDER, BACKGROUND_COLOR], "button.btn");
      this.prop(BORDER_COLOR, "button.btn", {
        set: function(c, value) {
          c.properties[this.name] = value;
          c.e.find(this.path).css(BORDER_COLOR, value);
          return c.e.find(".caret").css("border-top-color", value);
        }
      });
      this.prop(BORDER_RADIUS, "button.btn:first-child", {
        set: function(c, value) {
          c.properties[this.name] = value;
          c.e.find(this.path).css("border-top-left-radius", value).css("border-bottom-left-radius", value);
          return c.e.find(".dropdown-toggle").css("border-top-right-radius", value).css("border-bottom-right-radius", value);
        }
      });
      this.prop(DATA, NON_VISUAL, {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.type.parse(c, value);
        }
      });
      this.pwidth.add("selected-option", "button.btn:first-child", {
        set: function(c, value) {
          var v;
          v = _npx(value) - 25;
          return c.e.find(this.path).css("width", v);
        }
      });
      this.addOverlay(BORDER_RADIUS, BORDER_RADIUS_TRANSLATOR);
      return this.events = [
        {
          trigger: OPTION,
          path: "a"
        }
      ];
    };

    ComboBox.prototype.parse = function(c, data) {
      var cell, html, index, row, rows, text, _i, _len;
      rows = data.split('\n');
      html = "";
      text = "";
      for (index = _i = 0, _len = rows.length; _i < _len; index = ++_i) {
        row = rows[index];
        if (index === 0) {
          text = _label(row);
        }
        if (index === 0) {
          continue;
        }
        cell = _label(row);
        html += "<li><a href=\"#\">" + cell + "</a></li>";
      }
      c.e.find("ul").empty().append(html);
      return c.e.find(".combobox-value").html(text);
    };

    ComboBox.prototype.render = function(component) {
      component.e.find(".dropdown-toggle").dropdown();
      return component.e.on('click', 'a', function(event) {
        var $parent, $this, value;
        $this = $(this);
        value = $this.html();
        $parent = $this.parents(".Component");
        $parent.find(".combobox-value").html(value);
        return $this.trigger(OPTION.event);
      });
    };

    ComboBox.prototype.enhance = function(component, container) {
      return new DataEditorCover(component, container);
    };

    ComboBox.prototype.getDataItemAt = function(component, index) {
      var data, row, rows;
      data = component.get(DATA);
      if (data == null) {
        return "";
      }
      rows = data.split('\n');
      if (index >= rows.length - 1) {
        return "";
      }
      row = rows[index + 1];
      return row;
    };

    ComboBox.prototype.getEventItem = function(event) {
      return $(event.target).text();
    };

    return ComboBox;

  })(ComponentType);

  register(new ComboBox());

  DateField = (function(_super) {
    __extends(DateField, _super);

    function DateField() {
      _ref26 = DateField.__super__.constructor.apply(this, arguments);
      return _ref26;
    }

    DateField.prototype.initialize = function() {
      this.set("DateField", "Date Field", 80, 32);
      this.template = "<input class=\"form-control\" type=\"text\" value=\"{label}\" /><i class=\"fa fa-calendar\"></i>";
      this.defaults = {
        label: _$("08/16/2013")
      };
      this.defaults[FONT_ALIGN] = "left";
      this.props([FONT, BORDER], "input");
      this.prop(BACKGROUND_COLOR, "input");
      this.prop(BORDER_RADIUS, "input");
      this.prop(BORDER_COLOR, "input", {
        set: function(c, value) {
          c.properties[this.name] = value;
          c.e.find(this.path).css(BORDER_COLOR, value);
          return c.e.find("i").css("color", value);
        }
      });
      this.pheight.add("calendarposition", "i", {
        set: function(c, value) {
          var top;
          top = _px(_npx(value) / 2 - 12);
          return c.e.find(this.path).css("top", top);
        }
      });
      this.prop(LABEL, "input", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.e.find(this.path).val(value);
        }
      });
      return this.events = [
        {
          trigger: CHANGE
        }
      ];
    };

    DateField.prototype.render = function(component) {
      return component.e.find("input").datepicker({
        format: 'mm-dd-yyyy'
      });
    };

    return DateField;

  })(ComponentType);

  register(new DateField());

  DateChooser = (function(_super) {
    __extends(DateChooser, _super);

    function DateChooser() {
      _ref27 = DateChooser.__super__.constructor.apply(this, arguments);
      return _ref27;
    }

    DateChooser.prototype.initialize = function() {
      this.set("DateChooser", "Date Picker", 230, 230);
      this.template = "<div data-date=\"18-08-2013\" data-date-format=\"dd-mm-yyyy\" class=\"clearfix\"></div>";
      this.defaults = {
        label: _$("08/16/2013")
      };
      this.defaults[FONT_ALIGN] = "left";
      this.props([FONT, BORDER], "div");
      this.prop(BORDER_COLOR, "div", {
        set: function(c, value) {
          c.properties[this.name] = value;
          c.e.find(this.path).css(BORDER_COLOR, value);
          value = Color(value).darkenByRatio(0.2);
          c.css(".datepicker .active", BACKGROUND_COLOR, value.toCSS());
          c.css(".datepicker .active", "color", value.lightenByAmount(1).toCSS());
          c.css("div", "display", "inline-block");
          return c.css("div", "float", "left");
        }
      });
      this.prop(BACKGROUND_COLOR, "div");
      this.prop(BORDER_RADIUS, "div");
      this.addOverlay(BORDER_RADIUS, BORDER_RADIUS_TRANSLATOR);
      this.pwidth.add('height');
      return this.makeHorizontal({
        get: function(c) {
          return _npx(c.e.outerHeight());
        }
      });
    };

    DateChooser.prototype.render = function(component) {
      component.e.find("div").datepicker();
      component.e.find("table").removeClass("table-condensed");
      return component.measure();
    };

    return DateChooser;

  })(ComponentType);

  register(new DateChooser());

  Progress = (function(_super) {
    __extends(Progress, _super);

    function Progress() {
      _ref28 = Progress.__super__.constructor.apply(this, arguments);
      return _ref28;
    }

    Progress.prototype.initialize = function() {
      this.set("ProgressBar", "Progress Bar", 220, 20);
      this.template = "<div class=\"progress\"><div class=\"progress-bar\" style=\"width: {progress}%;\"></div></div>  ";
      this.defaults = {
        progress: 50,
        "border-radius": "4px"
      };
      this.prop(BORDER_RADIUS, "div.progress, .progress-bar");
      this.prop(BORDER_COLOR, "div.progress", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.e.find(this.path).css(BACKGROUND_COLOR, value);
        }
      });
      this.prop(BACKGROUND_COLOR, "div.progress-bar");
      this.prop("progress", "div.progress-bar", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.e.find(this.path).width("" + value + "%");
        }
      });
      this.addOverlay(BORDER_RADIUS, BORDER_RADIUS_TRANSLATOR);
      return this.addOverlay("progress", {
        recompute: false,
        getRange: function(c, r) {
          return r.maxx = c.width;
        },
        toPosition: function(v, p, c) {
          return p.x = Math.round(c.width * _npx(v) / 100);
        },
        toValue: function(p, c) {
          return Math.round(_npx(p.x) / c.width * 100);
        }
      });
    };

    return Progress;

  })(ComponentType);

  register(new Progress());

  HSLICE_TRANSLATOR = {
    recompute: false,
    getRange: function(c, r) {
      return r.maxx = Math.floor(c.width / 2);
    },
    toPosition: function(v, p) {
      return p.x = v;
    },
    toValue: function(p, c) {
      return p.x;
    }
  };

  VSLICE_TRANSLATOR = {
    recompute: false,
    getRange: function(c, r) {
      return r.maxy = Math.floor(c.height / 2);
    },
    toPosition: function(v, p) {
      return p.y = v;
    },
    toValue: function(p, c) {
      return p.y;
    }
  };

  Group = (function(_super) {
    __extends(Group, _super);

    function Group() {
      _ref29 = Group.__super__.constructor.apply(this, arguments);
      return _ref29;
    }

    Group.prototype.initialize = function() {
      this.set("group", "Group", 150, 250);
      this.template = "<div></div>";
      this.defaults = {};
      this.defaults["hslice"] = "10px";
      this.defaults["vslice"] = "10px";
      this.prop("vslice");
      this.prop("hslice");
      _.extend(this.pheight, {
        set: function(c, v) {
          var _ref30;
          if ((_ref30 = c.page) != null ? _ref30.project.indesigner : void 0) {
            return c.e.css("height", v);
          } else {
            return c.e.css("height", 0);
          }
        }
      });
      this.prop("pinned", {
        set: function(c, value) {
          c.properties[this.name] = value;
          if (value) {
            return c.e.addClass("group-pinned");
          } else {
            return c.e.removeClass("group-pinned");
          }
        }
      });
      this.addOverlay("hslice", HSLICE_TRANSLATOR);
      this.addOverlay("vslice", VSLICE_TRANSLATOR);
      return this.events = [
        {
          trigger: GROUP_CLICK
        }, {
          trigger: MOUSE_ENTER
        }, {
          trigger: CUSTOM_EVENT
        }
      ];
    };

    Group.prototype.render = function(component) {
      return component.computeSize();
    };

    Group.prototype.enhance = function(component, container) {};

    Group.prototype.$new = function(definition, page) {
      var component, elm;
      if (definition == null) {
        definition = {
          x: 0,
          y: 0,
          width: this.width,
          height: this.height,
          visible: true
        };
      }
      component = new ComponentGroup(this, definition, page);
      elm = this.compile(component, definition);
      return component;
    };

    Group.prototype.compile = function(component, definition) {
      var container, elm;
      elm = Group.__super__.compile.call(this, component, definition);
      container = $("<div class=\"component-group-container\"></div>");
      elm.append(container);
      container.css({
        top: -component.y,
        left: -component.x
      });
      component.container = container;
      return elm;
    };

    Group.prototype.render = function(component) {
      var pinned;
      component.e.on("click", function(event) {
        var $parent, $target;
        $target = $(event.target);
        if ($target.parents(".Component.TextInput,.Component.PasswordInput,.Component.TextArea,.Component.CheckBox,.Component.CheckBoxList,.Component.RadioButtons").length === 0) {
          event.preventDefault();
          $parent = $target;
          if (!$target.is(".group.Component")) {
            $parent = $target.parents(".group.Component").first();
          }
          $parent.trigger(GROUP_CLICK.event);
          return false;
        }
        return true;
      });
      pinned = ("" + (component.get(PINNED))) === "true";
      if (pinned) {
        return component.e.addClass("group-pinned");
      }
    };

    Group.prototype.getDataItemAt = function(component, index) {
      var action, actionItems, c, event, events, item, items, list, trigger, triggers, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref30, _ref31;
      items = [];
      _ref30 = component.components;
      for (_i = 0, _len = _ref30.length; _i < _len; _i++) {
        c = _ref30[_i];
        events = c.type.events;
        for (_j = 0, _len1 = events.length; _j < _len1; _j++) {
          event = events[_j];
          triggers = c.behaviors.getEvents(event.trigger);
          for (_k = 0, _len2 = triggers.length; _k < _len2; _k++) {
            trigger = triggers[_k];
            list = c.behaviors.list(trigger);
            if ((list == null) || (list.actions == null)) {
              continue;
            }
            _ref31 = list.actions;
            for (_l = 0, _len3 = _ref31.length; _l < _len3; _l++) {
              action = _ref31[_l];
              if (action.type === BEHAVIOR_TRIGGER_EVENT) {
                if (action.events != null) {
                  actionItems = action.events.split(",");
                  for (_m = 0, _len4 = actionItems.length; _m < _len4; _m++) {
                    item = actionItems[_m];
                    items.push(_.trim(item));
                  }
                }
              }
            }
          }
        }
      }
      if (items.length > index) {
        return items[index];
      } else {
        return "event name";
      }
    };

    Group.prototype.getEventItem = function(event) {
      return "";
    };

    return Group;

  })(ComponentType);

  register(new Group());

  bpts = ["desktop", "tablet", "phone"];

  ComponentGroup = (function(_super) {
    __extends(ComponentGroup, _super);

    function ComponentGroup(type, definition, page) {
      this.type = type;
      this.definition = definition;
      this.page = page;
      ComponentGroup.__super__.constructor.call(this, this.type, this.definition, this.page);
    }

    ComponentGroup.prototype.add = function(c, index) {
      if (index == null) {
        index = -1;
      }
      if (this.components == null) {
        this.components = [];
      }
      if (index < 0 || index > this.components.length - 1) {
        index = this.components.length;
      }
      this.components.splice(index, 0, c);
      this.container.append(c.e);
      c._updateCss();
      c.page = this.page;
      c.parent = this;
      return this.page.project.trigger(ACT_ADD_COMPONENT, c, index);
    };

    ComponentGroup.prototype.remove = function(components) {
      var c, cs, _i, _len;
      cs = components;
      if (!_.isArray(cs)) {
        cs = [components];
      }
      for (_i = 0, _len = cs.length; _i < _len; _i++) {
        c = cs[_i];
        c["delete"]();
      }
      this.page.project.trigger(ACT_REMOVE_COMPONENT, cs);
      return this;
    };

    ComponentGroup.prototype["delete"] = function() {
      ComponentGroup.__super__["delete"].call(this);
      if (this.components != null) {
        return this.remove(this.components.splice());
      }
    };

    ComponentGroup.prototype.oldIds = function() {
      var component, _i, _len, _ref30, _results;
      _ref30 = this.components;
      _results = [];
      for (_i = 0, _len = _ref30.length; _i < _len; _i++) {
        component = _ref30[_i];
        component.oldId = component.id;
        delete component.page.project.repository[component.id];
        component.id = null;
        if (component.type.type === "group") {
          _results.push(component.oldIds());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    ComponentGroup.prototype.computeSize = function() {
      var b, bp, c, d, dc, h, rp, _i, _j, _len, _len1, _ref30, _ref31, _ref32, _ref33, _ref34, _ref35, _ref36, _ref37, _ref38, _ref39;
      if ((this.components == null) || this.components.length === 0) {
        _ref30 = [0, 0, 0, 0], this.x = _ref30[0], this.y = _ref30[1], this.width = _ref30[2], this.height = _ref30[3];
        this.e.css({
          left: this.x,
          top: this.y
        });
        if (this.container != null) {
          this.container.css({
            left: -this.x,
            top: -this.y
          });
        }
        return this;
      }
      if (this.definition.desktop == null) {
        this.definition.desktop = {};
      }
      if (this.definition.tablet == null) {
        this.definition.tablet = {};
      }
      if (this.definition.phone == null) {
        this.definition.phone = {};
      }
      for (_i = 0, _len = bpts.length; _i < _len; _i++) {
        b = bpts[_i];
        d = this.definition[b];
        _ref31 = [100000, 100000, 0, 0], d.x = _ref31[0], d.y = _ref31[1], d.width = _ref31[2], d.height = _ref31[3];
        _ref32 = this.components;
        for (_j = 0, _len1 = _ref32.length; _j < _len1; _j++) {
          c = _ref32[_j];
          if (!c.visible) {
            continue;
          }
          rp = c.resizePolicy();
          if (rp === RESIZE_HORIZONTAL) {
            c.measure();
          }
          dc = c.definition[b];
          _ref33 = [parseInt(dc.x), parseInt(dc.y), parseInt(dc.width), parseInt(dc.height)], dc.x = _ref33[0], dc.y = _ref33[1], dc.width = _ref33[2], dc.height = _ref33[3];
          _ref34 = [Math.min(d.x, dc.x), Math.min(d.y, dc.y)], d.x = _ref34[0], d.y = _ref34[1];
          _ref35 = [Math.max(d.width, dc.x + dc.width), Math.max(d.height, dc.y + dc.height)], d.width = _ref35[0], d.height = _ref35[1];
        }
        _ref36 = [d.width - d.x, d.height - d.y], d.width = _ref36[0], d.height = _ref36[1];
      }
      bp = this.components[0].breakpoint.name;
      d = this.definition[bp];
      _ref37 = [d.x, d.y, d.width, d.height], this.x = _ref37[0], this.y = _ref37[1], this.width = _ref37[2], this.height = _ref37[3];
      if (this.cover != null) {
        _ref38 = [d.x, d.y, d.width, d.height], this.cover.x = _ref38[0], this.cover.y = _ref38[1], this.cover.width = _ref38[2], this.cover.height = _ref38[3];
      }
      h = this.height;
      if (!((_ref39 = this.page) != null ? _ref39.project.indesigner : void 0)) {
        h = 0;
      }
      this.e.css({
        left: this.x,
        top: this.y,
        width: this.width,
        height: h
      });
      if (this.container != null) {
        this.container.css({
          left: -this.x,
          top: -this.y
        });
      }
      return this;
    };

    ComponentGroup.prototype.setBreakpoint = function(breakpoint) {
      var c, _i, _len, _ref30;
      this.breakpoint = breakpoint;
      if (this.components != null) {
        _ref30 = this.components;
        for (_i = 0, _len = _ref30.length; _i < _len; _i++) {
          c = _ref30[_i];
          c.setBreakpoint(this.breakpoint);
        }
      }
      this.computeSize();
      ComponentGroup.__super__.setBreakpoint.call(this, this.breakpoint);
      return this;
    };

    ComponentGroup.prototype.setBreakpointSize = function(breakpoint, x, y, width, height) {
      var c, d, dc, dx, dy, _i, _len, _ref30;
      d = this.definition[breakpoint.name];
      dx = x - d.x;
      dy = y - d.y;
      d.x = x;
      d.y = y;
      if (this.components != null) {
        _ref30 = this.components;
        for (_i = 0, _len = _ref30.length; _i < _len; _i++) {
          c = _ref30[_i];
          dc = c.definition[breakpoint.name];
          c.setBreakpointSize(breakpoint, dc.x + dx, dc.y + dy, dc.width, dc.height);
        }
      }
      return this;
    };

    ComponentGroup.prototype.move = function(x, y) {
      var c, dx, dy, _i, _len, _ref30;
      dx = x - this.x;
      dy = y - this.y;
      _ref30 = this.components;
      for (_i = 0, _len = _ref30.length; _i < _len; _i++) {
        c = _ref30[_i];
        c.move(c.x + dx, c.y + dy);
      }
      ComponentGroup.__super__.move.call(this, x, y);
      return this.container.css({
        left: -this.x,
        top: -this.y
      });
    };

    ComponentGroup.prototype.resize = function(x, y, width, height) {
      var b, c, ch, cw, cx, cy, dh, dw, g, nb, nr, r, sx, sy, _i, _len, _ref30;
      dw = width / this.width;
      dh = height / this.height;
      sx = _npx(this.get("hslice"));
      sy = _npx(this.get("vslice"));
      r = this.x + this.width;
      nr = x + width;
      b = this.y + this.height;
      nb = y + height;
      _ref30 = this.components;
      for (_i = 0, _len = _ref30.length; _i < _len; _i++) {
        c = _ref30[_i];
        cx = c.x;
        if (c.x > this.x + sx) {
          cx = x + dw * (c.x - this.x);
        } else if (c.x < r - sx) {
          g = c.x - this.x;
          cx = x + g;
        }
        cy = c.y;
        if (c.y > this.y + sy) {
          cy = y + dh * (c.y - this.y);
        } else if (c.y < b - sy) {
          g = c.y - this.y;
          cy = y + g;
        }
        cw = c.width;
        if (c.x + c.width > this.x + sx) {
          if (c.x + c.width < r - sx) {
            cw = dw * c.width;
          } else if (c.x < r - sx) {
            g = Math.max(0, r - (c.x + c.width));
            cw = nr - g - cx;
          } else {
            cx = c.x + nr - r;
          }
        }
        ch = c.height;
        if (c.y + c.height > this.y + sy) {
          if (c.y + c.height < b - sy) {
            ch = dh * c.height;
          } else if (c.y < b - sy) {
            g = Math.max(0, b - (c.y + c.height));
            ch = nb - g - cy;
          } else {
            cy = c.y + nb - b;
          }
        }
        c.resize(Math.round(cx), Math.round(cy), Math.round(cw), Math.round(ch));
      }
      ComponentGroup.__super__.resize.call(this, x, y, width, height);
      return this.container.css({
        left: -this.x,
        top: -this.y
      });
    };

    ComponentGroup.prototype.resizeFrom = function(breakpoint) {
      var bd, c, _i, _len, _ref30;
      _ref30 = this.components;
      for (_i = 0, _len = _ref30.length; _i < _len; _i++) {
        c = _ref30[_i];
        bd = c.definition[breakpoint.name];
        if (c.type.type === "group") {
          c.resizeFrom(breakpoint);
        } else {
          c.resize(bd.x, bd.y, bd.width, bd.height);
          c.type.prop(FONT_SIZE).set(c, c.type.prop(FONT_SIZE).getByBreakpoint(c, breakpoint));
        }
      }
      this.computeSize();
      this.trigger("resize");
      return this;
    };

    ComponentGroup.prototype.addCoords = function(coords) {
      var b, c, d, _i, _j, _len, _len1, _ref30;
      _ref30 = this.components;
      for (_i = 0, _len = _ref30.length; _i < _len; _i++) {
        c = _ref30[_i];
        coords.push("" + c.id + ";" + c.breakpoint.name + ";" + c.x + ";" + c.y + ";" + c.width + ";" + c.height);
        for (_j = 0, _len1 = bpts.length; _j < _len1; _j++) {
          b = bpts[_j];
          if (b !== c.breakpoint.name) {
            d = c.definition[b];
            if (d.virgin) {
              coords.push("" + c.id + ";" + b + ";" + d.x + ";" + d.y + ";" + d.width + ";" + d.height);
            }
          }
        }
        if (c.type.type === 'group') {
          c.addCoords(coords);
        }
      }
      return coords;
    };

    ComponentGroup.prototype.updateComponentIds = function(newids) {
      var c, _i, _len, _ref30;
      _ref30 = this.components;
      for (_i = 0, _len = _ref30.length; _i < _len; _i++) {
        c = _ref30[_i];
        c.setId(newids.components[c.oldId]);
        if (c.type.type === "group") {
          c.updateComponentIds(newids);
        }
      }
      return this;
    };

    ComponentGroup.prototype.updateBehaviorIds = function(newids) {
      var c, _i, _len, _ref30;
      _ref30 = this.components;
      for (_i = 0, _len = _ref30.length; _i < _len; _i++) {
        c = _ref30[_i];
        if (c.type.type === "group") {
          c.updateBehaviorIds(newids);
        }
        c.behaviors.updateIds(newids);
      }
      return this;
    };

    ComponentGroup.prototype.firstLabelEditable = function() {
      var c, components, p, _i, _len;
      components = this.components.slice(0).reverse();
      for (_i = 0, _len = components.length; _i < _len; _i++) {
        c = components[_i];
        p = c.get(LABEL);
        if (p != null) {
          return c;
        }
      }
      return null;
    };

    ComponentGroup.prototype.addPinMark = function() {
      var pinned;
      pinned = ("" + (this.get(PINNED))) === "true";
      if (pinned && (this.cover != null)) {
        return this.cover.addMark(".fa.fa-thumb-tack");
      }
    };

    ComponentGroup.prototype.getDepth = function() {
      var depth, p, _ref30;
      depth = 1;
      p = this.parent;
      while ((p != null ? (_ref30 = p.type) != null ? _ref30.type : void 0 : void 0) === "group") {
        p = p.parent;
        depth += 1;
      }
      return depth;
    };

    return ComponentGroup;

  })(Component);

  IPhonePointyButton = (function(_super) {
    __extends(IPhonePointyButton, _super);

    function IPhonePointyButton() {
      _ref30 = IPhonePointyButton.__super__.constructor.apply(this, arguments);
      return _ref30;
    }

    IPhonePointyButton.prototype.initialize = function() {
      this.set("IPhonePointyButton", "IPhone Pointy Button", 64, 32);
      this.template = "<div class=\"back\"><i class=\"before\"></i><span>{label}</span><i class=\"after\"></i></div>";
      this.defaults = {
        label: _$("Button")
      };
      this.defaults[FONT_ALIGN] = "center";
      this.props(FONT);
      this.prop(BORDER_COLOR, "div", {
        set: function(c, value) {
          var div;
          c.properties[this.name] = value;
          div = c.e.find(this.path);
          div.css("border-color", value);
          if (div.is(".back")) {
            return div.find("i").css("border-left-color", value);
          } else if (div.is(".next")) {
            return div.find("i").css("border-right-color", value);
          }
        }
      });
      this.prop(BACKGROUND_COLOR, "div", {
        set: function(c, value) {
          var bottom, color, div, middle;
          color = Color(value);
          middle = color.darkenByAmount(.06).toString();
          bottom = color.darkenByAmount(.06).toString();
          c.properties[this.name] = value;
          div = c.e.find(this.path);
          div.prefixcss("background-image", "linear-gradient(top, " + value + " 0%, " + middle + " 60%, " + bottom + " 100%)");
          if (div.is(".back")) {
            div.find("i.after").prefixcss("background-image", "linear-gradient(top, " + value + " 0%, " + value + " 1%, " + middle + " 100%)");
            return div.find("i.before").prefixcss("background-image", "linear-gradient(top, " + middle + " 0%, " + middle + " 10%, " + bottom + " 100%)");
          } else if (div.is(".next")) {
            div.find("i.before").prefixcss("background-image", "linear-gradient(top, " + value + " 0%, " + value + " 1%, " + middle + " 100%)");
            return div.find("i.after").prefixcss("background-image", "linear-gradient(top, " + middle + " 0%, " + middle + " 10%, " + bottom + " 100%)");
          }
        }
      });
      this.pwidth.add('button-padding', "div", {
        set: function(c, value) {
          return c.e.find("div").width(_npx(value) - 10);
        }
      });
      return this.prop(LABEL, "span", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.e.find(this.path).html(value);
        }
      });
    };

    IPhonePointyButton.prototype.render = function(component) {};

    IPhonePointyButton.prototype.isTextEditable = function() {
      return true;
    };

    IPhonePointyButton.prototype.configureEditor = function(config) {
      return config.property = this.get(LABEL);
    };

    return IPhonePointyButton;

  })(ComponentType);

  IPHONE_CHECK_TRANSLATOR = {
    recompute: false,
    getRange: function(c, r) {
      return r.maxx = 10;
    },
    toPosition: function(v, p) {
      return p.x = v;
    },
    toValue: function(p, c) {
      var v;
      v = _npx(p.x);
      if (v < 5) {
        return "Off";
      } else {
        return "On";
      }
    }
  };

  IPhoneCheckBox = (function(_super) {
    __extends(IPhoneCheckBox, _super);

    function IPhoneCheckBox() {
      _ref31 = IPhoneCheckBox.__super__.constructor.apply(this, arguments);
      return _ref31;
    }

    IPhoneCheckBox.prototype.initialize = function() {
      this.set("IPhoneCheckBox", "IPhone Switch", 40, 22);
      this.template = "<label><input type=\"checkbox\" checked=\"checked\" class=\"ios-switch\"  /><div><div></div></div></label>";
      this.defaults = {
        "background-color": "#047DB7",
        "selected": "On"
      };
      this.prop(BACKGROUND_COLOR, "div", {
        set: function(c, value) {
          var border, color;
          color = Color(value);
          border = color.darkenByAmount(.1).toString();
          c.properties[this.name] = value;
          c.css("input[type=\"checkbox\"].ios-switch:checked + div", "background-color", color.toString());
          c.css("input[type=\"checkbox\"].ios-switch:checked + div", "border", "1px solid " + border);
          return c.css("input[type=\"checkbox\"].ios-switch:checked + div > div", "box-shadow", "0px 2px 5px rgba(0, 0, 0, 0.3), 0px 0px 0 1px " + border);
        }
      });
      this.prop("selected", NON_VISUAL, {
        set: function(c, value) {
          if (value === "Off") {
            return c.e.find("input[type='checkbox']").prop('checked', false);
          } else {
            return c.e.find("input[type='checkbox']").prop('checked', true);
          }
        }
      });
      this.makeHorizontal({
        get: function(c) {
          var h;
          h = Math.round(c.width / 2) + 2;
          return h;
        }
      });
      this.pwidth.add('theheight', "div", {
        set: function(c, value) {
          return c.e.height(Math.round(_npx(value) / 2) + 2);
        }
      });
      this.addOverlay("selected", IPHONE_CHECK_TRANSLATOR);
      return this.events = [
        {
          trigger: CHECKED
        }, {
          trigger: UNCHECKED
        }, {
          trigger: TOGGLE
        }
      ];
    };

    IPhoneCheckBox.prototype.render = function(component) {
      return component.e.find("input").on("change", function(event) {
        var $parent, $this;
        $this = $(this);
        $parent = $this.parents(".Component");
        if (this.checked) {
          $parent.trigger(CHECKED.event);
        } else {
          $parent.trigger(UNCHECKED.event);
        }
        return $parent.trigger(TOGGLE.event);
      });
    };

    return IPhoneCheckBox;

  })(ComponentType);

  register(new IPhoneCheckBox());

  if (typeof Dropzone !== "undefined" && Dropzone !== null) {
    Dropzone.autoDiscover = false;
  }

  Image = (function(_super) {
    var BUCKET, IMAGE_UPLOAD_LOCAL, IMAGE_UPLOAD_REMOTE;

    __extends(Image, _super);

    function Image() {
      _ref32 = Image.__super__.constructor.apply(this, arguments);
      return _ref32;
    }

    BUCKET = "fb-web-1936285";

    IMAGE_UPLOAD_REMOTE = "https://s3.amazonaws.com/" + BUCKET + "/images/";

    IMAGE_UPLOAD_LOCAL = "images/";

    Image.prototype.initialize = function() {
      var hset;
      this.set("Image", "Image", 100, 100);
      this.template = "<div></div><img width=\"100%\"></img>";
      this.defaults = {};
      this.defaults[BACKGROUND_COLOR] = "#cccccc";
      hset = this.pheight.set;
      _.extend(this.pheight, {
        get: function(c) {
          if (c.get(SOURCE) != null) {
            return _npx(c.e.find("img").height());
          } else {
            return c.height;
          }
        },
        set: function(c, v) {
          if (c.get(SOURCE) != null) {
            c.e.css("height", v);
            return c.height = _npx(v);
          } else {
            return hset.call(this, c, v);
          }
        }
      });
      this.prop(BORDER_COLOR);
      this.prop(BACKGROUND_COLOR, "div");
      this.prop(SOURCE, "img", {
        set: function(c, value) {
          c.properties[this.name] = value;
          if (value != null) {
            c.e.find("img").css("display", "").attr("src", c.type.getUrl(value, c.page.project.public_key));
            c.e.find("div").css("display", "none");
            return c.e.css('border-width', 0);
          } else {
            c.e.find("img").css("display", "none");
            c.e.find("div").css("display", "");
            return c.e.css('border-width', 'auto');
          }
        }
      });
      this.prop(BORDER_RADIUS, "img", {
        set: function(c, value) {
          var v;
          c.properties[this.name] = value;
          c.e.find("img").css(this.name, value);
          c.e.css(this.name, value);
          v = Math.max(_npx(value) - 2, 0);
          return c.e.find("div").css(this.name, v);
        }
      });
      this.addOverlay(BORDER_RADIUS, BORDER_RADIUS_TRANSLATOR);
      return this.events = [
        {
          trigger: CLICK
        }, {
          trigger: MOUSE_ENTER
        }
      ];
    };

    Image.prototype.enhance_not = function(component, container) {
      var cover, dropzone,
        _this = this;
      cover = $("<div style=\"width:100%;height:100%;\"></div>");
      container.append(cover);
      dropzone = new Dropzone(cover.get(0), {
        url: "/upload/image?id=" + component.id + "&project=" + component.page.project.id,
        clickable: false,
        createImageThumbnails: false
      });
      dropzone.on('success', function() {
        return alert("File uploaded!");
      });
      return cover.on("mousedown", function(event) {
        var local;
        event.preventDefault();
        local = eventLocal(event);
        cover.resizeTool.doStartDrag(local);
        return false;
      });
    };

    Image.prototype.getUrl = function(img, project_folder) {
      var url;
      url = "";
      if (window["HTML_EXPORT"] === true) {
        url += IMAGE_UPLOAD_LOCAL + img;
      } else {
        url += IMAGE_UPLOAD_REMOTE + project_folder + "/assets/" + img;
      }
      return url;
    };

    Image.prototype.$new = function(definition, page) {
      var component;
      component = Image.__super__.$new.call(this, definition, page);
      component.resizePolicy = function() {
        var img;
        img = component.get(SOURCE);
        if (img != null) {
          return RESIZE_HORIZONTAL;
        } else {
          return RESIZE_ALL;
        }
      };
      return component;
    };

    return Image;

  })(ComponentType);

  register(new Image());

  ICON = "icon";

  ICON_PICKER = null;

  Icon = (function(_super) {
    __extends(Icon, _super);

    function Icon() {
      _ref33 = Icon.__super__.constructor.apply(this, arguments);
      return _ref33;
    }

    Icon.prototype.initialize = function() {
      this.set("Icon", "Icon", 24, 24);
      this.template = "<i class=\"{icon}\"></i>";
      this.defaults = {
        icon: "fa fa-camera-retro"
      };
      this.defaults[BACKGROUND_COLOR] = "#000000";
      this.prop(BACKGROUND_COLOR, "i", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.e.find(this.path).css("color", value);
        }
      });
      this.pwidth.add("font-size", "i");
      this.makeHorizontal({
        get: function(c) {
          return _npx(c.e.find("i").height());
        }
      });
      this.prop(ICON, "i", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.e.find(this.path).attr("class", value);
        }
      });
      return this.events = [
        {
          trigger: CLICK
        }, {
          trigger: MOUSE_ENTER
        }
      ];
    };

    Icon.prototype.enhance = function(component, container) {
      var cover,
        _this = this;
      cover = $("<div style=\"width:100%;height:100%;\">&nbsp;</div>");
      container.append(cover);
      cover.on('dblclick', function(event) {
        if (ICON_PICKER == null) {
          ICON_PICKER = new IconPicker();
        }
        return ICON_PICKER.show(function(icon) {
          var data, i, oldValue, selection;
          i = component.e.find("i");
          oldValue = i.attr("class");
          component.properties[ICON] = icon;
          i.attr("class", icon);
          data = {
            name: ICON,
            oldValue: [oldValue],
            newValue: icon
          };
          selection = cover.resizeTool.selection;
          selection.push(ACTION_UPDATE, data);
          return selection.page.project.trigger(CMD_UPDATE, selection, data);
        });
      });
      return cover.on("mousedown", function(event) {
        var local, offset;
        event.preventDefault();
        offset = container.offset();
        local = {
          x: event.pageX - offset.left,
          y: event.pageY - offset.top
        };
        cover.resizeTool.doStartDrag(local);
        return false;
      });
    };

    return Icon;

  })(ComponentType);

  register(new Icon());

  ICON_PICKER = null;

  IconPicker = (function() {
    function IconPicker() {
      var html, icon, _i, _j, _len, _len1,
        _this = this;
      this.wrapper = $("<div class=\"iconpicker-palette-wrapper\" style=\"display: none;\"></div>");
      this.wrapper.appendTo($("body"));
      html = "<div class=\"iconpicker-palette\"><div class=\"iconpicker-searchbar\">\n	<input type=\"text\" class=\"form-control\" placeholder=\"Search...\">\n</div><div class=\"iconpicker-icons\">";
      for (_i = 0, _len = FONT_AWESOME_ICONS.length; _i < _len; _i++) {
        icon = FONT_AWESOME_ICONS[_i];
        html += "<i class=\"fa " + icon + " fa-2x\" icon=\"fa " + icon + "\" title=\"" + icon + "\"></i>";
      }
      html += "<div style=\"width:100%\"></div>";
      for (_j = 0, _len1 = IONICONS_ICONS.length; _j < _len1; _j++) {
        icon = IONICONS_ICONS[_j];
        html += "<i class=\"ion-" + icon + " fa-2x\" icon=\"ion-" + icon + "\" title=\"" + icon + "\"></i>";
      }
      html += "</div></div>";
      this.palette = $(html);
      this.palette.appendTo(this.wrapper);
      this.icons = this.palette.find("i");
      this.palette.on('click', 'i', function(event) {
        icon = $(event.target).attr("icon");
        _this.handler(icon);
        return _this.hide();
      });
      this.palette.find("input").on('keyup', function(event) {
        var dontmatch, input, match, value;
        if (event.which === 27) {
          _this.hide();
        }
        input = $(event.target);
        value = $.trim(input.val());
        if ((value == null) || value.length === 0) {
          _this.icons.show();
          return;
        }
        match = _this.icons.filter("i[title*='" + value + "']");
        match.show();
        dontmatch = _this.icons.not("i[title*='" + value + "']");
        return dontmatch.hide();
      });
    }

    IconPicker.prototype.show = function(handler) {
      this.handler = handler;
      this.wrapper.css("display", "block");
      return this.palette.find("input").focus();
    };

    IconPicker.prototype.hide = function() {
      return this.wrapper.css("display", "none");
    };

    return IconPicker;

  })();

  ShapeType = (function(_super) {
    __extends(ShapeType, _super);

    function ShapeType() {
      _ref34 = ShapeType.__super__.constructor.apply(this, arguments);
      return _ref34;
    }

    ShapeType.prototype.doInitialize = function() {
      this.defaults = {
        label: " "
      };
      this.defaults[FONT_ALIGN] = "center";
      this.template = "{>vlabel:label/}";
      this.props([BACKGROUND_COLOR, [BORDER_COLOR, BORDER_STYLE, BORDER_WIDTH]]);
      this.props(FONT, ".vlabel");
      this.prop(LABEL, VLABEL_PATH, VLABEL_SET);
      return this.events = [
        {
          trigger: CLICK
        }, {
          trigger: MOUSE_ENTER
        }
      ];
    };

    ShapeType.prototype.isTextEditable = function() {
      return true;
    };

    ShapeType.prototype.configureEditor = function(config) {
      config.property = this.get(LABEL);
      return config.multiline = true;
    };

    return ShapeType;

  })(ComponentType);

  Ellipse = (function(_super) {
    __extends(Ellipse, _super);

    function Ellipse() {
      _ref35 = Ellipse.__super__.constructor.apply(this, arguments);
      return _ref35;
    }

    Ellipse.prototype.initialize = function() {
      this.set("Ellipse", "Ellipse", 220, 100);
      return this.doInitialize();
    };

    return Ellipse;

  })(ShapeType);

  register(new Ellipse());

  Rectangle = (function(_super) {
    __extends(Rectangle, _super);

    function Rectangle() {
      _ref36 = Rectangle.__super__.constructor.apply(this, arguments);
      return _ref36;
    }

    Rectangle.prototype.initialize = function() {
      var hset;
      this.set("Rectangle", "Rectangle", 220, 100);
      this.doInitialize();
      this.defaults[BORDER_RADIUS] = "0px";
      this.defaults["label"] = "";
      this.prop(BORDER_RADIUS);
      this.addOverlay(BORDER_RADIUS, BORDER_RADIUS_TRANSLATOR);
      hset = this.pheight.set;
      return _.extend(this.pheight, {
        set: function(c, v) {
          var line_height;
          hset.call(this, c, v);
          line_height = _npx(c.type.get(LINE_HEIGHT).get(c));
          v = _npx(v);
          if (line_height > v) {
            line_height = v - 2 * _npx(c.type.get(BORDER_WIDTH).get(c));
            return c.e.find("div").css('line-height', _px(line_height));
          } else {
            return c.type.get(LINE_HEIGHT).set(c, c.type.get(LINE_HEIGHT).get(c));
          }
        }
      });
    };

    return Rectangle;

  })(ShapeType);

  register(new Rectangle());

  LineHorizontal = (function(_super) {
    __extends(LineHorizontal, _super);

    function LineHorizontal() {
      _ref37 = LineHorizontal.__super__.constructor.apply(this, arguments);
      return _ref37;
    }

    LineHorizontal.prototype.initialize = function() {
      var borderUpdate;
      this.set("LineHorizontal", "Horizontal Line", 100, 11);
      this.template = "<div></div>";
      borderUpdate = {
        set: function(c, value) {
          var top;
          c.properties[this.name] = value;
          top = (this.name + "").replace("-", "-top-");
          return c.e.find("div").css(top, value);
        }
      };
      this.prop(BORDER_COLOR, "div", borderUpdate);
      this.prop(BORDER_STYLE, "div", borderUpdate);
      return this.prop(BORDER_WIDTH, "div", {
        set: function(c, value) {
          var v;
          c.properties[this.name] = value;
          c.e.find("div").css("border-top-width", value);
          v = _npx(value);
          return c.e.css("padding-top", Math.floor((c.height - v) / 2));
        }
      });
    };

    LineHorizontal.prototype.isTextEditable = function() {
      return false;
    };

    return LineHorizontal;

  })(ShapeType);

  register(new LineHorizontal());

  LineVertical = (function(_super) {
    __extends(LineVertical, _super);

    function LineVertical() {
      _ref38 = LineVertical.__super__.constructor.apply(this, arguments);
      return _ref38;
    }

    LineVertical.prototype.initialize = function() {
      var borderUpdate;
      this.set("LineVertical", "Vertical Line", 11, 100);
      this.template = " <div></div> ";
      borderUpdate = {
        set: function(c, value) {
          var left;
          c.properties[this.name] = value;
          left = (this.name + "").replace("-", "-left-");
          return c.e.find("div").css(left, value);
        }
      };
      this.prop(BORDER_COLOR, "div", borderUpdate);
      this.prop(BORDER_STYLE, "div", borderUpdate);
      return this.prop(BORDER_WIDTH, "div", {
        set: function(c, value) {
          var v;
          c.properties[this.name] = value;
          c.e.find("div").css("border-left-width", value);
          v = _npx(value);
          return c.e.css("padding-left", Math.floor((c.width - v) / 2));
        }
      });
    };

    LineVertical.prototype.isTextEditable = function() {
      return false;
    };

    return LineVertical;

  })(ShapeType);

  register(new LineVertical());

  POPOVER_DIRECTIONS = ["tl", "tc", "tr", "rt", "rm", "rb", "br", "bc", "bl", "lb", "lm", "lt"];

  PopOver = (function(_super) {
    __extends(PopOver, _super);

    function PopOver() {
      _ref39 = PopOver.__super__.constructor.apply(this, arguments);
      return _ref39;
    }

    PopOver.prototype.initialize = function() {
      PopOver.__super__.initialize.call(this);
      this.set("PopOver", "PopOver", 200, 150);
      this.rotatable = true;
      this.defaults[DIRECTION] = "tc";
      this.prop(DIRECTION, NON_VISUAL, {
        set: function(c, value) {
          var v;
          v = c.properties[this.name];
          c.properties[this.name] = value;
          return c.e.removeClass(v).addClass(value);
        }
      });
      this.prop(BORDER_COLOR, "div", {
        set: function(c, value) {
          c.properties[this.name] = value;
          c.e.css(this.name, value);
          return c.css(":after", this.name, "" + value + " transparent transparent " + value);
        }
      });
      this.prop(BORDER_WIDTH, "div", {
        set: function(c, value) {
          c.properties[this.name] = value;
          c.e.css(this.name, value);
          return c.css(":after", this.name, value);
        }
      });
      this.prop(BORDER_STYLE, "div", {
        set: function(c, value) {
          c.properties[this.name] = value;
          c.e.css(this.name, value);
          return c.css(":after", this.name, value);
        }
      });
      return this.prop(BACKGROUND_COLOR, "div", {
        set: function(c, value) {
          c.properties[this.name] = value;
          c.e.css(this.name, value);
          return c.css(":after", this.name, value);
        }
      });
    };

    PopOver.prototype.rotate = function(component, direction) {
      var index, p;
      p = component.get(DIRECTION);
      index = POPOVER_DIRECTIONS.indexOf(p);
      if (direction === "right") {
        if (index === POPOVER_DIRECTIONS.length - 1) {
          index = 0;
        } else {
          index = index + 1;
        }
      } else {
        if (index === 0) {
          index = POPOVER_DIRECTIONS.length - 1;
        } else {
          index = index - 1;
        }
      }
      return component.set(DIRECTION, POPOVER_DIRECTIONS[index]);
    };

    return PopOver;

  })(Rectangle);

  register(new PopOver());

  TextBlock = (function(_super) {
    __extends(TextBlock, _super);

    function TextBlock() {
      _ref40 = TextBlock.__super__.constructor.apply(this, arguments);
      return _ref40;
    }

    TextBlock.prototype.initialize = function() {
      var p;
      TextBlock.__super__.initialize.call(this);
      this.set("TextBlock", "TextBlock", 200, 150);
      this.defaults["gap"] = 10;
      this.defaults[LINE_HEIGHT] = 20;
      this.defaults[BACKGROUND_COLOR] = "#999";
      this.prop(BACKGROUND_COLOR, "canvas", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.type.draw(c);
        }
      });
      this.prop(LINE_HEIGHT, "canvas", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.type.draw(c);
        }
      });
      p = this.prop(FONT_SIZE);
      p.add("sub-font-size", "canvas", {
        set: function(c, value) {
          c.properties[this.name] = value;
          return c.type.draw(c);
        }
      });
      this.addOverlay(LINE_HEIGHT, LINE_HEIGHT_TRANSLATOR);
      return this.events = [
        {
          trigger: CLICK
        }, {
          trigger: MOUSE_ENTER
        }
      ];
    };

    TextBlock.prototype.doDraw = function(component, context, w, h) {
      var bgcolor, fs, gap, lh, theheight;
      bgcolor = Color(component.get(BACKGROUND_COLOR));
      lh = _npx(component.get(LINE_HEIGHT));
      fs = _npx(component.get(FONT_SIZE));
      gap = Math.max(lh - fs, 0);
      context.fillStyle = bgcolor.toString();
      h = C0;
      theheight = component.height;
      while (h < theheight) {
        w = component.width;
        if (h + lh > theheight) {
          w = w / 1.61;
        }
        context.fillRect(C0, h, w, fs);
        h += lh;
      }
      return false;
    };

    return TextBlock;

  })(AbstractCanvasComponent);

  register(new TextBlock());

  TextType = (function(_super) {
    __extends(TextType, _super);

    function TextType() {
      _ref41 = TextType.__super__.constructor.apply(this, arguments);
      return _ref41;
    }

    TextType.prototype.doInitialize = function() {
      this.template = " <p>{label}</p> ";
      this.props(FONT);
      this.prop(LABEL, "p", {
        set: function(c, value) {
          c.properties[this.name] = value;
          c.e.find(this.path).html(value);
          return c.measure();
        }
      });
      this.makeHorizontal({
        get: function(c) {
          return _npx(c.e.find("p").height());
        }
      });
      return this.addOverlay(LINE_HEIGHT, LINE_HEIGHT_TRANSLATOR);
    };

    TextType.prototype.isTextEditable = function() {
      return true;
    };

    TextType.prototype.configureEditor = function(config) {
      config.property = this.get(LABEL);
      config.multiline = true;
      return config.align = "top";
    };

    return TextType;

  })(ComponentType);

  Label = (function(_super) {
    __extends(Label, _super);

    function Label() {
      _ref42 = Label.__super__.constructor.apply(this, arguments);
      return _ref42;
    }

    Label.prototype.initialize = function() {
      this.set("Label", "Label", 50, 16);
      this.defaults = {
        label: _$("Label")
      };
      this.defaults[FONT_SIZE] = "13px";
      this.defaults[LINE_HEIGHT] = "20px";
      return this.doInitialize();
    };

    return Label;

  })(TextType);

  register(new Label());

  Title = (function(_super) {
    __extends(Title, _super);

    function Title() {
      _ref43 = Title.__super__.constructor.apply(this, arguments);
      return _ref43;
    }

    Title.prototype.initialize = function() {
      this.set("Title", "Title", 140, 40);
      this.defaults = {
        label: _$("Big Title")
      };
      this.defaults[FONT_SIZE] = "30px";
      this.defaults[LINE_HEIGHT] = "40px";
      return this.doInitialize();
    };

    return Title;

  })(TextType);

  register(new Title());

  Paragraph = (function(_super) {
    __extends(Paragraph, _super);

    function Paragraph() {
      _ref44 = Paragraph.__super__.constructor.apply(this, arguments);
      return _ref44;
    }

    Paragraph.prototype.initialize = function() {
      this.set("Paragraph", "Paragraph", 300, 100);
      this.defaults = {
        label: _$("Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.")
      };
      this.defaults[FONT_SIZE] = "12px";
      return this.doInitialize();
    };

    Paragraph.prototype.configureEditor = function(config) {
      Paragraph.__super__.configureEditor.call(this, config);
      return config.align = "top";
    };

    return Paragraph;

  })(TextType);

  register(new Paragraph());

}).call(this);
;(function() {
  var AbstractAction, AbstractShowLayerAction, BehaviorsFactory, BehaviorsList, BehaviorsMap, ExecuteActionOn, GoToPage, MoveResize, ShowHide, ShowHidePopup, ShowLayer, ShowSidebarMenu, TargetsAction, TriggerEvent, UpdateStyling, UpdateValue,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BehaviorsFactory = (function() {
    function BehaviorsFactory() {
      var behaviors;
      behaviors = {};
    }

    BehaviorsFactory.newAction = function(component, data) {
      var behavior, type;
      behavior = null;
      type = data.type;
      if (type === BEHAVIOR_GOTO_PAGE) {
        behavior = new GoToPage(component, data);
      } else if (type === BEHAVIOR_SHOW_HIDE) {
        behavior = new ShowHide(component, data);
      } else if (type === BEHAVIOR_SHOW_HIDE_POPUP) {
        behavior = new ShowHidePopup(component, data);
      } else if (type === BEHAVIOR_MOVE_RESIZE) {
        behavior = new MoveResize(component, data);
      } else if (type === BEHAVIOR_SHOW_LAYER) {
        behavior = new ShowLayer(component, data);
      } else if (type === BEHAVIOR_SHOW_SIDEBAR_MENU) {
        behavior = new ShowSidebarMenu(component, data);
      } else if (type === BEHAVIOR_UPDATE_VALUE) {
        behavior = new UpdateValue(component, data);
      } else if (type === BEHAVIOR_UPDATE_STYLING) {
        behavior = new UpdateStyling(component, data);
      } else if (type === BEHAVIOR_TRIGGER_EVENT) {
        behavior = new TriggerEvent(component, data);
      } else if (type === BEHAVIOR_ACT_ON) {
        behavior = new ExecuteActionOn(component, data);
      }
      return behavior;
    };

    return BehaviorsFactory;

  })();

  window.BehaviorsFactory = BehaviorsFactory;

  BehaviorsMap = (function() {
    function BehaviorsMap(component, definition) {
      var list, _i, _len;
      this.component = component;
      this.map = {};
      this.events = [];
      for (_i = 0, _len = definition.length; _i < _len; _i++) {
        list = definition[_i];
        this.hasevents = true;
        this.append(list);
      }
    }

    BehaviorsMap.prototype.append = function(listdefinition) {
      var behaviors;
      behaviors = new BehaviorsList(this.component, listdefinition);
      if (listdefinition.oldId) {
        behaviors.oldId = listdefinition.oldId;
      }
      this.map[behaviors.trigger] = behaviors;
      this.events.push(behaviors.trigger);
      return behaviors;
    };

    BehaviorsMap.prototype.add = function(eventid, type) {
      var action, behaviors, name, trigger;
      name = eventid;
      if (eventid.indexOf("#") > -1) {
        name = eventid.substr(0, eventid.indexOf("#"));
      } else {
        eventid = name + "#" + s4();
      }
      trigger = TRIGGERS[name];
      behaviors = this.list(eventid, true);
      action = behaviors.add(type);
      return action;
    };

    BehaviorsMap.prototype.getEvents = function(trigger) {
      var eventid, names, _i, _len, _ref;
      names = [];
      _ref = this.events;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        eventid = _ref[_i];
        if (eventid === trigger.name || eventid.indexOf("" + trigger.name + "#") === 0) {
          names.push(eventid);
        }
      }
      if (trigger.conditional || names.length === 0) {
        names.push(trigger.name);
      }
      return names;
    };

    BehaviorsMap.prototype.get = function(eventid) {
      var behaviors;
      behaviors = this.list(eventid);
      if (behaviors != null) {
        return behaviors.actions;
      } else {
        return [];
      }
    };

    BehaviorsMap.prototype.list = function(eventid, create) {
      var behaviors;
      if (create == null) {
        create = false;
      }
      behaviors = this.map[eventid];
      if ((behaviors == null) && create) {
        behaviors = new BehaviorsList(this.component, {
          event: eventid,
          definition: {
            actions: {}
          }
        });
        this.events.push(behaviors.trigger);
        this.map[behaviors.trigger] = behaviors;
      }
      return behaviors;
    };

    BehaviorsMap.prototype.remove = function(eventid) {
      var behaviors, index;
      behaviors = this.map[eventid];
      if (behaviors != null) {
        index = this.events.indexOf(eventid);
        if (index > -1) {
          this.events.splice(index, 1);
        }
        delete this.map[eventid];
      }
      return behaviors;
    };

    BehaviorsMap.prototype.find = function(eventid, actionid) {
      var a, behaviors, _i, _len, _ref;
      actionid = parseInt(actionid);
      behaviors = this.map[eventid];
      if (behaviors) {
        _ref = behaviors.actions;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          a = _ref[_i];
          if (a.id === actionid) {
            return a;
          }
        }
      }
      return null;
    };

    BehaviorsMap.prototype.checkBehaviorsMark = function() {
      var behaviors, event, _ref;
      if (this.component.cover == null) {
        return;
      }
      _ref = this.map;
      for (event in _ref) {
        behaviors = _ref[event];
        if (behaviors && behaviors.actions.length > 0) {
          this.component.cover.addMark(".fa.fa-bolt");
          return true;
        }
      }
      this.component.cover.removeMark('.fa.fa-bolt');
      return false;
    };

    BehaviorsMap.prototype.clone = function() {
      var definition, eventid, l, theclone, _i, _len, _ref;
      theclone = [];
      _ref = this.events;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        eventid = _ref[_i];
        l = this.list(eventid);
        definition = {
          event: eventid,
          oldId: l.id,
          type: l.type,
          definition: l.buildDefinition()
        };
        theclone.push(definition);
      }
      return theclone;
    };

    BehaviorsMap.prototype.updateIds = function(newids) {
      var a, actions, event, list, newid, s, save, _i, _j, _len, _len1, _ref;
      _ref = this.events;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        list = this.map[event];
        if (list != null) {
          newid = newids.behaviors[list.id];
          if (newid != null) {
            list.id = newids.behaviors[list.id];
          }
          actions = list.actions;
          save = false;
          for (_j = 0, _len1 = actions.length; _j < _len1; _j++) {
            a = actions[_j];
            s = a.updateIds(newids.components);
            if (s) {
              save = s;
            }
          }
          if (save) {
            list.update();
          }
        }
      }
      return this;
    };

    return BehaviorsMap;

  })();

  window.BehaviorsMap = BehaviorsMap;

  window.BehaviorsMapMock = (function() {
    function BehaviorsMapMock() {}

    BehaviorsMapMock.prototype.checkBehaviorsMark = function() {};

    BehaviorsMapMock.prototype.getEvents = function(trigger) {
      return [];
    };

    return BehaviorsMapMock;

  })();

  BehaviorsList = (function() {
    function BehaviorsList(component, list) {
      var definition;
      this.component = component;
      this.id = list.id;
      this.trigger = list.event;
      if (this.trigger.indexOf("#") === -1) {
        this.trigger = this.trigger + "#" + s4();
      }
      this.eventTrigger = TRIGGERS[this.trigger.split("#")[0]];
      this.conditional = this.eventTrigger.conditional;
      this.type = list.type;
      definition = list.definition;
      this.readActions(definition);
    }

    BehaviorsList.prototype.readActions = function(definition) {
      var action, behavior, key, keys, _i, _len;
      this.actions = [];
      if ((definition == null) || (definition.actions == null)) {
        return this.actions;
      }
      keys = _.keys(definition.actions).sort();
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        behavior = definition.actions[key];
        action = BehaviorsFactory.newAction(this.component, behavior);
        this.actions.push(action);
        action.list = this;
      }
      return this.actions;
    };

    BehaviorsList.prototype.add = function(type, save) {
      var action, behavior;
      if (save == null) {
        save = true;
      }
      behavior = {
        type: type
      };
      action = this.append(behavior);
      if (save) {
        this.save();
      }
      this.component.behaviors.checkBehaviorsMark();
      return action;
    };

    BehaviorsList.prototype.append = function(behavior) {
      var action;
      action = BehaviorsFactory.newAction(this.component, behavior);
      this.actions.push(action);
      action.list = this;
      this.component.behaviors.checkBehaviorsMark();
      return action;
    };

    BehaviorsList.prototype.find = function(id) {
      var a, _i, _len, _ref;
      id = parseInt(id);
      _ref = this.actions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        if (a.id === id) {
          return a;
        }
      }
      return null;
    };

    BehaviorsList.prototype.remove = function(action) {
      var index;
      index = this.actions.indexOf(action);
      this.actions.splice(index, 1);
      this.component.behaviors.checkBehaviorsMark();
      return this;
    };

    BehaviorsList.prototype.preselect = function(action) {
      var a, _i, _len, _ref;
      _ref = this.actions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        a.preselect();
        if (a === action) {
          return;
        }
      }
    };

    BehaviorsList.prototype.reorder = function(ids) {
      var action, actions, id, _i, _len;
      actions = [];
      for (_i = 0, _len = ids.length; _i < _len; _i++) {
        id = ids[_i];
        action = this.find(id);
        if (action == null) {
          return false;
        }
        actions.push(action);
      }
      return this.actions = actions;
    };

    BehaviorsList.prototype.save = function() {
      var data, definition,
        _this = this;
      if (this.id != null) {
        this.update();
        return true;
      }
      definition = this.buildDefinition();
      data = {
        type: this.type,
        event: this.trigger,
        page: this.component.page.id,
        component: this.component.id,
        index: 1,
        definition: definition
      };
      return this.component.page.project.server.post(ACTION_SAVEBEHAVIOR, data).done(function(data) {
        _this.id = data.id;
        mixpanel_track("Add interaction", {
          type: _this.type,
          event: _this.trigger,
          page: _this.component.page.id,
          component: _this.component.id
        });
        return false;
      });
    };

    BehaviorsList.prototype.update = function(updatedefinition) {
      var a, data, definition, _i, _len, _ref,
        _this = this;
      if (updatedefinition == null) {
        updatedefinition = true;
      }
      data = {
        id: this.id,
        page: this.component.page.id,
        component: this.component.id,
        event: this.trigger,
        type: this.type
      };
      if (updatedefinition) {
        _ref = this.actions;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          a = _ref[_i];
          a.doUpdate();
          a.configure();
        }
        definition = this.buildDefinition();
        if (this.actions.length === 0) {
          definition.empty = true;
        }
        data.definition = definition;
      }
      return this.component.page.project.server.post(ACTION_UPDATEBEHAVIOR, data).done(function(data) {
        return false;
      });
    };

    BehaviorsList.prototype["delete"] = function() {
      var data,
        _this = this;
      if (this.id == null) {
        return false;
      }
      data = {
        id: this.id,
        page: this.component.page.id,
        component: this.component.id,
        event: this.trigger,
        type: this.type
      };
      return this.component.page.project.server.post(ACTION_REMOVEBEHAVIOR, data).done(function(data) {
        return false;
      });
    };

    BehaviorsList.prototype.buildDefinition = function() {
      var a, definition, _i, _len, _ref;
      definition = {};
      definition.actions = [];
      _ref = this.actions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        definition.actions.push(a.clone());
      }
      return definition;
    };

    BehaviorsList.prototype.clone = function() {
      var definition;
      return definition = {
        event: this.trigger,
        oldId: this.id,
        type: this.type,
        definition: this.buildDefinition()
      };
    };

    return BehaviorsList;

  })();

  window.BehaviorsList = BehaviorsList;

  AbstractAction = (function() {
    function AbstractAction(component, definition) {
      this.component = component;
      this.definition = definition;
      this.list = null;
      this.read(this.definition);
      this.configure();
    }

    AbstractAction.prototype.read = function(definition) {
      this.definition = definition;
      if (this.definition == null) {
        this.definition = {};
      }
      this.type = this.definition.type;
      return this.doRead();
    };

    AbstractAction.prototype.doRead = function() {};

    AbstractAction.prototype.configure = function() {
      this.doConfigure();
      return this.dom().find("span").html(this.title);
    };

    AbstractAction.prototype.doConfigure = function() {};

    AbstractAction.prototype.dom = function() {
      if (this.div == null) {
        this.div = $("<li class=\"event-action\"><i class=\"fa fa-" + this.icon + "\"></i><span>" + this.title + "</span></li>");
      }
      return this.div;
    };

    AbstractAction.prototype.preselect = function() {
      return this.dom().addClass("pre-selected");
    };

    AbstractAction.prototype.select = function() {
      this.dom().addClass("selected");
      return this.list.preselect(this);
    };

    AbstractAction.prototype.previousActions = function() {
      var a, actions, _i, _len, _ref;
      actions = [];
      _ref = this.list.actions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        if (a === this) {
          break;
        }
        actions.push(a);
      }
      return actions;
    };

    AbstractAction.prototype.play = function() {};

    AbstractAction.prototype.reset = function() {};

    AbstractAction.prototype.cancel = function() {
      return this.read(this.definition);
    };

    AbstractAction.prototype.loadTargets = function(targets) {
      var c, component, components, cover, covers, t, target, _i, _j, _len, _len1;
      if (targets == null) {
        targets = [];
      }
      if (targets.length === 0) {
        return [];
      }
      if (!this.component.page.project.indesigner) {
        components = [];
        for (_i = 0, _len = targets.length; _i < _len; _i++) {
          target = targets[_i];
          t = parseInt(target);
          component = window.ComponentsRepository[t];
          if (component != null) {
            components.push(component);
          }
        }
        return components;
      } else if (this.component.page.project.repository != null) {
        covers = [];
        for (_j = 0, _len1 = targets.length; _j < _len1; _j++) {
          target = targets[_j];
          t = parseInt(target);
          cover = this.component.page.project.repository[t];
          if (cover != null) {
            c = new CoverWrapper(cover);
            c.action = this;
            covers.push(c);
          }
        }
        return covers;
      }
      return [];
    };

    AbstractAction.prototype.loadTarget = function(id) {
      var component, cover;
      component = null;
      if (!this.component.page.project.indesigner) {
        component = window.ComponentsRepository[id];
      } else if (this.component.page.project.repository != null) {
        cover = this.component.page.project.repository[id];
        if (cover != null) {
          component = cover.component;
        }
      }
      return component;
    };

    AbstractAction.prototype.save = function() {
      return this.list.save();
    };

    AbstractAction.prototype.update = function() {
      return this.list.update();
    };

    AbstractAction.prototype.doUpdate = function() {};

    AbstractAction.prototype["delete"] = function() {
      var a, action, i, ids, previous, _i, _len, _ref;
      this.component.page.project.trigger(ACT_DESELECT_BEHAVIOR, this);
      previous = this.previousActions();
      this.list.remove(this);
      if (previous.length > 0) {
        action = previous[previous.length - 1];
        this.component.page.project.trigger(ACT_SELECT_BEHAVIOR, action);
      }
      ids = [];
      _ref = this.list.actions;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        a = _ref[i];
        ids.push(a.id);
      }
      this.div.remove();
      if (this.list.actions.length === 0) {
        if (this.list.dom != null) {
          if (this.list.conditional) {
            this.component.behaviors.remove(this.list.trigger);
            this.list.dom.remove();
          } else {
            this.list.dom.attr("event-id", this.list.eventTrigger.name);
          }
        }
        return this.list["delete"]();
      } else {
        return this.list.update();
      }
    };

    AbstractAction.prototype.load = function(definition) {
      this.definition = definition;
    };

    AbstractAction.prototype.move = function(index) {
      var currentindex;
      currentindex = this.list.actions.indexOf(this);
      this.list.remove(this);
      if (currentindex < index) {
        this.list.actions.splice(index, 0, this);
      } else {
        this.list.actions.splice(index, 0, this);
      }
      return this.list.update();
    };

    AbstractAction.prototype.updateIds = function(newids) {
      return false;
    };

    AbstractAction.prototype.clone = function() {
      return {
        type: this.type
      };
    };

    return AbstractAction;

  })();

  window.BEHAVIOR_GOTO_PAGE = "goto-page";

  GoToPage = (function(_super) {
    __extends(GoToPage, _super);

    GoToPage.prototype.type = BEHAVIOR_GOTO_PAGE;

    function GoToPage(component, behavior) {
      this.component = component;
      this.icon = "link";
      GoToPage.__super__.constructor.call(this, this.component, behavior);
    }

    GoToPage.prototype.doRead = function() {
      this.pageId = this.definition.pageId;
      if (this.definition.scroll != null) {
        this.scroll = parseInt(this.definition.scroll);
        this.scroll = Math.max(this.scroll, 0);
      } else {
        this.scroll = 0;
      }
      if (this.definition.anchor != null) {
        return this.anchorId = this.definition.anchor;
      }
    };

    GoToPage.prototype.doConfigure = function() {
      this.checkLayer();
      if (this.page != null) {
        return this.title = "Link to <strong>" + this.page.name + "</strong>";
      } else {
        return this.title = "Go to this page";
      }
    };

    GoToPage.prototype.play = function() {
      this.checkLayer();
      this.previous = this.component.page.project.displayedPage;
      if (this.page) {
        return this.page.project.trigger(ACT_PREVIEW_PAGE, this.page);
      }
    };

    GoToPage.prototype.reset = function() {
      return this.previous.project.trigger(ACT_SELECT_PAGE, this.previous, false);
    };

    GoToPage.prototype.execute = function() {
      var hash;
      this.checkLayer();
      if (this.page != null) {
        hash = this.page.id;
        if (this.anchor != null) {
          hash = "" + hash + "-" + this.anchor.y;
        } else if (this.scroll !== 0) {
          hash = "" + hash + "-" + this.scroll;
        }
        return window.location.hash = hash;
      }
    };

    GoToPage.prototype.checkLayer = function() {
      if (this.page == null) {
        this.page = this.component.page.project.pageById(this.pageId);
      }
      if ((this.anchor == null) && (this.anchorId != null)) {
        return this.anchor = this.loadTarget(this.anchorId);
      }
    };

    GoToPage.prototype.doUpdate = function() {
      GoToPage.__super__.doUpdate.call(this);
      if (this.page != null) {
        this.definition.pageId = this.page.id;
      }
      this.definition.scroll = this.scroll;
      if (this.anchor != null) {
        return this.definition.anchor = this.anchor.id;
      }
    };

    GoToPage.prototype.clone = function() {
      var def;
      def = GoToPage.__super__.clone.call(this);
      def.pageId = this.definition.pageId;
      def.scroll = this.definition.scroll;
      def.anchor = this.definition.anchor;
      return def;
    };

    return GoToPage;

  })(AbstractAction);

  AbstractShowLayerAction = (function(_super) {
    __extends(AbstractShowLayerAction, _super);

    function AbstractShowLayerAction(component, behavior) {
      this.component = component;
      AbstractShowLayerAction.__super__.constructor.call(this, this.component, behavior);
    }

    AbstractShowLayerAction.prototype.doRead = function() {
      return this.layerId = this.definition.layerId;
    };

    AbstractShowLayerAction.prototype.checkLayer = function() {
      if (this.layer == null) {
        return this.layer = this.component.page.project.layerById(this.layerId);
      }
    };

    AbstractShowLayerAction.prototype.doUpdate = function() {
      AbstractShowLayerAction.__super__.doUpdate.call(this);
      if (this.layer != null) {
        return this.definition.layerId = this.layer.id;
      }
    };

    AbstractShowLayerAction.prototype.clone = function() {
      var def;
      def = AbstractShowLayerAction.__super__.clone.call(this);
      def.layerId = this.definition.layerId;
      return def;
    };

    return AbstractShowLayerAction;

  })(AbstractAction);

  window.BEHAVIOR_SHOW_LAYER = "show-layer";

  ShowLayer = (function(_super) {
    __extends(ShowLayer, _super);

    ShowLayer.prototype.type = BEHAVIOR_SHOW_LAYER;

    function ShowLayer(component, behavior) {
      this.component = component;
      this.icon = "file-o";
      ShowLayer.__super__.constructor.call(this, this.component, behavior);
      this.disabled = false;
    }

    ShowLayer.prototype.doRead = function() {
      ShowLayer.__super__.doRead.call(this);
      this.kind = this.definition.kind;
      if (this.kind == null) {
        return this.kind = "toggle";
      }
    };

    ShowLayer.prototype.doConfigure = function() {
      this.checkLayer();
      if (this.layer != null) {
        return this.title = "" + (_.capitalize(this.kind)) + " layer " + this.layer.name;
      } else {
        return this.title = "" + (_.capitalize(this.kind)) + " no layer. Unconfigured";
      }
    };

    ShowLayer.prototype.play = function() {
      var shown;
      this.wasSelected = false;
      this.checkLayer();
      if (this.layer != null) {
        this.wasSelected = this.layer.selected;
        if (!this.wasSelected) {
          if (this.layer.selected && this.kind !== "show") {
            this.layer.project.trigger(ACT_DESELECT_LAYER, this.layer);
            return this.layer.selected = false;
          } else if (!this.layer.selected && this.kind === "show") {
            this.layer.project.trigger(ACT_SELECT_LAYER, this.layer);
            shown = true;
            return this.layer.selected = true;
          }
        }
      }
    };

    ShowLayer.prototype.reset = function() {
      if ((this.layer != null) && !this.wasSelected) {
        return this.layer.project.trigger(ACT_CLOSE_LAYER_PREVIEW, this.layer, false);
      }
    };

    ShowLayer.prototype.execute = function() {
      var bounds, p1, p2, shown, suffix,
        _this = this;
      if (this.disabled) {
        return;
      }
      this.checkLayer();
      shown = false;
      if (this.layer != null) {
        if (this.layer.selected && this.kind !== "show") {
          this.layer.project.trigger(ACT_DESELECT_LAYER, this.layer);
          this.layer.selected = false;
        } else if (!this.layer.selected && this.kind === "show") {
          this.layer.project.trigger(ACT_SELECT_LAYER, this.layer);
          shown = true;
          this.layer.selected = true;
        }
      } else if (this.component.page.layer) {
        this.component.page.project.trigger(ACT_DESELECT_LAYER, this.component.page);
      }
      if (shown && this.list.eventTrigger.name === MOUSE_ENTER.name) {
        this.disabled = true;
        suffix = "" + this.list.id + "-" + (this.list.actions.indexOf(this));
        p1 = this.position(this.target);
        p2 = this.position(this.layer.container);
        bounds = this.layer.getBounds();
        p2.x = p2.x + bounds.x - 2;
        p2.y = p2.y + bounds.y - 2;
        p2.w = bounds.width + 2;
        p2.h = bounds.height + 2;
        return $(document).on("mousemove.show-layer" + suffix, function(event) {
          var o;
          o = p1;
          if ((event.pageX >= o.x && event.pageX <= o.x + o.w) && (event.pageY >= o.y && event.pageY <= o.y + o.h)) {
            return true;
          }
          o = p2;
          if ((event.pageX >= o.x && event.pageX <= o.x + o.w) && (event.pageY >= o.y && event.pageY <= o.y + o.h)) {
            return true;
          }
          _this.disabled = false;
          _this.layer.project.trigger(ACT_DESELECT_LAYER, _this.layer);
          _this.layer.selected = false;
          $(document).off(".show-layer" + suffix);
          return true;
        });
      }
    };

    ShowLayer.prototype.position = function(element) {
      var p;
      p = element.offset();
      p = {
        x: p.left - 2,
        y: p.top - 2,
        w: element.width() + 2,
        h: element.height() + 2
      };
      return p;
    };

    ShowLayer.prototype.doUpdate = function() {
      ShowLayer.__super__.doUpdate.call(this);
      return this.definition.kind = this.kind;
    };

    ShowLayer.prototype.clone = function() {
      var def;
      def = ShowLayer.__super__.clone.call(this);
      def.kind = this.kind;
      return def;
    };

    return ShowLayer;

  })(AbstractShowLayerAction);

  window.BEHAVIOR_SHOW_SIDEBAR_MENU = "show-sidebar-menu";

  ShowSidebarMenu = (function(_super) {
    __extends(ShowSidebarMenu, _super);

    ShowSidebarMenu.prototype.type = BEHAVIOR_SHOW_SIDEBAR_MENU;

    function ShowSidebarMenu(component, behavior) {
      this.component = component;
      this.icon = "reorder";
      ShowSidebarMenu.__super__.constructor.call(this, this.component, behavior);
    }

    ShowSidebarMenu.prototype.doRead = function() {
      this.layerId = this.definition.layerId;
      this.side = this.definition.side;
      if (this.side == null) {
        return this.side = "left";
      }
    };

    ShowSidebarMenu.prototype.doConfigure = function() {
      this.checkLayer();
      if (this.layer != null) {
        if (this.layer === this.component.page) {
          return this.title = "Close this sidebar menu";
        } else {
          return this.title = "Show " + this.layer.name + " as sidebar menu";
        }
      } else {
        if (this.component.page.layer) {
          return this.title = "Close this sidebar menu";
        } else {
          return this.title = "Show/hide no layer. Unconfigured";
        }
      }
    };

    ShowSidebarMenu.prototype.play = function() {
      this.wasSelected = false;
      this.checkLayer();
      if (this.layer != null) {
        this.wasSelected = this.layer.selected;
        if (!this.wasSelected) {
          this.layer.sidebarmenu = true;
          this.layer.sidebarside = this.side;
          this.layer.project.trigger(ACT_PREVIEW_LAYER, this.layer, false);
          this.layer.sidebarmenu = false;
          return this.layer.selected = !this.layer.selected;
        }
      }
    };

    ShowSidebarMenu.prototype.reset = function() {
      if ((this.layer != null) && !this.wasSelected) {
        return this.layer.project.trigger(ACT_CLOSE_LAYER_PREVIEW, this.layer, false);
      }
    };

    ShowSidebarMenu.prototype.execute = function() {
      var opened;
      this.checkLayer();
      opened = false;
      if (this.layer != null) {
        this.layer.sidebarmenu = true;
        this.layer.sidebarside = this.side;
        if (this.layer.selected) {
          this.layer.project.trigger(ACT_DESELECT_LAYER, this.layer);
        } else {
          this.layer.project.trigger(ACT_SELECT_LAYER, this.layer);
          opened = true;
        }
        this.layer.sidebarmenu = false;
        return this.layer.selected = !this.layer.selected;
      } else if (this.component.page.layer) {
        this.layer.sidebarmenu = true;
        this.component.page.project.trigger(ACT_DESELECT_LAYER, this.component.page);
        return this.layer.sidebarmenu = false;
      }
    };

    ShowSidebarMenu.prototype.doUpdate = function() {
      ShowSidebarMenu.__super__.doUpdate.call(this);
      return this.definition.side = this.side;
    };

    ShowSidebarMenu.prototype.clone = function() {
      var def;
      def = ShowSidebarMenu.__super__.clone.call(this);
      def.side = this.side;
      return def;
    };

    return ShowSidebarMenu;

  })(AbstractShowLayerAction);

  TargetsAction = (function(_super) {
    __extends(TargetsAction, _super);

    function TargetsAction(component, behavior) {
      this.component = component;
      TargetsAction.__super__.constructor.call(this, this.component, behavior);
      this.targets = null;
      this.disabled = false;
      this.reversable = false;
    }

    TargetsAction.prototype.play = function() {
      debug.group("Playing action " + this.type);
      if ((this.targets == null) || this.targets.length === 0) {
        this.targets = this.loadTargets(this.definition.targets);
      }
      this.doPlay();
      return debug.groupEnd();
    };

    TargetsAction.prototype.doPlay = function() {};

    TargetsAction.prototype.execute = function() {
      var positions, suffix, t, _i, _len, _ref,
        _this = this;
      if (this.disabled) {
        return;
      }
      if ((this.targets == null) || this.targets.length === 0) {
        this.targets = this.loadTargets(this.definition.targets);
      }
      this.doExecute();
      if (this.reversable && this.list.eventTrigger.name === MOUSE_ENTER.name) {
        this.disabled = true;
        suffix = "" + this.list.id + "-" + (this.list.actions.indexOf(this));
        positions = [];
        positions.push(this.position(this.component));
        _ref = this.targets;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          t = _ref[_i];
          positions.push(this.position(t));
        }
        return $(document).on("mousemove.show-layer" + suffix, function(event) {
          var o, _j, _len1;
          for (_j = 0, _len1 = positions.length; _j < _len1; _j++) {
            o = positions[_j];
            if ((event.pageX >= o.x && event.pageX <= o.x + o.w) && (event.pageY >= o.y && event.pageY <= o.y + o.h)) {
              return true;
            }
          }
          _this.disabled = false;
          _this.revert();
          $(document).off(".show-layer" + suffix);
          return true;
        });
      }
    };

    TargetsAction.prototype.revert = function() {};

    TargetsAction.prototype.position = function(component) {
      var element, p;
      element = component.e;
      p = element.offset();
      p = {
        x: p.left - 2,
        y: p.top - 2,
        w: element.width() + 2,
        h: component.height + 2
      };
      return p;
    };

    TargetsAction.prototype.doExecute = function() {};

    TargetsAction.prototype.reset = function() {
      var c, _i, _len, _ref;
      debug.group("Resetting action " + this.type);
      if ((this.targets == null) || this.targets.length === 0) {
        this.targets = this.loadTargets(this.definition.targets);
      }
      _ref = this.targets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        c.reset();
      }
      return debug.groupEnd();
    };

    TargetsAction.prototype.add = function(cover) {
      this.targets.push(cover);
      cover.action = this;
      return this;
    };

    TargetsAction.prototype.has = function(cover) {
      var c, _i, _len, _ref;
      _ref = this.targets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        if (c.cover === cover) {
          return c;
        }
      }
      return null;
    };

    TargetsAction.prototype.remove = function(cover) {
      this.targets.splice(this.targets.indexOf(cover), 1);
      cover.action = null;
      return this;
    };

    TargetsAction.prototype.doUpdate = function() {
      var cover, _i, _len, _ref, _results;
      if ((this.targets == null) || this.targets.length === 0) {
        this.targets = this.loadTargets(this.definition.targets);
      }
      this.definition.targets = [];
      if (this.targets != null) {
        _ref = this.targets;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cover = _ref[_i];
          _results.push(this.definition.targets.push(cover.id));
        }
        return _results;
      }
    };

    TargetsAction.prototype.load = function(definition) {
      this.definition = definition;
      return this.targets = null;
    };

    TargetsAction.prototype.count = function(element, suffix) {
      var c;
      if (suffix == null) {
        suffix = 's';
      }
      if (this.definition.targets != null) {
        c = this.definition.targets.length;
        if (c === 1) {
          return "" + c + " " + element;
        } else {
          return "" + c + " " + element + suffix;
        }
      } else {
        return "no " + element + suffix;
      }
    };

    TargetsAction.prototype.updateIds = function(newids) {
      var save, t, target, targets, _i, _len, _ref;
      if (this.definition.targets == null) {
        return false;
      }
      targets = [];
      this.targets = null;
      save = false;
      _ref = this.definition.targets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        target = _ref[_i];
        t = newids[parseInt(target)];
        if (t != null) {
          targets.push(t);
          save = true;
        } else {
          targets.push(target);
        }
      }
      this.definition.targets = targets;
      return save;
    };

    TargetsAction.prototype.clone = function() {
      var def;
      def = TargetsAction.__super__.clone.call(this);
      if (this.definition.targets != null) {
        def.targets = this.definition.targets.slice(0);
      }
      return def;
    };

    return TargetsAction;

  })(AbstractAction);

  window.BEHAVIOR_SHOW_HIDE = "show-hide";

  ShowHide = (function(_super) {
    __extends(ShowHide, _super);

    ShowHide.prototype.type = BEHAVIOR_SHOW_HIDE;

    function ShowHide(component, behavior) {
      this.component = component;
      this.icon = "eye";
      ShowHide.__super__.constructor.call(this, this.component, behavior);
    }

    ShowHide.prototype.doRead = function() {
      this.targets = null;
      this.kind = this.definition.kind;
      if (this.kind == null) {
        return this.kind = "toggle";
      }
    };

    ShowHide.prototype.doConfigure = function() {
      return this.title = "" + (_.capitalize(this.kind)) + " " + (this.count("component"));
    };

    ShowHide.prototype.doExecute = function() {
      var target, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      if (this.kind === "show") {
        _ref = this.targets;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          target = _ref[_i];
          target.show();
        }
      }
      if (this.kind === "hide") {
        _ref1 = this.targets;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          target = _ref1[_j];
          target.hide();
        }
      }
      if (this.kind === "toggle") {
        _ref2 = this.targets;
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          target = _ref2[_k];
          target.toggle();
        }
      }
      this.reversable = true;
      return this;
    };

    ShowHide.prototype.revert = function() {
      var target, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
      if (this.kind === "hide") {
        _ref = this.targets;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          target = _ref[_i];
          target.show();
        }
      }
      if (this.kind === "show") {
        _ref1 = this.targets;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          target = _ref1[_j];
          target.hide();
        }
      }
      if (this.kind === "toggle") {
        _ref2 = this.targets;
        _results = [];
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          target = _ref2[_k];
          _results.push(target.toggle());
        }
        return _results;
      }
    };

    ShowHide.prototype.doPlay = function() {
      var target, _i, _len, _ref;
      _ref = this.targets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        target = _ref[_i];
        if (!this.editing) {
          target.component.e.addClass("playing");
        }
        if (this.kind === "show") {
          target.show(this.editing);
        }
        if (this.kind === "hide") {
          target.hide(this.editing);
        }
        if (this.kind === "toggle") {
          target.toggle(this.editing);
        }
      }
      return this;
    };

    ShowHide.prototype.doUpdate = function() {
      ShowHide.__super__.doUpdate.call(this);
      return this.definition.kind = this.kind;
    };

    ShowHide.prototype.clone = function() {
      var def;
      def = ShowHide.__super__.clone.call(this);
      def.kind = this.kind;
      return def;
    };

    return ShowHide;

  })(TargetsAction);

  window.BEHAVIOR_SHOW_HIDE_POPUP = "show-hide-popup";

  ShowHidePopup = (function(_super) {
    __extends(ShowHidePopup, _super);

    ShowHidePopup.prototype.type = BEHAVIOR_SHOW_HIDE_POPUP;

    function ShowHidePopup(component, behavior) {
      this.component = component;
      this.icon = "caret-down";
      ShowHidePopup.__super__.constructor.call(this, this.component, behavior);
    }

    ShowHidePopup.prototype.doExecute = function() {
      var target, zindx, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2,
        _this = this;
      ShowHidePopup.__super__.doExecute.call(this);
      if (this.kind === "show") {
        _ref = this.targets;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          target = _ref[_i];
          target.e.css("z-index", 1000);
        }
      }
      if (this.kind === "hide") {
        _ref1 = this.targets;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          target = _ref1[_j];
          target.e.css("z-index", "");
        }
      }
      if (this.kind === "toggle") {
        _ref2 = this.targets;
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          target = _ref2[_k];
          zindx = "";
          if (target.visible) {
            zindx = 1000;
          }
          target.e.css("z-index", zindx);
        }
      }
      if (this.kind !== "hide") {
        $(document).on("mousedown.show-hide-popup", function(event) {
          var o, oldkind, _l, _len3, _ref3;
          _ref3 = _this.targets;
          for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
            target = _ref3[_l];
            o = target.e.offset();
            if ((event.pageX > o.left && event.pageX < o.left + target.width) && (event.pageY > o.top && event.pageY < o.top + target.height)) {
              return true;
            }
          }
          oldkind = _this.kind;
          _this.kind = "hide";
          _this.execute();
          _this.kind = oldkind;
          $(document).off(".show-hide-popup");
          return true;
        });
      }
      return this;
    };

    return ShowHidePopup;

  })(ShowHide);

  window.BEHAVIOR_MOVE_RESIZE = "move-resize";

  MoveResize = (function(_super) {
    __extends(MoveResize, _super);

    MoveResize.prototype.type = BEHAVIOR_MOVE_RESIZE;

    function MoveResize(component, behavior) {
      this.component = component;
      this.icon = "crop";
      MoveResize.__super__.constructor.call(this, this.component, behavior);
    }

    MoveResize.prototype.doRead = function() {
      this.targets = null;
      this.positions = this.definition.positions;
      this.kind = this.definition.kind;
      if (this.kind == null) {
        return this.kind = "move";
      }
    };

    MoveResize.prototype.doConfigure = function() {
      return this.title = "Move or resize " + (this.count("component"));
    };

    MoveResize.prototype.doExecute = function() {
      var d, p, reset, target, _i, _len, _ref;
      _ref = this.targets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        target = _ref[_i];
        p = this.positions[target.id];
        d = target.definition[target.breakpoint.name];
        reset = this.kind === "toggle" && ((d.x !== target.x) || (d.y !== target.y) || (d.width !== target.width) || (d.height !== target.height));
        if (reset) {
          target.resize(d.x, d.y, d.width, d.height);
        } else {
          if (p.width === 0 && p.height === 0) {
            target.move(d.x + p.x, d.y + p.y);
          } else {
            target.resize(d.x + p.x, d.y + p.y, d.width + p.width, d.height + p.height);
          }
        }
      }
      return this.reversable = true;
    };

    MoveResize.prototype.revert = function() {
      var d, p, target, _i, _len, _ref, _results;
      _ref = this.targets;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        target = _ref[_i];
        p = this.positions[target.id];
        d = target.definition[target.breakpoint.name];
        _results.push(target.resize(d.x, d.y, d.width, d.height));
      }
      return _results;
    };

    MoveResize.prototype.doPlay = function() {
      var c, d, p, _i, _len, _ref, _results;
      _ref = this.targets;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        p = this.positions[c.id];
        d = c.cover.component.definition[c.cover.component.breakpoint.name];
        if (p.width === 0 && p.height === 0) {
          _results.push(c.move(d.x + p.x, d.y + p.y));
        } else {
          _results.push(c.resize(d.x + p.x, d.y + p.y, d.width + p.width, d.height + p.height));
        }
      }
      return _results;
    };

    MoveResize.prototype.doUpdate = function() {
      MoveResize.__super__.doUpdate.call(this);
      return this.definition.positions = this.positions;
    };

    MoveResize.prototype.loadTargets = function(targets) {
      var p, target, _i, _len, _ref;
      this.targets = MoveResize.__super__.loadTargets.call(this, targets);
      this.positions = this.definition.positions;
      _ref = this.targets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        target = _ref[_i];
        p = this.positions[target.id];
        p.x = parseInt(p.x);
        p.y = parseInt(p.y);
        p.width = parseInt(p.width);
        p.height = parseInt(p.height);
      }
      return this.targets;
    };

    MoveResize.prototype.updateIds = function(newids) {
      var id, k, keys, save, _i, _len;
      keys = _.keys(this.positions);
      save = false;
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        k = keys[_i];
        id = newids[k];
        if (id != null) {
          this.positions[id] = this.positions[k];
          delete this.positions[k];
          save = true;
        }
      }
      return MoveResize.__super__.updateIds.call(this, newids) || save;
    };

    MoveResize.prototype.clone = function() {
      var def, k, keys, _i, _len;
      def = MoveResize.__super__.clone.call(this);
      def.kind = this.kind;
      def.positions = {};
      keys = [];
      if (this.definition.positions != null) {
        keys = _.keys(this.definition.positions);
      }
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        k = keys[_i];
        def.positions[k] = _.clone(this.definition.positions[k]);
      }
      return def;
    };

    return MoveResize;

  })(TargetsAction);

  window.BEHAVIOR_UPDATE_VALUE = "update-value";

  UpdateValue = (function(_super) {
    __extends(UpdateValue, _super);

    UpdateValue.prototype.type = BEHAVIOR_UPDATE_VALUE;

    function UpdateValue(component, behavior) {
      this.component = component;
      this.icon = "edit";
      UpdateValue.__super__.constructor.call(this, this.component, behavior);
    }

    UpdateValue.prototype.doRead = function() {
      var id, value, _ref, _results;
      this.targets = null;
      this.values = {};
      _ref = this.definition.values;
      _results = [];
      for (id in _ref) {
        value = _ref[id];
        _results.push(this.values[id] = {
          old: value.old,
          "new": value["new"]
        });
      }
      return _results;
    };

    UpdateValue.prototype.doConfigure = function() {
      return this.title = "Update value of " + (this.count("component"));
    };

    UpdateValue.prototype.doExecute = function() {
      return this.doPlay();
    };

    UpdateValue.prototype.doPlay = function() {
      var c, target, value, _i, _len, _ref, _results;
      _ref = this.targets;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        target = _ref[_i];
        value = this.values[target.id];
        if (value == null) {
          continue;
        }
        if (target.components != null) {
          c = target.firstLabelEditable();
          if (c == null) {
            continue;
          }
          target = c;
        }
        value.old = target.get(LABEL);
        _results.push(target.set(LABEL, value["new"]));
      }
      return _results;
    };

    UpdateValue.prototype.reset = function() {
      var target, value, _i, _len, _ref;
      debug.group("Resetting action " + this.type);
      _ref = this.targets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        target = _ref[_i];
        value = this.values[target.id];
        if (value != null) {
          target.set(LABEL, value.old);
        }
      }
      return debug.groupEnd();
    };

    UpdateValue.prototype.add = function(cover) {
      var value;
      UpdateValue.__super__.add.call(this, cover);
      value = {};
      value.old = value["new"] = cover.get(LABEL);
      this.values[cover.id] = value;
      return this;
    };

    UpdateValue.prototype.remove = function(cover) {
      var old;
      UpdateValue.__super__.remove.call(this, cover);
      old = this.values[cover.id].old;
      cover.set(LABEL, old);
      delete this.values[cover.id];
      return this;
    };

    UpdateValue.prototype.doUpdate = function() {
      var id, value, _ref, _results;
      UpdateValue.__super__.doUpdate.call(this);
      this.definition.values = {};
      _ref = this.values;
      _results = [];
      for (id in _ref) {
        value = _ref[id];
        _results.push(this.definition.values[id] = {
          old: value.old,
          "new": value["new"]
        });
      }
      return _results;
    };

    UpdateValue.prototype.loadTargets = function(targets) {
      var target, value, _i, _len, _ref;
      this.targets = UpdateValue.__super__.loadTargets.call(this, targets);
      _ref = this.targets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        target = _ref[_i];
        value = this.values[target.id];
        if (value == null) {
          value = {};
          value["new"] = target.get(LABEL);
          this.values[target.id] = value;
        }
      }
      return this.targets;
    };

    UpdateValue.prototype.updateIds = function(newids) {
      var id, k, keys, save, values, _i, _len;
      values = this.definition.values;
      keys = _.keys(values);
      save = false;
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        k = keys[_i];
        id = newids[k];
        if (id != null) {
          values[id] = values[k];
          delete values[k];
          save = true;
        }
      }
      this.values = this.definition.values = values;
      return UpdateValue.__super__.updateIds.call(this, newids) || save;
    };

    UpdateValue.prototype.clone = function() {
      var def, k, keys, _i, _len;
      def = UpdateValue.__super__.clone.call(this);
      def.values = {};
      keys = [];
      if (this.definition.values != null) {
        keys = _.keys(this.definition.values);
      }
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        k = keys[_i];
        def.values[k] = _.clone(this.definition.values[k]);
      }
      return def;
    };

    return UpdateValue;

  })(TargetsAction);

  window.BEHAVIOR_UPDATE_STYLING = "update-styling";

  UpdateStyling = (function(_super) {
    __extends(UpdateStyling, _super);

    UpdateStyling.prototype.type = BEHAVIOR_UPDATE_STYLING;

    function UpdateStyling(component, behavior) {
      this.component = component;
      this.title = "Update styling of these components";
      this.icon = "code-fork";
      UpdateStyling.__super__.constructor.call(this, this.component, behavior);
    }

    UpdateStyling.prototype.doRead = function() {
      return this.targets = null;
    };

    UpdateStyling.prototype.doExecute = function() {};

    UpdateStyling.prototype.doPlay = function() {};

    return UpdateStyling;

  })(TargetsAction);

  window.BEHAVIOR_TRIGGER_EVENT = "trigger-event";

  TriggerEvent = (function(_super) {
    __extends(TriggerEvent, _super);

    TriggerEvent.prototype.type = BEHAVIOR_TRIGGER_EVENT;

    function TriggerEvent(component, behavior) {
      this.component = component;
      this.title = "Trigger a custom event.";
      this.icon = "bolt";
      this.index = 0;
      TriggerEvent.__super__.constructor.call(this, this.component, behavior);
    }

    TriggerEvent.prototype.doRead = function() {
      this.events = this.definition.events;
      if (this.events == null) {
        return this.events = "Checked, Unchecked";
      }
    };

    TriggerEvent.prototype.execute = function() {
      var event, items;
      items = this.events.split(",");
      if (this.index >= items.length) {
        this.index = 0;
      }
      event = jQuery.Event(CUSTOM_EVENT.event);
      event.item = items[this.index];
      this.component.parent.e.trigger(event);
      return this.index = this.index + 1;
    };

    TriggerEvent.prototype.play = function(kind) {
      var event, items, _ref;
      if (kind == null) {
        kind = 'play';
      }
      debug.group("" + kind + "ing action " + this.type);
      items = this.events.split(",");
      event = jQuery.Event(CUSTOM_EVENT.event);
      event.item = items[0];
      event.kind = kind;
      if ((_ref = this.component.parent.e) != null) {
        _ref.trigger(event);
      }
      return debug.groupEnd();
    };

    TriggerEvent.prototype.reset = function() {
      return this.play('reset');
    };

    TriggerEvent.prototype.doUpdate = function() {
      TriggerEvent.__super__.doUpdate.call(this);
      return this.definition.events = this.events;
    };

    TriggerEvent.prototype.clone = function() {
      var def;
      def = TriggerEvent.__super__.clone.call(this);
      def.events = this.events;
      return def;
    };

    return TriggerEvent;

  })(AbstractAction);

  window.BEHAVIOR_ACT_ON = "act-on";

  ExecuteActionOn = (function(_super) {
    __extends(ExecuteActionOn, _super);

    ExecuteActionOn.prototype.type = BEHAVIOR_ACT_ON;

    function ExecuteActionOn(component, behavior) {
      this.component = component;
      this.title = "Execute action on components.";
      this.icon = "gear";
      ExecuteActionOn.__super__.constructor.call(this, this.component, behavior);
    }

    ExecuteActionOn.prototype.doRead = function() {
      this.targets = null;
      this.method = this.definition.method;
      if (this.method == null) {
        return this.method = "action";
      }
    };

    ExecuteActionOn.prototype.doConfigure = function() {
      return this.title = "Execute '" + this.method + "' on " + (this.count("component"));
    };

    ExecuteActionOn.prototype.doExecute = function() {
      var event, target, _i, _len, _ref;
      _ref = this.targets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        target = _ref[_i];
        event = jQuery.Event(ACT_ON.event);
        event.item = this.method;
        event.kind = 'action';
        target.e.trigger(event);
      }
      return this;
    };

    ExecuteActionOn.prototype.doPlay = function(kind) {
      var event, target, _i, _len, _ref;
      if (kind == null) {
        kind = 'play';
      }
      _ref = this.targets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        target = _ref[_i];
        event = jQuery.Event(ACT_ON.event);
        event.item = this.method;
        event.kind = kind;
        event.target = target.component;
        event.trigger = ACT_ON;
        target.component.trigger(ACT_ON.event, event);
      }
      return this;
    };

    ExecuteActionOn.prototype.reset = function() {
      debug.group("Resetting action " + this.type);
      this.doPlay('reset');
      return debug.groupEnd();
    };

    ExecuteActionOn.prototype.doUpdate = function() {
      ExecuteActionOn.__super__.doUpdate.call(this);
      return this.definition.method = this.method;
    };

    ExecuteActionOn.prototype.clone = function() {
      var def;
      def = ExecuteActionOn.__super__.clone.call(this);
      def.method = this.method;
      return def;
    };

    return ExecuteActionOn;

  })(TargetsAction);

}).call(this);
;(function() {
  var BOX_WIDTH, CommentBox, Comments, CommentsStage, LAST_TYPE, TYPES;

  Comments = (function() {
    function Comments(element, components) {
      this.element = element;
      this.components = components;
      _.bindAll(this);
      this.visible = false;
      this.breakpoint = DESKTOP;
      this.initPalette();
    }

    Comments.prototype.initPalette = function() {
      var _this = this;
      this.element.empty();
      this.commentList = $("<div class=\"comment-list\"></div>");
      this.element.append(this.commentList);
      this.element.on("click", ".comment", function(event) {
        var comment;
        comment = $(event.currentTarget);
        comment = _this.page.comments[_this.breakpoint.name][comment.index()];
        return _this.project.trigger(ACT_SHOW_COMMENT, comment, true);
      });
      return this;
    };

    Comments.prototype.filter = function(token) {
      return this;
    };

    Comments.prototype.showComments = function() {
      var comment, _i, _len, _ref, _results;
      this.commentList.empty();
      _ref = this.page.comments[this.breakpoint.name];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        comment = _ref[_i];
        if (comment.breakpoint.name === this.breakpoint.name) {
          _results.push(this.addComment(comment));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Comments.prototype.addComment = function(comment) {
      return this.commentList.append("<div class=\"comment\" data-id=\"" + comment.guid + "\">\n	<img class=\"avatar\" src=\"http://www.gravatar.com/avatar/" + comment.user.email + "?s=24\" />\n	<div class=\"comment-text\">" + (markdown.toHTML(comment.text)) + "</div>\n	<!-- <div><span class=\"comment-author\">" + comment.user.surname + " " + comment.user.name + "</span> <span class=\"comment-time\">Yesterday</span></div> -->\n</div>");
    };

    Comments.prototype.removeComment = function(comment) {
      var element;
      element = this.commentList.find("[data-id='" + comment.guid + "']");
      return element.remove();
    };

    Comments.prototype.setProject = function(project) {
      var _this = this;
      this.project = project;
      EventDispatcher.on('action:open-comments', function() {
        Track.feature('action:open-comments');
        _this.visible = true;
        _this.element.css("display", "");
        if (_this.pageChanged) {
          _this.pageChanged = false;
          return _this.showComments();
        }
      });
      EventDispatcher.on('action:close-comments', function() {
        Track.feature('action:open-comments');
        _this.visible = false;
        return _this.element.css("display", "none");
      });
      this.pageChanged = true;
      this.project.on(ACT_DESIGN_PAGE, function(page) {
        _this.page = page;
        _this.pageChanged = true;
        if (_this.visible) {
          return _this.showComments();
        }
      });
      this.project.on(ACT_ADD_COMMENT, function(comment) {
        Track.feature(ACT_ADD_COMMENT);
        return _this.addComment(comment);
      });
      this.project.on(ACT_REMOVE_COMMENT, function(comment) {
        Track.feature(ACT_REMOVE_COMMENT);
        return _this.removeComment(comment);
      });
      this.project.on(ACT_REORDER_COMMENTS, function() {
        var comment, element, index, markers, _i, _len, _ref, _results;
        markers = _this.commentList.children();
        _ref = _this.page.comments[_this.breakpoint.name];
        _results = [];
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          comment = _ref[index];
          element = _this.commentList.find("[data-id='" + comment.guid + "']");
          _results.push(element.insertBefore(_this.commentList.children().eq(index)));
        }
        return _results;
      });
      this.project.on(ACT_SHOW_COMMENT, function(comment) {
        var element, o1, o2;
        element = _this.commentList.find("[data-id='" + comment.guid + "']");
        if (element.length === 0) {
          return true;
        }
        o1 = element.offset();
        o2 = _this.element.offset();
        return _this.element.parent().animate({
          scrollTop: o1.top - o2.top - 10
        });
      });
      return this.project.on(CMD_BREAKPOINT_CHANGE, function(breakpoint) {
        _this.breakpoint = breakpoint;
        _this.pageChanged = true;
        if (_this.visible) {
          return _this.showComments();
        }
      });
    };

    return Comments;

  })();

  window.Comments = Comments;

  CommentsStage = (function() {
    function CommentsStage() {
      var _this = this;
      _.bindAll(this);
      this.markers = [];
      this.visible = false;
      this.breakpoint = DESKTOP;
      this.element = $("<div class=\"comments-designer\" style=\"display:none;\"></div>");
      this.element.on("click", function(event) {
        var marker, point;
        if (event.target !== event.currentTarget) {
          return true;
        }
        event.preventDefault();
        if (_this.box.visible) {
          _this.box.hide();
          return false;
        }
        point = eventLocal(event);
        marker = _this.addCommment(point.x - 16, point.y - 16);
        _this.box.show(marker);
        return false;
      });
      this.element.on("mousedown", ".comment-marker", function(event) {
        var local, marker, stage0, target, _x, _y;
        event.preventDefault();
        local = eventLocal(event);
        stage0 = _this.element.offset();
        target = $(event.currentTarget);
        marker = _this.markers[parseInt(target.attr("data-index")) - 1];
        _x = marker.x;
        _y = marker.y;
        if (_this.box.visible) {
          _this.box.hide();
        }
        $(document).on('mousemove.comment-tool', function(event) {
          var x, y;
          event.preventDefault();
          x = event.pageX - stage0.left - local.x;
          y = event.pageY - stage0.top - local.y;
          x = Math.round(x);
          y = Math.round(y);
          marker.move(x, y);
          return false;
        });
        $(document).on('mouseup.comment-tool', function(event) {
          event.preventDefault();
          $(document).off(".comment-tool");
          if ((marker.x === _x) && (marker.y === _y)) {
            _this.box.show(marker);
          } else {
            _this.reorderMarkers();
            _this.project.trigger(ACT_REORDER_COMMENTS);
            if (marker.conversation) {
              _this.project.trigger(ACT_SHOW_COMMENT, marker.conversation, false);
            }
          }
          if (marker.conversation != null) {
            marker.conversation.x = marker.x;
            marker.conversation.y = marker.y;
            marker.conversation.update();
          }
          return false;
        });
        return false;
      });
      this.index = 1;
    }

    CommentsStage.prototype.setProject = function(project) {
      var _this = this;
      this.project = project;
      this.pageChanged = false;
      this.project.on(ACT_DESIGN_PAGE, function(page) {
        _this.page = page;
        _this.pageChanged = true;
        if (_this.visible) {
          return _this.display();
        }
      });
      this.project.on(ACT_ADD_COMMENT, function(comment) {
        if (_this.page !== comment.page) {
          return false;
        }
        _this.pageChanged = true;
        if (_this.visible) {
          return _this.display();
        }
      });
      this.project.on(ACT_REMOVE_COMMENT, function(comment) {
        if (_this.page !== comment.page) {
          return false;
        }
        _this.pageChanged = true;
        if (_this.visible) {
          return _this.display();
        }
      });
      this.project.on(ACT_UPDATE_COMMENT, function(comment) {
        var index, marker, reorder;
        index = _this.page.comments[_this.breakpoint.name].indexOf(comment);
        marker = _this.markers[index];
        if (marker != null) {
          reorder = marker.x !== comment.x || marker.y !== comment.y;
          marker.update();
          if (reorder) {
            _this.reorderMarkers();
            return _this.project.trigger(ACT_REORDER_COMMENTS);
          }
        }
      });
      this.project.on(ACT_ADD_REPLY, function(comment) {
        var marker, _i, _len, _ref, _results;
        if (_this.page !== comment.page || (comment.conversation == null)) {
          return false;
        }
        _ref = _this.markers;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          marker = _ref[_i];
          if (marker.conversation.id === comment.conversation.id) {
            marker.update();
            if (_this.box.marker === marker) {
              _this.box.addComment(comment);
            }
            break;
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
      this.project.on(ACT_SHOW_COMMENT, function(comment, showbox) {
        var index;
        if (!showbox) {
          return true;
        }
        index = _this.page.comments[_this.breakpoint.name].indexOf(comment);
        return _this.box.show(_this.markers[index]);
      });
      this.project.on(CMD_BREAKPOINT_CHANGE, function(breakpoint) {
        _this.breakpoint = breakpoint;
        _this.box.breakpoint = _this.breakpoint;
        _this.pageChanged = true;
        if (_this.visible) {
          return _this.display();
        }
      });
      EventDispatcher.on('action:open-comments', function() {
        _this.visible = true;
        _this.element.css("display", "");
        if (_this.pageChanged) {
          _this.display();
          return _this.pageChanged = false;
        }
      });
      EventDispatcher.on('action:close-comments', function() {
        _this.visible = false;
        return _this.element.css("display", "none");
      });
      this.box = new CommentBox(this);
      this.element.append(this.box.element);
      return this.box.init();
    };

    CommentsStage.prototype.display = function() {
      var conversation, _i, _len, _ref, _results;
      this.index = 1;
      this.markers = [];
      this.element.find(".comment-marker").remove();
      _ref = this.page.comments[this.breakpoint.name];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        conversation = _ref[_i];
        if (conversation.breakpoint.name === this.breakpoint.name) {
          _results.push(this.putMarker(conversation));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    CommentsStage.prototype.putMarker = function(conversation) {
      var marker;
      marker = new CommentMarker(conversation.x, conversation.y, this.index);
      marker.converse(conversation);
      this.index++;
      marker.element.insertBefore(this.box.element);
      this.markers.push(marker);
      return marker;
    };

    CommentsStage.prototype.remove = function(marker) {
      var index, m, _i, _len, _ref;
      marker.element.remove();
      this.markers.splice(this.markers.indexOf(marker), 1);
      _ref = this.markers;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        m = _ref[index];
        m.setIndex(index + 1);
      }
      this.index--;
      if (this.box.marker === marker) {
        return this.box.hide();
      }
    };

    CommentsStage.prototype.addCommment = function(x, y) {
      var marker;
      marker = new CommentMarker(x, y, this.index);
      marker.guid = guid();
      this.index++;
      marker.element.insertBefore(this.box.element);
      this.markers.push(marker);
      return marker;
    };

    CommentsStage.prototype.reorderMarkers = function() {
      var comments, index, m, _i, _len, _ref;
      this.markers = this.markers.sort(function(m1, m2) {
        if (m1.y < m2.y) {
          return -1;
        }
        if (m1.y > m2.y) {
          return 1;
        }
        if (m1.x < m2.x) {
          return -1;
        }
        if (m1.x > m2.x) {
          return 1;
        }
        return 0;
      });
      comments = [];
      _ref = this.markers;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        m = _ref[index];
        comments.push(m.conversation);
        m.setIndex(index + 1);
      }
      return this.page.comments[this.breakpoint.name] = comments;
    };

    return CommentsStage;

  })();

  window.CommentsStage = CommentsStage;

  LAST_TYPE = "developer";

  TYPES = ["developer", "correction", "observation"];

  window.CommentMarker = (function() {
    function CommentMarker(x, y, index) {
      this.x = x;
      this.y = y;
      this.index = index;
      this.type = LAST_TYPE;
      this.element = $("<div class=\"comment-marker " + this.type + "\" data-index=\"" + this.index + "\"><div>" + this.index + "</div></div>");
      this.move(this.x, this.y);
      this.completed = false;
    }

    CommentMarker.prototype.converse = function(conversation) {
      this.conversation = conversation;
      this.move(this.conversation.x, this.conversation.y);
      this.guid = conversation.guid;
      this.setType(TYPES[conversation.type - 1]);
      return this.completed = conversation.completed;
    };

    CommentMarker.prototype.setIndex = function(index) {
      this.element.find("div").text(index);
      return this.element.attr("data-index", index);
    };

    CommentMarker.prototype.move = function(x, y) {
      this.x = x;
      this.y = y;
      return this.element.css({
        left: this.x,
        top: this.y
      });
    };

    CommentMarker.prototype.update = function() {
      return this.converse(this.conversation);
    };

    CommentMarker.prototype.setType = function(type) {
      LAST_TYPE = type;
      this.element.removeClass(this.type);
      this.type = type;
      return this.element.addClass(this.type);
    };

    CommentMarker.prototype.nextType = function() {
      var index, type;
      index = TYPES.indexOf(this.type);
      if (index < TYPES.length - 1) {
        index = index + 1;
      } else {
        index = 0;
      }
      type = TYPES[index];
      this.setType(type);
      if (this.conversation) {
        this.conversation.type = index + 1;
        return this.conversation.update();
      }
    };

    CommentMarker.prototype.prevType = function() {
      var index, type;
      index = TYPES.indexOf(this.type);
      if (index > 0) {
        index = index - 1;
      } else {
        index = TYPES.length - 1;
      }
      type = TYPES[index];
      this.setType(type);
      if (this.conversation) {
        this.conversation.type = index + 1;
        return this.conversation.update();
      }
    };

    CommentMarker.prototype.view = function() {
      return "<div class=\"comment-view\">\n	<div class=\"comment-marker " + this.type + "\"><div>" + this.index + "</div></div>\n	<div class=\"comment-text\">" + (markdown.toHTML(this.conversation.text)) + "</div>\n</div>";
    };

    return CommentMarker;

  })();

  BOX_WIDTH = 350;

  CommentBox = (function() {
    function CommentBox(stage) {
      this.stage = stage;
      this.breakpoint = DESKTOP;
      this.element = $("<div class=\"comment-box\">\n<div class=\"comment-box-header clearfix\">\n	<div class=\"marker-complete pull-left\"><i class=\"fa fa-square-o\"></i> Mark this as complete!</div>\n\n	<div class=\"comment-type pull-right\">\n		<div class=\"comment-type-1\"></div>\n		<div class=\"comment-type-2\"></div>\n		<div class=\"comment-type-3\"></div>\n	</div>\n</div>\n	<div class=\"comment-box-conversation\">\n	</div>\n<div class=\"comment-box-footer\">\n	<img class=\"avatar\" src=\"http://www.gravatar.com/avatar/" + this.stage.project.user.email + "?s=30\" />\n  <div class=\"comment-editor-wrapper\"><textarea class=\"comment-editor\"></textarea></div>\n  <button type=\"button\" class=\"btn btn-sm btn-success\">Save</button>\n  <button type=\"button\" class=\"btn btn-sm btn-link\">Cancel</button>\n  <div class=\"pull-right use-markdown\">Use <a href=\"http://daringfireball.net/projects/markdown/syntax\" target=\"_blank\">markdown</a>.</div>\n  <div class=\"pull-right delete-comment\"><a href=\"#\">Delete this comment</a></div>\n</div>\n</div>");
    }

    CommentBox.prototype.init = function() {
      var editorWrapper,
        _this = this;
      this.element.css("display", "none");
      this.comments = this.element.find(".comment-box-conversation");
      this.textarea = this.element.find(".comment-box-footer textarea");
      this.element.find(".comment-box-footer .btn-success").on("click", function() {
        _this.postComment(_this.editor.val());
        _this.editor.val("");
        return _this.editor.focus();
      });
      this.editor = this.element.find(".comment-editor");
      editorWrapper = this.element.find(".comment-editor-wrapper");
      this.editor.on('keydown', function(event) {
        var cancel, cmd_enter, code, ctrl, down, enter, escape, left, right, up, v;
        code = event.which;
        escape = code === 27;
        enter = code === 13;
        up = code === 38;
        left = code === 37;
        down = code === 40;
        right = code === 39;
        ctrl = event.ctrlKey || event.metaKey;
        cmd_enter = enter && ctrl;
        v = _.trim(_this.editor.val());
        cancel = false;
        if (cmd_enter) {
          _this.postComment(v);
          cancel = true;
        } else if (escape) {
          _this.hide();
          cancel = true;
        } else if (v === "" && ctrl) {
          if (up) {
            _this.selectPrevious();
            cancel = true;
          } else if (down) {
            _this.selectNext();
            cancel = true;
          } else if (left && (_this.marker != null)) {
            _this.marker.prevType();
            cancel = true;
          } else if (right && (_this.marker != null)) {
            _this.marker.nextType();
            cancel = true;
          }
        }
        if (cancel) {
          event.preventDefault();
        }
        return !cancel;
      });
      this.element.find(".comment-box-footer .btn-link").on("click", function() {
        return _this.hide();
      });
      this.visible = false;
      this.element.find(".comment-type div").on("click", function(event) {
        var type;
        type = $(event.currentTarget).attr("class");
        if (type === "comment-type-1") {
          _this.marker.setType("developer");
        } else if (type === "comment-type-2") {
          _this.marker.setType("correction");
        } else if (type === "comment-type-3") {
          _this.marker.setType("observation");
        }
        if (_this.marker.conversation) {
          _this.marker.conversation.type = TYPES.indexOf(_this.marker.type) + 1;
          _this.marker.conversation.update();
        }
        return _this.editor.focus();
      });
      this.element.find(".marker-complete").on("click", function(event) {
        var target;
        target = $(event.target);
        if (_this.marker.completed) {
          _this.marker.completed = false;
          target.find("i").removeClass().addClass("fa fa-square-o");
        } else {
          _this.marker.completed = true;
          target.find("i").removeClass().addClass("fa fa-check-square-o");
        }
        if (_this.marker.conversation) {
          _this.marker.conversation.completed = _this.marker.completed;
          return _this.marker.conversation.update();
        }
      });
      return this.element.find(".delete-comment").on("click", function(event) {
        event.preventDefault();
        if (_this.marker && (_this.marker.conversation != null)) {
          if (confirm("Are you sure you want to remove this comment?")) {
            _this.deleteComment(_this.marker.conversation);
          }
        }
        return false;
      });
    };

    CommentBox.prototype.selectNext = function() {
      var index, m, markers;
      if ((this.marker != null) && (this.marker.conversation != null)) {
        markers = this.stage.markers;
        index = markers.indexOf(this.marker);
        if (index < markers.length - 1) {
          m = markers[index + 1];
          if (m.conversation != null) {
            return this.stage.project.trigger(ACT_SHOW_COMMENT, m.conversation, true);
          }
        }
      }
    };

    CommentBox.prototype.selectPrevious = function() {
      var index, m, markers;
      if ((this.marker != null) && (this.marker.conversation != null)) {
        markers = this.stage.markers;
        index = markers.indexOf(this.marker);
        if (index > 0) {
          m = markers[index - 1];
          if (m.conversation != null) {
            return this.stage.project.trigger(ACT_SHOW_COMMENT, m.conversation, true);
          }
        }
      }
    };

    CommentBox.prototype.showConversation = function(conversation) {
      var reply, _i, _len, _ref, _results;
      this.conversation = conversation;
      this.addComment(this.conversation);
      _ref = this.conversation.replies;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        reply = _ref[_i];
        _results.push(this.addComment(reply));
      }
      return _results;
    };

    CommentBox.prototype.addComment = function(comment) {
      return this.comments.append("<div class=\"comment\" data-id=\"" + comment.guid + "\">\n	<img class=\"avatar\" src=\"http://www.gravatar.com/avatar/" + comment.user.email + "?s=30\" />\n	<div class=\"comment-text\">" + (markdown.toHTML(comment.text)) + "</div>\n	<!-- <div><span class=\"comment-author\">" + comment.user.surname + " " + comment.user.name + "</span> <span class=\"comment-time\">Yesterday</span></div> -->\n</div>");
    };

    CommentBox.prototype.deleteComment = function(comment) {
      var index;
      if (comment.conversation != null) {
        return comment["delete"]();
      } else {
        index = comment.page.comments[this.breakpoint.name].indexOf(comment);
        comment.page.comments[this.breakpoint.name].splice(index, 1);
        comment["delete"]();
        this.stage.project.trigger(ACT_REMOVE_COMMENT, comment);
        return this.hide();
      }
    };

    CommentBox.prototype.postComment = function(text) {
      var comment;
      if (!text || _.trim(text) === "") {
        return;
      }
      text = _.trim(text);
      if (this.marker.conversation == null) {
        this.marker.conversation = comment = new Conversation(this.stage.page, {
          guid: this.marker.guid,
          text: text,
          user: this.stage.project.user,
          x: this.marker.x,
          y: this.marker.y,
          breakpoint: Comment.getBreakpointIndex(this.stage.breakpoint)
        });
        this.stage.page.comments[this.breakpoint.name].push(comment);
        this.element.addClass("has-conversation");
        this.element.find(".btn-success").text("Reply");
        this.hide();
        this.stage.project.trigger(ACT_ADD_COMMENT, comment);
        this.stage.project.trigger(ACT_SHOW_COMMENT, comment, false);
      } else {
        comment = new Comment(this.stage.page, {
          guid: guid(),
          text: text,
          user: this.stage.project.user,
          breakpoint: Comment.getBreakpointIndex(this.stage.breakpoint)
        });
        this.editor.val("");
        this.marker.conversation.addReply(comment);
      }
      return this.addComment(comment);
    };

    CommentBox.prototype.show = function(marker) {
      var left, samemarker, w, width;
      samemarker = this.marker === marker;
      this.marker = marker;
      width = _npx(this.element.width());
      w = this.marker.element.width() + 15;
      this.stage.element.addClass("box-opened");
      this.visible = true;
      this.element.removeClass("left right");
      if (this.marker.x < 960 - width - w) {
        this.element.addClass("right");
        left = this.marker.x + w;
      } else {
        this.element.addClass("left");
        left = this.marker.x - (width + 10);
      }
      this.element.css({
        display: "",
        top: this.marker.y,
        left: left
      });
      this.editor.val("");
      this.editor.focus();
      if (samemarker) {
        return false;
      }
      this.comments.empty();
      if (this.marker.conversation != null) {
        this.element.addClass("has-conversation");
        this.showConversation(this.marker.conversation);
        return this.element.find(".btn-success").text("Reply");
      } else {
        this.element.removeClass("has-conversation");
        return this.element.find(".btn-success").text("Post");
      }
    };

    CommentBox.prototype.hide = function() {
      var m;
      this.editor.val("");
      this.stage.element.removeClass("box-opened");
      this.visible = false;
      this.element.css("display", "none");
      if (this.marker.conversation == null) {
        m = this.marker;
        this.marker = null;
        return this.stage.remove(m);
      }
    };

    return CommentBox;

  })();

}).call(this);
;(function() {
  var Stack, StackOperation, act, cmd, comment_breakpoints, space,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.Project = (function() {
    function Project(data) {
      var d, l, m, p, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3;
      _.extend(this, Backbone.Events);
      this.repository = {};
      this.indesigner = false;
      this.id = data.id;
      this.public_key = data.public_key;
      this.name = data.name;
      this.definition = data.definition;
      this.client = data.client;
      if (this.definition == null) {
        this.definition = {
          desktop: DESKTOP.width,
          tablet: TABLET.width,
          phone: PHONE.width,
          baseline: {
            desktop: DESKTOP.baseline,
            tablet: TABLET.baseline,
            phone: PHONE.baseline
          },
          showgrid: true,
          showbaseline: true,
          grid: 12
        };
      } else {
        d = parseInt(this.definition.desktop);
        if (!isNaN(d)) {
          DESKTOP.width = d;
        }
        d = parseInt(this.definition.tablet);
        if (!isNaN(d)) {
          TABLET.width = d;
        }
        d = parseInt(this.definition.phone);
        if (!isNaN(d)) {
          PHONE.width = d;
        }
        d = parseInt(this.definition.baseline.desktop);
        if (!isNaN(d)) {
          DESKTOP.baseline = d;
        }
        d = parseInt(this.definition.baseline.tablet);
        if (!isNaN(d)) {
          TABLET.baseline = d;
        }
        d = parseInt(this.definition.baseline.phone);
        if (!isNaN(d)) {
          PHONE.baseline = d;
        }
      }
      this.baseline = {
        desktop: DESKTOP.baseline,
        tablet: TABLET.baseline,
        phone: PHONE.baseline
      };
      this.grid = parseInt(this.definition.grid);
      if (isNaN(this.grid)) {
        this.grid = 12;
      }
      this.showgrid = ("" + this.definition.showgrid) === "true";
      this.showbaseline = ("" + this.definition.showbaseline) === "true";
      this.created = data.created;
      this.modified = data.modified;
      this.pages = [];
      _ref = data.pages;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        this.add(new Page(p));
      }
      _ref1 = this.pages;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        p = _ref1[_j];
        if (p.master != null) {
          _ref2 = this.pages;
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            m = _ref2[_k];
            if (m.id === p.master && m.id !== p.id) {
              p.master = m;
            }
          }
        }
      }
      this.layers = [];
      if (data.layers != null) {
        _ref3 = data.layers;
        for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
          l = _ref3[_l];
          this.addLayer(new Layer(l));
        }
      }
    }

    Project.prototype.add = function(page) {
      this.pages.push(page);
      page.project = this;
      return this;
    };

    Project.prototype.addAt = function(page, index) {
      if (index < 0 || index > this.pages.length - 1) {
        return this;
      }
      this.pages.splice(index, 0, page);
      page.project = this;
      return this;
    };

    Project.prototype.remove = function(page) {
      var index;
      index = this.pages.indexOf(page);
      if (index > -1) {
        this.pages.splice(index, 1);
      }
      return this;
    };

    Project.prototype.pageById = function(id) {
      var p, _i, _len, _ref;
      id = parseInt(id);
      _ref = this.pages;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        if (p.id === id) {
          if (!p.loaded) {
            this.trigger(CMD_PRELOAD_LAYER, p);
          }
          return p;
        }
      }
      return null;
    };

    Project.prototype.addLayer = function(layer) {
      this.layers.push(layer);
      layer.project = this;
      return this;
    };

    Project.prototype.addLayerAt = function(layer, index) {
      if (index < 0 || index > this.layers.length - 1) {
        return this;
      }
      this.layer.splice(index, 0, layer);
      layer.project = this;
      return this;
    };

    Project.prototype.removeLayer = function(layer) {
      var index;
      index = this.layers.indexOf(layer);
      if (index > -1) {
        this.layers.splice(index, 1);
      }
      return this;
    };

    Project.prototype.layerById = function(id) {
      var p, _i, _len, _ref;
      id = parseInt(id);
      _ref = this.layers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        if (p.id === id) {
          if (!p.loaded) {
            this.trigger(CMD_PRELOAD_LAYER, p);
          }
          return p;
        }
      }
      return null;
    };

    Project.prototype.defaultPage = function() {
      return this.pages[0];
    };

    Project.prototype.update = function(name, value) {
      var data,
        _this = this;
      data = {
        name: name,
        value: value
      };
      return this.server.post(ACTION_PROJECTDEFINITION, data).done(function(data) {
        return false;
      });
    };

    Project.prototype.reorder = function(ids) {
      var id, p, pages, _i, _len;
      pages = [];
      for (_i = 0, _len = ids.length; _i < _len; _i++) {
        id = ids[_i];
        p = this.pageById(id);
        if (p != null) {
          pages.push(p);
        }
      }
      this.pages = pages;
      return this.trigger(ACT_REORDER_PAGES);
    };

    Project.prototype.reorderLayers = function(ids) {
      var id, layers, p, _i, _len;
      layers = [];
      for (_i = 0, _len = ids.length; _i < _len; _i++) {
        id = ids[_i];
        p = this.layerById(id);
        if (p != null) {
          layers.push(p);
        }
      }
      this.layers = layers;
      return this.trigger(ACT_REORDER_LAYERS);
    };

    return Project;

  })();

  window.Page = (function() {
    function Page(definition) {
      var c, conversation, _i, _len, _ref;
      this.definition = definition;
      _.extend(this, Backbone.Events);
      this.loaded = false;
      this.layer = false;
      this.page = this;
      this.id = this.definition.id;
      this.name = this.definition.name;
      this.created = this.definition.created;
      this.modified = this.definition.modified;
      this.settings = this.definition.definition || {};
      if (this.settings.master != null) {
        this.master = parseInt(this.settings.master);
      }
      this.components = this.definition.components;
      if (this.components == null) {
        this.components = [];
      }
      this.height = 0;
      this.comments = {};
      this.comments[DESKTOP.name] = [];
      this.comments[TABLET.name] = [];
      this.comments[PHONE.name] = [];
      if (this.definition.comments) {
        _ref = this.definition.comments;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          conversation = new Conversation(this, c);
          this.comments[conversation.breakpoint.name].push(conversation);
        }
      }
      this.stack = new Stack(this);
    }

    Page.prototype.add = function(component, index) {
      if (index == null) {
        index = -1;
      }
      if (!this.loaded) {
        if (!(component instanceof Component)) {

        } else {
          throw new Error("Can not add a component to a page that's not already loaded.");
        }
        return this;
      }
      if (!(component instanceof Component)) {
        if (this.container && component.type) {
          component = this.$new(component.type, component, this.container);
        }
      }
      if (index === -1) {
        this.components.push(component);
      } else {
        this.components.splice(index, 0, component);
      }
      component.page = this;
      component.parent = this;
      this.project.trigger(ACT_ADD_COMPONENT, component, index);
      return component;
    };

    Page.prototype.put = function(component, index, parent) {
      if (!(component instanceof Component)) {
        if (this.container && component.type) {
          component = this.$new(component.type, component, this.container);
        }
      }
      if (this.components.indexOf(component) < 0) {
        this.components.splice(index, 0, component);
      }
      component.page = this;
      if (parent) {
        component.parent = parent;
      } else {
        component.parent = this;
        if (component.e.parent() !== this.container) {
          index = Math.max(0, index);
          this.container.insertAt(component.e, index);
        }
      }
      this.project.trigger(ACT_ADD_COMPONENT, component, index);
      return component;
    };

    Page.prototype.remove = function(components) {
      var c, cs, _i, _len;
      cs = components;
      if (!_.isArray(cs)) {
        cs = [components];
      }
      for (_i = 0, _len = cs.length; _i < _len; _i++) {
        c = cs[_i];
        c["delete"]();
      }
      this.project.trigger(ACT_REMOVE_COMPONENT, cs);
      return this;
    };

    Page.prototype.find = function(id) {
      var anid, c, found, ids, _i, _len;
      if (_.isArray(id)) {
        found = [];
        ids = id;
        for (_i = 0, _len = ids.length; _i < _len; _i++) {
          anid = ids[_i];
          c = this._find(anid, this.components);
          if (c != null) {
            found.push(c);
          }
        }
        found.sort(function(c1, c2) {
          return ids.indexOf(c1.id) - ids.indexOf(c2.id);
        });
        return found;
      } else {
        return this._find(id, this.components);
      }
    };

    Page.prototype._find = function(id, components) {
      var c, d, _i, _len;
      if (components == null) {
        return null;
      }
      for (_i = 0, _len = components.length; _i < _len; _i++) {
        c = components[_i];
        if (c.id === id) {
          return c;
        }
        if (c.components != null) {
          d = this._find(id, c.components);
          if (d != null) {
            return d;
          }
        }
      }
      return null;
    };

    Page.prototype.load = function(container) {
      var c, cs, def, _i, _j, _len, _len1, _ref, _ref1;
      this.container = container;
      this.height = 0;
      if (this.loaded) {
        _ref = this.components;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          c.parent = this;
          this.container.append(c.e);
        }
        return this.height = this.computeHeight();
      } else {
        this.loaded = true;
        cs = [];
        _ref1 = this.components;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          def = _ref1[_j];
          c = this.$new(def.type, def, this.container);
          c.parent = this;
          cs.push(c);
        }
        this.components = cs;
        return this.height = this.computeHeight();
      }
    };

    Page.prototype.write = function() {
      var c, cs, def, _i, _len, _ref;
      cs = [];
      _ref = this.components;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        def = _ref[_i];
        c = this.$new(def.type, def, this.container);
        c.parent = this;
        cs.push(c);
      }
      return this.components = cs;
    };

    Page.prototype.$write = function(type, def) {
      var c, component;
      component = ComponentType.byType(type);
      c = component.$new(def, this);
      return component.write(c);
    };

    Page.prototype.$new = function(type, def, container) {
      var c, component, subc, subcomponents, subdef, _i, _len, _ref;
      if (container == null) {
        container = this.container;
      }
      component = ComponentType.byType(type);
      if (component == null) {
        throw new Error("Component of type " + type + " not found.");
      }
      c = component.$new(def, this);
      container.append(c.e);
      c.e.addClass("" + type + " Component");
      if (type === "group") {
        subcomponents = [];
        _ref = def.components;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          subdef = _ref[_i];
          subc = this.$new(subdef.type, subdef, c.container);
          subc.parent = c;
          subcomponents.push(subc);
        }
        c.components = subcomponents;
        c.computeSize();
      }
      component.render(c);
      c.page = this;
      return c;
    };

    Page.prototype.select = function(components, sid, remote) {
      var data, selection;
      if (remote == null) {
        remote = false;
      }
      this.selections = this.selections || {};
      selection = new Selection(components);
      if (sid != null) {
        selection.id = sid;
      }
      if (_.isObject(remote)) {
        selection.remoteData = data = remote;
        selection.remote = true;
        selection.client = data.client;
        selection.user = data.user;
      }
      return this.reselect(selection, selection.saved);
    };

    Page.prototype.reselect = function(selection, push) {
      if (push == null) {
        push = true;
      }
      this.selections = this.selections || {};
      this.selections[selection.id] = selection;
      if (selection.remote) {
        this.project.trigger(ACT_REMOTE_SELECT, selection);
      } else {
        this.project.trigger(ACT_SELECT, selection);
      }
      return selection;
    };

    Page.prototype.selection = function(sid) {
      if (this.selections != null) {
        return this.selections[sid];
      }
      return null;
    };

    Page.prototype.remoteSelections = function() {
      var id, selection, selections, _ref;
      this.selections = this.selections || {};
      selections = [];
      _ref = this.selections;
      for (id in _ref) {
        selection = _ref[id];
        selections.push(selection);
      }
      return selections;
    };

    Page.prototype.deselect = function(sid, push) {
      var selection;
      if (push == null) {
        push = true;
      }
      this.selections = this.selections || {};
      selection = this.selections[sid];
      delete this.selections[sid];
      if (selection != null) {
        if (selection.remote) {
          return this.project.trigger(ACT_REMOTE_DESELECT, selection);
        } else {
          return this.project.trigger(ACT_DESELECT, selection);
        }
      }
    };

    Page.prototype.deselectAll = function(push) {
      var id, selection, _ref, _results;
      if (push == null) {
        push = true;
      }
      _ref = this.selections;
      _results = [];
      for (id in _ref) {
        selection = _ref[id];
        _results.push(this.deselect(id, push));
      }
      return _results;
    };

    Page.prototype.update = function(name, value) {
      var data,
        _this = this;
      data = {
        page: this.id,
        name: name,
        value: value
      };
      return this.project.server.post(ACTION_PAGEDEFINITION, data).done(function(data) {
        return false;
      });
    };

    Page.prototype.computeHeight = function(minheight) {
      var c, pageHeight, _i, _j, _len, _len1, _ref, _ref1, _ref2;
      if (minheight == null) {
        minheight = 1000;
      }
      pageHeight = minheight;
      if (this.page.components != null) {
        _ref = this.page.components;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          if (!isNaN(c.height)) {
            pageHeight = Math.max(pageHeight, c.y + c.height);
          }
        }
      }
      if (((_ref1 = this.page.master) != null ? _ref1.components : void 0) != null) {
        _ref2 = this.page.master.components;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          c = _ref2[_j];
          if (!isNaN(c.height)) {
            pageHeight = Math.max(pageHeight, c.y + c.height);
          }
        }
      }
      return pageHeight;
    };

    return Page;

  })();

  window.Layer = (function(_super) {
    __extends(Layer, _super);

    function Layer(definition) {
      this.definition = definition;
      Layer.__super__.constructor.call(this, this.definition);
      this.layer = true;
    }

    Layer.prototype.getBounds = function() {
      var bounds, c, d, i, _i, _len, _ref, _ref1;
      bounds = {
        x: 10000,
        y: 100000,
        width: 0,
        height: 0
      };
      _ref = this.components;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        c = _ref[i];
        d = c.definition[c.breakpoint.name];
        _ref1 = [parseInt(d.x), parseInt(d.y), parseInt(d.width), parseInt(d.height)], d.x = _ref1[0], d.y = _ref1[1], d.width = _ref1[2], d.height = _ref1[3];
        if (!c.visible) {
          continue;
        }
        if (d.x < bounds.x) {
          bounds.x = d.x;
        }
        if (d.y < bounds.y) {
          bounds.y = d.y;
        }
        if (d.x + d.width > bounds.width) {
          bounds.width = d.x + d.width;
        }
        if (d.y + d.height > bounds.height) {
          bounds.height = d.y + d.height;
        }
      }
      bounds.width = bounds.width - bounds.x;
      bounds.height = bounds.height - bounds.y;
      return bounds;
    };

    Layer.prototype.moveBy = function(delta) {
      var c, i, _i, _len, _ref, _results;
      _ref = this.components;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        c = _ref[i];
        _results.push(c.move(c.x, c.y + delta));
      }
      return _results;
    };

    return Layer;

  })(Page);

  comment_breakpoints = ["makes it an index 1 array :)", PHONE, TABLET, DESKTOP];

  window.Comment = (function() {
    Comment.getBreakpoint = function(index) {
      return comment_breakpoints[index];
    };

    Comment.getBreakpointIndex = function(breakpoint) {
      return comment_breakpoints.indexOf(breakpoint);
    };

    function Comment(page, definition) {
      this.page = page;
      this.definition = definition;
      this.id = this.definition.id;
      this.guid = this.definition.guid;
      this.user = this.definition.user;
      this.text = this.definition.text;
      this.definition.breakpoint = parseInt(this.definition.breakpoint);
      if (isNaN(this.definition.breakpoint)) {
        this.definition.breakpoint = 1;
      }
      this.breakpoint = comment_breakpoints[this.definition.breakpoint];
      this.conversation = null;
    }

    Comment.prototype.save = function() {
      var bp,
        _this = this;
      bp = comment_breakpoints.indexOf(this.breakpoint);
      return this.page.project.server.post(ACTION_COMMENT_ADD, {
        page: this.page.id,
        guid: this.guid,
        text: this.text,
        reply: this.conversation.id,
        breakpoint: bp,
        page_width: this.breakpoint.width
      }).done(function(data) {
        return _this.id = data.id;
      });
    };

    Comment.prototype["delete"] = function() {
      var bp;
      bp = comment_breakpoints.indexOf(this.breakpoint);
      return this.page.project.server.post(ACTION_COMMENT_DELETE, {
        id: this.id,
        page: this.page.id,
        guid: this.guid,
        breakpoint: bp
      });
    };

    return Comment;

  })();

  window.Conversation = (function(_super) {
    __extends(Conversation, _super);

    function Conversation(page, definition) {
      var reply, _i, _len, _ref;
      this.page = page;
      this.definition = definition;
      Conversation.__super__.constructor.call(this, this.page, this.definition);
      this.x = this.definition.x;
      this.y = this.definition.y;
      this.type = parseInt(this.definition.type);
      if (isNaN(this.type)) {
        this.type = 1;
      }
      this.completed = this.definition.completed === "true";
      this.replies = [];
      if (this.definition.comments != null) {
        _ref = this.definition.comments;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          reply = _ref[_i];
          this.addReply(new Comment(this.page, reply));
        }
      }
      if (this.id == null) {
        this.save();
      }
    }

    Conversation.prototype.save = function() {
      var bp,
        _this = this;
      bp = comment_breakpoints.indexOf(this.breakpoint);
      return this.page.project.server.post(ACTION_COMMENT_ADD, {
        page: this.page.id,
        guid: this.guid,
        text: this.text,
        x: this.x,
        y: this.y,
        breakpoint: bp,
        page_width: this.breakpoint.width
      }).done(function(data) {
        return _this.id = data.id;
      });
    };

    Conversation.prototype.update = function() {
      var bp;
      bp = comment_breakpoints.indexOf(this.breakpoint);
      return this.page.project.server.post(ACTION_COMMENT_UPDATE, {
        id: this.id,
        page: this.page.id,
        guid: this.guid,
        x: this.x,
        y: this.y,
        completed: this.completed,
        type: this.type,
        breakpoint: bp
      });
    };

    Conversation.prototype.addReply = function(comment) {
      this.replies.push(comment);
      comment.conversation = this;
      if (comment.id == null) {
        return comment.save();
      }
    };

    return Conversation;

  })(Comment);

  Stack = (function() {
    function Stack(page) {
      this.page = page;
      this.operations = [];
    }

    Stack.prototype.add = function(selection, indexes) {
      return this._push('add', selection, indexes);
    };

    Stack.prototype.del = function(selection, indexes) {
      return this._push('del', selection, indexes);
    };

    Stack.prototype.compute = function(index, start) {
      var i, op;
      i = start;
      while (i < this.operations.length) {
        op = this.operations[i];
        index = op.compute(index);
        i++;
      }
      return index;
    };

    Stack.prototype._push = function(type, selection, indexes) {
      var operation;
      operation = new StackOperation(type, selection, indexes);
      operation.index = this.operations.length;
      this.operations.push(operation);
      return operation.index;
    };

    return Stack;

  })();

  StackOperation = (function() {
    function StackOperation(type, selection, indexes) {
      this.type = type != null ? type : 'add';
      this.selection = selection;
      this.indexes = indexes;
    }

    StackOperation.prototype.compute = function(index) {
      var i, _i, _j, _len, _len1, _ref, _ref1;
      if (this.type === 'add') {
        _ref = this.indexes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          if (i < index) {
            index++;
          }
        }
      } else if (this.type === 'del') {
        _ref1 = this.indexes;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          i = _ref1[_j];
          if (i < index) {
            index--;
          }
        }
      }
      return Math.max(index, 0);
    };

    return StackOperation;

  })();

  space = new RegExp(" ", 'g');

  act = function(action) {
    var A, a, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = arguments.length; _i < _len; _i++) {
      action = arguments[_i];
      A = action.toUpperCase().replace(space, "_");
      a = action.replace(space, "_");
      _results.push(window["ACT_" + A] = "action:" + a);
    }
    return _results;
  };

  cmd = function(action) {
    var A, a, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = arguments.length; _i < _len; _i++) {
      action = arguments[_i];
      A = action.toUpperCase().replace(space, "_");
      a = action.replace(space, "_");
      window["UNDO_" + A] = window["REDO_" + A] = window["CMD_" + A] = "command:" + a;
      _results.push(window["ACT_" + A] = "action:" + a);
    }
    return _results;
  };

  window.COMPONENTS_DESELECTED_EVENT = "TO BE REMOVED 1";

  window.COMPONENTS_SELECTED_EVENT = "TO BE REMOVED 2";

  window.COMPONENT_ADD_EVENT = "TO BE REMOVED 3";

  window.COMPONENT_DEL_EVENT = "TO BE REMOVED 4";

  cmd("select", "drop", "delete", "deselect", "replace selection", "remote select", "remote deselect");

  cmd("drop stencil");

  cmd("add component", "remove component");

  cmd("move", "resize", "transform", "update", "updateall", "update stack");

  cmd("cut", "paste", "copy", "undo", "redo", "duplicate");

  cmd("palette drop", "palette drag");

  cmd("edit group", "close group", "group", "ungroup");

  cmd("breakpoint change", "load font");

  cmd("add page", "remove page", "move page", "reorder pages", "rename page", "setmaster");

  cmd("add layer", "remove layer", "move layer", "rename layer", "reorder layers");

  cmd("add behavior", "remove behavior", "move behavior", "select behavior", "deselect behavior", "end behavior edit");

  cmd("select page", "select layer", "design page", "deselect layer", "preview page", "close preview page", "preview layer", "close layer preview");

  cmd("preload layer");

  cmd("add comment", "remove comment", "move comment", "update comment", "remove reply", "add reply", "show comment", "reorder comments");

  act("update behaviors");

  act("stencils drop");

  act("quick link");

}).call(this);
;(function() {
  var Font, edgeFont, font, _i, _len;

  Font = (function() {
    Font.byId = function(id) {
      return ALL_FONTS_DATA[id];
    };

    function Font(id, name) {
      this.id = id;
      this.name = name;
      this.loaded = false;
    }

    Font.prototype.load = function() {
      EventDispatcher.trigger(ACT_LOAD_FONT, this);
      return this.loaded = true;
    };

    return Font;

  })();

  window.Font = Font;

  window.ALL_FONTS_DATA = {};

  window.ALL_FONTS = ["Andale Mono", "Arial", "Arial Black", "Comic Sans MS", "Courier New", "Georgia", "Impact", "Open Sans", "Times New Roman", "Trebuchet MS", "Verdana"];

  for (_i = 0, _len = EdgeFonts.length; _i < _len; _i++) {
    edgeFont = EdgeFonts[_i];
    if (edgeFont.sets.length < 3) {
      continue;
    }
    font = new Font(edgeFont.code, edgeFont.name);
  }

}).call(this);
;(function() {
  window.Track = {
    project: null,
    feature: function(name) {
      var data;
      data = {};
      if (this.project != null) {
        data.project = this.project.id;
      }
      data.name = name;
      return $.post('/track', data);
    },
    session: function() {
      var data;
      data = {};
      data.key = this.project.client;
      if (this.project != null) {
        data.project = this.project.id;
      }
      return $.post('/track/session', data);
    },
    onProject: function(project) {
      this.project = project;
    }
  };

  window.track_session = function() {
    return Track.session();
  };

  window.mixpanel_track = function(name) {
    Track.feature(name);
    if (production) {
      mixpanel.track(name);
      return heap.track(name);
    }
  };

}).call(this);
;(function() {
  var BuildStage, FIXED_CLASS, ViewerStage, comment_breakpoints, getQueryVariable, is_iOS;

  _.mixin(_.string.exports());

  comment_breakpoints = ["makes it an index 1 array :)", PHONE, TABLET, DESKTOP];

  FIXED_CLASS = "fixed";

  is_iOS = (navigator.platform === 'iPad') || (navigator.platform === 'iPhone') || (navigator.platform === 'iPod');

  if (is_iOS) {
    FIXED_CLASS = "fixed";
  }

  getQueryVariable = function(variable) {
    var pair, val, vars, _i, _len;
    vars = window.location.search.substring(1).split('&');
    for (_i = 0, _len = vars.length; _i < _len; _i++) {
      val = vars[_i];
      pair = val.split('=');
      if (pair[0] === variable) {
        return pair[1];
      }
    }
  };

  ViewerStage = (function() {
    function ViewerStage() {}

    ViewerStage.prototype.initViewerStage = function() {
      var body, borderMenu, bp, key, value, view,
        _this = this;
      _.bindAll(this);
      this.show_comments = false;
      body = $(".body");
      borderMenu = $(".border-menu");
      $(".border-menu a.toggle-border-menu").on("click", function(event) {
        event.preventDefault();
        borderMenu.toggleClass("opened");
        $(event.target).find("i").toggleClass("fa-reorder").toggleClass("fa-times");
        return false;
      });
      $("ul.border-menu a.toggle-comments").on("click", function(event) {
        var width;
        event.preventDefault();
        width = $(window).width();
        if (width < DESKTOP.width) {
          return false;
        }
        $(event.target).find("i").toggleClass("fa-comment-o").toggleClass("fa-comment");
        _this.show_comments = !_this.show_comments;
        if (_this.show_comments) {
          body.addClass("show-comments");
        } else {
          body.removeClass("show-comments");
        }
        return false;
      });
      $(".border-menu a.add-comment").on("click", function(event) {
        event.preventDefault();
        return false;
      });
      $(".border-menu a.add-comment").on("mousedown", function(event) {
        var initial, local, stage0, target, width;
        event.preventDefault();
        local = eventLocal(event);
        target = $(event.target);
        initial = target.offset();
        target.addClass("adding-comment");
        stage0 = _this.buildstage.element.offset();
        width = _this.buildstage.element.width();
        $(document).on("mousemove.add-comment", function(event) {
          event.preventDefault();
          target.css({
            left: event.pageX - local.x,
            top: event.pageY - local.y
          });
          return false;
        });
        $(document).on("mouseup.add-comment", function(event) {
          var where;
          event.preventDefault();
          target.removeClass("adding-comment");
          where = {
            x: event.pageX - local.x - stage0.left,
            y: event.pageY - local.y - stage0.top
          };
          target.css({
            left: initial.left,
            top: initial.top
          });
          alert("Adding comment at x:" + where.x + "; y:" + where.y);
          $(document).off(".add-comment");
          return false;
        });
        return false;
      });
      $(".border-menu a.breakpoint-phone").on("click", function(event) {
        event.preventDefault();
        _this.buildstage.setBreakpoint(PHONE);
        _this.breakpoint = window.BREAKPOINT;
        _this.updatePinnedComponentsPositions();
        return false;
      });
      $(".border-menu a.breakpoint-tablet").on("click", function(event) {
        event.preventDefault();
        _this.buildstage.setBreakpoint(TABLET);
        _this.breakpoint = window.BREAKPOINT;
        _this.updatePinnedComponentsPositions();
        return false;
      });
      $(".border-menu a.breakpoint-desktop").on("click", function(event) {
        event.preventDefault();
        _this.buildstage.setBreakpoint(DESKTOP);
        _this.breakpoint = window.BREAKPOINT;
        _this.updatePinnedComponentsPositions();
        return false;
      });
      $(".border-menu a.browse-home").on("click", function(event) {
        var page;
        event.preventDefault();
        page = _this.project.defaultPage();
        _this.project.trigger(ACT_SELECT_PAGE, page);
        return false;
      });
      $(".border-menu a.browse-left").on("click", function(event) {
        var index, p, page, _i, _len, _ref;
        event.preventDefault();
        page = _this.buildstage.page;
        _ref = _this.project.pages;
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          p = _ref[index];
          if (p.id === page.id) {
            break;
          }
        }
        if (index === 0) {
          return false;
        }
        page = _this.project.pages[index - 1];
        _this.project.trigger(ACT_SELECT_PAGE, page);
        return false;
      });
      $(".border-menu a.browse-right").on("click", function(event) {
        var index, p, page, _i, _len, _ref;
        event.preventDefault();
        page = _this.buildstage.page;
        _ref = _this.project.pages;
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          p = _ref[index];
          if (p.id === page.id) {
            break;
          }
        }
        if (index === _this.project.pages.length - 1) {
          return false;
        }
        page = _this.project.pages[index + 1];
        _this.project.trigger(ACT_SELECT_PAGE, page);
        return false;
      });
      this.buildstage = new BuildStage(this);
      $(window).on("resize", function() {
        _this.computeWidth();
        return _this.updatePinnedComponentsPositions();
      });
      this.content = this.buildstage.wrapper.find(".content");
      this.content.on("scroll", function(event) {
        event.preventDefault();
        _this.checkPinnedComponents();
        return false;
      });
      view = getQueryVariable('v');
      if (!view) {
        view = 'd';
      }
      bp = "desktop";
      for (key in BREAKPOINTS) {
        value = BREAKPOINTS[key];
        if (key[0] === view) {
          $(".border-menu a.breakpoint-" + key).trigger("click");
          break;
        }
      }
      return EventDispatcher.on('font-load', function(font) {
        return _this.addScript("http://use.edgefonts.net/" + font.id + ".js");
      });
    };

    ViewerStage.prototype.checkPinnedComponents = function() {
      var o, scrolltop;
      scrolltop = this.content.scrollTop();
      o = this.content.offset();
      this.pinnedComponents.each(function(index) {
        var g;
        g = $(this).data(FB_DATA);
        if (g == null) {
          return true;
        }
        if (g.e.hasClass("group-position-fixed")) {
          if (g.y > scrolltop) {
            g.e.removeClass("group-position-fixed").css({
              "top": g.y,
              "left": g.x,
              "position": "absolute"
            });
          }
        } else if (g.y <= scrolltop) {
          g.e.addClass("group-position-fixed").css({
            "top": o.top,
            "left": g.x + o.left,
            "position": FIXED_CLASS
          });
        }
        return true;
      });
      return false;
    };

    ViewerStage.prototype.updatePinnedComponentsPositions = function() {
      var content, o;
      content = this.buildstage.wrapper.find(".content-wrapper");
      o = content.offset();
      return $(".group-position-fixed").each(function() {
        var g;
        g = $(this).data(FB_DATA);
        if (g == null) {
          return true;
        }
        g.e.css({
          "left": g.x + o.left,
          "top": o.top,
          "position": FIXED_CLASS
        });
        if ("life is good" !== "true") {
          return true;
        }
      });
    };

    ViewerStage.prototype.absolutePinnedComponents = function() {
      var o, scrolltop;
      scrolltop = this.content.scrollTop();
      o = this.content.offset();
      $(".group-position-fixed").each(function(index) {
        var g;
        g = $(this).data(FB_DATA);
        if (g == null) {
          return true;
        }
        g.e.css({
          "top": scrolltop,
          "left": g.x,
          "position": "absolute"
        });
        return true;
      });
      return false;
    };

    ViewerStage.prototype.computeWidth = function() {
      var changed, name, width;
      if (this.breakpoint != null) {
        return false;
      }
      name = window.BREAKPOINT.name;
      width = $(window).width();
      if (width >= DESKTOP.width) {
        window.BREAKPOINT = DESKTOP;
        width = DESKTOP.width;
        if (this.show_comments) {
          $(".body").addClass("show-comments");
        }
      } else if (width >= TABLET.width) {
        window.BREAKPOINT = TABLET;
        width = TABLET.width;
        $(".body").removeClass("show-comments");
      } else if (width >= PHONE.width) {
        window.BREAKPOINT = PHONE;
        width = PHONE.width;
        $(".body").removeClass("show-comments");
        $('body').scrollTop(1);
      }
      changed = name !== window.BREAKPOINT.name;
      if (changed) {
        this.buildstage.setBreakpoint(window.BREAKPOINT);
        this.breakpoint = null;
        if (BREAKPOINT.name === PHONE.name) {
          $(window).scrollTop(0);
        }
      }
      return this;
    };

    ViewerStage.prototype.loadProject = function(projectDefinition) {
      var hash, page,
        _this = this;
      this.project = new Project(projectDefinition);
      $(window).on("hashchange", function() {
        var hash, page;
        hash = window.location.hash;
        if ((hash != null) && hash !== "" && hash !== "#") {
          return _this.displayHash();
        } else {
          page = _this.project.defaultPage();
          _this.buildstage.displayPage(page);
          return $(".body").scrollTop(0);
        }
      });
      this.project.on(ACT_SELECT_PAGE, function(page) {
        _this.buildstage.displayPage(page);
        page = _this.project.defaultPage();
        if (page.id !== _this.page.id) {
          window.location.hash = "" + _this.page.id;
        } else {
          window.location.hash = "";
        }
        return _this.pinnedComponents = $(".group-pinned");
      });
      this.project.on(ACT_SELECT_LAYER, function(layer) {
        _this.buildstage.load(layer);
        _this.pinnedComponents = $(".group-pinned");
        if (layer.sidebarmenu) {
          return _this.absolutePinnedComponents();
        } else {
          return _this.updatePinnedComponentsPositions();
        }
      });
      this.project.on(ACT_DESELECT_LAYER, function(layer) {
        _this.buildstage.unload(layer);
        _this.pinnedComponents = $(".group-pinned");
        return _this.updatePinnedComponentsPositions();
      });
      this.project.on(CMD_PRELOAD_LAYER, function(folio) {
        return _this.buildstage.preload(folio);
      });
      this.computeWidth();
      this.buildstage.setBreakpoint(window.BREAKPOINT);
      hash = window.location.hash;
      if ((hash != null) && hash !== "" && hash !== "#") {
        this.displayHash();
      } else {
        page = this.project.defaultPage();
        this.buildstage.displayPage(page);
        $(".body").scrollTop(0);
      }
      return this.pinnedComponents = $(".group-pinned");
    };

    ViewerStage.prototype.displayHash = function() {
      var h, hash, page, scroll;
      hash = window.location.hash;
      if (!hash || hash === "#") {
        return false;
      } else {
        hash = hash.substr(1);
        scroll = 0;
        if (hash.indexOf("-") > -1) {
          h = hash.split("-");
          hash = parseInt(h[0]);
          scroll = parseInt(h[1]);
        }
        if ((this.page == null) || this.page.id !== hash) {
          page = this.project.pageById(hash);
          if (page != null) {
            this.buildstage.displayPage(page);
          }
        }
        if (scroll != null) {
          if (BREAKPOINT.name === DESKTOP.name) {
            return this.buildstage.wrapperContent.scrollTop(scroll);
          } else {
            return this.buildstage.wrapperContent.scrollTop(scroll);
          }
        }
      }
    };

    ViewerStage.prototype.addScript = function(url) {
      var script;
      script = document.createElement('script');
      script.setAttribute("type", "text/javascript");
      script.setAttribute("src", url);
      return document.getElementsByTagName('head')[0].appendChild(script);
    };

    return ViewerStage;

  })();

  window.ViewerStage = ViewerStage;

  BuildStage = (function() {
    function BuildStage(viewerstage) {
      this.viewerstage = viewerstage;
      _.extend(this, Backbone.Events);
      _.bindAll(this);
      this.layers = [];
      this.layerStages = [];
      this.wrapper = $(".viewport");
      this.wrapperContent = $(".viewport > div");
      this.contentWrapper = $(".content .content-wrapper");
      this.sidebarWrapper = $(".drawer .content-wrapper");
    }

    BuildStage.prototype.computeHeight = function() {
      var h, l, _i, _len, _ref;
      h = getQueryVariable('height');
      if (h != null) {
        h = parseInt(h);
        if (!isNaN(h)) {
          this.height = h;
          return this.height;
        }
      }
      if (this.page == null) {
        return 10;
      }
      this.height = this.page.computeHeight(10);
      _ref = this.layers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        l = _ref[_i];
        this.height = Math.max(l.computeHeight(10), this.height);
      }
      return this.height;
    };

    BuildStage.prototype.preload = function(folio) {
      var tempcontainer;
      tempcontainer = $("<div style=\"display:none\"></div>");
      this.wrapper.append(tempcontainer);
      folio.load(tempcontainer);
      tempcontainer.children().detach();
      return tempcontainer.remove();
    };

    BuildStage.prototype.displayPage = function(page) {
      var c, element, l, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      if (page == null) {
        return false;
      }
      this.page = page;
      this.contentWrapper.children().detach();
      this.sidebarWrapper.children().detach();
      this.wrapperContent.find(".content").css("float", "left").css("width", this.width);
      this.wrapperContent.find(".drawer").css("float", "left").css("width", 0).find(".content-wrapper").css("margin-left", 0);
      _ref = this.layers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        l = _ref[_i];
        l.selected = false;
      }
      this.layers = [];
      this.layerStages = [];
      this.wrapperContent.css("width", this.width);
      this.wrapperContent.find(".drawer").css("width", 0);
      element = $("<div class=\"pagestage\"></div>");
      this.contentWrapper.append(element);
      this.page.load(element);
      if (this.page.master != null) {
        this.showMasterPage(this.page.master);
        _ref1 = this.page.master.components;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          c = _ref1[_j];
          c.setBreakpoint(window.BREAKPOINT);
        }
      }
      _ref2 = this.page.components;
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        c = _ref2[_k];
        c.setBreakpoint(window.BREAKPOINT);
      }
      this.wrapper.css("height", this.computeHeight());
      return this.showComments();
    };

    BuildStage.prototype.showMasterPage = function(page) {
      var container;
      if (!isNaN(page)) {
        return false;
      }
      container = $("<div class=\"pagestage\"></div>");
      this.contentWrapper.prepend(container);
      return page.load(container);
    };

    BuildStage.prototype.load = function(layer) {
      var bounds, container, index;
      index = this.layers.indexOf(layer);
      if (index > -1) {
        return false;
      }
      container = $("<div class=\"pagestage\"></div>");
      if (layer.sidebarmenu) {
        this.sidebarWrapper.children().detach();
        container.appendTo(this.sidebarWrapper);
        container.addClass("sidebarmenu-layer");
        bounds = layer.getBounds();
        if (layer.sidebarside === "left") {
          this.wrapperContent.find(".content").css("float", layer.sidebarside).css("overflow-y", "hidden").css("width", this.width - bounds.width);
          this.wrapperContent.find(".drawer").css("float", layer.sidebarside).css("width", bounds.width);
        } else {
          this.wrapperContent.find(".content").css({
            "float": layer.sidebarside,
            "overflow-y": "hidden",
            "width": this.width - bounds.width
          }).find(".content-wrapper").css("margin-left", -bounds.width);
          this.wrapperContent.find(".drawer").css({
            "float": layer.sidebarside,
            "width": bounds.width
          }).find(".content-wrapper").css("margin-left", -bounds.x);
        }
      } else {
        container.appendTo(this.contentWrapper);
      }
      layer.load(container);
      this.layers.push(layer);
      this.layerStages.push(container);
      this.wrapper.css("height", this.computeHeight());
      return this.showComments();
    };

    BuildStage.prototype.unload = function(layer) {
      var index, stage;
      index = this.layers.indexOf(layer);
      if (index === -1) {
        return false;
      }
      stage = this.layerStages[index];
      stage.children().detach();
      stage.remove();
      this.layers.splice(index, 1);
      this.layerStages.splice(index, 1);
      if (layer.sidebarmenu || stage.is(".sidebarmenu-layer")) {
        this.wrapperContent.find(".content").css("float", "left").css("width", this.width).find(".content-wrapper").css("margin-left", 0);
        this.wrapperContent.find(".drawer").css("float", "left").css("width", 0).find(".content-wrapper").css("margin-left", 0);
      }
      this.wrapper.css("height", this.computeHeight());
      this.showComments();
      return this.page;
    };

    BuildStage.prototype.setBreakpoint = function(breakpoint) {
      var c, l, width, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3;
      this.breakpoint = breakpoint;
      width = breakpoint.width;
      if (breakpoint.name === DESKTOP.name) {
        window.BREAKPOINT = DESKTOP;
        this.width = DESKTOP.width;
        this.wrapper.css({
          width: this.width
        });
      } else if (breakpoint.name === TABLET.name) {
        window.BREAKPOINT = TABLET;
        this.width = TABLET.width;
        this.wrapper.css({
          width: this.width
        });
      } else if (breakpoint.name === PHONE.name) {
        window.BREAKPOINT = PHONE;
        this.width = PHONE.width;
        this.wrapper.css({
          width: this.width
        });
      }
      window.BREAKPOINT = breakpoint;
      this.width = breakpoint.width;
      this.wrapper.css({
        width: this.width
      });
      this.wrapperContent.css("width", this.width).find(".content").css("width", this.width);
      $("body").removeClass("desktop tablet phone").addClass(breakpoint.name);
      if (this.page != null) {
        _ref = this.page.components;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          c.setBreakpoint(breakpoint);
        }
        if (this.page.master) {
          _ref1 = this.page.master.components;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            c = _ref1[_j];
            c.setBreakpoint(breakpoint);
          }
        }
        _ref2 = this.layers;
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          l = _ref2[_k];
          _ref3 = l.components;
          for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
            c = _ref3[_l];
            c.setBreakpoint(breakpoint);
          }
        }
      }
      this.wrapper.css("height", this.computeHeight());
      return this.showComments();
    };

    BuildStage.prototype.showComments = function() {
      var comment, comments, commentsView, container, index, marker, page, _i, _len, _results;
      if (this.page == null) {
        return false;
      }
      if (this.layers.length > 0) {
        page = this.layers[this.layers.length - 1];
      } else {
        page = this.page;
      }
      container = page.container;
      $(".comment-marker").remove();
      comments = page.comments[this.breakpoint.name];
      commentsView = $(".comments-view");
      commentsView.empty();
      index = 1;
      _results = [];
      for (_i = 0, _len = comments.length; _i < _len; _i++) {
        comment = comments[_i];
        if (comment.type !== 1) {
          continue;
        }
        marker = new CommentMarker(comment.x, comment.y, index);
        marker.converse(comment);
        container.append(marker.element);
        commentsView.append(marker.view());
        _results.push(index++);
      }
      return _results;
    };

    return BuildStage;

  })();

  $(document).ready(function() {
    var stage;
    if (!$("body").is(".viewer")) {
      return;
    }
    FastClick.attach(document.body);
    stage = new ViewerStage();
    stage.initViewerStage();
    return stage.loadProject(PROJECT_DEFINITION);
  });

}).call(this);
;(function() {
  var PROJECT_LIMIT, exportFrame;

  window.webapp = {};

  exportFrame = null;

  PROJECT_LIMIT = 0;

  webapp.updateActionCreationLink = function() {
    var PAGE_WIDTH, actionCreateProject;
    PAGE_WIDTH = $(window).width();
    actionCreateProject = $(".action-create-project");
    return actionCreateProject.on('click', function(event) {
      var url;
      event.preventDefault();
      url = actionCreateProject.attr("href");
      url = "" + url + "?w=" + PAGE_WIDTH;
      window.location = url;
      return false;
    });
  };

  webapp.projectsPage = function(remaining) {
    var project_id;
    webapp.updateActionCreationLink();
    PROJECT_LIMIT = remaining;
    project_id = -1;
    $(".add-colaborator").on('click', function() {
      var $this, fields, parent;
      event.preventDefault();
      project_id = $(event.currentTarget).attr("data-id");
      $this = $(this);
      parent = $this.parents(".project-thumbnail");
      parent.addClass("invite-collaborators");
      fields = [];
      parent.find(".autocomplete").each(function() {
        var field;
        field = new Autocomplete($(this), FRIENDS);
        if (fields.length > 0) {
          fields[fields.length - 1].nextTo(field);
        }
        return fields.push(field);
      });
      if (fields.length > 0) {
        fields[0].focus();
      }
      parent.find(".btn-cancel").on("click.invite", function() {
        var field, _i, _len, _results;
        parent.removeClass("invite-collaborators");
        $(this).off(".invite");
        _results = [];
        for (_i = 0, _len = fields.length; _i < _len; _i++) {
          field = fields[_i];
          _results.push(field.destroy());
        }
        return _results;
      });
      parent.find(".btn-invite").on("click.invite", function() {
        var emails, field, message, _i, _len;
        $(this).off(".invite");
        emails = [];
        for (_i = 0, _len = fields.length; _i < _len; _i++) {
          field = fields[_i];
          if (field.value != null) {
            emails.push(field.value.email);
          }
          field.destroy();
        }
        message = parent.find("textarea").val();
        parent.removeClass("invite-collaborators");
        return $.post(SENDINVITE, {
          emails: emails,
          project: project_id,
          message: message
        }).done(function(data) {
          var avatars, caption, i, left, user, users, _j, _len1, _results;
          if (data.success) {
            users = data.users;
            if ((users != null) && users.length > 0) {
              caption = parent.find(".caption");
              avatars = caption.find(".avatar");
              left = 6 - avatars.length;
              _results = [];
              for (i = _j = 0, _len1 = users.length; _j < _len1; i = ++_j) {
                user = users[i];
                if (i === left) {
                  break;
                }
                _results.push(caption.append("<a href=\"#\"  title=\"" + user.name + "\" class=\"avatar pull-right\">\n	<img src=\"http://www.gravatar.com/avatar/" + user.email + "?s=24\" />\n</a>"));
              }
              return _results;
            }
          }
        });
      });
      return false;
    });
    new EditableText(".project-name h3", function(value, target) {
      project_id = target.attr("data-id");
      if (!_.trim(value) || value.length > "This is the maximum number of chars. One.".length) {
        return false;
      }
      return $.post(PROJECT_RENAME, {
        id: project_id,
        name: value
      }).done(function(data) {});
    });
    return $(".project-list").click(".project-actions a", function(event) {
      var action, column, favorite, parent, project_name, public_key, row, subdomain, target;
      target = $(event.target);
      column = target.parents(".project-thumbnail").parent();
      row = column.parent();
      project_id = target.attr("data-id");
      action = target.attr("data-action");
      if (action === 'archive') {
        $.post(PROJECT_ARCHIVE, {
          id: project_id
        }).done(function(data) {
          if (data.success) {
            return column.hide('slow', function() {
              return column.remove();
            });
          }
        });
        event.preventDefault();
        return false;
      }
      if (action === 'favorite') {
        favorite = column.is(".project-favorite");
        $.post(PROJECT_FAVORITE, {
          id: project_id,
          favorite: !favorite
        }).done(function(data) {
          var favorites;
          if (data.success) {
            column = target.parents(".project-thumbnail").parent();
            if (favorite) {
              column.removeClass("project-favorite");
            }
            favorites = $(".project-favorite");
            if (favorite) {
              if (favorites.length === 0 || (column.index() === favorites.length)) {
                return true;
              }
            } else {
              if ((column.index() === 0) || (column.index() === favorites.length)) {
                column.addClass("project-favorite");
                return true;
              }
            }
            return column.fadeOut('slow', function() {
              column.detach();
              if (favorite) {
                if (favorites.length > 0) {
                  column.insertAfter(favorites.last());
                }
              } else {
                column.addClass("project-favorite");
                if (favorites.length > 0) {
                  column.insertAfter(favorites.last());
                } else {
                  row.prepend(column);
                }
              }
              return column.fadeIn('slow');
            });
          }
        });
        event.preventDefault();
        return false;
      }
      if (action === 'delete') {
        $.post(PROJECT_DELETE, {
          id: project_id
        }).done(function(data) {
          if (data.success) {
            PROJECT_LIMIT = PROJECT_LIMIT + 1;
            column = target.parents(".project-thumbnail").parent();
            return column.hide('slow', function() {
              return column.remove();
            });
          }
        });
        event.preventDefault();
        return false;
      }
      if (action === 'export') {
        if (exportFrame == null) {
          exportFrame = $("<iframe style=\"display:none;\" ></iframe>");
          exportFrame.appendTo($("body"));
        }
        exportFrame.attr("src", PROJECT_DOWNLOAD + project_id);
        event.preventDefault();
        return false;
      }
      if (action === 'print') {
        if (exportFrame == null) {
          exportFrame = $("<iframe style=\"display:none;\" ></iframe>");
          exportFrame.appendTo($("body"));
        }
        parent = target.parents(".project-thumbnail");
        public_key = parent.children("a").attr("href");
        public_key = public_key.substr(public_key.lastIndexOf("/") + 1);
        subdomain = location.hostname.split('.').shift();
        project_name = parent.find("div.project-name h3").text().split(' ').join('_');
        exportFrame.attr("src", "//" + PDFGEN_URL + "/project/export?project=" + public_key + "&subdomain=" + subdomain + "&version=" + VERSION + "&name=" + project_name);
        event.preventDefault();
        return false;
      }
      if (action === 'duplicate') {
        if (PROJECT_LIMIT < 1) {
          return false;
        }
        project_id = target.attr("data-id");
        event.preventDefault();
        $.get(PROJECT_DUPLICATE, {
          id: project_id
        }).done(function(data) {
          var clone;
          if (data.success) {
            PROJECT_LIMIT = PROJECT_LIMIT - 1;
            column = target.parents(".project-thumbnail").parent();
            clone = column.clone().insertAfter(column).hide().show("slow");
            clone.find("[data-id='" + project_id + "']").attr("data-id", data.id);
            clone.find("a.action-project-view").attr("href", "" + VIEW_PROJECT + data.public_key);
            return clone.find(".project-name h3").text(data.name);
          }
        });
        return false;
      }
    });
  };

  webapp.projectsArchive = function() {
    return $(".project-activate").click(function(event) {
      var project_id, target;
      event.preventDefault();
      target = $(event.currentTarget);
      project_id = target.attr("data-id");
      target.find(".fa.fa-cog").addClass("fa-spin");
      $.post(PROJECT_ACTIVATE, {
        id: project_id
      }).done(function(data) {
        var column;
        if (data.success) {
          column = target.parents(".project-thumbnail").parent();
          return column.hide('slow', function() {
            column.remove();
            return window.location = '/';
          });
        } else {
          if (data.message) {
            return alert(data.message);
          }
        }
      });
      return false;
    });
  };

  webapp.projectSamples = function() {
    webapp.updateActionCreationLink();
    return $(".project-activate").click(function(event) {
      var project_key, target;
      event.preventDefault();
      target = $(event.currentTarget);
      project_key = target.attr("data-id");
      target.find(".fa.fa-coffee").toggleClass("fa-coffee fa-spinner fa-spin");
      $.post(PROJECT_SAMPLETIVATE, {
        id: project_key
      }).done(function(data) {
        if (data.success) {
          return window.location = "" + DESIGN_PROJECT + project_key;
        } else {
          if (data.message) {
            return alert(data.message);
          }
        }
      });
      return false;
    });
  };

  webapp.membersPage = function() {
    return $(".role-option").click(function(event) {
      var company_id, member_id, role, target;
      target = $(event.currentTarget);
      member_id = target.attr("data-user");
      role = target.attr("data-role");
      company_id = target.attr("data-company");
      $.post(MEMBER_UPDATE_ROLE, {
        member_id: member_id,
        company_id: company_id,
        role: role
      }).done(function(data) {
        if (data.success) {
          target.parents(".btn-group").find("span.role").text(target.text());
        } else {
          if (data.message) {
            alert(data.message);
          }
        }
        return true;
      });
      return true;
    });
  };

  webapp.paymentsPage = function() {
    var paymentperiod;
    paymentperiod = $("input[name='paymentperiod']");
    return paymentperiod.on("change", function() {
      var $link, $plan, active, i, plan, plans, style, url, value, _i, _results;
      value = $("input[name='paymentperiod']:checked").val();
      if (value === "yearly") {
        plans = YEARLY_PLANS;
      } else {
        plans = MONTHLY_PLANS;
      }
      _results = [];
      for (i = _i = 1; _i <= 4; i = ++_i) {
        active = plans[i].active;
        url = plans[i].url;
        plan = plans[i].plan;
        $plan = $(".plan-" + i);
        $plan.find(".price").attr("data-price", plan.price).find("span.dollars").html(plan.price);
        if (value === "yearly") {
          $plan.find("span.dollars").html(Math.round(plan.price));
        }
        $plan.find(".projects span:first-child").text(plan.projects);
        $link = $plan.find("a.btn");
        if (!active) {
          style = $link.attr("data-style");
          _results.push($link.removeClass("btn-default disabled").text("Purchase").addClass("btn btn-" + style).attr("href", url));
        } else {
          _results.push($link.removeClass().addClass("btn btn-default disabled").text("Your plan"));
        }
      }
      return _results;
    });
  };

  webapp.accountSettings = function() {
    var oldpasswordtext, password1, password2;
    password1 = $("#password1");
    password2 = $("#password2");
    oldpasswordtext = $("#oldpasswordtext");
    return $("#updatepassword-form").on('submit', function(event) {
      var oldpasswordval, passwordval1, passwordval2;
      password1.removeAttr('disabled');
      password2.removeAttr('disabled');
      oldpasswordtext.removeAttr('disabled');
      passwordval1 = md5(password1.val());
      passwordval2 = md5(password2.val());
      if (passwordval1 !== passwordval2) {
        event.preventDefault();
        alert("The two passwords must coincide, and they do not.");
        return false;
      }
      if ("" === _.trim(passwordval1)) {
        event.preventDefault();
        alert("The new password must not be empty.");
        return false;
      }
      oldpasswordval = md5(oldpasswordtext.val());
      if (oldpasswordval === passwordval1) {
        event.preventDefault();
        alert("The new password must be different from the old one.");
        return false;
      }
      password1.attr('disabled', 'disabled');
      password2.attr('disabled', 'disabled');
      oldpasswordtext.attr('disabled', 'disabled');
      $("#oldpassword").val(oldpasswordval);
      $("#newpassword").val(passwordval1);
      return true;
    });
  };

  webapp.accountCompanySettings = function() {};

  webapp.accountBilling = function() {};

}).call(this);
