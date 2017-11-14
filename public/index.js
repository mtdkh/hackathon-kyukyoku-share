
function onSongleWidgetAPIReady(SW) {
  var el = document.getElementById('player');
  console.log('element:', el, token);

  // 音楽プレーヤーを初期化する
  var player = new SW.Player({
      accessToken: token
    , mediaElement: el
  });
  player.addPlugin(new SW.Plugin.SongleSync());

  // 再生時刻を定期的に更新する
  var span = document.querySelector('span.time');
  setInterval(function () {
    var time = player.position;
    while (span.childNodes.length > 0) span.removeChild(span.childNodes[0]);
    var textNode = document.createTextNode(parseInt(time));
    span.appendChild(textNode);
    //console.log('client time:', time);
  }, 100);
}
