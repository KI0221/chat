// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onChildAdded,
  remove
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

/**
 * Config = 機密情報です！！！
 * この部分はGitHubに上げないこと！！！！！！！
 */
//
// config＝機密情報　私であることの機密情報　取扱注意

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const dbRef = ref(database, "chat");

// 送信ボタンを押した時の処理  #sendはHTMLのidを参照する
$('#send').on('click',function(){

// 入力欄に入力されたデータを取得する val()
  const userName = $('#userName').val();
  const text = $('#text').val();
  // 現在の日時を文字列として取得する
  const timestamp = new Date().toLocaleString();

// ちゃんと動くかをチェックするためにconsoleを利用する
  console.log(userName, text, timestamp);

// 送信データをオブジェクトにまとめる
  const message ={
    userName: userName,
    text: text,
    timestamp: timestamp
  };

// Firebase Realtime Databaseに送信する 
  const newPostRef = push(dbRef);
  set(newPostRef, message);
  
});

// 指定した場所にデータが追加されたことを検知
onChildAdded(dbRef,function(data){
  // 追加されたデータをFirebaseから受け取り、分解
  const message = data.val();
  const key = data.key;
  console.log(data, message, key);

  // 文字情報と変数をミックスで入れ込むために``を使う
  let chatMsg = ` 
      <div class="chat-item" data-key='${key}'>
          <div>${message.userName}</div>
          <div>${message.text}</div>
          <div class='timestamp'>${message.timestamp}</div>
          <div class='delete-btn'>削除</div>
      </div>
  `;

  // 指定した場所にデータを挿入する
  $('#output').append(chatMsg);
});

// 削除ボタンが押された時、Firebase Realtime Databaseから該当するメッセージを削除し、画面上からもそのメッセージを削除する
$(document).on('click', '.delete-btn', function() {
  const key = $(this).closest('.chat-item').data('key');
  const itemRef = ref(database, `chat/${key}`);
  remove(itemRef)
  .then(() => {
    console.log(`Message with key ${key} deleted from Firebase`);
    $(this).closest('.chat-item').remove();
  })
  .catch((error) => {
    console.error(`Error deleting message with key ${key}: `, error);
  });
});


// オブジェクトの練習
// const kosuge={
//   name:'こすげ',
//   age:'41',
//   from:'神奈川',
// };
// console.log(kosuge.name);
// console.log(kosuge['from']);
