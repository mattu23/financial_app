//第3章：UIの動作


//ラジオボタンによりカテゴリを有効無効切り替え
//HTML内で、「収入」時のブール型がtrueになっているので、下記関数内処理が実装されカテゴリがブランクになる。
//=の左側の「.disabled」はセレクトボックスの有効無効を切り替えるための設定項目
//trueを設定したときにセレクトボックスが無効に、falseを設定したときには有効
//右のdisabledがtrueだと、左のdisabledが有効になり、上記仕様が実装される。だから引数を代入する必要がある。
function disableSelectBox(disabled){
  document.getElementById("category").disabled = disabled;
}

//収支入力フォームの内容チェック
function inputCheck() {
  //チェック結果 true:入力チェックOK false:未記入あり
  let result = true;

  //選択した収支のラジオボタンの取得
  let radio = document.getElementsByName("balance");
  let balance;
  //受け取ったラジオボタンの配列データを、チェックボックスにチェックが入っているか、順番に確認する処理
  //このｆorの条件文内の「radio.length」は配列の数を指している
  for(let i= 0; i<radio.length; i++) {
   //受け取ったラジオボタンの配列データが、何番目の配列がチェックボックスにチェック入っているかが判明する
   //ｎ番目の配列データがtrueの時は処理が終わるようbreakを記載
    if(radio[i].checked == true) {
      balance = radio[i].value;
      break;
    }
  }

   //日付、カテゴリ、金額、メモの取得
   //getElementByIdの引数に取り出したいimputのidを設定することで値を取り出せる
   //このあとの処理で使用するため、取り出した値を各変数に格納している
   let date = document.getElementById("date").value;
   let category = document.getElementById("category").value;
   let amount = document.getElementById("cost").value;
   let memo = document.getElementById("memo").value;

   //入力チェック。未記入があればresultをfalseにする
   if(date == ""){
      result = false;
      alert("日付が未記入です");
      //&&で支出も含めないと、収入のラジオボタン時の初期値と混ざってしまって正常に判断できない
   } else if (category == "-選択してください-" && balance == "支出") {
      result = false;
      alert("カテゴリを選択してください");
   } else if(amount == "" || amount == 0){
      result = false;
      alert("金額が未記入です")
   } else if(memo == ""){
      result = false;
      alert("メモが未記入です");
   }
   //上記4つがどれか1つでも当てはまればfalseを返す。
   //最後にreturnを返すことで、falseの場合、データの登録処理を中断する関数が実装される
   return result;
}

