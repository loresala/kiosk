var _kwRev= 0;
var _kwDotNetNS= "KioWareDotNet.KioWareDotNet";
var _kioUtilsItf= (typeof(KioWareUtils)=="object" ? KioWareUtils : (typeof(KioUtils)=="object" ? KioUtils : window.external));
var _kioAppItf= typeof(KioApp)=="object" ? KioApp : null;

KioWare =
{
	GetProperty: function(n)
	{
		if(this.IsKioWarePlatform())
			return _kioAppItf.GetProperty(n);
		return _kioUtilsItf.getKioProperty(n);
	},

	GetRev: function()
	{
		if(_kwRev)
			return _kwRev;
		try
		{
			if(this.IsKioWarePlatform())
				_kwRev= KioApp.GetRev();
			else
			{
				_kwRev= this.GetProperty("SVNRev");
				_kwRev= _kwRev.replace(/[^0-9]/g, "");
				_kwRev= parseInt(_kwRev);
			}
		}
		catch(err){_kwRev= 0;}
		return _kwRev;
	},

	Is: function()
	{
		return (this.GetRev() > 0);
	},

	IsKioWare: function()
	{
		return this.Is();
	},
	//More specific than IsKioWare
	IsKioWareAndroid: function()
	{
		return (!this.IsKioWarePlatform() && _kioUtilsItf != window.external);
	},
	//More specific than IsKioWare
	IsKioWareWindows: function()
	{
		return (!this.IsKioWarePlatform() && !this.IsKioWareAndroid() && this.Is());
	},
	//More specific than IsKioWare
	IsKioWarePlatform: function()
	{
		return (_kioAppItf!=null && typeof(KioWareUtils)!="object");
	},
	//Remember to set up a scripting access list
	Execute: function(path)
	{
		if(this.IsKioWareAndroid())
			_kioUtilsItf.runAppByLabel(path);
		else
			_kioUtilsItf.Execute(path);
	},

	Print: function()
	{
		if(this.IsKioWarePlatform()) KioBrowser.Print();
		else window.external.print();
	},

	LogOff: function()
	{
		if(this.IsKioWarePlatform())
			_kioAppItf.EndSession();
		else if(this.IsKioWareAndroid())
			_kioUtilsItf.endSession();
		else
			_kioUtilsItf.logoff();
	},

	CloseAllPopups: function()
	{
		window.external.CloseAllPopups();
	},

	ShowKeyboard: function()
	{
		if(this.IsKioWarePlatform()) KioApp.StartKeyboard();
		else window.external.StartVirtualKeyboard();
	},
	HideKeyboard: function()
	{
		if(this.IsKioWarePlatform()) KioApp.CloseKeyboard();
		else window.external.KioHideGenericKeyboard();
	},
	
	ShowGenericKeyboard: function()
	{
		if(this.IsKioWarePlatform()) KioApp.StartKeyboard();
		else window.external.KioShowGenericKeyboard();
	},
	HideGenericKeyboard: function()
	{
		this.HideKeyboard();
	},

	LogSessionBegin: function()
	{
		window.external.SetSessionBegin();
	},

	LogPageStat: function(pageTitle, url)
	{
		if(this.IsKioWareWindows())
			window.external.WriteLogEntry(pageTitle, url);
		else if(this.IsKioWareAndroid())
			KioWareUtils.writeLogEntry(url, pageTitle);
	},

	LogSessionEnd: function()
	{
		window.external.WriteEndSessionRecord();
	},

	LogInfo: function(msg)
	{
		if(this.IsKioWarePlatform())
			_kioAppItf.LogInfo(msg);
		else if(this.IsKioWareAndroid())
			_kioUtilsItf.LogInfo(msg);
		else
			_kioUtilsItf.KioEventLog(0, msg);
	},

	LogWarn: function(msg)
	{
		if(this.IsKioWarePlatform())
			_kioAppItf.LogWarn(msg);
		else if(this.IsKioWareAndroid())
			_kioUtilsItf.LogWarn(msg);
		else
			_kioUtilsItf.KioEventLog(1, msg);
	},

	LogErr: function(msg)
	{
		if(this.IsKioWarePlatform())
			_kioAppItf.LogErr(msg);
		else if(this.IsKioWareAndroid())
			_kioUtilsItf.LogErr(msg);
		else
			_kioUtilsItf.KioEventLog(2, msg);
	},

	DialNumber: function(name, number, showDialPad)
	{
		window.external.KioDialNumber(name, number, showDialPad);
	},

	RecordVideo: function(seconds, filename, enablePreview)
	{
		window.external.KioCaptureVideo(0, filename, seconds, enablePreview);
	},

	PreviewVideo: function(enable)
	{
		window.external.KioPreviewEnabled(0, enable);
	},

	TakePicture: function(filename)
	{
		window.external.KioCaptureVideo(0, filename, 0);
	},

	ScanImage: function(filename)
	{
		window.external.KioReadScan(0, filename);
	},

	GetDeviceStatus: function(deviceName)
	{
		if(this.IsKioWarePlatform()) return KioDevice.GetStatus(deviceName);
		var st;
		try {st= window.external.KioDeviceStatus(deviceName);}
		catch(ex) {st= 0xFFFF;}
		return st;
	},

	//nMonitorAfterFirst is optional (0 by default) and is used to add to the number of the first monitor to access other monitors
	SetSecondMonitorURL: function(url, nMonitorAfterFirst)
	{
		if(nMonitorAfterFirst==null) nMonitorAfterFirst= 0;
		window.external.Browser(2+nMonitorAfterFirst).parentWindow.location= url;
	},
	
	SetSecondMonitorURLTime: function(secondsToShow, nMonitorAfterFirst)
	{
		if(nMonitorAfterFirst==null) nMonitorAfterFirst= 0;
		window.external.Browser(2+nMonitorAfterFirst).parentWindow.external.SecondaryTimer(secondsToShow);
	},

	ShowMessage: function(msg)
	{
		window.external.KioCallObject(_kwDotNetNS, "MessageBox", msg);
	},

	IsUserPresent: function()
	{
		try
		{
			if(this.IsKioWarePlatform())
				return _kioAppItf.IsSessionActive();
			else
				return window.external.KioCallObject(_kwDotNetNS, "get_UserPresent");
		}
		catch(ex){}
		return 0;
	},

	SetUserPresent: function(v)
	{
		if(this.IsKioWarePlatform())
		{
			if(v) _kioAppItf.BeginSession();
			else _kioAppItf.EndSession();
		}
		else if(this.IsKioWareAndroid())
			_kioUtilsItf.setUserPresent(v);
		else
			window.external.KioCallObject(_kwDotNetNS, "set_UserPresent", (v ? true : false));
	},

	TLS_IsManual: function()
	{
		return window.external.KioCallObject(_kwDotNetNS, "TLSession.IsManualMode");
	},

	TLS_StartTimer: function(seconds)
	{
		return window.external.KioCallObject(_kwDotNetNS, "TLSession.StartTimer", seconds);
	},

	TLS_StopTimer: function()
	{
		window.external.KioCallObject(_kwDotNetNS, "TLSession.StopTimer");
	},

	TLS_GetTimeLeft: function()
	{
		return window.external.KioCallObject(_kwDotNetNS, "TLSession.GetCurrentSecondsRemaining");
	},

	IsLicenseValid: function()
	{
		return window.external.KioCallObject(_kwDotNetNS, "ValidateLicenseCode");
	},

	GetNewLicense: function(transNum, authCode, model, licType, expYear, expMonth, expDay, performRestart)
	{
		return window.external.KioCallObject(_kwDotNetNS, 'GetNewKWLicense', transNum, authCode, model, licType, expYear, expMonth, expDay, performRestart);
	},

	ShowFindDialog: function()
	{
		window.external.FindDialog();
	},

	ExitKioWare: function()
	{
		if(this.IsKioWarePlatform()) KioApp.Exit();
		else window.external.KioExit();
	},
	
	RestartKioWare: function()
	{
		if(this.IsKioWarePlatform())
			KioApp.RestartKioWare();
		else if(this.IsKioWareAndroid())
			KioApp.restartKioWare();
	},

	IsUrlBlocked: function(url)
	{
		if(this.IsKioWareAndroid())
			return _kioUtilsItf.isUrlBlocked(url);
		return _kioUtilsItf.KioIsUrlBlocked(url);
	},

	GetSpeakerVolume: function()
	{
		if(this.IsKioWarePlatform())
			return _kioUtilsItf.GetMasterVolume();
		else if(this.IsKioWareAndroid())
			return _kioUtilsItf.getMusicVolume();
		return _kioUtilsItf.KioGetSpeakerVolume();
	},

	SetSpeakerVolume: function(percent)
	{
		if(this.IsKioWarePlatform())
			return _kioUtilsItf.SetMasterVolume(percent);
		else if(this.IsKioWareAndroid())
			_kioUtilsItf.setMusicVolume(percent);
		else
			_kioUtilsItf.KioSetSpeakerVolume(percent);
	},

	GetMicVolume: function()
	{
		return window.external.KioGetMicVolume();
	},

	SetMicVolume: function(percent)
	{
		window.external.KioSetMicVolume(percent);
	},

	ClearPrintQueue: function(minSecondsOld)
	{
		window.external.KioClearPrintQueue(minSecondsOld);
	},
	//Can be null: groupName, msg
	AppLog: function(groupName, msg)
	{
		if(this.IsKioWarePlatform())
		{
			window._KioWareLastAppLogId= _kioAppItf.CreateAppLog(groupName, msg);
			return window._KioWareLastAppLogId;
		}
		return _kioUtilsItf.KioAppLog(groupName, msg);
	},
	//Can be null: val
	AppLogData: function(name, val)
	{
		if(this.IsKioWarePlatform()) return _kioAppItf.AddAppLogData(window._KioWareLastAppLogId, name, val?val.toString():null);
		return _kioUtilsItf.KioAppLogData(name, val?val.toString():null);
	},

	GPIO:
	{
		SetPortStates: function(portBits, devName)
		{
			if(KioWare.IsKioWarePlatform()) return KioGPIOBoard.SetPortStates(portBits, devName);
			return KioGPIOBoard.setPortStates(portBits);
		},
		SetPortState: function(ind, on, devName)
		{
			if(KioWare.IsKioWarePlatform()) return KioGPIOBoard.SetPortState(ind, on, devName);
			return KioGPIOBoard.setPortState(ind, on);
		},
		GetPortStates: function(devName)
		{
			if(KioWare.IsKioWarePlatform()) return KioGPIOBoard.GetPortStates(devName);
			return KioGPIOBoard.getPortStates();
		},
		GetPortState: function(ind, devName)
		{
			if(KioWare.IsKioWarePlatform()) return KioGPIOBoard.GetPortState(ind, devName);
			return KioGPIOBoard.getPortState(ind);
		},

		SetPortIOStates: function(portBits, devName)
		{
			if(KioWare.IsKioWarePlatform()) return KioGPIOBoard.SetPortIOStates(portBits, devName);
			return KioGPIOBoard.setPortIOStates(portBits);
		},
		GetPortIOStates: function(devName)
		{
			if(KioWare.IsKioWarePlatform()) return KioGPIOBoard.GetPortIOStates(devName);
			return KioGPIOBoard.getPortIOStates();
		},

		ReadVoltage: function(ind, devName)
		{
			if(KioWare.IsKioWarePlatform()) return KioGPIOBoard.ReadVoltage(ind, devName);
			return KioGPIOBoard.readVoltage(ind);
		}
	},
	
	FileIO:
	{
		GetDirectoryList: function(rootdir, listDirectories, extensionFilter, sortFlags)
		{
			if (listDirectories == undefined) listDirectories = true;
			if (extensionFilter == undefined) extensionFilter = null;
			if (sortFlags == undefined) sortFlags = 0;
			
			if(KioWare.IsKioWarePlatform()) {
				rootdir = KioApp.DoUrlSubstitution(rootdir, 0);
				return JSON.parse(KioFileIO.GetDirectoryList(rootdir, listDirectories, extensionFilter, sortFlags));
			}
			else {
				var result = JSON.parse(KioFileIO.GetDirectoryList(rootdir, listDirectories, extensionFilter, sortFlags));
				if (result.Bool) return JSON.parse(result.Str);
				else throw result.Str;
			}
		},
		
		GetFileDetails: function(filePath)
		{			
			if(KioWare.IsKioWarePlatform()) {
				filePath = KioApp.DoUrlSubstitution(filePath, 0);
				return JSON.parse(KioFileIO.GetFileDetails(filePath));
			}
			else {
				var result = JSON.parse(KioFileIO.GetFileDetails(filePath));
				if (result.Bool) {
					result = JSON.parse(result.Str);
					if (result.IsFile) return result;
					else throw "'filePath' is not a valid file.";
				}
				else throw result.Str;
			}
		},
		
		GetDirectoryDetails: function(dirPath)
		{			
			if(KioWare.IsKioWarePlatform()) {
				dirPath = KioApp.DoUrlSubstitution(dirPath, 0);
				return JSON.parse(KioFileIO.GetDirectoryDetails(dirPath));
			}
			else {
				var result = JSON.parse(KioFileIO.GetFileDetails(dirPath));
				if (result.Bool) {
					result = JSON.parse(result.Str);
					if (result.IsDirectory) return result;
					else throw "'dirPath' is not a valid directory.";
				}
				else throw result.Str;
			}
		},
		
		CreateDirectory: function(dirPath)
		{
			if(KioWare.IsKioWarePlatform()) {
				dirPath = KioApp.DoUrlSubstitution(dirPath, 0);
				return KioFileIO.CreateDirectory(dirPath);
			}
			else {
				var result = JSON.parse(KioFileIO.CreateDirectory(dirPath, true));
				return result.Bool;
			}
		},
		
		DeleteDirectory: function(dirPath)
		{			
			if(KioWare.IsKioWarePlatform()) {
				dirPath = KioApp.DoUrlSubstitution(dirPath, 0);
				return KioFileIO.DeleteDirectory(dirPath);
			}
			else {
				var result = JSON.parse(KioFileIO.DeleteDirectory(dirPath, true));
				return result.Bool;
			}
		},
		
		MoveDirectory: function(to, from)
		{
			if(KioWare.IsKioWarePlatform()) {
				to = KioApp.DoUrlSubstitution(to, 0);
				from = KioApp.DoUrlSubstitution(from, 0);
				return KioFileIO.MoveDirectory(to, from);
			}
			else {
				var result = JSON.parse(KioFileIO.MoveFile(to, from));
				return result.Bool;
			}
		},
		
		CreateFile: function(filePath)
		{
			if(KioWare.IsKioWarePlatform()) {
				filePath = KioApp.DoUrlSubstitution(filePath, 0);
				return KioFileIO.CreateFile(filePath);
			}
			else {
				var result = JSON.parse(KioFileIO.CreateFile(filePath));
				return result.Bool;
			}
		},
		
		DeleteFile: function(filePath)
		{			
			if(KioWare.IsKioWarePlatform()) { 
				filePath = KioApp.DoUrlSubstitution(filePath, 0);
				return KioFileIO.DeleteFile(filePath);
			}
			else {
				var result = JSON.parse(KioFileIO.DeleteFile(filePath));
				return result.Bool;
			}
		},
		
		MoveFile: function(to, from)
		{
			if(KioWare.IsKioWarePlatform()) {
				to = KioApp.DoUrlSubstitution(to, 0);
				from = KioApp.DoUrlSubstitution(from, 0);
				return KioFileIO.MoveFile(to, from);
			}
			else {
				var result = JSON.parse(KioFileIO.MoveFile(to, from));
				return result.Bool;
			}
		},
		
		ReadFileData: function(filePath, startPosition, byteLength, base64Return)
		{
			if (base64Return == undefined) base64Return = false;
		
			if(KioWare.IsKioWarePlatform()) {
				filePath = KioApp.DoUrlSubstitution(filePath, 0);
				if (!base64Return)
					return KioFileIO.ReadFileData(filePath, startPosition, byteLength);
				else 
					return KioFileIO.ReadFileDataBase64(filePath, startPosition, byteLength);
			}
			else {
				var result = JSON.parse(KioFileIO.ReadFileData(filePath, startPosition, byteLength, base64Return));
				if (result.Bool) {
					if (base64Return) return result.Str;
					else return JSON.parse(result.Str);
				}
				else throw result.Str;
			}
		},
		
		ReadFileText: function(filePath, maxCharsToRead, characterEncoding, useByteOrderMarks)
		{
			if (characterEncoding == undefined) characterEncoding = null;
			if (useByteOrderMarks == undefined) useByteOrderMarks = true;
		
			if(KioWare.IsKioWarePlatform()) {
				filePath = KioApp.DoUrlSubstitution(filePath, 0);
				return KioFileIO.ReadFileText(filePath, maxCharsToRead, characterEncoding, useByteOrderMarks);
			}
			else {
				var result = JSON.parse(KioFileIO.ReadFileText(filePath, maxCharsToRead));
				if (result.Bool) return result.Str;
				else throw result.Str;
			}
		},
		
		WriteFileData: function(filePath, bytes, append)
		{
			if(KioWare.IsKioWarePlatform()) {
				filePath = KioApp.DoUrlSubstitution(filePath, 0);
				KioFileIO.WriteFileData(filePath, bytes, append);
			}
			else {
				var result = JSON.parse(KioFileIO.WriteFileData(filePath, JSON.stringify(bytes), append));
				if (!result.Bool) throw result.Str;
			}
		},
		
		WriteFileDataBase64: function(filePath, base64Data, append)
		{
			if(KioWare.IsKioWarePlatform()) {
				filePath = KioApp.DoUrlSubstitution(filePath, 0);
				KioFileIO.WriteFileDataBase64(filePath, base64Data, append);
			}
			else {
				var result = JSON.parse(KioFileIO.WriteFileDataBase64(filePath, base64Data, append));
				if (!result.Bool) throw result.Str;
			}
		},
		
		WriteFileText: function(filePath, text, append, characterEncoding)
		{
			if (characterEncoding == undefined) characterEncoding  = null;
			
			if(KioWare.IsKioWarePlatform()) {
				filePath = KioApp.DoUrlSubstitution(filePath, 0);
				KioFileIO.WriteFileText(filePath, text, append, characterEncoding);
			}
			else {
				var result = JSON.parse(KioFileIO.WriteFileText(filePath, text, append));
				if (!result.Bool) throw result.Str;
			}
		}
	},

	EvokeVmcController:
	{
		VmcCmd: function(v, id, sid, d, f)
		{
			this.version = v;
			this.cmdId = id;
			this.subCmdId = sid;
			this.success = 0;
			this.data = d;
			this.cbFunc = f;
		},
		GetMotorList: function(cbFunc, doScan)
		{
			KioEvokeVmcController.AddCmd(new this.VmcCmd(1,1,0,(doScan?"01":"00"),cbFunc));
		},
		VendMotor: function(cbFunc, row1, col1, machineType, isCan, sensorType, quitEarly, cookSec, row2, col2)
		{
			if(row2==undefined) {row2 = col2 = 0/*0xFFFF*/;}
			var c = HexUtil.NbrToHex(row1,2,1)+HexUtil.NbrToHex(col1,2,1)+HexUtil.NbrToHex(machineType,1)+HexUtil.NbrToHex(sensorType,1)+HexUtil.NbrToHex(isCan,1)+HexUtil.NbrToHex(quitEarly,1)+"00"+HexUtil.NbrToHex(row2,2,1)+HexUtil.NbrToHex(col2,2,1)+HexUtil.NbrToHex(cookSec,2,1);
			KioEvokeVmcController.AddCmd(new this.VmcCmd(3,1,1,c,cbFunc));
		},
		HomeMotor: function(cbFunc,row, col)
		{
			var c = HexUtil.NbrToHex(row,2,1)+HexUtil.NbrToHex(col,2,1);
			KioEvokeVmcController.AddCmd(new this.VmcCmd(0,1,3,c,cbFunc));
		}
	}
}


