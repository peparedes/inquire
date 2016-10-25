# queries
codes for performing queries from word2vec embeddings
#to perform queries on a certain percentage of data and retrieve the top n sentences(topSentences) in cosine similarity with the query sentence:
  1. cd old_home/ana/destress/word2vec  
  2. run /code/BIDMach/bidmach  run_privacy.ssc  
  3. perform query by calling query("query sentence",topSentences,"filter",minWord,maxWord), default for minWord and maxWord are 5 and 40  
  4. the system will ask for the percentage of data to perform query upon, insert a number between 0 to 1.0 or press enter to perform on 100% of data
  5. information of the query will be printed on the console in the order of: query sentence, filter, topSentences, minWords, maxWords, number of file and system time. Those information will be delimited by tab and saved in ./foodtype/queryhistory_compare.txt in the same order(appending to previous history). To change file directory, chage fw0.
  6. After search is performed, the topmost results will be printed to the console, in the order of cosine similarity score, the sentence retrieved and the URL for the homepage of the blogger who wrote the sentence
  7. The results will be saved in ./foodtype/queryresult_compare.txt(will overwrite previous history), saved information include similarity score, the sentence retrieved, sentence in its surrounding context(1 sentence before and after if there's any) and the URL for the homepage of the blogger who wrote the sentence, first row would be header
  
#to perform kmeans clustering:
  1. cd old_home/ana/destress/word2vec
  2. run /code/BIDMach/bidmach  run_kmeans.ssc
  3. perform query by calling query("query sentence",topSentences,"filter",minWord,maxWord), default for minWord and maxWord are 5 and 40
  WARNING: topSentences go over 1000 will lead to java heap out of memory problem, will fix it later
  4. the system will ask for the percentage of data to perform query upon, insert a number between 0 to 1.0 or press enter to perform on 100% of data
  5. information of the query will be printed on the console in the order of: query sentence, filter, topSentences, minWords, maxWords, number of file and system time. Those information will be delimited by tab and saved in ./foodtype/queryhistory_kmeans.txt in the same order(appending to previous history). To change file directory, chage fw0.
  6. After search is performed, the topmost results will be printed to the console, in the order of cosine similarity score, the sentence retrieved and the URL for the homepage of the blogger who wrote the sentence
  7. The results will be saved in ./foodtype/queryresult_kmeans.txt(will overwrite previous history), saved information include similarity score, the sentence retrieved and the URL for the homepage of the blogger who wrote the sentence, first row would be header
  8. vector of sentences(currently normalized by length) will be saved in ./foodtype/vecs_full_top.fmat.lz4
  9. quit scala by :q(has to run on 2 versions of bidmach for now because /code/BIDMach/bidmach support distributed file reading while ../../BIDMach/bidmach support hdf5 file saving)
  10. run ../../BIDMach/bidmach query_kmeans_v2.scala for kmeans clustering, group number for sentences retrieved in step 1-9 would be saved as ./foodtype/labelsInCluster.mat, centroids are saved in ./foodtype/clusterVec.mat and sentences' vectors are saved in ./foodtype/sentVec.mat
