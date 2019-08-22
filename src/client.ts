import * as mqtt from 'mqtt';
<<<<<<< HEAD
let client = mqtt.connect('mqtt://localhost:1883');
=======
import * as fs from 'fs';
import * as path from 'path';

var KEY = fs.readFileSync(path.join(__dirname, '/../client.key'))
var CERT = fs.readFileSync(path.join(__dirname, '/../client.crt'))
var CA = fs.readFileSync(path.join(__dirname, '/../root.crt'))

var PORT = 8443
var HOST = 'localhost'

var options = {
  host: 'localhost',
    port: 8443,
    protocol: 'mqtts',
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    secureProtocol: 'TLSv1_method',
    reconnectPeriod: 5 * 1000,
    rejectUnauthorized: true,
    connectTimeout: 10 * 1000,
    ca: [CA],
    key: KEY,
    cert: CERT
}

var client = mqtt.connect(options);

>>>>>>> dd9c7e9c822188ec1f5942ec65d7df73622f6be8

client.on('connect', function () {
  console.log('connected');
  client.subscribe('general/echo/pong', function (err) {
    if (!err)
      client.publish('general/echo/ping', 'Hello mqtt');
  });
});

client.on('message', function (topic, message) {
  if (topic === 'general/echo/pong') {
    // message is Buffer
    console.log('pong message:', message.toString());
  }
  client.end();
});
