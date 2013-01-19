<?php

namespace Mycsense\UI\Datagrid;

use Symfony\Component\Yaml\Yaml;
use Mycsense\UI\Datagrid\Column\Column;
use Exception;
use InvalidArgumentException;

/**
 * Datagrid builder from configuration files
 */
class DatagridBuilder
{

    const DATAGRID_TYPE_DATAGRID = "Datagrid";
    const DATAGRID_TYPE_ENTITY_DATAGRID = "EntityDatagrid";

    const COLUMN_TYPE_TEXT = "text";
    const COLUMN_TYPE_LONGTEXT = "longtext";

    /**
     * Path to the configuration files
     * @var string
     */
    protected static $path;

    /**
     * File extension of the configuration files (default ".yml")
     * @var string
     */
    protected static $fileExtension = ".yml";

    /**
     * Builds a datagrid using its configuration file
     * @param string $id ID of the datagrid, which is also the name of the configuration file
     * @return Datagrid|EntityDatagrid
     * @throws \InvalidArgumentException The file can't be found
     * @throws \Exception Problem in the configuration file
     */
    public function build($id)
    {
        $path = self::getPath();
        if (empty($path)) {
            throw new \InvalidArgumentException("Base path for datagrid configuration not defined, use DatagridBuilder::setPath()");
        }
        if (!file_exists($path)) {
            throw new \InvalidArgumentException("Base path not found for datagrid configuration: '$path'");
        }
        $fileExtension = self::getFileExtension();
        $file = $path . "/" . $id . $fileExtension;
        if (!file_exists($file)) {
            throw new \InvalidArgumentException("Configuration file not found for datagrid '$id': '$file'");
        }
        $array = Yaml::parse($file);
        $array = $array[$id];
        // Type
        $type = $array["type"];
        switch ($type) {
            case self::DATAGRID_TYPE_DATAGRID:
                $datagrid = new Datagrid($id);
                break;
            case self::DATAGRID_TYPE_ENTITY_DATAGRID:
                $datagrid = new EntityDatagrid($id);
                break;
            default:
                throw new Exception("Unknown datagrid type '$type' in '$file'");
        }
        // Columns
        foreach ($array["columns"] as $key => $columnData) {
            $label = $columnData["label"];
            if (isset($columnData["path"])) {
                $path = $columnData["path"];
            } else {
                $path = null;
            }
            switch ($columnData["type"]) {
                case self::COLUMN_TYPE_TEXT:
                case self::COLUMN_TYPE_LONGTEXT:
                    $column = new Column($key, $label, $path);
                    break;
                default:
                    throw new Exception("Unknown column type '$type' for $key in '$file'");
            }
            $datagrid->addColumn($column);
        }
        return $datagrid;
    }

    /**
     * @return string Path to the configuration files
     */
    public static function getPath()
    {
        return self::$path;
    }

    /**
     * @param string $path Path to the configuration files
     */
    public static function setPath($path)
    {
        self::$path = $path;
    }

    /**
     * @return string File extension of the configuration files (default ".yml")
     */
    public static function getFileExtension()
    {
        return self::$fileExtension;
    }

    /**
     * @param string $fileExtension File extension of the configuration files (default ".yml")
     */
    public static function setFileExtension($fileExtension)
    {
        self::$fileExtension = $fileExtension;
    }

}
