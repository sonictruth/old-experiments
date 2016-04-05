<?php
$url ='http://maps.googleapis.com/maps/api/geocode/json?latlng='.$_GET['location'].'&sensor=false&ky=AIzaSyD9k8zIZN0uDzz2MphblZEckyO_gNP7nGI'; //

$h = file_get_contents($url);
echo $h;
?>
