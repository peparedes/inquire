import scala.io.Source;
import java.io.File;

var inpath = "/home/franky/metadata/";
var outpath = "/home/franky/metadata_dicts/";

var files = new File(inpath).listFiles.filter(_.getName.endsWith(".csv")).sorted;

var count = 0;

// for(fname <- files) {
//   val lines = Source.fromFile(fname).mkString.split("\n");
//   count += lines.length-1;
// }

val maxCount = 2000000;
var users = CSMat(1,1e9.toInt);

for(i <- 0 until users.length) {
  users(i) = "";
}

for(fname <- files) {
  println(fname)
  // var subjects = CSMat(1,maxCount);
  // var ids = IMat(1,maxCount);
  var i = 0;

  val lines = Source.fromFile(fname).getLines;
  val header = lines.next().split("\t");

  var ditemidIdx = header.indexOf("ditemid");
  var timestampIdx = header.indexOf("event_timestamp");
  var userIdx = header.indexOf("user");
  var subjectIdx = header.indexOf("subject");

  // for(line <- lines.slice(1, lines.length)) {
  var j = 1;

  for(line <- lines) {
    val arr = line.split('\t');
    val user = arr(userIdx);
    val timestamp = Integer.parseInt(arr(timestampIdx));
    val ditemid = Integer.parseInt(arr(ditemidIdx));
    val subject = arr(subjectIdx);

    val idx = ditemid % 100000  + 100000*(timestamp % 10000)
    // users(i) = user;
    // subjects(i) = subject;

    users(idx) = user;

    i += 1;

    j += 1;

    if(j % 10000 == 0) {
      println(j);
    }
  }

  // var prefix = fname.getName().replace(".csv", "");
  // saveIMat(outpath + prefix + "_id.imat.lz4", ids(0 to i-1));
  // saveSBMat(outpath + prefix + "_username.sbmat.lz4", SBMat(users(0 to i-1)));
  // saveSBMat(outpath + prefix + "_subject.sbmat.lz4", SBMat(subjects(0 to i-1)));
}

println("converting users...");
val sparse_users = SBMat(users);
println("saving users...");
saveSBMat(outpath + "users.sbmat.lz4", sparse_users)
