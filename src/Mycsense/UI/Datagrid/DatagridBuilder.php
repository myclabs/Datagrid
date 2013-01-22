<?php

namespace Mycsense\UI\Datagrid;

use Exception;
use Mycsense\UI\Datagrid\Column\DateTimeColumn;
use InvalidArgumentException;
use Mycsense\UI\Datagrid\Column\Column;
use Symfony\Component\Yaml\Yaml;

/**
 * Datagrid builder from configuration files
 */
class DatagridBuilder
{

    const DATAGRID_TYPE_DATAGRID = "Datagrid";
    const DATAGRID_TYPE_ENTITY_DATAGRID = "EntityDatagrid";

    const COLUMN_TYPE_TEXT = "text";
    const COLUMN_TYPE_LONGTEXT = "longtext";
    const COLUMN_TYPE_DATETIME = "dateTime";

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
        $file = $this->getFile($id);
        $array = $this->parseFile($id, $file);

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
                case self::COLUMN_TYPE_DATETIME:
                    $column = new DateTimeColumn($key, $label, $path);
                    break;
                default:
                    throw new Exception("Unknown column type '{$columnData["type"]}' for $key in '$file'");
            }
            $datagrid->addColumn($column);
        }

        // Endpoints
        if (isset($array["endpoints"])) {
            foreach ($array["endpoints"] as $type => $url) {
                $datagrid->setEndpoint($type, $url);
            }
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

    /**
     * @param string $datagridId Datagrid ID
     * @throws \InvalidArgumentException
     * @return string File name
     */
    private function getFile($datagridId)
    {
        $path = self::getPath();
        if (empty($path)) {
            throw new \InvalidArgumentException("Base path for datagrid configuration not defined, use DatagridBuilder::setPath()");
        }
        if (!file_exists($path)) {
            throw new \InvalidArgumentException("Base path not found for datagrid configuration: '$path'");
        }
        $fileExtension = self::getFileExtension();
        return $path . "/" . $datagridId . $fileExtension;
    }

    /**
     * @param string $id Datagrid ID
     * @param string $file
     * @throws \InvalidArgumentException
     * @return array Data
     */
    private function parseFile($id, $file)
    {
        if (!file_exists($file)) {
            throw new \InvalidArgumentException("Configuration file not found for datagrid '$id': '$file'");
        }
        $array = Yaml::parse($file);
        return $array[$id];
    }

}
