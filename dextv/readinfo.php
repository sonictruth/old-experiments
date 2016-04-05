<?php
print_r($_SERVER);
$title = "";
try {
 $xml=simplexml_load_file("http://gdata.youtube.com/feeds/api/videos/TzzrzGyKo6g?v=2");
 if(!$xml->error){
     $namespaces = $xml->getNameSpaces(true);
     print_r($namespaces);
     $media = $xml->children( $namespaces['media'] );    
     $thumb = $media->group->thumbnail->attributes()->url;
     $title = $xml->title;
 } else {
 }
} catch (Exception $e) {

}

if($title){

 echo $title;
}


?>