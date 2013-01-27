// Mycsense namespace
if (Mycsense == null || typeof(Mycsense) != "object") {
    var Mycsense = {};
}

/**
 * Datagrid
 * @param id {string} Identifier of the HTML block
 * @param configuration {object} Data to initialize the datagrid
 * @constructor
 */
Mycsense.Datagrid = function(id, configuration) {
    this.id = id;
    this.domElement = $("#" + id);
    this.columns = [];
    this.rows = [];
    this.endpoints = [];
    // Configuration
    if (typeof configuration !== 'undefined') {
        for (var property in configuration) {
            if (configuration.hasOwnProperty(property)) {
                if (property == "columns") {
                    this.addColumns(configuration.columns);
                } else {
                    this[property] = configuration[property];
                }
            }
        }
    }
};
Mycsense.Datagrid.prototype.ENDPOINT_GET = "get";
Mycsense.Datagrid.prototype.ENDPOINT_ADD = "add";
Mycsense.Datagrid.prototype.ENDPOINT_UPDATE = "update";
Mycsense.Datagrid.prototype.ENDPOINT_DELETE = "delete";

/**
 * Add a column
 * @param column {Mycsense.Column}
 */
Mycsense.Datagrid.prototype.addColumn = function(column) {
    if (typeof column.type !== 'undefined') {
        switch (column.type) {
            case "Column":
                column = new Mycsense.Column(column.key, column.label);
                break;
            case "DateTimeColumn":
                column = new Mycsense.DateTimeColumn(column.key, column.label);
                break;
        }
    }
    this.columns.push(column);
};

/**
 * Add several columns
 * @param columns {Mycsense.Column[]}
 */
Mycsense.Datagrid.prototype.addColumns = function(columns) {
    var that = this;
    $.each(columns, function(index, column) {
        that.addColumn(column);
        column.setDatagrid(that);
    });
};

/**
 * Remove all the rows of the datagrid
 */
Mycsense.Datagrid.prototype.clearRows = function() {
    this.rows = [];
};

/**
 * Add a row
 * @param data {Array}
 */
Mycsense.Datagrid.prototype.addRow = function(data) {
    this.rows.push(data);
};

/**
 * Add several rows
 * @param rows {Array}
 */
Mycsense.Datagrid.prototype.addRows = function(rows) {
    var that = this;
    $.each(rows, function(index, row) {
        that.addRow(row);
    });
};

/**
 * Define the content of a cell
 * @param column {Mycsense.Column}
 * @param index {int}
 * @param rawContent
 */
Mycsense.Datagrid.prototype.setCellContent = function(column, index, rawContent) {
    this.domElement.find("tbody tr").eq(index).find("td")
        .filter(function() {
            return $(this).data("column-key") && $(this).data("column-key") == column.key;
        })
        .find(".content")
        .text(column.getCellContent(rawContent))
};

/**
 * Render the datagrid
 */
Mycsense.Datagrid.prototype.render = function() {
    var that = this;
    that.domElement.empty();
    that.domElement.append("<table class='table table-bordered table-striped'><thead><tr></tr></thead><tbody></tbody></table>");

    // Column headers
    $.each(this.columns, function(index, column) {
        var domHeaderRow = $("<th></th>")
            .text(column.label);
        that.domElement.find("thead tr").append(domHeaderRow);
    });

    // If async datagrid, load the cells
    if (that.ENDPOINT_GET in that.endpoints) {
        that.asyncRefreshRows();
    } else {
        that.displayRows();
    }
};

/**
 * Refresh the rows
 */
Mycsense.Datagrid.prototype.asyncRefreshRows = function() {
    var that = this;
    $.ajax({
        url: that.endpoints[that.ENDPOINT_GET],
        data: {
            id: that.id
        },
        success: function(data) {
            that.clearRows();
            that.addRows(data);
            that.displayRows();
        },
        dataType: "json"
    });
};

/**
 * Display the rows
 */
