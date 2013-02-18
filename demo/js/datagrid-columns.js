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
 * @param addable {boolean} Set if the column's cells are addable
 * @constructor
 */
Mycsense.Column = function(key, label, editable, addable) {
    this.datagrid = undefined;
    this.key = key;
    this.label = label;
    this.cssClass = 'column-text';
    if (typeof editable == 'undefined') {
        this.editable = false;
    } else {
        this.editable = editable;
    }
    if (typeof addable == 'undefined') {
        this.addable = true;
    } else {
        this.addable = addable;
    }
    this.addContainer = $('<div class="datagrid-edit-container"></div>');
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
        .attr("class", this.cssClass)
        .data("column-key", that.key)
        .data("index", index);
    domCell.find(".content")
        .append(that.getCellContent(content));
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
    var rowIndex = cell.parent().index();
    var formElement = this.getFormElement(this.datagrid.getCellContent(this, rowIndex));
    var form = $('<form class="form-inline"> \
                <button type="submit" class="btn btn-primary">Save</button> \
                <button type="button" class="btn cancel">Cancel</button> \
            </form>')
        .prepend(formElement)
        .submit(function(e) {
            e.preventDefault();
            var value = $(this).find("input").val();
            that.addContainer.detach();
            that.addContainer.empty();
            // Change the cell content
            that.datagrid.setCellContent(that, rowIndex, value);
        });
    that.addContainer.empty()
        .append(form)
        .appendTo(cell)
        .find(".cancel").click(function() {
            that.addContainer.detach();
            that.addContainer.empty();
        });
    form.find("input").focus();
};

/**
 * Returns a form element to edit a cell
 * @param value
 */
Mycsense.Column.prototype.getFormElement = function(value) {
    return $('<input type="text" name="' + this.key + '" value="' + value + '">');
};

/**
 * Returns the value of the form element
 * @param formElement
 */
Mycsense.Column.prototype.getValueFromFormElement = function(formElement) {
    return formElement.find("input[name='" + this.key + "']").val();
};

/**
 * Returns the content of a cell
 * @private
 */
Mycsense.Column.prototype.getCellContent = function(rawContent) {
    return $("<span>" + rawContent + "</span>");
};


///////////////////////////////////////////
// ----------- Delete column

/**
 * Delete column
 * @param label {string} Column's label
 * @constructor
 */
Mycsense.DeleteColumn = function(label) {
    Mycsense.Column.call(this, "delete", label, false, false);
    this.cssClass = 'column-delete';
};
// Inheritance
Mycsense.DeleteColumn.prototype = Object.create(Mycsense.Column.prototype);
Mycsense.DeleteColumn.prototype.constructor = Mycsense.DeleteColumn;

/**
 * Returns the content of a cell
 * @private
 */
Mycsense.DeleteColumn.prototype.getCellContent = function(rawContent) {
    var that = this;
    var content = $("<button type='button' class='btn btn-mini'><i class='icon-trash'></i></button>");
    content.click(function() {
        var rowIndex = $(this).parents("tr").data('index');
        that.datagrid.deleteRow(rowIndex);
    });
    return content;
};


///////////////////////////////////////////
// ----------- Number column

/**
 * Number column
 * @param key {int} Column's id
 * @param label {string} Column's label
 * @param editable {boolean} Set if the column's cells are editable
 * @param addable {boolean} Set if the column's cells are addable
 * @constructor
 */
Mycsense.NumberColumn = function(key, label, editable, addable) {
    Mycsense.Column.call(this, key, label, editable, addable);
    this.cssClass = 'column-number';
};
// Inheritance
Mycsense.NumberColumn.prototype = Object.create(Mycsense.Column.prototype);
Mycsense.NumberColumn.prototype.constructor = Mycsense.NumberColumn;

/**
 * Returns a form element to edit a cell
 * @param value
 */
Mycsense.NumberColumn.prototype.getFormElement = function(value) {
    return $('<input type="number" name="' + this.key + '" value="' + value + '">');
};


///////////////////////////////////////////
// ----------- DateTime column

/**
 * DateTime column
 * @param key {int} Column's id
 * @param label {string} Column's label
 * @param editable {boolean} Set if the column's cells are editable
 * @param addable {boolean} Set if the column's cells are addable
 * @constructor
 */
Mycsense.DateTimeColumn = function(key, label, editable, addable) {
    Mycsense.Column.call(this, key, label, editable, addable);
    this.cssClass = 'column-datetime';
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
    return $("<span>" + dateTime.toLocaleString() + "</span>");
};
