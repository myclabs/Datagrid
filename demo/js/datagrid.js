/**
 * @copyright My C-Sense
 */

// Mycsense namespace
if (Mycsense == null || typeof(Mycsense) != "object") {
    var Mycsense = {};
}


// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
} ;


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
    $.each(columns, function(index, columnData) {
        var column = columnData;
        if (! (columnData instanceof Mycsense.Column)) {
            column = new Mycsense.Column(columnData.key, columnData.label, columnData.editable);
        }
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
 * Remove a row
 */
Mycsense.Datagrid.prototype.deleteRow = function(rowIndex) {
    var row = this.rows[rowIndex];
    // Delete the row and refresh
    this.rows.remove(rowIndex);
    this.displayRows();
    // Call the handler
    $(this).trigger('rowDeleted', [rowIndex, row]);
};

/**
 * Define the content of a cell
 * @param column {Mycsense.Column}
 * @param rowIndex {int}
 * @param content
 */
Mycsense.Datagrid.prototype.setCellContent = function(column, rowIndex, content) {
    var row = this.rows[rowIndex];
    row[column.key] = content;
    // Refresh
    this.displayRows();
    // Call the handler
    $(this).trigger('rowDeleted', [rowIndex, row]);
};

/**
 * Add a callback to the "cellChanged" event
 * @param callback {function}
 */
Mycsense.Datagrid.prototype.onCellChanged = function(callback) {
    $(this).bind('cellChanged', callback);
};

/**
 * Add a callback to the "rowDeleted" event
 * @param callback {function}
 */
Mycsense.Datagrid.prototype.onRowDeleted = function(callback) {
    $(this).bind('rowDeleted', callback);
};

/**
 * Render the datagrid
 */
Mycsense.Datagrid.prototype.render = function() {
    var that = this;
    that.domElement.empty();
    that.domElement.append("<table class='datagrid table table-bordered table-striped'><thead><tr></tr></thead><tbody></tbody></table>");

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
            var content = null;
            // If that's a column with content
            if (! (column instanceof Mycsense.DeleteColumn)) {
                var row = that.rows[rowIndex];
                if (!(column.key in row)) {
                    console.error("No '" + column.key + "' found in row #" + rowIndex + " of the datagrid");
                    return;
                }
                content = row[column.key];
            }
            var domCell = column.renderCell(rowIndex, content);
            $(this).append(domCell);
        });
    });
};