Mycsense.Datagrid.prototype.displayRows = function() {
    var that = this;
    var tableBody = that.domElement.find("tbody");
    // Remove existing rows
    tableBody.empty();
    // Add all the rows (not the cells)
    $.each(this.rows, function(index, row) {
        var domRow = $("<tr></tr>")
            .data("index", index);
        tableBody.append(domRow);
    });
    // For each column
    $.each(this.columns, function(columnIndex, column) {
        // Cells
        tableBody.find("tr").each(function(rowIndex) {
            var row = that.rows[rowIndex];
            if (!(column.key in row)) {
                console.error("No '" + column.key + "' found in row #" + rowIndex + " of the datagrid");
                return;
            }
            var domCell = column.renderCell(rowIndex, row[column.key]);
            $(this).append(domCell);
        });
    });
};


/**
 * Generic column
 * @param key {int} Column's id
 * @param label {string} Column's label
 * @param editable {boolean} Set if the column's cells are editable
 * @constructor
 */
Mycsense.Column = function(key, label, editable) {
    this.datagrid = undefined;
    this.key = key;
    this.label = label;
    if (typeof editable == 'undefined') {
        this.editable = false;
    } else {
        this.editable = editable;
    }
    this.editContainer = $('<div class="datagrid-edit-container"></div>');
};

/**
 * Defines the datagrid owning the column
 * @param datagrid {Mycsense.Datagrid}
 * @private
 */
Mycsense.Column.prototype.setDatagrid = function(datagrid) {
    this.datagrid = datagrid;
};

/**
 * Format the content of a cell
 * @param index {int}
 * @param content {string}
 * @return object
 */
Mycsense.Column.prototype.renderCell = function(index, content) {
    var that = this;
    var domCell = $('<td><span class="content"></span></td>')
        .data("column-key", that.key)
        .data("index", index);
    domCell.find(".content")
        .text(that.getCellContent(content));
    if (that.editable) {
        var editIcon = $('<button type="button" class="btn btn-mini pull-right"><i class="icon-pencil"></i></button>')
            .click(function() {
                that.editCell($(this).parent("td"));
            });
        domCell.append(editIcon);
    }
    return domCell;
};

/**
 * Switch a cell to edit mode
 * @param cell DOM Element
 */
Mycsense.Column.prototype.editCell = function(cell) {
    var that = this;
    var cellIndex = cell.parent().index();
    var form = $('<form class="form-inline"> \
                <input type="text" value="' + cell.text() + '"> \
                <button type="submit" class="btn btn-primary">Save</button> \
                <button type="button" class="btn cancel">Cancel</button> \
            </form>')
        .submit(function(e) {
            e.preventDefault();
            var data = $(this).find("input").val();
            that.datagrid.setCellContent(that, cellIndex, data);
            that.editContainer.detach();
            that.editContainer.empty();
        });
    that.editContainer.empty()
        .append(form)
        .appendTo(cell)
        .find(".cancel").click(function() {
            that.editContainer.detach();
            that.editContainer.empty();
        });
};

/**
 * Returns the content of a cell
 * @private
 */
Mycsense.Column.prototype.getCellContent = function(rawContent) {
    return rawContent;
};


/**
 * Column
 * @param key {int} Column's id
 * @param label {string} Column's label
 * @param editable {boolean} Set if the column's cells are editable
 * @constructor
 */
Mycsense.DateTimeColumn = function(key, label, editable) {
    Mycsense.Column.call(this, key, label, editable);
};
// Inheritance
Mycsense.DateTimeColumn.prototype = Object.create(Mycsense.Column.prototype);
Mycsense.DateTimeColumn.prototype.constructor = Mycsense.DateTimeColumn;

/**
 * Returns the content of a cell
 * @private
 */
Mycsense.DateTimeColumn.prototype.getCellContent = function(rawContent) {
    var dateTime = new Date(rawContent);
    return dateTime.toLocaleString();
};
