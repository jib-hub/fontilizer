describe("Fontilizer()", function () {
    describe("get", function () {
        it("can get elements by id", function () {
            var el = document.getElementById('one');
            expect(Fontilizer().get("#one")[0]).toEqual(el);
        });
        it("can get elements by class", function () {
            expect(Fontilizer().get(".two").length).toEqual(3);
        });

        it("can get elements by tag name", function () {
            expect(Fontilizer().get("b").length).toEqual(4);
        })
        it("creates a Fontilizer() object from a single node", function () {
            var one = document.getElementById('one');
            expect(Fontilizer().get(one)[0]).toBe(one);
        });
        it("creates a Fontilizer() object from a NodeList", function () {
            var two = $(".two").get();
            expect(Fontilizer().get(two)[0]).toBe(two[0]);
        });
    });

    describe("utils", function () {
        it("can loop over each element", function () {
            var o =  {
                loop: function (el) { }
            };
            spyOn(o, 'loop');
            Fontilizer().get("b").forEach(o.loop);

            expect(o.loop).toHaveBeenCalled();
        });

        it("can map over each element", function () {
            var a = Fontilizer().get("b").map(function (el) {
                return el.className;
            });
            expect(a.join('')).toEqual('twotwotwo');
        });
    });
    describe("text", function () {
        beforeEach(function () {
            this.d = Fontilizer().get("#one");
        });
        it("can set the text of an element", function () {
            this.d.text("one");
            expect(this.d[0].innerText).toEqual("one");
        });
        it("can get the text of an element", function () {
            this.d.text("one");
            expect(this.d.text()).toEqual("one");
        });
        afterEach(function () {
            this.d.text("");
        });
    });
    describe("html", function () {
        beforeEach(function () {
            this.d = Fontilizer().get(".two");
        });
        afterEach(function () {
            this.d.html("");
        });
        it("can set the html content of an element", function () {
            this.d.html("<strong>Test!</strong>");
            expect(this.d[0].innerHTML.toLowerCase()).toEqual("<strong>test!</strong>");
        });
        it("can get the html content of an element", function () {
            this.d.html("<strong>Test!</strong>");
            expect(this.d.html()[0].toLowerCase()).toEqual("<strong>test!</strong>");
        });
    });
    describe("addClass", function () {
        beforeEach(function () {
            this.d = Fontilizer().get(".two");
        });
        afterEach(function () {
            this.d.forEach(function (el) {
                el.className = "two";
            });
        });
        it("can add a single class to elements", function () {
            this.d.addClass('single');
            expect(this.d[0].className.indexOf('single')).toBeGreaterThan(-1);
        });
        it("can add multiple classes (via array) to elements", function () {
            this.d.addClass(["multiple", "classes"]);
            var cn = this.d[0].className;
            expect(cn.indexOf("multiple")).toBeLessThan(cn.indexOf("classes"));
        });
    });
    describe("removeClass", function () {
        beforeEach(function () {
            this.d = Fontilizer().get(".two");
            this.d.addClass("classes");
        });
        afterEach(function () {
            this.d.forEach(function (el) {
                el.className = "two";
            });
        });
        it("can remove a class from elements", function () {
            this.d.removeClass("classes");
            expect(this.d[0].className.indexOf('classes')).toBe(-1);
        });
        it("removes all instances of that class from elements", function () {
            this.d.addClass("test classes");
            this.d.removeClass("classes");
            expect(this.d[0].className.indexOf('classes')).toBe(-1);
        });
    });
    describe("attr", function () {
        beforeEach(function () {
            this.d = Fontilizer().get(".two");
        });
        afterEach(function () {
            this.d.forEach(function (el) {
                el.removeAttribute('data-something');
            });
        });
        it("can set element attributes", function () {
            this.d.attr("data-something", "some-value");
            expect(this.d[0].getAttribute("data-something")).toEqual("some-value");
        });
        it("can get element attributes", function () {
            this.d.attr("data-something", "some-value");
            expect(this.d.attr("data-something")[0]).toEqual("some-value");
        });
    });

    describe("create", function () {
        it("can create elements", function () {
            expect(Fontilizer().create("p")[0].tagName).toEqual("P");
        });
        it("can create elements with attributes", function () {
            var d = Fontilizer().create("p", { id: "some-id", className: "some-class", text: "some-text", "data-attr": "some-data"});
            expect(d[0].id).toBe("some-id");
            expect(d[0].className.indexOf("some-class")).toBeGreaterThan(-1);
            expect(d.text()).toBe("some-text");
            expect(d.attr("data-attr")).toBe("some-data");
        });
    });
    describe("append", function () {
        beforeEach(function () {
            this.p = Fontilizer().create("p", { className: "one-child", text: "text" });
            this.q = Fontilizer().create("p", { className: "one-child", text: "text" });
        });
        afterEach(function () {
            Fontilizer().get(".one-child").forEach(function (el) {
                el.parentNode.removeChild(el);
            });
        });
        it("can append new elements to an existing element", function () {
            Fontilizer().get("#one").append(this.p);
            expect(Fontilizer().get(".one-child")[0].parentNode.id).toEqual("one");
        });
        it("can append new elements to multiple existing elements", function () {
            Fontilizer().get(".two").append(Fontilizer().create("p", { className: "one-child", text: "text" }));
            var d = Fontilizer().get(".one-child");
            expect(d[0].parentNode.className.indexOf("two")).toBeGreaterThan(-1);
            expect(d[1].parentNode.className.indexOf("two")).toBeGreaterThan(-1);
            expect(d[2].parentNode.className.indexOf("two")).toBeGreaterThan(-1);
        });
        it("can append elements already in the DOM to an existing element", function () {
            Fontilizer().get("#elements").append(Fontilizer().get("#one"));
            expect(Fontilizer().get("#one")[0].parentNode.id).toBe("elements");
        });
        it("can append elements already in the DOM to multiple existing elements", function () {
            Fontilizer().get("#elements").append(this.p).append(this.q); 
            
            var d1 = Fontilizer().get(".two"),
                d2 = Fontilizer().get(".one-child");
            d1.append(d2, true);
            Fontilizer().get(".two").forEach(function (el) {
                expect(el.childNodes.length).toBe(2);
            });
        });
    });
    describe("prepend", function () {
        beforeEach(function () {
            this.d = Fontilizer().get("#one");
            this.s = Fontilizer().create("span", { text: 1 });
            this.t = Fontilizer().create("span", { text: 2 });
        });
        afterEach(function () {
            Fontilizer().get("span").forEach(function (el) {
                el.parentNode.removeChild(el);
            });
        });
        it("can prepend elements to an existing element", function () {
            this.d.prepend(this.s);
            expect(this.d[0].firstChild.tagName).toBe(this.s[0].tagName);
        });
        it("can prepend new elements to multiple existing elements", function () {
            var d = Fontilizer().get(".two");
            d.prepend(this.s);
            expect(d[0].firstChild.tagName).toBe(this.s[0].tagName);
            expect(d[1].firstChild.tagName).toBe(this.s[0].tagName);
        });
        it("can prepend elements already in the Fontilizer() to existing elements", function () {
            var d = Fontilizer().get("#elements");
            d.prepend(this.d);
            expect(d[0].firstChild.tagName).toBe(this.d[0].tagName);
        });
        it("can prepend elements already in the DOM to multiple existing elements", function () {
            this.d.append(this.s).append(this.t);
            var two = Fontilizer().get(".two");
            two.prepend(Fontilizer().get("span"));

            two.forEach(function (el) {
                expect(el.childNodes.length).toBe(2); 
            });

        });
        
    });

    describe("remove", function () {
        it("removes an element from the DOM", function () {
            var o = Fontilizer().get("#one"),
                p = Fontilizer().create("p", {text: "p" });
            o.append(p);
            p.remove()
            expect(o[0].children.length).toBe(0);
        });
    });

    describe("events", function () {
        beforeEach(function () {
            this.d = Fontilizer().get("#one");
            o = this.o =  {
                f: function () { console.log("test"); }
            };
        });
        it("adds events to elements", function () {
            spyOn(this.o, 'f');
            this.d.on('click', this.o.f);
            $(this.d[0]).click();
            expect(this.o.f).toHaveBeenCalled();
        });
        it("gets the event object as the first parameter", function () {
            this.d.on('click', function (e) {
                expect(e).not.toBeUndefined();
            });
            $(this.d[0]).click();
        });
        it("removes events from elements", function () {
            spyOn(this.o, 'f');
            this.d.on('click', this.o.f);
            this.d.off('click', this.o.f);
            $(this.d[0]).click();
            expect(this.o.f).not.toHaveBeenCalled();
        });
    });
});