KioWare.IdStorageTagBase = function(devName)
{
	this.DeviceName = devName;
	this.DeviceType = 0;
	this.Uid = null;
	this.TagType = 0;
	this.LogErrors = 0;
	this.KeyLocation = 0;
}
KioWare.IdStorageTagBase.prototype.constructor = KioWare.IdStorageTagBase;

KioWare.IdStorageTagBase.prototype.Init = function(blockSize, maxChunkSize, supportsMultiBlock)
{
	this.BlockSize = blockSize;
	this.SupportsMultiBlock = supportsMultiBlock;
	this.MaxChunkSize = (supportsMultiBlock ? maxChunkSize : blockSize);
	while(this.MaxChunkSize % this.BlockSize) --this.MaxChunkSize;
}
KioWare.IdStorageTagBase.prototype.GetMaxTransBlockCount = function() {return Math.floor(this.MaxChunkSize/this.BlockSize);}

//keyLocation: 0=NoAuth, 1=Explicit, 2=OnDevice
KioWare.IdStorageTagBase.prototype.SetKey = function(keyLocation, keyOrAddress, useSecondaryKey)
{
	this.KeyLocation = keyLocation;
	if(this.KeyLocation==2) this.KeyAddress = keyOrAddress;
	else this.Key = keyOrAddress;
	this.UseSecondaryKey = useSecondaryKey;
}

