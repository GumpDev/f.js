var fAddonsElement = {};
var fAddonsVariables = {};

function f(filter){
    if(typeof(filter) == "string")
        return {...{
            filter      : filter,
            status      : document.querySelectorAll(filter).length > 0 ? "ok" : "error",
            searched    : document.querySelectorAll(filter).length,
            element     : document.querySelector(filter),       
            elements    : document.querySelectorAll(filter),
            style       : document.querySelector(filter) != null ? document.querySelector(filter).style : null,

            css : function(style){      
                if(style == undefined){
                    console.error("Missing arguments!\n f(filter).css(style);");
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

            html : function(html,json){
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
                    if(json == true){
                        for(var i = 0; i < this.elements.length; i++){
                            this.elements[i].innerHTML = html[this.elements[i].id] != undefined ? html[this.elements[i].id] : "";
                        }
                    }else{
                        for(var i = 0; i < this.elements.length; i++){
                            this.elements[i].innerHTML = html;
                        }
                    }
                }
            },

            text : function(text,json){
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
                    if(json == true){
                        for(var i = 0; i < this.elements.length; i++){
                            this.elements[i].innerText = text[this.elements[i].id] != undefined ? text[this.elements[i].id] : "";
                        }
                    }else{
                        for(var i = 0; i < this.elements.length; i++){
                            this.elements[i].innerText = text;
                        }
                    }
                }
            },

            value : function(value,json){
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
                    if(json == true){
                        for(var i = 0; i < this.elements.length; i++){
                            this.elements[i].value = value[this.elements[i].id] != undefined ? value[this.elements[i].id] : "";
                        }
                    }else{
                        for(var i = 0; i < this.elements.length; i++){
                            this.elements[i].value = value;
                        }
                    }
                }
            },

            post : function(value,url,post,json){     
                if(value == undefined || url == undefined){
                    console.error("Missing arguments!\n f(filter).post(value,url,post);");
                    return false;
                }

                if(post == undefined)
                    post = {};

                value = value.toLowerCase();

                fPost(url,post,function(data){
                    if(value == "html")
                        f(filter).html(data,json);
                    else if(value == "text")
                        f(filter).text(data,json);
                    else
                        f(filter).value(data,json);
                },true);
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
                        f(filter).html(data,json);
                    else if(value == "text")
                        f(filter).text(data,json);
                    else
                        f(filter).value(data,json);
                },true);
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
                    if(this.elements[i].style.display == "none")
                        this.elements[i].style.display = type;
                    else
                        this.elements[i].style.display = "none";
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
            },
            
            setInputType : function(type,options){
                if(type == undefined){
                    console.error("Missing arguments!\n f(filter).setInputType(type)");
                    return;
                }
                if(options == undefined) options = {};

                switch(type.toLowerCase()){
                    //Autocomplete
                    //Calendar
                    //Color
                    //Date
                    //DateTime
                    //Time
                    //Option Checkbox
                    case 'tags':
                        for(var i = 0; i < this.elements.length; i++){
                            this.elements[i].type = "hidden";
                            this.elements[i].value = "";

                            if(f("#fTag_"+this.elements[i].id).status == "ok") f("#fTag_"+this.elements[i].id).element.remove();
                            
                            var div = document.createElement("div");
                            div.className = "fTags";
                            div.id = "fTag_"+this.elements[i].id;
                            if(options['width'] != undefined)
                                div.style.width = options['width'];
                            this.elements[i].parentElement.appendChild(div);

                            var div2 = document.createElement("div");
                            div2.className = "fTags_itens";
                            div2.id = "fTag_itens_"+this.elements[i].id;
                            div.appendChild(div2);
                            
                            var input = document.createElement("input");
                            input.type = "text";
                            input.className = "fTags_input";
                            input.id = "fTag_input_"+this.elements[i].id;
                            if(options['height'] != undefined)
                                input.style.fontSize = options['height'];
                            div.appendChild(input);
                            if(options['only'] != undefined)
                                f("#fTag_input_"+this.elements[i].id).only(options['only']);

                            f("#"+input.id).only("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZÇç");
                            
                            div.addEventListener("click",function(){input.focus();});

                            f("#fTag_input_"+this.elements[i].id).event('keydown',function(e){
                                if(e.key == "Backspace" && f("#"+e.target.id.split("_")[2]).element.value.length > 0 && e.target.value.length < 1){
                                    var val = f("#"+e.target.id.split("_")[2]).element.value.split(',')[f("#"+e.target.id.split("_")[2]).element.value.split(',').length - 1];
                                    f("#"+e.target.id.split("_")[2]).dropTagValue(val);
                                    return;
                                }
                            });

                            f("#fTag_input_"+this.elements[i].id).event('keypress',(e)=>{
                                var x = f("#fTag_input_"+this.element.id).element.value.split(" ").length;
                                var y = f("#fTag_input_"+this.element.id).element.value.length;

                                if((e.key == "Enter" || e.key == " " || e.key == "," )&& f("#fTag_input_"+this.element.id).element.value.length > 0 && x <= y){
                                    e.preventDefault();
                                    var results = this.element.value.split(","); 
                                    if(!results.includes(f("#fTag_input_"+this.element.id).element.value)){
                                        //ToAdd = f().addTagValue(id);
                                        if(this.element.value != "")
                                            this.element.value += "," + f("#fTag_input_"+this.element.id).element.value;
                                        else
                                            this.element.value += f("#fTag_input_"+this.element.id).element.value;

                                        var span = document.createElement("span");
                                        
                                        span.id = 'fTag_X_'+this.element.id+"_"+f('#fTag_input_'+this.element.id).element.value;
                                        span.className = "fTags_span";
                                        span.innerText = f("#fTag_input_"+this.element.id).element.value;

                                        span.innerHTML += "<span onclick='f(\"#"+this.element.id+"\").dropTagValue(\""+f('#fTag_input_'+this.element.id).element.value+"\")' class='fTag_X'>x</span>";
                                        div2.appendChild(span);

                                        f("#fTag_input_"+this.element.id).element.value = "";
                                    }
                                }
                            });
                        } //Colocar Function para adiconar TagValue(pode ser excluido ou não)
                    break;
                }
            },

            dropTagValue : function (valor){
                var arrDrop = this.element.value.split(",");
                for(var i = 0; i < arrDrop.length; i++){
                    if(arrDrop[i] == valor){
                        arrDrop.splice(i ,1);
                        this.element.value = arrDrop.join(",");
                        f("#fTag_X_"+this.element.id+"_"+valor).element.remove();
                    }
                }
            }

            //Calendar
            //CalendarEvents

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

function fPost(url,post,callback,json){
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
            if(json)
                callback(JSON.parse(http.responseText));
            else
                callback(http.responseText);
        }
    }
    http.send(post_name);
}

function fGet(url,get,callback,json){
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
            if(json)
                callback(JSON.parse(http.responseText));
            else
                callback(http.responseText);
        }
    }
    http.send(get_name);
}