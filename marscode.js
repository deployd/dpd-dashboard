'use strict'

var http = require('http'),
    fs = require('fs'),
    querystring = require('querystring'),
    validExtensions = {
        "css": "text/css",
        "js": "application/javascript",
        "html": "text/html",
        "png": "image/png"
    };

var filesHandle = function (ctx, next) {

    var request = ctx.req;
    var response = ctx.res;
    var path = process.cwd();
    var delay = (0.5 + (Math.random() / 2)) * 100;
    if (ctx.url.indexOf('/__editor') === 0) {
        path += querystring.unescape(ctx.url).slice(9);
        var pathStat = fs.lstatSync(path);
        if (request.method == "GET") {
            sendDir();
        } else if (request.method == "POST") {
            if (pathStat.isFile()) {
                let body = [];
                request.on('data', (chunk) => {
                    body.push(chunk);
                }).on('end', () => {
                    body = Buffer.concat(body).toString();
                    console.log('body......', body);
                    fs.writeFile(path, body, function (err) {
                        if (err) throw err;
                        console.log("It's saved");
                    });
                });
            }
        } else {
            ctx.done("Undefined request .");
        }

        function sendDir() {
            console.log('path...sendDir........', path);
            if (pathStat.isDirectory()) {
                console.log('1');
                fs.readdir(path, function (err, map) {
                    if (!err) {
                        var directories = map.filter(function (dirPath) {
                                return fs.lstatSync(path + '/' + dirPath).isDirectory() && dirPath.indexOf('.') !== 0;
                            }),
                            files = map.filter(function (filePath) {
                                return fs.lstatSync(path + '/' + filePath).isFile() && filePath.indexOf('.') !== 0;
                            });
                        // console.log( 'file', files);
                        // ctx.res.setHeader( 'Content-Type', 'application/json');
                        ctx.res.end(JSON.stringify({
                            'diretories': directories,
                            'files': files
                        }));
                    } else {
                        ctx.done(err);
                    }
                });
            } else {
                try {
                    ctx.res.setHeader('Content-Type', 'application/octet-stream');
                    ctx.res.end(fs.readFileSync(path));
                } catch (e) {
                    ctx.res.end(500);
                }
            }
        }

    }
};

module.exports = {
    filesHandle: filesHandle
}