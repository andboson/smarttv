<?php
/**
 * Created by PhpStorm.
 * User: drew
 * Date: 8/17/14
 * Time: 6:06 PM
 */

class Parser
{
    private $epgUrl;
    private $epgFile;

    public function __construct($epgUrl)
    {
        $this->epgUrl = $epgUrl;
        $this->loadEpgFile();
        echo substr($this->epgFile, 0, 100);
    }

    private function loadEpgFile()
    {
       $this->epgFile = file_get_contents($this->epgUrl);
    }
}
