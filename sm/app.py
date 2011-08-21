#-*- coding: utf-8 -*-
import json
import requests
from flask import Flask, render_template, request, Response


app = Flask(__name__)
app.config['DEBUG'] = True


@app.route('/', methods=['POST', 'GET'])
def home():
    return render_template('home.html')


@app.route('/get_tracks/')
def get_artists():
    name = request.args.get('artist_name', '')
    print request.args, request.form
    print "query for %s" % name
    info = requests.get('http://api.jamendo.com/get2/id+name+duration+stream+album_name+artist_name/track/json/track_album+album_artist/',
                        params={'searchquery': name, 'streamencoding': 'ogg2'})
    print info.content
    return info.content
