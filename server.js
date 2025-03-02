require('dotenv').config();
const http = require('http');
const app = require('./app');
const PORT = process.env.PORT;
app.set('port', PORT);

const server = http.createServer(app);

server.listen(PORT);
