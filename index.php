<?php
require 'vendor/autoload.php';

$db = new DB();
$prg = new Programm();

$channel = $_REQUEST['channel'];
header('Content-Type: application/json');
echo $prg->getFromNow(3, $db);