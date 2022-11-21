from PIL import Image
import os 

SIZE = 21



def getPathOfMapFile(fileName):
    return  os.path.abspath('maps/' + fileName)



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

def findMaps():
    files = []
    for file in os.listdir("maps"):
        if file.endswith(".png") & file.startswith("map"):
            files.append([file.split('.')[0], getPathOfMapFile(file)])
    return files