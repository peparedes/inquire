from inquire_web.utils import load_sample_data
import os
import requests

if __name__ == "__main__":
    print(os.getcwd())
    query, scores, results = load_sample_data()

    r = requests.post(
        "http://localhost:8080/api/visualize/epsilon",
        json={
            "results": results
        }
    )

    print(r.json())
