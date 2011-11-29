#-*- coding: utf-8 -*-
import os
import random
import json

import requests
from pyechonest import config as econfig, artist as eartist

from sm.core.views import TemplateView, JSONView
from sm.utils import flatten_iterator


econfig.ECHO_NEST_API_KEY = os.environ.get('ECHO_NEXT_API_KEY', '')

moods = eartist.list_terms('mood')
styles = eartist.list_terms('style')


class Home(TemplateView):
    template_name = 'home.html'


class GetTracks(JSONView):

    def get_context_data(self, **kwargs):
        query = self.request.GET.get('query', '')
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

        return retval
