var qs = require('qs');
var { ipcRenderer } = require("electron");
const Store = require("electron-store")
const store = new Store();
var VERSION = 0.00;
var SUBDOM_CLI = "";
var login_btn = document.getElementById("login_btn");
login_btn.addEventListener("click",(e)=>{
    var codI = document.getElementById("codeI").value;
    var codII = document.getElementById("codeII").value;
    var codIII = document.getElementById("codeIII").value;
    if(codI != "" && codII != "" && codII != ""){
        const url = 'https://yuubbb.com/pre/dani/yuubbbshop/buygest';
        const data = { 
            action: 'login',
            codI: codI.toUpperCase(),
            codII: codII.toUpperCase(),
            codIII: codIII.toUpperCase()
        };

        fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
            body: qs.stringify(data)
        })
        .then(function(response) {
            console.log('response =', response);
            return response.json();
        })
        .then(function(data) {
            console.log('data = ', data);
            var select = `<select id="select_almacen" class="form-control"><option value="1">Ninguno</option>`;
            var cajas = data.cajas;
            cajas.forEach(element =>{
                select += `<option value="${element.cajas_id}">${element.cajas_name}</option>`;
                store.set("CAJAS",element.cajas_id);
            })
            select += "</select>";
            document.getElementById("cont_select_almacen").innerHTML = select;
            //document.getElementById("guardar_btn_cajas").style.display = "block";
            store.set("VERSION",data.version);
            store.set("SUBDOM_CLI",data.subdom_cli);
            store.set("login",true);
            VERSION = data.version;
            SUBDOM_CLI = data.subdom_cli;
            if(data.status){
                ipcRenderer.send("version-app",true);
            }
        })
        .catch(function(err) {
            console.error(err);
        });
     }

    
})
var guardar_btn = document.getElementById("guardar_btn");
guardar_btn.addEventListener("click",(e)=>{
    var cajas = document.getElementById("select_almacen").value;
    store.set("CAJAS",cajas);
    ipcRenderer.send("version-app",{a:cajas,b:VERSION,c:SUBDOM_CLI});
})