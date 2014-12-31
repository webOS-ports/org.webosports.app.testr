/* Geolocation.js - panel for manual tests of LuneOS/webOS geolocation API
 * 
 */

enyo.kind({
	name: "Geolocation",
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
				{style: "padding: 35px 10% 35px 10%;", components: [
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
						{kind: "onyx.Button", style: "width: 100%", content: $L("getCurrentPosition"), ontap: "singleLocation"},
						{name: "singleOut", content: " &nbsp; ", allowHtml: true, style: "padding: 5px; color: white"}
					]}
				]}
			]
		},
		
		{
			name: "singleLocationService",
			kind: "PalmService",
			service: "palm://com.palm.location/",
			method: "getCurrentPosition",
			subscribe: false,
			resubscribe: false,
			onResponse: "singleLocationSuccess",
			onError: "singleLocationFail"
		}
	],
		
	singleLocation: function (inSender, inEvent) {
		this.log("accuracy: ", typeof this.$.accuracyPckr.getSelected().value, this.$.accuracyPckr.getSelected().value,
				"   max age: ", typeof parseInt(this.$.ageInpt.getValue(), 10), parseInt(this.$.ageInpt.getValue(), 10),
				"   response time: ", typeof this.$.responseTimePckr.getSelected().value, this.$.responseTimePckr.getSelected().value);
		this.$.singleLocationService.send({accuracy: this.$.accuracyPckr.getSelected().value, maximumAge: parseInt(this.$.ageInpt.getValue(), 10), responseTime: this.$.responseTimePckr.getSelected().value});
		this.$.singleOut.setContent($L("position requested..."));
	},
	singleLocationSuccess: function (inSender, inEvent) {
		this.log(inEvent);
		this.$.singleOut.setContent($L("position returned: ") + JSON.stringify(inEvent.data, 
				["altitude", "heading", "horizAccuracy", "latitude", "longitude", "timestamp", "velocity", "vertAccuracy"], 1));
	},
	singleLocationFail: function (inSender, inEvent) {
		this.log(inEvent);
		this.$.singleOut.setContent(
				this.errorCodes[inEvent.data.errorCode] + "<br>" +
				"errorCode: " + inEvent.data.errorCode + "<br>" + 
				"errorText: " + inEvent.data.errorText);
	},
	errorCodes: ["Success", "Timeout", "Position_Unavailable", "Unknown", 
	             "GPS_Permanent_Error - No GPS fix but can still get the cell and Wifi fixes. A TouchPad without GPS returns this error.", 
	             "LocationServiceOFF - No Location source available. Both Google and GPS are off.", 
	             "Permission Denied - The user has not accepted the terms of use for the Google Location Service, or the Google Service is off.", 
	             "The application already has a pending message ", 
	             "The application has been temporarily blacklisted. (The user is not allowing this application to use this service.)"]
});
