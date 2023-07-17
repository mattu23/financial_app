//indexedDBの名前などの設定
//変数storeNameはオブジェクトストアの名前を格納した変数
const dbName = "kakeiboDB";
const storeName = "kakeiboStore";
const dbVersion = 1;

//データベース接続する。データベースが未作成なら新規作成する。
const database = indexedDB.open(dbName, dbVersion);

//変数databaseの中に格納したデータベースを操作してデータベースとオブジェクトストアを作成
//keyPath:"id"の部分はキーと呼ばれるもので、idというデータをキーとして利用する設定をしている
//database.onupgradeneededはDBの新規作成時またはバージョン変更時に1回だけ実行される関数
//eventには、作成したDBに関する情報が代入されている。（無名関数の引数、DBそのものが入っているとほぼ同義）DBの接続した結果に応じて、成功or失敗をログに出力している
database.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore(storeName, { keyPath: "id" });
    console.log("データベースを新規作成しました");
}

//DBに接続に成功した時に発生するイベント
database.onsuccess = function (event) {
    //接続成功したDBをプログラムで操作できるように変数dbに格納
    const db = event.target.result;
    // 接続を解除する（お作法）
    db.close();
    console.log("データベースに接続できました");
}

//何かしらのデータ不備やエラーでDBに接続できなかったときの処理
database.onerror = function (event) {
    console.log("データベースに接続できませんでした");
}



//フォームの内容をDBに登録する
function regist() {
    //フォームの入力チェック。falseが返却されたら登録処理を中断
    if (inputCheck() == false) {
    //returnは実行するとその時点で関数を強制終了してこの後の処理は実行しない
        return;
    }
    //ラジオボタンの取得
    //配列の中に入っているラジオボタンのうち、どのラジオボタンがチェックされているのかを探す処理
    const radio = document.getElementsByName("balance");
    let balance;
    for (let i = 0; i < radio.length; i++) {
        if (radio[i].checked == true) {
            balance = radio[i].value;
            break;
        }
    }

    //フォームに入力された値を取得
    
    const date = document.getElementById("date").value;
    const amount = document.getElementById("cost").value;
    const memo = document.getElementById("memo").value;
    let category = document.getElementById("category").value;

    //ラジオボタンが収入を選択時はカテゴリを「収入」とする
    //一個前のラジオボタン取得時に変数バランスにどちらかの値が格納されているので、下記チェックが可能となる
    if (balance == "収入") {
        category = "収入";
    }


    //データベースにデータを登録する
    insertData(balance, date, category, amount, memo);


    //入手金一覧を作成
    createList();
}


//データの挿入
function insertData(balance, date, category, amount, memo) {
      //変数uniqueIDはこれから登録するデータに他のデータと区別できるようにID番号を割り当てる
      //new Date()は現在の日時を取得する関数
      //getTime()は、new Date()で取得した現在時刻までの経過時間をミリ秒単位で取得
      //.toString()は値を文字列に変換する関数(DBにidを登録するとき文字列である必要があるため)
      const uniqueID = new Date().getTime().toString();
    //   console.log(uniqueID);
      //DBに登録するための連想配列のデータを作成
      //「:」の 左側が連想配列のキー、右側がバリュー（値）
      const data = {
          id: uniqueID,
          balance: balance,
          date: String(date),
          category: category,
          amount: amount,
          memo: memo,
      }

   //データベースを開く
    const database = indexedDB.open(dbName, dbVersion);
 
   //データベースの開けなかった時の処理
   database.onerror = function (event) {
       console.log("データベースに接続できませんでした");
   }

   //データベースを開いたらデータの登録を実行
   database.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(storeName, "readwrite");
      transaction.oncomplete = function (event) {
          console.log("トランザクション完了");
      }
      transaction.onerror = function (event) {
          console.log("トランザクションエラー");
      }

      //オブジェクトストアを変数storeに代入してプログラムで操作できるようにしている
      const store = transaction.objectStore(storeName);
      //オブジェクトストアに連想配列dataをadd(追加)している
      const addData = store.add(data);
      addData.onsuccess = function () {
          console.log("データが登録できました");
          alert("登録しました");
      }
      addData.onerror = function () {
          console.log("データが登録できませんでした");
      }
      db.close();
   }
}
 

//createList関数を実行する時＝（家計簿アプリ（index.html）をブラウザで開いたとき、入出金のデータを入力したとき、データを削除したとき）
function createList(){
    //データベースからデータを全件取得
    const database = indexedDB.open(dbName);
    database.onsuccess = function(event){
        const db = event.target.result;
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
        //getAll()関数はデータベースに登録されているデータをすべて取り出す命令
        store.getAll().onsuccess = function(data){
            // console.log(data);
            //data.target.resultで取り出したデータを配列rowsに代入し、これをもとに一覧を作成していく
            const rows = data.target.result;

            //index.htmlのsectionタグを取得
            const section = document.getElementById("list");

            //入手金一覧のテーブルを作る
            //バッククオートでヒアドキュメント（複数行にわたる文字列を代入するときに使用）
            //改行した文字列を代入する場合は、バッククオートで文字列を囲むことでエラーなく代入できる
            let table = `
                <table>
                    <tr>
                        <th>日付</th>
                        <th>収支</th>  
                        <th>カテゴリ</th>  
                        <th>金額</th>  
                        <th>メモ</th>  
                        <th>削除
                        </th>    
                    </tr>
            `;

            //入手金のデータを表示
            //配列rowsに格納されているデータは、forEachの繰り返し処理を利用することでを１件ずつ取り出すことができる
            //forEachの{}の中の処理は、配列の件数の分だけ繰り返して実行される
            rows.forEach(element => {
                // console.log(element);
                //下記はデータを1個ずつ取り出して表のセル（tdタグ）に埋め込む
                //データが埋め込まれた表（tableタグ）がブラウザに表示される処理
                table += `
                    <tr>
                        <td>${element.date}</td>
                        <td>${element.balance}</td>
                        <td>${element.category}</td>
                        <td>${element.amount}</td>
                        <td>${element.memo}</td>
                        <td><button onclick = "deleteData('${element.id}')">X</button></td>
                    </tr>
                `;
            });
            table += `</table>`;
            //de
            //出来上がったtableタグをsectionタグの中(innerHTML)に書き込むことで表を表示
            section.innerHTML = table;

            //円グラフの作成
            createPieChart(rows);
        }
    }
}


//データの削除
//引数にはDBから取得したデータに含まれるidを渡す。このidをもとにしてどのデータを削除するのかを判断
function deleteData(id){
    //データベースを開く
    const database = indexedDB.open(dbName, dbVersion);
    database.onupgradeneeded = function(event){
        const db = event.target.result;
    }
    //開いたら削除実行
    database.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(storeName, "readwrite");
        transaction.oncomplete = function (event) {
            console.log("トランザクション完了");
        }
        transaction.onerror = function (event) {
            console.log("トランザクションエラー");
        }
        const store = transaction.objectStore(storeName);

        const deleteData = store.delete(id);
        deleteData.onsuccess = function(event){
            console.log("削除完了");
            createList();
        }
        deleteData.onerror = function(event){
            console.log("削除失敗");
        }
        db.close();
    }
    //データベースの開けなかった時の処理
    database.onerror = function (event) {
        console.log("データベースに接続できませんでした");
    }

}