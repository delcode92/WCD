<?php
  // connect to database
  include "connect.php";

  // execute insert query
  $q = "insert into siswa (nama, alamat) values('budi', 'pango')";
  $res = pg_query($conn, $q);

?>
