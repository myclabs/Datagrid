<?php
require 'template/header.php';
?>

<div class="container">

    <h2>CSS customization</h2>

    <div id="datagridExample" class="datagrid"></div>

</div>

<style type="text/css">
    .datagrid th {
        text-align: center;
        font-size: 1.2em;
        background: #897;
    }
    .datagrid td {
        padding: 12px;
    }
</style>

<script>
    $(function() {

        var datagrid = new Mycsense.Datagrid("datagridExample");

        datagrid.addColumns([
            new Mycsense.Column("title", "Article title"),
            new Mycsense.Column("description", "Description")
        ]);

        datagrid.addRows([
            {
                "title": "Test",
                "description": "This is a long description."
            },
            {
                "title": "Another test",
                "description": "This is another long description."
            },
            {
                "description": "The description is defined before the title.",
                "title": "A third test"
            }
        ]);

        datagrid.render();

    });
</script>

<?php
require 'template/footer.php';
?>
