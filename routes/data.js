const cheerio=require('cheerio');
const request=require('request-promise-native');
const express=require('express');
const router=express.Router();


async function data(){
    let leyendas=[];
    let kpm=[];
    let usage=[];
    let url=[];
    let obj={};
    let urlCh=[]
    await request("https://apex.tracker.gg/apex/insights",(err,res,body)=>{
        let $=cheerio.load(body);
        $('span.insight-bar__label').each((i,el)=>{
            if($(el).text()=="Gibraltar"){
                leyendas.push("Makoa Gibraltar");
                return;
            }
            leyendas.push($(el).text());
        })
        $('span.insight-bar__value').each((i,e)=>{
            usage.push(leyendas[i]+ ' '+ $(e).text());
        })
        let a=0;
        $('tr td').each((i,e)=>{
            if(Number($(e).text())){
                kpm.push(leyendas[i-a]+' '+$(e).text());
            }else{
                a++;
            }
        })
        $('div.insight-bar img').each((i,e)=>{
            if(e.attribs.src.includes("gibraltar")){
                url.push(e.attribs.src.replace("gibraltar","makoa-gibraltar"));
                return;
            }
            url.push(e.attribs.src);
        })
    });
    a=0;
    await request("https://www.ea.com/games/apex-legends/about/characters",(err,res,body)=>{
        let $=cheerio.load(body);
        $('a').each((i,e)=>{
            if(!e.attribs.href){
                console.log("undefined");
                a++;
                return;
            }
            if(e.attribs.href.includes("/games/apex-legends/about/characters/")){
                let charArr=[leyendas[i-a]];
                let urlArr=[e.attribs.href];
                urlCh.push(charArr.sort(),urlArr.sort());
            }else{
                a++;
            }
        })
    })
    return obj={
        leyendas:leyendas.sort(),
        usage:usage.sort(),
        kpm:kpm.sort(),
        url:url.sort(),
        urlCh:urlCh.sort()
    }
}

router.get("/",async(req,res)=>{
    res.send(await data());
})

module.exports=router;
