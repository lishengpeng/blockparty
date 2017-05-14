let arg = require('yargs').argv;
let fs = require('fs');
let Conference = artifacts.require("./Conference.sol");

if (!(arg.f && arg.t)) {
  throw('usage: truffle exec scripts/change_owner.js -f original_owner.txt -t address_to_change.txt');
}
module.exports = async function() {
  let conference = await Conference.deployed();
  let from = fs.readFileSync(arg.f, 'utf8').trim().split('\n')[0];
  let to = fs.readFileSync(arg.t, 'utf8').trim().split('\n')[0];
  let owner = await conference.owner.call();
  if (owner != from) {
    throw('current owner', owner, ' does not match with', from);
  }
  await conference.transferOwnership(to, {from:from})
  let new_owner = await conference.owner.call();
  console.log('Changing ownership from ', from, ' to ', to);
  if (new_owner != to) {
    throw('new owner', new_owner, ' does not match with', to);
  }
}