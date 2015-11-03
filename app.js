'use strict';

const http = require('http'),
      fs = require('fs'),
      url = require('url'),
      path = require('path'),
      INDEX_HTML = './index.html';

// criando o servidor
let app = http.createServer(handler);
/* 
  essa variavel io representa o objeto que trabalha com
  a bibliote de websocktes sockte.io, ele recebe com argumento
  a variavel app  que por sua vez representa o servido, isso
  é feito para que eles usem a mesma porta, e fiquem em 
  sintonia
*/
let io = require('socket.io')(app);

// hender do servidor 
function handler (req, res) {
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
}
/*
  io.on('args') essa função e chamada toda vez que um uma requisição e feita ao servidor
  cara essa requisição receba um envendo "send:message" do socket que vem parametro
  o o metodo io.emit devolvera esse evento junto com "data" os dados que foram passados
  esse evento e passado para todos sockets ativos
*/
io.on('connection', socket => {
  // socket escutando o event send:message
  socket.on('send:message', data => {
    //io emitindo o evento para todos sockets conectdos
    io.emit('send:message', data);
  });
});

app.listen(process.env.PORT || 1337);
