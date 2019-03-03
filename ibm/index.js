var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var multer  = require('multer');
var fs  = require('fs');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var text = "Rep: This is Himanshu. How can I help you? Caller: This is Alex. I want to change my plan to corporate plan Rep: Sure, I can help you. Do you want to change the plan for the number from which you are calling now? Caller: yes Rep: For verification purpose may I know your date of birth and email id Caller: My data of birth is 10-Aug-1979 and my email id is alex@gmail.com Rep: Which plan do you want to migrate to Caller: Plan 450 unlimited Rep: Can I have your company name and date of joining Caller: I work for IBM and doj 01-Feb-99 Rep: Ok.. I have taken your request to migrate plan to 450 unlimited. You will get an update in 3 hours. Is there anything else that I can help you with Caller: No Rep: Thanks for calling Vodaphone. Have a good day. Caller: you too',"
var output = {};
var answer="";

function analyze(){

  var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
  var naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    'version': '2018-11-16',
    'iam_apikey': '2Inwv2Q4telyv6PIwl-8O2Lc0y4bn56HamlPZyzOX6Xq',
    'url': "https://gateway-fra.watsonplatform.net/natural-language-understanding/api",
  });

  var parameters = {
    'text': text,
    'features': {
      "entities": {
          "model": "aecf206d-caba-4c17-99ec-fc47bd115e38"
      },
      "relations": {
        "model": "aecf206d-caba-4c17-99ec-fc47bd115e38"
      },
      'keywords': {
        'emotion': true,
        'sentiment': true,
        'limit': 2
      }
    }
  }

  naturalLanguageUnderstanding.analyze(parameters, function(err, response) {
    if (err){
      console.log('error:', err);
    }
    else{

      var g;
      var h=[];
      var t=false;
      output =response;
      console.log(output);
      g = text.split(/[\s,]+/);
      console.log(g);
      g.forEach((y)=>{
        t=false;
        output.entities.forEach((x)=>{
          var fg=x.length;
           if(y.localeCompare(x.text)==0){
            console.log("hey");
            h.push("***********");
            t=true;
          }else if((y).localeCompare(x.text+".")==0){
             console.log("hey");
              h.push("*******");
              t=true;
          }else{
            console.log(y+" "+x.text);
          }
        });
        if(t==false){
            h.push(y);
        }
      });
      answer=h.join(" ");
    }
  });

}

app.get('/', function (req, res) {
  res.render("index");
});

app.get("/loading",function(req,res){
  res.render("loading");
})

app.get('/redact', function (req, res) {
  res.render("redact",{out:answer});
});

app.post('/analyze', function (req, res) {
  text = req.body.tex;
  analyze();
  res.redirect("/loading");
});

app.post('/upload', function (req, res, next) {

    text = req.body.texa;
    console.log(text);
    analyze();
    res.redirect("/loading");

});



app.listen(3000,function(){
console.log("Server On");
});
