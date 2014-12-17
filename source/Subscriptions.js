/* Subscriptions.js - panel for manual tests of PalmBus subscriptions for LuneOS */

enyo.kind({
	name: "Subscriptions",
	layoutKind: "FittableRowsLayout",
	components: [
	    { kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
	         {fit: true, content: $L("PalmBus Subscriptions")},
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
	    	    	name: "findnetworksScroller",
	    	    	kind: "Scroller",
	    	    	strategyKind: "TouchScrollStrategy",
	    	    	horizontal: "hidden",
	    	    	style: "height: 33%; border-bottom: solid 1px;",
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
	    	    	style: "height: 33%; border-bottom: solid 1px;",
	    	    	components: [
        	    	    {
        	    	    	name: "watchOut",
        	    	    	allowHtml: true,
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
		
		this.$.watchOut.addContent("not implemented yet");
	},
	subscribeGetPrefs: function () {
		var self = this;
		var prefsOut = this.$.getPrefsOut;
		var showAlertsWhenLocked;
		var getPrefsRequest = new enyo.ServiceRequest({service: "luna://com.palm.systemservice", method: "getPreferences", subscribe: true, resubscribe: false});
		prefsOut.addContent("timeout: " + getPrefsRequest.timeout + '<br>');
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
            setPrefsRequest.go(setPrefsParameters);
            setPrefsRequest.response(handleSetPrefsResponse.bind(self));
            setPrefsRequest.error(handleSetPrefsFailure.bind(self));
        }, 5000);
        
        function handleGetPrefsResponse(inSender, inResponse) {
        	console.log("handleGetPrefsResponse:", inResponse);
       		prefsOut.addContent("get: " + JSON.stringify(inResponse.showAlertsWhenLocked) + '<br>');
       		showAlertsWhenLocked = inResponse.showAlertsWhenLocked;
        }
        
        function handleGetPrefsFailure(inSender, inResponse) {
        	console.error("handleGetPrefsFailure", inResponse);
        	prefsOut.addContent("get fail: " + JSON.stringify(inResponse) + '<br>');
        }
        
        function handleSetPrefsResponse(inSender, inResponse) {
        	console.log("handleSetPrefsResponse:", inResponse);
        	prefsOut.addContent('<hr>');
        	self.$.prefsScroller.scrollToBottom();
        }
        
        function handleSetPrefsFailure(inSender, inResponse) {
        	console.error("handleSetPrefsFailure", inResponse);
        	prefsOut.addContent("set fail: " + JSON.stringify(inResponse) + '<br><hr>');
        	self.$.prefsScroller.scrollToBottom();
        }
	},
	subscribeFindnetworks: function() {		
		var findnetworksRequest = new enyo.ServiceRequest({service: "luna://com.palm.wifi", method: "findnetworks", subscribe: true, resubscribe: false});
		this.$.findnetworksOut.addContent("timeout: " + findnetworksRequest.timeout + '<br>');
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
	}	
});
