<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Mycsense\UI\Datagrid\DatagridBuilder;
use Mycsense\UI\Datagrid\DatagridRenderer;

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

// Recreate the datagrid
$datagrid = $datagridBuilder->build("articlesAjax");

$datagrid->addEntities([
    new Article("Test", "This is a long description.", new DateTime()),
    new Article("Another test", "This is another long description.", new DateTime()),
    new Article("A third test", "The description is defined before the title.", new DateTime()),
]);

echo $datagridRenderer->returnRows($datagrid);
