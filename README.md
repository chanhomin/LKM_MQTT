# LKM_MQTT

mqtt server/client for LKM IoT Authentication System
<<<<<<< HEAD
=======

### TLS create query
```
$ openssl genrsa -des3 -out server.cakey.pem
$ openssl req -new -x509 -key server.cakey.pem -out root.crt
$ openssl genrsa -out server.key
$ openssl req -new -key server.key -out server.csr
$ openssl x509 -req -in server.csr -days 3650 -sha1 -CAcreateserial -CA root.crt -CAkey server.cakey.pem -out server.crt
$ openssl genrsa -out client.key
$ openssl req -new -key client.key -out client.csr
$ openssl x509 -req -in client.csr -days 3650 -sha1 -CAcreateserial -CA root.crt -CAkey server.cakey.pem -out client.crt
```
>>>>>>> dd9c7e9c822188ec1f5942ec65d7df73622f6be8
