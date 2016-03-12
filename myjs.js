
(function(w){
        var  Myjs = function(){

        }
        Myjs.prototype = {         
            //extend 方法扩展    
            extend: function(){
                var key , i = 0,len = arguments.length,target = null,copy;
                if(len ===0){//参数长度为0，返回空
                    return ;
                }else if(len ===1 ){//参数长度为1，返回这个参数
                    target = this;
                }else {//参数长度大于1，把第二个开始的参数的值都赋给第一个参数
                    i++;
                    target = arguments[0];
                }
                for(i = i;i<len;i++){
                    for(key in arguments[i]){
                        target[key] = arguments[i][key];

                    }
                }
                return target;
            },
            ////extend方法     把obj2的内容复制给obj1 简单extend  拷贝
            extendSimp:function(tar,source) {
                //遍历对象
                for(var i in source){
                    tar[i] = source[i];
                }
                return tar;
            }
        }

        // 实例化
        myjs = new Myjs();

        // 选择 框架
        myjs.extend(myjs,{
            //id
            id:function (str) {
                return document.getElementById(str);
            },
            //tag 缩小范围 隔离法则
            tag:function(tName,id){
                var dom = myjs.isStringType(id) ? myjs.id(id) : id;
                return dom ? dom.getElementsByTagName(tName) : document.getElementsByTagName(tName);
               },
            //缩小范围 隔离法则
            classEles: function (name,id){
                var dom = myjs.isStringType(id) ? myjs.id(id) : id;
                dom = dom ? dom : document;
                if(document.getElementsByClassName){
                    return dom.getElementsByClassName(name);
                }else {
                    // 获取所有元素
                    var eles = dom.getElementsByTagName("*");
                    var arr = [],arrEles = [];
                    // 获取符合条件的元素 
                    for(var i = 0 ,len = eles.length ; i< len ;i++){
                        //如果有多个类名   应该是把多个类名放在数组中  在比较
                        arrEles = eles[i].className.split(" ");
                        for(var j = 0 , len2 = arrEles.length ; j< len2 ;j ++){
                            if(arrEles[j] == name) {
                                arr.push(eles[i]);
                            }
                        }               
                    }
                    return arr;
                }   
            },
            // 多组选择器
            group: function (str){
                // 定义一个空数组
                var arr = [],list=[];
                // 把拿到的字符串 分割成数组
                var str = myjs.trim(str).split(',');
                // 遍历得到的数组
                for(var i = 0 ,len = str.length ; i< len ;i++){
                    var charA = myjs.trim(str[i]).charAt(0);
                    if(charA === '#'){
                        // 通过id 获取元素
                        arr.push(myjs.id(myjs.trim(str[i]).slice(1)));
                    }else if(charA === "."){
                        // 通过类名获取元素
                        list = myjs.classEles(myjs.trim(str[i]).slice(1));
                        // // 把伪数组转成数组
                        // list = Array.prototype.slice.call(list);
                        // // 把数组加进最终数组
                        // Array.prototype.push.apply(arr,list);
                        pushArray(list);
                    }else {
                        // 通过标签获取元素
                        list =  myjs.tag(myjs.trim(str[i]));
                        // // 把伪数组转成数组
                        // list = Array.prototype.slice.call(list);
                        // // 把数组加进最终数组
                        // Array.prototype.push.apply(arr,list);
                        pushArray(list);
                    }
                }
                // 把list数组 push进arr
                function pushArray(list){
                    for(var i = 0 , len = list.length ; i< len ; i++) {
                        arr.push(list[i]);
                    }
                }
                return arr;
            },
            // 层次选择
            cengci: function (str){
                var str = myjs.trim(str).split(" ");
                var result = [],list = [],context = [];
                for(var i = 0 , strlen = str.length; i< strlen; i++){
                    // 每次循环 清空result
                    result =[];
                    var demo = myjs.trim(str[i]);
                    var a = demo.charAt(0);
                    var name = demo.slice(1);         
                    if(a==="#"){
                        // id
                        result.push(myjs.id(name));
                        context = result;
                    }else if(a === "."){
                        // class
                        if(context.length){
                            for(var j = 0 ,len = context.length ; j< len ;j++){
                                pushArry(myjs.classEles(name,context[j]));
                            }
                        }else {
                            // 判断是否是第一个
                            pushArry(myjs.classEles(name));
                        }
                        context = result;
                    }else {
                        // 标签
                        if(context.length){
                            for(var j = 0 , len = context.length ; j<len ;j++){
                                pushArry(myjs.tag(demo,context[j]));
                            }
                        }else {
                            // 判断是否是第一个
                            pushArry(myjs.tag(demo));
                        }
                        context = result;

                    }
                   // console.log(context);
                }

                function pushArry(list){
                    //result = [];
                    for(var k = 0 , len = list.length ;k < len ;k++){
                        result.push(list[k]);
                    }
                }
                return context;
            },
            // 多组和层次的组合选择
            groupLevel : function(str){
                var str = myjs.trim(str).split(",");
                var result = [] ,list = [];
                for( var i = 0 ,len = str.length ; i< len;i++){
                    pushArray($cengci(str[i]));
                    // console.log(result);
                }
                return result;
                function pushArray(list){
                    for(var i = 0 , len = list.length ;i< len ;i++){
                        result.push(list[i]);
                    }
                }
            },
            //html5实现的选择器
            all:function(selector,context){
                context = context || document;
                return  context.querySelectorAll(selector);
            },
        });
        // 属性框架
        myjs.extend(myjs,{
            // 添加类名
            addClass: function(content,name){
                var content = myjs.isStringType(content) ? myjs.all(content) : content;
                var doms = [];
                if(content.length){
                    pushArray(content);
                }else {
                    doms.push(content);
                }
                for(var i = 0 , len = doms.length ; i < len ;i++){
                   // console.log((" "+doms[i].className+" ").indexOf(" "+name+" "));
                    if(-1 == (" "+doms[i].className+" ").indexOf(" "+name+" "))
                        addOneClass(doms[i],name);
                }
                function addOneClass(dom,name){
                    dom.className += " " + name;
                }
                function pushArray(list){
                    for(var i = 0 ,lenL = list.length ;i <lenL ; i++){
                        doms.push(list[i]);
                    }
                }
            },
            // 如果添加的类名是一个数组
            addClasses:function(content,name){
                var content = myjs.isStringType(content) ? myjs.all(content) : content;
                var doms = [];
                if(content.length){
                    pushArray(content);
                }else {
                    doms.push(content);
                }
                for(var i = 0 , len = doms.length ; i < len ;i++){
                    //console.log(doms[i].className.indexOf(name[i]));
                    // 只有在该属性不存在的时候才添加
                    if(-1 === " "+doms[i].className+" ".indexOf(" "+name[i])+" ")
                        addOneClass(doms[i],name[i]);
                }
                // 单个元素类名的添加
                function addOneClass(dom,name){
                    dom.className += " " + name;
                }
                function pushArray(list){
                    for(var i = 0 ,lenL = list.length ;i <lenL ; i++){
                        doms.push(list[i]);
                    }
                }
            },
            // 去除类名
            removeClass:function(content,name){
                var content = myjs.isStringType(content) ? myjs.all(content) : content;
                var doms = [];
                if(content.length){
                    pushArray(content);
                }else {
                    doms.push(content);
                }
                for(var i = 0 , len = doms.length ; i < len ;i++){
                    // 如果存在类名则删除
                    if(-1 != " "+doms[i].className+" ".indexOf(" "+name[i])+" ")
                        removeOneClass(doms[i],name);
                }
                // 单个元素类名的去除
                function removeOneClass(dom,name){
                    dom.className = (" "+dom.className+" ").replace(" "+name+" ","");   
                }
                function pushArray(list){
                    for(var i = 0 ,lenL = list.length ;i <lenL ; i++){
                        doms.push(list[i]);
                    }
                }
            },
            // 判断是否有指定类名
            hasClass: function(content,name){
                var content = myjs.isStringType(content) ? myjs.all(content) : content;
                var doms = [];
                var flage = true;
                if(content.length){
                    pushArray(content);
                }else {
                    doms.push(content);
                }
                for(var i = 0 ,len = doms.length ; i < len ; i++){
                    if(!checkHasCalss(doms[i],name))
                        flage = false;
                }
                // 判断单个元素是否有指定类名
                function checkHasCalss(dom,name){
                    return  -1 < (" "+dom.className+" ").indexOf(" "+name+" ");
                }
                function pushArray(list){
                    for(var i = 0 ,lenL = list.length ;i <lenL ; i++){
                        doms.push(list[i]);
                    }
                }
                return flage;
            },
            // 得到元素所有类名组成的数组
            getClass: function(content){
                var content = myjs.isStringType(content) ? myjs.all(content) : content;
                if(content.length){
                    return myjs.trim(content[0].className).split(" ");
                }else 
                    return myjs.trim(content.className).split(" ");    
            },
            // // 非input元素  设置  获取 html值
            // html: function(content, value){
            //     var content = myjs.isStringType(content) ? myjs.all(content) : content;
            //     var doms = [];
            //     if(content.length){
            //         pushArray(content);
            //     }else {
            //         doms.push(content);
            //     }
            //     if(value){
            //         for(var i = 0 , len = doms.length ; i < len ;i++){
            //             setHtml(doms[i],value);
            //         }
            //     }else {
            //         return doms[0].innerHTML;
            //     }   
            //     function setHtml(dom,value){
            //         dom.innerHTML = value;   
            //     }
            //     function pushArray(list){
            //         for(var i = 0 ,lenL = list.length ;i <lenL ; i++){
            //             doms.push(list[i]);
            //         }
            //     }
            // },
            //  // input元素  设置  获取 html值
            // value: function(content, value){
            //     var content = myjs.isStringType(content) ? myjs.all(content) : content;
            //     var doms = [];
            //     if(content.length){
            //         pushArray(content);
            //     }else {
            //         doms.push(content);
            //     }
            //     if(value){
            //         for(var i = 0 , len = doms.length ; i < len ;i++){
            //             setValue(doms[i],value);
            //         }
            //     }else {
            //         return doms[0].value;
            //     }
            //     function setValue(dom,value){
            //         dom.value = value;   
            //     }
            //     function pushArray(list){
            //         for(var i = 0 ,lenL = list.length ;i <lenL ; i++){
            //             doms.push(list[i]);
            //         }
            //     }
            // },
            // 把html 和 value 组合
            val: function(content ,value){
                var content = myjs.isStringType(content) ? myjs.all(content) : content;
                var doms = [];
                if(content.length){
                    pushArray(content);
                }else {
                    doms.push(content);
                }
                if(value) {
                    for(var i = 0 , len = doms.length ; i < len ;i++){
                        // 如果是input元素
                        if(doms[i].tagName == "INPUT"){
                            setValue(doms[i],value);
                        }else {
                            setHtml(doms[i],value);
                        }                
                    }
                }else {
                    return doms[0].tagName == "INPUT" ? doms[0].value : doms[0].innerHTML;
                }
                function setHtml(dom,value){
                    dom.innerHTML = value;   
                }
                function setValue(dom,value){
                    dom.value = value;   
                }
                function pushArray(list){
                    for(var i = 0 ,lenL = list.length ;i <lenL ; i++){
                        doms.push(list[i]);
                    }
                }
            }
        });
        // css 框架
        myjs.extend(myjs,{
            css:function (context,key,value){
                        //通过all得到的都是数组
                    var dom = myjs.isStringType(context) ? myjs.all(context) : context;
                    // 用来存放  得到的元素（组成数组）
                    var list = [];
                    if(dom.length){
                         pushArray(dom);
                    }else{
                        list.push(dom);
                    }
                    if(value){
                        setStyle(list,key,value);
                    }else{
                        return getStyle(list,key);
                    }
                    function pushArray(dom){
                        for(var i =0 ,len = dom.length;i<len;i++){
                            list.push(dom[i]);
                        }
                    }
                    function getStyle(dom,key){
                        if(dom[0].currentStyle){
                            return dom[0].currentStyle[key];
                        }else{
                            return getComputedStyle(dom[0],null)[key];
                        }
                    }
                    function setStyle(dom,key,value){
                        for(var i = 0 ,len = dom.length ;i < len ;i ++){
                            dom[i].style[key] = value;
                        }
                     }
            },
                // 显示元素
                show: function(content){
                    myjs.css(content,"display","block")
                },
                //隐藏元素
                hide: function(content){
                    myjs.css(content,"display","none");
                },
                //元素高度宽度概述
                //计算方式：clientHeight clientWidth innerWidth innerHeight
                //元素的实际高度+border，也不包含滚动条
                Width:function (id){
                    return $$.$id(id).clientWidth
                },
                Height:function (id){
                    return $$.$id(id).clientHeight
                },
                //元素的滚动高度和宽度
                //当元素出现滚动条时候，这里的高度有两种：可视区域的高度 实际高度（可视高度+不可见的高度）
                //计算方式 scrollwidth
                scrollWidth:function (id){
                    return $$.$id(id).scrollWidth
                },
                scrollHeight:function (id){
                    return $$.$id(id).scrollHeight
                },
                //元素滚动的时候 如果出现滚动条 相对于左上角的偏移量
                //计算方式 scrollTop scrollLeft
                scrollTop:function (id){
                    return $$.$id(id).scrollTop
                },
                scrollLeft:function (id){
                    return $$.$id(id).scrollLeft
                },
                //获取屏幕的高度和宽度
                screenHeight:function (){
                    return  window.screen.height
                },
                screenWidth:function (){
                    return  window.screen.width
                },
                //文档视口的高度和宽度
                wWidth:function (){
                    return document.documentElement.clientWidth
                },
                wHeight:function (){
                    return document.documentElement.clientHeight
                },
                //文档滚动区域的整体的高和宽
                wScrollHeight:function () {
                    return document.body.scrollHeight
                },
                wScrollWidth:function () {
                    return document.body.scrollWidth
                },
                //获取滚动条相对于其顶部的偏移
                wScrollTop:function () {
                    var scrollTop = window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop;
                    return scrollTop
                },
                //获取滚动条相对于其左边的偏移
                wScrollLeft:function () {
                    var scrollLeft = document.body.scrollLeft || (document.documentElement && document.documentElement.scrollLeft);
                    return scrollLeft
                },
                //获取坐标值
                offset:function (id){
                    //获取元素的坐标值
                    function offsetLeft(dom){
                        return dom.offsetLeft
                    }
                    function offsetTop(dom){
                        return dom.offsetTop
                    }
                    var dom = $$.$id(id);
                        return {top:offsetTop(dom),left:offsetLeft(dom)}
                },
                position:function (id){
                    function absolateLeft(id){
                        var dom = $$.$id(id)
                        var left = $$.offset(id).left;
                        var parent = dom.offsetParent;
                        while (parent !== null){
                            left += parent.offsetLeft;
                            parent = parent.offsetParent;
                        }
                        return left;
                    }
                    function absolateTop(id){
                        var dom = $$.$id(id)
                        var top = $$.offset(id).top;
                        var parent = dom.offsetParent;
                        while (parent !== null){
                            top += parent.offsetTop;
                            parent = parent.offsetParent;
                        }
                        return top;
                    }
                    return {top:absolateTop(id),left:absolateLeft(id)}
                }
        });
        // 绑定事件
        myjs.extend(myjs,{
            on:function(id, type, fn){
                //通过ID获取元素
                var dom = myjs.isStringType(id)?myjs.id(id):id;
                //如果支持
                //W3C版本 --火狐 谷歌 等大多数浏览器
                //如果你想检测对象是否支持某个属性，方法，可以通过这种方式
                if(dom.addEventListener ){
                    dom.addEventListener(type, fn, false);
                }else if(dom.attachEvent){
                    //如果支持 --IE
                    dom.attachEvent('on' + type, fn);
                }
            },
            // 解除绑定
            un:function(id, type, fn){
                //var dom = document.getElementById(id);
                var dom = $$.isString(id)?document.getElementById(id):id;
                // 标准
                if(dom.removeEventListener){
                    dom.removeEventListener(type, fn);
                }else if(dom.detachEvent){
                //IE
                    dom.detachEvent(type, fn);
                }
            },
            // 点击
            click: function(id,fn){
                 this.on(id,'click',fn);
            },
            /*鼠标移上*/
            mouseover:function(id,fn){
                this.on(id,'mouseover',fn);
            },
            /*鼠标离开*/
            mouseout:function(id,fn){
                this.on(id,'mouseout',fn);
            },
            // 鼠标进入区域
            mouseenter: function(id,fn){
                this.on(id,'mouseenter',fn);
            },
            mouseleave: function(id,fn){
                this.on(id,'mouseleave',fn);
            },
            /*悬浮*/
            hover : function(id,fnOver,fnOut){
                if(fnOver){
                    this.on(id,"mouseover",fnOver);
                }
                if(fnOut){
                    this.on(id,"mouseout",fnOut);
                }
            },
             //事件基础
            getEvent: function(e){
                return e ? event: window.event;
            },
            // 获取事件目标
            getTarget: function(e){
                var event = this.getEvent(e);
                return event.target || event.srcElement;
            },
            // 防止冒泡
            stopPropagation: function(e){
                var event = this.getEvent(e);
                if(event.stopPropagation){
                    event.stopPropagation();
                }else {
                    event.cancelBubble = true;
                }
            },
            // 阻止默认行为
            preventDefault: function(e){
                var event = this.getEvent(e);
                if(event.preventDefault){
                    event.preventDefault();
                }else {
                    event.returnValue = false;
                }
            },
            delegate: function(pid, eventType, selector, fn) {
                //参数处理
                var parent = this.id(pid);
                function handle(e){
                    var target = myjs.getTarget(e);
                    console.log(target.nodeName)
                    if(target.nodeName.toLowerCase()=== selector || target.id === selector || target.className.indexOf(selector) != -1){
                        // 在事件冒泡的时候，回以此遍历每个子孙后代，如果找到对应的元素，则执行如下函数
                        // 为什么使用call，因为call可以改变this指向
                        // 大家还记得，函数中的this默认指向window，而我们希望指向当前dom元素本身
                        fn.call(target);
                    }
                }
                //当我们给父亲元素绑定一个事件，他的执行顺序：先捕获到目标元素，然后事件再冒泡
                //这里是是给元素对象绑定一个事件
                parent[eventType]=handle;
            }
        });
        // 封装json框架
        myjs.extend(myjs,{
            // 将json转化为字符串
            sjson: function(json){
                return JSON.stringify(json);
            },
            // 将字符串转化为json
            json: function(str){
                return eval(str);
            }
        });
        // 缓存框架－内存篇
        myjs.cache = {
                data:[],
                // 查
                get:function(key){
                    var value = null;
                    for(var i= 0,len=this.data.length;i<len; i++){
                        var item = this.data[i]
                        if (key == item.key) {
                            value = item.value;
                        }
                    }
                   // console.log('get'+value)
                    return value;
                },
                // 增
                add:function(key,value){
                    var json= { key: key, value: value};
                    this.data.push(json);
                },
                // 删
                delete:function(key){
                    var status = false;
                    for(var i= 0,len=this.data.length;i<len; i++){
                        var item = this.data[i]
                        // 循环数组元素
                        if (item.key.trim() == key) {
                            this.data.splice(i, 1);//开始位置,删除个数
                            status = true;
                            break;
                        }
                    }
                    return status;
                },
                // 改
                update:function(key,value){
                    var status = false;
                    // 循环数组元素
                    for(var i= 0,len=this.data.length;i<len; i++){
                        var item = this.data[i]
                        if (item.key.trim() === key.trim()) {
                            item.value = value.trim();
                            status = true;
                            break;
                        }
                    }
                    return status;
                },
                // 判断是否存在
                isExist:function(key){
                    for(var i= 0,len=this.data.length;i<len; i++){
                        var item = this.data[i]
                        if (key === item.key) {
                            return true;
                        }else{
                            return false;
                        }
                    }
                }
        },

        // ajax
        myjs.extend(myjs,{
             myAjax:function(URL,fn){
                var xhr = createXHR();  //返回了一个对象，这个对象IE6兼容。
                xhr.onreadystatechange = function(){
                    if(xhr.readyState === 4){
                        if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){
                            fn(xhr.responseText);
                        }else{
                            alert("错误的文件！");
                        }
                    }
                };
                xhr.open("get",URL,true);
                xhr.send();

                //闭包形式，因为这个函数只服务于ajax函数，所以放在里面
                function createXHR() {
                    //本函数来自于《JavaScript高级程序设计 第3版》第21章
                    if (typeof XMLHttpRequest != "undefined") {
                        return new XMLHttpRequest();
                    } else if (typeof ActiveXObject != "undefined") {
                        if (typeof arguments.callee.activeXString != "string") {
                            var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
                                    "MSXML2.XMLHttp"
                                ],
                                i, len;

                            for (i = 0, len = versions.length; i < len; i++) {
                                try {
                                    new ActiveXObject(versions[i]);
                                    arguments.callee.activeXString = versions[i];
                                    break;
                                } catch (ex) {
                                    //skip
                                }
                            }
                        }

                        return new ActiveXObject(arguments.callee.activeXString);
                    } else {
                        throw new Error("No XHR object available.");
                    }
                }
            }
        });
        // 基本
        myjs.extend(myjs,{
           //去除左边空格
            ltrim:function(str){
                return str.replace(/(^\s*)/g,'');
            },
            //去除右边空格
            rtrim:function(str){
                return str.replace(/(\s*$)/g,'');
            },
            //去除空格
            trim:function(str){
                return str.replace(/(^\s*)|(\s*$)/g,'');
            },
            //简单的数据绑定formateString
            formatString:function(str,data){
                //把str中的@（name）换成data[name]
                return str.replace(/@\((\w+)\)/g, function(match,value){
                    return typeof data[value] === 'undefined'?'':data[value];
                });
            },
            //绑定模版
            BindTemplate:function (data,temid){
                var html = template(temid,data);
                return html;
            },
            //绑定模版  拼接
            bindArtTemplate: function(str,data){
                var render = template.compile(str);
                var html = render(data);
                return html;
            }
        })
        // 数据类型的判断
        myjs.extend(myjs,{
            //判断是否为空
            checkNull: function (str) {
                return (str.length ==0);
            },
            // 判断数值类型：数字
            isNumber: function(val){
                return typeof val ==='number' && isFinite(val);//isFinite() 函数用于检查其参数是否是无穷大
            },
            // 判断数值类型：boolean
            isBooleanType:function(val){
                return typeof val ==='boolean';
            },
            // 判断数值类型：string
            isStringType:function(val){
                return typeof val === 'string';
            },
            //判断变量是不是Undefined
            isUndefined: function(val) {
                return typeof val === "undefined";
            },
            //判断变量是不是对象
            isObj: function(str){
                if(str === null || typeof str === 'undefined'){
                    return false;
                }
                return typeof str === 'object';
            },
            //判断变量是不是null
            isNull:function(val){
                return  val === null;
            },
            //判断变量是不是数组
            isArray: function(val){
                return Object.prototype.toString.call(val) == '[object Array]';
            }
        });
        //数值相关
        myjs.extend(myjs,{
            getRandom: function(begin,end){
                return Math.floor(Math.random()*(end-begin))+begin;
            }
        });
        // 日期相关
        myjs.extend(myjs,{
            dateFormat : function(date,format){
                var o = {
                    "M+" : date.getMonth()+1, //month
                    "d+" : date.getDate(),    //day
                    "h+" : date.getHours(),   //hour
                    "m+" : date.getMinutes(), //minute
                    "s+" : date.getSeconds(), //second
                    "q+" : Math.floor((date.getMonth()+3)/3),  //quarter
                    "S" : date.getMilliseconds() //millisecond
                }
                if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
                        (date.getFullYear()+"").substr(4- RegExp.$1.length));
                for(var k in o)if(new RegExp("("+ k +")").test(format))
                    format = format.replace(RegExp.$1,
                            RegExp.$1.length==1? o[k] :
                                    ("00"+ o[k]).substr((""+ o[k]).length));
                return format;
            }
        });
        //location search封装
        myjs.extend(myjs,{
            //获取location.search的字符串   转为json对象
            queryString: function(){
                var str = window.location.search.substring(1);
                str = str.split("&");
                var json  = {} ;
                for(var i = 0 ;i < str.length;i++){
                    var c = str[i].indexOf("=");
                    if(c == -1) 
                        continue;
                    var d = str[i].substring(0,c);
                    var e = str[i].substring(c+1);
                    json[d] = e;
                }
                return json;
            }
        });
        // 运动形式
        myjs.extend(myjs,{
            eases: {
                    //线性匀速
                    linear:function (t, b, c, d){
                        return (c - b) * (t/ d);
                    },
                    //弹性运动
                    easeOutBounce:function (t, b, c, d) {
                        if ((t/=d) < (1/2.75)) {
                            return c*(7.5625*t*t) + b;
                        } else if (t < (2/2.75)) {
                            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
                        } else if (t < (2.5/2.75)) {
                            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
                        } else {
                            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
                        }
                    },
                    //其他
                    swing: function (t, b, c, d) {
                        return this.easeOutQuad(t, b, c, d);
                    },
                    easeInQuad: function (t, b, c, d) {
                        return c*(t/=d)*t + b;
                    },
                    easeOutQuad: function (t, b, c, d) {
                        return -c *(t/=d)*(t-2) + b;
                    },
                    easeInOutQuad: function (t, b, c, d) {
                        if ((t/=d/2) < 1) return c/2*t*t + b;
                        return -c/2 * ((--t)*(t-2) - 1) + b;
                    },
                    easeInCubic: function (t, b, c, d) {
                        return c*(t/=d)*t*t + b;
                    },
                    easeOutCubic: function (t, b, c, d) {
                        return c*((t=t/d-1)*t*t + 1) + b;
                    },
                    easeInOutCubic: function (t, b, c, d) {
                        if ((t/=d/2) < 1) return c/2*t*t*t + b;
                        return c/2*((t-=2)*t*t + 2) + b;
                    },
                    easeInQuart: function (t, b, c, d) {
                        return c*(t/=d)*t*t*t + b;
                    },
                    easeOutQuart: function (t, b, c, d) {
                        return -c * ((t=t/d-1)*t*t*t - 1) + b;
                    },
                    easeInOutQuart: function (t, b, c, d) {
                        if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
                        return -c/2 * ((t-=2)*t*t*t - 2) + b;
                    },
                    easeInQuint: function (t, b, c, d) {
                        return c*(t/=d)*t*t*t*t + b;
                    },
                    easeOutQuint: function (t, b, c, d) {
                        return c*((t=t/d-1)*t*t*t*t + 1) + b;
                    },
                    easeInOutQuint: function (t, b, c, d) {
                        if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
                        return c/2*((t-=2)*t*t*t*t + 2) + b;
                    },
                    easeInSine: function (t, b, c, d) {
                        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
                    },
                    easeOutSine: function (t, b, c, d) {
                        return c * Math.sin(t/d * (Math.PI/2)) + b;
                    },
                    easeInOutSine: function (t, b, c, d) {
                        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
                    },
                    easeInExpo: function (t, b, c, d) {
                        return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
                    },
                    easeOutExpo: function (t, b, c, d) {
                        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
                    },
                    easeInOutExpo: function (t, b, c, d) {
                        if (t==0) return b;
                        if (t==d) return b+c;
                        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
                        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
                    },
                    easeInCirc: function (t, b, c, d) {
                        return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
                    },
                    easeOutCirc: function (t, b, c, d) {
                        return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
                    },
                    easeInOutCirc: function (t, b, c, d) {
                        if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                        return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
                    },
                    easeInElastic: function (t, b, c, d) {
                        var s=1.70158;var p=0;var a=c;
                        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                        if (a < Math.abs(c)) { a=c; var s=p/4; }
                        else var s = p/(2*Math.PI) * Math.asin (c/a);
                        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                    },
                    easeOutElastic: function (t, b, c, d) {
                        var s=1.70158;var p=0;var a=c;
                        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                        if (a < Math.abs(c)) { a=c; var s=p/4; }
                        else var s = p/(2*Math.PI) * Math.asin (c/a);
                        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
                    },
                    easeInOutElastic: function (t, b, c, d) {
                        var s=1.70158;var p=0;var a=c;
                        if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
                        if (a < Math.abs(c)) { a=c; var s=p/4; }
                        else var s = p/(2*Math.PI) * Math.asin (c/a);
                        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                        return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
                    },
                    easeInBack: function (t, b, c, d, s) {
                        if (s == undefined) s = 1.70158;
                        return c*(t/=d)*t*((s+1)*t - s) + b;
                    },
                    easeOutBack: function (t, b, c, d, s) {
                        if (s == undefined) s = 1.70158;
                        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
                    },
                    easeInOutBack: function (t, b, c, d, s) {
                        if (s == undefined) s = 1.70158;
                        if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
                    },
                    easeInBounce: function (t, b, c, d) {
                        return c - this.easeOutBounce (d-t, 0, c, d) + b;
                    },
                    easeInOutBounce: function (t, b, c, d) {
                        if (t < d/2) return this.easeInBounce (t*2, 0, c, d) * .5 + b;
                        return this.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
                    }
                }

        });
        function Animate(){
                    // 定时器
                    this.timer = null;
                    // 多个物体队列
                    this.queen = [];
                    // 时间间隔
                    this.interval = 16;
                    this.index = 0;
                }
        Animate.prototype = {
            // 定时器
            run: function(){
                var that = this;
                this.timer = setInterval(function(){that.loop()},that.interval);
            },
            // 每次循环运动的move
            move: function(obj){
                var pass = +new Date();
                var tween = this.getTween(obj.now,pass,obj.duration,'easeOutBounce');
                if(tween<1) {
                    this.setManyPropertys(obj.id,obj.styles,tween);                 
                }else {
                    this.stop(obj);
                }
            },
            loop: function(){
                //console.log(this.queen.length)
                for(var i= 0,len=this.queen.length;i<len;i++){
                    this.move(this.queen[i]);
                }
            },
            // 停止 清除定时器
            stop: function(obj){                
                //clearInterval(obj.timer);
                this.setManyPropertys(obj.id,obj.styles,1)
                this.destory(obj)
            },
            // 时间进程
            getTween: function(now,pass,duration,ease){
                // 变速运动
                var eases = {
                    //线性匀速
                    linear:function (t, b, c, d){
                        return (c - b) * (t/ d);
                    },
                    //弹性运动
                    easeOutBounce:function (t, b, c, d) {
                        if ((t/=d) < (1/2.75)) {
                            return c*(7.5625*t*t) + b;
                        } else if (t < (2/2.75)) {
                            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
                        } else if (t < (2.5/2.75)) {
                            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
                        } else {
                            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
                        }
                    },
                    //其他
                    swing: function (t, b, c, d) {
                        return this.easeOutQuad(t, b, c, d);
                    },
                    easeInQuad: function (t, b, c, d) {
                        return c*(t/=d)*t + b;
                    },
                    easeOutQuad: function (t, b, c, d) {
                        return -c *(t/=d)*(t-2) + b;
                    },
                    easeInOutQuad: function (t, b, c, d) {
                        if ((t/=d/2) < 1) return c/2*t*t + b;
                        return -c/2 * ((--t)*(t-2) - 1) + b;
                    },
                    easeInCubic: function (t, b, c, d) {
                        return c*(t/=d)*t*t + b;
                    },
                    easeOutCubic: function (t, b, c, d) {
                        return c*((t=t/d-1)*t*t + 1) + b;
                    },
                    easeInOutCubic: function (t, b, c, d) {
                        if ((t/=d/2) < 1) return c/2*t*t*t + b;
                        return c/2*((t-=2)*t*t + 2) + b;
                    },
                    easeInQuart: function (t, b, c, d) {
                        return c*(t/=d)*t*t*t + b;
                    },
                    easeOutQuart: function (t, b, c, d) {
                        return -c * ((t=t/d-1)*t*t*t - 1) + b;
                    },
                    easeInOutQuart: function (t, b, c, d) {
                        if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
                        return -c/2 * ((t-=2)*t*t*t - 2) + b;
                    },
                    easeInQuint: function (t, b, c, d) {
                        return c*(t/=d)*t*t*t*t + b;
                    },
                    easeOutQuint: function (t, b, c, d) {
                        return c*((t=t/d-1)*t*t*t*t + 1) + b;
                    },
                    easeInOutQuint: function (t, b, c, d) {
                        if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
                        return c/2*((t-=2)*t*t*t*t + 2) + b;
                    },
                    easeInSine: function (t, b, c, d) {
                        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
                    },
                    easeOutSine: function (t, b, c, d) {
                        return c * Math.sin(t/d * (Math.PI/2)) + b;
                    },
                    easeInOutSine: function (t, b, c, d) {
                        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
                    },
                    easeInExpo: function (t, b, c, d) {
                        return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
                    },
                    easeOutExpo: function (t, b, c, d) {
                        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
                    },
                    easeInOutExpo: function (t, b, c, d) {
                        if (t==0) return b;
                        if (t==d) return b+c;
                        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
                        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
                    },
                    easeInCirc: function (t, b, c, d) {
                        return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
                    },
                    easeOutCirc: function (t, b, c, d) {
                        return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
                    },
                    easeInOutCirc: function (t, b, c, d) {
                        if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                        return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
                    },
                    easeInElastic: function (t, b, c, d) {
                        var s=1.70158;var p=0;var a=c;
                        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                        if (a < Math.abs(c)) { a=c; var s=p/4; }
                        else var s = p/(2*Math.PI) * Math.asin (c/a);
                        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                    },
                    easeOutElastic: function (t, b, c, d) {
                        var s=1.70158;var p=0;var a=c;
                        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                        if (a < Math.abs(c)) { a=c; var s=p/4; }
                        else var s = p/(2*Math.PI) * Math.asin (c/a);
                        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
                    },
                    easeInOutElastic: function (t, b, c, d) {
                        var s=1.70158;var p=0;var a=c;
                        if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
                        if (a < Math.abs(c)) { a=c; var s=p/4; }
                        else var s = p/(2*Math.PI) * Math.asin (c/a);
                        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                        return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
                    },
                    easeInBack: function (t, b, c, d, s) {
                        if (s == undefined) s = 1.70158;
                        return c*(t/=d)*t*((s+1)*t - s) + b;
                    },
                    easeOutBack: function (t, b, c, d, s) {
                        if (s == undefined) s = 1.70158;
                        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
                    },
                    easeInOutBack: function (t, b, c, d, s) {
                        if (s == undefined) s = 1.70158;
                        if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
                    },
                    easeInBounce: function (t, b, c, d) {
                        return c - this.easeOutBounce (d-t, 0, c, d) + b;
                    },
                    easeInOutBounce: function (t, b, c, d) {
                        if (t < d/2) return this.easeInBounce (t*2, 0, c, d) * .5 + b;
                        return this.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
                    }
                };
                // 变速运动  end
                var yongshi = pass - now;
                return eases[ease](yongshi,0,1,duration);
            },
            // 设置单属性
            setOneProperty:function(id,name,start,juli,tween){
                if(name == "opacity"){
                    myjs.css(id,name,start+juli*tween);
                }else {
                    myjs.css(id,name,start+juli*tween+"px");
                }
            },
            // 设置多属性
            setManyPropertys: function(id,styles,tween){
                for(var i = 0 ,len1 = styles.length ; i< len1 ;i++){
                    this.setOneProperty(id,styles[i].name,styles[i].start,styles[i].juli,tween);
                }
            },
            // 适配器 把给的json格式转为指定的格式
            adapterOne: function(id,source,duration){
                 var _obj={}
                 _obj.id = id;
                 _obj.duration = duration
                 _obj.now = +new Date();             
                 var target=[];
                 for(var item in source){
                    var json={};
                    //元素属性的起始位置 比如目标元素目前left 100px，希望运动到500px，那么100就是起始位置
                    json.start = parseFloat(myjs.css(id,item))
                    json.juli = parseFloat(source[item]) -json.start;
                    json.name = item
                    target.push(json)
                 }
                 _obj.styles = target;
                 return _obj
            },
            adapter: function(id,json,duration){
                var _obj={}
                _obj = this.adapterOne(id,json,duration)
                this.queen.push(_obj)
            },
            add: function(id,json,duration){
                this.adapter(id,json,duration);
                this.run();
            },
            // 辅助运行动画  比如清除 比如内存回收
            destory: function(obj){
                var that = this;
                //内存优化
                //1 释放队列  -- 数组实现的  -- 就是删除数组
                //哪个物体执行完，我就释放哪个物体所占用的内存
                that.queen.splice(obj.index,1);
                // //2 释放对象的属性和方法
                // for(var i in obj) {
                //     delete obj[i];
                // }
                // //3 释放对象所占用的内存
                // obj = null;
            }
        }
        myjs.animate = new Animate();
        w.myjs1 = w.$$ = myjs;
    })(window);
        