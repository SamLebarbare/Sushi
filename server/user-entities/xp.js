var levelingConstant = (3/2);
exports.gainXP = function (user, xp) {
  if (!xp) {
    return;
  }
  user.xp    = user.xp + xp;
  user.level = levelingConstant * Math.sqrt(user.xp );
  console.log ('xp:' +user.xp + 'lvl:' + user.lvl)
};
