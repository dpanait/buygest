const {
    app,
    BrowserWindow 
} = require('electron');
const { Menu, MenuItem } = require('electron')
const { ipcRenderer, ipcMain } = require('electron')
const path = require('path')
const Store = require("electron-store")
const store = new Store();
const updater = require('./js/updater.js');
var request = require('request');
var fs = require('fs');
const vers = require("./lib_prop/mod_buygest.js")
//configuramos la variable version para usarla en donde hace falta
var result = vers.get_version_buygest();
result.then(response=>{
  //console.log("response",response)
  //set version de buygest
  store.set("version",response);
})

let win;
global.sysVersion = process.platform;
app.on('ready', () => {
    win = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true,
            plugins: true
        },
        icon: 'images/buygest.png'
    });
    //store.set("login",true)
    if(store.get("login")){
      win.loadURL(`file:///${__dirname}/views/index.html`);
    } else {
      win.loadURL(`file:///${__dirname}/views/login.html`);
    }
    //win.loadURL(`https://yuubbb.com/pro/buy09.02/ibadanica/envios`);
    win.on('closed', () => {
        win = null;
    });
    if(app.getVersion() != store.get("APP_VERSION")){
      store.set("updateWindow", false);
      store.set("APP_VERSION",app.getVersion());
    } else {
      //store.set("APP_VERSION",app.getVersion());
    }
//#region ipcMain 
    // escuchamos para guardar en store las pegatinas y los tickets
    ipcMain.on("tickets_saved",(e,arg)=>{
        console.log("Tickets: ",arg)
        store.set("tickets",arg);
    })
    ipcMain.on("pegatinas_saved",(e,arg)=>{
        console.log("Pegatinas: ",arg)
        store.set("pegatinas",arg)
    })
    ipcMain.on("update-app",(e,res)=>{
      console.log("update-app",res)
      store.set("updateWindow", true);
      openUpdateWindow(res)
    })
    if(store.get("updateWindow")){
      openUpdateWindow("Si quieres que la aplicación tenga todas las funcionalidades disponibles actualiza. Descarga la actualización y la instalas desde la carpeta \'Descargas\' busca BuyGest!!!");
    }
    ipcMain.on("version-app",(e,arg)=>{
      if(arg){
        win.loadURL(`file:///${__dirname}/views/index.html`);
       
      }
    });
//#endregion
  
    //store.set("APP_VERSION",app.getVersion());
    ipcMain.on("msg_web",(e,a)=>{
      console.log("msg_web",a)
      win.send("msg_electron","desde electron");
    })
 
});
app.on('open-url', (event, data)=> {
  //event.preventDefault();
  //link = data;
  console.log("data app",data)
});
///////////////////////
// menu   /////////////
///////////////////////
//#region Menu
const template = [
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'pasteandmatchstyle'
      },
      {
        role: 'delete'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload()
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools()
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'resetzoom'
      },
      {
        role: 'zoomin'
      },
      {
        role: 'zoomout'
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      }
    ]
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      }
    ]
  },
  {
    label: 'Options',
    submenu: [
      {
        label: 'Printers',
        click() {
          openAboutWindow()
        }
      },
      {
        label:"Update",
        click(){
          openUpdateWindow("Update");
        }
      }/*,
      {
        label: "Recargar Ventas",
        click(){
          win.send("update-webview","ventasssss");
          win.send("msg_electron","desde electron");
          win.webContents.send("msg_electron", "desde electron");
        }
      }*/
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('http://electron.atom.io') }
      },
      {
        label: "Version - " + app.getVersion()
      }
      
    ]
  }
]

if (process.platform === 'darwin') {
  const name = app.getName()
  template.unshift({
    label: name,
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })
  // Edit menu.
  template[1].submenu.push(
    {
      type: 'separator'
    },
    {
      label: 'Speech',
      submenu: [
        {
          role: 'startspeaking'
        },
        {
          role: 'stopspeaking'
        }
      ]
    }
  )
  // Window menu.
  template[3].submenu = [
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    },
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      label: 'Zoom',
      role: 'zoom'
    },
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  ]
}
//#endregion
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
////////////////////////
/// aboutWindow    /////
////////////////////////
//#region openAboutWinddow
var newWindow = null
function openAboutWindow() {
    if (newWindow) {
      newWindow.focus();
      return
    }
  
    newWindow = new BrowserWindow({
      height: 500,
      resizable: false,
      width: 600,
      title: '',
      minimizable: false,
      fullscreenable: false,
      webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        }
    })
  
    newWindow.loadURL('file://' + __dirname + '/views/printers.html')
    var printers = newWindow.webContents.getPrinters();
    newWindow.webContents.on("dom-ready",()=>{
        newWindow.send("printers",printers)  
    })
    
    newWindow.on('closed', function() {
      newWindow = null
    })
  }
