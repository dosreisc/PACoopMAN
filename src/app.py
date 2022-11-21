from flask import Flask, render_template
import os
import mapManager
import json

app = Flask(__name__)

@app.route('/') 
def root():
    return render_template("index.html")


@app.route('/get/map/<id>/')
def getMap(id):
    content = mapManager.loadMapImage(mapManager.getPathOfMapFile(id+'.png'))
    return json.dumps(content)

@app.route('/get/maps/')
def getMaps():
    return json.dumps(mapManager.findMaps())
