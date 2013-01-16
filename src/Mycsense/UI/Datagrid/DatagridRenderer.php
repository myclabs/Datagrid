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
        $html = <<<HTML
            <div id='$htmlId'></div>
            <script>
                $(function() {
                    var datagrid = new Datagrid();

                    datagrid.addColumns([
                        new Column("title", "Title"),
                        new Column("description", "Description")
                    ]);

                    datagrid.addRows([
                        {
                            "title": "Test",
                            "description": "This is a long description."
                        },
                        {
                            "title": "Another test",
                            "description": "This is another long description."
                        },
                        {
                            "description": "The description is defined before the title.",
                            "title": "A third test"
                        }
                    ]);

                    datagrid.render("#$htmlId");
                });
            </script>
HTML;
        return $html;
    }

}