KioWare.IdStorageTagBase.prototype.WriteHex_Lock = function(addrInd, hexData, noVerifyWithRead, noVerifyLock)
{
	if(this.DeviceType==2)
		return this.WriteHex(addrInd, hexData, noVerifyWithRead, undefined, 1);
	var n = this.WriteHex(addrInd, hexData, noVerifyWithRead);
	if(!n) return 0;
	return (this.Lock(addrInd, n, noVerifyLock) ? n : 0);
}

//Writes a string encoded as UTF-8 and terminates with null
KioWare.IdStorageTagBase.prototype.WriteStrUtf8 = function(addrInd, strData, noVerifyWithRead)
{
	return this.WriteHex(addrInd, KioUtils.StringToUtf8Hex(strData)+"00", noVerifyWithRead);
}

KioWare.IdStorageTagBase.prototype.WriteStrUtf8_Lock = function(addrInd, strData, noVerifyWithRead, noVerifyLock)
{
	return this.WriteHex_Lock(addrInd, KioUtils.StringToUtf8Hex(strData)+"00", noVerifyWithRead, noVerifyLock);
}

//Reads 8 blocks at a time until a null byte is reached
KioWare.IdStorageTagBase.prototype.ReadStrUtf8 = function(addrInd)
{
	for(var data = "", ind;;)
	{
		var nb = (data.length ? 8 : 8-(addrInd%8));
		var s = this.ReadHex(addrInd, this.BlockSize*nb);
		if(!s) return null;

		for(var i = 0; i < s.length; i += 2)
		{
			if(s.charCodeAt(i)==48 && s.charCodeAt(i+1)==48)
			{
				data += KioUtils.Utf8HexToString(s.substr(0, i));
				return data;
			}
		}
		addrInd += nb;
		if(addrInd%8) throw "Next address is not 8 block aligned! "+addrInd+" "+nb;
		data += KioUtils.Utf8HexToString(s);
	}
}

