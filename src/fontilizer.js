if (typeof Array.prototype.indexOf !== "function") {
  Array.prototype.indexOf = function (item) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] === item) {
        return i;
      }
    }
    return -1;
  };
}

window.Fontilizer = window.F$ = (function () {
  function Fontilizer(els) {
    for (var i = 0; i < els.length; i++) {
      this[i] = els[i];
    }
    this.length = els.length;
  }
  Fontilizer.prototype = {
    getTrimmedText: function (node) {
      return node.innerHTML.trim();
    },
    splitByBr: function (string) {
      const separator = string.indexOf("<br/>") === -1 ? "<br>" : "<br/>";
      return string.split(separator);
    },
    splitIntoSpans: function () {
      let elements = [];
      this.forEach(function (element, i) {
        let spans = [];
        this.splitByBr(element.innerHTML).forEach(function (line, i) {
          let html = "";
          line.split("").forEach(function (char, i) {
            html +=
              `<span class="fontilizer-splitted-span">` + char + "</span>";
          });
          spans.push(html);
        });
        element.innerHTML = spans.join("<br/>");
        elements =
          elements.length === 0
            ? Array.prototype.slice.call(
                element.querySelectorAll(".fontilizer-splitted-span")
              )
            : elements.concat(
                Array.prototype.slice.call(
                  element.querySelectorAll(".fontilizer-splitted-span")
                )
              );
      });
      return new Fontilizer(elements);
    },
    lessFontsThanChars: function (text, fontTypes) {
      if (typeof text === "number")
        return text > fontTypes.length ? true : false;
      const cleanText = text
        .replace("<br/>", "")
        .replace("<br>", "")
        .replace(" ", "");
      return cleanText.length > fontTypes.length ? true : false;
    },
    lessFontTypesThanChars: function (elements, fontTypes) {},
    randomCase: function () {
      return this.forEach(function (element, i) {
        let lines = [];
        this.splitByBr(this.getTrimmedText(element)).forEach(function (
          line,
          i
        ) {
          let randomCaseString = "";
          for (var i = 0; i < line.length; i++) {
            randomCaseString +=
              Math.floor(Math.random() * 2) === 1
                ? line.charAt(i).toUpperCase()
                : line.charAt(i).toLowerCase();
          }
          lines.push(randomCaseString);
        });
        element.innerHTML = lines.join("<br/>");
      });
    },
    repeatRandomCase: function (options) {
      let that = this;
      if(!that.intervals) that.intervals = [];
      return this.forEach(function (element, i) {
        const interval = setInterval(function () {
          let lines = [];
          that.splitByBr(that.getTrimmedText(element)).forEach(function (
            line,
            i
          ) {
            let randomCaseString = "";
            for (var i = 0; i < line.length; i++) {
              randomCaseString +=
                Math.floor(Math.random() * 2) === 1
                  ? line.charAt(i).toUpperCase()
                  : line.charAt(i).toLowerCase();
            }
            lines.push(randomCaseString);
          });
          element.innerHTML = lines.join("<br/>");
        }, options.delay);
        that.intervals.push(interval);
      });
    },
    randomFontType: function (fontTypes) {
      return this.forEach(function (element, i) {
        const randomNum = Math.floor(Math.random() * fontTypes.length);
        element.style.fontFamily = fontTypes[randomNum];
      });
    },
    repeatRandomFontType: function (fontTypes, options) {
      let that = this;
      if(!that.intervals) that.intervals = [];
      return this.forEach(function (element, i) {
        const interval = setInterval(function () {
          const randomNum = Math.floor(Math.random() * fontTypes.length);
          element.style.fontFamily = fontTypes[randomNum];
        }, options.delay);
        that.intervals.push(interval);
      });
    },
    clearAllIntervals: function () {
      this.intervals.forEach(function (element, i) {
        clearInterval(element);
      });
      delete this.intervals;
      return this;
    },
  };
  // ========= Main =========
  Fontilizer.prototype.get = function (selector) {
    var els;
    if (typeof selector === "string") {
      els = document.querySelectorAll(selector);
    } else if (selector.length) {
      els = selector;
    } else {
      els = [selector];
    }
    return new Fontilizer(els);
  };
  Fontilizer.prototype.create = function (tagName, attrs) {
    var el = new Fontilizer([document.createElement(tagName)]);
    if (attrs) {
      if (attrs.className) {
        el.addClass(attrs.className);
        delete attrs.className;
      }
      if (attrs.text) {
        el.text(attrs.text);
        delete attrs.text;
      }
      for (var key in attrs) {
        if (attrs.hasOwnProperty(key)) {
          el.attr(key, attrs[key]);
        }
      }
    }
    return el;
  };
  // ========= UTILS =========
  Fontilizer.prototype.forEach = function (callback) {
    this.map(callback);
    return this;
  };
  Fontilizer.prototype.map = function (callback) {
    var results = [];
    for (var i = 0; i < this.length; i++) {
      results.push(callback.call(this, this[i], i));
    }
    return results; //.length > 1 ? results : results[0];
  };
  Fontilizer.prototype.mapOne = function (callback) {
    var m = this.map(callback);
    return m.length > 1 ? m : m[0];
  };

  // ========== DOM MANIPULATION ==========
  Fontilizer.prototype.text = function (text) {
    if (typeof text !== "undefined") {
      return this.forEach(function (el) {
        el.innerText = text;
      });
    } else {
      return this.mapOne(function (el) {
        return el.innerText;
      });
    }
  };

  Fontilizer.prototype.html = function (html) {
    if (typeof html !== "undefined") {
      return this.forEach(function (el) {
        el.innerHTML = html;
      });
    } else {
      return this.mapOne(function (el) {
        return el.innerHTML;
      });
    }
  };

  Fontilizer.prototype.addClass = function (classes) {
    var className = "";
    if (typeof classes !== "string") {
      for (var i = 0; i < classes.length; i++) {
        className += " " + classes[i];
      }
    } else {
      className = " " + classes;
    }
    return this.forEach(function (el) {
      el.className += className;
    });
  };

  Fontilizer.prototype.removeClass = function (clazz) {
    return this.forEach(function (el) {
      var cs = el.className.split(" "),
        i;

      while ((i = cs.indexOf(clazz)) > -1) {
        cs = cs.slice(0, i).concat(cs.slice(++i));
      }
      el.className = cs.join(" ");
    });
  };

  Fontilizer.prototype.attr = function (attr, val) {
    if (typeof val !== "undefined") {
      return this.forEach(function (el) {
        el.setAttribute(attr, val);
      });
    } else {
      return this.mapOne(function (el) {
        return el.getAttribute(attr);
      });
    }
  };

  Fontilizer.prototype.append = function (els) {
    return this.forEach(function (parEl, i) {
      els.forEach(function (childEl) {
        parEl.appendChild(i > 0 ? childEl.cloneNode(true) : childEl);
      });
    });
  };

  Fontilizer.prototype.prepend = function (els) {
    return this.forEach(function (parEl, i) {
      for (var j = els.length - 1; j > -1; j--) {
        parEl.insertBefore(
          i > 0 ? els[j].cloneNode(true) : els[j],
          parEl.firstChild
        );
      }
    });
  };

  Fontilizer.prototype.remove = function () {
    return this.forEach(function (el) {
      return el.parentNode.removeChild(el);
    });
  };

  Fontilizer.prototype.on = (function () {
    if (document.addEventListener) {
      return function (evt, fn) {
        return this.forEach(function (el) {
          el.addEventListener(evt, fn, false);
        });
      };
    } else if (document.attachEvent) {
      return function (evt, fn) {
        return this.forEach(function (el) {
          el.attachEvent("on" + evt, fn);
        });
      };
    } else {
      return function (evt, fn) {
        return this.forEach(function (el) {
          el["on" + evt] = fn;
        });
      };
    }
  })();

  Fontilizer.prototype.off = (function () {
    if (document.removeEventListener) {
      return function (evt, fn) {
        return this.forEach(function (el) {
          el.removeEventListener(evt, fn, false);
        });
      };
    } else if (document.detachEvent) {
      return function (evt, fn) {
        return this.forEach(function (el) {
          el.detachEvent("on" + evt, fn);
        });
      };
    } else {
      return function (evt, fn) {
        return this.forEach(function (el) {
          el["on" + evt] = null;
        });
      };
    }
  })();

  var fontilizer = function (selector = window) {
    var els;
    if (typeof selector === "string") {
      els = document.querySelectorAll(selector);
    } else if (selector.length) {
      els = selector;
    } else {
      els = [selector];
    }
    return new Fontilizer(els);
  };

  return fontilizer;
})();
