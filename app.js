const express = require('express'),
    app = express(),
    cors = require('cors'),
    morgan = require('morgan'),
    path = require('path'),
    bodyParser = require('body-parser'),
    server = require('http').Server(app),
    io = require('socket.io')(server);

const container = require('rhea');
const crypto = require('crypto');

function hmacSha1(key, context) {
    return Buffer.from(crypto.createHmac('sha1', key).update(context).digest())
        .toString('base64');
};

const cur_timestamp = Math.floor(Date.now());

const ali_amqp_config = {
    'host': '${uid}.iot-amqp.${regionId}.aliyuncs.com',
    'port': 5671,
    'transport':'tls',
    'reconnect':true,
    'idle_time_out':60000,
    'username':'${YourClientId}|authMode=aksign,signMethod=hmacsha1,timestamp='+cur_timestamp+',authId=${YourAccessKeyId},iotInstanceId=${YourIotInstanceId},consumerGroupId=${YourConsumerGroupId}|', 
    'password': hmacSha1('${YourAccessKeySecret}', 'authId=${YourAccessKeyId}&timestamp='+cur_timestamp),
};
console.log(ali_amqp_config);

io.on('connection', function (socket) {
    console.log("Web socket connected.")
    socket.emit('news', ali_amqp_config.host);
});

var connection = container.connect(ali_amqp_config);
connection.on('receiver_open', function (context) {
    console.log('subscribed');
});
container.on('connection_open', function (context) {
    console.log('connection open.');
});
container.on('disconnected', function (context) {
    console.log('disconnected');
});

var receiver = connection.open_receiver();

container.on('message', function (context) {
    var msg = context.message;
    var messageId = msg.message_id;
    var topic = msg.application_properties.topic;
    var content = Buffer.from(msg.body.content).toString();

    context.delivery.accept();

    console.log('%s:%s', topic, content);
    io.emit('ali-edgex-shadow', content);
});

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/html/ali-livechart.html'));
});

server.listen(3000, function () {
    console.log('App listening on port 3000!');
});