KioWare.IdStorageTagBase.prototype.ProcessForWrite = function(addrInd, hexData, noPad)
{
	if(!this.Uid || (hexData.length%2)) return null;
	hexData = hexData.toUpperCase();
	var o = {byteLen:hexData.length/2, padLen:0};

	if(!noPad)
	{
		o.padLen = this.BlockSize-(o.byteLen%this.BlockSize);
		if(o.padLen==this.BlockSize) o.padLen = 0;
		else if(o.padLen)
		{
			o.padData = this.ReadHex(addrInd+Math.floor(o.byteLen/this.BlockSize), this.BlockSize);
			if(!o.padData) return null;
			o.byteLen += o.padLen;
			o.padData = o.padData.substr(this.BlockSize*2-o.padLen*2);
//KioApp.LogDiag(o.byteLen+" "+o.padLen+" "+o.padData);
		}
	}
	o.dataArr = [];

	for(var i = 0, n = hexData.length, mcs2 = this.MaxChunkSize*2;; i += mcs2, n -= mcs2)
	{
		if(n > mcs2) o.dataArr.push(hexData.substr(i, mcs2));
		else
		{
			var b = hexData.substr(i, n);
			if(o.padData) b += o.padData;
			o.dataArr.push(b);
			break;
		}
	}
	return o;
}

