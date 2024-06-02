
<?php
  // connect to database
  include "connect.php";

  // execute update query
  $q = "update siswa set nama='santi' where id=1";
  $res = pg_query($conn, $q);

?>
