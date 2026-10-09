/* Geolocation.js - panel for manual tests of LuneOS/webOS geolocation API & HTML5 geolocation API
 * 
 */

enyo.kind({
	name: "Geolocation2",
	layoutKind: "FittableRowsLayout",
	components: [
	    { kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
	         {fit: true, content: $L("Geolocation")}
	    ]},
		{
			fit: true,
			kind: "Scroller",
			touch: true,
			horizontal: "hidden",
			components: [
				{style: "margin-left: auto; margin-right: auto; max-width: 35em; padding: 1rem;", components: [
					{content: "luna://com.webos.service.location", style: "color: white; font-weight: bold;"},
					{name: "handlersOut", content: $L("handlers: asking..."), allowHtml: true, style: "color: white; margin-top: 0.5rem;"},
				    {kind: "FittableColumns", style: "margin-top: 1rem;", components: [
   				        {content: $L("Handler: "), style: "color: white; line-height: 2.5rem;"},
					    {kind: "onyx.PickerDecorator", style: "margin-left: 1rem;", components: [
					        {},   // PickerButton
					        {name: "handlerPckr", kind: "onyx.Picker", components: [
					            {content: "hybrid", value: "hybrid", active: true},
					            {content: "gps", value: "gps"},
					            {content: "network", value: "network"},
					            {content: "passive", value: "passive"}
					        ]}
					    ]}
   				    ]},
				    {kind: "FittableColumns", style: "margin-top: 1rem;", components: [
   				        {content: $L("Response timeout: "), style: "color: white; line-height: 2rem;"},
   					    {kind: "onyx.InputDecorator", style: "margin-left: 1rem;", components: [
    				        {name: "responseTimeoutInpt", kind: "onyx.Input", type: "number", value: "30", attributes: {min: "0", step: "1"}, style: "width: 5rem;"}
    				    ]},
   				        {content: $L("sec. (0 = none)"), style: "color: white; line-height: 2rem; margin-left: 1rem;"}
				    ]},
				    {kind: "FittableColumns", style: "margin-top: 1rem;", components: [
   				        {content: $L("Cached max age: "), style: "color: white; line-height: 2rem;"},
   					    {kind: "onyx.InputDecorator", style: "margin-left: 1rem;", components: [
    				        {name: "cachedAgeInpt", kind: "onyx.Input", type: "number", value: "0", attributes: {min: "0", step: "1"}, style: "width: 5rem;"}
    				    ]},
   				        {content: $L("sec. (0 = any)"), style: "color: white; line-height: 2rem; margin-left: 1rem;"}
				    ]},
					{kind: "onyx.Groupbox", style: "margin-top: 1rem;", components: [
						{kind: "onyx.Button", style: "width: 100%", content: $L("getLocationUpdates (first fix)"), ontap: "firstFix"},
						{kind: "onyx.Button", style: "width: 100%; margin-top: 0.5rem;", content: $L("getCachedPosition"), ontap: "cachedPosition"},
						{name: "singleOut", content: " &nbsp; ", allowHtml: true, style: "padding: 5px; color: white"}
					]},
					{content: $L("Mock position (network provider; needs network location on). Pushed while a request is running."),
						style: "color: white; margin-top: 1rem;"},
				    {kind: "FittableColumns", style: "margin-top: 0.5rem;", components: [
   				        {content: $L("lat "), style: "color: white; line-height: 2rem;"},
   					    {kind: "onyx.InputDecorator", style: "margin-left: 0.5rem;", components: [
    				        {name: "mockLatInpt", kind: "onyx.Input", type: "number", value: "52.3702", attributes: {step: "any"}, style: "width: 6rem;"}
    				    ]},
   				        {content: $L("long "), style: "color: white; line-height: 2rem; margin-left: 1rem;"},
   					    {kind: "onyx.InputDecorator", style: "margin-left: 0.5rem;", components: [
    				        {name: "mockLongInpt", kind: "onyx.Input", type: "number", value: "4.8952", attributes: {step: "any"}, style: "width: 6rem;"}
    				    ]}
				    ]},
					{kind: "onyx.Groupbox", style: "margin-top: 0.5rem;", components: [
						{kind: "onyx.Button", style: "width: 100%", content: $L("mock/enable network"), ontap: "enableMock"},
						{kind: "onyx.Button", style: "width: 100%; margin-top: 0.5rem;", content: $L("mock/setLocation now"), ontap: "pushMockNow"},
						{kind: "onyx.Button", style: "width: 100%; margin-top: 0.5rem;", content: $L("mock/disable network"), ontap: "disableMock"},
						{name: "mockOut", content: " &nbsp; ", allowHtml: true, style: "padding: 5px; color: white"}
					]}
				]},
				{tag: "hr"},
				{style: "margin-left: auto; margin-right: auto; max-width: 35em; padding: 1rem;", components: [
				    {kind: "FittableColumns", components: [
				        {content: $L("High accuracy"), fit: true, style: "color: white; line-height: 2rem;"},
						{name: "highAccuracyTgl", kind: "onyx.ToggleButton"}
					]},
				    {kind: "FittableColumns", style: "margin-top: 1rem;", components: [
      				        {content: $L("Max age: "), style: "color: white; line-height: 2rem;"},
      					    {kind: "onyx.InputDecorator", style: "margin-left: 1rem;", components: [
       				            {name: "html5AgeInpt", kind: "onyx.Input", type: "number", value: "0", attributes: {min: "0", step: "1"}, style: "width: 5rem;"}
       				        ]},
      				        {content: $L("sec."), style: "color: white; line-height: 2rem; margin-left: 1rem;"}
   				    ]},
				    {kind: "FittableColumns", style: "margin-top: 1rem;", components: [
     				        {content: $L("Timeout: "), style: "color: white; line-height: 2rem;"},
     					    {kind: "onyx.InputDecorator", style: "margin-left: 1rem;", components: [
      				            {name: "timeout", kind: "onyx.Input", type: "number", value: "0", attributes: {min: "0", step: "1"}, style: "width: 5rem;"}
      				        ]},
     				        {content: $L("sec."), style: "color: white; line-height: 2rem; margin-left: 1rem;"}
  				    ]},
   					{kind: "onyx.Groupbox", style: "margin-top: 1rem;", components: [
 						{kind: "onyx.Button", style: "width: 100%", content: $L("HTML5 getCurrentPosition"), ontap: "html5CurrentLocation"},
 						{name: "html5Out", content: " \xa0 ", allowHtml: true, style: "padding: 5px; color: white"}
 					]}
				]}
			]
		},
		
		{
			name: "updatesService",
			kind: "LunaService",
			service: LocationService.service,
			method: "getLocationUpdates",
			subscribe: true,
			resubscribe: false,
			onResponse: "firstFixResponse",
			onError: "firstFixError"
		},
		{
			name: "handlersService",
			kind: "LunaService",
			service: LocationService.service,
			method: "getAllLocationHandlers",
			subscribe: true,
			resubscribe: false,
			onResponse: "handlersResponse",
			onError: "handlersError"
		}
	],

	// Whether this panel turned the network mock provider on.
	mockEnabled: false,

	create: function () {
		this.inherited(arguments);
		this.$.handlersService.send({subscribe: true});
	},

	handlersResponse: function (inSender, inEvent) {
		var handlers = inEvent.handlers || [];
		var parts = [];
		var anyOn = false;
		for (var i = 0; i < handlers.length; i++) {
			parts.push(handlers[i].name + ": " + (handlers[i].state ? "on" : "off"));
			anyOn = anyOn || handlers[i].state;
		}
		var msg = $L("handlers: ") + parts.join(", ");
		if (!anyOn) {
			msg += "<br>" + $L("Location is switched off: turn on GPS or network location in Settings &rarr; Location.");
		}
		this.$.handlersOut.setContent(msg);
	},
	handlersError: function (inSender, inEvent) {
		this.$.handlersOut.setContent($L("getAllLocationHandlers failed:") + "<br>" + LocationService.describeError(inEvent));
	},

	/*
	 * com.webos.service.location has no getCurrentPosition. A single position
	 * is a getLocationUpdates subscription that is cancelled once the first
	 * fix arrives.
	 */
	firstFix: function (inSender, inEvent) {
		this.stopFirstFix();
		var params = {subscribe: true, Handler: this.$.handlerPckr.getSelected().value};
		var timeout = parseInt(this.$.responseTimeoutInpt.getValue(), 10);
		if (timeout > 0) {
			params.responseTimeout = timeout;
		}
		this.log(params);
		this.$.singleOut.setContent($L("requesting position... ") + JSON.stringify(params));
		this.fixRequest = this.$.updatesService.send(params);
		if (this.mockEnabled) {
			// setLocation only takes while a request is running.
			this.pushMock(5);
		}
	},
	stopFirstFix: function () {
		if (this.fixRequest) {
			this.fixRequest.cancel();
			this.fixRequest = null;
		}
	},
	firstFixResponse: function (inSender, inEvent) {
		this.log(inEvent);
		if (inEvent.originator !== this.fixRequest || inEvent.latitude === undefined) {
			return;
		}
		this.stopFirstFix();
		this.$.singleOut.setContent($L("position returned:") + "<br>" + LocationService.describePosition(inEvent));
	},
	firstFixError: function (inSender, inEvent) {
		this.log(inEvent);
		if (inEvent.originator === this.fixRequest) {
			this.fixRequest = null;
		}
		this.$.singleOut.setContent(LocationService.describeError(inEvent));
	},

	cachedPosition: function (inSender, inEvent) {
		var params = {Handler: this.$.handlerPckr.getSelected().value};
		var maxAge = parseInt(this.$.cachedAgeInpt.getValue(), 10);
		if (maxAge > 0) {
			params.maximumAge = maxAge * 1000;   // milliseconds
		}
		this.$.singleOut.setContent($L("requesting cached position... ") + JSON.stringify(params));
		var request = new enyo.ServiceRequest({service: LocationService.service, method: "getCachedPosition"});
		request.response(this, function (inRequest, inResponse) {
			this.$.singleOut.setContent($L("cached position:") + "<br>" + LocationService.describePosition(inResponse));
		});
		request.error(this, function (inRequest, inResponse) {
			this.$.singleOut.setContent(LocationService.describeError(inResponse));
		});
		request.go(params);
	},

	callMock: function (method, params, onSuccess) {
		var request = new enyo.ServiceRequest({service: LocationService.service, method: "mock/" + method});
		request.response(this, function (inRequest, inResponse) {
			this.$.mockOut.setContent("mock/" + method + ": " + LocationService.describeError(inResponse));
			if (onSuccess) {
				onSuccess.call(this, inResponse);
			}
		});
		request.error(this, function (inRequest, inResponse) {
			this.$.mockOut.setContent("mock/" + method + " failed:<br>" + LocationService.describeError(inResponse));
			if (inResponse.errorCode === LocationService.NOT_STARTED && this.mockRetries > 0) {
				this.mockRetries--;
				this.startJob("pushMock", "sendMockLocation", 1000);
			}
		});
		request.go(params);
	},
	enableMock: function (inSender, inEvent) {
		this.callMock("enable", {name: "network"}, function () {
			this.mockEnabled = true;
		});
	},
	disableMock: function (inSender, inEvent) {
		this.stopJob("pushMock");
		this.callMock("disable", {name: "network"}, function () {
			this.mockEnabled = false;
		});
	},
	pushMockNow: function (inSender, inEvent) {
		this.pushMock(0);
	},
	// Sends the mock position, retrying while the request it is meant for
	// has not started yet (errorCode 18).
	pushMock: function (retries) {
		this.mockRetries = retries;
		this.startJob("pushMock", "sendMockLocation", retries > 0 ? 1000 : 0);
	},
	sendMockLocation: function () {
		this.callMock("setLocation", {
			name: "network",
			location: {
				latitude: parseFloat(this.$.mockLatInpt.getValue()),
				longitude: parseFloat(this.$.mockLongInpt.getValue()),
				horizAccuracy: 25
			}
		});
	},

     html5CurrentLocation: function (inSender, inEvent) {
    	 var panel = this;
    	 var options = {
    		 enableHighAccuracy: this.$.highAccuracyTgl.get("value"),
    		 maximumAge: Number(this.$.html5AgeInpt.get("value"), 10) * 1000
    	 };
    	 if (this.$.timeout.get("value") > 0) {
    		 options.timeout = Number(this.$.timeout.get("value"), 10) * 1000;
    	 }
    	 this.log(options);
    	 navigator.geolocation.getCurrentPosition(html5Success, html5Error, options);
    	 panel.$.html5Out.setContent($L("requesting position..."));
    	 
         function html5Success (position) {
        	 var msg = "latitude: " + position.coords.latitude + "°" +
		 	 		"<br>longitude: " + position.coords.longitude + "°" +
        	 		"<br>altitude: " + (typeof position.coords.altitude === "number" ? position.coords.altitude + " m" : position.coords.altitude) +
	 				"<br>accuracy: " + position.coords.accuracy + " m" +
        	 		"<br>heading: " + (typeof position.coords.heading === "number" ? position.coords.heading + "°" : position.coords.heading) +
        		 	"<br>timestamp: " +  Date(position.timestamp);
        	 panel.log(msg);
//        	 panel.log("position:", position, position.coords, position.coords.latitude, position.coords.longitude);
        	 panel.$.html5Out.setContent(msg);
         }
         
		function html5Error(error) {
			var msg = "code: " + error.code + "<br>" + "message: " + error.message;
        	if (panel.html5ErrorCodes[error.code]) {
        		msg = panel.html5ErrorCodes[error.code] + "<br>" + msg;
        	}
        	panel.error(msg);
			panel.$.html5Out.setContent(msg);
		}
     },
     html5ErrorCodes: ["", "PERMISSION_DENIED", "POSITION_UNAVAILABLE", "TIMEOUT"]
});
