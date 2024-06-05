
<?php
  // connect to database
  include "connect.php";

  // execute insert query
  $q = "delete from siswa where id=1";
  $res = pg_query($conn, $q);

?>
