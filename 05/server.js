//Import modules
const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const logEvents = require('./logEvents');
const EventEmitter = require('events');

// Create event emitter
class Emitter extends EventEmitter {};

const myEmitter = new Emitter();
// Listen for events
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));


// Start creating the server
const PORT = process.env.PORT || 3500;

// Serve file function
const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(
            filePath,
            !contentType.includes('image') ? 'utf8' : ''
        );
        const data = contentType === 'application/json' ? JSON.parse(rawData) : rawData;
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200,
            { 'Content-Type': contentType }
        );
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        );
    } catch (err) {
        console.log(err);
        myEmitter.emit('log',`${err.name}: ${err.message}`, 'errLog.txt');
        response.statusCode = 500; // server error
        response.end();
    }
}


// Uses http module to create the server itself
const server = http.createServer((req, res) => {
    console.log(req.url,req.method);
    // Logs the event
    myEmitter.emit('log',`${req.url}\t${req.method}`, 'reqLog.txt');
    // Finds the extension of the file (.html, etc)
    const extension = path.extname(req.url);

    let contentType;
    // Switch for each possible extension type
    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default: // could just be the slash 
            contentType = 'text/html';
    }
    // Creates a file path
    let filePath =
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/'
                ? path.join(__dirname, 'views', req.url, 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname, 'views', req.url)
                    : path.join(__dirname, req.url);
    
    // Makes .html extension not required in the browser
    if (!extension && req.url.slice(-1) !== '/') filePath+='.html';

    const fileExists = fs.existsSync(filePath);
    // If the file exists, perform the servefile function to display it.
    // If not, perform a switch statement to redirect old web pages or display 404 error
    if (fileExists) {
       serveFile(filePath, contentType, res);
    } else {
        // 404
        // 301 redirect
        switch(path.parse(filePath).base) {
            case 'old-page.html':
                res.writeHead(301, {'Location': '/new-page.html'});
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, {'Location': '/'});
                res.end();
                break;     
            default:
                serveFile(path.join(__dirname,'views','404.html'), 'text.html', res);
                // serve a 404 response           
        }
    }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));