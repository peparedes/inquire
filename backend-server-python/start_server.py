from flask import Flask, send_from_directory
from werkzeug.wsgi import DispatcherMiddleware
from werkzeug.serving import run_simple
from inquire_web.visualize import viz_blueprint


def build_app():
    app = Flask(__name__.split(".")[0])
    app.debug = True
    static_app = Flask(__name__.split(".")[0] + "_static")
    static_app.debug = True

    @app.after_request
    def add_header(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'
        return response

    @static_app.route("/", defaults={'path': 'index.html'})
    @static_app.route('/<path:path>')
    def server_static(path):
        return send_from_directory('static', path)

    app.register_blueprint(viz_blueprint)

    local_app = DispatcherMiddleware(
        static_app,
        {
            "/api": app
        }
    )
    local_app.config = {}
    local_app.debug = True

    return local_app


if __name__ == "__main__":
    app = build_app()
    run_simple('0.0.0.0', 8080, app)