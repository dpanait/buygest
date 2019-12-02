const { ipcRenderer } = require('electron');
const Store = require("electron-store")
const store = new Store();
console.log("global.sysVersion",process.platform)
var VERSION = store.get("VERSION");
var link_download = document.getElementById("link_download");
if(process.platform === "darwin"){
    link_download.href = `https://yuubbb.com/pro/buy${VERSION}/buygest_app/buygest.dmg`;
    extencion = "dmg";
} else if(process.platform === "win32"){
    link_download.href = `https://yuubbb.com/pro/buy${VERSION}/buygest_app/buygest.exe`;
    extencion = "exe";
} else if(process.platform === "linux"){
    link_download.href = `https://yuubbb.com/pro/buy${VERSION}/buygest_app/buygest_1.0.0_amd64.deb`;
    extencion = "deb";
}
var mas_tarde = document.getElementById("mas_tarde");
mas_tarde.addEventListener("click",(e)=>{
    ipcRenderer.send("close-update_window",true);
})
//cuando rescibimos el aviso de actualizacion
ipcRenderer.on('update-app-win', (event, arg) => {
    console.log("From windows "+ arg.win, arg)

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


