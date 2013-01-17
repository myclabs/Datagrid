<?php

namespace Mycsense\UI\Datagrid;

/**
 * Datagrid column
 */
class Column
{

    /**
     * Column's unique identifier key
     * @var string
     */
    protected $key;

    /**
     * Column's displayed label
     * @var string
     */
    protected $label;

    public function __construct($key, $label)
    {
        $this->key = $key;
        $this->label = $label;
    }

    /**
     * @return string
     */
    public function getKey()
    {
        return $this->key;
    }

    /**
     * @return string
     */
    public function getLabel()
    {
        return $this->label;
    }

}
