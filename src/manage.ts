import * as sqlite3 from 'sqlite3';

let db = new sqlite3.Database('db.sqlite3');

if (process.argv[2] === 'help')
  help();
else if (process.argv[2] === 'addUser')
  addUser(process.argv[3]);
else if (process.argv[2] === 'addGroup')
  addGroup(process.argv[3]);
else if (process.argv[2] === 'delUser')
  delUser(process.argv[3]);
else if (process.argv[2] === 'delGroup')
  delGroup(process.argv[3]);
else if (process.argv[2] === 'addMember')
  addMember(process.argv[3], process.argv[4]);
else if (process.argv[2] === 'delMember')
  delMember(process.argv[3], process.argv[4]);
else if (process.argv[2] === 'listUsers')
  listUsers();
else if (process.argv[2] === 'listGroups')
  listGroups();
else if (process.argv[2] === 'showGroupsOfUser')
  showGroupsOfUser(process.argv[3]);
else if (process.argv[2] === 'showMembers')
  showMembers(process.argv[3]);
else if (process.argv[2] === 'showUserPermission')
  showUserPermission(process.argv[3]);
else if (process.argv[2] === 'showGroupPermission')
  showGroupPermission(process.argv[3]);
else if (process.argv[2] === 'editUserPermission')
  editUserPermission(process.argv[3]);
else if (process.argv[2] === 'editGroupPermission')
  editGroupPermission(process.argv[3]);
else
  help();


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
  // TODO
}

function addGroup(groupName: string) {
  // TODO
}

function delUser(userName: string) {
  // TODO
}

function delGroup(groupName: string) {
  // TODO
}

function addMember(userName: string, groupName: string) {
  // TODO
}

function delMember(userName: string, groupName: string) {
  // TODO
}

function listUsers() {
  db.each('SELECT * FROM users', function(err, row) {
    if (err) {
      console.log('Error: ' + err);
      return;
    }
    console.log(row.name);
  });
}

function listGroups() {
  // TODO
}

function showGroupsOfUser(userName: string) {
  // TODO
}

function showMembers(groupName: string) {
  // TODO
}

function showUserPermission(userName: string) {
  // TODO
}

function showGroupPermission(groupName: string) {
  // TODO
}

function editUserPermission(userName: string) {
  // TODO
}

function editGroupPermission(groupName: string) {
  // TODO
}
