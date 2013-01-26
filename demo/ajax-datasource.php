<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once 'fixtures/Article.php';

use Mycsense\UI\Datagrid\DatagridBuilder;
use Mycsense\UI\Datagrid\DatagridRenderer;

$datagridRenderer = new DatagridRenderer();
$datagridBuilder = new DatagridBuilder();
$datagridBuilder->setPath(__DIR__ . "/datagrids");

// Recreate the datagrid
$datagrid = $datagridBuilder->build("articlesAjax");

$datagrid->addEntities([
    new Article("Test", "This is a long description.", new DateTime()),
    new Article("Another test", "This is another long description.", new DateTime()),
    new Article("A third test", "Another very interesting description.", new DateTime()),
]);

echo $datagridRenderer->returnRows($datagrid);
