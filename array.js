var imagenes=new Array(['./img/1.jpg',''],['./img/2.jpg',''],['./img/3.jpg',''],['./img/4.jpg',''],['./img/5.jpg',''],['./img/6.jpg',''],['./img/7.jpg',''],['./img/8.jpg',''],['./img/9.jpg',''],['./img/10.jpg',''],['./img/11.jpg',''],['./img/12.jpg',''],['./img/13.jpg',''],['./img/14.jpg',''],['./img/15.jpg',''],['./img/16.jpg',''],['./img/17.jpg',''],['./img/18.jpg',''],['./img/19.jpg',''],['./img/20.jpg',''],['./img/21.jpg',''],['./img/22.jpg',''],['./img/23.jpg',''],['./img/24.jpg',''],['./img/25.jpg',''],['./img/26.jpg','']);function rotarImagenes()
{var index=Math.floor((Math.random()*imagenes.length));document.getElementById("imagen").src=imagenes[index][0]}
{rotarImagenes();setInterval(rotarImagenes,5000)}
var indice=0;frases=new Array();frases[0]="841";frases[1]="840";frases[2]="842";frases[3]="846";frases[4]="839";frases[5]="843";frases[6]="845";frases[7]="844";frases[8]="838";frases[9]="839";frases[10]="838";frases[11]="846";indice=Math.random()*(frases.length);indice=Math.floor(indice);function rotar(){if(indice==frases.length){indice=0}
document.getElementById("rotando").innerHTML=frases[indice];indice++;setTimeout("rotar();",5000)}




 
