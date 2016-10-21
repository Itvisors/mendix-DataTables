/*jshint undef: true, browser:true, nomen: true */
/*jslint browser:true, nomen: true */
/*global mx, mxui, define, require, console, logger, alert */
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
    "DataTables/lib/jquery.dataTables",
    "DataTables/lib/dataTables.bootstrap"
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
        colVisPlaceRefCssSelector: "",
        colVisPlaceRefPos: "",
        colVisButtonClass: "",
        tableClass: "",
        stateSaveName: null,
        showTableInformation: true,
        infiniteScroll: false,
        scrollX: false,
        scrollY: null,
        selectionType: null,
        selectFirst: false,
        selectionMicroflowName: "",
        columnList: null,
        attrSearchFilterList: null,
        refSearchFilterList: null,
        buttonDefinitionList: null,
        buttonPlacementDelay: 0,
        
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
        _referenceColumns: null,
        _hasReferenceColumns: false,
        _trDataAttrNames: null,
        
        // I18N file names object at the end, out of sight!

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            // Uncomment the following line to enable debug messages
            //logger.level(logger.DEBUG);
            logger.debug(this.id + ".constructor");
            this._rowObjectHandles = [];
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
                moduleList.push("DataTables/lib/responsive.bootstrap");
            }
            if (this.allowColumnReorder) {
                moduleList.push("DataTables/lib/dataTables.colReorder");
            }
            // The buttons extension consists of multiple modules. First include the common module then the necessary specific ones.
            if (this.allowColumnVisibility) {
                moduleList.push("DataTables/lib/dataTables.buttons");
                moduleList.push("DataTables/lib/buttons.bootstrap");
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
                colVisButtonNodeList,
                colVisRefNodeList,
                dataTablesOptions,
                dataTablesColumns = [],
                dataTablesColumn,
                locale,
                language,
                languageFilename = null,
                referencePropertyName,
                sortIndex,
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
            this._referenceColumns = {};
            this._hasReferenceColumns = false;
            this._trDataAttrNames = [];
            dojoArray.forEach(this.columnList, function (column) {
                dataTablesColumn = {
                    title: column.caption,
                    data: column.attrName,
                    name: column.attrName,
                    visible: column.initiallyVisible
                };
                dataTablesColumn.orderable = column.allowSort;
                if (this.isResponsive) {
                    dataTablesColumn.responsivePriority = column.responsivePriority;
                }
                if (column.columnWidth) {
                    dataTablesColumn.width = column.columnWidth;
                }
                if (column.cellClass) {
                    dataTablesColumn.className = column.cellClass;
                }
                if (column.refName) {
                    referencePropertyName = this._getReferencePropertyName(column);
                    this._referenceColumns[referencePropertyName] = column;
                    this._hasReferenceColumns = true;
                    dataTablesColumn.data = referencePropertyName;
                    dataTablesColumn.name = referencePropertyName;
                }
                if (column.includeAsTrDataAttr) {
                    this._trDataAttrNames.push(dataTablesColumn.data);
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
            
            // Search for the first orderable column
            sortIndex = -1;
            dojoArray.forEach(dataTablesColumns, function (dataTablesColumn, i) {
                if (dataTablesColumn.orderable && sortIndex < 0) {
                    sortIndex = i;
                }
            });
            if (sortIndex < 0) {
                alert("None of the columns are orderable, defaulting to the first column");
                sortIndex = 0;
            }
            dataTablesOptions.order = [[ sortIndex, "asc" ]];
            
            dataTablesOptions.drawCallback = function () {
                var dataTablesThisObj = this;
                this.api().rows().every(function (rowIdx, tableLoop, rowLoop) {
                    var rowData = this.data(),
                        trNode = this.node();
                    trNode.setAttribute("data-guid", rowData.guid);
                    dojoArray.forEach(thisObj._trDataAttrNames, function (attrName) {
                        var attrNameInternal = attrName + "-internal";
                        // When available, use the internal value, this is for boolean and enum.
                        if (rowData.hasOwnProperty(attrNameInternal)) {
                            trNode.setAttribute("data-" + attrName, rowData[attrNameInternal]);
                        } else {
                            trNode.setAttribute("data-" + attrName, rowData[attrName]);
                        }
                    });
                    dojoArray.forEach(dataTablesColumns, function (column, i) {
                        var cellNode;
                        cellNode = dataTablesThisObj.api().cell({row : rowIdx, column : i}).node();
                        cellNode.setAttribute("data-columnName", column.name);
                    }, this);
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
            
            // Horizontal scrolling
            if (this.scrollX) {
                dataTablesOptions.scrollX = true;
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
            
            
            // Buttons, use a timeout to make sure that Mendix has created the page before we attempt to show buttons in another container.
            setTimeout(function () {
            
                // Place (move) the column visibility button if desired.
                if (thisObj.allowColumnVisibility) {
                    colVisButtonNodeList = dojoQuery(".buttons-colvis", thisObj.domNode);
                    if (thisObj.colVisPlaceRefCssSelector) {
                        colVisRefNodeList = dojoQuery(thisObj.colVisPlaceRefCssSelector);
                        if (colVisRefNodeList && colVisRefNodeList.length && colVisButtonNodeList && colVisButtonNodeList.length) {
                            dojoConstruct.place(colVisButtonNodeList[0], colVisRefNodeList[0], thisObj.colVisPlaceRefPos);
                        }
                    }
                    if (thisObj.colVisButtonClass) {
                        colVisButtonNodeList.addClass(thisObj.colVisButtonClass);
                    }
                }
                
                thisObj._buttonList = [];
                dojoArray.forEach(thisObj.buttonDefinitionList, function (buttonDefinition, i) {
                    var buttonHtml,
                        refNode,
                        refNodeList,
                        refNodePos;

                    // Default button?
                    if (buttonDefinition.isDefaultButton && !thisObj._defaultButtonDefinition) {
                        thisObj._defaultButtonDefinition = buttonDefinition;
                    }

                    // Create the basic HTML for the button
                    buttonHtml  = "<button type='button' class='btn mx-button btn-" + buttonDefinition.buttonType + "'>";
                    if (buttonDefinition.buttonGlyphiconClass) {
                        buttonHtml += "<span class='" + buttonDefinition.buttonGlyphiconClass + "'></span> "; // The space is intentional! Separation between icon and caption
                    }
                    buttonHtml += buttonDefinition.caption;
                    buttonHtml += "</button>";

                    // Put it in our own container or a specified one?
                    refNode = thisObj.buttonContainer;
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
                    thisObj._buttonList.push(button);
                }, thisObj);
                thisObj._setButtonEnabledStatus();
                // Show our own button container if it has child nodes.
                if (thisObj.buttonContainer.hasChildNodes()) {
                    dojoStyle.set(thisObj.controlbar, "display", "block");
                }

                // Add click handler for default button
                if (thisObj._defaultButtonDefinition) {
                    $(thisObj._tableNodelist).on("dblclick", "tr", function () {
                        thisObj._callButtonMicroflow(thisObj._defaultButtonDefinition, [this.getAttribute("data-guid")]);
                    });
                }
            }, thisObj.buttonPlacementDelay);

        },
        
        // call button microflow
        _callButtonMicroflow: function (buttonDefinition, guids) {
            if (buttonDefinition.askConfirmation) {
                mx.ui.confirmation({
                    content: buttonDefinition.confirmationQuestion,
                    proceed: buttonDefinition.proceedCaption,
                    cancel: buttonDefinition.cancelCaption,
                    handler: function () {
                        this._clearSelection();
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
                this._clearSelection();
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
        _getSelectedRowData: function () {
            return this._table.rows({selected: true}).data().toArray();
        },
        
        // Get selected rows
        _getSelectedRows: function () {
            var guids = [],
                rowDataArray = this._getSelectedRowData();
            dojoArray.forEach(rowDataArray, function (rowData) {
                guids.push(rowData.guid);
            });
            return guids;
        },
        
        _resetRowObjectSubscriptions: function () {
            if (this._rowObjectHandles) {
                dojoArray.forEach(this._rowObjectHandles, function (handle) {
                    mx.data.unsubscribe(handle);
                });
                this._rowObjectHandles = [];
            }
        },

        // Get reference property name
        _getReferencePropertyName: function (column) {
            // Remove the dot from the reference name as DataGrid would expect an object under the data object.
            return column.refName.replace(".", "$") + "_" + column.attrName;
        },

        // Get data 
        _getData: function (data, dataTablesCallback, settings) {
            logger.debug(this.id + "._getData");
            
            var dataArray,
                hasConstraint = false,
                sortColumnIndex = data.order[0].column,
                sortColumn = data.columns[sortColumnIndex],
                referenceColumnDef,
                sortName,
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
                var constraintValue = this._getConstraintValue(searchFilter.contextEntityAttr, searchFilter.attrName);
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

            dojoArray.forEach(this.refSearchFilterList, function (searchFilter, i) {
                // Take off the referenced entity name when getting the reference guid.
                var constraintValue = this._contextObj.getReference(searchFilter.contextEntityRef.substr(0, searchFilter.contextEntityRef.indexOf("/")));
                if (constraintValue) {
                    if (hasConstraint) {
                        xpath += " and ";
                    } else {
                        xpath += "[";
                    }
                    hasConstraint = true;
                    xpath += searchFilter.refName + " = " + constraintValue;
                }
            }, this);
            
            if (hasConstraint) {
                xpath += "]";
            }
            
            if (this._referenceColumns[sortColumn.name]) {
                referenceColumnDef = this._referenceColumns[sortColumn.name];
                sortName = referenceColumnDef.refName + "/" + this._entityMetaData.getSelectorEntity(referenceColumnDef.refName) + "/" + referenceColumnDef.attrName;
            } else {
                sortName = sortColumn.data;
            }
            
            logger.debug(this.id + "._getData XPath: " + xpath);
            mx.data.get({
                xpath: xpath,
                noCache: true,
                count: true,
                filter: {
                    sort: [[sortName, data.order[0].dir]],
                    offset: data.start,
                    amount: data.length
                },
                callback: function (objs, extra) {
                    var refGuids;
                    dataArray = thisObj._convertMendixObjectArrayToDataArray(objs);
                    if (thisObj._hasReferenceColumns) {
                        // Get referenced objects first and supplement the data objects.
                        refGuids = thisObj._getReferencedGuids(dataArray);
                        mx.data.get({
                            guids: refGuids,
                            noCache: false,
                            count: false,
                            callback: function (refObjs) {
                                thisObj._includeReferencedObjData(dataArray, refObjs);
                                dataTablesCallback({
                                    draw: data.draw,
                                    data: dataArray,
                                    recordsTotal: extra.count,
                                    recordsFiltered: extra.count
                                });
                            }
                        });
                        
                    } else {
                        // No referenced objects, just return the data.
                        dataTablesCallback({
                            draw: data.draw,
                            data: dataArray,
                            recordsTotal: extra.count,
                            recordsFiltered: extra.count
                        });
                    }
                }
            });
        },

        // Convert returned data to plain data object
        _convertMendixObjectArrayToDataArray: function (objs) {
            logger.debug(this.id + "._convertMendixObjectArrayToDataArray");
            var dataArray = [],
                dataObj,
                referencePropertyName;
            
            dojoArray.forEach(objs, function (obj) {
                dataObj = { guid: obj.getGuid(), colVisDummy: ""};
                dojoArray.forEach(this.columnList, function (column) {
                    var attrName = column.attrName,
                        attrNameInternal,
                        attrType = this._entityMetaData.getAttributeType(attrName);
                    if (column.refName) {
                        referencePropertyName = this._getReferencePropertyName(column);
                        dataObj[referencePropertyName] = obj.getReference(column.refName);
                    } else {
                        dataObj[attrName] = this._getDisplayValue(obj, attrType, column);
                        // For boolean and enum, include internal value in the data object as well.
                        if (attrType === "Boolean" || attrType === "Enum") {
                            attrNameInternal = attrName + "-internal";
                            dataObj[attrNameInternal] = obj.get(attrName);
                        }
                    }
                }, this);
                dataArray.push(dataObj);
                var objectHandle = this.subscribe({
                    guid: dataObj.guid,
                    callback: dojoLang.hitch(this, function (guid) {
                        this._reloadTableData(false);
                    })
                });
                this._rowObjectHandles.push(objectHandle);
                
            }, this);
            return dataArray;
        },

        // Get referenced guids.
        _getReferencedGuids: function (dataArray) {
            var guid,
                guidArray = [],
                guidMap = {}; // We want each guid only once, so start with an object rather than an array.
            dojoArray.forEach(dataArray, function (data) {
                var referenceColumnName;
                for (referenceColumnName in this._referenceColumns) {
                    if (this._referenceColumns.hasOwnProperty(referenceColumnName)) {
                        guid = data[referenceColumnName];
                        if (guid) {
                            guidMap[guid] = "Y";
                        }
                    }
                }
            }, this);
            
            for (guid in guidMap) {
                if (guidMap.hasOwnProperty(guid)) {
                    guidArray.push(guid);
                }
            }
            return guidArray;
        },

        // Include referenced object data in the data array
        _includeReferencedObjData: function (dataArray, refObjs) {
            var guid,
                refObj,
                refObjMap = {};
            // Create a map of the returned objects;
            dojoArray.forEach(refObjs, function (obj) {
                refObjMap[obj.getGuid()] = obj;
            }, this);
            dojoArray.forEach(dataArray, function (data) {
                var attrName,
                    attrType,
                    column,
                    referenceColumnName,
                    referenceColumnNameInternal;
                for (referenceColumnName in this._referenceColumns) {
                    if (this._referenceColumns.hasOwnProperty(referenceColumnName)) {
                        guid = data[referenceColumnName];
                        if (guid) {
                            refObj = refObjMap[guid];
                            if (refObj) {
                                column = this._referenceColumns[referenceColumnName];
                                attrType = mx.meta.getEntity(refObj.getEntity()).getAttributeType(column.attrName);
                                data[referenceColumnName] = this._getDisplayValue(refObj, attrType, column);
                                // For boolean and enum, include internal value in the data object as well.
                                if (attrType === "Boolean" || attrType === "Enum") {
                                    referenceColumnNameInternal = referenceColumnName + "-internal";
                                    data[referenceColumnName] = refObj.get(column.attrName);
                                }
                            }
                        }
                    }
                }
            }, this);
        },

        // Get the attribute value for use as display value
        _getDisplayValue : function (obj, attrType, column) {

            var attrName,
                dateFormat,
                result;

            attrName = column.attrName;

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

            case "Decimal":
                result = mx.parser.formatAttribute(obj, attrName, { places: column.decimalPositions, groups: column.groupDigits });
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
        
        _reloadTableData: function (resetPaging) {
            if (this._table) {
                this._table.ajax.reload(null, resetPaging);
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
                        this._reloadTableData(true);
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
        
        // Clear selection
        _clearSelection: function () {
            logger.debug(this.id + "._clearSelection");
            this._table.rows({selected: true}).deselect();
            this._setButtonEnabledStatus();
        },
        
        // Enable/Disable buttons when selection changes
        _setButtonEnabledStatus: function () {
            logger.debug(this.id + "._setButtonEnabledStatus");
            var attrValue,
                buttonDefinition,
                buttonEnabled,
                hasSelection,
                rowDataArray;
            rowDataArray = this._getSelectedRowData();
            hasSelection = (rowDataArray.length > 0);
            dojoArray.forEach(this._buttonList, function (button, i) {
                if (hasSelection) {
                    // When there is a selection, check whether the button is enabled depending on an attribute value.
                    // The button will be enabled when the value matches for all selected rows.
                    buttonEnabled = true;
                    buttonDefinition = this.buttonDefinitionList[i];
                    if (buttonDefinition.enabledAttrName && buttonDefinition.enabledValue) {
                        dojoArray.forEach(rowDataArray, function (rowData) {
                            var attrNameInternal = buttonDefinition.enabledAttrName + "-internal";
                            // When available, use the internal value, this is for boolean and enum.
                            if (rowData.hasOwnProperty(attrNameInternal)) {
                                attrValue = rowData[attrNameInternal];
                            } else {
                                attrValue = rowData[buttonDefinition.enabledAttrName];
                            }
                            if (typeof attrValue === "boolean") {
                                attrValue = attrValue.toString();
                            }
                            if (attrValue !== buttonDefinition.enabledValue) {
                                buttonEnabled = false;
                            }
                        });
                    }
                    if (buttonEnabled) {
                        button.removeAttribute("disabled");
                    } else {
                        button.setAttribute("disabled", "");
                    }
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
            "pt-br": "Portuguese-Brasil.lang",
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
