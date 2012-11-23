#!/usr/bin/env node

var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    mime = require("mime"),
    port = process.env.PORT || 8008;

	var options = {
    host: 'stockhtm.finance.qq.com',
    port: 80,
    path: '/sstock/screener/index.html',
    method: 'GET'
  };


  
  //http.get("http://www.google.com/", function(res) 
  http.get({host:'www.google.com', port:80, path:'/index.html', agent:false}, function (res) {
    var pageData = "";
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      pageData += chunk;
    });

    res.on('end', function(){
		console.log('BODY: ' + pageData);
      //res.write(pageData);
    });
  });


http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);
  
  path.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      var contentType = mime.lookup(filename) || "text/plain";
      response.writeHead(200, {"Content-Type": contentType});
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(port, "0.0.0.0");

console.log("http://localhost:" + port);