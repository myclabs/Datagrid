<?php

namespace Mycsense\UI\Datagrid;

use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Mycsense\UI\Datagrid\Column\Column;
use Symfony\Component\PropertyAccess\PropertyAccess;

/**
 * Datagrid of entities
 */
class EntityDatagrid extends Datagrid
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
    protected $entities;

    /**
     * {@inheritdoc}
     */
    public function __construct($id)
    {
        parent::__construct($id);
        $this->entities = new ArrayCollection();
    }

    /**
     * @return array
     */
    public function getRows()
    {
        $propertyAccessor = PropertyAccess::getPropertyAccessor();
        $rows = [];
        foreach ($this->entities as $entity) {
            $row = [];
            foreach ($this->columns as $column) {
                $row[$column->getKey()] = $propertyAccessor->getValue($entity, $column->getKey());
            }
            $rows[] = $row;
        }
        return $rows;
    }

    /**
     * @param object $entity
     */
    public function addEntity($entity)
    {
        $this->entities->add($entity);
    }

    /**
     * @param array $entities
     */
    public function addEntities(array $entities)
    {
        foreach ($entities as $entity) {
            $this->addEntity($entity);
        }
    }

}
