"use strict";

const globalObject = require("@sinonjs/commons").global;
let timersModule, timersPromisesModule;

/**
 * @typedef {object} IdleDeadline
 * @property {boolean} didTimeout - whether or not the callback was called before reaching the optional timeout
 * @property {function():number} timeRemaining - a floating-point value providing an estimate of the number of milliseconds remaining in the current idle period
 */

/**
 * Queues a function to be called during a browser's idle periods
 * @callback RequestIdleCallback
 * @param {function(IdleDeadline)} callback
 * @param {{timeout: number}} options - an options object
 * @returns {number} the id
 */

/**
 * @callback NextTick
 * @param {VoidVarArgsFunc} callback - the callback to run
 * @param {...*} args - optional arguments to call the callback with
 * @returns {void}
 */

/**
 * @callback SetImmediate
 * @param {VoidVarArgsFunc} callback - the callback to run
 * @param {...*} args - optional arguments to call the callback with
 * @returns {NodeImmediate}
 */

/**
 * @callback VoidVarArgsFunc
 * @param {...*} callback - the callback to run
 * @returns {void}
 */

/**
 * @typedef RequestAnimationFrame
 * @property {function(number):void} requestAnimationFrame
 * @returns {number} - the id
 */

/**
 * @typedef Performance
 * @property {function(): number} now
 */

/* eslint-disable jsdoc/require-property-description */
/**
 * @typedef {object} Clock
 * @property {number} now - the current time
 * @property {Date} Date - the Date constructor
 * @property {number} loopLimit - the maximum number of timers before assuming an infinite loop
 * @property {RequestIdleCallback} requestIdleCallback
 * @property {function(number):void} cancelIdleCallback
 * @property {setTimeout} setTimeout
 * @property {clearTimeout} clearTimeout
 * @property {NextTick} nextTick
 * @property {queueMicrotask} queueMicrotask
 * @property {setInterval} setInterval
 * @property {clearInterval} clearInterval
 * @property {SetImmediate} setImmediate
 * @property {function(NodeImmediate):void} clearImmediate
 * @property {function():number} countTimers
 * @property {RequestAnimationFrame} requestAnimationFrame
 * @property {function(number):void} cancelAnimationFrame
 * @property {function():void} runMicrotasks
 * @property {function(string | number): number} tick
 * @property {function(string | number): Promise<number>} tickAsync
 * @property {function(): number} next
 * @property {function(): Promise<number>} nextAsync
 * @property {function(): number} runAll
 * @property {function(): number} runToFrame
 * @property {function(): Promise<number>} runAllAsync
 * @property {function(): number} runToLast
 * @property {function(): Promise<number>} runToLastAsync
 * @property {function(): void} reset
 * @property {function(number | Date): void} setSystemTime
 * @property {function(number): void} jump
 * @property {Performance} performance
 * @property {function(number[]): number[]} hrtime - process.hrtime (legacy)
 * @property {function(): void} uninstall Uninstall the clock.
 * @property {Function[]} methods - the methods that are faked
 * @property {boolean} [shouldClearNativeTimers] inherited from config
 * @property {{methodName:string, original:any}[] | undefined} timersModuleMethods
 * @property {{methodName:string, original:any}[] | undefined} timersPromisesModuleMethods
 * @property {Map<function(): void, AbortSignal>} abortListenerMap
 */
/* eslint-enable jsdoc/require-property-description */

/**
 * Configuration object for the `install` method.
 * @typedef {object} Config
 * @property {number|Date} [now] a number (in milliseconds) or a Date object (default epoch)
 * @property {string[]} [toFake] names of the methods that should be faked.
 * @property {number} [loopLimit] the maximum number of timers that will be run when calling runAll()
 * @property {boolean} [shouldAdvanceTime] tells FakeTimers to increment mocked time automatically (default false)
 * @property {number} [advanceTimeDelta] increment mocked time every <<advanceTimeDelta>> ms (default: 20ms)
 * @property {boolean} [shouldClearNativeTimers] forwards clear timer calls to native functions if they are not fakes (default: false)
 * @property {boolean} [ignoreMissingTimers] default is false, meaning asking to fake timers that are not present will throw an error
 */

/* eslint-disable jsdoc/require-property-description */
/**
 * The internal structure to describe a scheduled fake timer
 * @typedef {object} Timer
 * @property {Function} func
 * @property {*[]} args
 * @property {number} delay
 * @property {number} callAt
 * @property {number} createdAt
 * @property {boolean} immediate
 * @property {number} id
 * @property {Error} [error]
 */

/**
 * A Node timer
 * @typedef {object} NodeImmediate
 * @property {function(): boolean} hasRef
 * @property {function(): NodeImmediate} ref
 * @property {function(): NodeImmediate} unref
 */
/* eslint-enable jsdoc/require-property-description */

/* eslint-disable complexity */

/**
 * Mocks available features in the specified global namespace.
 * @param {*} _global Namespace to mock (e.g. `window`)
 * @returns {FakeTimers}
 */
