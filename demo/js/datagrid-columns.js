/**
 * @copyright My C-Sense
 */

// Mycsense namespace
if (Mycsense == null || typeof(Mycsense) != "object") {
    var Mycsense = {};
}

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
            var value = $(this).find("input").val();
            that.editContainer.detach();
            that.editContainer.empty();
            // Change the cell content
            that.datagrid.setCellContent(that, cellIndex, value);
            // Call the handler
            $(that.datagrid).trigger('cellChanged', value, that.key, cellIndex);
        });
    that.editContainer.empty()
        .append(form)
        .appendTo(cell)
        .find(".cancel").click(function() {
            that.editContainer.detach();
            that.editContainer.empty();
        });
    form.find("input").focus();
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
