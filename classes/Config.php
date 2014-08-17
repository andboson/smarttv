<?php
/**
 * Created by PhpStorm.
 * User: drew
 * Date: 8/17/14
 * Time: 3:17 PM
 */
class Config
{
    private $epgUrl;

    public function __construct()
    {
        $this->epgUrl = $this->getDBEpgUrl();
    }

    /**
     * @return null
     */
    public function getEpgUrl()
    {
        return $this->epgUrl;
    }

    private function getDBEpgUrl()
    {
        $dbname = EpgUrl::DB;
        $user = EpgUrl::USER;
        $pass = EpgUrl::PASS;
        $table = EpgUrl::TABLE;
        try {
            $DBH = new \PDO("mysql:host=localhost;dbname=$dbname", $user, $pass);
            $DBH->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $STH = $DBH->query("SELECT url from $table");
            $STH->setFetchMode(PDO::FETCH_CLASS, 'EpgUrl');
        } catch (PDOException $e) {
            echo "Хьюстон, у нас проблемы.";
            file_put_contents('PDOErrors.txt', $e->getMessage(), FILE_APPEND);
        }


        while ($obj = $STH->fetch()) {
            return $obj->url;
        }

        return null;
    }


}