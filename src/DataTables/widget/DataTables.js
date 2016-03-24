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
    "dojo/_base/kernel",

    "DataTables/lib/jquery",
    "dojo/text!DataTables/widget/template/DataTables.html",
    
    // DataTables modules. When updating to a new version, do not forget to update the module names in the DataTables module sources because the default does not work in a custom widget.
    "DataTables/lib/jquery.datatables"/*,
    "DataTables/lib/dataTables.bootstrap" */
], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoStyle, dojoArray, dojoLang, dojoEvent, dojoKernel, _jQuery, widgetTemplate) {
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
        tableEntity: null,
        isResponsive: false,
        autoColumnWidth: true,
        allowColumnReorder: true,
        allowColumnVisibility: false,
        tableClass: "",
        columnList: null,
        
        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handles: null,
        _contextObj: null,
        _entityMetaData: null,
        _tableNodelist: null,
        _table: null,
        
        // I18N file names object at the end, out of sight!

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
            
            var moduleList = [],
                thisObj = this;
            
            this._entityMetaData = mx.meta.getEntity(this.tableEntity);
            this._updateRendering();
            this._setupEvents();
            
            // Optional DataTables modules.
            // When updating to a new version, do not forget to update the module names in the DataTables module sources because the default does not work in a custom widget.  
            if (this.isResponsive) {
                moduleList.push("DataTables/lib/dataTables.responsive");
            }
            if (this.allowColumnReorder) {
                moduleList.push("DataTables/lib/dataTables.colReorder");
            }
            // The buttons extension consists of multiple modules. First include the common module then the necessary specific ones.
            if (this.allowColumnVisibility) {
                moduleList.push("DataTables/lib/datatables.buttons");
            }
            if (this.allowColumnVisibility) {
                moduleList.push("DataTables/lib/buttons.colVis");
            }
            
            // Require all necessary modules
            if (moduleList.length) {
                require(moduleList, function () {
                    logger.debug(thisObj.id + ".postCreate require additional modules done.");
                });
            }
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
        
        // Create the DataTables object
        _createTableObject: function () {
            logger.debug(this.id + "._createTableObject");

            var dataTablesOptions,
                dataTablesColumns = [],
                dataTablesColumn,
                locale,
                language,
                languageFilename = null,
                thisObj = this;

            this._tableNodelist = $("#" + this.domNode.id + " #tableToConvert");

            dojoArray.forEach(this.columnList, function (column) {
                dataTablesColumn = {
                    title: column.caption,
                    data: column.attrName,
                    visible: column.initiallyVisible
                };
                if (thisObj.isResponsive) {
                    dataTablesColumn.responsivePriority = column.responsivePriority;
                }
                if (column.columnWidth) {
                    dataTablesColumn.width = column.columnWidth;
                }
                if (column.cellClass) {
                    dataTablesColumn.className = column.cellClass;
                }
                dataTablesColumns.push(dataTablesColumn);
            });
            // searching is handled in the widget and XPath, not in DataTables because the search field triggers a search with every key press.
            dataTablesOptions = {
                serverSide: true,
                searching: false,
                ajax: dojoLang.hitch(this, this._getData),
                columns: dataTablesColumns
            };
            
            if (!this.autoColumnWidth) {
                dataTablesOptions.autoWidth = false;
            }
            
            locale = dojoKernel.locale;
            language = locale.substring(0, 2);
            if (this._i18nFilenames[locale]) {
                languageFilename = this._i18nFilenames[locale];
            } else if (this._i18nFilenames[language]) {
                languageFilename = this._i18nFilenames[language];
            }
            if (languageFilename) {
                dataTablesOptions.language = {url: document.location.origin + "/widgets/DataTables/i18n/" + languageFilename};
            }

            // If the file does not load, check that it has no comments in it as the parser does not like comments.
            
            if (this.isResponsive) {
                dataTablesOptions.responsive = true;
            }
            
            if (this.allowColumnReorder) {
                dataTablesOptions.colReorder = true;
            }
            
            // The buttons extension consists of multiple modules. First include the common option then configure it.
            if (this.allowColumnVisibility) {
                // This option needs to be set too for the button to appear.
                dataTablesOptions.dom = "Blfrtip";
                dataTablesOptions.buttons = [];
            }
            if (this.allowColumnVisibility) {
                dataTablesOptions.buttons.push("colvis");
            }
            
            if (this.tableClass) {
                this._tableNodelist.addClass(this.tableClass);
            }
            this._table = this._tableNodelist.DataTable(dataTablesOptions);
            dojoArray.forEach(this.columnList, function (column, i) {
                if (column.headerClass) {
                    $(thisObj._table.column(i).header()).addClass(column.headerClass);
                }
            });
            
        },
        
        // Get data 
        _getData: function (data, datTablesCallback, settings) {
            logger.debug(this.id + "._getData");
            
            var sortColumnIndex = data.order[0].column,
                sortColumn = data.columns[sortColumnIndex],
                thisObj = this;
            
            mx.data.get({
                xpath: "//" + this.tableEntity,
                count: true,
                filter: {
                    sort: [[sortColumn.data, data.order[0].dir]],
                    offset: data.start,
                    amount: data.length
                },
                callback: function (objs, extra) {
                    datTablesCallback({
                        draw: data.draw,
                        data: thisObj._convertMendixObjectArrayToDataArray(objs),
                        recordsTotal: extra.count,
                        recordsFiltered: extra.count
                    });
                    
                }
            });
        },
        
        _convertMendixObjectArrayToDataArray: function (objs) {
            logger.debug(this.id + "._convertMendixObjectArrayToDataArray");
            var attrName,
                dataArray = [],
                dataObj,
                thisObj = this;
            
            dojoArray.forEach(objs, function (obj) {
                dataObj = { guid: obj.getGuid()};
                dojoArray.forEach(thisObj.columnList, function (column) {
                    attrName = column.attrName;
                    dataObj[attrName] = thisObj._getDisplayValue(obj, column);
                });
                dataArray.push(dataObj);
            });
            return dataArray;
        },


        /**
         * Get the attribute value for use as display value
         *
         * @param obj           The Mendix object to take the value from
         * @param column        The column name
         * @returns {string}    The value
         */
        _getDisplayValue : function (obj, column) {

            var attrName,
                attrType,
                dateFormat,
                result;

            attrName = column.attrName;
            attrType = this._entityMetaData.getAttributeType(attrName);

            switch (attrType) {
            case "DateTime":
                switch (column.dateTimeType) {
                case "dateTime":
                    dateFormat = column.dateTimeFormat;
                    break;
                case "time":
                    dateFormat = column.timeFormat;
                    break;
                default:
                    dateFormat = column.dateFormat;
                }
                result = mx.parser.formatAttribute(obj, attrName, { datePattern: dateFormat });
                break;

            default:
                result = mx.parser.formatAttribute(obj, attrName);
            }

            return result;
        },
        
        // Rerender the interface.
        _updateRendering: function () {
            logger.debug(this.id + "._updateRendering");
//            this.colorSelectNode.disabled = this.readOnly;

            if (this._contextObj !== null) {
                if (!this._table) {
                    this._createTableObject();
                }
                dojoStyle.set(this.domNode, "display", "block");

            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }

        },

        // Clear table and related objects.
        _clearTableData: function () {
            logger.debug(this.id + "._clearTableData");
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
        },
        _i18nFilenames: {
            "sq": "Albanian.lang",
            "ar": "Arabic.lang",
            "be": "Belarusian.lang",
            "bg": "Bulgarian.lang",
            "ca-es": "Catalan.lang",
            "zh-hk": "Chinese-traditional.lang",
            "zh-tw": "Chinese-traditional.lang",
            "zh": "Chinese.lang",
            "hr": "Croatian.lang",
            "cs": "Czech.lang",
            "da": "Danish.lang",
            "nl": "Dutch.lang",
            "et": "Estonian.lang",
            "fi": "Finnish.lang",
            "fr": "French.lang",
            "de": "German.lang",
            "el": "Greek.lang",
            "he": "Hebrew.lang",
            "hi": "Hindi.lang",
            "hu": "Hungarian.lang",
            "is": "Icelandic.lang",
            "id": "Indonesian.lang",
            "ga": "Irish.lang",
            "it": "Italian.lang",
            "ja": "Japanese.lang",
            "ko": "Korean.lang",
            "lv": "Latvian.lang",
            "lt": "Lithuanian.lang",
            "mk": "Macedonian.lang",
            "ms": "Malay.lang",
            "no": "Norwegian.lang",
            "pl": "Polish.lang",
            "pt-BR": "Portuguese-Brasil.lang",
            "pt": "Portuguese.lang",
            "ro": "Romanian.lang",
            "ru": "Russian.lang",
            "sr": "Serbian.lang",
            "sk": "Slovak.lang",
            "sl": "Slovenian.lang",
            "es": "Spanish.lang",
            "sv": "Swedish.lang",
            "th": "Thai.lang",
            "tr": "Turkish.lang",
            "uk": "Ukrainian.lang"
        }
    });
});

require(["DataTables/widget/DataTables"], function () {
    "use strict";
});
