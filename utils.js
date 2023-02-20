const Jimp = require('jimp');

module.exports = {
    makeid,
    loadMapData,
  }
  
  function makeid(length) {
     var result           = '';
     //var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     var characters       = '0123456789';
     var charactersLength = characters.length;
     //for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     //}
     return result;
  }


  // Reads image pixels and define objet type depending on pixel's color
   async function loadMapData(imagePath){
      console.log('funct loadMapData');
      var mapData = [];

      //var image = Jimp.read(imagePath);

//https://stackoverflow.com/questions/51437665/node-js-async-promise-explanation-with-jimp

      return new Promise(async (resolve, reject) => {
         await Jimp.read(await imagePath).then(image => {
            image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
               // x, y is the position of this pixel on the image
               // idx is the position start position of this rgba tuple in the bitmap Buffer
               // this is the image
         
               var r = this.bitmap.data[idx + 0];
               var g = this.bitmap.data[idx + 1];
               var b = this.bitmap.data[idx + 2];
               //var a = this.bitmap.data[idx + 3];
   
   
               /**blue pixel - wall
                * green pixel - food
                * red pixel - enemies spawn zone
                * black pixel - nothing
                * white pixel - special food
                * yellow pixel - PacMan spawn 
                */
               if ((r == 0) & (g == 0) & (b == 255)){
                  mapData.push('WALL');
                  //console.log('WALL');
               }
               else if ((r == 0) & (g == 255) & (b == 0)){
                  mapData.push('FOOD');
                  //console.log('FOOD');
               }
               else if ((r == 255) & (g == 0) & (b == 0)){
                  mapData.push('SPAWN_E');
                  //console.log('SPAWn E');
               }
               else if ((r == 0) & (g == 0) & (b == 0)){
                  mapData.push('');
                  //console.log('');
               }
               else if ((r == 255) & (g == 255) & (b == 255)){
                  mapData.push('S_FOOD');
                  //console.log('S FOOD');
               }
               else if ((r == 255) & (g == 255) & (b == 0)){
                  mapData.push('SPAWN_P');
                  //console.log('SPAWN P');
               }else{
                  reject("ERROR image file does not meet standarts")
               }
            });
            resolve(mapData);
         });

      });

      console.log
      //Jimp.read(imagePath).then(image => {
         // Do stuff with the image.

         
         /*});

         console.log("Filled mapData : " + mapData);
         return mapData;

      }).catch(err => {
         // Handle an exception.
         console.log("ERROR " + err);
         return null;
      });*/
  }

  /**
    def loadMapImage(filepath):
    #if (exist(filepath)):
    #    return 'Error 404, file not found'

    im = Image.open(filepath) # Can be many different formats.
    content = []
    pix = im.load()

    width, height = im.size  # Get the width and hight of the image for iterating over
    if (width != SIZE & height != SIZE):
        return 'Error , file is not at the right size. Must by 21x21 pixels.'

    for y in range(SIZE):
        for x in range(SIZE):
            r, g, b, a = pix[x,y] # get rgba color of pixel
            
            if (r == 0) & (g == 0) & (b == 255): # blue pixel - wall
                content.append('WALL')
            
            elif (r == 0) & (g == 255) & (b == 0): # green pixel - food
                content.append('FOOD')
            
            elif (r == 255) & (g == 0) & (b == 0): # red pixel - spawn zone
                content.append('SPAWN_E')
            
            elif (r == 0) & (g == 0) & (b == 0): # black pixel - nothing
                content.append('')
            
            elif (r == 255) & (g == 255) & (b == 255): # white pixel - special food
                content.append('S_FOOD')
            
            elif (r == 255) & (g == 255) & (b == 0): # yellow pixel - special food
                content.append('SPAWN_P')
    return content
 */