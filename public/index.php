<!DOCTYPE html>
<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Mycsense\UI\Datagrid\Column;
use Mycsense\UI\Datagrid\Datagrid;
use Mycsense\UI\Datagrid\DatagridRenderer;

$example1 = new Datagrid("php-datagrid-example");
$example1->addColumns(
    [
        new Column("title", "Title"),
        new Column("description", "Description"),
    ]
);
$example1->addRows(
    [
        [
            "title"       => "Test",
            "description" => "This is a long description.",
        ],
        [
            "title"       => "Another test",
            "description" => "This is another long description.",
        ],
        [
            "description" => "The description is defined before the title.",
            "title"       => "A third test",
        ],
    ]
);

$datagridRenderer = new DatagridRenderer();
?>

<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Datagrid</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/bootstrap-responsive.min.css" rel="stylesheet">
    <script src="js/jquery-1.9.0.min.js"></script>
</head>
<body>

    <div class="container">

        <h2>Javascript generated datagrid</h2>

        <div class="js-datagrid-example"></div>

        <h2>PHP generated datagrid</h2>

        <?=$datagridRenderer->render($example1)?>

    </div>

    <script src="js/bootstrap.min.js"></script>
    <script src="js/datagrid.js"></script>

    <script>
        var example1 = new Datagrid();

        example1.addColumns([
            new Column("title", "Title"),
            new Column("description", "Description")
        ]);

        example1.addRows([
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

        example1.render(".js-datagrid-example");
    </script>

</body>
</html>
