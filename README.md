# LKM_MQTT

mqtt server/client for LKM IoT Authentication System

### TLS create query
```
$ openssl genrsa -aes256 -out server.cakey.pem
$ openssl req -new -x509 -key server.cakey.pem -out root.crt
$ openssl genrsa -out server.key
$ openssl req -new -key server.key -out server.csr
$ openssl x509 -req -in server.csr -days 3650 -sha1 -CAcreateserial -CA root.crt -CAkey server.cakey.pem -out server.crt
$ openssl genrsa -out client.key
$ openssl req -new -key client.key -out client.csr
$ openssl x509 -req -in client.csr -days 3650 -sha1 -CAcreateserial -CA root.crt -CAkey server.cakey.pem -out client.crt
```

### permission manager usage
```
# add new user
manage addUser <userName>
# add new group
manage addGroup <groupName>
# delete user
manage delUser <userName>
# delete group
manage delGroup <groupName>
# add member of group
manage addMember <userName> <groupName>
# delete member of group
manage delMember <userName> <groupName>
# display all users
manage listUsers
# display all groups
manage listGroups
# display user's groups
manage showGroupsOfUser <userName>
# display members of group
manage showMembers <groupName>
# display user's permission
manage showUserPermission <userName>
# display group's permission
manage showGroupPermission <groupName>
# edit user's permission
manage editUserPermission <userName>
# edit group's permission
manage editGroupPermission <groupName>
```

### format of permission description
```
<allow|disallow> <all|publish|subscribe> <topic>
```
note: first line will be affected first
