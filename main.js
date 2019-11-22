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
        }
    });
    store.set("login",true)
    if(store.get("login")){
      win.loadURL(`file:///${__dirname}/views/login.html`);
    } else {
      win.loadURL(`file:///${__dirname}/views/index.html`);
    }
    //win.loadURL(`https://yuubbb.com/pro/buy09.02/ibadanica/envios`);
    win.on('closed', () => {
        win = null;
    });
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

    //updater.init();
    
 
});
app.on('open-url', (event, data)=> {
  //event.preventDefault();
  //link = data;
  console.log("data app",data)
});
ipcMain.on('download-button',(event, {url}) => {
  const windd = BrowserWindow.getFocusedWindow();
 var pro = download(windd, url.url,url.properties)
  //console.log(download(windd, url.url));
  pro.then(e=>{
    console.log("EEE",e)
  })
  .catch(err=>console.log("ERROR: ",err))
});

/*const {Menu} = require('electron')
const electron = require('electron')
const app = electron.app*/

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
    label: 'Printers',
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
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('http://electron.atom.io') }
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

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
var newWindow = null
function openAboutWindow() {
    if (newWindow) {
      newWindow.focus()
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
  var newWindowUpdate = null;
  var openUpdateWindow = function(respuesta){
    //console.log("openUpdateWindow",respuesta)
    if (newWindowUpdate) {
        newWindowUpdate.focus()
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
              webSecurity: false,
              allowRunningInsecureContent: true,
              nodeIntegrationInSubFrames: true
        },
        allowRunningInsecureContent: true
      })
      newWindowUpdate.webContents.on("dom-ready",(dom)=>{
        console.log("dom-ready",respuesta)
        newWindowUpdate.send("update-app-win",{res:respuesta,win: newWindowUpdate})
        ipcMain.on("close-update_window",(e,d)=>{
          if(d){
            if(newWindowUpdate!= null){
              store.set("updateWindow", true);
              newWindowUpdate.destroy();
            }
            
          }
        })
      })
    
      newWindowUpdate.loadURL('file://' + __dirname + '/views/updateApp.html')
      
      newWindowUpdate.on('closed', function() {
        newWindowUpdate = null
      })
      //newWindowUpdate.webContents.downloadURL('https://yuubbb.com/pro/buy09.02/yuubbbshop/servidor_impresion/Servidor_impresion.dmg');
      newWindowUpdate.webContents.session.on('will-download', (event, item, webContents) => {
      // Establece una dirección de guardado, haciendo que Electron no saque una ventana de guardado.
      let fileName = item.getFilename();
      //console.log(item.getFilename());
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
      console.log("Tamaño: ",item.getTotalBytes())
    })
    
  
}
