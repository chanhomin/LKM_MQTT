import * as mqtt from 'mqtt';
let client = mqtt.connect('mqtt://localhost:1883');

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
