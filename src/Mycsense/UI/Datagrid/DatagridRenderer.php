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
        $htmlId = $datagrid->getId();
        $datagridHtml = json_encode($datagrid, JSON_PRETTY_PRINT);

        return <<<HTML
            <div id='$htmlId'></div>
            <script>
                $(function() {
                    var datagrid = new Datagrid($datagridHtml);
                    datagrid.render("#$htmlId");
                });
            </script>
HTML;
    }

}
