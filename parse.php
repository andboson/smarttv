<?php
require 'vendor/autoload.php';

$db = new DB();
$url = $db->getEpgUrl();
$parser = new Parser($url);
$parser->parse();
print_r($parser->getStatus());
