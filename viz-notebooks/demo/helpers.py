from gensim.models import Word2Vec
import re
import pandas as pd
import matplotlib as plt
import json
from textblob import TextBlob
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
from termcolor import colored
import networkx as nx
from sklearn.metrics.pairwise import cosine_similarity
from spacy.en import English

# print("Loading Spacy...")
# nlp = English()
# print("Done")

def read_query_results():
    f = open("results.txt", "r")
    lst = f.readlines()
    lst = [i.split("--") for i in lst]
    lst = list(zip(*lst))
    scores = [float(i.strip()) for i in lst[0]]
    results = [i.strip() for i in lst[1]]
    emotion_tag = [i.strip() for i in lst[2]]
    username = [re.search('//(.*?).livejournal.com',i.strip()).group(1) for i in lst[3]]
    return results, scores, emotion_tag, username

def load_user_contributions_data(usernames):
    contributors = pd.Series(usernames).value_counts()[:20]
    lst = []
    for contr, counts in zip(contributors.index, contributors.values):
        dict_ = {}
        dict_['Freq'] = str(counts)
        dict_['Letter'] = contr
        dict_['link'] = "http://" + contr + ".livejournal.com"
        lst.append(dict_)
    with open('vis/users.json', 'w') as outfile:
        json.dump(lst, outfile)
    print("Done!")

def generate_emotion_cloud_data(emotions):
    results = pd.Series(emotions).value_counts()
    wordcloud = []
    for emotion, count in zip(results.index, results.values):
        wordcloud.append({"text":emotion, "size":count})
    #print(wordcloud)
    with open('vis/wordcloud.json', 'w') as outfile:
        outfile.write(str(wordcloud).replace("'", '"'))
    print("Done!")

def generate_polarity_data(results):
    return [TextBlob(r).polarity for r in results]


def underline_word(word):
    return colored(word, "yellow")

def tfidf_words(sentences, n=10):
    tfidf = TfidfVectorizer()
    response = tfidf.fit_transform(sentences)
    feature_array = np.array(tfidf.get_feature_names())
    tfidf_sorting = np.argsort(response.toarray()).flatten()[::-1]
    top_n = feature_array[tfidf_sorting][:n]
    scores = np.sort(response.toarray()).flatten()[::-1][:n]
    for word, score in zip(top_n, scores):
        print(score,"-",word)



def print_similarity(scores, results):
    similar_word = most_frequent_word(results)
    for score,sentence in zip(scores, results):
        my_regex = r"\b" + re.escape(similar_word) + r"\b"
        sentence = re.sub(my_regex, underline_word(similar_word), sentence)
        print(str(score)+"--"+sentence)

def print_underlined(scores, sentences, word):
    for score,sentence in zip(scores, sentences):
        my_regex = r"\b" + re.escape(word) + r"\b"
        sentence = re.sub(my_regex, underline_word(word), sentence)
        print(str(score)+"--"+sentence)








