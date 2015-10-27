'use strict';

const http = require('http'),
      fs = require('fs'),
      url = require('url'),
      path = require('path'),
      io = require('socket.io')(http);


const INDEX_HTML = './index.html';

const server = http.createServer((req, res) => {
  let uri = req.url;
  res.statusCode = 200;
  if(uri == "/") { 
    let INDEX_HTML = './index.html';
    res.setHeader("Content-Type", "text/html");
	  fs.createReadStream(INDEX_HTML).pipe(res);
  }else if(/videos/.test(uri)){
      let videos = fs.readdirSync('./videos')
      let urlparse = url.parse(req.url).path;
      let path = '.'+urlparse+'.mp4'
      let exist = fs.existsSync(path)
      if(!exist) {
        throw new Error(404);
      }else {
        let VIDEO_SIZE = fs.statSync(path).size;
        res.writeHead(200,{'Content-Length': VIDEO_SIZE ,'Content-Type' : 'application/octet-stream'});
        fs.createReadStream(path).pipe(res);
      }
  }else {
    res.end('url not exist');
  }
});

io.of('/videos').on('connection', socket => {
  socket.on('send:message', data => {
    io.of('/videos').emit('send:message', data);
  });
});

server.listen(process.env.PORT || 1337);
