from __future__ import print_function
from flask import Blueprint, request
import requests
import logging
log = logging.getLogger(__name__)

search_blueprint = Blueprint("search", __name__, url_prefix="/search")

search_api_path = None


def init_search_blueprint(api_path):
    global search_api_path
    search_api_path = api_path


@search_blueprint.route("/", methods=["POST"])
def execute_search():
    log.debug("Forwarding search query to %s" % search_api_path)
    query = request.json()["query"]
    return requests.post(search_api_path, query).json()
