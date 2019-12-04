const { ipcRenderer,remote } = require('electron')    
console.log("ipcRenderer",ipcRenderer)
console.log(remote.ipcMain)
remote.ipcMain.on("msg_electron",(e,a)=>{
    console.log("a",a)
    ipcRenderer.sendToHost('ping');
    remote.app.send('msg_web',"hola")
})
window.addEventListener('DOMContentLoaded', () => {
    window.addEventListener("msg_electron",(e)=>{
        console.log("e",e)
        ipcRenderer.send('ping',"hola2");
    })
})
ipcRenderer.on('asynchronous-reply', function (event, arg) {
    const message = `Asynchronous message reply: ${arg}`
    document.getElementById('async-reply').innerHTML = message
    console.log(arg);
  })
var someArgument = "hola";
//ipcRenderer.sendSync('msg_electron', someArgument);
  
  ipcRenderer.sendToHost('msg_web')
  //ipcRenderer.send('msg_web', document.body.innerHTML)




