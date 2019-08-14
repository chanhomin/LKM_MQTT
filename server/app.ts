import * as mosca from 'mosca';

let settings = {
    port: 1883,
    persistence: mosca.persistence.Memory
};


var server = new mosca.Server(settings, function() {
    console.log('Mosca server is up and running')
});

server.on('clientConnected', function(client: any) {
  console.log('client connected', client.id);
});


server.published = function(packet: any, client: any, cb: any) {
    if (packet.topic.indexOf('echo') === 0) {
    console.log('ON PUBLISHED', packet.payload.toString(), 'on topic', packet.topic);
    return cb();
    }

    var newPacket = {
    topic: 'echo/' + packet.topic,
    payload: packet.payload,
    retain: packet.retain,
    qos: packet.qos
    };

    console.log('newPacket', newPacket);

    server.publish(newPacket, cb);
};