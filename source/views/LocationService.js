/* LocationService.js - what the location test panels share about com.webos.service.location
 *
 * The location service on LuneOS is OSE's com.webos.service.location. The
 * services Testr used to call, org.webosports.service.location and
 * com.palm.location, do not exist on current images.
 *
 * errorTexts is the service's own table (mapLocErrorText in
 * src/lunaIpc/LunaLocationServiceUtil.cpp), indexed by errorCode; the service
 * sends the same text as errorText, this keeps it readable when it does not.
 */

var LocationService = {
	service: "luna://com.webos.service.location",

	errorTexts: [
		"Success",
		"Time out",
		"Position not available",
		"Unknown error",
		"Gps not supported",
		"Location source is off",
		"Request pending",
		"Application is blacklisted",
		"Handler start failure",
		"State unknown",
		"Invalid input",
		"No internet connection",
		"Wifi is not turned on",
		"Out of memory",
		"Too many geofences are added",
		"Geofence id already exists",
		"Geofence id unknown",
		"Geofence invalid transition",
		"Location determination was not started",
		"Mock location was not enabled",
		"Unknown mock location provider name was supplied",
		"Failed to read the WSP Configuration file",
		"Failed to get the WSP name in conf file",
		"Failed to get the WSP API Key in conf file",
		"Failed to get the WSP service list in conf file",
		"Failed to get the WSP supported features list in conf file",
		"Failed to get the WSP feature's URL in conf file",
		"Location data source not present"
	],

	// errorCode 5: both the gps and the network handler are switched off.
	LOCATION_OFF: 5,
	// errorCode 18: mock/setLocation while no location request is running.
	NOT_STARTED: 18,

	describeError: function (response) {
		var code = response.errorCode;
		var msg = "errorCode: " + code + "<br>errorText: " +
			(response.errorText || this.errorTexts[code] || "(none)");
		if (code === this.LOCATION_OFF) {
			msg += "<br>Location is switched off: turn on GPS or network location in Settings &rarr; Location" +
				" (or use the mock position below).";
		}
		return msg;
	},

	describePosition: function (response) {
		return "latitude: " + response.latitude + "&deg;" +
			"<br>longitude: " + response.longitude + "&deg;" +
			"<br>altitude: " + response.altitude + " m" +
			"<br>horizAccuracy: " + response.horizAccuracy + " m" +
			"<br>vertAccuracy: " + response.vertAccuracy + " m" +
			"<br>speed: " + response.speed + " m/s" +
			"<br>direction: " + response.direction + "&deg;" +
			"<br>timestamp: " + new Date(response.timestamp);
	}
};
