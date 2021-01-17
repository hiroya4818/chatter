const express = require('express');
const app = express();
const mysql = require('mysql');

app.use(express.urlencoded({extended: false}));
//データベース
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Osakadai4818',
  database: 'chatter'
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
      'INSERT INTO memo (day,content,good) VALUES (?,?,0)',
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
	
const PORT = process.env.PORT || 5000;
app.listen(PORT);