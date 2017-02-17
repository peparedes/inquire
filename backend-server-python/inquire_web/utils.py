from nltk.corpus import stopwords
from string import punctuation
import itertools
import numpy as np
import nltk
import codecs

queries = None


def load_sample_data(query_number=3):
    global queries

    def get_results(q_num):
        filename = "../viz-notebooks/data/user_studies/results_" + str(q_num) + ".txt"
        f = codecs.open(filename, "r", "utf-8")
        lst = f.readlines()
        lst = [i.split("--") for i in lst]
        lst = list(zip(*lst))
        scores = [float(i.strip()) for i in lst[0]]
        results = [i.strip() for i in lst[1]]
        return scores, results

    def load_queries():
        queries_file = codecs.open("../viz-notebooks/data/user_studies/all.txt", "r", "utf-8")
        lines = queries_file.readlines()
        lines = [l.strip() for l in lines]
        # remove all strings with length < 3
        qs = []
        for i in lines:
            if not len(i) < 3:
                qs.append(i)
        return qs

    queries = queries or load_queries()
    query = queries[query_number]
    scores, results = get_results(query_number)

    return query, scores, results


def clean_sentence(s):
    """Returns a list of all the words in a sentence with no stop words and no punctuation"""
    tokenized_sentence = [i.strip() for i in nltk.word_tokenize(s.lower())]
    words = [w for w in tokenized_sentence if w not in stopwords.words('english') and w not in punctuation]
    return words


#Find most relevant words
def make_dictionary(docs):
    """Takes in a list of documents and returns an alphabetically sorted list of all distinct words"""
    s = list(set(list(itertools.chain.from_iterable(docs))))
    s = list(sorted(s))
    return dict([(s[i], i) for i in range(len(s))])


def count_instances(map_, doc):
    """Counts instances words in docs given a dictionary"""
    count_array = np.zeros(len(map_.keys()))
    for word, index in map_.items():
        count_array[index] = doc.count(word)+1
    return count_array


def find_ngrams(input_list, n):
    if type(n) == list:
        lst = []
        for i in n:
            lst.extend(list(zip(*[input_list[j:] for j in range(i)])))
        return lst
    return list(zip(*[input_list[i:] for i in range(n)]))
