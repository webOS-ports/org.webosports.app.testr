enyo.depends(
	"$lib/layout",
	"$lib/onyx",	// To theme Onyx using Theme.less, change this line to $lib/onyx/source,
	//"Theme.less",	// uncomment this line, and follow the steps described in Theme.less
	"$lib/enyo-webos",
	"$lib/webos-lib",
	"$lib/more-arrangers",
	//Main App
	"App.css",
	"App.js",
	//Test Panels
	"Html5Audio.js",
	"Telephony.js",
	"Windowing.js",
	"Receiver.js",
	"Subscriptions.js",
	"Notifications.js",
	"Geolocation.js",
	"ResponsiveImg.js"
);
