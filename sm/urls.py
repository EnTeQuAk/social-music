from django.conf import settings
from django.conf.urls import patterns, include, url
import sm.music.urls

urlpatterns = patterns('',
    ('', include('sm.music.urls', namespace='music')),
    url('^static/(?P<path>.*)$', 'django.views.static.serve', name='static')
)
