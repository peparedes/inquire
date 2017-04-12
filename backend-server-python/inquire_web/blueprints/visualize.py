from __future__ import print_function
from flask import Blueprint, request, jsonify
import spacy
import numpy as np
from sklearn.metrics.pairwise import cosine_distances
import networkx as nx
import pandas as pd
from community import community_louvain
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from collections import Counter
import operator

vectorizer = CountVectorizer(min_df=1, stop_words='english')
analyze = vectorizer.build_analyzer()


print("loading spacy..")
nlp = spacy.load("en")
print("done.")
viz_blueprint = Blueprint("visualize", __name__, url_prefix="/visualize")


@viz_blueprint.route("/epsilon", methods=["POST"])
def get_epsilon_graph_visualization():
    json_data = request.get_json()
    results = json_data["results"]
    distances = compute_distance_matrix(results)
    H = get_graph(results, distances);
    return jsonify(get_epsilon_clusters(H, results))


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


def compute_distance_matrix(results):
    """Computes distance matrix using pairwise cosine similarity"""
    vectors = [get_sentence_vector(x) for x in results]
    dist_matrix = cosine_distances(vectors, vectors)
    return dist_matrix


def get_graph(results, dist_matrix):
    """Returns subgraph H that will be shown in visualization."""
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
    print("Have %s connected components in epsilon clustering graph" % len(list(nx.connected_components(G))))

    # remove all the vertices with a degree of 80 or more
    low_degree = [x for x, v in G.degree().items() if v < 80]
    H = G.subgraph(low_degree)

    return H


def get_communities(H):
    """Returns the clusters from the graph H."""
    d = community_louvain.generate_dendrogram(H)
    partition = community_louvain.partition_at_level(d, 2)
    communities = [[]] * (max(partition.values()) + 1)
    for node, com in partition.items():
        communities[com] = communities[com] + [node]
    return communities


def get_epsilon_clusters(H, results):

    # makes json for graph visualization in the frontent
    graph = {
        'nodes': [{'id': node, 'group': 1, 'text': results[node]} for node in H.nodes()],
        'links': [{'source': i, 'target': j, 'value': 1} for (i, j) in H.edges()]
    }

    return graph


@viz_blueprint.route("/users", methods=["POST"])
def get_users():
    contributors = request.get_json()
    results = contributors["results"]
    contributors = pd.Series(results).value_counts()[:20]
    lst = []
    print(contributors)
    for contr, counts in zip(contributors.index, contributors.values):
        dict_ = {}
        dict_['Freq'] = str(counts)
        dict_['Letter'] = contr
        print(contr)
        dict_['link'] = "http://" + contr + ".livejournal.com"
        lst.append(dict_)
    return jsonify({"results":lst})


@viz_blueprint.route("/wordcloud", methods=["POST"])
def wordcloud():
    json_data = request.get_json()
    results = json_data["results"]
    return jsonify(get_wordcloud_json(top_ngrams(results)))


def top_ngrams(results, n=20):
    """Input:
        communities: List of lists that contain indices corresponding to sentences in the original array
        cluster: integer, the cluster to inspect
        n: integer, number of most common """
    sentences = results
    ngrams = []
    for s in sentences:
        ngrams.extend(analyze(s))

    counts = Counter(ngrams)

    return sorted(counts.items(), key=operator.itemgetter(1))[::-1][:n]


def get_wordcloud_json(ngram):
    wordcloud = []
    for word, count in ngram:
        wordcloud.append({"text":word, "size":count})
    return wordcloud

