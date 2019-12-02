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

console.log("document",document)

//console.log("webview", document.querySelector('webview'))
/*window.onload = function translate() {
    var script = document.createElement("script");
    script.src = "https://code.jquery.com/jquery-2.1.4.min.js";
    script.onload = script.onreadystatechange = function() {*/
        //$(document).ready(function() {
        function reload(){
            console.log("Recargar ventas")
            navigator.serviceWorker.getRegistrations().then(
                function(registrations) {
                  for (let registration of registrations) {
                    registration.unregister();
                  }
                  console.log('...OK...');
              
              }).finally(function() {
                // finalizada (exitosa o rechazada)
                // borrar para volver a obtener
                // variables locales del navegador
                localStorage.removeItem('PRODUCTS_version');
                localStorage.removeItem('PRODUCTS_object_stores');
                localStorage.removeItem('PRODUCTS_indexed');
                localStorage.removeItem('PRODUCTS_IDCLIENTE');
                localStorage.removeItem('PRODUCTS_IDCLIENTE_cajas_id');
                localStorage.removeItem('PRODUCTS_update_day');
                localStorage.removeItem('PRODUCTS_is_update_all');
                localStorage.removeItem('PRODUCTS_cache_code');
            
                // base datos local
                indexedDB.deleteDatabase('PRODUCTS');
            
                if (-1 != url_string.indexOf('?sync_data_products=true')) {
                  url_string = url_string.replace('?sync_data_products=true', '', 'gi');
                } else if (-1 != url_string.indexOf('&sync_data_products=true')) {
                  url_string = url_string.replace('&sync_data_products=true', '', 'gi');
                }
            
                /// DEBUG ///
                //console.log('__url_string__', url_string);
                /// DEBUG ///
            
                // recargar sin parametros después de haber borrado
                window.location.href = url_string;
                throw "stop the execution.";
              });
            }
        //});
   /* };
    document.body.appendChild(script);*/

//};
