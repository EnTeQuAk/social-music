#-*- coding: utf-8 -*-
import os
import json
import requests
import time
import random
from flask import Flask, render_template, request, Response
from pyechonest import config as econfig, artist as eartist

econfig.ECHO_NEST_API_KEY = os.environ.get('ECHO_NEXT_API_KEY', '')

app = Flask(__name__)
app.config['DEBUG'] = True

moods = eartist.list_terms('mood')
styles = eartist.list_terms('style')

def flatten_iterator(iter):
    """Flatten an iterator to one without any sub-elements"""
    for item in iter:
        if hasattr(item, '__iter__'):
            for sub in flatten_iterator(item):
                yield sub
        else:
            yield item


@app.route('/', methods=['POST', 'GET'])
def home():
    return render_template('home.html')


@app.route('/hailstorm_5508ba.html', methods=['GET', 'POST'])
def hailstorm():
    return Response('I hereby consent to getting hailstormed')

@app.route('/mu-ba257cdb-f20580a8-81b8c94e-29153a62', methods=['GET', 'POST'])
def blitz():
    return Response('42')


@app.route('/get_tracks/')
def get_tracks():
    query = request.args.get('query', '')
    parts = query.lower().split()
    artists, songs = [], []

    if any(p in moods for p in parts):
        for part in parts:
            if part in moods:
                artists.extend(eartist.similar(mood=part, results=15))
    if any(p in styles for p in parts):
        for part in parts:
            if part in styles:
                artists.extend(eartist.similar(style=part, results=15))

    random.shuffle(artists)

    extracted = eartist.extract(query)
    if extracted:
        for artist in extracted:
            artists.insert(0, eartist.Artist(id=artist.id))
        artists.extend(eartist.similar(ids=[art.id for art in extracted], results=15))

    if artists:
        songs = list(flatten_iterator(a.get_songs() for a in artists))
        #random.shuffle(songs)

    real = {}
    for song in songs:
        real[song.title] = song

    retval = [{
        'track': s.title,
        'artist': s.artist_name,
        'album': ''
    } for s in real.values()[:15]]

    print retval, len(retval)

    info = requests.get('http://api.jamendo.com/get2/id+name+duration+stream+album_name+artist_name/track/json/track_album+album_artist/',
                        params={'searchquery': query, 'streamencoding': 'ogg2', 'n': 5})

    items = [{
        'track': s['name'],
        'artist': s['artist_name'],
        'album': s['album_name']
    } for s in json.loads(info.content)]
    for item in items:
        retval.append(item)

    print len(retval)

    return Response(json.dumps(retval), content_type='application/json')
