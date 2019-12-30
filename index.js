//import
const express=require('express');
const app=express();
const expressHandlebars=require('express-handlebars');
const bodyparser=require('body-parser');
var path=require('path');
var mongoose=require("mongoose");
// var mongo=require('mongodb');
app.use(bodyparser.urlencoded({ extended:true}));
var assert=require('assert');
//sigin
function onSignIn(googleUser) {
    var loginnm=document.getElementById("loginName");
    var outbut=document.getElementById("signoutbut");
    var pimage=document.getElementById("pimg");
    // Useful data for your client-side scripts:
    profile = googleUser.getBasicProfile();
    console.log('Full Name: ' + profile.getName());
    loginnm.textContent=profile.getName();
    console.log("Image URL: " + profile.getImageUrl());
    pimage.src=profile.getImageUrl();
    console.log("Email: " + profile.getEmail());
    outbut.textContent="sign-out";
    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
  }
  function signout() {
    var auth2 = gapi.auth2.getAuthInstance();
    var outbut=document.getElementById("signoutbut");
    var loginnm=document.getElementById("loginName");
    var pimage=document.getElementById("pimg");
    auth2.signOut().then(function () {
      pimage.src="https://img.pngio.com/user-icons-free-download-png-and-svg-user-png-200_200.png";
      outbut.textContent="";
      console.log('User signed out.');
    });
  }
var url="mongodb://localhost/travel";
mongoose.connect(url,{ useNewUrlParser: true,useUnifiedTopology: true });
var dataSchema=new mongoose.Schema({
    name:String,
    phone:Number,
    email:String,
    age:Number,
    state:String,
    gender:String,
    choice:String,
    size:Number,
    lang:String,
    alc:String,
    veg:String,
    lov:String,
    cat:String,
    tal:String,
    flag:String,
    match:String
});

var Date=mongoose.model("Date",dataSchema);

var cons = require('consolidate');
app.use(express.static(path.join(__dirname,"views")));
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));

app.get("/",(req,res)=>{
    res.render("index.html");
});

app.get("/src/choice/congrats",(req,res)=>{
    res.render("src/choice/congrats.html");
});
app.get("/src/choice/choose",(req,res)=>{
    res.render("src/choice/choose.html");
});
app.get("/src/destinations/:dest",(req,res)=>{
    var di="src/destinations/"+req.params.dest+".html";
    res.render(di);
});
app.post("/checkout/:id",(req,res)=>{
    var id=req.params.id;
    var newDatad=new Date({
        name:req.body.inputname,
        phone:req.body.inputphone,
        email:req.body.inputemail,
        age:req.body.inputage,
        state:req.body.inputState,
        gender:req.body.inputgender,
        lang:req.body.language,
        alc:req.body.isalc,
        veg:req.body.isveg,
        lov:req.body.islov,
        cat:req.body.iscat,
        tal:req.body.istal,
        flag:"not-found",
        match:"",
        choice:id
    });
    var result=[];
    var total=0;
    var max=75;
    var i=0;
    var max_id="";
    var idlast="";
    mongoose.connect(url, { useUnifiedTopology: true,useNewUrlParser: true } ,function(err,db){
        assert.equal(null,err);
        Date.find({},function(err,dates){
            if(err){
                console.log(err);
            }else{
                dates.forEach(function(doc,err){
                    result.push(doc);
                    idlast=result[i]._id;
                    if(result[i].flag==="not-found" && id===result[i].choice){
                        if(result[i].age-req.body.inputage){
                            total=total+20/(result[i].age-req.body.inputage);
                        }else if(result[i].age-req.body.inputage===0){
                            total=total+20
                        }else{
                            total=total-20/(result[i].age-req.body.inputage);
                        }
                        if(result[i].state===req.body.inputState){
                            total=total+40;
                        }if(result[i].gender!=req.body.inputgender){
                            total=total+30;
                        }if(result[i].lang===req.body.language){
                            total=total+20;
                        }if(result[i].email===req.body.inputemail){
                            total=total-100;
                        }
                        if(total>max){
                            max_id=result[i]._id;
                        }
                    }
                    i=i+1;
                    total=0;
                });
                if(max_id===""){
                    console.log('no match'+total+max);
                    // res.render('src/choice/congrats.html');
                }else{
                    console.log(idlast+" matched with "+max_id);
                    // Date.update({'_id':max_id},{$set:{'match':idlast,'flag':"found"}});
                    // Date.update({'_id':idlast},{$set:{'match':max_id,'flag':"found"}});
                }
            }
        });
    });
    newDatad.save(function(err,data){
        if(err){
            console.log("error");
        }else{
            console.log("saved");
        }
    });
    res.render("src/choice/congrats.html");
});
app.post("/solopost",(req,res)=>{
    var newDatas=new Date({
        name:req.body.inputname,
        phone:req.body.inputphone,
        email:req.body.inputemail,
        state:req.body.inputState,
        lang:req.body.language,
    });

    newDatas.save(function(err,data){
        if(err){
            console.log("error");
        }else{
            console.log("saved");
        }
    });
    res.render("src/choice/congrats.html");
});

app.get("/date",(req,res)=>{
    res.render("src/choice/date.html");
});
app.get("/solo",(req,res)=>{
    res.render("src/choice/solo.html");
});
app.get("/group",(req,res)=>{
    res.render("src/choice/group.html");
});
app.get("/friends",(req,res)=>{
    res.render("src/choice/friends.html");
});
var PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log("server started on port "+PORT);
});
