/*jshint undef: true, browser:true, nomen: true */
/*jslint browser:true, nomen: true */
/*global mx, mxui, define, require, console, logger, alert */
/*
    DataTables
    ========================

    @file      : DataTables.js
    @version   : 1.6.2
    @author    : Marcel Groeneweg
    @date      : Sat, 12 Mar 2016 13:19:22 GMT
    @copyright :
    @license   : Apache 2

    Documentation
    ========================
    Datatables widget.
*/

// Required module list.
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
    "DataTables/lib/dataTables.responsive",
    "DataTables/lib/responsive.bootstrap",
    "DataTables/lib/dataTables.colReorder",
    "DataTables/lib/dataTables.buttons",
    "DataTables/lib/buttons.bootstrap",
    "DataTables/lib/buttons.colVis",
    "DataTables/lib/dataTables.scroller",
    "DataTables/lib/dataTables.select",
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
        tableToConvert: null,

        // Parameters configured in the Modeler.
        tableEntity: null,
        refreshAttr: null,
        refreshKeepScrollPosAttr: null,
        xpathConstraintAttr: "",
        allowMultiColumnSort: false,
        showProgressGetData: false,
        isResponsive: false,
        autoColumnWidth: true,
        allowColumnReorder: true,
        visibleColumnsAttr: "",
        allowColumnVisibility: false,
        colVisButtonText: "",
        colVisPlaceRefCssSelector: "",
        colVisPlaceRefPos: "",
        colVisButtonClass: "",
        tableClass: "",
        stateSaveName: null,
        stateDuration: 0,
        showTableInformation: true,
        infiniteScroll: false,
        scrollX: false,
        scrollY: null,
        selectionType: null,
        selectFirst: false,
        allowDeselect: true,
        selectionMicroflowName: "",
        columnList: null,
        attrSearchFilterList: null,
        refSearchFilterList: null,
        buttonDefinitionList: null,
        buttonPlacementDelay: 0,
        scrollBufferMultiplier: 9,
        allowExport: false,
        exportButtonCaption: "",
        exportVisibleColumnsOnly: true,
        exportConfigAttr: "",
        exportXPathAttr: "",
        exportButtonType: "",
        exportButtonClass: "",
        exportButtonGlyphiconClass: "",
        exportButtonPlaceRefCssSelector: "",
        exportButtonPlaceRefPos: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handles: null,
        _progressDialogId: null,
        _rowObjectHandles: null,
        _contextObj: null,
        _contextObjMetaData: null,
        _entityMetaData: null,
        _table: null,
        _hasDummyColumn: false,
        _buttonList: null,
        _defaultButtonDefinition: null,
        _referenceColumns: null,
        _hasReferenceColumns: false,
        _tdDataAttrNames: null,
        _trDataAttrNames: null,
        _sortData: null,
        _exportButton: null,
        _scrollerPage: null,
        _previousSelection: null,
        _uninitializeCalled: false,
        _visibleColumnIndexArray: null,
        _previousVisibleColumnsValue: "",

        // I18N file names object at the end, out of sight!

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            // Uncomment the following line to enable debug messages
            //logger.level(logger.DEBUG);
            logger.debug(this.id + ".constructor");
            this._rowObjectHandles = [];
            this._handles = [];
            this._visibleColumnIndexArray = [];
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            logger.debug(this.id + ".postCreate");

            var thisObj = this;

            this._entityMetaData = mx.meta.getEntity(this.tableEntity);
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

        // mxui.widget._WidgetBase.resize is called when the page's layout is recalculated. Implement to do sizing calculations. Prefer using CSS instead.
        resize: function (box) {
            logger.debug(this.id + ".resize");
        },

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function () {
            logger.debug(this.id + ".uninitialize");
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
            // A callback could be triggered while the page is destroyed. Turn on a flag which allows callbacks to know they should just quit.
            this._uninitializeCalled = true;
            this._clearTableData();
            this._table = null;
            this._buttonList = null;
            this._exportButton = null;
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
                sortIndex,
                table,
                tableNodeList,
                thisObj = this;

            this._loadVisibleColumnIndexArray();

            // Add dummy column when column visibility is turned on, to prevent rendering issues.
            // When the first column is hidden, column reorder shows the dragging line at the wrong position.
            this._hasDummyColumn = false;
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
                this._hasDummyColumn = true;
            }

            // Process column definitions.
            this._referenceColumns = {};
            this._hasReferenceColumns = false;
            this._trDataAttrNames = [];
            this._tdDataAttrNames = [];
            dojoArray.forEach(this.columnList, function (column, i) {
                var referencePropertyName,
                    visible = column.initiallyVisible;

                if (this._visibleColumnIndexArray.length > 0) {
                    visible = (this._visibleColumnIndexArray.indexOf(i) >= 0);
                }

                dataTablesColumn = {
                    title: column.caption,
                    data: column.attrName,
                    name: column.attrName,
                    visible: visible
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
                if (column.includeAsTdDataAttr) {
                    this._tdDataAttrNames.push({
                        name: dataTablesColumn.data,
                        index: dataTablesColumns.length
                    });
                }
                dataTablesColumns.push(dataTablesColumn);
            }, this);

            // searching is handled in the widget and XPath, not in DataTables because the search field triggers a search with every key press.
            dataTablesOptions = {
                serverSide: true,
                searching: false,
                autoWidth: this.autoColumnWidth,
                orderMulti: this.allowMultiColumnSort,
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

            dataTablesOptions.drawCallback = function (settings) {
                if (thisObj._uninitializeCalled) {
                    console.log(thisObj.id + "DataTables drawCallback called but widget is being destroyed.");
                    return;
                }
                dojoArray.forEach(thisObj.columnList, function (column, arrayIndex) {
                    var columnIndex = arrayIndex;
                    // Add one to the index when we have a dummy column to match the column definition index with the table column index.
                    if (thisObj._hasDummyColumn) {
                        columnIndex++;
                    }
                    if (column.headerTooltip) {
                        thisObj._table.column(columnIndex).header().title = column.headerTooltip;
                    }
                });

                thisObj._table.rows().every(function (rowIdx, tableLoop, rowLoop) {
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
                    dojoArray.forEach(thisObj._tdDataAttrNames, function (tdData) {
                        var cellNode,
                            colIdx;
                        if (thisObj.allowColumnReorder) {
                            colIdx = thisObj._table.colReorder.transpose(tdData.index);
                        } else {
                            colIdx = tdData.index;
                        }
                        cellNode = thisObj._table.cell({row : rowIdx, column : colIdx}).node();
                        cellNode.setAttribute("data-columnName", tdData.name);
                    }, this);
                    // Select the first row, unless there is already a selection. The draw callback can be called multiple times.
                    if (thisObj.selectFirst && rowLoop === 0 && !thisObj._table.rows({selected: true}).any()) {
                        this.select();
                    }
                });
                if (thisObj.infiniteScroll && thisObj._scrollerPage) {
                    // For infinite scroll, scroll to the previous scroller position.
                    thisObj._table.scroller().scrollToRow(thisObj._scrollerPage.start, false);
                    thisObj._scrollerPage = null;
                }
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
                dojoClass.add(this.tableToConvert, this.tableClass);
            }

            // State saving, only when local storage is available
            if (this.stateSaveName && typeof Storage !== "undefined") {
                // Turn it on
                dataTablesOptions.stateSave = true;

                // Override so start position and search data are not saved.
                dataTablesOptions.stateSaveParams = function (settings, data) {
                    if (thisObj.stateDuration >= 0) {
                        data.stateDuration = thisObj.stateDuration;
                    }
                    data.start = 0;
                    data.iScroller = 0;
                    data.iScrollerTopRow = 0;
                    data.search.search = "";
                };

                // Override to force keeping the state actual.
                dataTablesOptions.stateLoadParams = function (settings, data) {
                    if (thisObj.stateDuration === 0) {
                        var stateDate = new Date();
                        stateDate.setFullYear(stateDate.getFullYear() + 1);
                        data.time = +stateDate;
                    }
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
                    loadingIndicator: true,
                    displayBuffer: this.scrollBufferMultiplier
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
            this.tableToConvert.id = this.domNode.id + "_tableToConvert";
            tableNodeList = $("#" + this.tableToConvert.id);
            table = tableNodeList.DataTable(dataTablesOptions);
            this._table = table;

            // Selection event
            this._table
                .on("select", function (e, dt, type, indexes) {
                    if (thisObj.selectionType !== "none") {
                        thisObj._setButtonEnabledStatus("select");
                    }
                    if (thisObj.selectionMicroflowName) {
                        thisObj._callSelectionMicroflow();
                    }
                })
                .on("deselect", function (e, dt, type, indexes) {
                    if (thisObj.selectionType !== "none") {
                        thisObj._setButtonEnabledStatus("deselect");
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
                        thisObj._handleButtonClick(buttonDefinition, guids);
                    });
                    thisObj._buttonList.push(button);
                }, thisObj);
                thisObj._setButtonEnabledStatus();

                // Add click handler for default button
                if (thisObj._defaultButtonDefinition) {
                    $(tableNodeList).on("dblclick", "tr", function () {
                        thisObj._handleButtonClick(thisObj._defaultButtonDefinition, [this.getAttribute("data-guid")]);
                    });
                }

                // Export button
                if (thisObj.allowExport && thisObj._checkExportConfiguration()) {
                    thisObj._createExportButton();
                }

                // Show our own button container if it has child nodes.
                if (thisObj.buttonContainer.hasChildNodes()) {
                    dojoStyle.set(thisObj.controlbar, "display", "block");
                }
            }, thisObj.buttonPlacementDelay);

        },

        _loadVisibleColumnIndexArray: function () {
            logger.debug(this.id + "._loadVisibleColumnIndexArray");
            var inputArray,
                visibleColumns;

            this._visibleColumnIndexArray = [];

            // No action when user may select visible columns
            if (!this.visibleColumnsAttr || this.allowColumnVisibility) {
                return;
            }

            visibleColumns = this._contextObj.get(this.visibleColumnsAttr);
            this._previousVisibleColumnsValue = visibleColumns;

            if (visibleColumns === null || visibleColumns.trim() === "") {
                return;
            }
            // Split the value across comma's.
            inputArray = visibleColumns.split(",");
            dojoArray.forEach(inputArray, function (element) {
                // Skip empty elements
                if (element) {
                    if (isNaN(element)) {
                        console.error(this.id + "._loadVisibleColumnIndexArray: value [" + element + "] is not a number");
                    } else {
                        this._visibleColumnIndexArray.push(Number(element));
                    }
                }
            }, this);
        },

        _setVisibleColumns: function () {
            logger.debug(this.id + "._setVisibleColumns");
            var thisObj = this;

            // No action when user may select visible columns
            if (this.allowColumnVisibility) {
                return;
            }

            if (this._table) {
                // For each column check whether it should be visible.
                this._table.columns().every( function (i) {
                    // Context object (this) is the column!
                    if (thisObj._visibleColumnIndexArray.length === 0) {
                        // No elements in array so show all columns.
                        this.visible(true, false);
                    } else {
                        // Array has elements, show column if its index is in the array.
                        this.visible(thisObj._visibleColumnIndexArray.indexOf(i) >= 0, false);
                    }
                });
                // Now redraw the columns
                this._table.columns.adjust().draw();
            }

        },

        // Check export configuration
        _checkExportConfiguration: function () {
            logger.debug(this.id + "._checkExportConfiguration");
            var result = true;

            if (!this.exportConfigAttr) {
                logger.error(this.id + "._checkExportConfiguration: Export configuration attribute not set");
                result = false;
            }

            if (!this.exportXPathAttr) {
                logger.error(this.id + "._checkExportConfiguration: Export XPath constraint attribute not set");
                result = false;
            }

            if (!this.exportMicroflow) {
                logger.error(this.id + "._checkExportConfiguration: Export microflow not set");
                result = false;
            }

            return result;
        },

        _createExportButton: function () {
            logger.debug(this.id + "._createExportButton");
            var buttonHtml,
                refNode,
                refNodeList,
                refNodePos,
                thisObj = this;


            // Create the basic HTML for the button
            buttonHtml  = "<button type='button' class='btn mx-button btn-" + this.exportButtonType + "'>";
            if (this.exportButtonGlyphiconClass) {
                buttonHtml += "<span class='" + this.exportButtonGlyphiconClass + "'></span> "; // The space is intentional! Separation between icon and caption
            }
            buttonHtml += this.exportButtonCaption;
            buttonHtml += "</button>";

            // Put it in our own container or a specified one?
            refNode = this.buttonContainer;
            refNodePos = "last";
            if (this.exportButtonPlaceRefCssSelector) {
                refNodeList = dojoQuery(this.exportButtonPlaceRefCssSelector);
                if (refNodeList && refNodeList.length) {
                    refNode = refNodeList[0];
                    refNodePos = this.exportButtonPlaceRefPos;
                }
            }
            this._exportButton = dojoConstruct.place(buttonHtml, refNode, refNodePos);
            dojoClass.add(this._exportButton, "mx-name-DataTablesExportButton");
            if (this.exportButtonClass) {
                dojoClass.add(this._exportButton, this.exportButtonClass);
            }
            dojoOn(this._exportButton, "click", function () {
                thisObj._contextObj.set(thisObj.exportConfigAttr, thisObj._createExportConfigData());
                thisObj._contextObj.set(thisObj.exportXPathAttr, thisObj._createXPathConstraint());
                thisObj._showProgress();
                mx.data.action({
                    params : {
                        applyto    : "selection",
                        actionname : thisObj.exportMicroflow,
                        guids      : [thisObj._contextObj.getGuid()]
                    },
                    callback: function () {
                        logger.debug("Export MF callback");
                        thisObj._hideProgress();
                    },
                    error: function (error) {
                        logger.error("Call to " + thisObj.exportMicroflow + " ended in error");
                        console.dir(error);
                        thisObj._hideProgress();
                    }
                });
            });
        },

        _createExportConfigData: function () {

            var configData,
                thisObj = this;

            configData = {
                tableEntity : this.tableEntity,
                exportVisibleColumnsOnly : this.exportVisibleColumnsOnly,
                sortData : [],
                columns : []
            };
            if (this.allowColumnReorder) {
                dojoArray.forEach(this._table.colReorder.order(), function (colIdx) {
                    var colDefIdx,
                        configColumn;
                    if (this._hasDummyColumn) {
                        colDefIdx = colIdx - 1;
                    } else {
                        colDefIdx = colIdx;
                    }
                    if (colDefIdx >= 0) {
                        configColumn = this._createExportConfigColumn(this.columnList[colDefIdx]);
                        if (configColumn) {
                            configData.columns.push(configColumn);
                        }
                    }
                }, this);
            } else {
                dojoArray.forEach(this.columnList, function (column) {
                    var configColumn = this._createExportConfigColumn(column);
                    if (configColumn) {
                        configData.columns.push(configColumn);
                    }
                }, this);
            }
            //
            dojoArray.forEach(this._sortData, function (sortDataItem) {
                configData.sortData.push({
                    name: sortDataItem[0],
                    dir: sortDataItem[1]
                });
            }, this);
            return JSON.stringify(configData);
        },

        _createExportConfigColumn: function (column) {
            var configColumn,
                columnName,
                dataTablesColumn,
                visible;

            if (column.refName) {
                columnName = this._getReferencePropertyName(column);
            } else {
                columnName = column.attrName;
            }

            dataTablesColumn = this._table.column(columnName + ":name");
            visible = dataTablesColumn.visible();

            if (this.exportVisibleColumnsOnly && !visible) {
                return null;
            }

            configColumn = {
                caption: column.caption,
                attrName: column.attrName,
                refName: column.refName,
                dateTimeType: column.dateTimeType,
                dateFormat: column.dateFormat,
                dateTimeFormat: column.dateTimeFormat,
                timeFormat: column.timeFormat,
                groupDigits: column.groupDigits,
                decimalPositions: column.decimalPositions,
                visible: visible
            };
            return configColumn;
        },

        // call button microflow
        _handleButtonClick: function (buttonDefinition, guids) {
            var thisObj = this;
            if (buttonDefinition.askConfirmation) {
                mx.ui.confirmation({
                    content: buttonDefinition.confirmationQuestion,
                    proceed: buttonDefinition.proceedCaption,
                    cancel: buttonDefinition.cancelCaption,
                    handler: function () {
                        thisObj._callButtonMicroflow(buttonDefinition, guids);
                    }
                });
            } else {
                this._callButtonMicroflow(buttonDefinition, guids);
            }
        },

        // call button microflow
        _callButtonMicroflow: function (buttonDefinition, guids) {
            var thisObj = this;

            this._clearSelection();
            if (buttonDefinition.showProgress) {
                this._showProgress();
                mx.data.action({
                    params : {
                        applyto : "selection",
                        actionname : buttonDefinition.buttonMicroflowName,
                        guids : guids
                    },
                    origin: this.mxform,
                    callback: function () {
                        thisObj._hideProgress();
                    },
                    error: function (error) {
                        logger.error("Call to " + buttonDefinition.buttonMicroflowName + " ended in error");
                        console.dir(error);
                        thisObj._hideProgress();
                    },
                    onValidation: function () {
                        thisObj._hideProgress();
                    }
                });
            } else {
                mx.data.action({
                    params : {
                        applyto : "selection",
                        actionname : buttonDefinition.buttonMicroflowName,
                        guids : guids
                    },
                    origin: this.mxform
                });
            }
        },

        /**
         * Show progress indicator
         */
        _showProgress: function () {
            if (this._progressDialogId === null) {
                this._progressDialogId = mx.ui.showProgress();
            }
        },

        /**
         * Hide progress indicator
         */
        _hideProgress: function () {
            if (this._progressDialogId) {
                mx.ui.hideProgress(this._progressDialogId);
                this._progressDialogId = null;
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

        _resetRowObjectSubscriptions: function () {
            var thisObj = this;
            if (this._rowObjectHandles) {
                dojoArray.forEach(this._rowObjectHandles, function (handle) {
                    thisObj.unsubscribe(handle);
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
                thisObj = this,
                xpath;

            if (this._uninitializeCalled) {
                console.log(this.id + "._getData called but widget is being destroyed.");
                return;
            }

            if (this.showProgressGetData) {
                this._showProgress();
            }

            this._resetRowObjectSubscriptions();

            xpath = this._createXPathConstraint();

            this._sortData = [];

            dojoArray.forEach(data.order, function (orderItem) {
                var referenceColumnDef,
                    sortColumnIndex = orderItem.column,
                    sortColumn = data.columns[sortColumnIndex],
                    sortName;
                if (this._referenceColumns[sortColumn.name]) {
                    referenceColumnDef = this._referenceColumns[sortColumn.name];
                    sortName = referenceColumnDef.refName + "/" + this._entityMetaData.getSelectorEntity(referenceColumnDef.refName) + "/" + referenceColumnDef.attrName;
                } else {
                    sortName = sortColumn.data;
                }
                this._sortData.push([sortName, orderItem.dir]);
            }, this);

            mx.data.get({
                xpath: xpath,
                noCache: true,
                count: true,
                filter: {
                    sort: this._sortData,
                    offset: data.start,
                    amount: data.length
                },
                callback: function (objs, extra) {
                    var refGuids;

                    if (thisObj._uninitializeCalled) {
                        console.log(thisObj.id + "._getData called but upon mx.data.get for xpath callback widget is being destroyed.");
                        return;
                    }
                    dataArray = thisObj._convertMendixObjectArrayToDataArray(objs);
                    if (thisObj._hasReferenceColumns) {
                        // Get referenced objects first and supplement the data objects.
                        refGuids = thisObj._getReferencedGuids(dataArray);
                        mx.data.get({
                            guids: refGuids,
                            noCache: false,
                            count: false,
                            callback: function (refObjs) {
                                if (thisObj._uninitializeCalled) {
                                    console.log(thisObj.id + "._getData called but upon mx.data.get for referenced guids callback widget is being destroyed.");
                                    return;
                                }
                                thisObj._includeReferencedObjData(dataArray, refObjs);
                                thisObj._hideProgress();
                                dataTablesCallback({
                                    draw: data.draw,
                                    data: dataArray,
                                    recordsTotal: extra.count,
                                    recordsFiltered: extra.count
                                });
                            },
                            error: function (error) {
                                logger.error("Get referenced data failed");
                                console.dir(error);
                                thisObj._hideProgress();
                            }
                        });

                    } else {
                        // No referenced objects, just return the data.
                        thisObj._hideProgress();
                        dataTablesCallback({
                            draw: data.draw,
                            data: dataArray,
                            recordsTotal: extra.count,
                            recordsFiltered: extra.count
                        });
                    }
                },
                error: function (error) {
                    logger.error("Get grid data failed");
                    console.dir(error);
                    thisObj._hideProgress();
                }
            });
        },

        // Create XPath constraint
        _createXPathConstraint: function () {
            logger.debug(this.id + "._createXPathConstraint");

            var hasConstraint = false,
                thisObj = this,
                xpath,
                xpathAttrValue;

            xpath = "//" + this.tableEntity;
            if (this.xpathConstraintAttr) {
                xpathAttrValue = this._contextObj.get(this.xpathConstraintAttr);
                if (xpathAttrValue && xpathAttrValue.trim().length > 0) {
                    xpath += "[(" + xpathAttrValue.trim() + ")";
                    hasConstraint = true;
                }
            }

            dojoArray.forEach(this.attrSearchFilterList, function (searchFilter, i) {
                var constraintValue = this._getConstraintValue(searchFilter.contextEntityAttr, searchFilter.attrName, searchFilter.refName);
                if (constraintValue) {
                    if (hasConstraint) {
                        xpath += " and ";
                    } else {
                        xpath += "[";
                    }
                    hasConstraint = true;
                    if (searchFilter.refName) {
                        xpath += searchFilter.refName + "[";
                    }
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
                    if (searchFilter.refName) {
                        xpath += "]";
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

            logger.debug(this.id + "._createXPathConstraint XPath: " + xpath);

            return xpath;
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
                                    data[referenceColumnNameInternal] = refObj.get(column.attrName);
                                }
                            } else {
                                // When the referenced object was not found, the user is not authorized to it.
                                // Just clear the GUID in that case.
                                data[referenceColumnName] = null;
                                data[referenceColumnNameInternal] = null;
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

            case "Integer":
                result = mx.parser.formatAttribute(obj, attrName, { groups: column.groupDigits });
                break;

            case "Long":
                result = mx.parser.formatAttribute(obj, attrName, { groups: column.groupDigits });
                break;

            default:
                result = mx.parser.formatAttribute(obj, attrName);
            }

            return result;
        },

        /**
         * Get the attribute value for use as constraint value
         *
         */
        _getConstraintValue : function (contextEntityAttr, attrName, refName) {

            var attrType,
                attrValue,
                dateFormat,
                refEntity,
                refMetaData,
                result;

            if (!this._contextObjMetaData.has(contextEntityAttr)) {
                logger.error(this._contextObj.getEntity() + " does not have attribute " + contextEntityAttr);
                return null;
            }
            if (refName) {
                refEntity = refName.substring(refName.lastIndexOf("/") + 1);
                refMetaData = mx.meta.getEntity(refEntity);
                if (!refMetaData) {
                    logger.error("No meta data found for entity " + refEntity);
                    return null;
                }
                if (!refMetaData.has(attrName)) {
                    logger.error(refEntity + " does not have attribute " + attrName);
                    return null;
                }
            } else {
                if (!this._entityMetaData.has(attrName)) {
                    logger.error(this.tableEntity + " does not have attribute " + attrName);
                    return null;
                }
            }

            attrValue = this._contextObj.get(contextEntityAttr);

            if (!attrValue || (attrType === "String" && attrValue.trim().length === 0)) {
                return null;
            }

            // Use the type of the grid entity attribute. Important for boolean because the context entity attribute will be an enum.
            if (refName) {
                attrType = refMetaData.getAttributeType(attrName);
            } else {
                attrType = this._entityMetaData.getAttributeType(attrName);
            }

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
                // For infinite scrolling, save the current scroller page position.
                if (this.infiniteScroll) {
                    if (resetPaging) {
                        this._scrollerPage = null;
                    } else {
                        // Scroller can be null first time the table is displayed when there is no data.
                        if (this._table.scroller) {
                            this._scrollerPage = this._table.scroller.page();
                        } else {
                            this._scrollerPage = null;
                        }
                    }
                }
                this._loadVisibleColumnIndexArray();
                this._setVisibleColumns();
                this._table.ajax.reload(null, resetPaging);
            }
        },

        // Rerender the interface.
        _updateRendering: function () {
            logger.debug(this.id + "._updateRendering");
            var resetPaging = true;

            if (this._contextObj !== null) {
                this._contextObjMetaData = mx.meta.getEntity(this._contextObj.getEntity());
                if (this._table) {
                    if (this.refreshAttr && this._contextObj.get(this.refreshAttr)) {
                        this._contextObj.set(this.refreshAttr, false);
                        if (this.refreshKeepScrollPosAttr) {
                            resetPaging = !this._contextObj.get(this.refreshKeepScrollPosAttr);
                        }
                        this._reloadTableData(resetPaging);
                    } else {
                        if (this.visibleColumnsAttr) {
                            if (this._contextObj.get(this.visibleColumnsAttr) !== this._previousVisibleColumnsValue) {
                                this._loadVisibleColumnIndexArray();
                                this._setVisibleColumns();
                            }
                        }
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
        _setButtonEnabledStatus: function (eventName) {
            logger.debug(this.id + "._setButtonEnabledStatus");
            var attrValue,
                buttonDefinition,
                buttonEnabled,
                hasSelection,
                rowDataArray,
                selection,
                thisObj = this;
            selection = this._table.rows({selected: true});
            rowDataArray = selection.data().toArray();
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
            switch (eventName) {
            case "select":
                this._previousSelection = selection;
                break;

            case "deselect":
                    // If there is still a selection or deselection is allowed, just save the selection
                if (selection.any() || this.allowDeselect) {
                    this._previousSelection = selection;
                } else {
                    console.log("No selection anymore");
                    setTimeout(function () {
                        if (!thisObj._table.rows({selected: true}).any() && thisObj._previousSelection) {
                            console.log("Reset selection");
                            thisObj._previousSelection.select();
                        }
                    }, 100);
                }
                break;

            default:
                break;
            }
        },

        // Reset subscriptions.
        _resetSubscriptions: function () {
            logger.debug(this.id + "._resetSubscriptions");

            var objectHandle,
                thisObj = this;

            // Release handles on previous object, if any.
            if (this._handles) {
                dojoArray.forEach(this._handles, function (handle) {
                    thisObj.unsubscribe(handle);
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
