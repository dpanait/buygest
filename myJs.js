function coco_abre(NAV){
    var opti = {
        silent: true,
        deviceName: "Boomaga",
        printBackground: true
    };
    var p = NAV.printTab("tickets",opti);
    p.then((a)=>{
        console.log("Promise",a,new Date().getSeconds(),new Date().getMilliseconds());
        //Navigation.closeTab("tickets");
        setTimeout(function(){
            coco("tickets")
        },5000);
    })
    .catch((err)=>{
        console.log("ERrorr",err)
        
    })
    
}
function coco(id){
    console.log("__COCO___A",id);
    console.log("Navigation");

    var session;
    if (id == null) {
        session = $('.nav-tabs-tab.active, .nav-views-view.active');
    } else {
        if ($('#' + id).length) {
            var sessionID = $('#' + id).data('session');
            session = $('.nav-tabs-tab, .nav-views-view').filter('[data-session="' + sessionID + '"]');
            console.log("SESSION",session)
        } else {
            console.log('ERROR[electron-navigation][func "closeTab();"]: Cannot find the ID "' + id + '"');
            return false;
        }
    }
    if (session.next('.nav-tabs-tab').length) {
        session.next().addClass('active');
        //(this.changeTabCallback || (() => {}))(session.next()[1]);
    } else {
        session.prev().addClass('active');
        //(this.changeTabCallback || (() => {}))(session.prev()[1]);
    }


    session.remove();
    //this._updateUrl();
    //this._updateCtrls();
}
/**
 * set active tabs
 */
Navigation.prototype.setActive = function (id) {
    var tabs = $('.nav-tabs-tab').toArray();
    var tabs_webview = $('.nav-views-view').toArray();
    var activeTabIndex = tabs.indexOf($('.nav-tabs-tab.active')[0]);
    console.log("activeTabIndex", activeTabIndex, id)

    $('.nav-tabs-tab').eq(activeTabIndex).removeClass("active")
    $('.nav-views-view').eq(activeTabIndex).removeClass("active")

    var setActiveTabIndex = tabs_webview.indexOf($('.nav-views-view#'+id)[0]);
    console.log("setActiveTabIndex",setActiveTabIndex,$('.nav-views-view#'+id))
    $('.nav-tabs-tab').eq(setActiveTabIndex).addClass("active")
    $('.nav-views-view').eq(setActiveTabIndex).addClass("active");
    
    

}