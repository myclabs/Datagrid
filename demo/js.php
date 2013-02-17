<?php
require 'template/header.php';
?>

<div class="container">

    <h2>Javascript generated datagrid</h2>

    <div id="jsDatagridExample"></div>

    <div class="alert alert-info message hide"></div>

</div>

<script>
    $(function() {

        var datagrid = new Mycsense.Datagrid("jsDatagridExample");

        datagrid.addColumns([
            new Mycsense.Column("title", "Article title"),
            new Mycsense.Column("description", "Description", true),
            new Mycsense.DeleteColumn()
        ]);

        datagrid.addRows([
            {
                title: "Test",
                description: "This is a long description."
            },
            {
                title: "Another test",
                description: "This is another long description."
            },
            {
                description: "The description is defined before the title.",
                title: "A third test"
            }
        ]);

        datagrid.enableAddRows(true);

        datagrid.onCellChanged(function(event, value, rowIndex, row) {
            $(".message").text("Value updated to '" + value + "'").show();
        });

        datagrid.onRowDeleted(function(event, rowIndex, row) {
            $(".message").text("Row '" + row.title + "' deleted").show();
        });

        datagrid.render();

    });
</script>

<?php
require 'template/footer.php';
?>
