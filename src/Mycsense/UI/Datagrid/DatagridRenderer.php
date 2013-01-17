<?php

namespace Mycsense\UI\Datagrid;

/**
 * Datagrid HTML and JS renderer
 */
class DatagridRenderer
{

    /**
     * @param Datagrid $datagrid
     * @return string HTML
     */
    public function render(Datagrid $datagrid)
    {
        $columnsHtml = json_encode($datagrid->getColumns(), JSON_PRETTY_PRINT);
        $rowsHtml = json_encode($datagrid->getRows(), JSON_PRETTY_PRINT);

        $htmlId = $datagrid->getId();

        return <<<HTML
            <div id='$htmlId'></div>
            <script>
                $(function() {
                    var datagrid = new Datagrid();

                    datagrid.addColumns($columnsHtml);

                    datagrid.addRows($rowsHtml);

                    datagrid.render("#$htmlId");
                });
            </script>
HTML;
    }

}
