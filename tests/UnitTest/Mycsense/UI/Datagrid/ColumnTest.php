<?php

namespace UnitTests\Mycsense\UI\Datagrid;

use Mycsense\UI\Datagrid\Column\Column;

class ColumnTest extends \PHPUnit_Framework_TestCase
{

    public function testGetKey() {
        $column = new Column("key", "label");
        $this->assertEquals("key", $column->getKey());
    }

    public function testGetLabel() {
        $column = new Column("key", "label");
        $this->assertEquals("label", $column->getLabel());
    }

}
