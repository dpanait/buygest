const $ = require("jquery")
const { shell } = require("electron");
const Store = require("electron-store")
const store = new Store();
const tickets = store.get("tickets");// impresora de tickets
const pegatinas = store.get("pegatinas");// ipresoar de pegatinas
const enav = new (require('electron-navigation'))({ 
    showAddTabButton: true,
    showBackButton: false,
    showForwardButton: false,
    showReloadButton: false,
    showUrlBar: true 
})
/**
 * extender electron-navigation
 */
enav.setActive = function (id) {
    var tabs = $('.nav-tabs-tab').toArray();
    var tabs_webview = $('.nav-views-view').toArray();
    var activeTabIndex = tabs.indexOf($('.nav-tabs-tab.active')[0]);
    //console.log("activeTabIndex", activeTabIndex, id)

    $('.nav-tabs-tab').eq(activeTabIndex).removeClass("active")
    $('.nav-views-view').eq(activeTabIndex).removeClass("active")

    var setActiveTabIndex = tabs_webview.indexOf($('.nav-views-view#'+id)[0]);
    //console.log("setActiveTabIndex",setActiveTabIndex,$('.nav-views-view#'+id))
    $('.nav-tabs-tab').eq(setActiveTabIndex).addClass("active")
    $('.nav-views-view').eq(setActiveTabIndex).addClass("active");

}
enav.addIdLastWebview = function(id){
    var tabs = $('.nav-tabs-tab').toArray();
    var tabs_webview = $('.nav-views-view').toArray();
    var setActiveTabIndex = tabs_webview.indexOf($('.nav-views-view.active')[0]);
    $('.nav-views-view').eq(setActiveTabIndex).attr("id",id);
}


const cajas_id = 3;
const sessionId_last = 0;
// pestaña envios
var envios = enav.newTab(`https://yuubbb.com/pro/buy09.02/ibadanica/envios`, { 
    icon: 'clean',
    title: 'Envios',
    id: "envios",
    close: false,
    newTabCallback:null,
    postTabOpenCallback:webview => {
        onOpenNewWindowAddId(webview);
        webview.addEventListener('dom-ready', () => {
            enav.setActive("envios")
            //webview.openDevTools()
        })
    }

});
// pestaña almacen
var url_alm = `yuubbb.com/pro/buy09.02/ibadanica/gestion_almacen_${cajas_id}`;
//console.log(url_alm)
enav.newTab(url_alm, { 
    icon: '../images/favicon.ico',
    title: 'Almacen',
    id: "almacen",
    close: false,
    postTabOpenCallback:(webview) => {
        onOpenNewWindowAddId(webview);
    }
})
// pestaña ventas
var ventas = enav.newTab(`yuubbb.com/pro/buy09.02/ibadanica/tpv_ventas_${cajas_id}`, { 
    icon: '../images/favicon.ico',
    title: 'Ventas',
    id: "tpv_ventas",
    close: false,
    newTabCallback:null,
    postTabOpenCallback:(webview) => {
        onOpenNewWindowAddId(webview);
        webview.addEventListener('dom-ready', () => {
            //enav.setActive("tpv_ventas")
            
        })
    }

});
//desarollo
var url_alm_des = `yuubbb.com/pre/dani/ibadanica/gestion_almacen_${cajas_id}`;
//console.log(url_alm)
var desa = enav.newTab(url_alm_des, { 
    icon: '../images/favicon.ico',
    title: 'Almacen_des',
    id: "des_almacen",
    close: false,
    webviewAttributes:{
        plugins: true
    },
    postTabOpenCallback:(webview) => {
        onOpenNewWindowAddId(webview);
    }
})
// imprimir tickets desde envios por si navega
envios.addEventListener("new-window",(res)=>{
    inc_impresion(res);
})
// imprimir tickets desde desarollo
desa.addEventListener("new-window",(res)=>{
    inc_impresion(res);
});
// imprimir tikets desde ventas
ventas.addEventListener("new-window",(res)=>{
    inc_impresion(res);
});


/**
 * webview event tvp_ventas
 */
//var ventas = document.getElementById("tpv_ventas");
//ventas.setAttribute('plugins', '');
//console.log("tpv_ventas",ventas)
/*ventas.addEventListener("new-window", (res) => {
    console.log("VENTAS NEW WINDOW",res);
    if(/ticket/.test(res.url)){
        var ticket = document.getElementById("ticket");
        ticket.addEventListener("dom-ready",(a,b)=>{
            console.log("ticket",a,b)
            var options = {
                silent: true,
                deviceName: "Boomaga",
                printBackground: true
              }
              var p = ticket.print(options);
              if(p){
                  p.then(()=>{
                    setTimeout(function(){
                        enav.closeTab("ticket");
                    },2000);
                   
                  })
              }
        })
    }

})*/

