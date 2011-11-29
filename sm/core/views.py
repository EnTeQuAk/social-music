#-*- coding: utf-8 -*-
import os
import json
import requests
import time
import random

from django.http import HttpResponse
from django.views.generic import edit, base, list

from sm.core.templating import render_template


class TemplateResponse(HttpResponse):
    """
    Returns a rendered template as response.
    """
    def __init__(self, template_name, context, status=200,
                 content_type='text/html; charset=utf-8'):
        tmpl = render_template(template_name, context)
        HttpResponse.__init__(self, tmpl, status=status,
                              content_type=content_type)


class TemplateResponseMixin(base.TemplateResponseMixin):
    """A mixin that can be used to render a template.

    This mixin hooks in our own `Jinja <http://jinja.pocoo.org>`_
    based :class:`TemplateResponse` class.
    """
    response_class = TemplateResponse

    def render_to_response(self, context, **response_kwargs):
        """
        Returns a response with a template rendered with the given context.
        """
        template_name = self.get_template_names()[0]
        return self.response_class(template_name=template_name, context=context)


class TemplateView(TemplateResponseMixin, base.View):
    """A view that renders a template."""
    def get_context_data(self, **kwargs):
        return {'params': kwargs}

    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        return self.render_to_response(context)


class JSONView(base.View):
    """A View that renders a dictionary to a JSON response."""
    def get_context_data(self, **kwargs):
        return {'params': kwargs}

    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        return HttpResponse(json.dumps(context), content_type='application/json')
