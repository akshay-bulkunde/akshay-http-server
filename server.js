const http = require('http');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const PORT = 3000;
const HOSTNAME = 'localhost';

const htmlFilePath = path.join(__dirname, './index.html');
const jsonFilePath = path.join(__dirname, './jsonFile.json');

const server = http.createServer(serverHandler);

function serverHandler(req, res) {

    if (req.method === 'GET' && req.url.toLowerCase() === "/html") {
        res.setHeader("Content-Type", "text/html");
        fs.readFile(htmlFilePath, 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                res.end('Internal Server Error');
            } else {
                res.end(data);
            }
        });
    }
    else if (req.method === 'GET' && req.url.toLowerCase() === "/json") {
        res.setHeader("Content-Type", "application/json");
        fs.readFile(jsonFilePath, 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                res.end('Internal Server Error');
            } else {
                res.end(data);
            }
        });
    }
    else if (req.method === 'GET' && req.url.toLowerCase() === "/uuid") {
        res.setHeader("Content-Type", "application/json");
        const uuid = crypto.randomUUID();
        res.end(JSON.stringify({ "uuid": uuid }));
    }
    else if (req.method === 'GET' && req.url.toLowerCase().startsWith('/status')) {
        const statusCode = Number(req.url.split('/')[2]);
        if (!isNaN(statusCode) && statusCode >= 100 && statusCode < 600) {
            const statusMessage = http.STATUS_CODES[statusCode] || 'unknown status';
            res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
            res.end(`Status Code: ${statusCode}, Message: ${statusMessage}`);
        } else {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Invalid status code');
        }
    }
    else if (req.method === 'GET' && req.url.toLowerCase().startsWith('/delay')) {
        res.setHeader("Content-Type", "application/json");
        const delayInSeconds = Number(req.url.split('/')[2]);
        if (!isNaN(delayInSeconds)) {
            setTimeout(() => {
                res.end(`Response after ${delayInSeconds} second(s)`);
            }, delayInSeconds * 1000);
        } else {

            res.end(JSON.stringify({ error: 'Invalid delay time' }));
        }
    }
    else {

        res.end(
            `<html>
                <body>
                    <h3>Server is running successfully</h3>
                </body>
            </html>`
        );
    }
}


server.listen(PORT, HOSTNAME, () => {
    console.log(`Server is running at http://${HOSTNAME}:${PORT}`);
});
