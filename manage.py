from flaskext.script import Manager
from sm.app import app

manager = Manager(app)

if __name__ == "__main__":
    manager.run()
