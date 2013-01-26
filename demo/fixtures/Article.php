<?php

class Article
{

    /**
     * @var string
     */
    public $title;

    /**
     * @var string
     */
    public $description;

    /**
     * @var DateTime
     */
    public $date;

    /**
     * @param string   $title
     * @param string   $description
     * @param DateTime $date
     */
    public function __construct($title, $description, DateTime $date)
    {
        $this->title = $title;
        $this->description = $description;
        $this->date = $date;
    }

}
