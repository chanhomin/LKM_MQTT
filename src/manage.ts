import * as fs from 'fs';
import * as sqlite3 from 'sqlite3';
import * as readline from 'readline';
import * as child_process from 'child_process';

let db = new sqlite3.Database('db.sqlite3');

if (process.argv[2] === 'help') {
  help();
} else if (process.argv[2] === 'addUser') {
  if (process.argv[3]) {
    addUser(process.argv[3]);
  } else { help(); }
} else if (process.argv[2] === 'addGroup') {
  if(process.argv[3]) {
    addGroup(process.argv[3]);
  } else { help(); }
} else if (process.argv[2] === 'delUser') {
  if(process.argv[3]) {
    delUser(process.argv[3]);
  } else { help(); }
} else if (process.argv[2] === 'delGroup') {
  if(process.argv[3]) {
    delGroup(process.argv[3]);
  } else { help(); }
} else if (process.argv[2] === 'addMember') {
  if(process.argv[3] && process.argv[4]) {
    addMember(process.argv[3], process.argv[4]);
  } else { help(); }
} else if (process.argv[2] === 'delMember') {
  if(process.argv[3] && process.argv[4]) {
    delMember(process.argv[3], process.argv[4]);
  } else { help(); }
} else if (process.argv[2] === 'listUsers') {
  listUsers();
} else if (process.argv[2] === 'listGroups') {
  listGroups();
} else if (process.argv[2] === 'showGroupsOfUser') {
  if(process.argv[3]) {
    showGroupsOfUser(process.argv[3]);
  } else { help(); }
} else if (process.argv[2] === 'showMembers') {
  if(process.argv[3]) {
    showMembers(process.argv[3]);
  } else { help(); }
} else if (process.argv[2] === 'showUserPermission') {
  if(process.argv[3]) {
    showUserPermission(process.argv[3]);
  } else { help(); }
} else if (process.argv[2] === 'showGroupPermission') {
  if(process.argv[3]) {
    showGroupPermission(process.argv[3]);
  } else { help(); }
} else if (process.argv[2] === 'editUserPermission') {
  if(process.argv[3] && process.argv[4]) {
    editUserPermission(process.argv[3], process.argv[4]);
  } else { help(); }
} else if (process.argv[2] === 'editGroupPermission') {
  if(process.argv[3] && process.argv[4]) {
    editGroupPermission(process.argv[3], process.argv[4]);
  } else { help(); }
}
else {
  help();
}


function help() {
  console.log('permission management tool');
  console.log('\t# show this page');
  console.log('\tmanage help');
  console.log('\t# add new user');
  console.log('\tmanage addUser <userName>');
  console.log('\t# add new group');
  console.log('\tmanage addGroup <groupName>');
  console.log('\t# delete user');
  console.log('\tmanage delUser <userName>');
  console.log('\t# delete group');
  console.log('\tmanage delGroup <groupName>');
  console.log('\t# add member of group');
  console.log('\tmanage addMember <userName> <groupName>');
  console.log('\t# delete member of group');
  console.log('\tmanage delMember <userName> <groupName>');
  console.log('\t# display all users');
  console.log('\tmanage listUsers');
  console.log('\t# display all groups');
  console.log('\tmanage listGroups');
  console.log('\t# display user\'s groups');
  console.log('\tmanage showGroupsOfUser <userName>');
  console.log('\t# display members of group');
  console.log('\tmanage showMembers <groupName>');
  console.log('\t# display user\'s permission');
  console.log('\tmanage showUserPermission <userName>');
  console.log('\t# display group\'s permission');
  console.log('\tmanage showGroupPermission <groupName>');
  console.log('\t# edit user\'s permission');
  console.log('\tmanage editUserPermission <userName>');
  console.log('\t# edit group\'s permission');
  console.log('\tmanage editGroupPermission <groupName>');
}

function addUser(userName: string) {
  db.all('SELECT name FROM users WHERE name = ?', userName, function(err, rows) {
    if (err) {
      console.log('Error:', err);
    } else if(rows.length !== 0) {
      console.log('user', userName, 'is already exists');
    } else {
      let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('Enter password: ', function(password) {
        db.run('INSERT INTO users (name, password) VALUES (?, ?)', userName, password);
        rl.close();
      });
    }
  });
}

function addGroup(groupName: string) {
  db.all('SELECT name FROM groups WHERE name = ?', groupName, function(err, rows) {
    if (err) {
      console.log('Error:', err);
    } else if(rows.length !== 0) {
      console.log('group', groupName, 'is already exists');
    } else {
      db.run('INSERT INTO groups (name) VALUES (?)', groupName);
    }
  });
}

function delUser(userName: string) {
  db.run('DELETE FROM users WHERE name = ?', userName);
}

function delGroup(groupName: string) {
  db.run('DELETE FROM groups WHERE name = ?', groupName);
}

function addMember(userName: string, groupName: string) {
  db.run(
    `INSERT INTO groupMembers (userId, groupId) VALUES (
     (SELECT id FROM users  WHERE name = ?),
     (SELECT id FROM groups WHERE name = ?)
     )`,
    userName, groupName, function(err: any) {
      if(err) console.log('Error: ', err);
    }
  );
}

function delMember(userName: string, groupName: string) {
  db.run(
    `DELETE FROM groupMembers WHERE
     userId  = (SELECT id FROM users  WHERE name = ?) AND
     groupId = (SELECT id FROM groups WHERE name = ?)`,
    userName, groupName, function(err: any) {
      if(err) console.log('Error: ', err);
    }
  );
}

function listUsers() {
  db.each('SELECT name FROM users', function(err, row) {
    if (err) {
      if (err) throw err;
      return;
    }
    console.log(row.name);
  });
}

function listGroups() {
  db.each('SELECT name FROM groups', function(err, row) {
    if (err) {
      if (err) throw err;
      return;
    }
    console.log(row.name);
  });
}

function showGroupsOfUser(userName: string) {
  db.each('SELECT groups.name AS name FROM users, groups groupMembers WHERE users.name = ?', userName, function(err, row) {
    if (err) {
      if (err) throw err;
      return;
    }
    console.log(row.name);
  });
}

function showMembers(groupName: string) {
  db.each('SELECT users.name AS name FROM users, groups, groupMembers WHERE groups.name = ?', groupName, function(err, row) {
    if (err) {
      if (err) throw err;
      return;
    }
    console.log(row.name);
  });
}

function showUserPermission(userName: string) {
  db.all('SELECT permission FROM users WHERE name = ?', userName, function(err, rows) {
    if (err) {
      if (err) throw err;
      return;
    }
    if (rows.length === 0)
      console.log('no such user');
    else
      console.log(rows[0].permission.toString());
  });
}

function showGroupPermission(groupName: string) {
  db.all('SELECT permission FROM groups WHERE name = ?', groupName, function(err, rows) {
    if (err) {
      if (err) throw err;
      return;
    }
    if (rows.length === 0)
      console.log('no such group');
    else
      console.log(rows[0].permission.toString());
  });
}

function editUserPermission(userName: string, permissionFile: string) {
  fs.readFile(permissionFile, function(err, data) {
    db.run('UPDATE users SET permission = ? WHERE name = ?', data, userName, function(err: any) {
      if (err) throw err;
    })
  });
}

function editGroupPermission(groupName: string, permissionFile: string) {
  fs.readFile(permissionFile, function(err, data) {
    db.run('UPDATE groups SET permission = ? WHERE name = ?', data, groupName, function(err: any) {
      if (err) throw err;
    })
  });
}
