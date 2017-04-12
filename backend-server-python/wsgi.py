__author__ = 'dowling'
from start_server_local import app as application
from werkzeug.wsgi import DispatcherMiddleware


def placeholder(env, resp):
    resp(b'200 OK', [(b'Content-Type', b'text/plain')])
    return [b'Hello WSGI World']

application = DispatcherMiddleware(placeholder, {"/api": application})

if __name__ == "__main__":
    application.run()
