function fImport(js_file){
    if(filter == undefined){
        console.error("Missing arguments!\n fImport(js_file)");
        return;
    }

    var importa = document.createElement("script");
    document.head.appendChild(importa);

    importa.type = "text/javascript";
    importa.src = js_file;
}

function fConvert(toConvert){
    if(toConvert == undefined){
        console.error("Missing arguments!\n fConvert(var)");
        return;
    }
    var result;
    if(typeof(toConvert) == "object"){ 
        result = "";
        for(var i = 0; i < toConvert.length; i++){
            if(i != 0)
                result += ",";

            result += toConvert[i];
        }
    }else{
        if(toConvert.includes(",")){
            result = toConvert.split(",");
        }
    }
    return result;
}

function fGet(url,callback){
    if(url == undefined || callback == undefined){
        console.error("Missing arguments!\n fGet(url,callback)");
        return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(xhttp.responseText);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function fTime(callback,time,times){
    if(callback == undefined || time == undefined){
        console.error("Missing arguments!\n fTime(callback,time,times)");
        return;
    }
    if(times != undefined){
        for(var i = 0; i < times; i++){
            setTimeout(() => {
                callback();
            }, 1000 * time * i);
        }
    }else{
        return setInterval(() => {
            callback();
        }, 1000 * time);
    }
}

function fStop(ft){
    if(ft == undefined){
        console.error("Missing arguments!\n fStop(interval)");
        return;
    }
    clearInterval(ft);
}

function fInit(callback){
    if(callback == undefined){
        console.error("Missing arguments!\n fInit(callback)");
        return;
    }
    window.addEventListener("load",function(){ 
        setTimeout(() => {
            callback();
        }, 100);
    });
}

function fEvent(elem,event,callback){
    if(elem == undefined || event == undefined || callback == undefined){
        console.error("Missing arguments!\n fEvent(element,event,callback)");
        return;
    }
    elem.addEventListener(event,callback(e));
}

function fMask(elem,mask){
    if(elem == undefined || mask == undefined){
        console.error("Missing arguments!\n fMask(element,mask)");
        return;
    }
    elem.addEventListener("keypress",function(e){   
        if(elem.value.length >= mask.length){
            e.preventDefault();
            return;
        }
        if(mask[elem.value.length] != "_"){
            e.preventDefault();
            elem.value += mask[elem.value.length] + e.key;
        }
    });
}

function fIndex(array,value,onlyone){
    if(array == undefined || value == undefined){
        console.error("Missing arguments!\n fIndex(array,value,onlyone)");
        return;
    }
    var result = null;

    if(onlyone == undefined)
        onlyone = false;

    for(var i = 0; i < array.length; i++){
        if(array[i] == value){
            if(result == null)
                result = i;
            else if(onlyone == false)
                result += ","+i;
        }
    }
    if(typeof(result) != "number"){
        return fConvert(result).map(function(item) {
            return parseInt(item);
        });
    }else{
        return result;
    }
}

function fAssoc(array,value,onlyone){
    if(array == undefined || value == undefined){
        console.error("Missing arguments!\n fAssoc(array,value,onlyone)");
        return;
    }
    var result = null;
    var keys = Object.keys(array);

    if(onlyone == undefined)
        onlyone = false;

    for(var i = 0; i < keys.length; i++){
        if(array[keys[i]] == value){
            if(result == null)
                result = keys[i];
            else if(onlyone == false)
                result += ","+keys[i];
        }
    }
    if(result.includes(",")){
        return fConvert(result);
    }else{
        return result;
    }
}

function fByteConvert(byte,start){
    if(byte == undefined){
        console.error("Missing arguments!\n fByteConvert(value,start)");
        return;
    }

    var suffixSelected = 0;
    var value = byte;
    var suffix = ['B','KB','MB','GB','TB'];
    if(start != undefined){
        for(var i = 0; i < suffix.length;i++){
            if(suffix[i].toUpperCase() == start.toUpperCase()){
                suffixSelected = i;
                break;
            }
        }
    }
    if(suffixSelected > 0 && value < 1){
        value = value * 1024;
        suffixSelected--;
    }else{
        while(value >= 1024){
            value = value / 1024;
            suffixSelected++;
        }
    }
    if(value.toString().includes('.'))
        return value.toFixed(2) + suffix[suffixSelected];
    else
        return value.toFixed(0) + suffix[suffixSelected];
}   

function fRead(file,callback)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                callback(allText);
            }
        }
    }
    rawFile.send(null);
}