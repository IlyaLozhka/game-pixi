import * as createjs from '@createjs/tweenjs'
import { Texture } from 'pixi.js';
class Deferred {
  constructor() {
    this.resolve = null;
    this.reject = null;

    this.promise = new Promise((...args) => [this.resolve, this.reject] = args);
  }
}

let utils = {
  random(...args) {
    let randomValue = Math.random();

    if (args.length === 1 && Array.isArray(args[0])) {
      return args[0][Math.floor(args[0].length * randomValue)];
    }

    if (args.length === 2) {
      let [offset, n] = args;
      return Math.floor(randomValue * n + offset);
    }

    return randomValue;
  },

  range(offset, n, step) {
    step = step || 1;
    let arr = [];
    for (let i = offset; i < n; i += step) {
      arr.push(i);
    }
    return arr;
  },

  objectDeepEach(func, data, head = '') {
    if (typeof data === 'object' && !(data instanceof Array) && data !== null) {
      for (let key of Object.keys(data)) {
        let name = head.length > 0 ? `${head}.${key}` : key;
        this.objectDeepEach(func, data[key], name);
      }
    } else {
      func(head, data);
    }
  },

  trycatch(fn, handle) {
    try {
      return fn();
    } catch (err) {
      return handle(err);
    }
  },

  try(fn) {
    return utils.trycatch(fn, () => {
    });
  },

  addStyle(css) {
    css = css.split('\n').map(i => i.trim(i)).filter(i => i.length).join(' ');
    let style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.getElementsByTagName('head')[0].appendChild(style);
  },

  wait(time) {
    return new Promise(res => createjs.Tween.get({}).wait(time).call(res).advance(0));
  },

  /**
   * creates an object that changes arr's objects properties
   * @param arr   array of objects whose properties will be changed
   * @param props properties that you need to change
   * @returns {{}}
   */
  aggregate(arr, props) {
    let obj = {};
    obj.addProp = function(propName) {
      obj[`_${propName}`] = 0;
      Object.defineProperty(obj, propName, {
        set(value) {
          const oldValue = this[`_${propName}`];
          this[`_${propName}`] = value;
          arr.forEach(function(item) {
            item[propName] += value - oldValue;
          });
        },
        get() {
          return this[`_${propName}`];
        }
      });
    };
    (props || []).forEach(obj.addProp);
    return obj;
  },

  labelScale(label, maxWidth = null, maxHeight = null) {
    label.scaleX = label.scaleY = 1;
    label.scaleX = label.scaleY = Math.min(1, maxWidth === null ? 1 : maxWidth / label.width, maxHeight === null ? 1 : maxHeight / label.height);
  },

  deferred() {
    return new Deferred();
  },

  html2element(html) {
    let root = document.createElement('div');
    root.innerHTML = html.trim();
    return root.firstElementChild;
  },

  replaceSpriteTexture(targetSprite, spriteName) {
    targetSprite.texture = Texture.from(spriteName);
  },

  clone(target, values = null) {
    return Object.assign({}, target, values || {});
  },

  Q(arr) {
    let promise = Promise.resolve();
    let cancelled = false;
    let cancelPromise;
    let onCancel;
    let currentPromise = null;
    let done = false;

    // needed to ignore hang promises
    let defer = utils.deferred();
    arr.forEach(fn => promise = promise.then(() => !cancelled && (currentPromise = fn())));
    promise = Promise.race([defer.promise, promise])
      .then(x => {
        if (cancelled) {
          return cancelPromise;
        } else {
          done = true;
          return x;
        }
      });
    promise.cancel = function() {
      if (cancelled || done) return;
      defer.resolve();
      cancelled = true;

      if (currentPromise && typeof currentPromise.cancel === 'function')
        currentPromise.cancel();

      return cancelPromise = new Promise(function(res, rej) {
        let ret = onCancel && onCancel();
        if (ret && ret.then) {
          ret.then(res, rej);
        } else {
          res(ret);
        }
      });
    };
    promise.onCancel = function(fn) {
      onCancel = fn;
      return promise;
    };
    return promise;
  },

  /**
   * Get promise.
   * @param {Object} obj
   * @returns {Promise} Promise object.
   */
  getPromise(obj) {
    if (obj && typeof obj.then === 'function') return obj;
    return Promise.resolve(obj);
  },

  /**
   * Get two dimensional matrix.
   * @param {Number} cols
   * @param {Number} rows
   * @returns {Array}
   */
  getTwoDimensionalMatrix(cols, rows) {
    const matrix = [];

    for (let i = 0; i < cols; i++) {
      const array = [];
      for (let j = 0; j < rows; j++) {
        array.push(null);
      }
      matrix.push(array);
    }

    return matrix;
  },

  ticker() {
    function IntervalTicker() {
      let listeners = [];
      let interval = null;

      function tick() {
        listeners.slice(0).forEach(fn => fn());
      }

      this.start = function() {
        interval = interval || setInterval(tick, 1000 / 6);
      };
      this.stop = function() {
        clearInterval(interval);
        interval = null;
      };
      this.add = function(fn) {
        listeners.push(fn);
      };
      this.remove = function(fn) {
        const idx = listeners.indexOf(fn);
        if (idx === -1) return;
        listeners.splice(idx, 1);
      };
    }

    let ticker;

    try {
      // try to create webworker with IntervalTicker
      const workerCode = () => {
        let ticker = new IntervalTicker();
        ticker.add(function tick() {
          // noinspection JSUnresolvedFunction
          self.postMessage('tick');
        });

        self.onmessage = ({data}) => {
          if (data === 'start') {
            ticker.start();
          } else if (data === 'stop') {
            ticker.stop();
          }
        };
      };

      const blob = new Blob(
        [`${IntervalTicker.toString()}`, '\n', `(${workerCode.toString()})()`],
        {type: 'application/javascript'}
      );
      const url = URL.createObjectURL(blob);
      const worker = new Worker(url);

      ticker = {
        start() {
          worker.postMessage('start');
        },

        stop() {
          worker.postMessage('stop');
        },

        add(fn) {
          worker.addEventListener('message', fn);
        },

        remove(fn) {
          worker.removeListener('message', fn);
        }
      };
    } catch (e) {
      // simple setInterval fallback
      ticker = new IntervalTicker();
    }

    return ticker;
  }
};

export default utils;
export {utils};
