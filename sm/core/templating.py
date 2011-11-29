# -*- coding: utf-8 -*-
import os
from functools import partial
from glob import glob

from django.conf import settings
from django.core import urlresolvers
from django.utils import translation
from django.utils import simplejson as json

from jinja2 import Environment, FileSystemLoader, escape, TemplateNotFound


def url_for(viewname, *args, **kwargs):
    return urlresolvers.reverse(viewname, args=args or None,
                                kwargs=kwargs or None)


def render_template(template_name, context, flash=False):
    """Render a template.  You might want to set `req` to `None`."""
    tmpl = jinja_env.get_template(template_name)
    return tmpl.render(context)


def render_string(source, context):
    tmpl = jinja_env.from_string(source)
    return tmpl.render(context)


class InyokaEnvironment(Environment):
    def __init__(self):
        template_paths = list(settings.TEMPLATE_DIRS)

        template_paths.extend(glob(os.path.join(os.path.dirname(__file__),
                                                os.pardir, '*/templates')))
        loader = FileSystemLoader(template_paths)
        Environment.__init__(self, loader=loader,
                             extensions=['jinja2.ext.i18n', 'jinja2.ext.do'],
                             auto_reload=settings.DEBUG,
                             cache_size=-1)

        self.globals.update(url_for=url_for)

        self.install_gettext_translations(translation, newstyle=True)


# setup the template environment
jinja_env = InyokaEnvironment()
