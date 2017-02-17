const {app, BrowserWindow} = require('electron')
const url = require('url')
const path = require('path')
const {ipcMain} = require('electron')

let win

function createWindow () {
	win = new BrowserWindow({width:800, height:600})
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol:'file',
		slashes: true
	}))
}

ipcMain.on('openFile', (event, path)=>{
	const {dialog} = require('electron')
	const fs = require('fs')

	dialog.showOpenDialog(function (filenames) {
		if (filenames === undefined) {
			console.log('No Selected File(s)')
		}
		else {
			readFile(filenames[0])
		}
	})

	function readFile (filepath) {
		fs.readFile(filepath, 'utf-8', (err, data)=>{
			if (err) {
				console.log(err.message)
				return
			}
			event.sender.send('filename', data)
		})
	}
})

app.on('ready', createWindow)