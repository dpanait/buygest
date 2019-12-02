const $ = require("jquery")
const { shell, ipcRenderer } = require("electron");
const Store = require("electron-store")
const store = new Store();
const tickets = store.get("tickets");// impresora de tickets
const pegatinas = store.get("pegatinas");// ipresoar de pegatinas

const io = require('socket.io-client');
var socket = io('https://yuubbb.com:2020',{
    rejectUnauthorized: false,
    transports: [ 'websocket' ]
});
socket.connect();
socket.emit('buygest_electron_app', "chat_message");
socket.on("buygest_msg_electron",(res)=>{
    console.log("connected1", res)
    ipcRenderer.send('update-app', res);

})
const enav = new (require('electron-navigation'))({ 
    showAddTabButton: true,
    showBackButton: false,
    showForwardButton: false,
    showReloadButton: false,
    showUrlBar: false 
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
var cajas_id = store.get("CAJAS");
var sessionId_last = 0;
var version = store.get("VERSION");
var subdom_cli = store.get("SUBDOM_CLI");
/**
     * EVENTS
     */
    //
    // switch active view and tab on click
    //
    


// desabilitar el click para usar el mio
$('#nav-body-tabs').off('click');

$('#nav-body-tabs').on('click', '#nav-tabs-add', function (e) {
    console.log("e",e)
    //e.preventDefault()
    let params = [`https://yuubbb.com/pro/buy${version}/${subdom_cli}/envios`, {
        close: true,
        icon: 'clean'
    }];
    enav.newTab(...params);
}).on('click', '.nav-tabs-close', function() {
    var sessionID = $(this).parent('.nav-tabs-tab').data('session');
    var session = $('.nav-tabs-tab, .nav-views-view').filter('[data-session="' + sessionID + '"]');

    if (session.hasClass('active')) {
        if (session.next('.nav-tabs-tab').length) {
            session.next().addClass('active');
            (enav.changeTabCallback || (() => {}))(session.next()[1]);
        } else {
            session.prev().addClass('active');
            (enav.changeTabCallback || (() => {}))(session.prev()[1]);
        }
    }
    session.remove();
    enav._updateUrl();
    enav._updateCtrls();
    return false;
});
$('#nav-body-tabs').on('click', '.nav-tabs-tab', function () {
    $('.nav-tabs-tab, .nav-views-view').removeClass('active');

    var sessionID = $(this).data('session');
    $('.nav-tabs-tab, .nav-views-view')
        .filter('[data-session="' + sessionID + '"]')
        .addClass('active');

    var session = $('.nav-views-view[data-session="' + sessionID + '"]')[0];
    (enav.changeTabCallback || (() => {}))(session);
    
    enav._updateUrl(session.getURL());
    enav._updateCtrls();        
    
    //
    // close tab and view
    //
}).on('click', '.nav-tabs-close', function() {
    var sessionID = $(this).parent('.nav-tabs-tab').data('session');
    var session = $('.nav-tabs-tab, .nav-views-view').filter('[data-session="' + sessionID + '"]');

    if (session.hasClass('active')) {
        if (session.next('.nav-tabs-tab').length) {
            session.next().addClass('active');
            (enav.changeTabCallback || (() => {}))(session.next()[1]);
        } else {
            session.prev().addClass('active');
            (enav.changeTabCallback || (() => {}))(session.prev()[1]);
        }
    }
    session.remove();
    enav._updateUrl();
    enav._updateCtrls();
    return false;
});
//console.log(cajas_id, version, subdom_cli)


// pestaña envios
var envios = enav.newTab(`https://yuubbb.com/pro/buy${version}/${subdom_cli}/envios`, { 
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
var url_alm = `yuubbb.com/pro/buy${version}/${subdom_cli}/gestion_almacen_${cajas_id}`;
console.log(url_alm)
var almacen = enav.newTab(url_alm, { 
    icon: '../images/favicon.ico',
    title: 'Almacen',
    id: "almacen",
    close: false,
    postTabOpenCallback:(webview) => {
        onOpenNewWindowAddId(webview);
    }
})
// pestaña ventas
var ventas = enav.newTab(`yuubbb.com/pro/buy${version}/${subdom_cli}/tpv_ventas_${cajas_id}`, { 
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
    },
    webviewAttributes: {
        preload:"../lib_prop/preload_ventas.js" 
    }



});
//desarollo
/*var url_alm_des = `yuubbb.com/pre/dani/${subdom_cli}/gestion_almacen_${cajas_id}`;
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
})*/
// imprimir tickets desde envios por si navega
envios.addEventListener("new-window",(res)=>{
    inc_impresion(res);
})
almacen.addEventListener("new-window",(res)=>{
    inc_impresion(res);
});
// imprimir tickets desde desarollo
/*desa.addEventListener("new-window",(res)=>{
    inc_impresion(res);
});*/
// imprimir tikets desde ventas
ventas.addEventListener("new-window",(res)=>{
    inc_impresion(res);
});
ipcRenderer.on("update-webview",(e,a)=>{
    console.log("update-webview",a)
    ventas.send("msg_electron","hola");


    if(a == "ventas"){
        ventas.loadURL(`https://yuubbb.com/pro/buy${version}/${subdom_cli}/tpv_ventas_${cajas_id}?sync_data_products=true`);
       /* ventas.executeJavaScript(`console.log("Recargar ventas")
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
          });`);*/
    }
})
ventas.addEventListener('ipc-message', (event,a) => {
    // prints "ping"
    console.log(event.channel)
    console.log(a)
    //ventas.send("msg_electron","pong");
  })
  ipcRenderer.on('msg_web', (e,a) => {
      console.log(e,a)
    ipcRenderer.sendToHost('pong')
  }) 
console.log(ventas)   
