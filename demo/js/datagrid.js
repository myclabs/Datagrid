
if (Mycsense == null || typeof(Mycsense) != "object") {
    var Mycsense = {};
}

/**
 * Datagrid
 * @param id {string} Identifier of the HTML block
 * @param object {object} Data to initialize the datagrid
 * @constructor
 */
Mycsense.Datagrid = function(id, object) {
    this.id = id;
    this.domElement = $("#" + id);
    this.columns = [];
    this.rows = [];
    this.endpoints = [];
	if (typeof object !== 'undefined') {
		for (var property in object) {
			if (object.hasOwnProperty(property)) {
                if (property == "columns") {
                    this.addColumns(object.columns);
                } else {
                    this[property] = object[property];
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
            console.log(data);
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
    $.each(this.columns, function(index, column) {
        // Cells
        tableBody.find("tr").each(function(index) {
            var row = that.rows[index];
            if (! (column.key in row)) {
                console.error("No '" + column.key + "' found in row #" + index + " of the datagrid");
                return;
            }
            var content = row[column.key];
            var displayedContent = column.formatCell(content);
            var domCell = $("<td></td>")
                .text(displayedContent);
            $(this).append(domCell);
        });
    });
};

/**
 * Generic column
 * @param key {int} Column's id
 * @param label {string} Column's label
 * @constructor
 */
Mycsense.Column = function(key, label) {
    this.key = key;
    this.label = label;
};
/**
 * Format the content of a cell
 * @param content
 * @return string
 */
Mycsense.Column.prototype.formatCell = function(content) {
    return content;
};

/**
 * Column
 * @param key {int} Column's id
 * @param label {string} Column's label
 * @constructor
 */
Mycsense.DateTimeColumn = function(key, label) {
    this.key = key;
    this.label = label;
};
// Inheritance
Mycsense.DateTimeColumn.prototype = Object.create(Mycsense.Column.prototype);
Mycsense.DateTimeColumn.prototype.constructor = Mycsense.DateTimeColumn;
/**
 * Format the content of a cell
 * @param content
 * @return string
 */
Mycsense.DateTimeColumn.prototype.formatCell = function(content) {
    var dateTime = new Date(content);
    return dateTime.toLocaleString();
};
