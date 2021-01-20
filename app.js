const express = require('express');
const app = express();
const mysql = require('mysql');

app.set('port', (process.env.PORT || 5000));
app.use(express.urlencoded({extended: false}));
//データベース
const connection = mysql.createConnection({
  host: 'us-cdbr-east-03.cleardb.com',
  user: 'bfd87068f6ebf3',
  password: 'd96e429e',
  database: 'heroku_a1803fb03d5bc70'
});
connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});
app.use(express.static('public'));
// 日付データ取得
var today = new Date();
var day = today.getFullYear()+"年"+(today.getMonth()+1)
　　　　　 +"月"+(today.getDate())+"日";
//トップページ
app.get('/', (req, res) => {
  
    res.render('top.ejs',{day:day});
  
});
//投稿された一覧表示
app.get('/contents', (req, res) => {
  connection.query(
    'SELECT * FROM memo',
    (error, results) => {
      res.render('contents.ejs',{day:day,items: results});
    });
    
  });
//投稿画面
app.get('/chat', (req, res) => {
    res.render('chat.ejs',{day:day});
});
//データベースの作成
app.post("/chat",(req,res)=>{
//字数制限によって場合分け
  if(0<req.body.itemName.length && req.body.itemName.length<41){
    connection.query(
      'INSERT INTO memo (id,day,content,good) VALUES (0,?,?,0)',
      [day,req.body.itemName],
      (error, results) => {
        res.redirect('/contents');
      }
    );
  }else{
    res.redirect("/chat");
  }
});

//goodのカウント
app.get("/count/:id",(req,res)=>{
  connection.query(
    'UPDATE memo SET good=good+1 WHERE id=?',
    [req.params.id],
    (erro,result)=>{
      res.redirect('/contents');
    }
  );
});
	
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});