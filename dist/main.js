(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
  var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var listeners = {};

  var on = function on(e) {
    var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (!cb) return;
    listeners[e] = listeners[e] || { queue: [] };
    listeners[e].queue.push(cb);
  };

  var emit = function emit(e) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var items = listeners[e] ? listeners[e].queue : false;
    items && items.forEach(function (i) {
      return i(data);
    });
  };

  return _extends({}, o, {
    emit: emit,
    on: on
  });
};

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var requestFrame = window.requestAnimationFrame;
var cancelFrame = window.cancelAnimationFrame;
var scrollChanged = void 0,
    y = void 0,
    prevY = -1,
    idle = true,
    queue = [],
    timeout = void 0,
    tickId = void 0,
    init = false;

if (!requestFrame) {
  ['ms', 'moz', 'webkit', 'o'].every(function (prefix) {
    requestFrame = window[prefix + 'RequestAnimationFrame'];
    cancelFrame = window[prefix + 'CancelAnimationFrame'] || window[prefix + 'CancelRequestAnimationFrame'];
    return !requestFrame;
  });
}

var isSupported = !!requestFrame;

var enable = function enable() {
  window.addEventListener('scroll', debounce);
  document.body.addEventListener('touchmove', debounce);
};

var disable = function disable() {
  window.removeEventListener('scroll', debounce);
  document.body.removeEventListener('touchmove', debounce);
};

var debounce = function debounce() {
  if (!tickId) {
    disable();
    tick();
  }
};

var tick = function tick() {
  tickId = requestFrame(handleScroll);
};

var handleScroll = function handleScroll() {
  y = window.pageYOffset;
  queue.forEach(function (fn) {
    return fn(y, prevY);
  });

  scrollChanged = false;
  if (prevY != y) {
    scrollChanged = true;
    prevY = y;
  }

  if (scrollChanged) {
    clearTimeout(timeout);
    timeout = null;
  } else if (!timeout) {
    timeout = setTimeout(detectIdle, 200);
  }

  tick();
};

var detectIdle = function detectIdle() {
  cancelFrame(tickId);
  tickId = null;
  enable();
};

exports.default = function (cb) {
  if (isSupported) {
    queue.push(cb);
    if (!init) {
      init = true;
      debounce();
      enable();
    }
  } else {
    console.warn('Request Animation Frame not supported');
  }
};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rafScroll = require('raf-scroll.js');

var _rafScroll2 = _interopRequireDefault(_rafScroll);

var _loop = require('loop.js');

var _loop2 = _interopRequireDefault(_loop);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var inViewport = function inViewport(el) {
  var rect = el.getBoundingClientRect();
  return rect.top < rect.height && rect.top + rect.height > 0;
};

var merge = function merge(defaults) {
  return function (overwrites) {
    Object.keys(overwrites).forEach(function (val) {
      defaults[val] = overwrites[val];
    });
    return defaults;
  };
};

var testState = function testState(el) {
  return el.readyState == 4;
};

var setSrc = function setSrc(el) {
  return el.setAttribute('src', el.getAttribute('data-src'));
};

var events = (0, _loop2.default)();

exports.default = function (el) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var settings = merge({
    readyClass: 'video-ready',
    parentEl: el.parentNode,
    autoload: true,
    fadeIn: function fadeIn(el) {
      el.parentNode.classList.add('is-ready');
    }
  })(opts);

  var revealed = false;
  var ready = false;
  var paused = true;

  var play = function play() {
    paused = false;
    el.play();
    events.emit('play', el);
  };

  var pause = function pause() {
    paused = true;
    el.pause();
    events.emit('pause', el);
  };

  var setReady = function setReady(value) {
    if (!value) return;
    ready = value;

    if (inViewport(el)) play(el);
    if (!revealed) {
      revealed = true;
      events.emit('ready', el);
      settings.fadeIn(el);
    }
  };

  //Add src immediately
  if (settings.autoload) setSrc(el);

  (0, _rafScroll2.default)(function (y, prevY) {
    if (inViewport(el)) {
      if (!el.getAttribute('src')) {
        setSrc(el);
      }
      if (paused) play(el);
    } else {
      if (!paused) pause(el);
    }
  });

  el.addEventListener('canplaythrough', function () {
    setReady(testState(el));
  });

  setReady(testState(el));

  return {
    on: events.on,
    play: play,
    pause: pause,
    getReady: function getReady() {
      return ready;
    }
  };
};

},{"loop.js":1,"raf-scroll.js":2}]},{},[3]);
