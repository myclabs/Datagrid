<?php
require 'template/header.php';
require_once 'fixtures/Article.php';

use Mycsense\UI\Datagrid\Column\Column;
use Mycsense\UI\Datagrid\Column\DateTimeColumn;
use Mycsense\UI\Datagrid\DatagridRenderer;
use Mycsense\UI\Datagrid\EntityDatagrid;

$datagridRenderer = new DatagridRenderer();

$entityDatagrid = new EntityDatagrid("phpEntitiesDatagridExample");
$entityDatagrid->addColumns([
    new Column("title", "Article title"),
    new Column("description", "Description"),
    new DateTimeColumn("date", "Date"),
]);
$entityDatagrid->addEntities([
    new Article("Test", "This is a long description.", new DateTime()),
    new Article("Another test", "This is another long description.", new DateTime()),
    new Article("A third test", "Another very interesting description.", new DateTime()),
]);
?>

<div class="container">

    <h2>Datagrid of entities</h2>

    <?=$datagridRenderer->render($entityDatagrid)?>

</div>

<?php
require 'template/footer.php';
?>
