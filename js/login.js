var qs = require('qs');
var login_btn = document.getElementById("login_btn");
login_btn.addEventListener("click",(e)=>{
    var codI = document.getElementById("codeI").value;
    var codII = document.getElementById("codeII").value;
    var codIII = document.getElementById("codeIII").value;
    if(codI != "" && codII != "" && codII != ""){
        const url = 'https://yuubbb.com/pre/dani/yuubbbshop/buygest';
        const data = { 
            action: 'login',
            codI: codI,
            codII: codII,
            codIII: codIII
        };

        fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
            body: qs.stringify(data)
        })
        .then(function(response) {
            //console.log('response =', response);
            return response.json();
        })
        .then(function(data) {
            console.log('data = ', data);
            var select = `<select id="select_almacen" class="form-control"><option value="1">Ninguno</option>`;
            var cajas = data.cajas;
            cajas.forEach(element =>{
                select += `<option value="${element.cajas_id}">${element.cajas_name}</option>`;
            })
            select += "</select>";
            document.getElementById("cont_select_almacen").innerHTML = select;
            document.getElementById("guardar_btn_cajas").style.display = "block";
        })
        .catch(function(err) {
            console.error(err);
        });
     }

    
})