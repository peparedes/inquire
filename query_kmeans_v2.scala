//loaded as a vectorDim*numSentence matrix
var sentVecs = loadFMat("./foodtype/vecs_full_top.fmat.lz4").t;//vectorDim*numSentence
sentVecs = sentVecs(?,1->sentVecs.ncols)//get rid of the header column for results from full_savevec_v2
//sentVecs ~ sentVecs / (sqrt(sentVecs dot sentVecs)+1e-7f)
val numCluster = 30;
val (nn,opts) = KMeans.learner(sentVecs,numCluster);
//println(opts.what)
opts.npasses = 10;
opts.batchSize = 500;
nn.train
var modelmat = FMat(nn.modelmat).t;//vectorDim*numCluster
var results = FMat(zeros(numCluster,sentVecs.ncols));
for(i <- 0 until numCluster){//the loop is between 0 and numCluster-1 
	for(j <- 0 until sentVecs.ncols){
		//println(float((sentVecs(?,j)-modelmat(?,i)).t*(sentVecs(?,j)-modelmat(?,i))));
		//results(i,j)~0.5;
		results(i,j)=(((sentVecs(?,j)-modelmat(?,i)).t)*(sentVecs(?,j)-modelmat(?,i)))(0,0);
		//println(results(i,j))
	}
}
println(results)
val (vals,inds) = mini2(results,1)
println(inds)
saveAs("./foodtype/labelsInCluster.mat",inds,"clusterID")
saveAs("./foodtype/clusterVec.mat",modelmat,"clusterVec")
saveAs("./foodtype/sentVec.mat",sentVecs,"sentVec")