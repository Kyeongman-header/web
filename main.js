var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateList(filelist)
{
var list='<ul>';
var i=0;
while(i<filelist.length)
{
list=list+'<li><a href="/?id='+filelist[i]+'">'+filelist[i]+'</a></li> ';
i=i+1;
}
list=list+'</ul>';
return list;
}
function templateHTML(title,list,body)
{
var temp=`
            <!doctype html>
            <html>
            <head>
              <title>WEB1 - ${title}</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1><a href="/">WEB</a></h1>
              ${list}
	  <a href="/create">create</a>
              ${body}
            </body>
            </html>
            `;
return temp;
}


var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname=url.parse(_url,true).pathname;
    var title = queryData.id;


fs.readdir('./data',function(error,filelist){
console.log(pathname);
console.log(queryData.id);
var list=templateList(filelist);

if(pathname === '/'){

fs.readFile(`data/${title}`,'utf8',function(err,description){   

if(title===undefined)
{
title='Welcome';
description='Welcome!';
}

var template = templateHTML(title,list,`<h2>${title}</h2><p>${description}</p>`);

 response.writeHead(200);
    response.end(template);
});
   
}
else if(pathname === '/create'){
        title = 'WEB - create';
        var template = templateHTML(title, list, `
          <form action="http://localhost:3000/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `);
        response.writeHead(200);
        response.end(template);
}
else if(pathname==='/create_process')
{
var body='';
request.on('data',function(data){
body=body+data;
});
request.on('end',function(){
var post=qs.parse(body);
title=post.title;
description=post.description;
fs.writeFile(`data/${title}`,description,'utf8',function(err){
//현재로선 에러 처리를 고려할 필요가 없다.
})
response.writeHead(302,{Location: `/?id=${title}`});
response.end();
});

}
else
{
response.writeHead(404);
response.end('Not found');
}

});
});
app.listen(3000);