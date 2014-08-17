<?php
require 'vendor/autoload.php';

$config = new Config();
$url = $config->getEpgUrl();

$parser = new Parser($url);
//$parser->parse();
//$parser->getStatus();