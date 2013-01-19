<?php

namespace Mycsense\UI\Datagrid\Column;

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

    /**
     * Path to extract the content of the array or the entities
     * @var string
     */
    protected $path;

    /**
     * @param string      $key Unique identifier of the column
     * @param string      $label Label displayed
     * @param string|null $path Path to extract the content of the array or the entities. If null, equals to the key.
     */
    public function __construct($key, $label, $path = null)
    {
        $this->key = $key;
        $this->label = $label;
        $this->path = $path ?: $key;
    }

    /**
     * @return string
     */
    public function getKey()
    {
        return $this->key;
    }

    /**
     * @return string Label displayed
     */
    public function getLabel()
    {
        return $this->label;
    }

    /**
     * @return string Path to extract the content of the array or the entities
     */
    public function getPath()
    {
        return $this->path;
    }

    /**
     * @param string $path Path to extract the content of the array or the entities
     */
    public function setPath($path)
    {
        $this->path = $path;
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
