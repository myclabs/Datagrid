<?php
require 'template/header.php';
require_once 'fixtures/Article.php';

use Mycsense\UI\Datagrid\DatagridBuilder;
use Mycsense\UI\Datagrid\DatagridRenderer;

$datagridRenderer = new DatagridRenderer();
$datagridBuilder = new DatagridBuilder();
$datagridBuilder->setPath(__DIR__ . "/datagrids");

// Entity datagrid built from configuration file
$datagridFromYaml = $datagridBuilder->build("articlesYaml");
$datagridFromYaml->addEntities([
    new Article("Test", "This is a long description.", new DateTime()),
    new Article("Another test", "This is another long description.", new DateTime()),
    new Article("A third test", "Another very interesting description.", new DateTime()),
]);
?>

<div class="container">

    <h2>Datagrid of entities configured with YAML file</h2>

    <?=$datagridRenderer->render($datagridFromYaml)?>

</div>

<?php
require 'template/footer.php';
?>
