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
    var that = this;
    this.id = id;
    this.domElement = $("#" + id);
    this.columns = [];
    this.rows = [];
    this.endpoints = [];
    this.canAddRows = false;
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
    this.addContainer = $('<div class="datagrid-add-container modal hide fade"> \
            <div class="modal-header"> \
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> \
                <h3>Add a row</h3> \
            </div> \
            <div class="modal-body"></div> \
            <div class="modal-footer"> \
                <button type="button" class="btn btn-primary add-row-save">Save</button> \
                <button type="button" class="btn" data-dismiss="modal">Cancel</button> \
            </div> \
        </div>');
    this.addContainer.appendTo(this.domElement);
};
Mycsense.Datagrid.prototype.ENDPOINT_GET = "get";
Mycsense.Datagrid.prototype.ENDPOINT_ADD = "add";
Mycsense.Datagrid.prototype.ENDPOINT_UPDATE = "update";
Mycsense.Datagrid.prototype.ENDPOINT_DELETE = "delete";

/**
 * Enable to add rows to the datagrid
 * @param canAddRows {boolean}
 */
Mycsense.Datagrid.prototype.enableAddRows = function(canAddRows) {
    this.canAddRows = canAddRows;
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
    column.setDatagrid(this);
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
            column = new Mycsense.Column(columnData.key, columnData.label, columnData.editable, columnData.addable);
        }
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
 * Add a row and refresh the datagrid
 * @param row {Array}
 * @return {int} The row index
 */
Mycsense.Datagrid.prototype.addRow = function(row) {
    var rowIndex = this.rows.push(row);
    // Refresh
    this.displayRows();
    // Call the handler
    $(this).trigger('rowAdded', [rowIndex, row]);
    return rowIndex;
};

/**
 * Add several rows
 * @param rows {Array}
 */
Mycsense.Datagrid.prototype.addRows = function(rows) {
    var that = this;
    $.each(rows, function(index, row) {
        that.rows.push(row)
    });
};

/**
 * Remove a row and refresh the datagrid
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
 * Returns the content of a cell
 * @param column {Mycsense.Column}
 * @param rowIndex {int}
 */
Mycsense.Datagrid.prototype.getCellContent = function(column, rowIndex) {
    return this.rows[rowIndex][column.key];
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
    // Trigger the event
    $(this).trigger('cellChanged', [content, rowIndex, row]);
};

/**
 * Add a callback to the "cellChanged" event
 * @param callback {function} Parameters: (event, value, rowIndex, row)
 */
Mycsense.Datagrid.prototype.onCellChanged = function(callback) {
    $(this).bind('cellChanged', callback);
};

/**
 * Add a callback to the "rowDeleted" event
 * @param callback {function} Parameters: (event, rowIndex, row)
 */
Mycsense.Datagrid.prototype.onRowDeleted = function(callback) {
    $(this).bind('rowDeleted', callback);
};

/**
 * Add a callback to the "rowAdded" event
 * @param callback {function} Parameters: (event, rowIndex, row)
 */
Mycsense.Datagrid.prototype.onRowAdded = function(callback) {
    $(this).bind('rowAdded', callback);
};

/**
 * Render the datagrid
 */
Mycsense.Datagrid.prototype.render = function() {
    var that = this;
    this.domElement.empty();
    this.domElement.append('<table class="datagrid table table-bordered table-striped"><thead><tr></tr></thead><tbody></tbody></table>');

    // Row creation
    if (this.canAddRows) {
        var addButton = $('<button type="button" class="btn add-row">Add a row</button>')
            .click(function() {
                that.displayAddForm();
            });
        this.domElement.append(addButton);
    }

    // Column headers
    $.each(this.columns, function(index, column) {
        var domHeaderRow = $("<th></th>")
            .text(column.label);
        that.domElement.find("thead tr").append(domHeaderRow);
    });

    // If async datagrid, load the cells
    if (this.ENDPOINT_GET in this.endpoints) {
        this.asyncRefreshRows();
    } else {
        this.displayRows();
    }
};

/**
 * Refresh the rows
 * @private
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
                    content = null;
                } else {
                    content = row[column.key];
                }
            }
            var domCell = column.renderCell(rowIndex, content);
            $(this).append(domCell);
        });
    });
};

/**
 * Display the form for adding a row
 */
Mycsense.Datagrid.prototype.displayAddForm = function() {
    var that = this;
    var form = $('<form class="form-horizontal"></form>');

    // Add fields
    $.each(this.columns, function(columnIndex, column) {
        if (column.addable) {
            var element = $('<div class="control-group"> \
                <label class="control-label">' + column.label + '</label> \
                <div class="controls"></div> \
            </div>');
            element.find('.controls')
                .data('column', column)
                .append(column.getFormElement(''));
            form.append(element);
        }
    });

    // Submit
    form.submit(function(e) {
        e.preventDefault();
        that.addContainer.modal('hide');

        // Create the row
        var row = {};
        $(this).find('.controls').each(function(index, input) {
            var column = $(this).data('column');
            row[column.key] = column.getValueFromFormElement($(this));
        });

        // Add the row
        var rowIndex = that.addRow(row);
    });

    this.addContainer.find(".add-row-save")
        .unbind()
        .click(function() {
            that.addContainer.find("form").submit();
        });
    this.addContainer.find(".modal-body")
        .empty()
        .append(form);
    this.addContainer.modal();
    form.focus();
};

