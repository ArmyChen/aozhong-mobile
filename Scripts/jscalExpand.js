//<![CDATA[
Calendar.LANG("zh", "\u4e2d\u6587", {
    /**
     * Sets the first day of week for this locale.
     * 0 = Sunday, 1 = Monday, etc.
     */
    fdow: 0,

    /**
     * appears in top bar.
     */
    goToday: "\u4eca\u5929",

    /**
     * appears in bottom bar.
     */
    today: "\u4eca\u5929",

    wk: "\u5468",

    /**
     * Sets the first day of week for this locale.
     * 0 = Sunday, 1 = Monday, etc.
     */
    weekend: "0,6",

    AM: "\u4e0a\u5348",
    PM: "\u4e0b\u5348",

    mn: ["1\u6708", "2\u6708", "3\u6708", "4\u6708", "5\u6708", "6\u6708", "7\u6708", "8\u6708", "9\u6708", "10\u6708", "11\u6708", "12\u6708"],
    smn: ["1\u6708", "2\u6708", "3\u6708", "4\u6708", "5\u6708", "6\u6708", "7\u6708", "8\u6708", "9\u6708", "10\u6708", "11\u6708", "12\u6708"],
    dn: ["\u661f\u671f\u65e5", "\u661f\u671f\u4e00", "\u661f\u671f\u4e8c", "\u661f\u671f\u4e09", "\u661f\u671f\u56db", "\u661f\u671f\u4e94", "\u661f\u671f\u516d"],
    sdn: ["\u5468\u65e5", "\u5468\u4e00", "\u5468\u4e8c", "\u5468\u4e09", "\u5468\u56db", "\u5468\u4e94", "\u5468\u516d"]
});
Calendar.setLanguage("zh");
var CalendarSetupParent = Calendar.setup;
function _CalendarSetup(options) {
    if (false == $.isUndefined(options.button)) {
        options.trigger = options.button;
        delete options.button;
    }
    if (false == $.isUndefined(options.ifFormat)) {
        options.dateFormat = options.ifFormat;
        delete options.ifFormat;
    }
    if (false == $.isUndefined(options.showsTime)) {
        options.showTime = options.showsTime;
        delete options.showsTime;
    }
    if (false == $.isUndefined(options.align) && 'Bl' == options.align) {
        options.align = 'BL';
    }
    //	delete options.singleClick;

    if (true == $.isUndefined(options.onSelect)) {
        options.onSelect = function () { this.hide(); };
    }

    CalendarSetupParent(options);
};
Calendar.setup = _CalendarSetup;
//]]>