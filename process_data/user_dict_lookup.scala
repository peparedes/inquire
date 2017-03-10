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

val maxCount = 20000000;
var users = CSMat(1,maxCount);
var keys = CSMat(1,maxCount);

// for(i <- 0 until users.length) {
//   users(i) = "";
// }

var i = 0;

for(fname <- files) {
  println(fname)
  // var subjects = CSMat(1,maxCount);
  // var ids = IMat(1,maxCount);


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

    // failure cases of tokenization
    if(user.charAt(0) == '-'
      || user.charAt(user.length()-1) == '-'
      || user.matches(".*-[0-9].*")
      || user.matches(".*[0-9]-.*")
      || user.matches(".*0+.*")
    ) {
      users(i) = user;
      keys(i) = user.replaceAll("[-0]+", "") + "|" + ditemid + "|" + timestamp;
      i += 1;
    }


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
val sparse_users = SBMat(users(0 until i));
val sparse_keys = SBMat(keys(0 until i));
println("saving users...");
saveSBMat(outpath + "users_dict_values.sbmat.lz4", sparse_users)
saveSBMat(outpath + "users_dict_keys.sbmat.lz4", sparse_keys)
