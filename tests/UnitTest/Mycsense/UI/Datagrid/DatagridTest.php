<?php

namespace UnitTests\Mycsense\UI\Datagrid;

use Mycsense\UI\Datagrid\Column;
use Mycsense\UI\Datagrid\Datagrid;

class DatagridTest extends \PHPUnit_Framework_TestCase
{

    /**
     * @expectedException \InvalidArgumentException
     */
    public function testInvalidId1() {
        new Datagrid("");
    }

    /**
     * @expectedException \InvalidArgumentException
     */
    public function testInvalidId2() {
        new Datagrid(null);
    }

    /**
     * @expectedException \InvalidArgumentException
     */
    public function testInvalidId3() {
        new Datagrid(10);
    }

}
