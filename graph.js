//第5章：グラフを表示

//円グラフの表示
function createPieChart(rows){
  //円グラフ用のデータを格納する連想配列
  let pieChartData = {};

  //データベースから入手金一覧のデータをカテゴリ毎に取り出して集計。収入は除外する。
  let category = "";
  rows.forEach(function(data) {
    category = data.category;
    if( category != "収入"){
      //連想配列のキーにカテゴリが存在していれば金額を加算する
      if(pieChartData[category] === undefined){
        pieChartData[category] = Number(data.amount);
      } else {
        pieChartData[category] += Number(data.amount);
      }
    }
  });

  //円グラフ用にカテゴリと合計金額を配列に入れる
  let keyArray = [];
  let valueArray = [];
  //このforの記述は連想配列の中身を取り出す繰り返し処理
  for(key in pieChartData){
    //この部分のpushは配列に値を追加をする関数で、()内に記述した値が追加される
    keyArray.push(key);
    valueArray.push(pieChartData[key]);
  }

  //Chart.jsの機能を使用して円グラフを表示
  let pieChart = document.getElementById("pieChart");
  new Chart(pieChart, {
    type: "pie",
    data: {
      labels: keyArray,
      datasets: [
        {
          backgroundColor: [
            "#EB5757",
            "#6FCF97",
            "#56CCF2",
            "#F2994A",
            "#F2C94C",
            "#2F80ED",
            "#9B51E0",
            "#BB6BD9",
          ],
          data: valueArray,
        },
      ],
    },
    Options: {
      title: {
        display: true,
        text: "カテゴリ毎の支出割合",
      },
    },
  });
}

