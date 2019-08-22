import * as mosca from 'mosca';
import * as sqlite3 from 'sqlite3';
let utils = require('./utils.ts');

let db = new sqlite3.Database('db.sqlite3');

let SECURE_KEY = __dirname + '/../certificates/server.key';
let SECURE_CERT = __dirname + '/../certificates/server.crt';

let settings = {
  port: 1883,
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
let authenticate = function(client: any, username: any, password: any, callback: any) {
  console.log('authenticate request', username, password.toString());
  db.all('SELECT name FROM users WHERE name = ? AND password = ?', username, password.toString(), function(err: any, rows: any) {
    if (err) throw err;

    let authorized = (rows.length !== 0);
    console.log('is authorized:', authorized);
    if (authorized) client.user = username;
    callback(null, authorized);
  });
}

// In this case the client authorized as alice can publish to /users/alice taking
// the username from the topic and verifing it is the same of the authorized user
let authorizePublish = function(client: any, topic: any, payload: any, callback: any) {
  console.log('publish request', client.user, topic);

  // ignore if already authorized
  function closure(err: any, row: any) {
    if(err) throw err;
    let hasAuthorized = checkAuthnicate('publish')(err, row, topic);
    if (hasAuthorized) callback(null, true);
    return hasAuthorized;
  }

  // check user's permission
  db.all('SELECT permission FROM users WHERE name = ?', client.user, function(err: any, rows: any) {
    if (closure(err, rows[0])) return;

    // check group's permission if user's permission is not allowed
    db.all(
      `SELECT groups.permission FROM users, groups, groupMembers
       WHERE users.name = ?
       AND users.id = groupMembers.userId
       AND groups.id = groupMembers.groupId`,
      client.user, function(err: any, rows: any) {
        if (err) throw err;

        for(let i=0; i<rows.length; i++) {
          if(closure(err, rows[i])) {
            return;
          }
        }

        callback(null, false);
      }
    );
  });
}

// In this case the client authorized as alice can subscribe to /users/alice taking
// the username from the topic and verifing it is the same of the authorized user
let authorizeSubscribe = function(client: any, topic: any, callback: any) {
  console.log('subscribe request', client.user, topic);

  // ignore if already authorized
  function closure(err: any, row: any) {
    if(err) throw err;
    let hasAuthorized = checkAuthnicate('subscribe')(err, row, topic);
    if (hasAuthorized) callback(null, true);
    return hasAuthorized;
  }

  // check user's permission
  db.all('SELECT permission FROM users WHERE name = ?', client.user, function(err: any, rows: any) {
    if (closure(err, rows[0])) return;

    // check group's permission if user's permission is not allowed
    db.all(
      `SELECT groups.permission FROM users, groups, groupMembers
       WHERE users.name = ?
       AND users.id = groupMembers.userId
       AND groups.id = groupMembers.groupId`,
      client.user, function(err: any, rows: any) {
        if (err) throw err;

        for(let i=0; i<rows.length; i++) {
          if(closure(err, rows[i])) {
            return;
          }
        }

        callback(null, false);
      }
    );
  });
}

/**
 * when topic has allowed, return true
 * then, outer function will stop iteration.
 * when not allowed, just return false to make iteration continue.
 */
function checkAuthnicate(mode: string) {
  return function(err: any, row: any, topic: any) {
    if (err) throw err;

    let lines = row.permission.toString().split('\n');
    for(let i=0; i<lines.length; i++) {
      let line = lines[i];
      if (line === '') continue;
      if (line[0] === '#') continue;

      let splitPermission = line.split(' ');
      let allow      = splitPermission[0];
      let accessMode = splitPermission[1];
      let pattern    = splitPermission[2];

      if (accessMode === 'all' || accessMode === mode) {
        if(utils.isPatternMatch(topic, pattern)) {
          if (allow === 'allow')
            return true;
          if (allow === 'disallow')
            return false;
        }
      }
    }

    return false;
  }
}

server.on('ready', function() {
  server.authenticate = authenticate;
  server.authorizePublish = authorizePublish;
  server.authorizeSubscribe = authorizeSubscribe;
});
server.on('clientConnected', function(client: any) {
  console.log('client connected', client.id);
});
server.on("clientDisconnected", function(client: any) {
  console.log('client disconnected', client.id);
});

server.on('published', function(packet: any, client: any) {
  if (packet.topic.indexOf('$SYS') === 0) return;

  // console.log('raw packet:', packet);
  console.log('on topic \'' + packet.topic + '\', payload:', packet.payload);

  let splitTopic = packet.topic.split('/');

  if (splitTopic[0] === 'general' && splitTopic[2] === 'echo' && splitTopic[3] === 'ping') {
    console.log('ping message:', packet.payload.toString());

    let newPacket = {
      topic: 'general/' + splitTopic[1] + '/echo/pong',
      payload: packet.payload,
      retain: packet.retain,
      qos: packet.qos
    };

    server.publish(newPacket, function() {
      console.log('pong published');
    });
  }
});
