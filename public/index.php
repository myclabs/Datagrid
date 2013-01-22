<!DOCTYPE html>
<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Mycsense\UI\Datagrid\Column\Column;
use Mycsense\UI\Datagrid\Column\DateTimeColumn;
use Mycsense\UI\Datagrid\Datagrid;
use Mycsense\UI\Datagrid\DatagridBuilder;
use Mycsense\UI\Datagrid\DatagridRenderer;
use Mycsense\UI\Datagrid\EntityDatagrid;

// Fixture class
class Article
{
    public $title;
    public $description;
    public $date;
    public function __construct($title, $description, $date)
    {
        $this->title = $title;
        $this->description = $description;
        $this->date = $date;
    }
}

$datagridRenderer = new DatagridRenderer();
$datagridBuilder = new DatagridBuilder();
$datagridBuilder->setPath(__DIR__ . "/datagrids");

// Standard datagrid
$datagrid = new Datagrid("phpDatagridExample");
$datagrid->addColumns(
    [
        new Column("title", "Article title"),
        new Column("description", "Description"),
    ]
);
$datagrid->addRows(
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

// Entity datagrid
$entityDatagrid = new EntityDatagrid("phpEntitiesDatagridExample");
$entityDatagrid->addColumns(
    [
        new Column("title", "Article title"),
        new Column("description", "Description"),
        new DateTimeColumn("date", "Date"),
    ]
);
$entityDatagrid->addEntities(
    [
        new Article("Test", "This is a long description.", new DateTime()),
        new Article("Another test", "This is another long description.", new DateTime()),
        new Article("A third test", "The description is defined before the title.", new DateTime()),
    ]
);

// Entity datagrid built from configuration file
$datagridFromYaml = $datagridBuilder->build("articlesYaml");
$datagridFromYaml->addEntities($entityDatagrid->getEntities());

// AJAX entity datagrid built from configuration file
$ajaxDatagrid = $datagridBuilder->build("articlesAjax");
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

        <div id="jsDatagridExample"></div>

        <h2>PHP generated datagrid</h2>

        <?=$datagridRenderer->render($datagrid)?>

        <h2>Datagrid of entities</h2>

        <?=$datagridRenderer->render($entityDatagrid)?>

        <h2>Datagrid of entities configured with YAML file</h2>

        <?=$datagridRenderer->render($datagridFromYaml)?>

        <h2>AJAX datagrid</h2>

        <?=$datagridRenderer->render($ajaxDatagrid)?>

    </div>

    <script src="js/bootstrap.min.js"></script>
    <script src="js/datagrid.js"></script>

    <script>
        var example1 = new Mycsense.Datagrid("jsDatagridExample");

        example1.addColumns([
            new Mycsense.Column("title", "Article title"),
            new Mycsense.Column("description", "Description")
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

        example1.render();
    </script>

</body>
</html>
