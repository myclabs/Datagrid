<?php
require_once __DIR__ . '/../../vendor/autoload.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Datagrid</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/bootstrap-responsive.min.css" rel="stylesheet">
    <style>
        body {
            padding-top: 60px; /* 60px to make the container go all the way to the bottom of the topbar */
        }
    </style>

    <script src="js/jquery-1.9.0.min.js"></script>
</head>
<body>
    <div class="navbar navbar-inverse navbar-fixed-top">
        <div class="navbar-inner">
            <div class="container">
                <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="brand" href="index.php">Datagrid</a>
                <div class="nav-collapse collapse">
                    <ul class="nav">
                        <li class="">
                            <a href="js.php">JS datagrid</a>
                        </li>
                        <li class="">
                            <a href="css.php">CSS customization</a>
                        </li>
                        <li class="">
                            <a href="array.php">PHP array datagrid</a>
                        </li>
                        <li class="">
                            <a href="entities.php">PHP entities datagrid</a>
                        </li>
                        <li class="">
                            <a href="yaml.php">YAML configured datagrid</a>
                        </li>
                        <li class="">
                            <a href="ajax.php">AJAX datagrid</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
