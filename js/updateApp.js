const { ipcRenderer } = require('electron')
var https = require('https');
var fs   = require('fs');
var {app,path}  = require('electron').remote
const {remote} = require('electron')

ipcRenderer.on('update-app-win', (event, arg) => {
    console.log(event, arg)
    document.getElementById("msg").innerHTML = "<span style='color:red;'>"+arg.res+"</span>"; 
    //var win = arg.win;
    //console.log("win",newWindowUpdate)
   /*var down =  win.webContent.downloadURL("https://yuubbb.com/pro/buy01.00/yuubbbshop/servidor_impresion/Servidor_impresion.deb");
     console.log(down)*/
     //ipcRenderer.send("download-app",true)
})
var btn_download = document.getElementById("download");
var onProgress = function(progress){
    console.log("onProgress",progress)
}
btn_download.addEventListener("click",(e,a)=>{
    /*var file = fs.createWriteStream(remote.app.getAppPath() + "/dist/update/file.deb");
    //console.log("path",app.getDataPath());
    console.log('Your App Path: ' + remote.app.getAppPath())
    var request = https.get("https://yuubbb.com/pro/buy01.00/yuubbbshop/servidor_impresion/Servidor_impresion.deb", function(response) {
        response.pipe(file);
    });*/
/*require("electron").remote.require("electron-download-manager").download({
        url: "https://yuubbb.com/pro/buy01.00/yuubbbshop/servidor_impresion/Servidor_impresion.deb",
        onProgress:  function(progress){
            console.log("onProgress",progress)
        }
    }, function (error, info) {
        if (error) {
            console.log(error);
            return;
        }
    
        console.log("DONE: " + info.url);
    });*/
   /*ipcRenderer.send("download", {
        url: "https://yuubbb.com/pro/buy09.02/yuubbbshop/servidor_impresion/Servidor_impresion.deb",
        properties: {directory: remote.app.getPath("downloads") + "/my-app1"}
    });*/
    /*ipcRenderer.send("download-button", {
        url: "https://yuubbb.com/pro/buy09.02/yuubbbshop/servidor_impresion/Servidor_impresion.deb",
        properties: {directory: remote.app.getPath("downloads") + "/my-app1"}
    });*/
    ipcRenderer.send("descargar",true)
})
ipcRenderer.on("download complete", (event, file) => {
   
    console.log(file); // Full file path
});
ipcRenderer.on("download progress", (event, progress) => {
    console.log(event)
    console.log(progress); // Progress in fraction, between 0 and 1
    const progressInPercentages = progress * 100; // With decimal point and a bunch of numbers
    const cleanProgressInPercentages = Math.floor(progress * 100); // Without decimal point
    console.log(progressInPercentages, cleanProgressInPercentages)
});

