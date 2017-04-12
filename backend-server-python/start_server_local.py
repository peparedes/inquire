from werkzeug.serving import run_simple
from inquire_web.blueprints.search import init_search_blueprint
from flask import Flask, send_from_directory
from werkzeug.wsgi import DispatcherMiddleware
import datetime
import logging
logging.basicConfig(
    format="%(asctime)s %(levelname)-8s %(name)-18s: %(message)s",
    filename="inquire_%s.log" % datetime.datetime.now().isoformat()
)

log = logging.getLogger(__name__)

if __name__ == "__main__":
    init_search_blueprint("localhost")  # TODO get actual search API path here, maybe configurable
    from inquire_web.server import app

    static_app = Flask(__name__.split(".")[0] + "_static")
    static_app.debug = True

    # This is for local debugging and development, so we need to serve static files
    @static_app.route("/", defaults={'path': 'index.html'})
    @static_app.route('/<path:path>')
    def server_static(path):
        return send_from_directory('static', path)

    local_app = DispatcherMiddleware(
        static_app,
        {
            "/api": app
        }
    )
    local_app.config = {}
    local_app.debug = True
    run_simple('0.0.0.0', 8080, app)