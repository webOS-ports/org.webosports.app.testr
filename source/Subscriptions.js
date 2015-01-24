/* Subscriptions.js - panel for manual tests of PalmBus subscriptions for LuneOS
 * 
 * subscribeGetPrefs() subscribes to luna://com.palm.systemservice/getPreferences for showAlertsWhenLocked, then uses setInterval to repeatedly change it.  
 * It thus continues to call setPreferences regardless of whether the subscription is still working.
 *
 * subscribeWatch() calls luna://com.palm.db/find with watch:true. This immediately returns results, 
 * and should later return a single NotificationResponse if the results change. 
 * It does not return repeated updates like getPreferences.   
 * When find results are returned, the test uses setTimeout to later put another object to DB8.  
 * This should trigger the NotificationResponse.  When a NotificationResponse is received, the test issues another find. 
 * Thus, if/when the NotificationResponse is not received, the cycle is broken and no more objects are put.
 * 
 * subscribeGeo() subscribes to geolocation updates using PalmService
 */

enyo.kind({
	name: "Subscriptions",
	layoutKind: "FittableRowsLayout",
	components: [
	    { kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
	         {fit: true, content: $L("Subscriptions")},
             {content: $L("interv.")},
	         {kind: 'onyx.InputDecorator', components: [
	         	 {name: "intervalInput", kind: "onyx.Input", type: "number", attributes: {min: 1}, style: "width: 2.5em;", value: 9}
	         ]},
             {content: $L("s")},
	         {kind: "Button", content: $L("Start"), ontap: "startRequests"}
	    ]},
	    {
	    	fit: true,
	    	components: [
	    	    {
	    	    	name: "prefsScroller",
	    	    	kind: "Scroller",
	    	    	strategyKind: "TouchScrollStrategy",
	    	    	horizontal: "hidden",
	    	    	style: "height: 33%; border-bottom: solid 1px;",
	    	    	components: [
        	    	    {
        	    	    	name: "getPrefsOut",
        	    	    	allowHtml: true,
        	    	    	content: "luna://com.palm.systemservice/getPreferences<br>",
        	    	    	style: "color: white; padding: 5px;"
        	    	    }
	    	    	]
	    	    },
	    	    {
	    	    	name: "watchScroller",
	    	    	kind: "Scroller",
	    	    	strategyKind: "TouchScrollStrategy",
	    	    	horizontal: "hidden",
	    	    	style: "height: 33%; border-bottom: solid 1px;",
	    	    	components: [
        	    	    {
        	    	    	name: "watchOut",
        	    	    	allowHtml: true,
        	    	    	content: "luna://com.palm.db/find<br>",
        	    	    	style: "color: white; padding: 5px;"
        	    	    }
	    	    	]
	    	    },
	    	    {
	    	    	name: "geoScroller",
	    	    	kind: "Scroller",
	    	    	strategyKind: "TouchScrollStrategy",
	    	    	horizontal: "hidden",
	    	    	style: "height: 34%;",
	    	    	components: [
        	    	    {
        	    	    	name: "geoOut",
        	    	    	allowHtml: true,
        	    	    	content: "palm://com.palm.location/startTracking<br>",
        	    	    	style: "color: white; padding: 5px;"
        	    	    }
	    	    	]
	    	    }
	    	]
	    },
	    {
	    	name: "geoService",
	    	kind: "enyo.PalmService",
	    	service: "palm://com.palm.location",
	    	method: "startTracking",
	    	subscribe: true,
	    	resubscribe: false,
	    	onResponse: "geoResponse",
	    	onError: "geoError"
	    }
	],
	
	startRequests: function (inSender, inRequest) {
		this.subscribeGetPrefs();
				
		this.subscribeWatch();

		this.subscribeGeo();
	},
	subscribeGetPrefs: function () {
		var subscriptions = this;
		var prefsOut = this.$.getPrefsOut;
		var showAlertsWhenLocked;
		this.getPrefsRequest = new enyo.ServiceRequest({service: "luna://com.palm.systemservice", method: "getPreferences", subscribe: true, resubscribe: false});
		prefsOut.addContent("request timeout: " + this.getPrefsRequest.timeout + '<br>');
        var getPrefsParameters = {keys: ["showAlertsWhenLocked"]};
        console.log("getPreferences", getPrefsParameters);
        this.getPrefsRequest.go(getPrefsParameters);
        this.getPrefsRequest.response(handleGetPrefsResponse.bind(this));
        this.getPrefsRequest.error(handleGetPrefsFailure.bind(this));
        
        setInterval(function () {
    		var setPrefsRequest = new enyo.ServiceRequest({service: "luna://com.palm.systemservice", method: "setPreferences", subscribe: false, resubscribe: false});
            var setPrefsParameters = {showAlertsWhenLocked: !showAlertsWhenLocked};
            console.log("setPreferences", setPrefsParameters);
    		prefsOut.addContent("setting: " + setPrefsParameters.showAlertsWhenLocked + '<br>');
        	subscriptions.$.prefsScroller.scrollToBottom();
            setPrefsRequest.go(setPrefsParameters);
            setPrefsRequest.response(handleSetPrefsResponse.bind(subscriptions));
            setPrefsRequest.error(handleSetPrefsFailure.bind(subscriptions));
        }, parseFloat(subscriptions.$.intervalInput.getValue()) * 1000);
        
        function handleGetPrefsResponse(inSender, inResponse) {
        	console.log("handleGetPrefsResponse:", inResponse);
       		prefsOut.addContent("get: " + JSON.stringify(inResponse.showAlertsWhenLocked) + '<hr>');
        	subscriptions.$.prefsScroller.scrollToBottom();

        	showAlertsWhenLocked = inResponse.showAlertsWhenLocked;
        }
        
        function handleGetPrefsFailure(inSender, inResponse) {
        	console.error("handleGetPrefsFailure", inResponse);
        	prefsOut.addContent("get fail: " + JSON.stringify(inResponse) + '<br>');
        	subscriptions.$.prefsScroller.scrollToBottom();
        }
        
        function handleSetPrefsResponse(inSender, inResponse) {
        	console.log("handleSetPrefsResponse:", inResponse);
        }
        
        function handleSetPrefsFailure(inSender, inResponse) {
        	console.error("handleSetPrefsFailure", inResponse);
        	prefsOut.addContent("set fail: " + JSON.stringify(inResponse) + '<br>');
        	subscriptions.$.prefsScroller.scrollToBottom();
        }
	},
	subscribeWatch: function () {
		var subscriptions = this;
		var watchOut = this.$.watchOut;

		var putKindRequest = new enyo.ServiceRequest({service: "luna://com.palm.db", method: "putKind"});
		putKindRequest.go({
			"id": "org.webosports.app.testr.subscribething:1",
			"owner": "org.webosports.app.testr",
			"sync": false,
			"schema": {
				"id": "org.webosports.app.testr.subscribething:1",
				"type": "object",
				"properties": {
					"_kind": {"type": "string", "value": "org.webosports.app.testr.subscribething:1"},
					"favoriteColor": {"type": "string"}
				}
			},
			"indexes": [
		    {
		        "name": "byFavoriteColor",
		        "props": [{"name": "favoriteColor"}]
		    }
			]
		});
		putKindRequest.response(deleteAll.bind(this));
		putKindRequest.error(handlePutKindFailure.bind(this));
		
		function deleteAll(inSender, inResponse) {
			subscriptions.deleteAllRequest = new enyo.ServiceRequest({service: "luna://com.palm.db", method: "del"});
			subscriptions.deleteAllRequest.go({
				query: {from: "org.webosports.app.testr.subscribething:1"},
				purge: true
			});
			subscriptions.deleteAllRequest.response(startFind.bind(this));
			subscriptions.deleteAllRequest.error(handlePutKindFailure.bind(this));
		}
        
        function startFind(inSender, inResponse) {
    		subscriptions.watchRequest = new enyo.ServiceRequest({service: "luna://com.palm.db", method: "find", subscribe: true, resubscribe: false});
            var watchParameters = {query: {from: "org.webosports.app.testr.subscribething:1"}, watch: true, count: true};
            console.log("getPreferences", watchParameters);
            subscriptions.watchRequest.go(watchParameters);
            subscriptions.watchRequest.response(handleWatchResponse.bind(this));
            subscriptions.watchRequest.error(handleWatchFailure.bind(this));            
       }
		
        function handlePutKindFailure(inSender, inResponse) {
        	this.error(inResponse);
        	watchOut.addContent("putKind fail: " + JSON.stringify(inResponse) + '<br>');
        }
        
        function handleWatchResponse(inSender, inResponse) {
        	console.log("handleWatchResponse:", inResponse);
        	if (inResponse.fired) {
       			watchOut.addContent("watch fired<br>");
       			startFind();
        	} else {
       			watchOut.addContent("found " + inResponse.results.length + ' objects. count: ' + inResponse.count + '<hr>');
            	subscriptions.$.watchScroller.scrollToBottom();

            	setTimeout(putThing, parseFloat(subscriptions.$.intervalInput.getValue()) * 1000);
        	}
		}
        
        function handleWatchFailure(inSender, inResponse) {
        	console.error("handleWatchFailure", inResponse);
        	watchOut.addContent("find fail: " + JSON.stringify(inResponse) + '<br>');
        	subscriptions.$.watchScroller.scrollToBottom();
        }
        
        function putThing() {
    		var putRequest = new enyo.ServiceRequest({service: "luna://com.palm.db", method: "put", subscribe: false, resubscribe: false});
            var putParameters = {objects: [{_kind: "org.webosports.app.testr.subscribething:1", favoriteColor: "blue"}]};

            console.log("putting", putParameters.objects);
    		watchOut.addContent("putting 1 thing<br>");
        	subscriptions.$.watchScroller.scrollToBottom();

        	putRequest.go(putParameters);
            putRequest.response(handlePutResponse.bind(subscriptions));
            putRequest.error(handlePutFailure.bind(subscriptions));
        }

        function handlePutResponse(inSender, inResponse) {
        	console.log("handlePutResponse:", inResponse);
        }
        
        function handlePutFailure(inSender, inResponse) {
        	console.error("handlePutFailure", inResponse);
        	watchOut.addContent("put fail: " + JSON.stringify(inResponse) + '<br><hr>');
        	subscriptions.$.watchScroller.scrollToBottom();
        }
	},
	
	subscribeGeo: function() {
		this.$.geoService.send({});
    },
    geoResponse: function (inSender, inEvent) {
    	this.log(inEvent);
    	this.$.geoOut.addContent($L("position returned: ") + JSON.stringify(inEvent.data || inEvent, 
				["altitude", "heading", "horizAccuracy", "latitude", "longitude", "timestamp", "velocity", "vertAccuracy"], 1) + '<br>');
    	this.$.geoScroller.scrollToBottom();    	
    },
    geoError: function (inSender, inEvent) {
    	this.log(inEvent.data);
		var errorCode = inEvent.data ? inEvent.data.errorCode : inEvent.errorCode;
		var errorText = inEvent.data ? inEvent.data.errorText : inEvent.errorText;
		var msg = "errorCode: " + errorCode + "<br>" + 
				"errorText: " + errorText;
        if (this.errorCodes[errorCode]) {
        	msg = this.errorCodes[errorCode] + "<br>" + msg;
        }
        this.$.geoOut.addContent(msg + '<br>');
    	this.$.geoScroller.scrollToBottom();    	
    },
	errorCodes: ["Success", "Timeout", "Position_Unavailable", "Unknown", 
	             "GPS_Permanent_Error - No GPS fix but can still get the cell and Wifi fixes. A TouchPad without GPS returns this error.", 
	             "LocationServiceOFF - No Location source available. Both Google and GPS are off.", 
	             "Permission Denied - The user has not accepted the terms of use for the Google Location Service, or the Google Service is off.", 
	             "The application already has a pending message ", 
	             "The application has been temporarily blacklisted. (The user is not allowing this application to use this service.)"]
});
