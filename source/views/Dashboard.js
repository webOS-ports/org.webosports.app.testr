/*
 * A dashboard as legacy webOS applications drew one: no background of its
 * own, since the shell draws the entry behind it (webOS 2.2.4's pill on a
 * phone, a row of webOS 3.0.5's drop-down on a tablet), and the shell's toast
 * layout - see testr-dashboard in style/App.css.
 *
 * "lines" (from the dashboard.html query) above 2 adds that many lines in
 * all under the title and message, for the taller dashboards that test
 * dashHeight; the default height shows the two lines that fit it. A taller
 * one lays its first row out at the shell's entry height (fitRowToTheShell).
 *
 * Whether it is drawn as a tablet's row or a phone's pill is the shell's
 * choice, Settings' notificationStyle (followShellStyle), not the window's
 * shape: either style can be listed at the bottom or in the status bar's
 * drop-down.
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
        this.tall = lines > 2;
        if (this.tall) {
            this.addClass("testr-dashboard-tall");
            this.fitRowToTheShell();
            for (var i = 0; i < lines - 2 && i < names.length; i++) {
                this.$.moreLines.createComponent({
                    classes: "testr-dashboard-line",
                    content: $L(names[i] + " line")
                });
            }
        }
    },

    rendered: function() {
        this.inherited(arguments);
        this.followShellStyle();
    },

    deviceInfo: function() {
        try {
            return JSON.parse(window.PalmSystem && PalmSystem.deviceInfo) || {};
        } catch (e) {
            return {};
        }
    },

    /*
     * A taller dashboard's window is the whole dashboard, so its first row
     * cannot be measured off it. WebAppMgr says how high the shell's standard
     * entry is, in this page's pixels; without that (an older WebAppMgr) the
     * row stays Mojo's 52px.
     */
    fitRowToTheShell: function() {
        var row = Number(this.deviceInfo().dashboardHeight);
        if (isFinite(row) && row > 0) {
            this.applyStyle("--row", row + "px");
        }
    },

    /*
     * Settings' notificationStyle, "phone" or "tablet"; for "auto", and
     * until it is read, the device's TabletUi when WebAppMgr says it, as the
     * shell's NotificationLayout has it, and failing that the shape: a
     * tablet entry is the drop-down's gu(30) by gu(5.6), 5.36 to 1, a
     * phone's spans the screen, 7.6 to 1 or more; a taller one has no such
     * shape, so a screen at least 600 pixels on its short side.
     */
    statics: {
        isTablet: function(style, tabletUi, fallback) {
            if (style === "tablet") {
                return true;
            }
            if (style === "phone") {
                return false;
            }
            if (typeof tabletUi === "boolean") {
                return tabletUi;
            }
            return !!fallback;
        }
    },

    shapeIsTablet: function() {
        if (this.tall) {
            var info = this.deviceInfo();
            var width = Number(info.screenWidth), height = Number(info.screenHeight);
            return width > 0 && height > 0 && Math.min(width, height) >= 600;
        }
        var aspect = window.innerHeight > 0 ? window.innerWidth / window.innerHeight : 0;
        return aspect >= 4 && aspect <= 13 / 2;
    },

    style: "auto",

    applyShellStyle: function() {
        this.addRemoveClass("testr-dashboard-tablet",
            Dashboard.isTablet(this.style, this.deviceInfo().tabletUi, this.shapeIsTablet()));
    },

    followShellStyle: function() {
        this.applyShellStyle();
        if (!this.resizeHandler) {
            this.resizeHandler = enyo.bind(this, "applyShellStyle");
            window.addEventListener("resize", this.resizeHandler, false);
        }
        if (!this.stylePrefs && window.PalmSystem) {
            this.stylePrefs = new enyo.ServiceRequest({
                service: "luna://com.palm.systemservice",
                method: "getPreferences",
                subscribe: true,
                resubscribe: true
            });
            this.stylePrefs.response(this, "stylePrefsFetched");
            this.stylePrefs.go({keys: ["notificationStyle"]});
        }
    },

    stylePrefsFetched: function(inSender, inResponse) {
        var style = inResponse && inResponse.notificationStyle;
        if (style === undefined) {
            return;
        }
        this.style = typeof style === "string" ? style : "auto";
        this.applyShellStyle();
    },

    destroy: function() {
        if (this.resizeHandler) {
            window.removeEventListener("resize", this.resizeHandler, false);
        }
        if (this.stylePrefs) {
            this.stylePrefs.cancel();
        }
        this.inherited(arguments);
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
