exports.getPack = function *(bud, type) {
  var packData = {};
  if(bud && type) {
    bud.budPacksData.forEach(function (pack){
      if(pack.type === type) {
        packData = pack.data;
        return;
      }
    });
    return packData;
  }
};
