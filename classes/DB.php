<?php
/**
 * Created by PhpStorm.
 * User: drew
 * Date: 8/17/14
 * Time: 3:17 PM
 */
class DB
{
    private $epgUrl;

    private $smartDb;


    public function __construct()
    {
        $this->epgUrl = $this->getDBEpgUrl();
        $this->smartDb = $this->connectToSmartTVDB();
    }

    public function insertProgramm(Programm $programm)
    {
        $table= Programm::TABLE;
        $STH = $this->smartDb->prepare(
            "INSERT INTO $table (channel, title, description, start, stop, date)
             values (:channel, :title, :description, :start, :stop, :date)"
        );
        $STH->execute((array)$programm);

        return $this->smartDb->lastInsertId();
    }

    public function getEpgDbLink()
    {
        $this->connectToSmartTVDB();

        return $this->smartDb;
    }
    /**
     * @return null
     */
    public function getEpgUrl()
    {
        $stmt = $this->smartDb->prepare("TRUNCATE TABLE " . Programm::TABLE);
        $stmt->execute();

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


    protected function connectToSmartTVDB()
    {
        $dbname = Programm::DB;
        $user = Programm::USER;
        $pass = Programm::PASS;
        $table = Programm::TABLE;
        try {
            $options = array(
                PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
            );
            $DBH = new \PDO("mysql:host=localhost;dbname=$dbname", $user, $pass, $options);
            $DBH->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            return $DBH;

        } catch (PDOException $e) {
            echo "Хьюстон, у нас проблемы.";
            file_put_contents('PDOErrors.txt', $e->getMessage(), FILE_APPEND);
        }


        return null;
    }


    public function getDayProgramm($channel)
    {
        $table= Programm::TABLE;
        $stmt = $this->smartDb->prepare(
            "SELECT * FROM $table WHERE channel=? AND DATE(date) = DATE(NOW())");
        $stmt->bindValue(1, $channel, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $rows ? $rows : [];
    }

    public function getProgrammFromNow($channel)
    {
        $table= Programm::TABLE;
        $stmt = $this->smartDb->prepare(
            'SELECT * FROM $table
              WHERE channel=?
              AND stop > NOW()
              AND stop < DATE_ADD(DATE(NOW()), INTERVAL "1 6" DAY_HOUR)'
        );
        $stmt->bindValue(1, $channel, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $rows ? $rows : [];
    }

}