function withGlobal(_global) {
    const maxTimeout = Math.pow(2, 31) - 1; //see https://heycam.github.io/webidl/#abstract-opdef-converttoint
    const idCounterStart = 1e12; // arbitrarily large number to avoid collisions with native timer IDs
    const NOOP = function () {
        return undefined;
    };
    const NOOP_ARRAY = function () {
        return [];
    };
    const isPresent = {};
    let timeoutResult,
        addTimerReturnsObject = false;

    if (_global.setTimeout) {
        isPresent.setTimeout = true;
        timeoutResult = _global.setTimeout(NOOP, 0);
        addTimerReturnsObject = typeof timeoutResult === "object";
    }
    isPresent.clearTimeout = Boolean(_global.clearTimeout);
    isPresent.setInterval = Boolean(_global.setInterval);
    isPresent.clearInterval = Boolean(_global.clearInterval);
    isPresent.hrtime =
        _global.process && typeof _global.process.hrtime === "function";
    isPresent.hrtimeBigint =
        isPresent.hrtime && typeof _global.process.hrtime.bigint === "function";
    isPresent.nextTick =
        _global.process && typeof _global.process.nextTick === "function";
    const utilPromisify = _global.process && false;
    isPresent.performance =
        _global.performance && typeof _global.performance.now === "function";
    const hasPerformancePrototype =
        _global.Performance &&
        (typeof _global.Performance).match(/^(function|object)$/);
    const hasPerformanceConstructorPrototype =
        _global.performance &&
        _global.performance.constructor &&
        _global.performance.constructor.prototype;
    isPresent.queueMicrotask = _global.hasOwnProperty("queueMicrotask");
    isPresent.requestAnimationFrame =
        _global.requestAnimationFrame &&
        typeof _global.requestAnimationFrame === "function";
    isPresent.cancelAnimationFrame =
        _global.cancelAnimationFrame &&
        typeof _global.cancelAnimationFrame === "function";
    isPresent.requestIdleCallback =
        _global.requestIdleCallback &&
        typeof _global.requestIdleCallback === "function";
    isPresent.cancelIdleCallbackPresent =
        _global.cancelIdleCallback &&
        typeof _global.cancelIdleCallback === "function";
    isPresent.setImmediate =
        _global.setImmediate && typeof _global.setImmediate === "function";
    isPresent.clearImmediate =
        _global.clearImmediate && typeof _global.clearImmediate === "function";
    isPresent.Intl = _global.Intl && typeof _global.Intl === "object";

    if (_global.clearTimeout) {
        _global.clearTimeout(timeoutResult);
    }

    const NativeDate = _global.Date;
    const NativeIntl = isPresent.Intl
        ? Object.defineProperties(
              Object.create(null),
              Object.getOwnPropertyDescriptors(_global.Intl),
          )
        : undefined;
    let uniqueTimerId = idCounterStart;

    if (NativeDate === undefined) {
        throw new Error(
            "The global scope doesn't have a `Date` object" +
                " (see https://github.com/sinonjs/sinon/issues/1852#issuecomment-419622780)",
        );
    }
    isPresent.Date = true;

    /**
     * The PerformanceEntry object encapsulates a single performance metric
     * that is part of the browser's performance timeline.
     *
     * This is an object returned by the `mark` and `measure` methods on the Performance prototype
     */
    class FakePerformanceEntry {
        constructor(name, entryType, startTime, duration) {
            this.name = name;
            this.entryType = entryType;
            this.startTime = startTime;
            this.duration = duration;
        }

        toJSON() {
            return JSON.stringify({ ...this });
        }
    }

    /**
     * @param {number} num
     * @returns {boolean}
     */
    function isNumberFinite(num) {
        if (Number.isFinite) {
            return Number.isFinite(num);
        }

        return isFinite(num);
    }

    let isNearInfiniteLimit = false;

    /**
     * @param {Clock} clock
     * @param {number} i
     */
    function checkIsNearInfiniteLimit(clock, i) {
        if (clock.loopLimit && i === clock.loopLimit - 1) {
            isNearInfiniteLimit = true;
        }
    }

    /**
     *
     */
    function resetIsNearInfiniteLimit() {
        isNearInfiniteLimit = false;
    }

    /**
     * Parse strings like "01:10:00" (meaning 1 hour, 10 minutes, 0 seconds) into
     * number of milliseconds. This is used to support human-readable strings passed
     * to clock.tick()
     * @param {string} str
     * @returns {number}
     */
    function parseTime(str) {
        if (!str) {
            return 0;
        }

        const strings = str.split(":");
        const l = strings.length;
        let i = l;
        let ms = 0;
        let parsed;

        if (l > 3 || !/^(\d\d:){0,2}\d\d?$/.test(str)) {
            throw new Error(
                "tick only understands numbers, 'm:s' and 'h:m:s'. Each part must be two digits",
            );
        }

        while (i--) {
            parsed = parseInt(strings[i], 10);

            if (parsed >= 60) {
                throw new Error(`Invalid time ${str}`);
            }

            ms += parsed * Math.pow(60, l - i - 1);
        }

        return ms * 1000;
    }

    /**
     * Get the decimal part of the millisecond value as nanoseconds
     * @param {number} msFloat the number of milliseconds
     * @returns {number} an integer number of nanoseconds in the range [0,1e6)
     *
     * Example: nanoRemainer(123.456789) -> 456789
     */
    function nanoRemainder(msFloat) {
        const modulo = 1e6;
        const remainder = (msFloat * 1e6) % modulo;
        const positiveRemainder =
            remainder < 0 ? remainder + modulo : remainder;

        return Math.floor(positiveRemainder);
    }

    /**
     * Used to grok the `now` parameter to createClock.
     * @param {Date|number} epoch the system time
     * @returns {number}
     */
    function getEpoch(epoch) {
        if (!epoch) {
            return 0;
        }
        if (typeof epoch.getTime === "function") {
            return epoch.getTime();
        }
        if (typeof epoch === "number") {
            return epoch;
        }
        throw new TypeError("now should be milliseconds since UNIX epoch");
    }

    /**
     * @param {number} from
     * @param {number} to
     * @param {Timer} timer
     * @returns {boolean}
     */
    function inRange(from, to, timer) {
        return timer && timer.callAt >= from && timer.callAt <= to;
    }

    /**
     * @param {Clock} clock
     * @param {Timer} job
     */
    function getInfiniteLoopError(clock, job) {
        const infiniteLoopError = new Error(
            `Aborting after running ${clock.loopLimit} timers, assuming an infinite loop!`,
        );

        if (!job.error) {
            return infiniteLoopError;
        }

        // pattern never matched in Node
        const computedTargetPattern = /target\.*[<|(|[].*?[>|\]|)]\s*/;
        let clockMethodPattern = new RegExp(
            String(Object.keys(clock).join("|")),
        );

        if (addTimerReturnsObject) {
            // node.js environment
            clockMethodPattern = new RegExp(
                `\\s+at (Object\\.)?(?:${Object.keys(clock).join("|")})\\s+`,
            );
        }

        let matchedLineIndex = -1;
        job.error.stack.split("\n").some(function (line, i) {
            // If we've matched a computed target line (e.g. setTimeout) then we
            // don't need to look any further. Return true to stop iterating.
            const matchedComputedTarget = line.match(computedTargetPattern);
            /* istanbul ignore if */
            if (matchedComputedTarget) {
                matchedLineIndex = i;
                return true;
            }

            // If we've matched a clock method line, then there may still be
            // others further down the trace. Return false to keep iterating.
            const matchedClockMethod = line.match(clockMethodPattern);
            if (matchedClockMethod) {
                matchedLineIndex = i;
                return false;
            }

            // If we haven't matched anything on this line, but we matched
            // previously and set the matched line index, then we can stop.
            // If we haven't matched previously, then we should keep iterating.
            return matchedLineIndex >= 0;
        });

        const stack = `${infiniteLoopError}\n${job.type || "Microtask"} - ${
            job.func.name || "anonymous"
        }\n${job.error.stack
            .split("\n")
            .slice(matchedLineIndex + 1)
            .join("\n")}`;

        try {
            Object.defineProperty(infiniteLoopError, "stack", {
                value: stack,
            });
        } catch (e) {
            // noop
        }

        return infiniteLoopError;
    }

    //eslint-disable-next-line jsdoc/require-jsdoc
    function createDate() {
        class ClockDate extends NativeDate {
            /**
             * @param {number} year
             * @param {number} month
             * @param {number} date
             * @param {number} hour
             * @param {number} minute
             * @param {number} second
             * @param {number} ms
             * @returns void
             */
            // eslint-disable-next-line no-unused-vars
            constructor(year, month, date, hour, minute, second, ms) {
                // Defensive and verbose to avoid potential harm in passing
                // explicit undefined when user does not pass argument
                if (arguments.length === 0) {
                    super(ClockDate.clock.now);
                } else {
                    super(...arguments);
                }

                // ensures identity checks using the constructor prop still works
                // this should have no other functional effect
                Object.defineProperty(this, "constructor", {
                    value: NativeDate,
                    enumerable: false,
                });
            }

            static [Symbol.hasInstance](instance) {
                return instance instanceof NativeDate;
            }
        }

        ClockDate.isFake = true;

        if (NativeDate.now) {
            ClockDate.now = function now() {
                return ClockDate.clock.now;
            };
        }

        if (NativeDate.toSource) {
            ClockDate.toSource = function toSource() {
                return NativeDate.toSource();
            };
        }

        ClockDate.toString = function toString() {
            return NativeDate.toString();
        };

        // noinspection UnnecessaryLocalVariableJS
        /**
         * A normal Class constructor cannot be called without `new`, but Date can, so we need
         * to wrap it in a Proxy in order to ensure this functionality of Date is kept intact
         * @type {ClockDate}
         */
        const ClockDateProxy = new Proxy(ClockDate, {
            // handler for [[Call]] invocations (i.e. not using `new`)
            apply() {
                // the Date constructor called as a function, ref Ecma-262 Edition 5.1, section 15.9.2.
                // This remains so in the 10th edition of 2019 as well.
                if (this instanceof ClockDate) {
                    throw new TypeError(
                        "A Proxy should only capture `new` calls with the `construct` handler. This is not supposed to be possible, so check the logic.",
                    );
                }

                return new NativeDate(ClockDate.clock.now).toString();
            },
        });

        return ClockDateProxy;
    }

    /**
     * Mirror Intl by default on our fake implementation
     *
     * Most of the properties are the original native ones,
     * but we need to take control of those that have a
     * dependency on the current clock.
     * @returns {object} the partly fake Intl implementation
     */
    function createIntl() {
        const ClockIntl = {};
        /*
         * All properties of Intl are non-enumerable, so we need
         * to do a bit of work to get them out.
         */
        Object.getOwnPropertyNames(NativeIntl).forEach(
            (property) => (ClockIntl[property] = NativeIntl[property]),
        );

        ClockIntl.DateTimeFormat = function (...args) {
            const realFormatter = new NativeIntl.DateTimeFormat(...args);
            const formatter = {};

            ["formatRange", "formatRangeToParts", "resolvedOptions"].forEach(
                (method) => {
                    formatter[method] =
                        realFormatter[method].bind(realFormatter);
                },
            );

            ["format", "formatToParts"].forEach((method) => {
                formatter[method] = function (date) {
                    return realFormatter[method](date || ClockIntl.clock.now);
                };
            });

            return formatter;
        };

        ClockIntl.DateTimeFormat.prototype = Object.create(
            NativeIntl.DateTimeFormat.prototype,
        );

        ClockIntl.DateTimeFormat.supportedLocalesOf =
            NativeIntl.DateTimeFormat.supportedLocalesOf;

        return ClockIntl;
    }

    //eslint-disable-next-line jsdoc/require-jsdoc
    function enqueueJob(clock, job) {
        // enqueues a microtick-deferred task - ecma262/#sec-enqueuejob
        if (!clock.jobs) {
            clock.jobs = [];
        }
        clock.jobs.push(job);
    }

    //eslint-disable-next-line jsdoc/require-jsdoc
    function runJobs(clock) {
        // runs all microtick-deferred tasks - ecma262/#sec-runjobs
        if (!clock.jobs) {
            return;
        }
        for (let i = 0; i < clock.jobs.length; i++) {
            const job = clock.jobs[i];
            job.func.apply(null, job.args);

            checkIsNearInfiniteLimit(clock, i);
            if (clock.loopLimit && i > clock.loopLimit) {
                throw getInfiniteLoopError(clock, job);
            }
        }
        resetIsNearInfiniteLimit();
        clock.jobs = [];
    }

    /**
     * @param {Clock} clock
     * @param {Timer} timer
     * @returns {number} id of the created timer
     */
    function addTimer(clock, timer) {
        if (timer.func === undefined) {
            throw new Error("Callback must be provided to timer calls");
        }

        if (addTimerReturnsObject) {
            // Node.js environment
            if (typeof timer.func !== "function") {
                throw new TypeError(
                    `[ERR_INVALID_CALLBACK]: Callback must be a function. Received ${
                        timer.func
                    } of type ${typeof timer.func}`,
                );
            }
        }

        if (isNearInfiniteLimit) {
            timer.error = new Error();
        }

        timer.type = timer.immediate ? "Immediate" : "Timeout";

        if (timer.hasOwnProperty("delay")) {
            if (typeof timer.delay !== "number") {
                timer.delay = parseInt(timer.delay, 10);
            }

            if (!isNumberFinite(timer.delay)) {
                timer.delay = 0;
            }
            timer.delay = timer.delay > maxTimeout ? 1 : timer.delay;
            timer.delay = Math.max(0, timer.delay);
        }

        if (timer.hasOwnProperty("interval")) {
            timer.type = "Interval";
            timer.interval = timer.interval > maxTimeout ? 1 : timer.interval;
        }

        if (timer.hasOwnProperty("animation")) {
            timer.type = "AnimationFrame";
            timer.animation = true;
        }

        if (timer.hasOwnProperty("idleCallback")) {
            timer.type = "IdleCallback";
            timer.idleCallback = true;
        }

        if (!clock.timers) {
            clock.timers = {};
        }

        timer.id = uniqueTimerId++;
        timer.createdAt = clock.now;
        timer.callAt =
            clock.now + (parseInt(timer.delay) || (clock.duringTick ? 1 : 0));

        clock.timers[timer.id] = timer;

        if (addTimerReturnsObject) {
            const res = {
                refed: true,
                ref: function () {
                    this.refed = true;
                    return res;
                },
                unref: function () {
                    this.refed = false;
                    return res;
                },
                hasRef: function () {
                    return this.refed;
                },
                refresh: function () {
                    timer.callAt =
                        clock.now +
                        (parseInt(timer.delay) || (clock.duringTick ? 1 : 0));

                    // it _might_ have been removed, but if not the assignment is perfectly fine
                    clock.timers[timer.id] = timer;

                    return res;
                },
                [Symbol.toPrimitive]: function () {
                    return timer.id;
                },
            };
            return res;
        }

        return timer.id;
    }

    /* eslint consistent-return: "off" */
    /**
     * Timer comparitor
     * @param {Timer} a
     * @param {Timer} b
     * @returns {number}
     */
    function compareTimers(a, b) {
        // Sort first by absolute timing
        if (a.callAt < b.callAt) {
            return -1;
        }
        if (a.callAt > b.callAt) {
            return 1;
        }

        // Sort next by immediate, immediate timers take precedence
        if (a.immediate && !b.immediate) {
            return -1;
        }
        if (!a.immediate && b.immediate) {
            return 1;
        }

        // Sort next by creation time, earlier-created timers take precedence
        if (a.createdAt < b.createdAt) {
            return -1;
        }
        if (a.createdAt > b.createdAt) {
            return 1;
        }

        // Sort next by id, lower-id timers take precedence
        if (a.id < b.id) {
            return -1;
        }
        if (a.id > b.id) {
            return 1;
        }

        // As timer ids are unique, no fallback `0` is necessary
    }

    /**
     * @param {Clock} clock
     * @param {number} from
     * @param {number} to
     * @returns {Timer}
     */
    function firstTimerInRange(clock, from, to) {
        const timers = clock.timers;
        let timer = null;
        let id, isInRange;

        for (id in timers) {
            if (timers.hasOwnProperty(id)) {
                isInRange = inRange(from, to, timers[id]);

                if (
                    isInRange &&
                    (!timer || compareTimers(timer, timers[id]) === 1)
                ) {
                    timer = timers[id];
                }
            }
        }

        return timer;
    }

    /**
     * @param {Clock} clock
     * @returns {Timer}
     */
    function firstTimer(clock) {
        const timers = clock.timers;
        let timer = null;
        let id;

        for (id in timers) {
            if (timers.hasOwnProperty(id)) {
                if (!timer || compareTimers(timer, timers[id]) === 1) {
                    timer = timers[id];
                }
            }
        }

        return timer;
    }

    /**
     * @param {Clock} clock
     * @returns {Timer}
     */
    function lastTimer(clock) {
        const timers = clock.timers;
        let timer = null;
        let id;

        for (id in timers) {
            if (timers.hasOwnProperty(id)) {
                if (!timer || compareTimers(timer, timers[id]) === -1) {
                    timer = timers[id];
                }
            }
        }

        return timer;
    }

    /**
     * @param {Clock} clock
     * @param {Timer} timer
     */
    function callTimer(clock, timer) {
        if (typeof timer.interval === "number") {
            clock.timers[timer.id].callAt += timer.interval;
        } else {
            delete clock.timers[timer.id];
        }

        if (typeof timer.func === "function") {
            timer.func.apply(null, timer.args);
        } else {
            /* eslint no-eval: "off" */
            const eval2 = eval;
            (function () {
                eval2(timer.func);
            })();
        }
    }

    /**
     * Gets clear handler name for a given timer type
     * @param {string} ttype
     */
    function getClearHandler(ttype) {
        if (ttype === "IdleCallback" || ttype === "AnimationFrame") {
            return `cancel${ttype}`;
        }
        return `clear${ttype}`;
    }

    /**
     * Gets schedule handler name for a given timer type
     * @param {string} ttype
     */
    function getScheduleHandler(ttype) {
        if (ttype === "IdleCallback" || ttype === "AnimationFrame") {
            return `request${ttype}`;
        }
        return `set${ttype}`;
    }

    /**
     * Creates an anonymous function to warn only once
     */
    function createWarnOnce() {
        let calls = 0;
        return function (msg) {
            // eslint-disable-next-line
            !calls++ && console.warn(msg);
        };
    }
    const warnOnce = createWarnOnce();

    /**
     * @param {Clock} clock
     * @param {number} timerId
     * @param {string} ttype
     */
    function clearTimer(clock, timerId, ttype) {
        if (!timerId) {
            // null appears to be allowed in most browsers, and appears to be
            // relied upon by some libraries, like Bootstrap carousel
            return;
        }

        if (!clock.timers) {
            clock.timers = {};
        }

        // in Node, the ID is stored as the primitive value for `Timeout` objects
        // for `Immediate` objects, no ID exists, so it gets coerced to NaN
        const id = Number(timerId);

        if (Number.isNaN(id) || id < idCounterStart) {
            const handlerName = getClearHandler(ttype);

            if (clock.shouldClearNativeTimers === true) {
                const nativeHandler = clock[`_${handlerName}`];
                return typeof nativeHandler === "function"
                    ? nativeHandler(timerId)
                    : undefined;
            }
            warnOnce(
                `FakeTimers: ${handlerName} was invoked to clear a native timer instead of one created by this library.` +
                    "\nTo automatically clean-up native timers, use `shouldClearNativeTimers`.",
            );
        }

        if (clock.timers.hasOwnProperty(id)) {
            // check that the ID matches a timer of the correct type
            const timer = clock.timers[id];
            if (
                timer.type === ttype ||
                (timer.type === "Timeout" && ttype === "Interval") ||
                (timer.type === "Interval" && ttype === "Timeout")
            ) {
                delete clock.timers[id];
            } else {
                const clear = getClearHandler(ttype);
                const schedule = getScheduleHandler(timer.type);
                throw new Error(
                    `Cannot clear timer: timer created with ${schedule}() but cleared with ${clear}()`,
                );
            }
        }
    }

    /**
     * @param {Clock} clock
     * @param {Config} config
     * @returns {Timer[]}
     */
    function uninstall(clock, config) {
        let method, i, l;
        const installedHrTime = "_hrtime";
        const installedNextTick = "_nextTick";

        for (i = 0, l = clock.methods.length; i < l; i++) {
            method = clock.methods[i];
            if (method === "hrtime" && _global.process) {
                _global.process.hrtime = clock[installedHrTime];
            } else if (method === "nextTick" && _global.process) {
                _global.process.nextTick = clock[installedNextTick];
            } else if (method === "performance") {
                const originalPerfDescriptor = Object.getOwnPropertyDescriptor(
                    clock,
                    `_${method}`,
                );
                if (
                    originalPerfDescriptor &&
                    originalPerfDescriptor.get &&
                    !originalPerfDescriptor.set
                ) {
                    Object.defineProperty(
                        _global,
                        method,
                        originalPerfDescriptor,
                    );
                } else if (originalPerfDescriptor.configurable) {
                    _global[method] = clock[`_${method}`];
                }
            } else {
                if (_global[method] && _global[method].hadOwnProperty) {
                    _global[method] = clock[`_${method}`];
                } else {
                    try {
                        delete _global[method];
                    } catch (ignore) {
                        /* eslint no-empty: "off" */
                    }
                }
            }
            if (clock.timersModuleMethods !== undefined) {
                for (let j = 0; j < clock.timersModuleMethods.length; j++) {
                    const entry = clock.timersModuleMethods[j];
                    timersModule[entry.methodName] = entry.original;
                }
            }
            if (clock.timersPromisesModuleMethods !== undefined) {
                for (
                    let j = 0;
                    j < clock.timersPromisesModuleMethods.length;
                    j++
                ) {
                    const entry = clock.timersPromisesModuleMethods[j];
                    timersPromisesModule[entry.methodName] = entry.original;
                }
            }
        }

        if (config.shouldAdvanceTime === true) {
            _global.clearInterval(clock.attachedInterval);
        }

        // Prevent multiple executions which will completely remove these props
        clock.methods = [];

        for (const [listener, signal] of clock.abortListenerMap.entries()) {
            signal.removeEventListener("abort", listener);
            clock.abortListenerMap.delete(listener);
        }

        // return pending timers, to enable checking what timers remained on uninstall
        if (!clock.timers) {
            return [];
        }
        return Object.keys(clock.timers).map(function mapper(key) {
            return clock.timers[key];
        });
    }

    /**
     * @param {object} target the target containing the method to replace
     * @param {string} method the keyname of the method on the target
     * @param {Clock} clock
     */
    function hijackMethod(target, method, clock) {
        clock[method].hadOwnProperty = Object.prototype.hasOwnProperty.call(
            target,
            method,
        );
        clock[`_${method}`] = target[method];

        if (method === "Date") {
            target[method] = clock[method];
        } else if (method === "Intl") {
            target[method] = clock[method];
        } else if (method === "performance") {
            const originalPerfDescriptor = Object.getOwnPropertyDescriptor(
                target,
                method,
            );
            // JSDOM has a read only performance field so we have to save/copy it differently
            if (
                originalPerfDescriptor &&
                originalPerfDescriptor.get &&
                !originalPerfDescriptor.set
            ) {
                Object.defineProperty(
                    clock,
                    `_${method}`,
                    originalPerfDescriptor,
                );

                const perfDescriptor = Object.getOwnPropertyDescriptor(
                    clock,
                    method,
                );
                Object.defineProperty(target, method, perfDescriptor);
            } else {
                target[method] = clock[method];
            }
        } else {
            target[method] = function () {
                return clock[method].apply(clock, arguments);
            };

            Object.defineProperties(
                target[method],
                Object.getOwnPropertyDescriptors(clock[method]),
            );
        }

        target[method].clock = clock;
    }

    /**
     * @param {Clock} clock
     * @param {number} advanceTimeDelta
     */
    function doIntervalTick(clock, advanceTimeDelta) {
        clock.tick(advanceTimeDelta);
    }

    /**
     * @typedef {object} Timers
     * @property {setTimeout} setTimeout
     * @property {clearTimeout} clearTimeout
     * @property {setInterval} setInterval
     * @property {clearInterval} clearInterval
     * @property {Date} Date
     * @property {Intl} Intl
     * @property {SetImmediate=} setImmediate
     * @property {function(NodeImmediate): void=} clearImmediate
     * @property {function(number[]):number[]=} hrtime
     * @property {NextTick=} nextTick
     * @property {Performance=} performance
     * @property {RequestAnimationFrame=} requestAnimationFrame
     * @property {boolean=} queueMicrotask
     * @property {function(number): void=} cancelAnimationFrame
     * @property {RequestIdleCallback=} requestIdleCallback
     * @property {function(number): void=} cancelIdleCallback
     */

    /** @type {Timers} */
    const timers = {
        setTimeout: _global.setTimeout,
        clearTimeout: _global.clearTimeout,
        setInterval: _global.setInterval,
        clearInterval: _global.clearInterval,
        Date: _global.Date,
    };

    if (isPresent.setImmediate) {
        timers.setImmediate = _global.setImmediate;
    }

    if (isPresent.clearImmediate) {
        timers.clearImmediate = _global.clearImmediate;
    }

    if (isPresent.hrtime) {
        timers.hrtime = _global.process.hrtime;
    }

    if (isPresent.nextTick) {
        timers.nextTick = _global.process.nextTick;
    }

    if (isPresent.performance) {
        timers.performance = _global.performance;
    }

    if (isPresent.requestAnimationFrame) {
        timers.requestAnimationFrame = _global.requestAnimationFrame;
    }

    if (isPresent.queueMicrotask) {
        timers.queueMicrotask = _global.queueMicrotask;
    }

    if (isPresent.cancelAnimationFrame) {
        timers.cancelAnimationFrame = _global.cancelAnimationFrame;
    }

    if (isPresent.requestIdleCallback) {
        timers.requestIdleCallback = _global.requestIdleCallback;
    }

    if (isPresent.cancelIdleCallback) {
        timers.cancelIdleCallback = _global.cancelIdleCallback;
    }

    if (isPresent.Intl) {
        timers.Intl = NativeIntl;
    }

    const originalSetTimeout = _global.setImmediate || _global.setTimeout;

    /**
     * @param {Date|number} [start] the system time - non-integer values are floored
     * @param {number} [loopLimit] maximum number of timers that will be run when calling runAll()
     * @returns {Clock}
     */
    function createClock(start, loopLimit) {
        // eslint-disable-next-line no-param-reassign
        start = Math.floor(getEpoch(start));
        // eslint-disable-next-line no-param-reassign
        loopLimit = loopLimit || 1000;
        let nanos = 0;
        const adjustedSystemTime = [0, 0]; // [millis, nanoremainder]

        const clock = {
            now: start,
            Date: createDate(),
            loopLimit: loopLimit,
        };

        clock.Date.clock = clock;

        //eslint-disable-next-line jsdoc/require-jsdoc
        function getTimeToNextFrame() {
            return 16 - ((clock.now - start) % 16);
        }

        //eslint-disable-next-line jsdoc/require-jsdoc
        function hrtime(prev) {
            const millisSinceStart = clock.now - adjustedSystemTime[0] - start;
            const secsSinceStart = Math.floor(millisSinceStart / 1000);
            const remainderInNanos =
                (millisSinceStart - secsSinceStart * 1e3) * 1e6 +
                nanos -
                adjustedSystemTime[1];

            if (Array.isArray(prev)) {
                if (prev[1] > 1e9) {
                    throw new TypeError(
                        "Number of nanoseconds can't exceed a billion",
                    );
                }

                const oldSecs = prev[0];
                let nanoDiff = remainderInNanos - prev[1];
                let secDiff = secsSinceStart - oldSecs;

                if (nanoDiff < 0) {
                    nanoDiff += 1e9;
                    secDiff -= 1;
                }

                return [secDiff, nanoDiff];
            }
            return [secsSinceStart, remainderInNanos];
        }

        /**
         * A high resolution timestamp in milliseconds.
         * @typedef {number} DOMHighResTimeStamp
         */

        /**
         * performance.now()
         * @returns {DOMHighResTimeStamp}
         */
        function fakePerformanceNow() {
            const hrt = hrtime();
            const millis = hrt[0] * 1000 + hrt[1] / 1e6;
            return millis;
        }

        if (isPresent.hrtimeBigint) {
            hrtime.bigint = function () {
                const parts = hrtime();
                return BigInt(parts[0]) * BigInt(1e9) + BigInt(parts[1]); // eslint-disable-line
            };
        }

        if (isPresent.Intl) {
            clock.Intl = createIntl();
            clock.Intl.clock = clock;
        }

        clock.requestIdleCallback = function requestIdleCallback(
            func,
            timeout,
        ) {
            let timeToNextIdlePeriod = 0;

            if (clock.countTimers() > 0) {
                timeToNextIdlePeriod = 50; // const for now
            }

            const result = addTimer(clock, {
                func: func,
                args: Array.prototype.slice.call(arguments, 2),
                delay:
                    typeof timeout === "undefined"
                        ? timeToNextIdlePeriod
                        : Math.min(timeout, timeToNextIdlePeriod),
                idleCallback: true,
            });

            return Number(result);
        };

        clock.cancelIdleCallback = function cancelIdleCallback(timerId) {
            return clearTimer(clock, timerId, "IdleCallback");
        };

        clock.setTimeout = function setTimeout(func, timeout) {
            return addTimer(clock, {
                func: func,
                args: Array.prototype.slice.call(arguments, 2),
                delay: timeout,
            });
        };
        if (typeof _global.Promise !== "undefined" && utilPromisify) {
            clock.setTimeout[utilPromisify.custom] =
                function promisifiedSetTimeout(timeout, arg) {
                    return new _global.Promise(function setTimeoutExecutor(
                        resolve,
                    ) {
                        addTimer(clock, {
                            func: resolve,
                            args: [arg],
                            delay: timeout,
                        });
                    });
                };
        }

        clock.clearTimeout = function clearTimeout(timerId) {
            return clearTimer(clock, timerId, "Timeout");
        };

        clock.nextTick = function nextTick(func) {
            return enqueueJob(clock, {
                func: func,
                args: Array.prototype.slice.call(arguments, 1),
                error: isNearInfiniteLimit ? new Error() : null,
            });
        };

        clock.queueMicrotask = function queueMicrotask(func) {
            return clock.nextTick(func); // explicitly drop additional arguments
        };

        clock.setInterval = function setInterval(func, timeout) {
            // eslint-disable-next-line no-param-reassign
            timeout = parseInt(timeout, 10);
            return addTimer(clock, {
                func: func,
                args: Array.prototype.slice.call(arguments, 2),
                delay: timeout,
                interval: timeout,
            });
        };

        clock.clearInterval = function clearInterval(timerId) {
            return clearTimer(clock, timerId, "Interval");
        };

        if (isPresent.setImmediate) {
            clock.setImmediate = function setImmediate(func) {
                return addTimer(clock, {
                    func: func,
                    args: Array.prototype.slice.call(arguments, 1),
                    immediate: true,
                });
            };

            if (typeof _global.Promise !== "undefined" && utilPromisify) {
                clock.setImmediate[utilPromisify.custom] =
                    function promisifiedSetImmediate(arg) {
                        return new _global.Promise(
                            function setImmediateExecutor(resolve) {
                                addTimer(clock, {
                                    func: resolve,
                                    args: [arg],
                                    immediate: true,
                                });
                            },
                        );
                    };
            }

            clock.clearImmediate = function clearImmediate(timerId) {
                return clearTimer(clock, timerId, "Immediate");
            };
        }

        clock.countTimers = function countTimers() {
            return (
                Object.keys(clock.timers || {}).length +
                (clock.jobs || []).length
            );
        };

        clock.requestAnimationFrame = function requestAnimationFrame(func) {
            const result = addTimer(clock, {
                func: func,
                delay: getTimeToNextFrame(),
                get args() {
                    return [fakePerformanceNow()];
                },
                animation: true,
            });

            return Number(result);
        };

        clock.cancelAnimationFrame = function cancelAnimationFrame(timerId) {
            return clearTimer(clock, timerId, "AnimationFrame");
        };

        clock.runMicrotasks = function runMicrotasks() {
            runJobs(clock);
        };

        /**
         * @param {number|string} tickValue milliseconds or a string parseable by parseTime
         * @param {boolean} isAsync
         * @param {Function} resolve
         * @param {Function} reject
         * @returns {number|undefined} will return the new `now` value or nothing for async
         */
        function doTick(tickValue, isAsync, resolve, reject) {
            const msFloat =
                typeof tickValue === "number"
                    ? tickValue
                    : parseTime(tickValue);
            const ms = Math.floor(msFloat);
            const remainder = nanoRemainder(msFloat);
            let nanosTotal = nanos + remainder;
            let tickTo = clock.now + ms;

            if (msFloat < 0) {
                throw new TypeError("Negative ticks are not supported");
            }

            // adjust for positive overflow
            if (nanosTotal >= 1e6) {
                tickTo += 1;
                nanosTotal -= 1e6;
            }

            nanos = nanosTotal;
            let tickFrom = clock.now;
            let previous = clock.now;
            // ESLint fails to detect this correctly
            /* eslint-disable prefer-const */
            let timer,
                firstException,
                oldNow,
                nextPromiseTick,
                compensationCheck,
                postTimerCall;
            /* eslint-enable prefer-const */

            clock.duringTick = true;

            // perform microtasks
            oldNow = clock.now;
            runJobs(clock);
            if (oldNow !== clock.now) {
                // compensate for any setSystemTime() call during microtask callback
                tickFrom += clock.now - oldNow;
                tickTo += clock.now - oldNow;
            }

            //eslint-disable-next-line jsdoc/require-jsdoc
            function doTickInner() {
                // perform each timer in the requested range
                timer = firstTimerInRange(clock, tickFrom, tickTo);
                // eslint-disable-next-line no-unmodified-loop-condition
                while (timer && tickFrom <= tickTo) {
                    if (clock.timers[timer.id]) {
                        tickFrom = timer.callAt;
                        clock.now = timer.callAt;
                        oldNow = clock.now;
                        try {
                            runJobs(clock);
                            callTimer(clock, timer);
                        } catch (e) {
                            firstException = firstException || e;
                        }

                        if (isAsync) {
                            // finish up after native setImmediate callback to allow
                            // all native es6 promises to process their callbacks after
                            // each timer fires.
                            originalSetTimeout(nextPromiseTick);
                            return;
                        }

                        compensationCheck();
                    }

                    postTimerCall();
                }

                // perform process.nextTick()s again
                oldNow = clock.now;
                runJobs(clock);
                if (oldNow !== clock.now) {
                    // compensate for any setSystemTime() call during process.nextTick() callback
                    tickFrom += clock.now - oldNow;
                    tickTo += clock.now - oldNow;
                }
                clock.duringTick = false;

                // corner case: during runJobs new timers were scheduled which could be in the range [clock.now, tickTo]
                timer = firstTimerInRange(clock, tickFrom, tickTo);
                if (timer) {
                    try {
                        clock.tick(tickTo - clock.now); // do it all again - for the remainder of the requested range
                    } catch (e) {
                        firstException = firstException || e;
                    }
                } else {
                    // no timers remaining in the requested range: move the clock all the way to the end
                    clock.now = tickTo;

                    // update nanos
                    nanos = nanosTotal;
                }
                if (firstException) {
                    throw firstException;
                }

                if (isAsync) {
                    resolve(clock.now);
                } else {
                    return clock.now;
                }
            }

            nextPromiseTick =
                isAsync &&
                function () {
                    try {
                        compensationCheck();
                        postTimerCall();
                        doTickInner();
                    } catch (e) {
                        reject(e);
                    }
                };

            compensationCheck = function () {
                // compensate for any setSystemTime() call during timer callback
                if (oldNow !== clock.now) {
                    tickFrom += clock.now - oldNow;
                    tickTo += clock.now - oldNow;
                    previous += clock.now - oldNow;
                }
            };

            postTimerCall = function () {
                timer = firstTimerInRange(clock, previous, tickTo);
                previous = tickFrom;
            };

            return doTickInner();
        }

        /**
         * @param {string|number} tickValue number of milliseconds or a human-readable value like "01:11:15"
         * @returns {number} will return the new `now` value
         */
        clock.tick = function tick(tickValue) {
            return doTick(tickValue, false);
        };

        if (typeof _global.Promise !== "undefined") {
            /**
             * @param {string|number} tickValue number of milliseconds or a human-readable value like "01:11:15"
             * @returns {Promise}
             */
            clock.tickAsync = function tickAsync(tickValue) {
                return new _global.Promise(function (resolve, reject) {
                    originalSetTimeout(function () {
                        try {
                            doTick(tickValue, true, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            };
        }

        clock.next = function next() {
            runJobs(clock);
            const timer = firstTimer(clock);
            if (!timer) {
                return clock.now;
            }

            clock.duringTick = true;
            try {
                clock.now = timer.callAt;
                callTimer(clock, timer);
                runJobs(clock);
                return clock.now;
            } finally {
                clock.duringTick = false;
            }
        };

        if (typeof _global.Promise !== "undefined") {
            clock.nextAsync = function nextAsync() {
                return new _global.Promise(function (resolve, reject) {
                    originalSetTimeout(function () {
                        try {
                            const timer = firstTimer(clock);
                            if (!timer) {
                                resolve(clock.now);
                                return;
                            }

                            let err;
                            clock.duringTick = true;
                            clock.now = timer.callAt;
                            try {
                                callTimer(clock, timer);
                            } catch (e) {
                                err = e;
                            }
                            clock.duringTick = false;

                            originalSetTimeout(function () {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(clock.now);
                                }
                            });
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            };
        }

        clock.runAll = function runAll() {
            let numTimers, i;
            runJobs(clock);
            for (i = 0; i < clock.loopLimit; i++) {
                if (!clock.timers) {
                    resetIsNearInfiniteLimit();
                    return clock.now;
                }

                numTimers = Object.keys(clock.timers).length;
                if (numTimers === 0) {
                    resetIsNearInfiniteLimit();
                    return clock.now;
                }

                clock.next();
                checkIsNearInfiniteLimit(clock, i);
            }

            const excessJob = firstTimer(clock);
            throw getInfiniteLoopError(clock, excessJob);
        };

        clock.runToFrame = function runToFrame() {
            return clock.tick(getTimeToNextFrame());
        };

        if (typeof _global.Promise !== "undefined") {
            clock.runAllAsync = function runAllAsync() {
                return new _global.Promise(function (resolve, reject) {
                    let i = 0;
                    /**
                     *
                     */
                    function doRun() {
                        originalSetTimeout(function () {
                            try {
                                runJobs(clock);

                                let numTimers;
                                if (i < clock.loopLimit) {
                                    if (!clock.timers) {
                                        resetIsNearInfiniteLimit();
                                        resolve(clock.now);
                                        return;
                                    }

                                    numTimers = Object.keys(
                                        clock.timers,
                                    ).length;
                                    if (numTimers === 0) {
                                        resetIsNearInfiniteLimit();
                                        resolve(clock.now);
                                        return;
                                    }

                                    clock.next();

                                    i++;

                                    doRun();
                                    checkIsNearInfiniteLimit(clock, i);
                                    return;
                                }

                                const excessJob = firstTimer(clock);
                                reject(getInfiniteLoopError(clock, excessJob));
                            } catch (e) {
                                reject(e);
                            }
                        });
                    }
                    doRun();
                });
            };
        }

        clock.runToLast = function runToLast() {
            const timer = lastTimer(clock);
            if (!timer) {
                runJobs(clock);
                return clock.now;
            }

            return clock.tick(timer.callAt - clock.now);
        };

        if (typeof _global.Promise !== "undefined") {
            clock.runToLastAsync = function runToLastAsync() {
                return new _global.Promise(function (resolve, reject) {
                    originalSetTimeout(function () {
                        try {
                            const timer = lastTimer(clock);
                            if (!timer) {
                                runJobs(clock);
                                resolve(clock.now);
                            }

                            resolve(clock.tickAsync(timer.callAt - clock.now));
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            };
        }

        clock.reset = function reset() {
            nanos = 0;
            clock.timers = {};
            clock.jobs = [];
            clock.now = start;
        };

        clock.setSystemTime = function setSystemTime(systemTime) {
            // determine time difference
            const newNow = getEpoch(systemTime);
            const difference = newNow - clock.now;
            let id, timer;

            adjustedSystemTime[0] = adjustedSystemTime[0] + difference;
            adjustedSystemTime[1] = adjustedSystemTime[1] + nanos;
            // update 'system clock'
            clock.now = newNow;
            nanos = 0;

            // update timers and intervals to keep them stable
            for (id in clock.timers) {
                if (clock.timers.hasOwnProperty(id)) {
                    timer = clock.timers[id];
                    timer.createdAt += difference;
                    timer.callAt += difference;
                }
            }
        };

        /**
         * @param {string|number} tickValue number of milliseconds or a human-readable value like "01:11:15"
         * @returns {number} will return the new `now` value
         */
        clock.jump = function jump(tickValue) {
            const msFloat =
                typeof tickValue === "number"
                    ? tickValue
                    : parseTime(tickValue);
            const ms = Math.floor(msFloat);

            for (const timer of Object.values(clock.timers)) {
                if (clock.now + ms > timer.callAt) {
                    timer.callAt = clock.now + ms;
                }
            }
            clock.tick(ms);
        };

        if (isPresent.performance) {
            clock.performance = Object.create(null);
            clock.performance.now = fakePerformanceNow;
        }

        if (isPresent.hrtime) {
            clock.hrtime = hrtime;
        }

        return clock;
    }

    /* eslint-disable complexity */

    /**
     * @param {Config=} [config] Optional config
     * @returns {Clock}
     */
    function install(config) {
        if (
            arguments.length > 1 ||
            config instanceof Date ||
            Array.isArray(config) ||
            typeof config === "number"
        ) {
            throw new TypeError(
                `FakeTimers.install called with ${String(
                    config,
                )} install requires an object parameter`,
            );
        }

        if (_global.Date.isFake === true) {
            // Timers are already faked; this is a problem.
            // Make the user reset timers before continuing.
            throw new TypeError(
                "Can't install fake timers twice on the same global object.",
            );
        }

        // eslint-disable-next-line no-param-reassign
        config = typeof config !== "undefined" ? config : {};
        config.shouldAdvanceTime = config.shouldAdvanceTime || false;
        config.advanceTimeDelta = config.advanceTimeDelta || 20;
        config.shouldClearNativeTimers =
            config.shouldClearNativeTimers || false;

        if (config.target) {
            throw new TypeError(
                "config.target is no longer supported. Use `withGlobal(target)` instead.",
            );
        }

        /**
         * @param {string} timer/object the name of the thing that is not present
         * @param timer
         */
        function handleMissingTimer(timer) {
            if (config.ignoreMissingTimers) {
                return;
            }

            throw new ReferenceError(
                `non-existent timers and/or objects cannot be faked: '${timer}'`,
            );
        }

        let i, l;
        const clock = createClock(config.now, config.loopLimit);
        clock.shouldClearNativeTimers = config.shouldClearNativeTimers;

        clock.uninstall = function () {
            return uninstall(clock, config);
        };

        clock.abortListenerMap = new Map();

        clock.methods = config.toFake || [];

        if (clock.methods.length === 0) {
            clock.methods = Object.keys(timers);
        }

        if (config.shouldAdvanceTime === true) {
            const intervalTick = doIntervalTick.bind(
                null,
                clock,
                config.advanceTimeDelta,
            );
            const intervalId = _global.setInterval(
                intervalTick,
                config.advanceTimeDelta,
            );
            clock.attachedInterval = intervalId;
        }

        if (clock.methods.includes("performance")) {
            const proto = (() => {
                if (hasPerformanceConstructorPrototype) {
                    return _global.performance.constructor.prototype;
                }
                if (hasPerformancePrototype) {
                    return _global.Performance.prototype;
                }
            })();
            if (proto) {
                Object.getOwnPropertyNames(proto).forEach(function (name) {
                    if (name !== "now") {
                        clock.performance[name] =
                            name.indexOf("getEntries") === 0
                                ? NOOP_ARRAY
                                : NOOP;
                    }
                });
                // ensure `mark` returns a value that is valid
                clock.performance.mark = (name) =>
                    new FakePerformanceEntry(name, "mark", 0, 0);
                clock.performance.measure = (name) =>
                    new FakePerformanceEntry(name, "measure", 0, 100);
                // `timeOrigin` should return the time of when the Window session started
                // (or the Worker was installed)
                clock.performance.timeOrigin = getEpoch(config.now);
            } else if ((config.toFake || []).includes("performance")) {
                return handleMissingTimer("performance");
            }
        }
        if (_global === globalObject && timersModule) {
            clock.timersModuleMethods = [];
        }
        if (_global === globalObject && timersPromisesModule) {
            clock.timersPromisesModuleMethods = [];
        }
        for (i = 0, l = clock.methods.length; i < l; i++) {
            const nameOfMethodToReplace = clock.methods[i];

            if (!isPresent[nameOfMethodToReplace]) {
                handleMissingTimer(nameOfMethodToReplace);
                // eslint-disable-next-line
                continue;
            }

            if (nameOfMethodToReplace === "hrtime") {
                if (
                    _global.process &&
                    typeof _global.process.hrtime === "function"
                ) {
                    hijackMethod(_global.process, nameOfMethodToReplace, clock);
                }
            } else if (nameOfMethodToReplace === "nextTick") {
                if (
                    _global.process &&
                    typeof _global.process.nextTick === "function"
                ) {
                    hijackMethod(_global.process, nameOfMethodToReplace, clock);
                }
            } else {
                hijackMethod(_global, nameOfMethodToReplace, clock);
            }
            if (
                clock.timersModuleMethods !== undefined &&
                timersModule[nameOfMethodToReplace]
            ) {
                const original = timersModule[nameOfMethodToReplace];
                clock.timersModuleMethods.push({
                    methodName: nameOfMethodToReplace,
                    original: original,
                });
                timersModule[nameOfMethodToReplace] =
                    _global[nameOfMethodToReplace];
            }
            if (clock.timersPromisesModuleMethods !== undefined) {
                if (nameOfMethodToReplace === "setTimeout") {
                    clock.timersPromisesModuleMethods.push({
                        methodName: "setTimeout",
                        original: timersPromisesModule.setTimeout,
                    });

                    timersPromisesModule.setTimeout = (
                        delay,
                        value,
                        options = {},
                    ) =>
                        new Promise((resolve, reject) => {
                            const abort = () => {
                                options.signal.removeEventListener(
                                    "abort",
                                    abort,
                                );
                                clock.abortListenerMap.delete(abort);

                                // This is safe, there is no code path that leads to this function
                                // being invoked before handle has been assigned.
                                // eslint-disable-next-line no-use-before-define
                                clock.clearTimeout(handle);
                                reject(options.signal.reason);
                            };

                            const handle = clock.setTimeout(() => {
                                if (options.signal) {
                                    options.signal.removeEventListener(
                                        "abort",
                                        abort,
                                    );
                                    clock.abortListenerMap.delete(abort);
                                }

                                resolve(value);
                            }, delay);

                            if (options.signal) {
                                if (options.signal.aborted) {
                                    abort();
                                } else {
                                    options.signal.addEventListener(
                                        "abort",
                                        abort,
                                    );
                                    clock.abortListenerMap.set(
                                        abort,
                                        options.signal,
                                    );
                                }
                            }
                        });
                } else if (nameOfMethodToReplace === "setImmediate") {
                    clock.timersPromisesModuleMethods.push({
                        methodName: "setImmediate",
                        original: timersPromisesModule.setImmediate,
                    });

                    timersPromisesModule.setImmediate = (value, options = {}) =>
                        new Promise((resolve, reject) => {
                            const abort = () => {
                                options.signal.removeEventListener(
                                    "abort",
                                    abort,
                                );
                                clock.abortListenerMap.delete(abort);

                                // This is safe, there is no code path that leads to this function
                                // being invoked before handle has been assigned.
                                // eslint-disable-next-line no-use-before-define
                                clock.clearImmediate(handle);
                                reject(options.signal.reason);
                            };

                            const handle = clock.setImmediate(() => {
                                if (options.signal) {
                                    options.signal.removeEventListener(
                                        "abort",
                                        abort,
                                    );
                                    clock.abortListenerMap.delete(abort);
                                }

                                resolve(value);
                            });

                            if (options.signal) {
                                if (options.signal.aborted) {
                                    abort();
                                } else {
                                    options.signal.addEventListener(
                                        "abort",
                                        abort,
                                    );
                                    clock.abortListenerMap.set(
                                        abort,
                                        options.signal,
                                    );
                                }
                            }
                        });
                } else if (nameOfMethodToReplace === "setInterval") {
                    clock.timersPromisesModuleMethods.push({
                        methodName: "setInterval",
                        original: timersPromisesModule.setInterval,
                    });

                    timersPromisesModule.setInterval = (
                        delay,
                        value,
                        options = {},
                    ) => ({
                        [Symbol.asyncIterator]: () => {
                            const createResolvable = () => {
                                let resolve, reject;
                                const promise = new Promise((res, rej) => {
                                    resolve = res;
                                    reject = rej;
                                });
                                promise.resolve = resolve;
                                promise.reject = reject;
                                return promise;
                            };

                            let done = false;
                            let hasThrown = false;
                            let returnCall;
                            let nextAvailable = 0;
                            const nextQueue = [];

                            const handle = clock.setInterval(() => {
                                if (nextQueue.length > 0) {
                                    nextQueue.shift().resolve();
                                } else {
                                    nextAvailable++;
                                }
                            }, delay);

                            const abort = () => {
                                options.signal.removeEventListener(
                                    "abort",
                                    abort,
                                );
                                clock.abortListenerMap.delete(abort);

                                clock.clearInterval(handle);
                                done = true;
                                for (const resolvable of nextQueue) {
                                    resolvable.resolve();
                                }
                            };

                            if (options.signal) {
                                if (options.signal.aborted) {
                                    done = true;
                                } else {
                                    options.signal.addEventListener(
                                        "abort",
                                        abort,
                                    );
                                    clock.abortListenerMap.set(
                                        abort,
                                        options.signal,
                                    );
                                }
                            }

                            return {
                                next: async () => {
                                    if (options.signal?.aborted && !hasThrown) {
                                        hasThrown = true;
                                        throw options.signal.reason;
                                    }

                                    if (done) {
                                        return { done: true, value: undefined };
                                    }

                                    if (nextAvailable > 0) {
                                        nextAvailable--;
                                        return { done: false, value: value };
                                    }

                                    const resolvable = createResolvable();
                                    nextQueue.push(resolvable);

                                    await resolvable;

                                    if (returnCall && nextQueue.length === 0) {
                                        returnCall.resolve();
                                    }

                                    if (options.signal?.aborted && !hasThrown) {
                                        hasThrown = true;
                                        throw options.signal.reason;
                                    }

                                    if (done) {
                                        return { done: true, value: undefined };
                                    }

                                    return { done: false, value: value };
                                },
                                return: async () => {
                                    if (done) {
                                        return { done: true, value: undefined };
                                    }

                                    if (nextQueue.length > 0) {
                                        returnCall = createResolvable();
                                        await returnCall;
                                    }

                                    clock.clearInterval(handle);
                                    done = true;

                                    if (options.signal) {
                                        options.signal.removeEventListener(
                                            "abort",
                                            abort,
                                        );
                                        clock.abortListenerMap.delete(abort);
                                    }

                                    return { done: true, value: undefined };
                                },
                            };
                        },
                    });
                }
            }
        }

        return clock;
    }

    /* eslint-enable complexity */

    return {
        timers: timers,
        createClock: createClock,
        install: install,
        withGlobal: withGlobal,
    };
}

/**
 * @typedef {object} FakeTimers
 * @property {Timers} timers
 * @property {createClock} createClock
 * @property {Function} install
 * @property {withGlobal} withGlobal
 */

/* eslint-enable complexity */

/** @type {FakeTimers} */
const defaultImplementation = withGlobal(globalObject);

exports.timers = defaultImplementation.timers;
exports.createClock = defaultImplementation.createClock;
exports.install = defaultImplementation.install;
exports.withGlobal = withGlobal;
