var mongo = require('../config/mongo');


var calcNeededXp = function (lvl) {
  return (50 * Math.pow (lvl - 1, 3) - 150 * Math.pow (lvl - 1, 2) + 400 * (lvl - 1)) / 3;
};

var calcLevel = function (xp) {
  return 50 * Math.pow (xp, 3) - (150 * xp) + 200;
};


var levelUp = function (user, xp) {
  var initialXp       = user.xp;
  var initialLvl      = user.lvl;
  var newXp           = initialXp + xp;
  var newLvl          = initialLvl + 1;
  if (newXp > calcNeededXp (newLvl)) {
    while (newXp > calcNeededXp (newLvl)) {
      newXp = newXp - calcNeededXp (newLvl);
      newLvl++;
      user.lvl = newLvl;
      user.xp  = newXp;
      user.neededXp = calcNeededXp (newLvl);
      console.log ('GAIN! xp:' +user.xp + ' lvl:' + user.lvl + " neededXp:" + user.neededXp);
      user.progress = (user.xp / user.neededXp) * 100;
    }
  } else
  {
    user.xp  = newXp;
    user.neededXp = calcNeededXp (newLvl);
    user.progress = (user.xp / user.neededXp) * 100;
    console.log ('GAIN! xp:' +user.xp + ' lvl:' + user.lvl + " neededXp:" + user.neededXp);
  }

  return user;
};

exports.gainMainXP = function *(user, xp) {
  /* get userData from store*/
  var userData = yield mongo.users.findOne({_id: user.id});
  /* levelUp user */
  var newUserData = levelUp (userData, xp);
  /* save new userData*/
  yield mongo.users.update(
    {_id: user.id},
    {$set: {
        xp: newUserData.xp,
        lvl: newUserData.lvl,
        neededXp: newUserData.neededXp,
        progress: newUserData.progress
      }
    }
  );
  user.xp = newUserData.xp;
  user.lvl = newUserData.lvl,
  user.neededXp = newUserData.neededXp,
  user.progress = newUserData.progress
};