KioWare.IdStorageTagBase.prototype.VerifyWrite = function(hexWriteData, hexReadData)
{
	if(this.LogErrors && hexWriteData != hexReadData) KioApp.LogWarn("Write Failed:\nWrote:\n"+hexWriteData+"\nRead:\n"+hexReadData);
	return hexWriteData==hexReadData;
}

KioWare.IdStorageTagBase.prototype.VerifyLock = function(addrInd, nBytes)
{
	var d = this.ReadHex(addrInd, nBytes, 1), s = "", r;
	if(!d) return 0;
	for(var i = 0; i < d.length; ++i) {s += (d.charCodeAt(i)==48 ? "F" : "0");}
	var log = this.LogErrors; this.LogErrors = 0;
	r = this.WriteHex(addrInd, s, 0, 0);
	this.LogErrors = log;
	return !r;
}

KioWare.IdStorageTagBase.prototype.CmdHex = function(hexData)
{
	return KioIdStorageTagDevice.CmdHex(hexData, null, 1000, this.DeviceName);
}
KioWare.IdStorageTagBase.prototype.Cmd = function(strData)
{
	return this.CmdHex(HexUtil.StrToHex(strData));
}

KioWare.IdStorageTagBase.prototype.BlocksFromBytes = function(nBytes) {return Math.ceil(nBytes/this.BlockSize);}

KioWare.IdStorageTagBase.prototype._RunUnitTests = function(addrInd, tagSize, doSelect)
{
	this.LogErrors = 1;
	var th = this, d = th.Scan(), tagData = "", i, h, r;
	if(!d) {KioApp.LogWarn("No tag"); KioIdStorageTagDevice.EnablePollForId(1, th.DeviceName); return;}
	KioApp.LogDiag("Polling for id disabled.");
	KioIdStorageTagDevice.EnablePollForId(0, th.DeviceName);
	KioApp.LogDiag("UID: "+th.Uid);
	if(doSelect && !th.Select()) {KioApp.LogDiag("Select failed"); return;}
	if(!addrInd) addrInd = 0;

	for(r = 0; r < (tagSize > 64 ? 2 : 1); ++r)
	{
		for(i = 65; i < 91; ++i)
		{
			tagData += (i==65 ? "\u00C5" : String.fromCharCode(i));
			KioApp.LogDiag("Wrote "+th.WriteStrUtf8(addrInd, tagData)+" bytes: "+tagData);
			h = th.ReadStrUtf8(addrInd);
			if(h != tagData)  {KioApp.LogWarn("Read: "+h); return;}
		}
	}
	tagData = "";
	for(i = 0; i < tagSize; ++i) {tagData += HexUtil.ByteToHex(Rand(0, 255));}
	KioApp.LogDiag("Writing:"+tagData);
	if(th.WriteHex(addrInd, tagData) != tagData.length/2) {KioApp.LogWarn("Write FAILED!"); return;}
	h = tagData; r = th.ReadHex(addrInd, tagSize);
	if(h != r)  {KioApp.LogWarn("Initial Read is WRONG:\ntagData:\n"+tagData+"\nreadData:\n"+r); return;}

	setInterval(function()
	{
		if(!h) return;
		h = h.substr(0, h.length-2);
		if(!h.length)
		{
			h = "C\u00C5n touch dis."; var hOrig = h; KioApp.LogDiag("Writing:"+h);

			if((h = th.WriteStrUtf8(addrInd, h)) && th.ReadStrUtf8(addrInd)==hOrig)
			{
				h = "C\u00C5n't touch dis!"; KioApp.LogDiag("Writing and locking:"+h);
				h = th.WriteStrUtf8_Lock(addrInd, h);
			}
			var nb = th.BlocksFromBytes(h), tnb = th.BlocksFromBytes(tagSize);

			if(h && th.Lock(addrInd, (tnb-addrInd)*th.BlockSize))
				KioApp.LogDiag("SUCCESS!");
			else KioApp.LogWarn("FAIL!!");

			KioIdStorageTagDevice.EnablePollForId(1, th.DeviceName);
			h = 0;
			return;
		}
		KioApp.LogDiag("Writing:"+h);
		if(th.WriteHex(addrInd, h) != h.length/2) {KioApp.LogWarn("Write FAILED!"); h = 0; return;}
		r = th.ReadHex(addrInd, tagSize);

		if(r != tagData)
		{
			KioApp.LogWarn("tagData:\n"+tagData+"\nreadData:\n"+r);
			h = 0;
		}
	}, 100);
}


KioWare.Feig = function(devName)
{
	this.DeviceType = 1;
	KioWare.IdStorageTagBase.call(this, devName);
	this.Init(4, 128, 1);
	this._maxWriteRetries = 0;
	this._maxReadRetries = 0;
}
KioWare.Feig.prototype = new KioWare.IdStorageTagBase();
KioWare.Feig.prototype.constructor = KioWare.Feig;

KioWare.Feig.prototype.Scan = function()
{
	/*if(*/this.CmdHex("69");//)
	{
		var d = this.CmdHex("B00100");
		if(!d || d.length < 11*2) {this.Uid = null; return null;}
		this.TagType = HexUtil.HexToByte(d.charCodeAt(2), d.charCodeAt(3));
		var uidInd = this.TagType==3 ? 6 : 8;
		var tLen = d.length-uidInd;
		this.Uid = d.substr(uidInd, tLen);
		this.IsSelected = 0;
		return this.Uid;
	}
}

