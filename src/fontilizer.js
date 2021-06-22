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
  function Fontilizer(elements) {
    for (var i = 0; i < elements.length; i++) {
      this[i] = elements[i];
    }
    this.length = elements.length;
  }

  // ========= Fontilizer Methods =========
  Fontilizer.prototype = {
    splitIntoSpans: function () {
      let elements = [];
      this.forEach(function (element, i) {
        let spans = [];
        this.splitByBr(this.getTrimmedText(element)).forEach(function (line, i) {
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
    lessFontTypesThanChars: function (elements, fontTypes) {
      return (
        elements.replace("<br/>", "").replace("<br>", "").replace(" ", "")
          .length > fontTypes.length
      );
    },
    randomCase: function (options = {}) {
      return this.forEach(function (element, i) {
        let lines = [];
        this.splitByBr(this.getTrimmedText(element)).forEach(function (
          line,
          i
        ) {
          let randomCaseString = "";
          if (options.all) {
            var randomNumber = Math.floor(Math.random() * 2);
            var randomCase = function (char) {
              return randomNumber === 1
                ? char.toUpperCase()
                : char.toLowerCase();
            };
          }
          for (var i = 0; i < line.length; i++) {
            if (options.all) {
              randomCaseString += randomCase(line.charAt(i));
              continue;
            }
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
    repeatRandomCase: function (options = { delay: 1000 }) {
      let that = this;
      if (!that.intervals) that.intervals = [];
      return this.forEach(function (element, i) {
        const interval = setInterval(function () {
          let lines = [];
          that
            .splitByBr(that.getTrimmedText(element))
            .forEach(function (line, i) {
              let randomCaseString = "";
              if (options.all) {
                var randomNumber = Math.floor(Math.random() * 2);
                var randomCase = function (char) {
                  return randomNumber === 1
                    ? char.toUpperCase()
                    : char.toLowerCase();
                };
              }
              for (var i = 0; i < line.length; i++) {
                if (options.all) {
                  randomCaseString += randomCase(line.charAt(i));
                  continue;
                }
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
    repeatRandomFontType: function (fontTypes, options = { delay: 1000 }) {
      let that = this;
      if (!that.intervals) that.intervals = [];
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

  // ========= UTILS =========
  Fontilizer.prototype.get = function (selector) {
    var elements;
    if (typeof selector === "string") {
      elements = document.querySelectorAll(selector);
    } else if (selector.length) {
      elements = selector;
    } else {
      elements = [selector];
    }
    return new Fontilizer(elements);
  };
  Fontilizer.prototype.create = function (tagName, attrs) {
    var element = new Fontilizer([document.createElement(tagName)]);
    if (attrs) {
      if (attrs.className) {
        element.addClass(attrs.className);
        delete attrs.className;
      }
      if (attrs.text) {
        element.text(attrs.text);
        delete attrs.text;
      }
      for (var key in attrs) {
        if (attrs.hasOwnProperty(key)) {
          element.attr(key, attrs[key]);
        }
      }
    }
    return element;
  };
  Fontilizer.prototype.getTrimmedText = function (node) {
    return node.innerHTML.trim();
  };
  Fontilizer.prototype.splitByBr = function (string) {
    const separator = string.indexOf("<br/>") === -1 ? "<br>" : "<br/>";
    return string.split(separator);
  };
  Fontilizer.prototype.forEach = function (callback) {
    this.map(callback);
    return this;
  };
  Fontilizer.prototype.map = function (callback) {
    var results = [];
    for (var i = 0; i < this.length; i++) {
      results.push(callback.call(this, this[i], i));
    }
    return results.length > 1 ? results : results[0];
  };

  // ========== DOM MANIPULATION ==========
  Fontilizer.prototype.text = function (text) {
    if (typeof text !== "undefined") {
      return this.forEach(function (element) {
        element.innerText = text;
      });
    } else {
      return this.map(function (element) {
        return element.innerText;
      });
    }
  };

  Fontilizer.prototype.html = function (html) {
    if (typeof html !== "undefined") {
      return this.forEach(function (element) {
        element.innerHTML = html;
      });
    } else {
      return this.map(function (element) {
        return element.innerHTML;
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
    return this.forEach(function (element) {
      element.className += className;
    });
  };

  Fontilizer.prototype.removeClass = function (clazz) {
    return this.forEach(function (element) {
      var cs = element.className.split(" "),
        i;

      while ((i = cs.indexOf(clazz)) > -1) {
        cs = cs.slice(0, i).concat(cs.slice(++i));
      }
      element.className = cs.join(" ");
    });
  };

  Fontilizer.prototype.attr = function (attr, val) {
    if (typeof val !== "undefined") {
      return this.forEach(function (element) {
        element.setAttribute(attr, val);
      });
    } else {
      return this.map(function (element) {
        return element.getAttribute(attr);
      });
    }
  };

  Fontilizer.prototype.append = function (elements) {
    return this.forEach(function (parEl, i) {
      elements.forEach(function (childEl) {
        parEl.appendChild(i > 0 ? childEl.cloneNode(true) : childEl);
      });
    });
  };

  Fontilizer.prototype.prepend = function (elements) {
    return this.forEach(function (parEl, i) {
      for (var j = elements.length - 1; j > -1; j--) {
        parEl.insertBefore(
          i > 0 ? elements[j].cloneNode(true) : elements[j],
          parEl.firstChild
        );
      }
    });
  };

  Fontilizer.prototype.remove = function () {
    return this.forEach(function (element) {
      return element.parentNode.removeChild(element);
    });
  };

  Fontilizer.prototype.on = (function () {
    if (document.addEventListener) {
      return function (event, fn) {
        return this.forEach(function (element) {
          element.addEventListener(event, fn, false);
        });
      };
    } else if (document.attachEvent) {
      return function (event, fn) {
        return this.forEach(function (element) {
          element.attachEvent("on" + event, fn);
        });
      };
    } else {
      return function (event, fn) {
        return this.forEach(function (element) {
          element["on" + event] = fn;
        });
      };
    }
  })();

  Fontilizer.prototype.off = (function () {
    if (document.removeEventListener) {
      return function (event, fn) {
        return this.forEach(function (element) {
          element.removeEventListener(event, fn, false);
        });
      };
    } else if (document.detachEvent) {
      return function (event, fn) {
        return this.forEach(function (element) {
          element.detachEvent("on" + event, fn);
        });
      };
    } else {
      return function (event, fn) {
        return this.forEach(function (element) {
          element["on" + event] = null;
        });
      };
    }
  })();

  var fontilizer = function (selector = window) {
    var elements;
    if (typeof selector === "string") {
      elements = document.querySelectorAll(selector);
    } else if (selector.length) {
      elements = selector;
    } else {
      elements = [selector];
    }
    return new Fontilizer(elements);
  };

  return fontilizer;
})();
