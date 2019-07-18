var fAddonsElement = {};
var fAddonsVariables = {};

function f(filter){
    if(typeof(filter) == "string")
        return {...{
            filter: filter,
            element : document.querySelector(filter),       
            elements : document.querySelectorAll(filter),
            style : document.querySelector(filter).style,

            styleAll : function(style){      
                if(style == undefined){
                    console.error("Missing arguments!\n f(filter).styleAll(style);");
                    return false;
                }
                
                var keys = Object.keys(style);
                for(var x = 0; x < keys.length; x++){
                    for(var i = 0; i < this.elements.length; i++){
                        eval("f('#"+this.elements[i].id+"').style."+keys[x]+" = '"+style[keys[x]]+"'");
                    }
                }
            },

            only : function(letters){           
                if(letters == undefined){
                    console.error("Missing arguments!\n f(filter).only(letters);");
                    return false;
                }

                for(var i = 0; i < this.elements.length; i++){
                    this.elements[i].addEventListener("keypress",function(e){   
                        if(!letters.includes(e.key))
                            e.preventDefault();
                    });
                }
            },

            html : function(html){
                if(html == undefined){
                    var returnTxt = [];
                    for(var i = 0; i < this.elements.length; i++){
                        if(this.elements.length == 1)
                            returnTxt = this.elements[i].innerHTML;
                        else
                            returnTxt.push(this.elements[i].innerHTML);
                    }
                    return returnTxt;
                }else{
                    for(var i = 0; i < this.elements.length; i++){
                        this.elements[i].innerHTML = html;
                    }
                }
            },

            text : function(text){
                if(text == undefined){
                    var returnTxt = [];
                    for(var i = 0; i < this.elements.length; i++){
                        if(this.elements.length == 1)
                            returnTxt = this.elements[i].innerText;
                        else
                            returnTxt.push(this.elements[i].innerText);
                    }
                    return returnTxt;
                }else{
                    for(var i = 0; i < this.elements.length; i++){
                        this.elements[i].innerText = text;
                    }
                }
            },

            value : function(value){
                if(value == undefined){
                    var returnTxt = [];
                    for(var i = 0; i < this.elements.length; i++){
                        if(this.elements.length == 1)
                            returnTxt = this.elements[i].value;
                        else
                            returnTxt.push(this.elements[i].value);
                    }
                    return returnTxt;
                }else{
                    for(var i = 0; i < this.elements.length; i++){
                        this.elements[i].value = value;
                    }
                }
            },

            post : function(value,url,post){     
                if(value == undefined || url == undefined){
                    console.error("Missing arguments!\n f(filter).post(value,url,post);");
                    return false;
                }

                if(post == undefined)
                    post = {};

                value = value.toLowerCase();

                fPost(url,post,function(data){
                    if(value == "html")
                        f(filter).html(data);
                    else if(value == "text")
                        f(filter).text(data);
                    else
                        f(filter).value(data);
                });
            },
            
            get : function(value,url,get){     
                if(value == undefined || url == undefined){
                    console.error("Missing arguments!\n f(filter).get(value,url,get);");
                    return false;
                }

                if(post == undefined)
                    post = {};

                value = value.toLowerCase();

                fGet(url,get,function(data){
                    if(value == "html")
                        f(filter).html(data);
                    else if(value == "text")
                        f(filter).text(data);
                    else
                        f(filter).value(data);
                });
            },

            event : function(event,callback){
                if(event == undefined || callback == undefined){
                    console.error("Missing arguments!\n f(filter).event(event,callback)");
                    return;
                }
                for(var i = 0; i < this.elements.length; i++)
                    this.elements[i].addEventListener(event,function(e){   
                        if(e == undefined)
                            callback();
                        else
                            callback(e);
                    });
            },

            show : function(type){
                if(type == undefined)
                    type = "inline-block";

                for(var i = 0; i < this.elements.length; i++)
                    this.elements[i].style.display = type;
            },

            hide : function(){
                for(var i = 0; i < this.elements.length; i++)
                    this.elements[i].style.display = "none";
            },

            toggle : function(type){
                if(type == undefined)
                    type = "inline-block";

                for(var i = 0; i < this.elements.length; i++){
                    if(this.element[i].style.display == type)
                        this.elements[i].style.display = "none";
                    else
                        this.elements[i].style.display = type;
                }
            },

            mask : function (mask){
                if(mask == undefined){
                    console.error("Missing arguments!\n f(filter).mask(mask)");
                    return;
                }

                this.event('keypress',(e)=>{
                    var masked = mask;
                    var key = e.key;
                    var elem = e.target;

                    e.preventDefault();

                    if("1234567890".includes(e.key)){

                        var selected = elem.selectionStart;
                        
                        while(masked[selected] != "_"){
                            if(selected < elem.value.length)
                                selected++;
                            else
                                return;
                        }

                        var txt = "";
                        for(var i = 0; i < elem.value.length; i++){
                            if(i == selected)
                                txt += key;
                            else
                                txt += elem.value[i];
                        }
                        elem.value = txt;

                        elem.selectionStart = selected+1;
                        elem.selectionEnd =selected+1;

                    }
                    //Sistema de apagar
                });

                this.event('keydown',(e)=>{
                    var masked = mask;
                    var elem = e.target;
                    var selectedStart = elem.selectionStart;
                    var selectedEnd = elem.selectionEnd;

                    if(e.code == "Backspace"){
                        if(selectedStart != 0 || selectedStart != selectedEnd){
                            var txt = "";
                            for(var i = 0; i < elem.value.length; i++){
                                if(selectedStart == selectedEnd){
                                    if(elem.selectionStart - 1 == i)
                                        txt += mask[i];
                                    else
                                        txt += elem.value[i];
                                }else{
                                    if(selectedStart <= i && i < selectedEnd)
                                        txt += mask[i];
                                    else
                                        txt += elem.value[i];
                                }
                            }
                            elem.value = txt;
                            if(selectedStart == selectedEnd){
                                elem.selectionStart = selectedStart - 1;
                                elem.selectionEnd = selectedStart - 1;
                            }else{
                                elem.selectionStart = selectedStart;
                                elem.selectionEnd = selectedStart;
                            }
                        }
                        e.preventDefault();
                    }

                    if(e.code == "Delete"){
                        if(selectedStart != 0 || selectedStart != selectedEnd){
                            var txt = "";
                            for(var i = 0; i < elem.value.length; i++){
                                if(selectedStart == selectedEnd){
                                    if(elem.selectionStart == i)
                                        txt += mask[i];
                                    else
                                        txt += elem.value[i];
                                }else{
                                    if(selectedStart <= i && i < selectedEnd)
                                        txt += mask[i];
                                    else
                                        txt += elem.value[i];
                                }
                            }
                            elem.value = txt;
                            if(selectedStart == selectedEnd){
                                elem.selectionStart = selectedEnd + 1;
                                elem.selectionEnd = selectedEnd + 1;
                            }else{
                                elem.selectionStart = selectedEnd;
                                elem.selectionEnd = selectedEnd;
                            }
                        }
                        e.preventDefault();
                    }
                });

                this.value(mask);
            },

            maskIsFilled : function(){
                var ret = true;
                for(var i =0; i < this.elements.length; i++){
                    if(this.elements[i].value.includes("_"))
                        ret = false;
                }
                return ret;
            }

        }, ...fAddonsElement};
    else
        return {...{
            variable: filter,
            
            index : function (value){
                if(value == undefined){
                    console.error("Missing arguments!\n f(object).index(value)");
                    return;
                }
                
                if(typeof(filter) != "object"){
                    console.error("Wrong Type!\n f(object).index(value)");
                    return;
                }
                
                var result = [];

                if(filter.constructor == Array){
                    for(var i = 0; i < filter.length; i++){
                        if(filter[i] == value)
                            result.push(i);
                    }
                }else{
                    var keys = Object.keys(filter);
                    for(var i = 0; i < keys.length; i++){
                        if(filter[keys[i]] == value){
                            result.push(keys[i]);
                        }
                    }
                }
                return result;
            },
            byteToBits : function(){
                if(typeof(filter) != "number"){
                    console.error("Wrong Type!\n f(number).byteToBits()");
                    return;
                }

                return parseInt(filter / 8);
            },
            bitSuffix : function (start){
                if(typeof(filter) != "number"){
                    console.error("Wrong Type!\n f(number).bitSuffix(start)");
                    return;
                }

                var suffixSelected = 0;
                var value = filter;
                var suffix = ['B','KB','MB','GB','TB','PB'];
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

        }, ...fAddonsVariables};
}

function fInit (callback){
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

function fPost(url,post,callback){
    if(url == undefined || callback == undefined || post == undefined){
        console.error("Missing arguments!\n fPost(url,post,callback(data))");
        return;
    }
    
    var post_name = "";
    if(typeof(post) != "string"){
        var post_keys = Object.keys(post);
        for(var i = 0; i < post_keys.length; i++){
            if(i != 0) post_name += "&";
            
            post_name += post_keys[i] + "=" + post[post_keys[i]];
        }
    }else
        post_name = post;

    var http = new XMLHttpRequest();
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            callback(http.responseText);
        }
    }
    http.send(post_name);
}

function fGet(url,get,callback){
    if(url == undefined){
        console.error("Missing arguments!\n fPost(url,post,callback(data))");
        return;
    }

    if(get == undefined)
        get = "";

    if(callback == undefined)
        callback = function(){};
    
    var get_name = "";
    if(typeof(get) != "string"){
        var get_keys = Object.keys(get);
        for(var i = 0; i < get_keys.length; i++){
            if(i != 0) get_name += "&";
            get_name += get_keys[i] + "=" + get[get_keys[i]];
        }
    }else
        get_name = get;

    var http = new XMLHttpRequest();
    http.open('GET', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            callback(http.responseText);
        }
    }
    http.send(get_name);
}