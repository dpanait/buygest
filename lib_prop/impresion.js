/**
 * esta function sirve para imprimir tickets y pegatinas individuales
 * @param {*} w_print  es el id del webview que queremos imprimir
 * @param {*} printer  es el nombre de la impresora que usamos para imprimir
 * @param {*} NAV      es el objeto Navigation que usamos para tabs
 */
var impresion = function(w_print,printer,NAV){
    var NAV = NAV;
    var webview_print = document.getElementById(w_print);
    webview_print.addEventListener("dom-ready",(a,b)=>{
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