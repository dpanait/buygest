const {
    app,
    BrowserWindow 
} = require('electron');
const { Menu, MenuItem } = require('electron')
const { ipcRenderer, ipcMain } = require('electron')
const path = require('path')
const Store = require("electron-store")
const store = new Store();
 
/*require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});*/

let win;

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
 
    win.loadURL(`file:///${__dirname}/views/index.html`);
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
    
    
 
});
app.on('open-url', (event, data)=> {
  //event.preventDefault();
  //link = data;
  console.log("data app",data)
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
