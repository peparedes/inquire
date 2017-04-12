from flask import Flask
import logging

log = logging.getLogger(__name__)


def build_app():
    app = Flask(__name__.split(".")[0])
    app.debug = True

    @app.after_request
    def add_header(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'
        return response

    log.debug("Setting up blueprints..")
    from inquire_web.blueprints.visualize import viz_blueprint
    from inquire_web.blueprints.search import search_blueprint

    app.register_blueprint(viz_blueprint)
    app.register_blueprint(search_blueprint)

    return app

app = build_app()
