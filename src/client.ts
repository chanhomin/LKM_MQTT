import * as mqtt from 'mqtt';
import * as fs from 'fs';
import * as path from 'path';

var KEY = fs.readFileSync(path.join(__dirname, '/../certificates/client.key'))
var CERT = fs.readFileSync(path.join(__dirname, '/../certificates/client.crt'))
var CA = fs.readFileSync(path.join(__dirname, '/../certificates/root.crt'))

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
  connectTimeout: 10 * 1000,

  rejectUnauthorized: false,

  ca: [CA],
  key: KEY,
  cert: CERT,

  username: 'alice',
  password: 'secret'
}

console.log('try to connect')
var client = mqtt.connect(options);
console.log('connect function end')

client.on('connect', function () {
  console.log('connected');
  client.subscribe('general/alice/echo/pong', function (err) {
    if (!err)
      client.publish('general/alice/echo/ping', 'Hello mqtt');
  });
});

client.on('message', function (topic, message) {
  if (topic === 'general/alice/echo/pong') {
    // message is Buffer
    console.log('pong message:', message.toString());
  }
  client.end();
});
