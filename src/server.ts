import * as mosca from 'mosca';

<<<<<<< HEAD
let settings = {
  port: 1883,
  persistence: mosca.persistence.Memory
};

var server = new mosca.Server(settings, function() {
  console.log('Mosca server is up and running');
});
=======
let SECURE_KEY = __dirname + '/../server.key';
let SECURE_CERT = __dirname + '/../server.crt';

let settings = {
  port: 1883,
  // persistence: mosca.persistence.Memory,
  secure : {
    port: 8443,
    keyPath: SECURE_KEY,
    certPath: SECURE_CERT,
  }
};

let server = new mosca.Server(settings, function() {
  console.log('Mosca server is up and running');
});

// Accepts the connection if the username and password are valid
let authenticate = function(client:any, username:any, password:any, callback:any) {
  let authorized = (username === 'alice' && password.toString() === 'secret');
  if (authorized) client.user = username;
  callback(null, authorized);
}

// In this case the client authorized as alice can publish to /users/alice taking
// the username from the topic and verifing it is the same of the authorized user
let authorizePublish = function(client:any, topic:any, payload:any, callback:any) {
  callback(null, client.user == topic.split('/')[1]);
}

// In this case the client authorized as alice can subscribe to /users/alice taking
// the username from the topic and verifing it is the same of the authorized user
let authorizeSubscribe = function(client:any, topic:any, callback:any) {
  callback(null, client.user == topic.split('/')[1]);
}
server.on('ready', function() {
  server.authenticate = authenticate;
  server.authorizePublish = authorizePublish;
  server.authorizeSubscribe = authorizeSubscribe;
});
>>>>>>> dd9c7e9c822188ec1f5942ec65d7df73622f6be8
server.on('clientConnected', function(client: any) {
  console.log('client connected', client.id)
});
server.on("clientDisconnected", function(client: any) {
  console.log('client disconnected', client.id)
});

<<<<<<< HEAD
server.on('published', function(packet, client) {
=======
server.on('published', function(packet: any, client: any) {
>>>>>>> dd9c7e9c822188ec1f5942ec65d7df73622f6be8
  if (packet.topic.indexOf('$SYS') === 0) return;

  // console.log('raw packet:', packet)
  console.log('on topic \'' + packet.topic + '\', payload:', packet.payload);

  if (packet.topic.indexOf('general/echo/ping') === 0) {
    console.log('ping message:', packet.payload.toString());

<<<<<<< HEAD
    var newPacket = {
=======
    let newPacket = {
>>>>>>> dd9c7e9c822188ec1f5942ec65d7df73622f6be8
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
