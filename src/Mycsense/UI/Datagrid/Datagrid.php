<?php

namespace Mycsense\UI\Datagrid;

use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Mycsense\UI\Datagrid\Column\Column;

/**
 * Datagrid
 */
class Datagrid implements \JsonSerializable
{

    /**
     * @var string
     */
    protected $id;

    /**
     * @var Column[]|Collection
     */
    protected $columns;

    /**
     * @var Collection
     */
    protected $rows;

    /**
     * @param string $id Unique HTML ID
     * @throws \InvalidArgumentException
     */
    public function __construct($id)
    {
        if (empty($id) || !is_string($id)) {
            throw new \InvalidArgumentException("ID parameter must be a non-empty string");
        }
        $this->id = $id;
        $this->columns = new ArrayCollection();
        $this->rows = new ArrayCollection();
    }

    /**
     * @return string
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return Column[]
     */
    public function getColumns()
    {
        return $this->columns->toArray();
    }

    /**
     * @param Column $column
     */
    public function addColumn(Column $column)
    {
        $this->columns->add($column);
    }

    /**
     * @param Column[] $columns
     */
    public function addColumns(array $columns)
    {
        foreach ($columns as $column) {
            $this->addColumn($column);
        }
    }

    /**
     * @return array
     */
    public function getRows()
    {
        return $this->rows->toArray();
    }

    /**
     * @param string[] $row Associative array indexed by column keys. Values are cells content.
     */
    public function addRow(array $row)
    {
        $this->rows->add($row);
    }

    /**
     * @param array $rows
     */
    public function addRows(array $rows)
    {
        foreach ($rows as $row) {
            $this->addRow($row);
        }
    }

    /**
     * Serializes the object to a value that can be serialized natively by json_encode().
     * @link http://docs.php.net/manual/en/jsonserializable.jsonserialize.php
     * @return mixed Returns data which can be serialized by json_encode(), which is a value of any type other than a resource.
     */
    public function jsonSerialize()
    {
        return [
            'columns' => $this->getColumns(),
            'rows'    => $this->getRows(),
        ];
    }

}
