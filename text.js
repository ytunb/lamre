function wTrigger(val,id,text,level,cspeed,callback){var inc=10;
if(level==1)inc=15;
else if(level==2)inc=10;
else if(level==3)inc=5;
if(val<=100){var content=text+val+"%";
document.getElementById(id).innerHTML=content;
setTimeout(function(){wTrigger(val+(Math.floor((Math.random()*inc)+1)),id,text,level,cspeed,callback)},cspeed)}
else{document.getElementById(id).innerHTML=text+"100%";
callback=(callback?callback:function(){return});
setTimeout(function(){callback()},700)}}
function wWarEffect(id,dspeed,pos,text,level,cspeed,callback){if(pos<=text.length){if(pos!=text.length)var content=text.substring(0,pos)+"_";
else var content=text.substring(0,pos)+"0%";
document.getElementById(id).innerHTML=content;
setTimeout(function(){wWarEffect(id,dspeed,pos+1,text,level,cspeed,callback)},dspeed)}else wTrigger(0,id,text,level,cspeed,callback)}
function wWarEffectWrite(id,dspeed,pos,text,callback){if(pos<=text.length){if(pos!=text.length)var content=text.substring(0,pos)+"_";
else var content=text.substring(0,pos);
document.getElementById(id).innerHTML=content;
setTimeout(function(){wWarEffectWrite(id,dspeed,pos+1,text,callback)},dspeed)}else{callback=(callback?callback:function(){return});
setTimeout(function(){callback()},100)}}