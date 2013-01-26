<?php
require 'template/header.php';

use Mycsense\UI\Datagrid\Column\Column;
use Mycsense\UI\Datagrid\Datagrid;
use Mycsense\UI\Datagrid\DatagridRenderer;

$datagridRenderer = new DatagridRenderer();

$datagrid = new Datagrid("phpDatagridExample");
$datagrid->addColumns([
    new Column("title", "Article title"),
    new Column("description", "Description"),
]);
$datagrid->addRows([
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
]);
?>

<div class="container">

    <h2>PHP generated datagrid</h2>

    <?=$datagridRenderer->render($datagrid)?>

</div>

<?php
require 'template/footer.php';
?>