//Returns the number of bytes written minus any block alignment padding
KioWare.Feig.prototype.WriteHex = function(addrInd, hexData, noVerifyWithRead, nRetries)
{
	var o = this.ProcessForWrite(addrInd, hexData);
	if(!o) return 0;
	if(nRetries===undefined) nRetries = 1;
	
	var nWrites = o.dataArr.length;

	for(var i = 0;;)
	{
		for(var t = 0;; ++t)
		{
			if(this.LogErrors && t > this._maxWriteRetries)
			{
				this._maxWriteRetries = t;
				KioApp.LogErr("New max write retries: "+this._maxWriteRetries);
			}
			if(t > nRetries)
				return 0;
			var b = o.dataArr[i], writeByteLen = b.length/2, writeBlockLen = writeByteLen/this.BlockSize;
			var d = "B0240"+(this.IsSelected?"2":"1"+this.Uid)+HexUtil.ByteToHex(addrInd)+HexUtil.ByteToHex(writeBlockLen)+HexUtil.ByteToHex(this.BlockSize)+b;

			d = this.CmdHex(d);

			if(!noVerifyWithRead)
			{
				d = this.ReadHex(addrInd, writeByteLen, 1);
				if(!this.VerifyWrite(b, d)) continue;
				break;
			}
		}
		if(++i==nWrites) return o.byteLen-o.padLen;
		addrInd += writeBlockLen;
	}
}

KioWare.Feig.prototype.ReadHex = function(addrInd, nBytes, noRemoveBlockAlignPad, nRetries)
{
	if(!this.Uid) return null;
	if(nRetries===undefined) nRetries = 4;
	var s = "", blockSizeInHex = this.BlockSize*2;

	for(var left = nBytes; left > 0;)
	{
		var nBlocks = this.BlocksFromBytes(left > this.MaxChunkSize ? this.MaxChunkSize : left);
		var dCmd = "B0230"+(this.IsSelected?"2":"1"+this.Uid)+HexUtil.ByteToHex(addrInd)+HexUtil.ByteToHex(nBlocks), d;

		for(var t = 0;; ++t)
		{
			if(this.LogErrors && t > this._maxReadRetries)
			{
				this._maxReadRetries = t;
				KioApp.LogErr("New max read retries: "+this._maxReadRetries);
			}
			if(t > nRetries)
				return null;
			d = this.CmdHex(dCmd);

			if(d && d.length >= (3+(nBlocks*this.BlockSize))*2 && HexUtil.HexToByte(d.charCodeAt(0), d.charCodeAt(1))==nBlocks)
				break;
		}
		for(var i = 0; i < nBlocks; ++i)
		{
			left -= this.BlockSize;
			s += d.substr(6+i*(blockSizeInHex+2), blockSizeInHex);
		}
		if(left < 0)
		{
			if(!noRemoveBlockAlignPad) s = s.substr(0, s.length+left*2);
			break;
		}
		addrInd += nBlocks;
	}
	return s;
}

KioWare.Feig.prototype.Lock = function(addrInd, nBytes, noVerify)
{
	var addr = addrInd, nBlocks = this.BlocksFromBytes(nBytes), nMaxBlocks = this.GetMaxTransBlockCount();

	for(;;)
	{
		var nb = (nBlocks > nMaxBlocks ? nMaxBlocks : nBlocks);
		var d = "B0220"+(this.IsSelected?"2":"1"+this.Uid)+HexUtil.ByteToHex(addr)+HexUtil.ByteToHex(nb);
		d = this.CmdHex(d);

		if(!d || d.length != 2)
		{
			var e = d ? d.substr(0, 2) : "null";

			//Don't check 11 (locked already) because the device stops processing locks as soon as it hits one that's already locked
			if(e != "00" && e != "01")
			{
				if(this.LogErrors) KioApp.LogWarn("Lock Failed - Cmd Response: "+d);
				return false;
			}
		}
		if(!noVerify && !this.VerifyLock(addr, nb)) return false;
		nBlocks -= nb;
		if(!nBlocks) return true;
		addr += nb;
	}
}

KioWare.Feig.prototype.Select = function()
{
	if(!this.Uid) return null;
	var dCmd = "B025"+HexUtil.ByteToHex((3<<4)+1)+HexUtil.ByteToHex(this.Uid.length/2)+this.Uid, d;
	d = this.CmdHex(dCmd);
	this.IsSelected = (d && d.length > 2);
	return this.IsSelected;
}

KioWare.Feig.prototype.Auth = function(addrInd)
{
	if(!this.Uid) return 0;
	var dCmd = "B2B0", d;
	if(this.KeyLocation==1) dCmd += HexUtil.ByteToHex((1<<3)+2)+HexUtil.ByteToHex(addrInd)+HexUtil.ByteToHex(this.UseSecondaryKey)+this.Key;
	else dCmd += "02"+HexUtil.ByteToHex(addrInd)+HexUtil.ByteToHex(this.UseSecondaryKey)+HexUtil.ByteToHex(this.KeyAddress);
	d = this.CmdHex(dCmd);
	return (d && d.length==2 && HexUtil.HexToByte(d.charCodeAt(0), d.charCodeAt(1))==1);
}


KioWare.Boca = function(devName)
{
	this.DeviceType = 2;
	KioWare.IdStorageTagBase.call(this, devName);
	this.Init(4, 64, 1);
	this._maxWriteRetries = 0;
	this._maxReadRetries = 0;
}
KioWare.Boca.prototype = new KioWare.IdStorageTagBase();
KioWare.Boca.prototype.constructor = KioWare.Boca;

KioWare.Boca.prototype.Scan = function()
{
	var d = this.Cmd("<RFSN2,1>");
	if(!d || d.length < 4*2) {this.Uid = null; return null;}
	this.Uid = d;
	this.IsSelected = 0;
	return this.Uid;
}

//Returns the number of bytes written minus any block alignment padding
KioWare.Boca.prototype.WriteHex = function(addrInd, hexData, noVerifyWithRead, nRetries, lock)
{
	var o = this.ProcessForWrite(addrInd, hexData);
	if(!o) return 0;
	if(nRetries===undefined) nRetries = 0;
	
	var nWrites = o.dataArr.length;

	for(var i = 0;;)
	{
		for(var t = 0;; ++t)
		{
			if(this.LogErrors && t > this._maxWriteRetries)
			{
				this._maxWriteRetries = t;
				KioApp.LogErr("New max write retries: "+this._maxWriteRetries);
			}
			if(t > nRetries)
				return 0;
			var b = o.dataArr[i], writeByteLen = b.length/2, writeBlockLen = writeByteLen/this.BlockSize;
			var d = "<RFW2,"+addrInd+","+(lock?1:0)+">"+b+'\r';

			d = this.Cmd(d);

			if(!noVerifyWithRead)
			{
				d = this.ReadHex(addrInd, writeByteLen, 1);
				if(!this.VerifyWrite(b, d)) continue;
				break;
			}
		}
		if(++i==nWrites) return o.byteLen-o.padLen;
		addrInd += writeBlockLen;
	}
}

