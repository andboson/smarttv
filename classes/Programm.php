<?php

class Programm
{
    const HOST = 'localhost';
    const DB = 'smarttv';
    const USER = 'smarttv';
    const PASS = 'pPys7BB2';
    const TABLE = 'programm';

    public $start;
    public $stop;
    public $channel;
    public $title;
    public $description;
    public $date;

    public function save($db)
    {
        $db->insertProgramm($this);
    }

    public function getDay($channel, $db)
    {
        if(empty($channel)) return '';

        return json_encode($db->getDayProgramm($channel));
    }

    public function getFromNow($channel, $db)
    {
        if(empty($channel)) return '';

        return json_encode($db->getProgrammFromNow($channel));
    }
}
