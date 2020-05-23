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
				    {kind: "FittableColumns", components: [
   				        {content: $L("Accuracy: "), style: "color: white; line-height: 2.5rem;"},
					    {kind: "onyx.PickerDecorator", style: "margin-left: 1rem;", components: [
					        {},   // PickerButton
					        {name: "accuracyPckr", kind: "onyx.Picker", components: [
					            {content: $L("High (1)"), value: 1},
					            {content: $L("Medium (2)"), active: true, value: 2},
					            {content: $L("Low (3)"), value: 3}
					        ]}
					    ]}
   				    ]},
				    {kind: "FittableColumns", style: "margin-top: 1rem;", components: [
   				        {content: $L("Max age: "), style: "color: white; line-height: 2rem;"},
   					    {kind: "onyx.InputDecorator", style: "margin-left: 1rem;", components: [
    				        {name: "ageInpt", kind: "onyx.Input", type: "number", value: "0", attributes: {min: "0", step: "1"}, style: "width: 5rem;"}
    				    ]},
   				        {content: $L("sec."), style: "color: white; line-height: 2rem; margin-left: 1rem;"}
				    ]},
				    {kind: "FittableColumns", style: "margin-top: 1rem;", components: [
				        {content: $L("Response time: "), style: "color: white; line-height: 2.5rem;"},
					    {kind: "onyx.PickerDecorator", style: "margin-left: 1rem;", components: [
					        {},   // PickerButton
					        {name: "responseTimePckr", kind: "onyx.Picker", components: [
					            {content: $L("< 5 sec (1)"), value: 1},
					            {content: $L("5–20 sec (2)"), active: true, value: 2},
					            {content: $L("> 20 sec (3)"), value: 3}
					        ]}
					    ]}
					]},
					{kind: "onyx.Groupbox", style: "margin-top: 1rem;", components: [
						{kind: "onyx.Button", style: "width: 100%", content: $L("PalmBus (priv.) getCurrentPosition"), ontap: "singleLocation"},
						{name: "singleOut", content: " &nbsp; ", allowHtml: true, style: "padding: 5px; color: white"}
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
			name: "singleLocationService",
			kind: "LunaService",
			service: "palm://org.webosports.service.location/",
			method: "getCurrentPosition",
			subscribe: false,
			resubscribe: false,
			onResponse: "singleLocationSuccess",
			onError: "singleLocationFail"
		}
	],
		
	singleLocation: function (inSender, inEvent) {
		this.$.singleOut.setContent($L("requesting position..."));
		this.log("accuracy: ", typeof this.$.accuracyPckr.getSelected().value, this.$.accuracyPckr.getSelected().value,
				"   max age: ", typeof parseInt(this.$.ageInpt.getValue(), 10), parseInt(this.$.ageInpt.getValue(), 10),
				"   response time: ", typeof this.$.responseTimePckr.getSelected().value, this.$.responseTimePckr.getSelected().value);
		this.$.singleLocationService.send({accuracy: this.$.accuracyPckr.getSelected().value, maximumAge: parseInt(this.$.ageInpt.getValue(), 10), responseTime: this.$.responseTimePckr.getSelected().value});
	},
	singleLocationSuccess: function (inSender, inEvent) {
		this.log(inEvent);
		this.$.singleOut.setContent($L("position returned: ") + JSON.stringify(inEvent, 
				["altitude", "heading", "horizAccuracy", "latitude", "longitude", "timestamp", "velocity", "vertAccuracy"], 1));
	},
	singleLocationFail: function (inSender, inEvent) {
		this.log(inEvent);
		var errorCode = inEvent.errorCode;
		var errorText = inEvent.errorText;
		var msg = "errorCode: " + errorCode + "<br>" + 
				"errorText: " + errorText;
		if (this.errorCodes[errorCode]) {
			msg = this.errorCodes[errorCode] + "<br>" + msg;
		}
		this.$.singleOut.setContent(msg);
	},
	errorCodes: ["Success", "Timeout", "Position_Unavailable", "Unknown", 
	             "GPS_Permanent_Error - No GPS fix but can still get the cell and Wifi fixes. A TouchPad without GPS returns this error.", 
	             "LocationServiceOFF - No Location source available. Both Google and GPS are off.", 
	             "Permission Denied - The user has not accepted the terms of use for the Google Location Service, or the Google Service is off.", 
	             "The application already has a pending message ", 
	             "The application has been temporarily blacklisted. (The user is not allowing this application to use this service.)"],

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
