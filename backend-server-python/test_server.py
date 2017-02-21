from inquire_web.utils import load_sample_data
import os
import requests

if __name__ == "__main__":
    print(os.getcwd())
    query, scores, results = load_sample_data()
    print(results)
    r1 = requests.post(
        "http://localhost:8000/api/visualize/epsilon",
        json={
            "results": results
        }
    )

    print(r1.json())

    r2 = requests.post(
        "http://localhost:8000/api/visualize/users",
        json={
            "results":['vasilis', 'vasilis', 'franky', 'franky', 'franky', 'biye']
        }
    )

    print(r2)

    print(r2.json())
