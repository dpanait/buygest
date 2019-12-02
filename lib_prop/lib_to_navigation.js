/**
 * esta function sirve para imprimir tickets y pegatinas individuales
 * @param {*} w_print  es el id del webview que queremos imprimir
 * @param {*} printer  es el nombre de la impresora que usamos para imprimir
 * @param {*} NAV      es el objeto Navigation que usamos para tabs
 */

/*const Store = require("electron-store")
const store = new Store();
const tickets = store.get("tickets");// impresora de tickets
const pegatinas = store.get("pegatinas");// ipresoar de pegatinas
*/
var impresion = function(w_print,printer,NAV){
    var NAV = NAV;
    var webview_print = document.getElementById(w_print);
    //webview_print.openDevTools();
    webview_print.addEventListener("dom-ready",(a,b)=>{
        //webview_print.openDevTools();
        // opciones impresion
        var options = {
            silent: true,
            deviceName: printer,//tenemos la impresora  elegida por el usuario
            printBackground: true
        }

        var p = webview_print.print(options);
        if(p){
            p.then(()=>{
            setTimeout(function(){
                NAV.closeTab(w_print);
            },2000);
            
            })
        }
    })
}
// anadir id a las ventanas de ticket, pegatinas_individuales, los pdf de seur 
var onOpenNewWindowAddId = function(webview){
    webview.addEventListener('new-window', (res) => {
        //enav.setActive("tpv_ventas")
        if(/ticket/.test(res.url)){
            enav.addIdLastWebview("ticket");
        }
        if(/pegatina_individual_simple/.test(res.url)){
            enav.addIdLastWebview("pegatina_simple");
        }
        if(/\.pdf/.test(res.url)){
            enav.addIdLastWebview("ven_pdf");
        }
    })
}
// dependiendo de la url imprimimos las nuevas pestañas
var inc_impresion = function(res){
    if(/yubprint/.test(res.url)){
        alert("Tienes activada la impresion por el servidor de impresion")
        //shell.openExternal(res.url)
    }
    if(/ticket/.test(res.url)){
        impresion("ticket",tickets,enav);
        var webview_print = document.getElementById("ticket");
        /*webview_print.addEventListener("dom-ready",()=>{
            webview_print.openDevTools();
        })*/
        
    }
    if(/pegatina_individual_simple/.test(res.url)){
        impresion("pegatina_simple",pegatinas,enav);
    }
    if(/\.pdf/.test(res.url)){
        var pdf_url = res.url;//"https://yuubbb.com/images/24/pdf_SEUR/2019/03190149355389.pdf";
        //console.log("PDF",res.url)
        //qitar elementos del dom tabs y body view
        var pdf_win = document.getElementById("ven_pdf");
        var content_body = document.getElementById("nav-body-views");
        var tab_quit = document.getElementsByClassName("nav-tabs-tab active")[0]
        var contents_tabs = document.getElementById("nav-body-tabs");
        content_body.removeChild(pdf_win);
        contents_tabs.removeChild(tab_quit);
        //set visible la tab que estas
        
        enav.setActive(pdf_win.id)
        shell.openExternal(pdf_url);

    }
}
