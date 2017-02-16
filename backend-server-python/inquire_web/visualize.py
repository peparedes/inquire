from flask import Blueprint

viz_blueprint = Blueprint("visualize", __name__, url_prefix="/visualize")


def load_sample_data():
    queries_file = open("../data/user_studies/all.txt", "r")
    lines = queries_file.readlines()
    lines = [l.strip() for l in lines]
    # remove all strings with length < 3
    queries = []
    for i in lines:
        if not len(i) < 3:
            queries.append(i)