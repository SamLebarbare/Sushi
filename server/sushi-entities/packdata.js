exports.getPack = function (sushi, type) {
  var packData = {};
  if(sushi && type) {
    sushi.sushiPacksData.forEach(function (pack){
      if(pack.type === type) {
        packData = pack.data;
        return packData;
      }
    });
    return packData;
  }
};
