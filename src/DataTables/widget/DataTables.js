/*jshint undef: true, browser:true, nomen: true */
/*jslint browser:true, nomen: true */
/*global mx, mxui, define, require, console, logger*/
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

    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/on",
    "dojo/query",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/_base/event",
    "dojo/_base/kernel",

    "DataTables/lib/jquery",
    "dojo/text!DataTables/widget/template/DataTables.html",
    
    // DataTables modules. When updating to a new version, do not forget to update the module names in the DataTables module sources because the default does not work in a custom widget.
    "DataTables/lib/jquery.dataTables"/*,
    "DataTables/lib/dataTables.bootstrap" */
], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoClass, dojoStyle, dojoConstruct, dojoOn, dojoQuery, dojoArray, dojoLang, dojoEvent, dojoKernel, _jQuery, widgetTemplate) {
    "use strict";

    var $ = _jQuery.noConflict(true);

    // Declare widget's prototype.
    return declare("DataTables.widget.DataTables", [ _WidgetBase, _TemplatedMixin ], {
        // _TemplatedMixin will create our dom node using this HTML template.
        templateString: widgetTemplate,

        // DOM elements
        controlbar: null,
        buttonContainer: null,

        // Parameters configured in the Modeler.
        tableEntity: null,
        refreshAttr: null,
        xpathConstraintAttr: "",
        isResponsive: false,
        autoColumnWidth: true,
        allowColumnReorder: true,
        allowColumnVisibility: false,
        colVisButtonText: "",
        tableClass: "",
        stateSaveName: null,
        showTableInformation: true,
        infiniteScroll: false,
        scrollY: null,
        selectionType: null,
        selectFirst: false,
        selectionMicroflowName: "",
        columnList: null,
        attrSearchFilterList: null,
        refSearchFilterList: null,
        buttonDefinitionList: null,
        
        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handles: null,
        _rowObjectHandles: null,
        _contextObj: null,
        _contextObjMetaData: null,
        _entityMetaData: null,
        _tableNodelist: null,
        _table: null,
        _buttonList: null,
        _defaultButtonDefinition: null,
        
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
                moduleList.push("DataTables/lib/dataTables.buttons");
            }
            if (this.allowColumnVisibility) {
                moduleList.push("DataTables/lib/buttons.colVis");
            }
            if (this.infiniteScroll) {
                moduleList.push("DataTables/lib/dataTables.scroller");
            }
            if (this.selectionType !== "none") {
                moduleList.push("DataTables/lib/dataTables.select");
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
            this._buttonList = null;
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
        },
        
        // Create the DataTables object
        _createTableObject: function () {
            logger.debug(this.id + "._createTableObject");

            var button,
                dataTablesOptions,
                dataTablesColumns = [],
                dataTablesColumn,
                locale,
                language,
                languageFilename = null,
                table,
                thisObj = this;

            this._tableNodelist = $("#" + this.domNode.id + " #tableToConvert");

            // Add dummy column when column visibility is turned on, to prevent rendering issues.
            // When the first column is hidden, column reorder shows the dragging line at the wrong position.
            if (this.allowColumnVisibility && this.allowColumnReorder) {
                dataTablesColumn = {
                    title: " ",
                    name: "colVisDummy",
                    data: "colVisDummy",
                    orderable: false,
                    width: "1px"
                };
                if (this.isResponsive) {
                    dataTablesColumn.responsivePriority = 0;
                }
                dataTablesColumns.push(dataTablesColumn);
            }

            // Process column definitions.
            dojoArray.forEach(this.columnList, function (column) {
                dataTablesColumn = {
                    title: column.caption,
                    data: column.attrName,
                    visible: column.initiallyVisible
                };
                if (this.isResponsive) {
                    dataTablesColumn.responsivePriority = column.responsivePriority;
                }
                if (column.columnWidth) {
                    dataTablesColumn.width = column.columnWidth;
                }
                if (column.cellClass) {
                    dataTablesColumn.className = column.cellClass;
                }
                dataTablesColumns.push(dataTablesColumn);
            }, this);
            
            // searching is handled in the widget and XPath, not in DataTables because the search field triggers a search with every key press.
            dataTablesOptions = {
                serverSide: true,
                searching: false,
                autoWidth: this.autoColumnWidth,
                ajax: dojoLang.hitch(this, this._getData),
                columns: dataTablesColumns
            };
            
            // Force sort on the first real column rather than the dummy column when column visibility is turned on.
            if (this.allowColumnVisibility && this.allowColumnReorder) {
                dataTablesOptions.order = [[ 1, "asc" ]];
            }
            
            dataTablesOptions.drawCallback = function () {
                this.api().rows().every(function (rowIdx, tableLoop, rowLoop) {
                    this.node().setAttribute("data-guid", this.data().guid);
                    if (thisObj.selectFirst && rowLoop === 0) {
                        this.select();
                    }
                });
            };

            // I18N
            locale = dojoKernel.locale;
            language = locale.substring(0, 2);
            if (this._i18nFilenames[locale]) {
                languageFilename = this._i18nFilenames[locale];
            } else if (this._i18nFilenames[language]) {
                languageFilename = this._i18nFilenames[language];
            }
            // If the file does not load, check that it has no comments in it as the parser does not like comments.
            if (languageFilename) {
                dataTablesOptions.language = {url: document.location.origin + "/widgets/DataTables/i18n/" + languageFilename};
            }

            // Responsive
            if (this.isResponsive) {
                dataTablesOptions.responsive = true;
            }
            
            // Column reorder
            if (this.allowColumnReorder) {
                dataTablesOptions.colReorder = { realtime: true };
                if (this.allowColumnVisibility) {
                    dataTablesOptions.colReorder.fixedColumnsLeft = 1;
                }
            }
            
            // The buttons extension consists of multiple modules. First include the common option then configure it.
            if (this.allowColumnVisibility) {
                dataTablesOptions.buttons = [];
            }
            // Skip dummy column so first column is not touched by column visibility
            // When the first column is hidden, column reorder shows the dragging line at the wrong position.
            if (this.allowColumnVisibility && this.allowColumnReorder) {
                dataTablesOptions.buttons.push({
                    extend: "colvis",
                    text: this.colVisButtonText,
                    columns: ":gt(0)"
                });
            }

            // Additional class(es) on the table itself
            if (this.tableClass) {
                this._tableNodelist.addClass(this.tableClass);
            }

            // State saving, only when local storage is available
            if (this.stateSaveName && typeof Storage !== "undefined") {
                // Turn it on
                dataTablesOptions.stateSave = true;

                // Override so start position and search data are not saved.
                dataTablesOptions.stateSaveParams = function (settings, data) {
                    data.start = 0;
                    data.search.search = "";
                };

                // Override save and load functions because Mendix widgets do not have a fixed HTML tag ID.
                dataTablesOptions.stateSaveCallback = function (settings, data) {
                    localStorage.setItem("MxDataTables_" + thisObj.stateSaveName, JSON.stringify(data));
                };
                dataTablesOptions.stateLoadCallback = function (settings) {
                    return JSON.parse(localStorage.getItem("MxDataTables_" + thisObj.stateSaveName));
                };
            }

            // Infinite scroll
            if (this.infiniteScroll) {
                // for normal paging, show the page length drop down.
                dataTablesOptions.scroller = {
                    loadingIndicator: true
                };
            }
            
            // Vertical scrolling
            if (this.scrollY) {
                dataTablesOptions.scrollY = this.scrollY;
            }
            
            // Selection
            if (this.selectionType !== "none") {
                dataTablesOptions.select = {
                    info: false,
                    style: this.selectionType
                };
            }

            // Set the DOM options, depending on other configuration options
            dataTablesOptions.dom = "";
            if (this.allowColumnVisibility) {
                // This option needs to be set too for the buttons plugin.
                dataTablesOptions.dom += "B";
            }
            if (!this.infiniteScroll) {
                // for normal paging, show the page length drop down.
                dataTablesOptions.dom += "l";
            }
            dataTablesOptions.dom += "rt";
                //dataTablesOptions.dom = "rtip";
            if (this.showTableInformation) {
                // Display table information: Showing 1 to 6 of 50,000 entries
                dataTablesOptions.dom += "i";
            }
            if (!this.infiniteScroll) {
                // for normal paging, show the paging buttons.
                dataTablesOptions.dom += "p";
            }
            
            // Create DataTables object
            table = this._tableNodelist.DataTable(dataTablesOptions);
            this._table = table;

            // Selection event
            this._table
                .on("select", function (e, dt, type, indexes) {
                    if (thisObj.selectionType !== "none") {
                        thisObj._setButtonEnabledStatus();
                    }
                    if (thisObj.selectionMicroflowName) {
                        thisObj._callSelectionMicroflow();
                    }
                })
                .on("deselect", function (e, dt, type, indexes) {
                    if (thisObj.selectionType !== "none") {
                        thisObj._setButtonEnabledStatus();
                    }
                    if (thisObj.selectionMicroflowName) {
                        thisObj._callSelectionMicroflow();
                    }
                });
            
            // Set additional column header classes on the generated table.
            dojoArray.forEach(this.columnList, function (column, i) {
                if (column.headerClass) {
                    $(this._table.column(i).header()).addClass(column.headerClass);
                }
            }, this);
            
            // Buttons
            this._buttonList = [];
            dojoArray.forEach(this.buttonDefinitionList, function (buttonDefinition, i) {
                var buttonHtml,
                    refNode,
                    refNodeList,
                    refNodePos;

                // Default button?
                if (buttonDefinition.isDefaultButton && !this._defaultButtonDefinition) {
                    this._defaultButtonDefinition = buttonDefinition;
                }
                
                // Create the basic HTML for the button
                buttonHtml  = "<button type='button' class='btn mx-button btn-" + buttonDefinition.buttonType + "'>";
                if (buttonDefinition.buttonGlyphiconClass) {
                    buttonHtml += "<span class='" + buttonDefinition.buttonGlyphiconClass + "'></span> "; // The space is intentional! Separation between icon and caption
                }
                buttonHtml += buttonDefinition.caption;
                buttonHtml += "</button>";
                
                // Put it in our own container or a specified one?
                refNode = this.buttonContainer;
                refNodePos = "last";
                if (buttonDefinition.placeRefCssSelector) {
                    refNodeList = dojoQuery(buttonDefinition.placeRefCssSelector);
                    if (refNodeList && refNodeList.length) {
                        refNode = refNodeList[0];
                        refNodePos = buttonDefinition.placeRefPos;
                    }
                }
                button = dojoConstruct.place(buttonHtml, refNode, refNodePos);
                if (buttonDefinition.buttonName) {
                    dojoClass.add(button, "mx-name-" + buttonDefinition.buttonName);
                }
                if (buttonDefinition.buttonClass) {
                    dojoClass.add(button, buttonDefinition.buttonClass);
                }
                dojoOn(button, "click", function () {
                    var guids = thisObj._getSelectedRows();
                    thisObj._callButtonMicroflow(buttonDefinition, guids);
                });
                this._buttonList.push(button);
            }, this);
            thisObj._setButtonEnabledStatus();
            // Show our own button container if it has child nodes.
            if (this.buttonContainer.hasChildNodes()) {
                dojoStyle.set(this.controlbar, "display", "block");
            }
            
            // Add click handler for default button
            if (this._defaultButtonDefinition) {
                $(this._tableNodelist).on("dblclick", "tr", function () {
                    thisObj._callButtonMicroflow(thisObj._defaultButtonDefinition, [this.getAttribute("data-guid")]);
                });
            }

        },
        
        // call button microflow
        _callButtonMicroflow: function (buttonDefinition, guids) {
            if (buttonDefinition.askConfirmation) {
                mx.ui.confirmation({
                    content: buttonDefinition.confirmationQuestion,
                    proceed: buttonDefinition.proceedCaption,
                    cancel: buttonDefinition.cancelCaption,
                    handler: function () {
                        mx.data.action({
                            params : {
                                applyto : "selection",
                                actionname : buttonDefinition.buttonMicroflowName,
                                guids : guids
                            }
                        });
                    }
                });
            } else {
                mx.data.action({
                    params : {
                        applyto : "selection",
                        actionname : buttonDefinition.buttonMicroflowName,
                        guids : guids
                    }
                });
            }
        },
        
        // Call selection microflow
        _callSelectionMicroflow: function () {
            var guids = this._getSelectedRows();
            mx.data.action({
                params : {
                    applyto : "selection",
                    actionname : this.selectionMicroflowName,
                    guids : guids
                }
            });
        },
        
        // Get selected rows
        _getSelectedRows: function () {
            var guids = [],
                rowDataArray = this._table.rows({selected: true}).data().toArray();
            dojoArray.forEach(rowDataArray, function (rowData) {
                guids.push(rowData.guid);
            });
            return guids;
        },
        
        // Get data 
        _getData: function (data, dataTablesCallback, settings) {
            logger.debug(this.id + "._getData");
            
            var hasConstraint = false,
                constraintValue,
                sortColumnIndex = data.order[0].column,
                sortColumn = data.columns[sortColumnIndex],
                thisObj = this,
                xpath,
                xpathAttrValue;
            
            this._resetRowObjectSubscriptions();
            
            xpath = "//" + this.tableEntity;
            if (this.xpathConstraintAttr) {
                xpathAttrValue = this._contextObj.get(this.xpathConstraintAttr);
                if (xpathAttrValue && xpathAttrValue.trim().length > 0) {
                    xpath += "[(" + xpathAttrValue.trim() + ")";
                    hasConstraint = true;
                }
            }
            
            dojoArray.forEach(this.attrSearchFilterList, function (searchFilter, i) {
                constraintValue = this._getConstraintValue(searchFilter.contextEntityAttr, searchFilter.attrName);
                if (constraintValue) {
                    if (hasConstraint) {
                        xpath += " and ";
                    } else {
                        xpath += "[";
                    }
                    hasConstraint = true;
                    switch (searchFilter.operatorType) {
                    case "st":
                        xpath += "starts-with(" + searchFilter.attrName + ", " + constraintValue + ")";
                        break;

                    case "ct":
                        xpath += "contains(" + searchFilter.attrName + ", " + constraintValue + ")";
                        break;

                    case "lt":
                        xpath += searchFilter.attrName + " < " + constraintValue;
                        break;

                    case "le":
                        xpath += searchFilter.attrName + " <= " + constraintValue;
                        break;

                    case "ge":
                        xpath += searchFilter.attrName + " >= " + constraintValue;
                        break;

                    case "gt":
                        xpath += searchFilter.attrName + " > " + constraintValue;
                        break;
                            
                    default:
                        xpath += searchFilter.attrName + " = " + constraintValue;
                    }
                }
            }, this);
            
            if (hasConstraint) {
                xpath += "]";
            }
            
            logger.debug(this.id + "._getData XPath: " + xpath);
            mx.data.get({
                xpath: xpath,
                count: true,
                filter: {
                    sort: [[sortColumn.data, data.order[0].dir]],
                    offset: data.start,
                    amount: data.length
                },
                callback: function (objs, extra) {
                    dataTablesCallback({
                        draw: data.draw,
                        data: thisObj._convertMendixObjectArrayToDataArray(objs),
                        recordsTotal: extra.count,
                        recordsFiltered: extra.count
                    });
                }
            });
        },
        
        _resetRowObjectSubscriptions: function () {
            if (this._rowObjectHandles) {
                dojoArray.forEach(this._rowObjectHandles, function (handle) {
                    mx.data.unsubscribe(handle);
                });
                this._rowObjectHandles = [];
            }
        },
        
        _convertMendixObjectArrayToDataArray: function (objs) {
            logger.debug(this.id + "._convertMendixObjectArrayToDataArray");
            var attrName,
                dataArray = [],
                dataObj;
            
            dojoArray.forEach(objs, function (obj) {
                dataObj = { guid: obj.getGuid(), colVisDummy: ""};
                dojoArray.forEach(this.columnList, function (column) {
                    attrName = column.attrName;
                    dataObj[attrName] = this._getDisplayValue(obj, column);
                }, this);
                dataArray.push(dataObj);
                var objectHandle = this.subscribe({
                    guid: dataObj.guid,
                    callback: dojoLang.hitch(this, function (guid) {
                        this._reloadTableData();
                    })
                });
                
            }, this);
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

        /**
         * Get the attribute value for use as constraint value
         *
         * @param attrName      The attribute name
         * @returns {string}    The value
         */
        _getConstraintValue : function (contextEntityAttr, attrName) {

            var attrType,
                attrValue,
                dateFormat,
                result;

            if (!this._contextObjMetaData.has(contextEntityAttr)) {
                console.error(this._contextObj.getEntity() + " does not have attribute " + contextEntityAttr);
                return null;
            }
            if (!this._entityMetaData.has(attrName)) {
                console.error(this._contextObj.getEntity() + " does not have attribute " + attrName);
                return null;
            }
            
            attrValue = this._contextObj.get(contextEntityAttr);
            
            if (!attrValue || (attrType === "String" && attrValue.trim().length === 0)) {
                return null;
            }

            // Use the type of the grid entity attribute. Important for boolean because the context entity attribute will be an enum.
            attrType = this._entityMetaData.getAttributeType(attrName);
            
            switch (attrType) {
            case "String":
                // Return the string value between quotes and replace any single or double quotes in the value
                result = "\'" + attrValue.trim().replace("\'", "&#39;").replace("\"", "&#34;") + "\'";
                break;

            case "Enum":
                // Return the string value between quotes
                result = "\'" + attrValue + "\'";
                break;

            case "Boolean":
                // A boolean directly as filter is not a good solution as you can never tell the difference between false and no value.
                // So, an enum is expected, starting with 't' indicate true, anything else is false.
                if (attrValue.toLowerCase() === "t") {
                    result = "true()";
                } else {
                    result = "false()";
                }
                break;
            case "Decimal":
                result = attrValue.toString();
                break;
                    
            default:
                result = attrValue;
            }

            return result;
        },
        
        _reloadTableData: function () {
            if (this._table) {
                this._table.ajax.reload(null, false);
            }
        },
        
        // Rerender the interface.
        _updateRendering: function () {
            logger.debug(this.id + "._updateRendering");

            if (this._contextObj !== null) {
                this._contextObjMetaData = mx.meta.getEntity(this._contextObj.getEntity());
                if (this._table) {
                    if (this.refreshAttr && this._contextObj.get(this.refreshAttr)) {
                        this._contextObj.set(this.refreshAttr, false);
                        mx.data.save({
                            mxobj: this._contextObj,
							callback: function () {
								logger.debug("Object saved");
							}
                        });
                        this._reloadTableData();
                    }
                } else {
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
            this._resetRowObjectSubscriptions();
        },
        
        // Enable/Disable buttons when selection changes
        _setButtonEnabledStatus: function () {
            logger.debug(this.id + "._setButtonEnabledStatus");
            var hasSelection = (this._table.rows({selected: true}).data().toArray().length > 0);
            dojoArray.forEach(this._buttonList, function (button) {
                if (hasSelection) {
                    button.removeAttribute("disabled");
                } else {
                    button.setAttribute("disabled", "");
                }
            }, this);
        },

        // Reset subscriptions.
        _resetSubscriptions: function () {
            logger.debug(this.id + "._resetSubscriptions");
            
            var objectHandle;
            
            // Release handles on previous object, if any.
            if (this._handles) {
                dojoArray.forEach(this._handles, function (handle) {
                    mx.data.unsubscribe(handle);
                });
                this._handles = [];
            }

            // When a mendix object exists create subscribtions.
            if (this._contextObj) {
                objectHandle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: dojoLang.hitch(this, function (guid) {
                        this._updateRendering();
                    })
                });
                this._handles = [ objectHandle ];
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
