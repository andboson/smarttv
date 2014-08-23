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
    private $db;
    private $status;
    private $canals = [];
    private $playlist = "http://megatv.ck.ua/megatv-promo.m3u";

    public function __construct($epgUrl)
    {
        $this->epgUrl = $epgUrl;
        $this->loadEpgFile();

        $this->db = new DB();
        $this->loadCanals();
    }

    private function loadCanals()
    {
        $playlistCont = file_get_contents($this->playlist);
        preg_match_all('/id=\w+_(\d+)/ims', $playlistCont, $result);
        $this->canals = $result[1];
    }

    private function loadEpgFile()
    {
       $this->epgFile = file_get_contents($this->epgUrl);
       //$this->epgFile = file_get_contents('http://tv.ipnet.ua/epg/export.xml');
    }

    public function parse()
    {
        $xml = simplexml_load_string($this->epgFile);
        $count = 0;
        $saved = 0;
        foreach($xml->programme as $programm){
            $programm = (array)$programm;
            if( !in_array($programm['@attributes']['channel'], $this->canals)){
               continue;
            }
            $programDb = new Programm();
            $programDb->channel = $programm['@attributes']['channel'];
            $programDb->start = trim(trim($programm['@attributes']['start'], '+0300'));
            $programDb->stop = trim(trim($programm['@attributes']['stop'], '+0300'));
            $programDb->description = $programm['description'];
            $programDb->title = $programm['title'];
            $programDb->date = $programm['date'];
            $result = $programDb->save($this->db);

            if($result){
                $saved++;
                echo ".";
            } else {
                echo "F";
            }
            $count++;
        }

        $this->status = array(
            'all' => $count,
            'saved' => $saved,
        );
    }


    public function getStatus()
    {
        return $this->status;
    }

    /**
     * @param string $playlist
     */
    public function setPlaylist($playlist)
    {
        $this->playlist = $playlist;
    }

    /**
     * @return string
     */
    public function getPlaylist()
    {
        return $this->playlist;
    }


}