KioWare.Boca.prototype.ReadHex = function(addrInd, nBytes, noRemoveBlockAlignPad, nRetries)
{
	if(!this.Uid) return null;
	if(nRetries===undefined) nRetries = 0;
	var s = "", blockSizeInHex = this.BlockSize*2;

	for(var left = nBytes; left > 0;)
	{
		var nBlocks = this.BlocksFromBytes(left > this.MaxChunkSize ? this.MaxChunkSize : left);
		var dCmd = "<RFR2,"+addrInd+","+nBytes+",1>", d;

		for(var t = 0;; ++t)
		{
			if(this.LogErrors && t > this._maxReadRetries)
			{
				this._maxReadRetries = t;
				KioApp.LogErr("New max read retries: "+this._maxReadRetries);
			}
			if(t > nRetries)
				return null;

			d = this.Cmd(dCmd);

			if(d && d.length >= nBytes*2)
				break;
		}
		for(var i = 0; i < nBlocks; ++i)
		{
			left -= this.BlockSize;
			s += d.substr(i*blockSizeInHex, blockSizeInHex);
		}
		if(left < 0)
			break;
		addrInd += nBlocks;
	}
	return s;
}


KioWare.Elatec = function(devName, reqHighDataRate)
{
	this.DeviceType = 3;
	KioWare.IdStorageTagBase.call(this, devName);
	this.Init(4, 128, 0);
	this.HighDataRate = reqHighDataRate;
	this._maxWriteRetries = 0;
	this._maxReadRetries = 0;
}
KioWare.Elatec.prototype = new KioWare.IdStorageTagBase();
KioWare.Elatec.prototype.constructor = KioWare.Elatec;

KioWare.Elatec.prototype.Scan = function()
{
	var th = this, v = JSON.parse(KioIdStorageTagDevice.GetData(th.DeviceName));
	v = v.DataList;
	if(!v.length) {th.Uid = null; return null;}
	th.TagType = v[0].Type;
	th.Uid = v[0].Id;
	return th.Uid;
}

//Returns the number of bytes written minus any block alignment padding
KioWare.Elatec.prototype.WriteHex = function(addrInd, hexData, noVerifyWithRead, nRetries)
{
	var o = this.ProcessForWrite(addrInd, hexData);
	if(!o) return 0;
	if(nRetries===undefined) nRetries = 1;
	
	var nWrites = o.dataArr.length;

	for(var i = 0;;)
	{
		for(var t = 0;; ++t)
		{
			if(this.LogErrors && t > this._maxWriteRetries)
			{
				this._maxWriteRetries = t;
				KioApp.LogErr("New max write retries: "+this._maxWriteRetries);
			}
			if(t > nRetries)
				return 0;
			var b = o.dataArr[i], writeByteLen = b.length/2, writeBlockLen = writeByteLen/this.BlockSize;
			var d = "0D004"+(this.HighDataRate?"2":"1")+"2105"+HexUtil.ByteToHex(addrInd)+b+"FF";
			d = this.CmdHex(d);

			if(!noVerifyWithRead)
			{
				d = this.ReadHex(addrInd, writeByteLen, 1);
				if(!this.VerifyWrite(b, d)) continue;
				break;
			}
		}
		if(++i==nWrites) return o.byteLen-o.padLen;
		addrInd += writeBlockLen;
	}
}

KioWare.Elatec.prototype.ReadHex = function(addrInd, nBytes, noRemoveBlockAlignPad, nRetries)
{
	if(!this.Uid) return null;
	if(nRetries===undefined) nRetries = 4;
	var s = "", blockSizeInHex = this.BlockSize*2;

	for(var left = nBytes; left > 0;)
	{
		var nBlocks = this.BlocksFromBytes(left > this.MaxChunkSize ? this.MaxChunkSize : left);
		var dCmd = "0D004"+(this.HighDataRate?"2":"1")+"2001"+HexUtil.ByteToHex(addrInd)+"FF", d; //1.5.12.1 ISO15693_GenericCommand

		for(var t = 0;; ++t)
		{
			if(this.LogErrors && t > this._maxReadRetries)
			{
				this._maxReadRetries = t;
				KioApp.LogErr("New max read retries: "+this._maxReadRetries);
			}
			if(t > nRetries)
				return null;
			d = this.CmdHex(dCmd);

			if(d && d.length >= (3+(nBlocks*this.BlockSize))*2 && d.charCodeAt(3)==49)
			{
				var bLen = HexUtil.HexToByte(d.charCodeAt(4), d.charCodeAt(5));
				var sInd = -1;
				if(bLen==this.MaxChunkSize) sInd = 0;
				if(bLen==this.MaxChunkSize+1) sInd = 2;
				if(sInd != -1)
				{
					d = d.substr(6+sInd);
					break;
				}
			}
		}
		for(var i = 0; i < nBlocks; ++i)
		{
			left -= this.BlockSize;
			s += d.substr(i*(blockSizeInHex+2), blockSizeInHex);
		}
		if(left < 0)
		{
			if(!noRemoveBlockAlignPad) s = s.substr(0, s.length+left*2);
			break;
		}
		addrInd += nBlocks;
	}
	return s;
}

