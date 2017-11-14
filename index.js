
var express = require('express');
var SW = require('songle-widget');

// 打ち上げ花火のバリエーションデータ（ほんとはmysql叩いて取りたかった）
var jsonData = {
    0:{ "start_time": 0.32, "end_time": 4 },
    1:{ "start_time":4, "end_time":13.98 },
    2:{ "start_time":13.98, "end_time":44 },
    3:{ "start_time":44, "end_time":59.02 },
    4:{ "start_time":59.02, "end_time":64 },
    5:{ "start_time":64, "end_time":84 },
    6:{ "start_time":84, "end_time":114 },
    7:{ "start_time":114, "end_time":130.25 },
    8:{ "start_time":130.25, "end_time":141.5 },
    9:{ "start_time":141.5, "end_time":160.26 },
    10:{ "start_time":160.26, "end_time":172.75 },
    11:{ "start_time":172.75, "end_time":181.52 },
    12:{ "start_time":181.52, "end_time":191.52 },
    13:{ "start_time":191.52, "end_time":211.5 },
    14:{ "start_time":211.5, "end_time":262.76 },
    15:{ "start_time":262.76, "end_time":271.52 },
    16:{ "start_time":271.52, "end_time":280.21 },
    17:{ "start_time":280.21, "end_time":292.65 }
};

// プレイヤーを初期化して楽曲をセット
var tokens = {
  "accessToken": "00000024-zw9D8zF",
  "secretToken": "4dZkVuktNW1riEvMa99VN1J4rVHkhYzh"
};
var player = new SW.Player(tokens);
player.useMedia(
  new SW.Media.Headless("https://www.youtube.com/watch?v=-tKVN2mAKRI")
);
player.addPlugin(new SW.Plugin.SongleSync());

// 巻き戻し処理
function rewind() {
  console.log('seek to 0');
  player.seekTo(0);
  setTimeout(function () {
    console.log('play');
    player.play();
  }, 1000);
}
rewind();

// 再生終了したら巻き戻す
player.on('finish', rewind);

// コンソールに時刻表示
setInterval(function () {
  console.log('server time:', player.position);
}, 1000);

// HTTPサーバ
var app = express();
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));

app.get('/play', function (req, res) {
  player.play();
  res.json({ "message": "start playing" });
});

app.get('/pause', function (req, res) {
  player.pause();
  res.json({ "message": "pause playing" });
});

app.get('/rewind', function (req, res) {
  player.seekTo(1000);
  res.json({ "message": "seek to the beginning" });
});

app.get('/', function (req, res) {
  res.render('index', tokens);
});

app.get('/json', function (req, res) {
  res.json({ "accessToken": tokens.accessToken });
});

// 追加要素：シーク（ex) /seek?position=10000）
app.get('/seek', function (req, res) {
  if (!req.query || !req.query.position) {
    return res.json({ "error": "no position parameter provided" });
  }
  var position = parseInt(req.query.position);
  if (isNaN(position) || position < 0 || position > player.duration) {
    return res.json({ "error": "specified position out of range" });
  }
  player.seekTo(position);
  res.json({ "message": "seek to " + position + "ms" });
});

// 追加要素：送る（ex) /send?userID=1&partsID=1）
app.get('/send', function (req, res) {
  if (!req.query || !req.query.userID) {
    return res.json({ "error": "no userID parameter provided" });
  } else if (!req.query || !req.query.partsID) {
    return res.json({ "error": "no partsID parameter provided" });
  }
  var userID = parseInt(req.query.userID)
  var partsID = parseInt(req.query.partsID);
  player.seekTo( jsonData[partsID].start_time*1000 );

  //res.json({ "message": "partsID is " + partsID });
  //res.render( 'index', {"message": "start_time is " + jsonData[partsID].start_time + " & end_time is " + jsonData[partsID].end_time });
  res.redirect("http://satoken.nkmr.io/Songle-Hackathon/index.php?userID="+userID);
});

app.listen(process.env.PORT || 8080);
