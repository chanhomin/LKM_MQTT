import * as mosca from 'mosca';

let settings = {
  port: 1883,
  persistence: mosca.persistence.Memory
};

var server = new mosca.Server(settings, function() {
  console.log('Mosca server is up and running');
});
server.on('clientConnected', function(client: any) {
  console.log('client connected', client.id)
});
server.on("clientDisconnected", function(client: any) {
  console.log('client disconnected', client.id)
});

server.on('published', function(packet, client) {
  if (packet.topic.indexOf('$SYS') === 0) return;

  // console.log('raw packet:', packet)
  console.log('on topic \'' + packet.topic + '\', payload:', packet.payload);

  if (packet.topic.indexOf('general/echo/ping') === 0) {
    console.log('ping message:', packet.payload.toString());

    var newPacket = {
      topic: 'general/echo/pong',
      payload: packet.payload,
      retain: packet.retain,
      qos: packet.qos
    };

    server.publish(newPacket, function() {
      console.log('pong published');
    });
  }
});
