(function(){/* 
 
 Copyright The Closure Library Authors. 
 SPDX-License-Identifier: Apache-2.0 
*/ 
function h(a){var b=0;return function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}}}function k(a){var b="undefined"!=typeof Symbol&&Symbol.iterator&&a[Symbol.iterator];return b?b.call(a):{next:h(a)}}function l(a){for(var b,c=[];!(b=a.next()).done;)c.push(b.value);return c}var m="function"==typeof Object.create?Object.create:function(a){function b(){}b.prototype=a;return new b},n; 
if("function"==typeof Object.setPrototypeOf)n=Object.setPrototypeOf;else{var p;a:{var q={h:!0},r={};try{r.__proto__=q;p=r.h;break a}catch(a){}p=!1}n=p?function(a,b){a.__proto__=b;if(a.__proto__!==b)throw new TypeError(a+" is not extensible");return a}:null}var t=n; 
function u(a,b){a.prototype=m(b.prototype);a.prototype.constructor=a;if(t)t(a,b);else for(var c in b)if("prototype"!=c)if(Object.defineProperties){var d=Object.getOwnPropertyDescriptor(b,c);d&&Object.defineProperty(a,c,d)}else a[c]=b[c]};function v(a){var b=this;this.b=!1;this.a=[];a(function(c){w(b,c)})}function w(a,b){if(!a.b)if(b instanceof v)x(b,function(c){w(a,c)});else{a.b=!0;a.c=b;for(b=0;b<a.a.length;++b)y(a,a.a[b]);a.a=[]}}function y(a,b){a.b?b(a.c):a.a.push(b)}function x(a,b){new v(function(c){y(a,function(d){c(b(d))})})}function z(){return new v(function(a){return a(void 0)})};function A(a){if(!a)throw Error("functionToExecute must not be truthy.");};function B(){return/\d+\.\d+\.\d+(-.*)?/.test("1.3.3-google_20200427")}function C(){for(var a=["1","3","3"],b=["1","0","3"],c=0;3>c;c++){var d=parseInt(a[c],10),e=parseInt(b[c],10);if(d>e)break;else if(d<e)return!1}return!0};function D(a,b,c,d){this.b=a;this.method=b;this.version=c;this.a=d}function E(a){return!!a&&void 0!==a.omid_message_guid&&void 0!==a.omid_message_method&&void 0!==a.omid_message_version&&"string"===typeof a.omid_message_guid&&"string"===typeof a.omid_message_method&&"string"===typeof a.omid_message_version&&(void 0===a.omid_message_args||void 0!==a.omid_message_args)}function F(a){return new D(a.omid_message_guid,a.omid_message_method,a.omid_message_version,a.omid_message_args)} 
function G(a){var b={};b=(b.omid_message_guid=a.b,b.omid_message_method=a.method,b.omid_message_version=a.version,b);void 0!==a.a&&(b.omid_message_args=a.a);return b};function H(a){this.b=a};function I(a,b){return a&&(a[b]||(a[b]={}))};function J(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(a){var b=16*Math.random()|0;return"y"===a?(b&3|8).toString(16):b.toString(16)})};function K(a){for(var b=[],c=0;c<arguments.length;++c)b[c]=arguments[c];L(function(){throw new (Function.prototype.bind.apply(Error,[null,"Could not complete the test successfully - "].concat(b instanceof Array?b:l(k(b)))));},function(){return console.error.apply(console,b instanceof Array?b:l(k(b)))})}function L(a,b){"undefined"!==typeof jasmine&&jasmine?a():"undefined"!==typeof console&&console&&console.error&&b()};var M=eval("this"),O=function(){if("undefined"!==typeof omidGlobal&&omidGlobal)return omidGlobal;if("undefined"!==typeof global&&global)return global;if("undefined"!==typeof window&&window)return window;if("undefined"!==typeof M&&M)return M;throw Error("Could not determine global object context.");}();function P(a){try{return a.frames?!!a.frames.omid_v1_present:!1}catch(b){return!1}};function Q(a){this.b=a;this.handleExportedMessage=Q.prototype.c.bind(this)}u(Q,H);Q.prototype.sendMessage=function(a,b){b=void 0===b?this.b:b;if(!b)throw Error("Message destination must be defined at construction time or when sending the message.");b.handleExportedMessage(G(a),this)};Q.prototype.c=function(a,b){E(a)&&this.a&&this.a(F(a),b)};function R(a){return null!=a&&"undefined"!==typeof a.top&&null!=a.top}function S(a){if(a===O)return!1;try{if("undefined"===typeof a.location.hostname)return!0}catch(b){return!0}return!1};function T(a,b){this.b=b=void 0===b?O:b;var c=this;a.addEventListener("message",function(d){if("object"===typeof d.data){var e=d.data;E(e)&&d.source&&c.a&&c.a(F(e),d.source)}})}u(T,H);T.prototype.sendMessage=function(a,b){b=void 0===b?this.b:b;if(!b)throw Error("Message destination must be defined at construction time or when sending the message.");b.postMessage(G(a),"*")};var U=["omid","v1_VerificationServiceCommunication"],V=["omidVerificationProperties","serviceWindow"];function W(a,b){return b.reduce(function(c,d){return c&&c[d]},a)};function X(a){if(!a){var b;"undefined"===typeof b&&"undefined"!==typeof window&&window&&(b=window);b=R(b)?b:O;var c=void 0===c?P:c;a=[];var d=W(b,V);d&&a.push(d);a.push(R(b)?b.top:O);a:{a=k(a);for(var e=a.next();!e.done;e=a.next()){b:{d=b;e=e.value;var f=c;if(!S(e))try{var g=W(e,U);if(g){var N=new Q(g);break b}}catch(ea){}N=f(e)?new T(d,e):null}if(d=N){a=d;break a}}a=null}}if(this.a=a)this.a.a=this.i.bind(this);else if(c=(c=O.omid3p)&&"function"===typeof c.registerSessionObserver&&"function"===typeof c.addEventListener? 
c:null)this.b=c;this.c={};this.f=(c=O.omidVerificationProperties)?c.injectionId:void 0}function aa(a,b){A(b);a.b?a.b.registerSessionObserver(b,void 0,a.f):a.g("addSessionListener",b,void 0,a.f)}function ba(a,b){A(b);a.b?a.b.addEventListener("geometryChange",b):a.g("addEventListener",b,"geometryChange")} 
X.prototype.i=function(a){var b=a.method,c=a.b;a=a.a;if("response"===b&&this.c[c]){var d=B()&&C()?a?a:[]:a&&"string"===typeof a?JSON.parse(a):[];this.c[c].apply(this,d)}"error"===b&&window.console&&K(a)};X.prototype.g=function(a,b,c){for(var d=[],e=2;e<arguments.length;++e)d[e-2]=arguments[e];this.a&&(e=J(),b&&(this.c[e]=b),d=B()&&C()?d:JSON.stringify(d),this.a.sendMessage(new D(e,"VerificationService."+a,"1.3.3-google_20200427",d)))};var Y=void 0; 
if(Y=void 0===Y?"undefined"===typeof omidExports?null:omidExports:Y){var Z=["OmidVerificationClient"];Z.slice(0,Z.length-1).reduce(I,Y)[Z[Z.length-1]]=X};function ca(){var a=this.b=new X;this.c=!(!a.a&&!a.b);this.a=null;this.g=this.c?4:1;this.f=this.c} 
function da(a){a.f?(a.a=new v(function(b){var c=new v(function(e){aa(a.b,function(f){"sessionStart"==f.type&&e("app"==f.data.context.environment)})}),d=new v(function(e){ba(a.b,function(f){f=f.data;var g=f.adView.reasons;if(g=!g||-1==g.indexOf("hidden"))f=f.adView,f=f.onScreenContainerGeometry||f.onScreenGeometry,g=!!(f&&f.width&&f.height);g&&(a.g=3,e())})});x(c,function(e){e?x(d,function(){b()}):(a.g=1,b())})}),x(a.a,function(){a.f=!1})):a.a=z()};window.omrhp=function(a){var b=x,c=new ca;c.a||da(c);b(c.a,a)};}).call(this);