//#endregion  
////////////////////////
//// onUpdateWindow ////
////////////////////////
//#region onUpdateWindow
  var newWindowUpdate = null;
  var openUpdateWindow = function(respuesta){
    //console.log("openUpdateWindow",respuesta)
    if (newWindowUpdate) {
        newWindowUpdate.focus()
        newWindowUpdate.send("update-app-win",{res:respuesta,win: "focus If"})
        //newWindowUpdate.reload()
        return
      }
    
      newWindowUpdate = new BrowserWindow({
        height: 600,
        resizable: false,
        width: 800,
        title: '',
        minimizable: false,
        fullscreenable: false,
        webPreferences: {
              nodeIntegration: true,
              webviewTag: true,
        },
        allowRunningInsecureContent: true
      })
      newWindowUpdate.webContents.on("dom-ready",(dom)=>{
        console.log("dom-ready",respuesta)
        newWindowUpdate.send("update-app-win",{res:respuesta,win: "dom-ready"})
        ipcMain.on("close-update_window",(e,d)=>{
          if(d){
            if(newWindowUpdate!= null){
              store.set("updateWindow", true);
              newWindowUpdate.destroy();
            }
            
          }
        })
      })
      newWindowUpdate.webContents.on("focus",(dom)=>{
        console.log("uadate mesage");
        newWindowUpdate.send("update-app-win",{res:respuesta,win: "focus-fucntion"})
      })
    
      newWindowUpdate.loadURL('file://' + __dirname + '/views/updateApp.html')
      
      newWindowUpdate.on('closed', function() {
        newWindowUpdate = null
      })
      //newWindowUpdate.webContents.downloadURL('https://yuubbb.com/pro/buy09.02/yuubbbshop/servidor_impresion/Servidor_impresion.dmg');
      newWindowUpdate.webContents.session.on('will-download', (event, item, webContents) => {
        console.log("item",item)
      // Establece una dirección de guardado, haciendo que Electron no saque una ventana de guardado.
      let fileName = item.getFilename();
      console.log(item.getFilename());
      if(/buygest/.test(fileName)){
        item.setSavePath(app.getPath("downloads") + "/" + fileName);
    
        item.on('updated', (event, state) => {
          if (state === 'interrupted') {
            console.log('Download is interrupted but can be resumed')
          } else if (state === 'progressing') {
            if (item.isPaused()) {
              console.log('Download is paused')
            } else {
              newWindowUpdate.send("proces_download",{a:item.getReceivedBytes(),t:item.getTotalBytes()});
              console.log(`Received bytes: ${item.getReceivedBytes()}`)
            }

          }
        })
        item.once('done', (event, state) => {
          if (state === 'completed') {
            console.log('Download successfully')
            newWindowUpdate.send("proces_download_complete",true)
            //store.set("updateWindow",false)
          } else {
            console.log(`Download failed: ${state}`)
          }
        })
        //console.log("Tamaño: ",item.getTotalBytes())
      }
    })

}
//#endregion
/////////////////////
/// showAppVersion //
/////////////////////
//#region showOpenWindow

var versionWindow = null
var showAppVersion = function(version){
  if (versionWindow) {
    versionWindow.focus()
    versionWindow.reload()
    return
  }

  versionWindow = new BrowserWindow({
    height: 100,
    resizable: false,
    width: 200,
    title: '',
    minimizable: false,
    fullscreenable: false,
    webPreferences: {
          nodeIntegration: true,
          webviewTag: true,
    },
    allowRunningInsecureContent: true
  })
  versionWindow.setMenuBarVisibility(false);
  versionWindow.webContents.on("dom-ready",(dom)=>{
    versionWindow.send("show-version",version)
  })

  versionWindow.loadURL('file://' + __dirname + '/views/versionWindow.html')
  
  versionWindow.on('closed', function() {
    versionWindow = null
  })
}
//#endregion

