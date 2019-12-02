const { ipcRenderer } = require("electron");
ipcRenderer.on("show-version", (e,a)=>{
    //console.log("e",e,"a",a)
    document.getElementById("version_msg").innerHTML =  '<span style="color: red;">'+a+'</span>';
    
});