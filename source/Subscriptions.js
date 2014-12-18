/* Subscriptions.js - panel for manual tests of PalmBus subscriptions for LuneOS */

enyo.kind({
	name: "Subscriptions",
	layoutKind: "FittableRowsLayout",
	components: [
	    { kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
	         {fit: true, content: $L("Subscriptions")},
             {content: $L("interval (s)")},
	         {kind: 'onyx.InputDecorator', components: [
	         	 {name: "intervalInput", kind: "onyx.Input", type: "number", attributes: {min: 1}, style: "width: 2.5em;", value: 9}
	         ]},
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
	    	    	style: "height: 38%; border-bottom: solid 1px;",
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
	    	    	name: "findnetworksScroller",
	    	    	kind: "Scroller",
	    	    	strategyKind: "TouchScrollStrategy",
	    	    	horizontal: "hidden",
	    	    	style: "height: 24%; border-bottom: solid 1px;",
	    	    	components: [
        	    	    {
        	    	    	name: "findnetworksOut",
        	    	    	allowHtml: true,
        	    	    	content: "luna://com.palm.wifi/findnetworks<br>",
        	    	    	style: "color: white; padding: 5px;"
        	    	    }
	    	    	]
	    	    },
	    	    {
	    	    	name: "watchScroller",
	    	    	kind: "Scroller",
	    	    	strategyKind: "TouchScrollStrategy",
	    	    	horizontal: "hidden",
	    	    	style: "height: 38%;",
	    	    	components: [
        	    	    {
        	    	    	name: "watchOut",
        	    	    	allowHtml: true,
        	    	    	content: "luna://com.palm.db/find<br>",
        	    	    	style: "color: white; padding: 5px;"
        	    	    }
	    	    	]
	    	    }
	    	]
	    }
	],
	
	startRequests: function (inSender, inRequest) {
		this.subscribeGetPrefs();
		
		this.subscribeFindnetworks();
		
		this.subscribeWatch();
	},
	subscribeGetPrefs: function () {
		var subscriptions = this;
		var prefsOut = this.$.getPrefsOut;
		var showAlertsWhenLocked;
		var getPrefsRequest = new enyo.ServiceRequest({service: "luna://com.palm.systemservice", method: "getPreferences", subscribe: true, resubscribe: false});
		prefsOut.addContent("request timeout: " + getPrefsRequest.timeout + '<br>');
        var getPrefsParameters = {keys: ["showAlertsWhenLocked"]};
        console.log("getPreferences", getPrefsParameters);
        getPrefsRequest.go(getPrefsParameters);
        getPrefsRequest.response(handleGetPrefsResponse.bind(this));
        getPrefsRequest.error(handleGetPrefsFailure.bind(this));
        
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
	subscribeFindnetworks: function() {		
		var findnetworksRequest = new enyo.ServiceRequest({service: "luna://com.palm.wifi", method: "findnetworks", subscribe: true, resubscribe: false});
		this.$.findnetworksOut.addContent("request timeout: " + findnetworksRequest.timeout + '<br>');
        var findnetworksParameters = {};
        console.log("findnetworks", findnetworksParameters);
        findnetworksRequest.go(findnetworksParameters);
        findnetworksRequest.response(handleFindnetworksResponse.bind(this));
        findnetworksRequest.error(handleFindnetworksFailure.bind(this));
        
        function handleFindnetworksResponse(inSender, inResponse) {
        	console.log("handleFindnetworksResponse:", inResponse);
        	if (inResponse.foundNetworks) {
        		this.$.findnetworksOut.addContent(inResponse.foundNetworks.length + ' networks found<br>');
        	} else {
        		this.$.findnetworksOut.addContent(JSON.stringify(inResponse) + '<br>');
        	}
        	this.$.findnetworksScroller.scrollToBottom();
        }
        
        function handleFindnetworksFailure(inSender, inResponse) {
        	console.error("handleFindnetworksFailure", inResponse);
        	this.$.findnetworksOut.addContent(JSON.stringify(inResponse) + '<br>');
        	this.$.findnetworksScroller.scrollToBottom();
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
		putKindRequest.response(startFind.bind(this));
		putKindRequest.error(handlePutKindFailure.bind(this));
        
        function startFind(inSender, inResponse) {
    		var watchRequest = new enyo.ServiceRequest({service: "luna://com.palm.db", method: "find", subscribe: true, resubscribe: false});
            var watchParameters = {query: {from: "org.webosports.app.testr.subscribething:1"}, watch: true, count: true};
            console.log("getPreferences", watchParameters);
            watchRequest.go(watchParameters);
            watchRequest.response(handleWatchResponse.bind(this));
            watchRequest.error(handleWatchFailure.bind(this));            
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
	}
});
