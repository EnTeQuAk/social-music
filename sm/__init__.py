import os

import newrelic.agent
newrelic.agent.initialize(os.path.join(os.path.abspath(os.path.dirname(__name__)), 'sm', 'newrelic.ini'))
