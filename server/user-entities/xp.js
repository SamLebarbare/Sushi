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
  user.lvl = newUserData.lvl;
  user.neededXp = newUserData.neededXp;
  user.progress = newUserData.progress;
};

exports.gainSkillXP = function *(user, skill, xp) {
  /* get userData from store*/
  var userData = yield mongo.users.findOne({_id: user.id,'skills.type': skill});
  if (userData) {
    console.log ('skill ' + skill + ' found!');
    /* get skill data */
    var skillData;
    userData.skills.forEach (function (s) {
      if(s.type === skill) {
        skillData = s;
      }
    });
    /* levelUp user */
    var newSkillData = levelUp (skillData, xp);
    /* save new skillData*/
    yield mongo.users.update(
    {_id: user.id,'skills.type': skill},
    {$set: {'skills.$.xp': newSkillData.xp,
      'skills.$.lvl': newSkillData.lvl,
      'skills.$.neededXp': newSkillData.neededXp,
      'skills.$.progress': newSkillData.progress
    }}
    );
    user.skills.forEach (function (s) {
      if(s.type === skill) {
        s.xp = newSkillData.xp;
        s.lvl = newSkillData.lvl;
        s.neededXp = newSkillData.neededXp;
        s.progress = newSkillData.progress;
      }
    });
  } else {
    var initSkillData = {
      type : skill,
      xp : 0,
      lvl: 1,
      neededXp: 0,
      progress: 0
    };
    var newInitSkillData = levelUp (initSkillData, xp);
    var result = yield mongo.users.update(
      {_id: user.id},
      {$push: {skills: newInitSkillData}}
    );
    user.skills.push (newInitSkillData);
    console.log ('skill ' + skill + ' created!');
  }
};
