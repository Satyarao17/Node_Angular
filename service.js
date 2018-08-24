var  http  =  require('http');
var  express  =  require('express');
var  parser  =  require('body-parser');
var  fs  =  require('fs');
var cors = require('cors');
var  exp  =  express();
var mongoClient=require("mongodb").MongoClient;

exp.get("/rest/api/load", cors(), (req,  res) => {
    console.log('Load Invoked');
    res.send({ msg: 'GIVE SOME REST TO WORLD' });
});
exp.route('/rest/api/get', cors()).get((req,  res) => {
    console.log('Get Invoked');
    //res.send({ msg: 'WORLD' });
    mongoClient.connect('mongodb://localhost:27017/test', function(err, client) {
  if (err) throw err;
  var dbo = client.db('test');
  var query = { };
  dbo.collection('test').find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    res.send(result);
    client.close();
  });
});

});
exp.use(parser.json());
exp.route('/rest/api/post',  cors()).post((req,  res)  =>  {
    console.log(req.body);
    fs.appendFileSync('demo.json',  JSON.stringify(req.body));
    res.status(201).send(req.body);
    mongoClient.connect('mongodb://localhost:27017/test',function(err,client){
    var col = client.db('test');
    col.collection('test').insert(req.body,true,function(err,req){
        console.log("1 document inserted");
        client.close();
    });
});
 });
exp.route('/rest/api/get/:name').get((req, res) => {
    console.log()
    res.send("Hello World" + req.params['name']);
});


exp.put('/rest/api/put/:name/:age',(req,res)=>{
    console.log("PUT done");
mongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
  if (err) throw err;
  var dbo = db.db('test');
  var myquery = {name: req.params.name, age:req.params.age };
  var newvalues = { $set: {name: req.query.name, age:req.query.age } };
  dbo.collection('test').updateOne(myquery, newvalues, function(err, res1) {
    if (err) throw err;
    console.log("1 document updated");
       res.send(res1);
    db.close();
  });
});
});
exp.delete('/rest/api/delete/:name/:age',(req,res)=>{
        console.log(req.params.name)
    console.log(req.params.age)
    mongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
  if (err) throw err;
  var dbo = db.db('test');
  var myquery = { name: req.params.name, age:req.params.age };
  console.log(myquery)
    dbo.collection('test').deleteOne(myquery, function(err, res2) {
    if (err) throw err;
    console.log("1 document deleted");
    //console.log("Delete done");
       res.send(res2);
    db.close();
  });
});
});

exp.use(cors()).listen(3000, () => console.log("Running..."));