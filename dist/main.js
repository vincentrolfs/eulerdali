(function () {
    var defines = {};
    var entry = [null];
    function define(name, dependencies, factory) {
        defines[name] = { dependencies: dependencies, factory: factory };
        entry[0] = name;
    }
    define("require", ["exports"], function (exports) {
        Object.defineProperty(exports, "__cjsModule", { value: true });
        Object.defineProperty(exports, "default", { value: function (name) { return resolve(name); } });
    });
    define("common/constants", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.RANDOMIZER_MAX_DEPTH = exports.RANDOMIZER_MIN_DEPTH = exports.DEBOUNCE_TIMEOUT = exports.EXAMPLES_ID = exports.CANVAS_ID = void 0;
        exports.CANVAS_ID = "canvas";
        exports.EXAMPLES_ID = "examples";
        exports.DEBOUNCE_TIMEOUT = 300;
        exports.RANDOMIZER_MIN_DEPTH = 1;
        exports.RANDOMIZER_MAX_DEPTH = 6;
    });
    define("Canvas", ["require", "exports", "common/constants"], function (require, exports, constants_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Canvas = void 0;
        var Canvas = /** @class */ (function () {
            function Canvas() {
                this.element = document.getElementById(constants_1.CANVAS_ID);
                this.element.width = document.body.clientWidth;
                this.element.height = document.body.clientHeight;
                this.ctx = this.element.getContext("2d");
                this.ctx.fillRect(0, 0, this.element.width, this.element.height);
            }
            Object.defineProperty(Canvas.prototype, "width", {
                get: function () {
                    return this.element.width;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Canvas.prototype, "height", {
                get: function () {
                    return this.element.height;
                },
                enumerable: false,
                configurable: true
            });
            Canvas.prototype.setPixel = function (x, y, color) {
                if (!this.pendingImageData) {
                    throw new Error("No job has been started.");
                }
                var redIndex = y * (this.element.width * 4) + x * 4;
                var greenIndex = redIndex + 1;
                var blueIndex = redIndex + 2;
                var alphaIndex = redIndex + 3;
                var red = color[0], green = color[1], blue = color[2];
                this.pendingImageData.data[redIndex] = red;
                this.pendingImageData.data[greenIndex] = green;
                this.pendingImageData.data[blueIndex] = blue;
                this.pendingImageData.data[alphaIndex] = 255;
            };
            Canvas.prototype.startJob = function () {
                this.pendingImageData = this.ctx.getImageData(0, 0, this.element.width, this.element.height);
            };
            Canvas.prototype.abortJob = function () {
                if (!this.pendingImageData) {
                    throw new Error("abortJob called, but no job has been started.");
                }
                this.pendingImageData = undefined;
            };
            Canvas.prototype.endJob = function () {
                if (!this.pendingImageData) {
                    throw new Error("endJob called, but no job has been started.");
                }
                this.ctx.putImageData(this.pendingImageData, 0, 0);
                this.pendingImageData = undefined;
            };
            return Canvas;
        }());
        exports.Canvas = Canvas;
    });
    define("common/utilities", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.PaintInputNames = void 0;
        exports.PaintInputNames = ["red", "green", "blue", "zoom"];
        var __ensure_subtype = function (x) { return x; };
    });
    define("Painter", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Painter = void 0;
        var Painter = /** @class */ (function () {
            function Painter(canvas) {
                this.canvas = canvas;
            }
            Painter.prototype.paint = function (paintInputs) {
                var _a = this.canvas, width = _a.width, height = _a.height;
                this.canvas.startJob();
                try {
                    this.paintAllBlocks(width, height, paintInputs);
                }
                catch (e) {
                    console.log(e);
                    this.canvas.abortJob();
                }
                this.canvas.endJob();
            };
            Painter.prototype.paintAllBlocks = function (width, height, paintInputs) {
                for (var x = 0; x < width; x++) {
                    for (var y = 0; y < height; y++) {
                        this.paintBlock(x, y, paintInputs);
                    }
                }
            };
            Painter.prototype.paintBlock = function (x, y, paintInputs) {
                var color = this.computeColor(x, y, paintInputs);
                this.canvas.setPixel(x, y, color);
            };
            Painter.prototype.computeColor = function (xAbsolute, yAbsolute, paintInputs) {
                var _a = this.computeRelativeCoordinates(xAbsolute, yAbsolute, paintInputs.zoom), x = _a[0], y = _a[1];
                var red = Painter.computeColorComponent(x, y, paintInputs.red);
                var green = Painter.computeColorComponent(x, y, paintInputs.green);
                var blue = Painter.computeColorComponent(x, y, paintInputs.blue);
                return [red, green, blue];
            };
            Painter.prototype.computeRelativeCoordinates = function (xAbsolute, yAbsolute, zoom) {
                var scale = zoom() * Math.min(this.canvas.width, this.canvas.height);
                return [
                    (2 * xAbsolute - this.canvas.width) / scale,
                    (2 * yAbsolute - this.canvas.height) / scale,
                ];
            };
            Painter.computeColorComponent = function (x, y, func) {
                return Painter.capNumber(255 * Math.abs(Painter.getFuncResult(x, y, func)));
            };
            Painter.getFuncResult = function (x, y, func) {
                return func(x, y) || 0;
            };
            Painter.capNumber = function (num) {
                return Math.max(0, Math.min(255, Math.round(num || 0)));
            };
            return Painter;
        }());
        exports.Painter = Painter;
    });
    define("Parser", ["require", "exports", "common/utilities", "common/constants"], function (require, exports, utilities_1, constants_2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Parser = void 0;
        var INPUT_ID_RED = "#input-red";
        var INPUT_ID_GREEN = "#input-green";
        var INPUT_ID_BLUE = "#input-blue";
        var INPUT_ID_ZOOM = "#input-zoom";
        var Parser = /** @class */ (function () {
            function Parser(painter) {
                this.painter = painter;
                this.inputs = {
                    red: document.querySelector(INPUT_ID_RED),
                    green: document.querySelector(INPUT_ID_GREEN),
                    blue: document.querySelector(INPUT_ID_BLUE),
                    zoom: document.querySelector(INPUT_ID_ZOOM),
                };
                Parser.registerGlobalMath();
            }
            Parser.registerGlobalMath = function () {
                for (var _i = 0, _a = Object.getOwnPropertyNames(Math); _i < _a.length; _i++) {
                    var key = _a[_i];
                    if (Math.hasOwnProperty(key) && !window.hasOwnProperty(key)) {
                        // @ts-ignore
                        window[key] = Math[key];
                    }
                }
            };
            Parser.buildColorFunc = function (funcDescription) {
                return new Function("x", "y", "return " + funcDescription + ";");
            };
            Parser.buildZoomFunc = function (funcDescription) {
                return new Function("return " + funcDescription + ";");
            };
            Parser.prototype.overwrite = function (values) {
                for (var _i = 0, PaintInputNames_1 = utilities_1.PaintInputNames; _i < PaintInputNames_1.length; _i++) {
                    var key = PaintInputNames_1[_i];
                    this.inputs[key].value = values[key];
                }
                this.paint();
            };
            Parser.prototype.activate = function () {
                this.setEventListeners();
            };
            Parser.prototype.setEventListeners = function () {
                var _this = this;
                Object.values(this.inputs).forEach(function (el) {
                    return el.addEventListener("input", function (event) {
                        return _this.onInputChange(event.currentTarget);
                    });
                });
            };
            Parser.prototype.onInputChange = function (el) {
                var _this = this;
                if (this.inputTimeout !== undefined) {
                    clearTimeout(this.inputTimeout);
                }
                this.inputTimeout = setTimeout(function () {
                    if (!el || !el.id || !el.value) {
                        return;
                    }
                    _this.paint();
                }, constants_2.DEBOUNCE_TIMEOUT);
            };
            Parser.prototype.paint = function () {
                var paintInputs;
                try {
                    paintInputs = this.buildPaintInputs();
                }
                catch (e) {
                    console.error(e);
                }
                if (paintInputs) {
                    this.painter.paint(paintInputs);
                }
            };
            Parser.prototype.buildPaintInputs = function () {
                return {
                    red: Parser.buildColorFunc(this.inputs.red.value),
                    green: Parser.buildColorFunc(this.inputs.green.value),
                    blue: Parser.buildColorFunc(this.inputs.blue.value),
                    zoom: Parser.buildZoomFunc(this.inputs.zoom.value),
                };
            };
            return Parser;
        }());
        exports.Parser = Parser;
    });
    define("toolbar/examples", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.examples = exports.initialExample = void 0;
        exports.initialExample = 0;
        exports.examples = [
            {
                name: "Eulerdali logo",
                red: "(x-1) % y",
                green: "x % y",
                blue: "(x+1) % y",
                zoom: "1/2",
            },
            {
                name: "Waterfunk",
                red: "1/(sin(x**2 + y**2) + 2*cos(x*y))",
                green: "1/(sin(x**2 + (y+PI)**2) - 3*cos(x*y))",
                blue: "1/(sin(x**2 + (y-PI)**2) - 1*cos(x*y))",
                zoom: "1/6",
            },
            {
                name: "Ancient runes",
                red: "sin(1 / log(cos(x) + 1 / tan(y)))",
                green: "cos(1 / log(tan(x) + 1 / sin(y)))",
                blue: "tan(1 / log(sin(x) + 1 / cos(y)))",
                zoom: "1/4",
            },
            {
                name: "Soft strokes",
                red: "x",
                green: "y",
                blue: "x+y",
                zoom: "1",
            },
            {
                name: "Spiral",
                red: "(r = sqrt(x**2 + y**2)) && (r*cos(r) - x)**2 + (r*sin(r) - y)**2",
                green: "(r = sqrt(x**2 + y**2)) && (r*cos(2*r) - x)**2 + (r*sin(2*r) - y)**2",
                blue: "(r = sqrt(x**2 + y**2)) && (r*cos(4*r) - x)**2 + (r*sin(4*r) - y)**2",
                zoom: "1/7",
            },
            {
                name: "Strange waves",
                red: "(x*y % 2)/2",
                green: "(x*y % 3)/3",
                blue: "(x*y % 5)/5",
                zoom: "1/7",
            },
            {
                name: "Lightning logo",
                red: "1/(y+x**3)",
                green: "1/(1+x**2)",
                blue: "1/(1+x**2)",
                zoom: "1/6",
            },
            {
                name: "Old math",
                red: "sin(sqrt(abs(x+y)))",
                green: "sin(x/y)",
                blue: "sin(pow(abs(y), abs(x)) + pow(abs(x), abs(y)))",
                zoom: "1/10",
            },
            {
                name: "Superposition",
                red: "1.7/(x**2 + y**2)",
                green: ".25/(x*y - (x**2)*y + x**3 - y)",
                blue: "1/(1.5*(y**2)*x - 1.5*x**2)",
                zoom: "1/6",
            },
            {
                name: "Red mountains",
                red: "(y - cosh(x)) % 1",
                green: "y/6",
                blue: "y/6",
                zoom: "1/3",
            },
            {
                name: "Futuristic",
                red: "0.01/(((x-8)*y % 2)/2)",
                green: "0.01/(((x-8)*y % 3)/3)",
                blue: "0.01/(((x-8)*y % 3)/3)",
                zoom: "1/5",
            },
            {
                name: "Pancake waves",
                red: "log(cos(y)-x/y)*4",
                green: "log(cos(y)-x/y)**4",
                blue: "2/sqrt(abs(2*y))",
                zoom: "1/20",
            },
            {
                name: "Stagefright",
                red: "log(cos(x)*cos(y)+1)",
                green: "log(cos(x)*cos(y)+1)**2",
                blue: "log(cos(x)*cos(y)+1)**3",
                zoom: "1/9",
            },
        ];
    });
    define("toolbar/Randomizer", ["require", "exports", "common/constants"], function (require, exports, constants_3) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Randomizer = void 0;
        var NULLARY_OPERATIONS = [
            function () { return "x"; },
            function () { return "y"; },
            function (n) { return n.toString(); },
        ];
        var UNARY_OPERATIONS = [
            function (s) { return s; },
            function (s) { return "exp(" + s + ")"; },
            function (s) { return "sin(" + s + ")"; },
            function (s) { return "cos(" + s + ")"; },
            function (s) { return "tan(" + s + ")"; },
            function (s) { return "sinh(" + s + ")"; },
            function (s) { return "cosh(" + s + ")"; },
            function (s) { return "tanh(" + s + ")"; },
            function (s) { return "abs(" + s + ")"; },
            function (s) { return "log(" + s + ")"; },
            function (s) { return "log(abs(" + s + "))"; },
            function (s) { return "sqrt(" + s + ")"; },
            function (s) { return "sqrt(abs(" + s + "))"; },
            function (s) { return "1/(" + s + ")"; },
            function (s) { return "(" + s + ")**2"; },
            function (s) { return "(" + s + ")**3"; },
            // (s) => `(${s})**4`,
            // (s) => `(${s})**5`,
            // (s) => `floor(${s})`,
            // (s) => `round(${s})`,
            // (s) => `sign(${s})`,
        ];
        var BINARY_OPERATIONS = [
            function (s, t) { return "(" + s + ")+(" + t + ")"; },
            function (s, t) { return "(" + s + ")*(" + t + ")"; },
            function (s, t) { return "(" + s + ")-(" + t + ")"; },
            function (s, t) { return "(" + s + ")/(" + t + ")"; },
            // (s, t) => `pow(${s},${t})`,
            // (s, t) => `max(${s},${t})`,
            // (s, t) => `min(${s},${t})`,
        ];
        var Randomizer = /** @class */ (function () {
            function Randomizer() {
            }
            Randomizer.prototype.randomFunc = function () {
                var targetDepth = this.randInt(constants_3.RANDOMIZER_MIN_DEPTH, constants_3.RANDOMIZER_MAX_DEPTH);
                return this.createSubFunc(1, targetDepth);
            };
            Randomizer.prototype.randomZoom = function () {
                return "1/" + this.randInt(1, 10);
            };
            Randomizer.prototype.createSubFunc = function (currentDepth, targetDepth) {
                if (currentDepth === targetDepth) {
                    return this.nullaryOperation();
                }
                var arity = this.randInt(1, 2);
                if (arity === 1) {
                    return this.unaryOperation(this.createSubFunc(currentDepth + 1, targetDepth));
                }
                var secondTargetDepth = this.randInt(currentDepth + 1, targetDepth);
                var decider = this.randInt(0, 1);
                var targetDepth0 = decider === 0 ? targetDepth : secondTargetDepth;
                var targetDepth1 = decider === 1 ? targetDepth : secondTargetDepth;
                return this.binaryOperation(this.createSubFunc(currentDepth + 1, targetDepth0), this.createSubFunc(currentDepth + 1, targetDepth1));
            };
            Randomizer.prototype.nullaryOperation = function () {
                var n = this.randInt(-5, 5);
                var operation = this.sample(NULLARY_OPERATIONS);
                return operation(n);
            };
            Randomizer.prototype.unaryOperation = function (s) {
                var operation = this.sample(UNARY_OPERATIONS);
                return operation(s);
            };
            Randomizer.prototype.binaryOperation = function (s, t) {
                var operation = this.sample(BINARY_OPERATIONS);
                return operation(s, t);
            };
            Randomizer.prototype.sample = function (array) {
                return array[this.randInt(0, array.length - 1)];
            };
            Randomizer.prototype.randInt = function (minInclusive, maxInclusive, skew) {
                if (skew === void 0) { skew = 1; }
                return Math.round(this.randFloat(minInclusive, maxInclusive, skew));
            };
            Randomizer.prototype.randFloat = function (minInclusive, maxInclusive, skew) {
                if (skew === void 0) { skew = 1; }
                return (maxInclusive - minInclusive) * Math.pow(Math.random(), skew) + minInclusive;
            };
            return Randomizer;
        }());
        exports.Randomizer = Randomizer;
    });
    define("toolbar/Toolbar", ["require", "exports", "common/constants", "toolbar/examples", "toolbar/Randomizer"], function (require, exports, constants_4, examples_1, Randomizer_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Toolbar = void 0;
        var BUTTON_ID_RANDOM = "#button-random";
        var Toolbar = /** @class */ (function () {
            function Toolbar(parser) {
                this.parser = parser;
                this.randomizer = new Randomizer_1.Randomizer();
            }
            Toolbar.prototype.activate = function () {
                this.showExampleOptions();
                this.setEventListeners();
                this.setExample(examples_1.initialExample);
            };
            Toolbar.prototype.showExampleOptions = function () {
                document.getElementById(constants_4.EXAMPLES_ID).innerHTML =
                    "<option value=\"-1\">&gt; Display example</option>" +
                        examples_1.examples
                            .map(function (example, index) {
                            return "<option value=\"" + index + "\">" + example.name + "</option>";
                        })
                            .join(", ");
            };
            Toolbar.prototype.setEventListeners = function () {
                var _this = this;
                document
                    .getElementById(constants_4.EXAMPLES_ID)
                    .addEventListener("change", function (event) {
                    var target = event.target;
                    var value = target === null || target === void 0 ? void 0 : target.value;
                    if (target === undefined || value === undefined || value === "-1") {
                        return;
                    }
                    _this.setExample(parseInt(value));
                    target.value = "-1";
                });
                document
                    .querySelector(BUTTON_ID_RANDOM)
                    .addEventListener("click", function () { return _this.setRandom(); });
            };
            Toolbar.prototype.setExample = function (exampleNumber) {
                this.parser.overwrite(examples_1.examples[exampleNumber]);
            };
            Toolbar.prototype.setRandom = function () {
                this.parser.overwrite({
                    red: this.randomizer.randomFunc(),
                    green: this.randomizer.randomFunc(),
                    blue: this.randomizer.randomFunc(),
                    zoom: this.randomizer.randomZoom(),
                });
            };
            return Toolbar;
        }());
        exports.Toolbar = Toolbar;
    });
    define("main", ["require", "exports", "Canvas", "Painter", "Parser", "toolbar/Toolbar"], function (require, exports, Canvas_1, Painter_1, Parser_1, Toolbar_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        var Main = /** @class */ (function () {
            function Main() {
                this.canvas = new Canvas_1.Canvas();
                this.painter = new Painter_1.Painter(this.canvas);
                this.parser = new Parser_1.Parser(this.painter);
                this.toolbar = new Toolbar_1.Toolbar(this.parser);
            }
            Main.prototype.run = function () {
                this.parser.activate();
                this.toolbar.activate();
            };
            return Main;
        }());
        window.onload = function () { return new Main().run(); };
    });
    //# sourceMappingURL=main.js.map
    'marker:resolver';

    function get_define(name) {
        if (defines[name]) {
            return defines[name];
        }
        else if (defines[name + '/index']) {
            return defines[name + '/index'];
        }
        else {
            var dependencies = ['exports'];
            var factory = function (exports) {
                try {
                    Object.defineProperty(exports, "__cjsModule", { value: true });
                    Object.defineProperty(exports, "default", { value: require(name) });
                }
                catch (_a) {
                    throw Error(['module "', name, '" not found.'].join(''));
                }
            };
            return { dependencies: dependencies, factory: factory };
        }
    }
    var instances = {};
    function resolve(name) {
        if (instances[name]) {
            return instances[name];
        }
        if (name === 'exports') {
            return {};
        }
        var define = get_define(name);
        instances[name] = {};
        var dependencies = define.dependencies.map(function (name) { return resolve(name); });
        define.factory.apply(define, dependencies);
        var exports = dependencies[define.dependencies.indexOf('exports')];
        instances[name] = (exports['__cjsModule']) ? exports.default : exports;
        return instances[name];
    }
    if (entry[0] !== null) {
        return resolve(entry[0]);
    }
})();