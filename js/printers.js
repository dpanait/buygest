const { ipcRenderer } = require('electron')
const Store = require("electron-store")
const store = new Store();
// conseguimos los nombres de impresoras guardadads en el localstorage
var v_tickets = store.get("tickets");
var v_pegatinas = store.get("pegatinas")

ipcRenderer.on('printers', (event, arg) => {
    console.log(arg) // prints "pong"
    var select = `<div class='form-group'>
                    <label for="select_ticket">Ticket</label>
                    <select class='form-control mt-2' id='select_ticket'>
                        <option value='0'>Ninguno</option>`;
    arg.forEach(element => {
        if(v_tickets == element.name){
            select += `<option value="${element.name}" selected>${element.name}</option>`;
        } else {
            select += `<option value="${element.name}">${element.name}</option>`;
        }
    });
    select +="</select></div>";
    document.getElementById("conte_sel_tickets").innerHTML = select;
    // configurar html select pegatinas
    var select_pegatinas = `<div class='form-group'>
                                <label for="select_pegatina">Pegatina</label>
                                <select class='form-control mt-2' id='select_pegatina'>
                                    <option value='0'>Ninguno</option>`;
    arg.forEach(element => {
        if(v_pegatinas == element.name){
            select_pegatinas += `<option value="${element.name}" selected>${element.name}</option>`;
        } else {
            select_pegatinas += `<option value="${element.name}">${element.name}</option>`;
        }
    });
    select_pegatinas +="</select></div>";
    document.getElementById("conte_sel_pegatinas").innerHTML = select_pegatinas;

})
// click sobre el botton guardar tickets
var btn_guardar = document.getElementById("save_ticket");
btn_guardar.addEventListener("click",(e)=>{
    var printer_sel = document.getElementById("select_ticket").value;
    //console.log("printer_sel",printer_sel)
    ipcRenderer.send('tickets_saved',printer_sel);
})
// click sobre el botton guardar pegatinas
var btn_guardar = document.getElementById("save_pegatina");
btn_guardar.addEventListener("click",(e)=>{
    var printer_sel = document.getElementById("select_pegatina").value;
    //console.log("printer_sel",printer_sel)
    ipcRenderer.send('pegatinas_saved',printer_sel);
})
