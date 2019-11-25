const { ipcRenderer } = require('electron');
console.log("global.sysVersion",process.platform)
var link_download = document.getElementById("link_download");
if(process.platform === "darwin"){
    link_download.href = "http://yuubbb.com/pre/dani/servidor_impresion/Servidor_impresion.dmg";
    extencion = "dmg";
} else if(process.platform === "win32"){
    link_download.href = "http://yuubbb.com/pro/buy09.02/yuubbbshop/servidor_impresion/Servidor_impresion.exe";
    extencion = "exe";
} else if(process.platform === "linux"){
    link_download.href = "http://yuubbb.com/pro/buy09.02/yuubbbshop/servidor_impresion/Servidor_impresion.deb";
    extencion = "deb";
}
var mas_tarde = document.getElementById("mas_tarde");
mas_tarde.addEventListener("click",(e)=>{
    ipcRenderer.send("close-update_window",true);
})
//cuando rescibimos el aviso de actualizacion
ipcRenderer.on('update-app-win', (event, arg) => {
    console.log(event, arg)
    document.getElementById("msg").innerHTML = "<span style='color:red;'>"+arg.res+"</span>"; 
})
//recibimos el estado de la descarga
ipcRenderer.on("proces_download",(e,a)=>{
    move(a.a,a.t)
})
// completacion de la descarga
ipcRenderer.on("proces_download_complete",(e,a)=>{
    alert("Descarga completada")
})
// function que completa la progress bar
var move = function(a,t) {
  
    var elem = document.getElementById("myBar");
    var width = (a * 100) / t;
    //console.log("width",width)
    elem.style.width = width + "%";
}


