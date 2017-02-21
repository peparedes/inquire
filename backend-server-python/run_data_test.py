from inquire_web.visualize import compute_distance_matrix, get_epsilon_clusters
from inquire_web.utils import load_sample_data
import os

if __name__ == "__main__":
    print(os.getcwd())
    query, scores, results = load_sample_data()
    print("RESULTS:\n%s" % results)

    distances = compute_distance_matrix(results)
    get_epsilon_clusters(results, distances)


