(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * Knot.js 1.1.1 - A browser-based event emitter, for tying things together.
 * Copyright (c) 2016 Michael Cavalea - https://github.com/callmecavs/knot.js
 * License: MIT
 */
!function(n,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):n.Knot=e()}(this,function(){"use strict";var n={};n["extends"]=Object.assign||function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n};var e=function(){function e(n,e){return f[n]=f[n]||[],f[n].push(e),this}function t(n,t){return t._once=!0,e(n,t),this}function r(n){var e=arguments.length<=1||void 0===arguments[1]?!1:arguments[1];return e?f[n].splice(f[n].indexOf(e),1):delete f[n],this}function o(n){for(var e=this,t=arguments.length,o=Array(t>1?t-1:0),i=1;t>i;i++)o[i-1]=arguments[i];var u=f[n]&&f[n].slice();return u&&u.forEach(function(t){t._once&&r(n,t),t.apply(e,o)}),this}var i=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],f={};return n["extends"]({},i,{on:e,once:t,off:r,emit:o})};return e});
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

var _knot = require('knot.js');

var _knot2 = _interopRequireDefault(_knot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var addClass = function addClass(cssClass, el) {
  return el.classList.add(cssClass);
};

var fadeIn = function fadeIn(el) {
  //let innerEl = document.querySelector('.js-hero-inner')
  //Velocity(el.parentNode, "fadeIn", {duration:2000, delay:500})
  //Velocity(innerEl, "transition.slideUpIn", {duration: 1500})
};

exports.default = function (el) {
  var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var settings = merge({
    readyClass: 'video-ready',
    parentEl: el.parentNode,
    autoload: true,
    fadeIn: fadeIn
  })(opts);

  var revealed = false;
  var ready = false;
  var paused = true;

  var play = function play() {
    if (ready && paused) {
      paused = false;
      el.play();
    }
  };

  var pause = function pause() {
    if (!paused) {
      paused = true;
      el.pause();
    }
  };

  var setReady = function setReady(value) {
    if (!value) return;
    if (inViewport(el)) play(el);
    if (!revealed) {
      revealed = true;
      settings.fadeIn(el);
    }
    ready = value;
  };

  //Add src immediately
  if (settings.autoload) setSrc(el);

  (0, _rafScroll2.default)(function (y, prevY) {
    if (inViewport(el)) {
      if (!el.getAttribute('src')) {
        setSrc(el);
      }
      play(el);
    } else {
      pause(el);
    }
  });['canplaythrough', 'canplay'].forEach(function (event) {
    el.addEventListener(event, function () {
      setReady(testState(el));
    });
  });

  setReady(testState(el));
};

},{"knot.js":1,"raf-scroll.js":2}]},{},[3]);
