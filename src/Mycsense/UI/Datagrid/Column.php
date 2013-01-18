<?php

namespace Mycsense\UI\Datagrid;

/**
 * Datagrid column
 */
class Column implements \JsonSerializable
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

    /**
     * Serializes the object to a value that can be serialized natively by json_encode().
     * @link http://docs.php.net/manual/en/jsonserializable.jsonserialize.php
     * @return mixed Returns data which can be serialized by json_encode(), which is a value of any type other than a resource.
     */
    public function jsonSerialize()
    {
        return [
            "key"   => $this->getKey(),
            "label" => $this->getLabel(),
        ];
    }

}
