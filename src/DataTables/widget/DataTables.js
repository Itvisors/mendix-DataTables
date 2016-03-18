/*jshint undef: true, browser:true, nomen: true */
/*jslint browser:true, nomen: true */
/*global mx, define, require, console, logger*/
/*
    DataTables
    ========================

    @file      : DataTables.js
    @version   : 1.0
    @author    : Marcel Groeneweg
    @date      : Sat, 12 Mar 2016 13:19:22 GMT
    @copyright : 
    @license   : Apache 2

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",

    "mxui/dom",

    "dojo/dom-style",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/_base/event",

    "DataTables/lib/jquery",
    "dojo/text!DataTables/widget/template/DataTables.html",
    
    // DataTables modules. When updating to a new version, do not forget to update the module names in the DataTables module sources because the default does not work in a custom widget.
    "DataTables/lib/jquery.datatables"/*,
    "DataTables/lib/dataTables.bootstrap" */
], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoStyle, dojoArray, dojoLang, dojoEvent, _jQuery, widgetTemplate) {
    "use strict";

    var $ = _jQuery.noConflict(true);

    // Declare widget's prototype.
    return declare("DataTables.widget.DataTables", [ _WidgetBase, _TemplatedMixin ], {
        // _TemplatedMixin will create our dom node using this HTML template.
        templateString: widgetTemplate,

        // DOM elements
        inputNodes: null,
        colorSelectNode: null,
        colorInputNode: null,
        infoTextNode: null,

        // Parameters configured in the Modeler.
        mfToExecute: "",
        messageString: "",
        backgroundColor: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handles: null,
        _contextObj: null,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            // Uncomment the following line to enable debug messages
            //logger.level(logger.DEBUG);
            logger.debug(this.id + ".constructor");
            this._handles = [];
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            logger.debug(this.id + ".postCreate");
            this._updateRendering();
            this._setupEvents();
            
            var dataSet = [
                [ "Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800" ],
                [ "Garrett Winters", "Accountant", "Tokyo", "8422", "2011/07/25", "$170,750" ],
                [ "Ashton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000" ],
                [ "Cedric Kelly", "Senior Javascript Developer", "Edinburgh", "6224", "2012/03/29", "$433,060" ],
                [ "Airi Satou", "Accountant", "Tokyo", "5407", "2008/11/28", "$162,700" ],
                [ "Brielle Williamson", "Integration Specialist", "New York", "4804", "2012/12/02", "$372,000" ],
                [ "Herrod Chandler", "Sales Assistant", "San Francisco", "9608", "2012/08/06", "$137,500" ],
                [ "Rhona Davidson", "Integration Specialist", "Tokyo", "6200", "2010/10/14", "$327,900" ],
                [ "Colleen Hurst", "Javascript Developer", "San Francisco", "2360", "2009/09/15", "$205,500" ],
                [ "Sonya Frost", "Software Engineer", "Edinburgh", "1667", "2008/12/13", "$103,600" ],
                [ "Jena Gaines", "Office Manager", "London", "3814", "2008/12/19", "$90,560" ],
                [ "Quinn Flynn", "Support Lead", "Edinburgh", "9497", "2013/03/03", "$342,000" ],
                [ "Charde Marshall", "Regional Director", "San Francisco", "6741", "2008/10/16", "$470,600" ],
                [ "Haley Kennedy", "Senior Marketing Designer", "London", "3597", "2012/12/18", "$313,500" ],
                [ "Tatyana Fitzpatrick", "Regional Director", "London", "1965", "2010/03/17", "$385,750" ],
                [ "Michael Silva", "Marketing Designer", "London", "1581", "2012/11/27", "$198,500" ],
                [ "Paul Byrd", "Chief Financial Officer (CFO)", "New York", "3059", "2010/06/09", "$725,000" ],
                [ "Gloria Little", "Systems Administrator", "New York", "1721", "2009/04/10", "$237,500" ],
                [ "Bradley Greer", "Software Engineer", "London", "2558", "2012/10/13", "$132,000" ],
                [ "Dai Rios", "Personnel Lead", "Edinburgh", "2290", "2012/09/26", "$217,500" ],
                [ "Jenette Caldwell", "Development Lead", "New York", "1937", "2011/09/03", "$345,000" ],
                [ "Yuri Berry", "Chief Marketing Officer (CMO)", "New York", "6154", "2009/06/25", "$675,000" ],
                [ "Caesar Vance", "Pre-Sales Support", "New York", "8330", "2011/12/12", "$106,450" ],
                [ "Doris Wilder", "Sales Assistant", "Sidney", "3023", "2010/09/20", "$85,600" ],
                [ "Angelica Ramos", "Chief Executive Officer (CEO)", "London", "5797", "2009/10/09", "$1,200,000" ],
                [ "Gavin Joyce", "Developer", "Edinburgh", "8822", "2010/12/22", "$92,575" ],
                [ "Jennifer Chang", "Regional Director", "Singapore", "9239", "2010/11/14", "$357,650" ],
                [ "Brenden Wagner", "Software Engineer", "San Francisco", "1314", "2011/06/07", "$206,850" ],
                [ "Fiona Green", "Chief Operating Officer (COO)", "San Francisco", "2947", "2010/03/11", "$850,000" ],
                [ "Shou Itou", "Regional Marketing", "Tokyo", "8899", "2011/08/14", "$163,000" ],
                [ "Michelle House", "Integration Specialist", "Sidney", "2769", "2011/06/02", "$95,400" ],
                [ "Suki Burks", "Developer", "London", "6832", "2009/10/22", "$114,500" ],
                [ "Prescott Bartlett", "Technical Author", "London", "3606", "2011/05/07", "$145,000" ],
                [ "Gavin Cortez", "Team Leader", "San Francisco", "2860", "2008/10/26", "$235,500" ],
                [ "Martena Mccray", "Post-Sales support", "Edinburgh", "8240", "2011/03/09", "$324,050" ],
                [ "Unity Butler", "Marketing Designer", "San Francisco", "5384", "2009/12/09", "$85,675" ]
            ];

            $("#example").DataTable({
                data: dataSet,
                columns: [
                    { title: "Name" },
                    { title: "Position" },
                    { title: "Office" },
                    { title: "Extn." },
                    { title: "Start date" },
                    { title: "Salary" }
                ]
            });
            
            //$(this.domNode).addClass("display table table-striped table-bordered dataTable");
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            logger.debug(this.id + ".update");

            this._contextObj = obj;
            this._resetSubscriptions();
            this._updateRendering();

            callback();
        },

        // mxui.widget._WidgetBase.enable is called when the widget should enable editing. Implement to enable editing if widget is input widget.
        enable: function () {
            logger.debug(this.id + ".enable");
        },

        // mxui.widget._WidgetBase.enable is called when the widget should disable editing. Implement to disable editing if widget is input widget.
        disable: function () {
            logger.debug(this.id + ".disable");
        },

        // mxui.widget._WidgetBase.resize is called when the page's layout is recalculated. Implement to do sizing calculations. Prefer using CSS instead.
        resize: function (box) {
            logger.debug(this.id + ".resize");
        },

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function () {
            logger.debug(this.id + ".uninitialize");
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        },

        // We want to stop events on a mobile device
        _stopBubblingEventOnMobile: function (e) {
            logger.debug(this.id + "._stopBubblingEventOnMobile");
            if (typeof document.ontouchstart !== "undefined") {
                dojoEvent.stop(e);
            }
        },

        // Attach events to HTML dom elements
        _setupEvents: function () {
            logger.debug(this.id + "._setupEvents");
//            this.connect(this.colorSelectNode, "change", function (e) {
//                // Function from mendix object to set an attribute.
//                this._contextObj.set(this.backgroundColor, this.colorSelectNode.value);
//            });

//            this.connect(this.infoTextNode, "click", function (e) {
//                // Only on mobile stop event bubbling!
//                this._stopBubblingEventOnMobile(e);
//
//                // If a microflow has been set execute the microflow on a click.
//                if (this.mfToExecute !== "") {
//                    mx.data.action({
//                        params: {
//                            applyto: "selection",
//                            actionname: this.mfToExecute,
//                            guids: [ this._contextObj.getGuid() ]
//                        },
//                        store: {
//                            caller: this.mxform
//                        },
//                        callback: function (obj) {
//                            //TODO what to do when all is ok!
//                        },
//                        error: dojoLang.hitch(this, function (error) {
//                            logger.error(this.id + ": An error occurred while executing microflow: " + error.description);
//                        })
//                    }, this);
//                }
//            });
        },

        // Rerender the interface.
        _updateRendering: function () {
            logger.debug(this.id + "._updateRendering");
//            this.colorSelectNode.disabled = this.readOnly;

            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");

            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }

        },


        // Reset subscriptions.
        _resetSubscriptions: function () {
            logger.debug(this.id + "._resetSubscriptions");
            // Release handles on previous object, if any.
            if (this._handles) {
                dojoArray.forEach(this._handles, function (handle) {
                    mx.data.unsubscribe(handle);
                });
                this._handles = [];
            }

            // When a mendix object exists create subscribtions.
            if (this._contextObj) {
                var objectHandle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: dojoLang.hitch(this, function (guid) {
                        this._updateRendering();
                    })
                });

//                var attrHandle = this.subscribe({
//                    guid: this._contextObj.getGuid(),
//                    attr: this.backgroundColor,
//                    callback: dojoLang.hitch(this, function (guid, attr, attrValue) {
//                        this._updateRendering();
//                    })
//                });

                this._handles = [ objectHandle /*, attrHandle */];
            }
        }
    });
});

require(["DataTables/widget/DataTables"], function () {
    "use strict";
});
