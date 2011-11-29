#-*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url
import views


urlpatterns = patterns('music',
    url('^$', views.Home.as_view(), name='home'),
    url('^get_tracks/$', views.GetTracks.as_view(), name='get_tracks'),
)
