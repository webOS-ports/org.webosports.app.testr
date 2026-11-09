/*
 * A dashboard as legacy webOS applications drew one: no background of its
 * own, since the shell draws the entry behind it (webOS 2.2.4's pill on a
 * phone, a row of webOS 3.0.5's drop-down on a tablet), and the shell's toast
 * layout - see testr-dashboard in style/App.css.
 *
 * "lines" (from the dashboard.html query) above 2 adds that many lines in
 * all under the title and message, for the taller dashboards that test
 * dashHeight; the default height shows the two lines that fit it.
 */
enyo.kind({
    name: "Dashboard",
    classes: "testr-dashboard",
    lines: 2,
    handlers: {
        ontap: "handleTap"
    },
    components:[
        {classes: "testr-dashboard-row", components: [
            {classes: "testr-dashboard-icon"},
            {classes: "testr-dashboard-text", components: [
                {name: "notificationTitle", classes: "testr-dashboard-title"},
                {name: "notificationMessage", classes: "testr-dashboard-line"}
            ]}
        ]},
        {name: "moreLines", classes: "testr-dashboard-more"}
    ],

    create: function() {
        this.inherited(arguments);
        this.$.notificationTitle.set('content', $L("Testr Dashboard"));
        var count = arguments[0].count || 0;
        var msg = enyo.quickMacroize($L("You have {$count} item(s)"), {count: count});
        this.$.notificationMessage.set('content', msg);

        var lines = parseInt(arguments[0].lines, 10) || this.lines;
        var names = ["third","fourth","fifth","sixth","seventh","eighth","ninth","tenth","eleventh","twelfth","thirteenth","fourteenth","fifteenth","sixteenth","seventeenth","eighteenth","nineteenth","twentieth"];
        if (lines > 2) {
            this.addClass("testr-dashboard-tall");
            for (var i = 0; i < lines - 2 && i < names.length; i++) {
                this.$.moreLines.createComponent({
                    classes: "testr-dashboard-line",
                    content: $L(names[i] + " line")
                });
            }
        }
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
