const { ipcRenderer } = require('electron')
ipcRenderer.on('update-app-win', (event, arg) => {
    console.log(event, arg)
    document.getElementById("msg").innerHTML = "<span style='color:red;'>"+arg.res+"</span>"; 
    //var win = arg.win;
    //console.log("win",newWindowUpdate)
   /*var down =  win.webContent.downloadURL("https://yuubbb.com/pro/buy01.00/yuubbbshop/servidor_impresion/Servidor_impresion.deb");
     console.log(down)*/
     ipcRenderer.send("download-app",true)
})
