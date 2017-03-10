import scala.io.Source;
import java.io.File;

var fname = "/home/franky/destress/moodids.csv";
var outpath = "/home/franky/metadata_dicts/";

val maxCount = 256;
var moods = CSMat(1,maxCount);

for(i <- 0 until moods.length) {
  moods(i) = "";
}


val lines = Source.fromFile(fname).getLines;
val header = lines.next().split(",");

var moodidIdx = header.indexOf("mood id");
var moodNameIdx = header.indexOf("mood");
var parentNameIdx = header.indexOf("parent mood");


for(line <- lines) {
  val arr = line.split(',');
  val moodid = Integer.parseInt(arr(moodidIdx));
  val moodname = arr(moodNameIdx);

  moods(moodid) = moodname;
}



saveSBMat(outpath + "moods_dict.sbmat.lz4", SBMat(moods))
