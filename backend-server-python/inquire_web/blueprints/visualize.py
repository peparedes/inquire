from __future__ import print_function
from flask import Blueprint, request, jsonify
import spacy
import numpy as np
from sklearn.metrics.pairwise import cosine_distances
import networkx as nx
from sklearn.feature_extraction.text import CountVectorizer
from collections import Counter
import operator
from tsne import bh_sne
import logging
log = logging.getLogger(__name__)

log.debug("loading spacy..")
nlp = spacy.load("en")
log.debug("done.")
viz_blueprint = Blueprint("visualize", __name__, url_prefix="/visualize")


@viz_blueprint.route("/epsilon", methods=["POST"])
def get_epsilon_graph_visualization():
    json_data = request.get_json()
    results = json_data["results"]
    vectors = [get_sentence_vector(x) for x in results]
    distances = compute_distance_matrix(vectors)
    return jsonify(get_epsilon_clusters(results, distances))


@viz_blueprint.route("/tsne", methods=["POST"])
def get_tsne():
    json_data = request.get_json()
    results = json_data["results"]
    vectors = [get_sentence_vector(x) for x in results]
    X_2d = bh_sne(np.array(vectors), pca_d=None, d=2, perplexity=5.0, theta=0.5)
    return jsonify(list(X_2d))


def get_sentence_vector(q):
    """returns the vector for a sentence"""
    sent_analyzed = nlp.tokenizer(q)
    vect = np.zeros(shape=(300,))
    count = 0
    for word in sent_analyzed:
        if word.has_vector:
            vect += word.vector
            count += 1
    vect /= count

    return vect


def compute_distance_matrix(vectors):
    dist_matrix = cosine_distances(vectors, vectors)
    return dist_matrix


def get_epsilon_clusters(results, dist_matrix):
    il1 = np.tril(dist_matrix, -1)
    lower_triangle = dist_matrix[il1 > 0]
    epsilon = np.percentile(lower_triangle, 3)
    # make a list of edges from the adjacency matrix

    edges = []
    adj_matrix = dist_matrix < epsilon  # make adjacency matrix
    for i in range(len(results)):
        for j in range(len(results)):
            if adj_matrix[i, j] and i != j:
                edges.append((i, j))
    G = nx.Graph(edges)
    # number of connected components in Graph
    log.debug("Have %s connected components in epsilon clustering graph" % len(list(nx.connected_components(G))))

    # remove all the vertices with a degree of 80 or more
    low_degree = [x for x, v in G.degree().items() if v < 80]
    H = G.subgraph(low_degree)

    # makes json for graph visualization in the frontent
    graph = {
        'nodes': [{'id': node, 'group': 1, 'text': results[node]} for node in H.nodes()],
        'links': [{'source': i, 'target': j, 'value': 1} for (i, j) in H.edges()]
    }

    return graph


def wordcloud(results):

    vectorizer = CountVectorizer(min_df=1, stop_words='english')
    analyze = vectorizer.build_analyzer()

    def top_ngrams(communities, cluster, n=20):
        """Input:
            communities: List of lists that contain indices corresponding to sentences in the original array
            cluster: integer, the cluster to inspect
            n: integer, number of most common words to be returned"""
        sentences = np.array(results)[communities[cluster]]
        ngrams = []
        for s in sentences:
            ngrams.extend(analyze(s))

        counts = Counter(ngrams)

        return sorted(counts.items(), key=operator.itemgetter(1))[::-1][:n]

    def get_wordcloud_json(ngram):
        wordcloud = []
        for word, count in ngram:
            wordcloud.append({"text": word, "size": count})
        return wordcloud