<?php
header('Content-Type: image/jpeg');
$url ='http://maps.googleapis.com/maps/api/streetview?size=591x391&location=' . $_GET['location']. '&heading=' .$_GET['heading']. '&fov=50&pitch=1&sensor=false&key=&key=AIzaSyD9k8zIZN0uDzz2MphblZEckyO_gNP7nGI';
$h = file_get_contents($url);
echo $h;
?>