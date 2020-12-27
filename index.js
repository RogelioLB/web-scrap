const cheerio=require('cheerio');
const request=require('request-promise-native');
const express=require('express');
const app=express();

app.use(express.static(__dirname+"/public"));

app.use("/data",require('./routes/data'))


app.set("port",process.env.PORT || 3000);

app.listen(app.get("port"),()=>{
    console.log("Listen in localhost:"+app.get("port"));
})
