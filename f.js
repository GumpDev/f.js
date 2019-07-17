var fEventsActive = [];

function f(filter){
    return {
        element : document.querySelector(filter),       
        elements : document.querySelectorAll(filter),

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
        }
    }
}

function fPost(url,post,callback){
    if(url == undefined || callback == undefined || post == undefined){
        console.error("Missing arguments!\n fPost(url,post,callback(data))");
        return;
    }
    var http = new XMLHttpRequest();
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            callback(xhttp.responseText);
        }
    }
    http.send(post);
}