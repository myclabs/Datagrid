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
        $id = $datagrid->getId();
        $datagridHtml = json_encode($datagrid, JSON_PRETTY_PRINT);

        return <<<HTML
            <div id="$id"></div>
            <script>
                $(function() {
                    var datagrid = new Mycsense.Datagrid("$id", $datagridHtml);
                    datagrid.render();
                });
            </script>
HTML;
    }

    /**
     * @param Datagrid $datagrid
     * @return string Json
     */
    public function returnRows(Datagrid $datagrid)
    {
        return json_encode($datagrid->getRows(), JSON_PRETTY_PRINT);
    }

}
