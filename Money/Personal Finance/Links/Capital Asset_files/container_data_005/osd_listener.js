(function(){var l,aa="function"==typeof Object.create?Object.create:function(a){var b=function(){};b.prototype=a;return new b},ba;if("function"==typeof Object.setPrototypeOf)ba=Object.setPrototypeOf;else{var ca;a:{var da={Sa:!0},ea={};try{ea.__proto__=da;ca=ea.Sa;break a}catch(a){}ca=!1}ba=ca?function(a,b){a.__proto__=b;if(a.__proto__!==b)throw new TypeError(a+" is not extensible");return a}:null}var fa=ba,ha=function(a,b){a.prototype=aa(b.prototype);a.prototype.constructor=a;if(fa)fa(a,b);else for(var c in b)if("prototype"!=c)if(Object.defineProperties){var d=Object.getOwnPropertyDescriptor(b,c);d&&Object.defineProperty(a,c,d)}else a[c]=b[c];a.vb=b.prototype},ia="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)},m="undefined"!=typeof window&&window===this?this:"undefined"!=typeof global&&null!=global?global:this,ja=function(){ja=function(){};m.Symbol||(m.Symbol=ka)},ka=function(){var a=0;return function(b){return"jscomp_symbol_"+(b||"")+a++}}(),ma=function(){ja();var a=m.Symbol.iterator;a||(a=m.Symbol.iterator=m.Symbol("iterator"));"function"!=typeof Array.prototype[a]&&ia(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return la(this)}});ma=function(){}},la=function(a){var b=0;return na(function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}})},na=function(a){ma();a={next:a};a[m.Symbol.iterator]=function(){return this};return a},oa=function(a){ma();var b=a[Symbol.iterator];return b?b.call(a):la(a)},p=function(a){if(!(a instanceof Array)){a=oa(a);for(var b,c=[];!(b=a.next()).done;)c.push(b.value);a=c}return a},pa=function(a){if(a){for(var b=m,c=["String","prototype","endsWith"],d=0;d<c.length-1;d++){var e=c[d];e in b||(b[e]={});b=b[e]}c=c[c.length-1];d=b[c];a=a(d);a!=d&&null!=a&&ia(b,c,{configurable:!0,writable:!0,value:a})}};pa(function(a){return a?a:function(a,c){if(null==this)throw new TypeError("The 'this' value for String.prototype.endsWith must not be null or undefined");if(a instanceof RegExp)throw new TypeError("First argument to String.prototype.endsWith must not be a regular expression");var b=this+"";a+="";void 0===c&&(c=b.length);c=Math.max(0,Math.min(c|0,b.length));for(var e=a.length;0<e&&0<c;)if(b[--c]!=a[--e])return!1;return 0>=e}});var r=this,t=function(a){return"string"==typeof a},u=function(a){return"number"==typeof a},qa=function(){},ra=function(a){a.ea=void 0;a.a=function(){return a.ea?a.ea:a.ea=new a}},v=function(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==b&&"undefined"==typeof a.call)return"object";return b},sa=function(a){var b=v(a);return"array"==b||"object"==b&&"number"==typeof a.length},ta=function(a){var b=typeof a;return"object"==b&&null!=a||"function"==b},ua=function(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var b=c.slice();b.push.apply(b,arguments);return a.apply(this,b)}},w=function(a,b){a=a.split(".");var c=r;a[0]in c||!c.execScript||c.execScript("var "+a[0]);for(var d;a.length&&(d=a.shift());)a.length||void 0===b?c=c[d]&&c[d]!==Object.prototype[d]?c[d]:c[d]={}:c[d]=b};var va=function(a,b,c,d,e){if(e)c=a+("&"+b+"="+c);else{var f="&"+b+"=",g=a.indexOf(f);0>g?c=a+f+c:(g+=f.length,f=a.indexOf("&",g),c=0<=f?a.substring(0,g)+c+a.substring(f):a.substring(0,g)+c)}return 2E3<c.length?void 0!==d?va(a,b,d,void 0,e):a:c};var y=function(a,b){for(var c=a.length,d=t(a)?a.split(""):a,e=0;e<c;e++)e in d&&b.call(void 0,d[e],e,a)},wa=function(a,b){for(var c=a.length,d=[],e=0,f=t(a)?a.split(""):a,g=0;g<c;g++)if(g in f){var h=f[g];b.call(void 0,h,g,a)&&(d[e++]=h)}return d},xa=function(a){for(var b=["GoogleActiveViewClass","GoogleActiveViewElement"],c=b.length,d=Array(c),e=t(b)?b.split(""):b,f=0;f<c;f++)f in e&&(d[f]=a.call(void 0,e[f],f,b));return d},ya=function(a,b){var c=[];y(a,function(d,e){c=b.call(void 0,c,d,e,a)});return c},za=function(a,b){for(var c=a.length,d=t(a)?a.split(""):a,e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a))return!0;return!1},z=function(a,b){a:if(t(a))a=t(b)&&1==b.length?a.indexOf(b,0):-1;else{for(var c=0;c<a.length;c++)if(c in a&&a[c]===b){a=c;break a}a=-1}return 0<=a},Aa=function(a){return Array.prototype.concat.apply([],arguments)},Ba=function(a){var b=a.length;if(0<b){for(var c=Array(b),d=0;d<b;d++)c[d]=a[d];return c}return[]},Ca=function(a,b,c){return 2>=arguments.length?Array.prototype.slice.call(a,b):Array.prototype.slice.call(a,b,c)},Da=function(a){for(var b=[],c=0;c<arguments.length;c++){var d=arguments[c];if("array"==v(d))for(var e=0;e<d.length;e+=8192)for(var f=Da.apply(null,Ca(d,e,e+8192)),g=0;g<f.length;g++)b.push(f[g]);else b.push(d)}return b};var Ea=function(a){return/^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1]},B=function(a){return-1!=A.indexOf(a)},Ga=String.prototype.repeat?function(a,b){a.repeat(b)}:function(){},C=function(a,b){a=String(a);var c=a.indexOf(".");-1==c&&(c=a.length);Ga("0",Math.max(0,b-c))},Ja=function(){var a=Ha(),b=0;a=Ea(String(a)).split(".");for(var c=Ea("11").split("."),d=Math.max(a.length,c.length),e=0;0==b&&e<d;e++){var f=a[e]||"",g=c[e]||"";do{f=/(\d*)(\D*)(.*)/.exec(f)||["","","",""];g=/(\d*)(\D*)(.*)/.exec(g)||["","","",""];if(0==f[0].length&&0==g[0].length)break;b=Ia(0==f[1].length?0:parseInt(f[1],10),0==g[1].length?0:parseInt(g[1],10))||Ia(0==f[2].length,0==g[2].length)||Ia(f[2],g[2]);f=f[3];g=g[3]}while(0==b)}return b},Ia=function(a,b){return a<b?-1:a>b?1:0},Ka=function(a){var b=Number(a);return 0==b&&/^[\s\xa0]*$/.test(a)?NaN:b},La=function(a){return String(a).replace(/([A-Z])/g,"-$1").toLowerCase()};var A;a:{var Ma=r.navigator;if(Ma){var Na=Ma.userAgent;if(Na){A=Na;break a}}A=""}var Oa=function(a){for(var b=/(\w[\w ]+)\/([^\s]+)\s*(?:\((.*?)\))?/g,c=[],d;d=b.exec(a);)c.push([d[1],d[2],d[3]||void 0]);return c};var Pa=function(a,b){for(var c in a)b.call(void 0,a[c],c,a)},Qa=function(a,b){return null!==a&&b in a};var Ra=function(){return B("Trident")||B("MSIE")},Sa=function(){return(B("Chrome")||B("CriOS"))&&!B("Edge")},Ha=function(){function a(a){a:{var b=d;for(var e=a.length,h=t(a)?a.split(""):a,k=0;k<e;k++)if(k in h&&b.call(void 0,h[k],k,a)){b=k;break a}b=-1}return c[0>b?null:t(a)?a.charAt(b):a[b]]||""}var b=A;if(Ra())return Ta(b);b=Oa(b);var c={};y(b,function(a){c[a[0]]=a[1]});var d=ua(Qa,c);return B("Opera")?a(["Version","Opera"]):B("Edge")?a(["Edge"]):Sa()?a(["Chrome","CriOS"]):(b=b[2])&&b[1]||""},Ta=function(a){var b=/rv: *([\d\.]*)/.exec(a);if(b&&b[1])return b[1];b="";var c=/MSIE +([\d\.]+)/.exec(a);if(c&&c[1])if(a=/Trident\/(\d.\d)/.exec(a),"7.0"==c[1])if(a&&a[1])switch(a[1]){case "4.0":b="8.0";break;case "5.0":b="9.0";break;case "6.0":b="10.0";break;case "7.0":b="11.0"}else b="7.0";else b=c[1];return b};var Ua=function(a){Ua[" "](a);return a};Ua[" "]=qa;var Va=Ra(),Wa=B("Macintosh"),Xa=B("Windows"),Ya=B("Android"),Za=B("iPhone")&&!B("iPod")&&!B("iPad"),$a=B("iPad"),ab=B("iPod");var bb=function(a,b){this.width=a;this.height=b};l=bb.prototype;l.clone=function(){return new bb(this.width,this.height)};l.aspectRatio=function(){return this.width/this.height};l.ceil=function(){this.width=Math.ceil(this.width);this.height=Math.ceil(this.height);return this};l.floor=function(){this.width=Math.floor(this.width);this.height=Math.floor(this.height);return this};l.round=function(){this.width=Math.round(this.width);this.height=Math.round(this.height);return this};l.scale=function(a,b){b=u(b)?b:a;this.width*=a;this.height*=b;return this};var cb=function(a,b){var c;var d=document;b=b||d;if(b.querySelectorAll&&b.querySelector&&a)return b.querySelectorAll(a?"."+a:"");if(a&&b.getElementsByClassName){var e=b.getElementsByClassName(a);return e}e=b.getElementsByTagName("*");if(a){var f={};for(d=c=0;b=e[d];d++){var g=b.className;"function"==typeof g.split&&z(g.split(/\s+/),a)&&(f[c++]=b)}f.length=c;return f}return e},db=function(a,b,c){function d(c){c&&b.appendChild(t(c)?a.createTextNode(c):c)}for(var e=1;e<c.length;e++){var f=c[e];if(!sa(f)||ta(f)&&0<f.nodeType)d(f);else{a:{if(f&&"number"==typeof f.length){if(ta(f)){var g="function"==typeof f.item||"string"==typeof f.item;break a}if("function"==v(f)){g="function"==typeof f.item;break a}}g=!1}y(g?Ba(f):f,d)}}},eb=function(a){this.ca=a||r.document||document};l=eb.prototype;l.getElementsByTagName=function(a,b){return(b||this.ca).getElementsByTagName(String(a))};l.createElement=function(a){return this.ca.createElement(String(a))};l.createTextNode=function(a){return this.ca.createTextNode(String(a))};l.appendChild=function(a,b){a.appendChild(b)};l.append=function(a,b){db(9==a.nodeType?a:a.ownerDocument||a.document,a,arguments)};l.canHaveChildren=function(a){if(1!=a.nodeType)return!1;switch(a.tagName){case "APPLET":case "AREA":case "BASE":case "BR":case "COL":case "COMMAND":case "EMBED":case "FRAME":case "HR":case "IMG":case "INPUT":case "IFRAME":case "ISINDEX":case "KEYGEN":case "LINK":case "NOFRAMES":case "NOSCRIPT":case "META":case "OBJECT":case "PARAM":case "SCRIPT":case "SOURCE":case "STYLE":case "TRACK":case "WBR":return!1}return!0};l.removeNode=function(a){return a&&a.parentNode?a.parentNode.removeChild(a):null};l.contains=function(a,b){if(!a||!b)return!1;if(a.contains&&1==b.nodeType)return a==b||a.contains(b);if("undefined"!=typeof a.compareDocumentPosition)return a==b||!!(a.compareDocumentPosition(b)&16);for(;b&&a!=b;)b=b.parentNode;return b==a};var fb=function(a,b,c,d){this.top=a;this.right=b;this.bottom=c;this.left=d};l=fb.prototype;l.clone=function(){return new fb(this.top,this.right,this.bottom,this.left)};l.contains=function(a){return this&&a?a instanceof fb?a.left>=this.left&&a.right<=this.right&&a.top>=this.top&&a.bottom<=this.bottom:a.x>=this.left&&a.x<=this.right&&a.y>=this.top&&a.y<=this.bottom:!1};l.expand=function(a,b,c,d){ta(a)?(this.top-=a.top,this.right+=a.right,this.bottom+=a.bottom,this.left-=a.left):(this.top-=a,this.right+=Number(b),this.bottom+=Number(c),this.left-=Number(d));return this};l.ceil=function(){this.top=Math.ceil(this.top);this.right=Math.ceil(this.right);this.bottom=Math.ceil(this.bottom);this.left=Math.ceil(this.left);return this};l.floor=function(){this.top=Math.floor(this.top);this.right=Math.floor(this.right);this.bottom=Math.floor(this.bottom);this.left=Math.floor(this.left);return this};l.round=function(){this.top=Math.round(this.top);this.right=Math.round(this.right);this.bottom=Math.round(this.bottom);this.left=Math.round(this.left);return this};l.translate=function(a,b){this.left+=a;this.right+=a;u(b)&&(this.top+=b,this.bottom+=b);return this};l.scale=function(a,b){b=u(b)?b:a;this.left*=a;this.right*=a;this.top*=b;this.bottom*=b;return this};var D=function(a){try{var b;if(b=!!a&&null!=a.location.href)a:{try{Ua(a.foo);b=!0;break a}catch(c){}b=!1}return b}catch(c){return!1}},gb=function(a,b){if(a)for(var c in a)Object.prototype.hasOwnProperty.call(a,c)&&b.call(void 0,a[c],c,a)},ib=function(){var a=hb;if(!a)return"";var b=/.*[&#?]google_debug(=[^&]*)?(&.*)?$/;try{var c=b.exec(decodeURIComponent(a));if(c)return c[1]&&1<c[1].length?c[1].substring(1):"true"}catch(d){}return""};var E=document,F=window;var jb={Ra:"ts=0",sb:"rafv=1",rb:"rafx=1",Qa:"opp=1",qb:"adf=1"},kb={pb:0,tb:1};var G=function(a){this.hb=kb;this.oa=null;this.ab=a};var H=function(){this.j={};this.J=!0;this.da={}};H.prototype.disable=function(){this.J=!1};H.prototype.enable=function(){this.J=!0};H.prototype.isEnabled=function(){return this.J};H.prototype.reset=function(){this.j={};this.J=!0;this.da={}};var lb=function(a){var b=I.a().A;if(Qa(b.da,a))return b.da[a];if(!b.J)return null;if(a=b.j[a])return a.oa};var mb=+new Date;var nb=function(a){var b=!1,c;return function(){b||(c=a(),b=!0);return c}};var ob=nb(function(){var a=!1;try{var b=Object.defineProperty({},"passive",{get:function(){a=!0}});r.addEventListener("test",null,b)}catch(c){}return a});function pb(a){return a?a.passive&&ob()?a:a.capture||!1:a}var qb=function(a,b,c,d){a.addEventListener?a.addEventListener(b,c,pb(d)):a.attachEvent&&a.attachEvent("on"+b,c)};var rb=function(a){return{visible:1,hidden:2,prerender:3,preview:4,unloaded:5}[a.visibilityState||a.webkitVisibilityState||a.mozVisibilityState||""]||0};var J=function(a,b){this.h=(void 0===a?0:a)||0;this.g=(void 0===b?"":b)||""},sb=function(a){return!!a.h||!!a.g};J.prototype.toString=function(){return this.h+(this.g?"-":"")+this.g};J.prototype.matches=function(a){return this.g||a.g?this.g==a.g:this.h||a.h?this.h==a.h:!1};var tb;tb=/^true$/.test("false");var ub=function(a,b,c){a.google_image_requests||(a.google_image_requests=[]);var d=a.document.createElement("img");c&&(d.referrerPolicy="no-referrer");d.src=b;a.google_image_requests.push(d)},wb=function(a){if(vb())ub(r.window,a,!0);else{var b=r.document;if(b.body){var c=b.getElementById("goog-srcless-iframe");c||(c=(new eb(b)).createElement("IFRAME"),c.style.display="none",c.id="goog-srcless-iframe",b.body.appendChild(c));b=c}else b=null;b&&b.contentWindow&&ub(b.contentWindow,a,!1)}},vb=nb(function(){return"referrerPolicy"in r.document.createElement("img")});var xb=!!window.google_async_iframe_id,K=xb&&window.parent||window,yb=function(){if(xb&&!D(K)){var a="."+E.domain;try{for(;2<a.split(".").length&&!D(K);)E.domain=a=a.substr(a.indexOf(".")+1),K=window.parent}catch(b){}D(K)||(K=window)}return K};var zb=function(a,b,c){c=void 0===c?{}:c;this.error=a;this.context=b.context;this.line=b.line||-1;this.msg=b.message||"";this.file=b.file||"";this.id=b.id||"jserror";this.meta=c};var Ab=/^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/,Bb=function(a,b,c){if("array"==v(b))for(var d=0;d<b.length;d++)Bb(a,String(b[d]),c);else null!=b&&c.push(a+(""===b?"":"="+encodeURIComponent(String(b))))},Cb=function(a,b){var c=[];for(b=b||0;b<a.length;b+=2)Bb(a[b],a[b+1],c);return c.join("&")},Db=function(a,b){var c=2==arguments.length?Cb(arguments[1],0):Cb(arguments,1);if(c){var d=a.indexOf("#");0>d&&(d=a.length);var e=a.indexOf("?");if(0>e||e>d){e=d;var f=""}else f=a.substring(e+1,d);d=[a.substr(0,e),f,a.substr(d)];e=d[1];d[1]=c?e?e+"&"+c:c:e;c=d[0]+(d[1]?"?"+d[1]:"")+d[2]}else c=a;return c};var Eb=/^https?:\/\/(\w|-)+\.cdn\.ampproject\.(net|org)(\?|\/|$)/,Fb=function(a,b){this.Ma=a;this.Na=b},Gb=function(a,b,c){this.url=a;this.o=b;this.za=!!c;this.depth=u(void 0)?void 0:null},Hb=function(){var a=r,b=[],c=null;do{var d=a;if(D(d)){var e=d.location.href;c=d.document&&d.document.referrer||null}else e=c,c=null;b.push(new Gb(e||"",d));try{a=d.parent}catch(f){a=null}}while(a&&d!=a);a=0;for(d=b.length-1;a<=d;++a)b[a].depth=d-a;d=r;if(d.location&&d.location.ancestorOrigins&&d.location.ancestorOrigins.length==b.length-1)for(a=1;a<b.length;++a)e=b[a],e.url||(e.url=d.location.ancestorOrigins[a-1]||"",e.za=!0);return b};var Ib=function(){this.Ca=4E3;this.L="&";this.Va=",$";this.W="trn";this.nb=null;this.ua=!1;this.F={};this.jb=0;this.u=[]},Jb=function(a,b){var c={};c[a]=b;return[c]},Lb=function(a,b,c,d,e){var f=[];gb(a,function(a,h){(a=Kb(a,b,c,d,e))&&f.push(h+"="+a)});return f.join(b)},Kb=function(a,b,c,d,e){if(null==a)return"";b=b||"&";c=c||",$";"string"==typeof c&&(c=c.split(""));if(a instanceof Array){if(d=d||0,d<c.length){for(var f=[],g=0;g<a.length;g++)f.push(Kb(a[g],b,c,d+1,e));return f.join(c[d])}}else if("object"==typeof a)return e=e||0,2>e?encodeURIComponent(Lb(a,b,c,d,e+1)):"...";return encodeURIComponent(String(a))},L=function(a,b,c,d){a.u.push(b);a.F[b]=Jb(c,d)},Nb=function(a,b,c,d){b=b+"//"+c+d;var e=Mb(a)-d.length;if(0>e)return"";a.u.sort(function(a,b){return a-b});d=null;c="";for(var f=0;f<a.u.length;f++)for(var g=a.u[f],h=a.F[g],k=0;k<h.length;k++){if(!e){d=null==d?g:d;break}var n=Lb(h[k],a.L,a.Va);if(n){n=c+n;if(e>=n.length){e-=n.length;b+=n;c=a.L;break}else a.ua&&(c=e,n[c-1]==a.L&&--c,b+=n.substr(0,c),c=a.L,e=0);d=null==d?g:d}}f="";a.W&&null!=d&&(f=c+a.W+"="+(a.nb||d));return b+f+""},Mb=function(a){if(!a.W)return a.Ca;var b=1,c;for(c in a.F)b=c.length>b?c.length:b;return a.Ca-a.W.length-b-a.L.length-1};var Ob=function(a,b,c,d,e){if((d?a.mb:Math.random())<(e||a.xa))try{if(c instanceof Ib)var f=c;else f=new Ib,gb(c,function(a,b){var c=f,d=c.jb++;a=Jb(b,a);c.u.push(d);c.F[d]=a});var g=Nb(f,a.lb,a.bb,a.kb+b+"&");g&&ub(r,g,!1)}catch(h){}};var Pb=null;var Qb=function(){var a=r.performance;return a&&a.now&&a.timing?Math.floor(a.now()+a.timing.navigationStart):+new Date},Rb=function(){var a=void 0===a?r:a;return(a=a.performance)&&a.now?a.now():null};var Sb=function(a,b,c){this.label=a;this.type=b;this.value=c;this.duration=0;this.uniqueId=this.label+"_"+this.type+"_"+Math.random();this.slotId=void 0};var M=r.performance,Tb=!!(M&&M.mark&&M.measure&&M.clearMarks),N=nb(function(){var a;if(a=Tb){var b;if(null===Pb){Pb="";try{a="";try{a=r.top.location.hash}catch(c){a=r.location.hash}a&&(Pb=(b=a.match(/\bdeid=([\d,]+)/))?b[1]:"")}catch(c){}}b=Pb;a=!!b.indexOf&&0<=b.indexOf("1337")}return a}),Ub=function(){var a=O;this.I=[];this.gb=a||r;var b=null;a&&(a.google_js_reporting_queue=a.google_js_reporting_queue||[],this.I=a.google_js_reporting_queue,b=a.google_measure_js_timing);this.v=N()||(null!=b?b:1>Math.random())};Ub.prototype.disable=function(){this.v=!1;this.I!=this.gb.google_js_reporting_queue&&(N()&&y(this.I,Vb),this.I.length=0)};var Vb=function(a){a&&M&&N()&&(M.clearMarks("goog_"+a.uniqueId+"_start"),M.clearMarks("goog_"+a.uniqueId+"_end"))};Ub.prototype.start=function(a,b){if(!this.v)return null;var c=Rb()||Qb();a=new Sb(a,b,c);b="goog_"+a.uniqueId+"_start";M&&N()&&M.mark(b);return a};Ub.prototype.end=function(a){if(this.v&&u(a.value)){var b=Rb()||Qb();a.duration=b-a.value;b="goog_"+a.uniqueId+"_end";M&&N()&&M.mark(b);this.v&&this.I.push(a)}};var Yb=function(){var a=Wb;this.Ea=Xb;this.eb="jserror";this.na=!0;this.sa=null;this.cb=this.ga;this.V=void 0===a?null:a;this.Pa=!1},$b=function(a,b,c){try{if(a.V&&a.V.v){var d=a.V.start(b.toString(),3);var e=c();a.V.end(d)}else e=c()}catch(g){c=a.na;try{Vb(d);var f=Zb(g);c=a.cb.call(a,b,f,void 0,void 0)}catch(h){a.ga(217,h)}if(!c)throw g;}return e},bc=function(a,b){var c=ac;return function(d){for(var e=[],f=0;f<arguments.length;++f)e[f-0]=arguments[f];return $b(c,a,function(){return b.apply(void 0,e)})}};Yb.prototype.ga=function(a,b,c,d,e){e=e||this.eb;try{var f=new Ib;f.ua=!0;L(f,1,"context",a);b.error&&b.meta&&b.id||(b=Zb(b));b.msg&&L(f,2,"msg",b.msg.substring(0,512));b.file&&L(f,3,"file",b.file);0<b.line&&L(f,4,"line",b.line);var g=b.meta||{};if(this.sa)try{this.sa(g)}catch(Fa){}if(d)try{d(g)}catch(Fa){}b=[g];f.u.push(5);f.F[5]=b;var h=Hb(),k=new Gb(r.location.href,r,!1);b=null;var n=h.length-1;for(d=n;0<=d;--d){var q=h[d];!b&&Eb.test(q.url)&&(b=q);if(q.url&&!q.za){k=q;break}}q=null;var x=h.length&&h[n].url;0!=k.depth&&x&&(q=h[n]);var V=new Fb(k,q);V.Na&&L(f,6,"top",V.Na.url||"");L(f,7,"url",V.Ma.url||"");Ob(this.Ea,e,f,this.Pa,c)}catch(Fa){try{Ob(this.Ea,e,{context:"ecmserr",rctx:a,msg:cc(Fa),url:V&&V.Ma.url},this.Pa,c)}catch(bd){}}return this.na};var Zb=function(a){return new dc(cc(a),a.fileName,a.lineNumber)},cc=function(a){var b=a.toString();a.name&&-1==b.indexOf(a.name)&&(b+=": "+a.name);a.message&&-1==b.indexOf(a.message)&&(b+=": "+a.message);if(a.stack){a=a.stack;var c=b;try{-1==a.indexOf(c)&&(a=c+"\n"+a);for(var d;a!=d;)d=a,a=a.replace(/((https?:\/..*\/)[^\/:]*:\d+(?:.|\n)*)\2/,"$1");b=a.replace(/\n */g,"\n")}catch(e){b=c}}return b},dc=function(a,b,c){zb.call(this,Error(a),{message:a,file:void 0===b?"":b,line:void 0===c?-1:c})};ha(dc,zb);var Xb,ac,O=yb(),Wb=new Ub;Xb=new function(){var a=void 0===a?F:a;this.lb="http:"===a.location.protocol?"http:":"https:";this.bb="pagead2.googlesyndication.com";this.kb="/pagead/gen_204?id=";this.xa=.01;this.mb=Math.random()};ac=new Yb;"complete"==O.document.readyState?O.google_measure_js_timing||Wb.disable():Wb.v&&qb(O,"load",function(){O.google_measure_js_timing||Wb.disable()});var P=function(a,b){return bc(a,b)};tb&&(Xb.xa=1);if(E&&E.URL){var ec,hb=E.URL;ec=!!hb&&0<ib().length;ac.na=!ec}var Q=function(a,b,c,d){qb(a,b,bc(d,c),{capture:!1})},fc=function(a){var b=["IMG","FRAME","IFRAME"];return za(b,function(b){return a.nodeName==String(b)})?[a]:ya(b,function(b,d){return b.concat(Ba((a||document).getElementsByTagName(String(d))))})},gc=function(a,b){if(a){var c=0,d=null;a=fc(a);for(var e=0;e<a.length;e++){var f=!1;d=a[e];switch(d.nodeName){case "IMG":if(d.complete||d.naturalWidth)f=!0;break;case "FRAME":case "IFRAME":"complete"==d.readyState&&(f=!0)}f||(c++,Q(d,"load",function(){c--;c||b(null)},116))}a=d=null;c||b(null)}},hc=function(a,b){var c=0,d=function(){a();c++;10>c&&F.setTimeout(bc(b,d),100)};d()};var R=function(a,b){a&&(a.h&&(b[4]=a.h),a.g&&(b[12]=a.g))},ic=function(a){var b=[];Pa(a,function(a,d){d=encodeURIComponent(d);t(a)&&(a=encodeURIComponent(a));b.push(d+"="+a)});b.push("24="+ +new Date);return b.join("\n")};var jc=function(){this.b=null;this.T=this.ta=this.H=0};var kc=!Va&&!(B("Safari")&&!(Sa()||B("Coast")||B("Opera")||B("Edge")||B("Silk")||B("Android"))),lc=function(a,b){if(/-[a-z]/.test(b))return null;if(kc&&a.dataset){if(!(!B("Android")||Sa()||B("Firefox")||B("Opera")||B("Silk")||b in a.dataset))return null;a=a.dataset[b];return void 0===a?null:a}return a.getAttribute("data-"+La(b))},mc=function(a,b){return/-[a-z]/.test(b)?!1:kc&&a.dataset?b in a.dataset:a.hasAttribute?a.hasAttribute("data-"+La(b)):!!a.getAttribute("data-"+La(b))};var nc=function(a){return wa(a,function(a){return 16<=a.clientHeight&&16<=a.clientWidth})},oc=function(a){if(!a.length)return null;var b=nc(a);return 0<b.length?b[0]:a[0]},pc=function(a,b,c){b=String(b);for(var d=Da(xa(function(b){var c=a||document;return Ba(c.querySelectorAll&&c.querySelector?c.querySelectorAll("."+b):cb(b,a))})),e=[],f=[],g=oa(d),h=g.next();!h.done;h=g.next())h=h.value,mc(h,"googleAvAdk")?lc(h,"googleAvAdk")==b&&e.push(h):f.push(h);c.H=d.length;c.ta=e.length;c.T=e.length+f.length;c.b=oc(e);c.b||(c.b=oc(f))},qc=function(a){var b=null;var c=(F.document||document).getElementsByTagName("SCRIPT");0<c.length&&(c=c[c.length-1])&&c.parentElement&&(b=c.parentElement);b||(b=F.document.body);c=new jc;b&&(pc(b,a,c),!c.b&&b.children&&(a=nc(Ba(b.children)),c.H=b.children.length,c.T=a.length,1==c.H?c.b=b.children[0]:1==c.T?c.b=a[0]:1<c.H&&(c.b=b)));return c};var I=function(){D(F.top);var a=Hb();a=0<a.length&&null!=a[a.length-1]&&null!=a[a.length-1].url?((a=a[a.length-1].url.match(Ab)[3]||null)?decodeURI(a):a)||"":"";this.domain=a;this.Ya=0;this.$a=!1;this.A=new H;this.A.j.nio2=new G(!0);this.A.j.omid=new G(!0)};ra(I);var rc=function(a,b,c,d,e){this.time=a;this.Za=b;this.volume=void 0===e?null:e;this.Ja=d;this.pa=c};var S=function(a,b){b=void 0===b?0:b;this.o=a;this.ja=[];this.s=new rc(-1,new bb(0,0),null,!0);this.R=this.i=b;this.Ua=this.ob=this.Aa=!1};S.prototype.ya=function(){};S.prototype.getName=function(){return"geo"};S.prototype.Ia=function(){};var sc=function(a){y(a.ja,function(b){var c=a.s,d;if(!(d=b.Ua)){d=b.s;var e=b.ob;if(e=!!c&&(!(void 0===e?0:e)||d.volume==c.volume)&&d.Ja==c.Ja)d=d.pa,e=c.pa,e=d==e?!0:d&&e?d.top==e.top&&d.right==e.right&&d.bottom==e.bottom&&d.left==e.left:!1;d=!e}b.s=c;d&&sc(b)})},tc=function(a){y(a.ja,function(b){var c=a.i,d=b.i;b.Aa=c>=b.R;b.i=Math.max(b.R,c);!b.Aa||1==c&&0!=b.R||b.Ia();b.i!=d&&tc(b)})};var T=new Date(0);C(T.getUTCFullYear(),4);C(T.getUTCMonth()+1,2);C(T.getUTCDate(),2);C(T.getUTCHours(),2);C(T.getUTCMinutes(),2);var uc=function(a){a=a.toString();a=/id=lidar(2|im|tos)&v=\d+/.test(a)?a:/r\d{8}/.test("r20180108")?a+"&v=r20180108":a;a=a.substring(0,2E3);var b=yb()||F;ub(b,a,!1)};(function(){if(Xa){var a=/Windows NT ([0-9.]+)/;return(a=a.exec(A))?a[1]:"0"}return Wa?(a=/10[_.][0-9_.]+/,(a=a.exec(A))?a[0].replace(/_/g,"."):"10"):Ya?(a=/Android\s+([^\);]+)(\)|;)/,(a=a.exec(A))?a[1]:""):Za||$a||ab?(a=/(?:iPhone|CPU)\s+OS\s+(\S+)/,(a=a.exec(A))?a[1].replace(/_/g,"."):""):""})();(function(){if(!r.addEventListener||!Object.defineProperty)return!1;var a=!1,b=Object.defineProperty({},"passive",{get:function(){a=!0}});r.addEventListener("test",qa,b);r.removeEventListener("test",qa,b);return a})();var vc=function(){this.Y=[];this.O=[];this.done=!1};vc.prototype.reset=function(){this.Y=[];this.O=[]};var xc=function(){var a=wc;return za(0==a.Y.length?a.O:0==a.O.length?a.Y:Aa(a.O,a.Y),function(a){return a.ub})};ra(vc);var wc=vc.a();var U=function(){S.call(this,F,1);this.w=new J(0,"");this.ia=4;this.f=[];this.ka=[];this.ba=0;this.ha=!1;this.Fa=this.Ga=0;this.Z="";this.X=!1};ha(U,S);U.prototype.getName=function(){return"osd"};U.prototype.Ta=function(a){z(this.ka,a)||this.ka.push(a)};var yc=function(a,b){var c=0,d=a.o;try{if(d&&d.Goog_AdSense_getAdAdapterInstance)return d}catch(e){}for(;d&&5>c;){try{if(d.google_osd_static_frame)return a.X?d.google_osd_static_frame:d}catch(e){}try{if(d.aswift_0&&(!b||d.aswift_0.google_osd_static_frame))return a.X&&d.aswift_0.google_osd_static_frame?d.aswift_0.google_osd_static_frame:d.aswift_0}catch(e){}c++;d=d!=d.parent?d.parent:null}return null},zc=function(a,b,c,d,e,f){e=void 0===e?!1:e;f=void 0===f?"":f;var g={};R(c,g);g[0]="goog_request_monitoring";g[6]=b;g[27]=a.o.document.domain;g[16]=e;f&&f.length&&(g[19]=f);try{var h=ic(g);d.postMessage(h,"*")}catch(k){}},Ac=function(a,b,c,d,e,f){d=void 0===d?!1:d;e=void 0===e?"":e;f=void 0===f?function(){return null}:f;++a.Fa;2==a.ba?W(a):10<a.Fa?(W(a),f()):a.o.postMessage?sb(c)?(f=yc(a,!0))&&zc(a,b,c,f,d,e):(W(a),f()):(W(a),f())};U.prototype.ya=function(){var a=this;if(sb(this.w)){Q(r,"message",function(b){if(null!=b&&b.data&&t(b.data)){var c=b.data;if(t(c)){var e={};c=c.split("\n");for(var f=0;f!=c.length;++f){var g=c[f],h=g.indexOf("=");if(!(0>=h)){var k=Number(g.substr(0,h));g=g.substr(h+1);switch(k){case 26:case 15:case 8:case 11:case 16:case 5:case 18:g="true"==g;break;case 4:case 6:case 25:case 28:case 29:case 24:case 23:case 22:case 7:case 21:case 20:g=Number(g);break;case 19:case 3:if("function"==v(decodeURIComponent))try{g=decodeURIComponent(g)}catch(q){throw Error("Error: URI malformed: "+g);}}e[k]=g}}e=e[0]?e:null}else e=null;if(e&&a.w.matches(new J(e[4],e[12]))&&(c=e[29],f=e[0],z(["goog_acknowledge_monitoring","goog_get_mode","goog_update_data","goog_image_request"],f))){Bc(a,e);if("goog_get_mode"==f&&b.source){k={};R(a.w,k);k[0]="goog_provide_mode";k[6]=a.ia;k[19]=a.Z;k[16]=a.ha;try{var n=ic(k);b.source.postMessage(n,b.origin)}catch(q){}}if("goog_get_mode"==f||"goog_acknowledge_monitoring"==f)Cc(a),a.ba=2,W(a);if(a.f.length||a.ja.length)switch(4!=c&&(k=!1,b=a.s.Za,n=a.s.volume,c=a.s.pa,f=+new Date-mb,"goog_acknowledge_monitoring"==e[0]&&(a.i=e[8]?0:2,tc(a)),isNaN(e[22])||isNaN(e[23])||(k=!0,b=new bb(e[22],e[23])),e[9]&&(k=!0,g=e[9].split("-"),4==g.length&&(c=new fb(Ka(g[0]),Ka(g[3]),Ka(g[2]),Ka(g[1])))),k&&(xc()?k=!0:(g=rb(E),k=1===g,g=0===g,k=I.a().$a?k:k||g),a.s=new rc(f,b,c,k,n),sc(a))),b=e[0],n=100*e[25],u(n)&&!isNaN(n)&&Dc(a,n),void 0!=e[18]&&Ec(a,e[18]),void 0!=e[7]&&0<e[7]&&Fc(a,e[7]),n=!!e[5],c=!!e[11],f=!1,"goog_update_data"==b&&(f=!!e[15],Gc(a,e[3])),b){case "goog_image_request":Hc(a,n,c);case "goog_update_data":n&&Ic(a,f),c&&Jc(a)}}}},118);var b=P(197,function(){Ac(a,a.ia,a.w,a.ha,a.Z,function(){a.i=0;tc(a)})});this.ba=1;this.Ga=this.o.setInterval(b,500)}else this.R=this.i=this.i=0,tc(this)};U.prototype.Ia=function(){var a={};R(this.w,a);a[0]="goog_stop_monitoring";Kc(this,ic(a))};var W=function(a){a.o.clearInterval(a.Ga)},Kc=function(a,b){var c=yc(a,a.X),d=!c;d&&(c=a.o.parent);if(c&&c.postMessage)try{c.postMessage(b,"*"),d&&a.o.postMessage(b,"*")}catch(e){}},Cc=function(a){y(a.f,function(){})},Gc=function(a,b){y(a.f,function(a){a.C=b;++a.Oa})},Dc=function(a,b){y(a.f,function(){window.document["4CGeArbVQ"]=b|0})},Ec=function(a,b){y(a.f,function(a){a.Ba=b})},Fc=function(a,b){y(a.f,function(a){if(a.ma){var c="//pagead2.googlesyndication.com/pagead/gen_204?id=ac_opp&vsblt="+b;a.$&&(c+="&avi="+a.$);uc(c);a.ma=!1}})},Hc=function(a,b,c){y(a.f,function(a){Lc(a,b,c)})},Ic=function(a,b){y(a.f,function(a){if(1==a.c||2==a.c||a.l){a.qa=!0;Mc(a,"1");a.N&&Nc(a)&&(wb(a.N),a.N="");if(a.l&&!b){var c=Oc(a.C,"v");X(a,c,!0);a.la=!0;a.La=+new Date}a.l||1!=a.c||(a.P=!0)}})},Jc=function(a){y(a.f,function(a){if(1==a.c||2==a.c||a.l)a.m=!1,Mc(a,"3"),a.l&&X(a,a.C,!0)})},Bc=function(a,b){y(a.ka,function(a){a(b)})};ra(U);var Pc=function(){var a=/[&\?#]exk=([^& ]+)/.exec(F.location.href);return a&&2==a.length?a[1]:null};var Y=function(){this.K=0;this.$="";this.G=[];this.fa=this.ra=this.la=this.Ba=this.qa=this.M=this.m=this.l=!1;this.La=this.Ka=0;this.D=new J(null,null);this.C="";this.aa=[];this.va=null;this.P=!1;this.N=this.U="";this.B=null;this.wa=!1;this.Oa=this.c=0;this.Da="";this.ma=!1;var a=I.a().A;a.j.ud=new G(!1);a.j.bcn=new G(!1);I.a().A.j.mkm=new G(!1)},Z=function(a){return(a=a.B)?a.b:null},Qc=function(a){return Z(a)?(a=Z(a))?mc(a,"googleAvDm")?1:2:0:0};Y.prototype.ib=function(a){var b=/^(http[s]?:)?\/\//.test(a)?a:Rc(a);if(this.fa&&z(this.G,b))return!0;(a=!a)||(a=!(null!==F&&F!=F.top));if(a||this.P||this.ra&&!this.la)return!1;this.fa=!0;this.la&&(a=Sc(this,b,this.C,!0),a=Db(a,"tsvp",+new Date-this.La),uc(a));this.G.push(b);this.Ka=+new Date;return!0};Y.prototype.Ha=function(a,b,c){a=1!=lb("ud");this.l&&(a||3!=(void 0===c?3:c)||this.Ba)&&X(this,b,!0);if(this.M||this.m&&this.qa)X(this,b),this.m=this.M=!1};var Nc=function(a){return(a=a.va)?2!=a():!0},X=function(a,b,c){b=void 0===b?a.C:b;c=void 0===c?!1:c;if(b&&!a.P&&(2==a.c||c)&&Nc(a)){1==lb("mkm")&&(b=b+"&itpl="+(Number(lc(a.B.b,"googleAvItpl"))||0));for(var d=0;d<a.G.length;++d){var e=Sc(a,a.G[d],b,c);uc(e)}a.ra=!0;c?a.l=!1:a.P=!0}},Oc=function(a,b){if(/(?:^|&)`r=${reason}`/.test(a))return a;var c=new RegExp(/(?:^|&)r=\w{1,3}/);return c.test(a)?a.replace(c,function(a,c){return(0==c?"":"&")+"r="+b}):a+((""==a||a.endsWith("&")?"":"&")+"r="+b)},Rc=function(a,b){var c=[];a&&c.push("avi="+a);b&&c.push("cid="+b);return c.length?"//pagead2.googlesyndication.com/activeview?"+c.join("&"):"//pagead2.googlesyndication.com/activeview"},Sc=function(a,b,c,d){var e="osdtos";(void 0===d?0:d)?e="osdim":a.M&&(e="osd2");b=[b,(-1<b.indexOf("?")?"&":"?")+"id=",e];"osd2"==e&&a.m&&a.qa&&b.push("&tsf=1");b.push("&ti=1");b.push("&"+c);b.push("&uc="+a.Oa);b.push("&tgt="+(Z(a)?Z(a)?a.B.b.tagName:"":"nf"));b.push("&cl="+(a.wa?1:0));a.fa&&(b.push("&lop=1"),b.push("&tslp="+(+new Date-a.Ka)));if(c=a.B)b.push("&cec="+c.H),b.push("&clc="+c.T),b.push("&cac="+c.ta),c=c.b,b.push("&cd="+c?c.clientWidth+"x"+c.clientHeight:"nf");c=b.join("");for(e=0;e<a.aa.length;e++){b="";try{b=a.aa[e]()}catch(f){}d="max_length";2<=b.length&&(3==b.length&&(d=b[2]),c=va(c,encodeURIComponent(b[0]),encodeURIComponent(b[1]),d))}return c},Mc=function(a,b){if(a.U){try{wb(va(a.U,"vi",b))}catch(c){}z(Tc,b)&&(a.U="")}},Lc=function(a,b,c){b=void 0===b?!1:b;c=void 0===c?!1:c;var d=Oc(a.C,"u");a.Ha(F,d);b||c||Mc(a,"0")};Y.prototype.Wa=function(a){this.aa.push(a)};Y.prototype.Xa=function(a){this.va=a};var Uc=function(a){var b=U.a();z(b.f,a)||b.f.push(a);b.Z=a.Da;b.w=a.D;b.ia=a.c;b.ha=a.m;b.X=1==lb("bcn");b.ya()},Vc=function(a,b){var c=ic(a);try{hc(function(){Kc(U.a(),c)},b)}catch(d){}},Wc=function(a,b){switch(b){case 1:a[26]=!0;break;case 2:a[26]=!1}},Xc=function(a,b){if(0!=b){var c={};R(a.D,c);c[0]="goog_av_measurement_hold_update";Wc(c,b);Vc(c,282)}},Zc=function(a){1==Qc(a)&&Yc(a);var b={};R(a.D,b);b[0]="goog_dom_content_loaded";a=Qc(a);Wc(b,a);Vc(b,114)},Yc=function(a){var b=Z(a);if(r.MutationObserver&&b){var c={attributes:!0};c.attributeFilter=["data-"+La("googleAvDm")];(new r.MutationObserver(P(283,function(){Xc(a,Qc(a))}))).observe(b,c)}else b&&b.addEventListener?b.addEventListener("DOMAttrModified",P(283,function(){Xc(a,Qc(a))})):ac.ga(286,Error(),void 0,void 0)},$c=function(a,b){if(t(b)){var c=I.a().A;b=b.split("&");for(var d=b.length-1;0<=d;d--){var e=b[d].split("="),f=1<e.length?parseInt(e[1],10):1;e=c.j[e[0]];var g;if(g=e){if(g=null===e.oa)b:{g=void 0;var h=e.hb;for(g in h)if(h[g]==f){g=!0;break b}g=!1}g?(e.oa=f,g=!0):g=!1}g&&e.ab&&b.splice(d,1)}c=b.join("&").split("&");for(b=c.length-1;0<=b;b--)d=c[b],f=jb,d==f.Ra?(a.m=!1,c.splice(b,1)):d==f.Qa&&(a.ma=!0,c.splice(b,1));a.Da=c.join("&")}},ad=function(a,b){Z(a)||(a.B=qc(b),Z(a)&&gc(a.B.b,function(){var b={};R(a.D,b);b[0]="goog_creative_loaded";var d=Qc(a);Wc(b,d);Vc(b,115);a.wa=!0}))};Y.prototype.fb=function(a,b,c,d,e,f,g,h,k,n){var q=this;I.a().Ya=4;this.K=a;this.U=b;this.N=d;this.l=f;g&&$c(this,g);this.m=f;this.D=new J(e,Pc());Q(F,"load",function(){Mc(q,"-1")},117);this.$=c||"";this.G=[n||Rc(c,k)];Q(F,"unload",function(){Lc(q)},119);var x=F.document;0==rb(x)?(X(this,"r=pv",!0),this.c=5,Uc(this)):(!x.readyState||"complete"!=x.readyState&&"loaded"!=x.readyState?!Ra()||0<=Ja()?Q(x,"DOMContentLoaded",function(){Zc(q)},121):Q(x,"readystatechange",function(){"complete"!=x.readyState&&"loaded"!=x.readyState||Zc(q)},120):Zc(this),-1==this.K?this.c=f?3:1:-2==this.K?this.c=3:0<this.K&&(this.c=2,this.M=!0),this.m&&!this.M&&-1==this.K&&(this.c=2),Uc(this),hc(function(){ad(q,e)},122))};ra(Y);var Tc=["1","0","3"];w("osdlfm",P(123,function(a){for(var b=[],c=0;c<arguments.length;++c)b[c-0]=arguments[c];var d;return(d=Y.a()).fb.apply(d,[].concat(p(b)))}));w("osdlac",P(124,function(a){for(var b=[],c=0;c<arguments.length;++c)b[c-0]=arguments[c];var d;return(d=Y.a()).Wa.apply(d,[].concat(p(b)))}));w("osdlamrc",P(125,function(a){for(var b=[],c=0;c<arguments.length;++c)b[c-0]=arguments[c];var d;return(d=U.a()).Ta.apply(d,[].concat(p(b)))}));w("osdsir",P(126,function(a){for(var b=[],c=0;c<arguments.length;++c)b[c-0]=arguments[c];var d;return(d=Y.a()).Ha.apply(d,[].concat(p(b)))}));w("osdacrc",P(127,function(a){for(var b=[],c=0;c<arguments.length;++c)b[c-0]=arguments[c];var d;return(d=Y.a()).Xa.apply(d,[].concat(p(b)))}));w("osdpcls",P(128,function(a){for(var b=[],c=0;c<arguments.length;++c)b[c-0]=arguments[c];var d;return(d=Y.a()).ib.apply(d,[].concat(p(b)))}));}).call(this);
