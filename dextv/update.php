<?php
if($_GET['pass']=='caca'){
  file_put_contents('videos.txt',$_POST['videos']);
  echo "ok";
} else {
  echo "wrong pass!";
}
  

?>