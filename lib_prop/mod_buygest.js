const fetch = require("node-fetch")

module.exports = {
    get_version_buygest: function(){
        let url = "https://yuubbb.com/dev/version.txt";
        return fetch(url)
                .then(r => {
                    return r.text()
                })
                .then(re=>{
                    return re;
                })
                .catch(err => {
                    return err;
                })  
    }
}