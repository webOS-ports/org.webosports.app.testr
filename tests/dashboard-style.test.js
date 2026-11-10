// Checks that the dashboard is drawn as a tablet's row or a phone's pill by
// the shell's notificationStyle, and by TabletUi or else the window's shape
// only for "auto". Run with: node tests/dashboard-style.test.js
//
// source/views/Dashboard.js is loaded into a sandbox with just enough of
// enyo to capture the kind it declares; its methods are then called on a
// fake instance, and the preference request is answered as the system
// service would.
"use strict";
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function load(opts) {
	opts = opts || {};
	let def = null;
	const requests = [];
	const listeners = {};
	const sandbox = {
		window: {
			innerWidth: opts.width || 720,
			innerHeight: opts.height || 90,
			addEventListener: (name, fn) => { listeners[name] = fn; },
			removeEventListener: (name) => { delete listeners[name]; },
		},
		enyo: {
			kind: (d) => { def = d; },
			bind: (obj, name) => (...args) => obj[name](...args),
			ServiceRequest: function (props) {
				const req = { props, cancelled: false };
				this.response = (owner, name) => { req.answer = (r) => owner[name](this, r); };
				this.go = (params) => { req.params = params; };
				this.cancel = () => { req.cancelled = true; };
				requests.push(req);
			},
		},
		$L: (s) => s,
	};
	if (opts.deviceInfo !== undefined) {
		sandbox.PalmSystem = { deviceInfo: JSON.stringify(opts.deviceInfo) };
		sandbox.window.PalmSystem = sandbox.PalmSystem;
	}
	vm.createContext(sandbox);
	const src = fs.readFileSync(path.join(__dirname, "..", "source", "views", "Dashboard.js"), "utf8");
	vm.runInContext(src, sandbox);
	sandbox.Dashboard = def.statics;

	const classes = new Set();
	const obj = Object.assign(Object.create(def), {
		tall: !!opts.tall,
		addRemoveClass: (c, on) => { if (on) classes.add(c); else classes.delete(c); },
		inherited: () => {},
	});
	obj.followShellStyle();
	return {
		obj, requests, listeners, sandbox,
		tablet: () => classes.has("testr-dashboard-tablet"),
	};
}

let failed = 0;
function test(name, fn) {
	try { fn(); console.log("ok   " + name); }
	catch (e) { failed++; console.log("FAIL " + name + "\n     " + e.message); }
}

test("asks for notificationStyle and keeps listening", () => {
	const t = load({ deviceInfo: {} });
	assert.strictEqual(t.requests.length, 1);
	assert.strictEqual(t.requests[0].props.method, "getPreferences");
	assert.strictEqual(t.requests[0].props.subscribe, true);
	assert.strictEqual(JSON.stringify(t.requests[0].params.keys), JSON.stringify(["notificationStyle"]));
});

test("tablet style at the bottom: a screen-wide row is still a tablet's", () => {
	const t = load({ width: 720, height: 90, deviceInfo: {} });
	assert.strictEqual(t.tablet(), false, "before the answer, the shape: a phone's");
	t.requests[0].answer({ notificationStyle: "tablet" });
	assert.strictEqual(t.tablet(), true);
});

test("phone style in the drop-down: a tablet's shape is still a phone's pill", () => {
	const t = load({ width: 480, height: 90, deviceInfo: {} });
	assert.strictEqual(t.tablet(), true, "before the answer, the shape: a tablet's");
	t.requests[0].answer({ notificationStyle: "phone" });
	assert.strictEqual(t.tablet(), false);
});

test("a tall one follows the style too, whatever the screen", () => {
	const t = load({ tall: true, width: 480, height: 300,
	                 deviceInfo: { screenWidth: 720, screenHeight: 720 } });
	assert.strictEqual(t.tablet(), true, "before the answer: a 600px screen is a tablet's");
	t.requests[0].answer({ notificationStyle: "phone" });
	assert.strictEqual(t.tablet(), false);
	const s = load({ tall: true, width: 480, height: 300,
	                 deviceInfo: { screenWidth: 1080, screenHeight: 2340 } });
	s.requests[0].answer({ notificationStyle: "tablet" });
	assert.strictEqual(s.tablet(), true);
});

test("auto follows TabletUi when WebAppMgr says it", () => {
	const phone = load({ width: 480, height: 90, deviceInfo: { tabletUi: false } });
	phone.requests[0].answer({ notificationStyle: "auto" });
	assert.strictEqual(phone.tablet(), false);
	const tablet = load({ width: 720, height: 90, deviceInfo: { tabletUi: true } });
	tablet.requests[0].answer({ notificationStyle: "auto" });
	assert.strictEqual(tablet.tablet(), true);
});

test("auto without TabletUi, or anything not on offer: the shape", () => {
	for (const style of ["auto", "watch", 3]) {
		const wide = load({ width: 720, height: 90, deviceInfo: {} });
		wide.requests[0].answer({ notificationStyle: style });
		assert.strictEqual(wide.tablet(), false, String(style) + " wide");
		const narrow = load({ width: 480, height: 90, deviceInfo: {} });
		narrow.requests[0].answer({ notificationStyle: style });
		assert.strictEqual(narrow.tablet(), true, String(style) + " narrow");
	}
});

test("a change in Settings comes through, and a reply without the key changes nothing", () => {
	const t = load({ deviceInfo: {} });
	t.requests[0].answer({ notificationStyle: "tablet" });
	assert.strictEqual(t.tablet(), true);
	t.requests[0].answer({ returnValue: true, subscribed: true });
	assert.strictEqual(t.tablet(), true);
	t.requests[0].answer({ notificationStyle: "phone" });
	assert.strictEqual(t.tablet(), false);
});

test("a resize is looked at again", () => {
	const t = load({ width: 480, height: 90, deviceInfo: {} });
	assert.strictEqual(t.tablet(), true);
	t.sandbox.window.innerWidth = 720;
	t.listeners.resize();
	assert.strictEqual(t.tablet(), false);
});

test("going away cancels the subscription and the resize listener", () => {
	const t = load({ deviceInfo: {} });
	t.obj.destroy();
	assert.strictEqual(t.requests[0].cancelled, true);
	assert.strictEqual(t.listeners.resize, undefined);
});

if (failed) {
	console.log(failed + " failed");
	process.exit(1);
}
console.log("all passed");