KioWare.Elatec.prototype.Lock = function(addrInd, nBytes, noVerify)
{
	var addr = addrInd, nBlocks = this.BlocksFromBytes(nBytes), nMaxBlocks = this.GetMaxTransBlockCount();

	for(;;)
	{
		var nb = (nBlocks > nMaxBlocks ? nMaxBlocks : nBlocks);
		var d = "0D004"+(this.HighDataRate?"2":"1")+"2201"+HexUtil.ByteToHex(addr)+"FF";
		d = this.CmdHex(d);

		if(!d || d.length != 2)
		{
			var e = d ? d.substr(0, 2) : "null";

			//Don't check 11 (locked already) because the device stops processing locks as soon as it hits one that's already locked
			if(e != "00" && e != "01")
			{
				if(this.LogErrors) KioApp.LogWarn("Lock Failed - Cmd Response: "+d);
				return false;
			}
		}
		if(!noVerify && !this.VerifyLock(addr, nb)) return false;
		nBlocks -= nb;
		if(!nBlocks) return true;
		addr += nb;
	}
}


KioWare.DigitalLogicRF = function(devName)
{
	this.DeviceType = 4;
	KioWare.IdStorageTagBase.call(this, devName);
	this.Init(4, 128, 0);
	this._maxWriteRetries = 0;
	this._maxReadRetries = 0;
}
KioWare.DigitalLogicRF.prototype = new KioWare.IdStorageTagBase();
KioWare.DigitalLogicRF.prototype.constructor = KioWare.DigitalLogicRF;

KioWare.DigitalLogicRF.prototype.Scan = function()
{
	var th = this, v = JSON.parse(KioIdStorageTagDevice.GetData(th.DeviceName));
	v = v.DataList;
	if(!v.length) {th.Uid = null; return null;}
	th.TagType = v[0].Type; //From DL docs: page 25 (v1.21)
	th.Uid = v[0].Id;
	return th.Uid;
}

//*** Reading and writing use auth mode AKM2_AUTH1A 0x40 (page 26) ***

//Returns the number of bytes written minus any block alignment padding
KioWare.DigitalLogicRF.prototype.WriteHex = function(addrInd, hexData, noVerifyWithRead, nRetries)
{
	var o = this.ProcessForWrite(addrInd, hexData);
	if(!o) return 0;
	if(nRetries===undefined) nRetries = 1;
	
	var nWrites = o.dataArr.length;

	for(var i = 0;;)
	{
		for(var t = 0;; ++t)
		{
			if(this.LogErrors && t > this._maxWriteRetries)
			{
				this._maxWriteRetries = t;
				KioApp.LogErr("New max write retries: "+this._maxWriteRetries);
			}
			if(t > nRetries)
				return 0;
			var b = o.dataArr[i], writeByteLen = b.length/2, writeBlockLen = writeByteLen/this.BlockSize;
			var d = "5517AA"+HexUtil.ByteToHex(5+writeByteLen)+"4000";
			d = this.CmdHex(d);

			if(d && d.substr(0,2)=="AC")
			{
				d = HexUtil.ByteToHex(addrInd)+"000000"+b;
				d = this.CmdHex(d);

				if(!noVerifyWithRead)
				{
					d = this.ReadHex(addrInd, writeByteLen, 1);
					if(!this.VerifyWrite(b, d)) continue;
					break;
				}
			}
		}
		if(++i==nWrites) return o.byteLen-o.padLen;
		addrInd += writeBlockLen;
	}
}

KioWare.DigitalLogicRF.prototype.ReadHex = function(addrInd, nBytes, noRemoveBlockAlignPad, nRetries)
{
	if(!this.Uid) return null;
	if(nRetries===undefined) nRetries = 4;
	var s = "", blockSizeInHex = this.BlockSize*2;

	for(var left = nBytes; left > 0;)
	{
		var nBlocks = this.BlocksFromBytes(left > this.MaxChunkSize ? this.MaxChunkSize : left);
		var dCmd = "5516AA054000", d;

		for(var t = 0;; ++t)
		{
			if(this.LogErrors && t > this._maxReadRetries)
			{
				this._maxReadRetries = t;
				KioApp.LogErr("New max read retries: "+this._maxReadRetries);
			}
			if(t > nRetries)
				return null;
			d = this.CmdHex(dCmd);

			if(d && d.substr(0,2)=="AC")
			{
				d = HexUtil.ByteToHex(addrInd)+"000000";
				d = this.CmdHex(d);

				if(d && d.length == (7 + nBlocks*this.BlockSize)*2)
				{
					d = d.substr(7*2);
					break;
				}
			}
		}
		for(var i = 0; i < nBlocks; ++i)
		{
			left -= this.BlockSize;
			s += d.substr(i*(blockSizeInHex+2), blockSizeInHex);
		}
		if(left < 0)
		{
			if(!noRemoveBlockAlignPad) s = s.substr(0, s.length+left*2);
			break;
		}
		addrInd += nBlocks;
	}
	return s;
}

KioWare.DigitalLogicRF.prototype.Lock = function(addrInd, nBytes, noVerify)
{
	return false; //Could not find command in device document
}


var HexUtil =
{
	HexToByte: function(hexCharCode1, hexCharCode2)
	{
		return (this.HexCharToHalfByte(hexCharCode1) << 4) + this.HexCharToHalfByte(hexCharCode2);
	},
	ByteToHex: function(b)
	{
		if(b > 255 || b < 0) throw "Hex byte range is 0-255";
		var s = "";
		s += this.hexChars[(b >>> 4)];
		s += this.hexChars[(b & 0xF)];
		return s;
	},
	hexChars: "0123456789ABCDEF",
	HexCharToHalfByte: function(hexCharCode) {return hexCharCode - (hexCharCode < 58 ? 48 : (hexCharCode < 97 ? 55 : 87));},
	NbrToHex: function(n, nBytes, toLE)
	{
		var s = "";
		
		for(var i = 0; i < nBytes; ++i)
		{
			var ch = this.hexChars.charAt((n>>>4)&0xF), cl = this.hexChars.charAt(n&0xF);
			if(toLE) s = s+ch+cl; else s = ""+ch+cl+s;
			n >>>= 8;
		}
		return s;
	},
	StrToHex: function(s)
	{
		if(!s) return null;
		var h = "";
		for(var i = 0; i < s.length; ++i) h += this.ByteToHex(s.charCodeAt(i));
		return h;
	},
	HexToStr: function(h)
	{
		if(!h) return null;
		var s = "";
		for(var i = 0; i < h.length; i += 2)
			s += String.fromCharCode(this.HexToByte(h.charCodeAt(i), h.charCodeAt(i+1)));
		return s;
	}
}