enyo.kind({
    name: "Dashboard",
    style: "color:white; background-color:#333",
    handlers: {
        ontap: "handleTap"
    },
    components:[
        {kind: "enyo.FittableColumns", classes: 'flex-auto', components: [
            {style: "width: 50px; margin-right: 4px; margin-left: 6px; margin-top: 2px; position: relative;", components: [
                {style: "width: 48px; height: 48px; background: url(assets/Contacts-favorites-star-blue.png) center center no-repeat;" }
            ]},
            {kind: "enyo.FittableRows", style: "color: #FFF;margin-top: -1px;margin-left: 10px;border: none;overflow: hidden;font-size: 16px;width: 270px;min-height: 53px;", components: [
                {name: "notificationTitle", style: "white-space: nowrap;overflow: hidden;text-overflow: ellipsis;font-weight: bold;padding-top:6px"},
                {name: "notificationMessage", style: "white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 14px; margin-top: -2px;"},
                {style: "font-size: 14px; margin-top: -2px;", content: "third line"},
                {style: "font-size: 14px; margin-top: -2px;", content: "fourth line"},
                {style: "font-size: 14px; margin-top: -2px;", content: "fifth line"}
            ]}
        ]}
    ],

    create: function() {
        this.inherited(arguments);
        this.$.notificationTitle.set('content', $L("Testr Dashboard"));
        var count = arguments[0].count || 0;
        var msg = enyo.quickMacroize($L("You have {$count} item(s)"), {count: count});
        this.$.notificationMessage.set('content', msg);
    },

    handleTap: function() {
        var request = new enyo.ServiceRequest({
            service: "palm://com.palm.applicationManager",
            method: "open"
        });
        request.go({id: webos.identifier().appID});
        window.close();
    }
});
