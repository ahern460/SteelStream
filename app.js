var http = require("http");
var fs = require("fs");
var index = fs.readFileSync("./index.html");
var styles = fs.readFileSync("./styles.css");
var logo = fs.readFileSync("Logo Grey.PNG");

var SerialPort = require("serialport");

const parsers = SerialPort.parsers;
const parser = new parsers.Readline({
    delimiter: "\r\n"
});

//Enter Serial Port and Baud Rate here
var port = new SerialPort("/dev/tty.usbserial-01C5F8C9",{ 
    baudRate: 115200,
    dataBits: 8,
    parity: "none",
    stopBits: 1,
    flowControl: false
});

port.pipe(parser);

var app = http.createServer(function(req, res) {
    if(req.url === "/"){
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(index);
    } else if (req.url.includes("styles.css")) {
        res.writeHead(200, {"Content-Type": "text/css"});
        res.end(styles);
    } else if (req.url.includes("Logo")) {
        res.writeHead(200, {"Content-Type": "image/png"});
        res.end(logo);
    }
});

var io = require("socket.io").listen(app);

io.on("connection", function(data) {
    console.log("Node is listening to port");
});

parser.on('data', function(data) {
    console.log(data);
    io.emit('data', data);
});

//Based on LocalHost Port
app.listen(3000);
