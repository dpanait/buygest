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
const DownloadManager = require("electron-download-manager");
const {download} = require("electron-dl");
DownloadManager.register({
  downloadFolder: app.getPath("downloads") + "/my-app"
});
var request = require('request');
var fs = require('fs');
const dl = require('download-file-with-progressbar');
const fetch = require('electron-fetch').default
var persistRequest = require('persist-request')('/tmp/');
/*require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});*/
//const socket = require('socket.io-client').connect("https://yuubbb.com:2020/",{ port: 2020,reconnect: true, transports: [ 'websocket' ] });
/*const io = require("socket.io-client")//.connect("https://yuubbb.com",{ port: 2020,reconnect: true, transports: [ 'websocket' ] });
var socket = io.connect('https://yuubbb.com:2020/',{ 
  port: 2020,
  reconnect: true, 
  transports: [ 'websocket' ],
  secure: true, 
  rejectUnauthorized: false 
});
socket.connect();*/
/*var socket = io('https://yuubbb.com:2020');
socket.connect();
socket.emit('buygest_electron_app', "chat_message");

//var socket = io('https://yuubbb.com:2020');
  socket.on('connect', function(){
      console.log("conect")
  });
  socket.on('event', function(data){
      console.log("event",data)
  });
  socket.on('disconnect', function(){
      console.log("disconnect")
  });
*/
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
    ipcMain.on("update-app",(e,res)=>{
      console.log("update-app",res)
      openUpdateWindow(res)
    })
    ipcMain.on("descargar",(e,a)=>{
      /*option = {
        filename: 'server.deb',
        dir: app.getPath("downloads") + "/my-app",
        onDone: (info)=>{
            console.log('done', info);
        },
        onError: (err) => {
            console.log('error', err);
        },
        onProgress: (curr, total) => {
            console.log('progress', (curr / total * 100).toFixed(2) + '%');
        },
    }*/
    var link = "https://yuubbb.com/pro/buy09.02/yuubbbshop/app_bygest/Servidor_impresion.deb"
    //var dd = dl(link, option);
    var stream = persistRequest.get(link);
 
    stream.pipe(app.getPath("downloads") + "/my-app/server.deb");
    /*fetch(link)
    .then(res => res.text())
    .then(body => console.log(body))*/
      /*var link = "https://yuubbb.com/pro/buy01.00/yuubbbshop/servidor_impresion/Servidor_impresion.deb"
      DownloadManager.download({
          url: "https://yuubbb.com/pro/buy01.00/yuubbbshop/servidor_impresion/Servidor_impresion.deb",
          onProgress:  function(progress){
            console.log("onProgress",progress)
        }
      }, function (error, info) {
          if (error) {
              console.log(error);
              return;
          }

          console.log("DONE: " + info.url);
      });
      DownloadManager.bulkDownload({
          urls: link,
          path: "bulk-download"
      }, function (error, finished, errors) {
          if (error) {
              console.log("finished: " + finished);
              console.log("errors: " + errors);
              return;
          }

          console.log("all finished");
      })*/
      //downloadMI();
    })

    ipcMain.on("download", (event, info) => {
      info.properties.onProgress = (e,status) => win.webContents.send("download progress", status);
        download(BrowserWindow.getFocusedWindow(), info.url, info.properties)
            .then(dl => {
              console.log("dl",dl,dl.getSavePath())
              
              win.webContents.send("download complete", dl.getSavePath())
            })
            .catch(err=>console.log("ERRROR: ",err));
    });
    ipcMain.on("down",(event,info)=>{
      win.webContents.downloadURL("https://yuubbb.com/pro/buy09.02/yuubbbshop/servidor_impresion/Servidor_impresion.deb");
      win.webContents.session.on('will-download', (event, item, webContents) => {
        // Establece una dirección de guardado, haciendo que Electron no saque una ventana de guardado.
        item.setSavePath(app.getPath("downloads") + "/my-app1")
      
        item.on('updated', (event, state) => {
          if (state === 'interrupted') {
            console.log('Download is interrupted but can be resumed')
          } else if (state === 'progressing') {
            if (item.isPaused()) {
              console.log('Download is paused')
            } else {
              console.log(`Received bytes: ${item.getReceivedBytes()}`)
            }
          }
        })
        item.once('done', (event, state) => {
          if (state === 'completed') {
            console.log('Download successfully')
          } else {
            console.log(`Download failed: ${state}`)
          }
        })
      })
    })
    

    //updater.init();
    /*let socket = io.connect('https://yuubbb.com:2020',{
      port: 2020,
      transports: [ 'websocket' ],
      upgrade: false,
      secure: true, 
      reconnection: false, 
      rejectUnauthorized: false,
      forcenew: false
    });*/
    //socket.connect()
    /*console.log("SOCKET",socket.connected);
    setTimeout(() => {}, 1000)
    socket.on('connect', () => {
      console.log("connected")
    })
    socket.on('connect_error', (err) => {
      console.log("erorr",err)
    })*/
 
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
    console.log("openUpdateWindow",respuesta)
    if (newWindowUpdate) {
        newWindowUpdate.focus()
        return
      }
    
      newWindowUpdate = new BrowserWindow({
        height: 600,
        resizable: false,
        width: 1200,
        title: '',
        minimizable: false,
        fullscreenable: false,
        webPreferences: {
              nodeIntegration: true,
              webviewTag: true
          }
      })
    
     
      //var printers = newWindow.webContents.getPrinters();
      newWindowUpdate.webContents.on("dom-ready",(dom)=>{
        console.log("dom-ready",respuesta)
        newWindowUpdate.send("update-app-win",{res:respuesta,win: newWindowUpdate})
      })
      ipcMain.on("download-app",(e,arg)=>{
        console.log("download-app",arg)
        if(arg){
          var contents = newWindowUpdate.webContents;
          var down =  contents.downloadURL("https://yuubbb.com/pro/buy01.00/yuubbbshop/servidor_impresion/Servidor_impresion.deb");
        console.log(down)
        contents.on("will-download",(a)=>{
          console.log("DDDDDDD",a);
        })
        }
                
      });
      newWindowUpdate.loadURL('file://' + __dirname + '/views/updateApp.html')
      
      newWindowUpdate.on('closed', function() {
        newWindowUpdate = null
      })
  
}
function downloadFile(file_url , targetPath){
  // Save variable to know progress
  var received_bytes = 0;
  var total_bytes = 0;

  var req = request({
      method: 'GET',
      uri: file_url
  });

  var out = fs.createWriteStream(targetPath);
  req.pipe(out);

  req.on('response', function ( data ) {
      // Change the total bytes value to get progress later.
      total_bytes = parseInt(data.headers['content-length' ]);
  });

  req.on('data', function(chunk) {
      // Update the received bytes
      received_bytes += chunk.length;

      showProgress(received_bytes, total_bytes);
  });

  req.on('end', function() {
      alert("File succesfully downloaded");
  });
}
async function downloadMI()
{
    const http = require('http');
    var file = fs.createWriteStream(app.getPath("downloads") + "/my-app/servidor-impresion.deb");
    const request = await http.get("http://yuubbb.com/pro/buy01.00/yuubbbshop/servidor_impresion/Servidor_impresion.deb", res => {
        res.on('data', function(data) {
            console.log('escribir')
            file.write(data);
        }).on('end', function() {
            console.log('fin')
            file.end();
        });

    });
}

 