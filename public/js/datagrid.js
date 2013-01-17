// TODO use a Mycsense namespace

/**
 * Datagrid
 * @constructor
 */
function Datagrid() {
	this.columns = [];
	this.rows = [];
}

/**
 * Add a column
 * @param column {Column}
 */
Datagrid.prototype.addColumn = function(column) {
	this.columns.push(column);
};

/**
 * Add several columns
 * @param columns {Column[]}
 */
Datagrid.prototype.addColumns = function(columns) {
	var that = this;
	$.each(columns, function(index, column) {
		that.addColumn(column);
	});
};

/**
 * Add a row
 * @param data {Array}
 */
Datagrid.prototype.addRow = function(data) {
	this.rows.push(data);
};

/**
 * Add several rows
 * @param rows {Array}
 */
Datagrid.prototype.addRows = function(rows) {
	var that = this;
	$.each(rows, function(index, row) {
		that.addRow(row);
	});
};

/**
 * Render the datagrid in a div
 * @param selector JQuery selector
 */
Datagrid.prototype.render = function(selector) {
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
			var domCell = $("<td></td>")
				.text(content);
			$(this).append(domCell);
		});

	});
};

/**
 * Column
 * @param key {int} Column's id
 * @param label {string} Column's label
 * @constructor
 */
function Column(key, label) {
	this.key = key;
	this.label = label;
}
