

# DataTables for Mendix

This widget provides the [DataTables](http://datatables.net/) library as Mendix custom widget.

## Contributing

For more information on contributing to this repository visit [Contributing to a GitHub repository](https://world.mendix.com/display/howto50/Contributing+to+a+GitHub+repository)!

## Typical usage scenario

Displaying data in a grid with more flexiblity than the standard datagrid allows.

## Features

All features can be seen in action in the test/demo project.

- Drag columns to reorder them
- Allow end user to choose which columns to show or hide
- Allow end user to choose the paging size
- Paging size and column layout can be saved in the local storage of the browser.
- Use scrollbar i.s.o. paging buttons. Additional data is loaded automatically when the user scrolls down far enough.
- Responsive table: Hide columns for smaller display sizes, also set a priority on each column to indicate which columns should be hidden first.
- Responsive class: For smaller display sizes, allow end user to expand a row to see the data that does not fit in the grid.
- Force a table refresh from your microflow
- Feed XPath constraints from an attribute
- Specify column widths or allow the grid to size the columns based on actual data and available space.
- Selection similar to DataGrid
- Selection changed microflow, to implement functionality similar to 'listen to grid'
- Define buttons to work with the selected rows. Each button will call a microflow, which receives the current selection.
- Place buttons in another container to put them together with other page elements, like a new button that sits in a container above the widget.

## Limitations

- Currently it is not possible to resize columns at runtime.
- References can be used one level deep.
- Due to limitations in the custom widget definition, the attributes and references need to be entered as text rather than selected from a list.

## Backlog

- Set CSS classes on rows or cells based on styling rules.
- Currently only XPath can be used to get the grid data. Datasource microflows will be supported in a future release.

## Configuration

- Define an entity that acts as context object for the grid.
- Insert the widget in a page
- Configure the properties

## The context entity

This widget needs a context entity:

- To allow microflows to force a refresh
- To get XPath constraints from a String attribute
- To use search filters

It is advised to use a non-persistent entity.

## Properties

For the class properties, multiple classes can be entered, separated by a single space.

### Datasource

- _Table entity_ - This is the entity that is displayed in the grid.
- _Refresh attribute_ - The attribute used force a refresh. Set it to true and change with refresh in client to trigger a refresh. The widget will set it to false.
- _XPath constraint_ - Optional. Set the attribute value to an XPath constraint, without the surrounding [ and ]

#### Column definitions

For each column, add an item to the list

##### Common

- _Attribute name_ - The name of the attribute to be displayed in the column. This is case sensitive.
- _Caption_ - The column caption, translatable.

##### Date values

- _Date/time type_ - Display DateTime attribute as date, date/time, or time only
- _Date formats_ - Formats to use for date/time values. Translatable to allow different formats for each language.

##### Layout

- _Visible_ - Sets whether column is initially visible. Combine with the column visibility setting.
- _Responsive priority_ - Responsive priority, 0 is the highest, columns with higher numbers will be hidden first when the grid does not fit in the current display size.
- _Column width_ - Optional. Specify width, value is used exactly as you enter it: 20%, 150px, 5em, etc
- _Header class_ - Optional. Specify class(es) to be put on the column header.
- _Cell class_ - Optional. Specify class(es) to be put on each cell in the column.

#### Attribute search filters

The widget does not display search filter inputs. To provide search filters, define an attribute of the same type on your context entity.

__Filtering on booleans.__ Filtering on booleans is a little tricky because there is no way to tell the difference between off/false or no selection made. To overcome this, the widget expects an enumeration as attribute on your context entity. The modeler does not allow the value _true_ for an enumeration. For the true value, use enumeration value ___t___. For the false value, anything else, but ___f___ would be a good one. The caption can be any value.

- _Context entity attribute_ - The attribute on the context entity to get the filter value.
- _Attribute name_ - Attribute name to filter on, this is case sensitive.
- _Operator_ - Operator to use. For booleans and enumerations, only _Equals_ makes sense.

#### Reference search filters

The widget does not display search filter inputs. To provide search filters, define an association to the same entity on your context entity.

- _Context entity reference_ - The reference from the context entity to the entity to filter on.
- _Reference name_ - The reference (module.reference) from the table entity to the same entity.

### Layout

- _Is responsive_ - When turned on, columns will be hidden on smaller screen sizes depending on their responsive priorities
- _Auto column width_ - Control the auto column width feature. Turn off when specifying widths on the columns
- _Allow column reorder_ - When turned on, the user can drag and drop columns to reorder them
- _Allow column visibility_ - When turned on, the user can choose which columns to display
- _Columns button caption_ - Caption of the columns button, translatable
- _Table class_ - Specify class(es) to be put on the table
- _Show table information_ - When turned on, display information: Showing 1 to 6 of 50,000 entries
- _Use infinite scroll_ - Use infinite scroll rather than the default paging buttons. Set nowrap on the table class!
- _Vertical scrolling_ - Optional, any CSS unit, default 200px. When specified, vertical scrolling is used and height of the rows is constrained to the specified height
- _State save name_ - Optional. When specified, grid layout state is saved to and loaded from browser local storage using the specied name. Make sure this name is unique across your application!

#### Built-in table classes

The default DataTables stylesheet has the following class names available to control the different styling features of a DataTable.

Class | Description
--------------- | -----
display | Short-hand for the stripe, hover, row-border and order-column classes.
cell-border | Border around all four sides of each cell
compact | Reduce the amount of white-space the default styling for the DataTable uses
hover | Row highlighting on mouse over
nowrap | Disable wrapping of content in the table, so all text in the cells is on a single line (since 1.10.1)
order-column | Highlight the column that the table data is currently ordered on
row-border | Border around only the top an bottom of each each (i.e. for the rows).
stripe | Row striping

Note: cell-border and row-border are mutually exclusive and cannot be used together.


### Selection

The _Selection changed callback microflow_ can be used to create functionality similar to listen to grid. The demo project has examples of this: The master / detail pages.

- _Selection_ - Selection type
- _Select first row_ - Select first row after displaying data
- _Selection changed callback microflow_ - The name of the microflow (Module.Microflow) that is called when the selection has been changed.

### Buttons

The buttons to use for processing selections. Note that buttons are displayed in the widget itself, above the grid. You can place the buttons in a container on your page using the _placement_ properties. This allows you to create one toolbar containing Mendix action buttons and buttons created by the widget. The demo project has an example of this in the Data Types demo.

- _Caption_ - Button caption, translatable
- _Name_ - Button name, will be mx-name- class on the button
- _Is default button_ - Is default button, microflow will be called when user doubleclicks a row. Only that row is passed, even if other rows are selected too.
- _Button type_ - Button type, the same as normal Mendix buttons.
- _Class_ - Optional. Specify class(es) to be put on the button
- _Glyphicon classes_ - Optional. Glyphicon classes, like __glyphicon glyphicon-edit__
- _Button microflow_ - The name of the microflow (Module.Microflow) that is called when the button is clicked
- _Ask confirmation_ - Ask for confirmation
- _Question_ - Confirmation question
- _Proceed caption_ - Proceed button caption on the confirmation popup
- _Cancel caption_ - Cancel button caption on the confirmation popup
- _Placement selector_ - Optional. Places the button relative to the node found using this CSS selector. If empty, button is placed in default container above the table. Can be used to bring new and edit button together in one container
- _Placement position_ - Position of the button in the placement container. Only relevant when placement selector has been specified