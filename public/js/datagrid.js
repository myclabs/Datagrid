
if (Mycsense == null || typeof(Mycsense) != "object") {
    var Mycsense = {};
}

/**
 * Datagrid
 * @constructor
 */
Mycsense.Datagrid = function(object) {
	this.columns = [];
	this.rows = [];
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
 * Render the datagrid in a div
 * @param selector JQuery selector
 */
Mycsense.Datagrid.prototype.render = function(selector) {
	var that = this;
	var element = $(selector);
	element.append("<table class='table table-bordered'><thead><tr></tr></thead><tbody></tbody></table>");

	// Add all the rows
	$.each(this.rows, function(index, row) {
		var domRow = $("<tr></tr>")
			.data("index", index);
		element.find("tbody").append(domRow);
	});

	$.each(this.columns, function(index, column) {

		// Column header
		var domHeaderRow = $("<th></th>")
			.text(column.label);
		element.find("thead tr").append(domHeaderRow);

		// Cells
		element.find("tbody tr").each(function(index) {
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
