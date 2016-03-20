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
        entity: "",
        columnList: null,
        isResponsive: false,

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handles: null,
        _contextObj: null,
        _tableNodelist: null,
        _table: null,

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

            var dataTablesOptions,
                dataTablesColumns = [],
                dataTablesColumn,
                thisObj = this;
            
            this._tableNodelist = $("#" + this.domNode.id + " #tableToConvert");

            if (this.columnList) {
                dojoArray.forEach(this.columnList, function (column) {
                    dataTablesColumn = {
                        title: column.caption,
                        data: column.attrName
                    };
                    if (thisObj.isResponsive) {
                        dataTablesColumn.responsivePriority = column.responsivePriority;
                    }
                    dataTablesColumns.push(dataTablesColumn);
                });
            }
            // searching is handled in the widget and XPath, not in DataTables because the search field triggers a search with every key press.
            dataTablesOptions = {
                serverSide: true,
                searching: false,
                ajax: dojoLang.hitch(this, this._getData),
//                scrollY: 200,
//                scroller: {
//                    loadingIndicator: true
//                },
                columns: dataTablesColumns
            };
            if (this.isResponsive) {
                dataTablesOptions.responsive = true;
            }
            this._table = this._tableNodelist.DataTable(dataTablesOptions);
            
            this._updateRendering();
            this._setupEvents();
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
            this._clearTableData();
            this._table = null;
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
        
        // Get data 
        _getData: function (data, callback, settings) {
            var dataSet = [
                {
                    "Number": 1,
                    "gender": "Male",
                    "firstName": "Eric",
                    "lastName": "Olson",
                    "email": "eolson0@techcrunch.com",
                    "postalCode": "85025",
                    "address": "2690 Gulseth Hill",
                    "city": "Phoenix",
                    "countryCode": "US",
                    "phone": "1-(480)325-6097",
                    "salary": "130529.32"
                },
                {
                    "Number": 2,
                    "gender": "Male",
                    "firstName": "Ralph",
                    "lastName": "Greene",
                    "email": "rgreene1@theglobeandmail.com",
                    "address": "84 Buhler Pass",
                    "city": "Obigarm",
                    "countryCode": "TJ",
                    "phone": "992-(789)290-1225",
                    "salary": "675336.79"
                },
                {
                    "Number": 3,
                    "gender": "Female",
                    "firstName": "Nancy",
                    "lastName": "Lane",
                    "email": "nlane2@creativecommons.org",
                    "address": "5 Arrowood Circle",
                    "city": "Al Manqaf",
                    "countryCode": "KW",
                    "phone": "965-(625)852-0890",
                    "salary": "441664.41"
                },
                {
                    "Number": 4,
                    "gender": "Male",
                    "firstName": "Joe",
                    "lastName": "Shaw",
                    "email": "jshaw3@newsvine.com",
                    "address": "64857 Raven Parkway",
                    "city": "Criciúma",
                    "countryCode": "BR",
                    "phone": "55-(960)879-6803",
                    "salary": "717465.89"
                },
                {
                    "Number": 5,
                    "gender": "Male",
                    "firstName": "Roger",
                    "lastName": "Little",
                    "email": "rlittle4@comcast.net",
                    "postalCode": "40293",
                    "address": "22717 Kipling Plaza",
                    "city": "Louisville",
                    "countryCode": "US",
                    "phone": "1-(502)731-6320",
                    "salary": "314944.35"
                },
                {
                    "Number": 6,
                    "gender": "Male",
                    "firstName": "Steven",
                    "lastName": "Vasquez",
                    "email": "svasquez5@ftc.gov",
                    "address": "2 Butternut Avenue",
                    "city": "Miguel Pereira",
                    "countryCode": "BR",
                    "phone": "55-(312)364-5717",
                    "salary": "847726.43"
                },
                {
                    "Number": 7,
                    "gender": "Female",
                    "firstName": "Judy",
                    "lastName": "Montgomery",
                    "email": "jmontgomery6@nhs.uk",
                    "address": "41060 Russell Plaza",
                    "city": "Baita",
                    "countryCode": "CN",
                    "phone": "86-(474)972-0140",
                    "salary": "830884.74"
                },
                {
                    "Number": 8,
                    "gender": "Female",
                    "firstName": "Rebecca",
                    "lastName": "Jordan",
                    "email": "rjordan7@flavors.me",
                    "address": "50099 Dunning Drive",
                    "city": "Kuala Bhee",
                    "countryCode": "Number",
                    "phone": "62-(185)890-6738",
                    "salary": "623495.77"
                },
                {
                    "Number": 9,
                    "gender": "Female",
                    "firstName": "Karen",
                    "lastName": "Dunn",
                    "email": "kdunn8@hhs.gov",
                    "address": "5416 Gateway Street",
                    "city": "Pacarkeling",
                    "countryCode": "Number",
                    "phone": "62-(882)550-5723",
                    "salary": "370746.59"
                },
                {
                    "Number": 10,
                    "gender": "Male",
                    "firstName": "Steve",
                    "lastName": "Perez",
                    "email": "sperez9@japanpost.jp",
                    "address": "4 NorthrNumberge Avenue",
                    "city": "Knysna",
                    "countryCode": "ZA",
                    "phone": "27-(276)146-2632",
                    "salary": "289746.75"
                }
            ];
            
            setTimeout(function () {
                callback({
                    draw: data.draw,
                    data: dataSet,
                    recordsTotal: 1000,
                    recordsFiltered: 1000
                });
            }, 50);
            
        },

        // Rerender the interface.
        _updateRendering: function () {
            logger.debug(this.id + "._updateRendering");
//            this.colorSelectNode.disabled = this.readOnly;

            if (this._contextObj !== null) {
                //this._tableNodelist.addClass("display table table-striped table-bordered dataTable");
                dojoStyle.set(this.domNode, "display", "block");

            } else {
                dojoStyle.set(this.domNode, "display", "none");
                this._clearTableData();
            }

        },

        // Clear table and related objects.
        _clearTableData: function () {
            if (this._table) {
                this._table.clear();
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
