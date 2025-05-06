const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let filePath = '';
  
  if (req.url === '/home') {
    filePath = path.join(__dirname, 'home.html');
  } else if (req.url === '/about') {
    filePath = path.join(__dirname, 'about.html');
  }
  else if (req.url === '/') {
    filePath = path.join(__dirname, 'home.html');
  }
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('404 Not Found');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('500 Internal Server Error');
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

