<?php
require 'template/header.php';

use Mycsense\UI\Datagrid\DatagridBuilder;
use Mycsense\UI\Datagrid\DatagridRenderer;

$datagridRenderer = new DatagridRenderer();
$datagridBuilder = new DatagridBuilder();
$datagridBuilder->setPath(__DIR__ . "/datagrids");

// AJAX entity datagrid built from configuration file
$ajaxDatagrid = $datagridBuilder->build("articlesAjax");
?>

<div class="container">

    <h2>AJAX datagrid</h2>

    <?=$datagridRenderer->render($ajaxDatagrid)?>

</div>

<?php
require 'template/footer.php';
?>
