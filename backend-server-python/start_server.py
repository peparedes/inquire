from flask import Flask
from inquire_web.visualize import viz_blueprint


def build_app():
    app = Flask(__name__.split(".")[0])

    @app.after_request
    def add_header(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'
        return response

    app.register_blueprint(viz_blueprint)

    return app


if __name__ == "__main__":
    app = build_app()
    app.run(host="0.0.0.0", port=8080)