function dv_rolloutManager(handlersDefsArray, baseHandler) {
    this.handle = function () {
        var errorsArr = [];

        var handler = chooseEvaluationHandler(handlersDefsArray);
        if (handler) {
            var errorObj = handleSpecificHandler(handler);
            if (errorObj === null) {
                return errorsArr;
            }
            else {
                var debugInfo = handler.onFailure();
                if (debugInfo) {
                    for (var key in debugInfo) {
                        if (debugInfo.hasOwnProperty(key)) {
                            if (debugInfo[key] !== undefined || debugInfo[key] !== null) {
                                errorObj[key] = encodeURIComponent(debugInfo[key]);
                            }
                        }
                    }
                }
                errorsArr.push(errorObj);
            }
        }

        var errorObjHandler = handleSpecificHandler(baseHandler);
        if (errorObjHandler) {
            errorObjHandler['dvp_isLostImp'] = 1;
            errorsArr.push(errorObjHandler);
        }
        return errorsArr;
    };

    function handleSpecificHandler(handler) {
        var url;
        var errorObj = null;

        try {
            url = handler.createRequest();
            if (url) {
                if (!handler.sendRequest(url)) {
                    errorObj = createAndGetError('sendRequest failed.',
                        url,
                        handler.getVersion(),
                        handler.getVersionParamName(),
                        handler.dv_script);
                }
            } else {
                errorObj = createAndGetError('createRequest failed.',
                    url,
                    handler.getVersion(),
                    handler.getVersionParamName(),
                    handler.dv_script,
                    handler.dvScripts,
                    handler.dvStep,
                    handler.dvOther
                );
            }
        }
        catch (e) {
            errorObj = createAndGetError(e.name + ': ' + e.message, url, handler.getVersion(), handler.getVersionParamName(), (handler ? handler.dv_script : null));
        }

        return errorObj;
    }

    function createAndGetError(error, url, ver, versionParamName, dv_script, dvScripts, dvStep, dvOther) {
        var errorObj = {};
        errorObj[versionParamName] = ver;
        errorObj['dvp_jsErrMsg'] = encodeURIComponent(error);
        if (dv_script && dv_script.parentElement && dv_script.parentElement.tagName && dv_script.parentElement.tagName == 'HEAD') {
            errorObj['dvp_isOnHead'] = '1';
        }
        if (url) {
            errorObj['dvp_jsErrUrl'] = url;
        }
        if (dvScripts) {
            var dvScriptsResult = '';
            for (var id in dvScripts) {
                if (dvScripts[id] && dvScripts[id].src) {
                    dvScriptsResult += encodeURIComponent(dvScripts[id].src) + ":" + dvScripts[id].isContain + ",";
                }
            }
            
           
           
        }
        return errorObj;
    }

    function chooseEvaluationHandler(handlersArray) {
        var config = window._dv_win.dv_config;
        var index = 0;
        var isEvaluationVersionChosen = false;
        if (config.handlerVersionSpecific) {
            for (var i = 0; i < handlersArray.length; i++) {
                if (handlersArray[i].handler.getVersion() == config.handlerVersionSpecific) {
                    isEvaluationVersionChosen = true;
                    index = i;
                    break;
                }
            }
        }
        else if (config.handlerVersionByTimeIntervalMinutes) {
            var date = config.handlerVersionByTimeInputDate || new Date();
            var hour = date.getUTCHours();
            var minutes = date.getUTCMinutes();
            index = Math.floor(((hour * 60) + minutes) / config.handlerVersionByTimeIntervalMinutes) % (handlersArray.length + 1);
            if (index != handlersArray.length) { 
                isEvaluationVersionChosen = true;
            }
        }
        else {
            var rand = config.handlerVersionRandom || (Math.random() * 100);
            for (var i = 0; i < handlersArray.length; i++) {
                if (rand >= handlersArray[i].minRate && rand < handlersArray[i].maxRate) {
                    isEvaluationVersionChosen = true;
                    index = i;
                    break;
                }
            }
        }

        if (isEvaluationVersionChosen == true && handlersArray[index].handler.isApplicable()) {
            return handlersArray[index].handler;
        }
        else {
            return null;
        }
    }    
}

function getCurrentTime() {
    "use strict";
    if (Date.now) {
        return Date.now();
    }
    return (new Date()).getTime();
}

function doesBrowserSupportHTML5Push() {
    "use strict";
    return typeof window.parent.postMessage === 'function' && window.JSON;
}

function dv_GetParam(url, name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS, 'i');
    var results = regex.exec(url);
    if (results == null) {
        return null;
    }
    else {
        return results[1];
    }
}

function dv_GetKeyValue(url) {
    var keyReg = new RegExp(".*=");
    var keyRet = url.match(keyReg)[0];
    keyRet = keyRet.replace("=", "");

    var valReg = new RegExp("=.*");
    var valRet = url.match(valReg)[0];
    valRet = valRet.replace("=", "");

    return {key: keyRet, value: valRet};
}

function dv_Contains(array, obj) {
    var i = array.length;
    while (i--) {
        if (array[i] === obj) {
            return true;
        }
    }
    return false;
}

function dv_GetDynamicParams(url, prefix) {
    try {
        prefix = (prefix != undefined && prefix != null) ? prefix : 'dvp';
        var regex = new RegExp("[\\?&](" + prefix + "_[^&]*=[^&#]*)", "gi");
        var dvParams = regex.exec(url);

        var results = [];
        while (dvParams != null) {
            results.push(dvParams[1]);
            dvParams = regex.exec(url);
        }
        return results;
    }
    catch (e) {
        return [];
    }
}

function dv_createIframe() {
    var iframe;
    if (document.createElement && (iframe = document.createElement('iframe'))) {
        iframe.name = iframe.id = 'iframe_' + Math.floor((Math.random() + "") * 1000000000000);
        iframe.width = 0;
        iframe.height = 0;
        iframe.style.display = 'none';
        iframe.src = 'about:blank';
    }

    return iframe;
}

function dv_GetRnd() {
    return ((new Date()).getTime() + "" + Math.floor(Math.random() * 1000000)).substr(0, 16);
}

function dv_SendErrorImp(serverUrl, errorsArr) {

    for (var j = 0; j < errorsArr.length; j++) {
        var errorObj = errorsArr[j];
        var errorImp = dv_CreateAndGetErrorImp(serverUrl, errorObj);
        dv_sendImgImp(errorImp);
    }
}

function dv_CreateAndGetErrorImp(serverUrl, errorObj) {
    var errorQueryString = '';
    for (var key in errorObj) {
        if (errorObj.hasOwnProperty(key)) {
            if (key.indexOf('dvp_jsErrUrl') == -1) {
                errorQueryString += '&' + key + '=' + errorObj[key];
            } else {
                var params = ['ctx', 'cmp', 'plc', 'sid'];
                for (var i = 0; i < params.length; i++) {
                    var pvalue = dv_GetParam(errorObj[key], params[i]);
                    if (pvalue) {
                        errorQueryString += '&dvp_js' + params[i] + '=' + pvalue;
                    }
                }
            }
        }
    }

    var windowProtocol = 'https:';
    var sslFlag = '&ssl=1';

    var errorImp = windowProtocol + '//' + serverUrl + sslFlag + errorQueryString;
    return errorImp;
}

function dv_sendImgImp(url) {
    (new Image()).src = url;
}

function dv_getPropSafe(obj, propName) {
    try {
        if (obj) {
            return obj[propName];
        }
    } catch (e) {
    }
}

function dvType() {
    var that = this;
    var eventsForDispatch = {};
    this.t2tEventDataZombie = {};

    this.processT2TEvent = function (data, tag) {
        try {
            if (tag.ServerPublicDns) {
                var tpsServerUrl = tag.dv_protocol + '//' + tag.ServerPublicDns + '/event.gif?impid=' + tag.uid;

                if (!tag.uniquePageViewId) {
                    tag.uniquePageViewId = data.uniquePageViewId;
                }

                tpsServerUrl += '&upvid=' + tag.uniquePageViewId;
                $dv.domUtilities.addImage(tpsServerUrl, tag.tagElement.parentElement);
            }
        } catch (e) {
            try {
                dv_SendErrorImp(window._dv_win.dv_config.tpsErrAddress + '/visit.jpg?ctx=818052&cmp=1619415&dvtagver=6.1.src&jsver=0&dvp_ist2tProcess=1', {dvp_jsErrMsg: encodeURIComponent(e)});
            } catch (ex) {
            }
        }
    };

    this.processTagToTagCollision = function (collision, tag) {
        var i;
        for (i = 0; i < collision.eventsToFire.length; i++) {
            this.pubSub.publish(collision.eventsToFire[i], tag.uid);
        }
        var tpsServerUrl = tag.dv_protocol + '//' + tag.ServerPublicDns + '/event.gif?impid=' + tag.uid;
        tpsServerUrl += '&colltid=' + collision.allReasonsForTagBitFlag;

        for (i = 0; i < collision.reasons.length; i++) {
            var reason = collision.reasons[i];
            tpsServerUrl += '&' + reason.name + "ms=" + reason.milliseconds;
        }

        if (collision.thisTag) {
            tpsServerUrl += '&tlts=' + collision.thisTag.t2tLoadTime;
        }
        if (tag.uniquePageViewId) {
            tpsServerUrl += '&upvid=' + tag.uniquePageViewId;
        }
        $dv.domUtilities.addImage(tpsServerUrl, tag.tagElement.parentElement);
    };

    this.processBSIdFound = function (bsID, tag) {
        var tpsServerUrl = tag.dv_protocol + '//' + tag.ServerPublicDns + '/event.gif?impid=' + tag.uid;
        tpsServerUrl += '&bsimpid=' + bsID;
        if (tag.uniquePageViewId) {
            tpsServerUrl += '&upvid=' + tag.uniquePageViewId;
        }
        $dv.domUtilities.addImage(tpsServerUrl, tag.tagElement.parentElement);
    };

    this.processBABSVerbose = function (verboseReportingValues, tag) {
        var queryString = "";
        


        var dvpPrepend = "&dvp_BABS_";
        queryString += dvpPrepend + 'NumBS=' + verboseReportingValues.bsTags.length;

        for (var i = 0; i < verboseReportingValues.bsTags.length; i++) {
            var thisFrame = verboseReportingValues.bsTags[i];

            queryString += dvpPrepend + 'GotCB' + i + '=' + thisFrame.callbackReceived;
            queryString += dvpPrepend + 'Depth' + i + '=' + thisFrame.depth;

            if (thisFrame.callbackReceived) {
                if (thisFrame.bsAdEntityInfo && thisFrame.bsAdEntityInfo.comparisonItems) {
                    for (var itemIndex = 0; itemIndex < thisFrame.bsAdEntityInfo.comparisonItems.length; itemIndex++) {
                        var compItem = thisFrame.bsAdEntityInfo.comparisonItems[itemIndex];
                        queryString += dvpPrepend + "tag" + i + "_" + compItem.name + '=' + compItem.value;
                    }
                }
            }
        }

        if (queryString.length > 0) {
            var tpsServerUrl = '';
            if (tag) {
                var tpsServerUrl = tag.dv_protocol + '//' + tag.ServerPublicDns + '/event.gif?impid=' + tag.uid;
            }
            var requestString = tpsServerUrl + queryString;
            $dv.domUtilities.addImage(requestString, tag.tagElement.parentElement);
        }
    };

    var messageEventListener = function (event) {
        try {
            var timeCalled = getCurrentTime();
            var data = window.JSON.parse(event.data);
            if (!data.action) {
                data = window.JSON.parse(data);
            }
            var myUID;
            var visitJSHasBeenCalledForThisTag = false;
            if ($dv.tags) {
                for (var uid in $dv.tags) {
                    if ($dv.tags.hasOwnProperty(uid) && $dv.tags[uid] && $dv.tags[uid].t2tIframeId === data.iFrameId) {
                        myUID = uid;
                        visitJSHasBeenCalledForThisTag = true;
                        break;
                    }
                }
            }

            var tag;
            switch (data.action) {
                case 'uniquePageViewIdDetermination':
                    if (visitJSHasBeenCalledForThisTag) {
                        $dv.processT2TEvent(data, $dv.tags[myUID]);
                        $dv.t2tEventDataZombie[data.iFrameId] = undefined;
                    }
                    else {
                        data.wasZombie = 1;
                        $dv.t2tEventDataZombie[data.iFrameId] = data;
                    }
                    break;
                case 'maColl':
                    tag = $dv.tags[myUID];
                    if (!tag.uniquePageViewId) {
                        tag.uniquePageViewId = data.uniquePageViewId;
                    }
                    data.collision.commonRecievedTS = timeCalled;
                    $dv.processTagToTagCollision(data.collision, tag);
                    break;
                case 'bsIdFound':
                    tag = $dv.tags[myUID];
                    if (!tag.uniquePageViewId) {
                        tag.uniquePageViewId = data.uniquePageViewId;
                    }
                    $dv.processBSIdFound(data.id, tag);
                    break;
                case 'babsVerbose':
                    try {
                        tag = $dv.tags[myUID];
                        $dv.processBABSVerbose(data, tag);
                    } catch (err) {
                    }
                    break;
            }

        } catch (e) {
            try {
                dv_SendErrorImp(window._dv_win.dv_config.tpsErrAddress + '/visit.jpg?ctx=818052&cmp=1619415&dvtagver=6.1.src&jsver=0&dvp_ist2tListener=1', {dvp_jsErrMsg: encodeURIComponent(e)});
            } catch (ex) {
            }
        }
    };

    if (window.addEventListener) {
        addEventListener("message", messageEventListener, false);
    }
    else {
        attachEvent("onmessage", messageEventListener);
    }

    this.pubSub = (function () {
        var previousEventsCapacity = 1000;
        var subscribers = {};       
        var eventsHistory = {};     
        var prerenderHistory = {};  
        return {
            subscribe: function (eventName, id, actionName, func, errFunc) {
                that.isPubSubEval = true;
                    handleHistoryEvents(eventName, id, func, errFunc);
                    if (!subscribers[eventName + id]) {
                        subscribers[eventName + id] = [];
                    }
                    subscribers[eventName + id].push({Func: func, ErrFunc: errFunc, ActionName: actionName});
            },

            publish: function (eventName, id, args) {
                var actionsResults = [];
                try {
                    if (eventName && id) {
                        if ($dv && $dv.tags[id] && $dv.tags[id].prndr) {
                            prerenderHistory[id] = prerenderHistory[id] || [];
                            prerenderHistory[id].push({eventName: eventName, args: args});
                        }
                        else {
                            actionsResults.push.apply(actionsResults, publishEvent(eventName, id, args));
                        }
                    }
                } catch (e) {
                }
                return actionsResults.join('&');
            },

            publishHistoryRtnEvent: function (id) {
                var actionsResults = [];
                if (prerenderHistory[id] instanceof Array) {
                    for (var i = 0; i < prerenderHistory[id].length; i++) {
                        var eventName = prerenderHistory[id][i].eventName;
                        var args = prerenderHistory[id][i].args;
                        if (eventName) {
                            actionsResults.push.apply(actionsResults, publishEvent(eventName, id, args));
                        }
                    }
                }

                prerenderHistory[id] = [];

                return actionsResults;
            }
        };

        function publishEvent(eventName, id, args) {
            var actionsResults = [];
            if (!eventsHistory[id]) {
                eventsHistory[id] = [];
            }
            if (eventsHistory[id].length < previousEventsCapacity) {
                eventsHistory[id].push({eventName: eventName, args: args});
            }

            if (subscribers[eventName + id] instanceof Array) {
                for (var i = 0; i < subscribers[eventName + id].length; i++) {
                    var funcObject = subscribers[eventName + id][i];
                    if (funcObject && funcObject.Func && typeof funcObject.Func == "function" && funcObject.ActionName) {
                        var isSucceeded = true;
                        try {
                            funcObject.Func(id, args);
                        } catch (e) {
                            isSucceeded = false;
                            if (typeof funcObject.ErrFunc == "function") {
                                runSafely(function () {
                                    funcObject.ErrFunc(e);
                                });
                            }
                        }
                        actionsResults.push(encodeURIComponent(funcObject.ActionName) + '=' + (isSucceeded ? '1' : '0'));
                    }
                }
            }

            return actionsResults;
        }

        function handleHistoryEvents(eventName, id, func, errFunc) {
            try {
                if (eventsHistory[id] instanceof Array) {
                    for (var i = 0; i < eventsHistory[id].length; i++) {
                        if (eventsHistory[id][i] && eventsHistory[id][i].eventName === eventName) {
                            func(id, eventsHistory[id][i].args);
                        }
                    }
                }
            } catch (e) {
                if (typeof errFunc == "function") {
                    runSafely(function () {
                        errFunc(e);
                    });
                }
            }
        }
    })();

    this.domUtilities = new function () {
        function getDefaultParent() {
            return document.body || document.head || document.documentElement;
        }

        this.createImage = function (parentElement) {
            parentElement = parentElement || getDefaultParent();
            var image = parentElement.ownerDocument.createElement("img");
            image.width = 0;
            image.height = 0;
            image.style.display = 'none';
            image.src = '';
            parentElement.insertBefore(image, parentElement.firstChild);
            return image;
        };

        var imgArr = [];
        var nextImg = 0;
        var imgArrCreated = false;
        if (!navigator.sendBeacon) {
            imgArr[0] = this.createImage();
            imgArr[1] = this.createImage();
            imgArrCreated = true;
        }

        this.addImage = function (url, parentElement, useGET, usePrerenderedImage) {
            parentElement = parentElement || getDefaultParent();
            if (!useGET && navigator.sendBeacon) {
                var message = appendCacheBuster(url);
                navigator.sendBeacon(message, {});
            } else {
                var image;
                if (usePrerenderedImage && imgArrCreated) {
                    image = imgArr[nextImg];
                    image.src = appendCacheBuster(url);
                    nextImg = (nextImg + 1) % imgArr.length;
                } else {
                    image = this.createImage(parentElement);
                    image.src = appendCacheBuster(url);
                    parentElement.insertBefore(image, parentElement.firstChild);
                }
            }
        };


        this.addScriptResource = function (url, parentElement) {
            parentElement = parentElement || getDefaultParent();
            var scriptElem = parentElement.ownerDocument.createElement("script");
            scriptElem.type = 'text/javascript';
            scriptElem.src = appendCacheBuster(url);
            parentElement.insertBefore(scriptElem, parentElement.firstChild);
        };

        this.addScriptCode = function (srcCode, parentElement) {
            parentElement = parentElement || getDefaultParent();
            var scriptElem = parentElement.ownerDocument.createElement("script");
            scriptElem.type = 'text/javascript';
            scriptElem.innerHTML = srcCode;
            parentElement.insertBefore(scriptElem, parentElement.firstChild);
        };

        this.addHtml = function (srcHtml, parentElement) {
            parentElement = parentElement || getDefaultParent();
            var divElem = parentElement.ownerDocument.createElement("div");
            divElem.style = "display: inline";
            divElem.innerHTML = srcHtml;
            parentElement.insertBefore(divElem, parentElement.firstChild);
        };
    };

    this.resolveMacros = function (str, tag) {
        var viewabilityData = tag.getViewabilityData();
        var viewabilityBuckets = viewabilityData && viewabilityData.buckets ? viewabilityData.buckets : {};
        var upperCaseObj = objectsToUpperCase(tag, viewabilityData, viewabilityBuckets);
        var newStr = str.replace('[DV_PROTOCOL]', upperCaseObj.DV_PROTOCOL);
        newStr = newStr.replace('[PROTOCOL]', upperCaseObj.PROTOCOL);
        newStr = newStr.replace(/\[(.*?)\]/g, function (match, p1) {
            var value = upperCaseObj[p1];
            if (value === undefined || value === null) {
                value = '[' + p1 + ']';
            }
            return encodeURIComponent(value);
        });
        return newStr;
    };

    this.settings = new function () {
    };

    this.tagsType = function () {
    };

    this.tagsPrototype = function () {
        this.add = function (tagKey, obj) {
            if (!that.tags[tagKey]) {
                that.tags[tagKey] = new that.tag();
            }
            for (var key in obj) {
                that.tags[tagKey][key] = obj[key];
            }
        };
    };

    this.tagsType.prototype = new this.tagsPrototype();
    this.tagsType.prototype.constructor = this.tags;
    this.tags = new this.tagsType();

    this.tag = function () {
    };

    this.tagPrototype = function () {
        this.set = function (obj) {
            for (var key in obj) {
                this[key] = obj[key];
            }
        };

        this.getViewabilityData = function () {
        };
    };

    this.tag.prototype = new this.tagPrototype();
    this.tag.prototype.constructor = this.tag;

    
    this.eventBus = (function () {
        var getRandomActionName = function () {
            return 'EventBus_' + Math.random().toString(36) + Math.random().toString(36);
        };
        return {
            addEventListener: function (dvFrame, eventName, func, errFunc) {
                that.pubSub.subscribe(eventName, dvFrame.$frmId, getRandomActionName(), func, errFunc);
            },
            dispatchEvent: function (dvFrame, eventName, data) {
                that.pubSub.publish(eventName, dvFrame.$frmId, data);
            }
        };
    })();

    
    var messagesClass = function () {
        var waitingMessages = [];

        this.registerMsg = function (dvFrame, data) {
            if (!waitingMessages[dvFrame.$frmId]) {
                waitingMessages[dvFrame.$frmId] = [];
            }

            waitingMessages[dvFrame.$frmId].push(data);

            if (dvFrame.$uid) {
                sendWaitingEventsForFrame(dvFrame, dvFrame.$uid);
            }
        };

        this.startSendingEvents = function (dvFrame, impID) {
            sendWaitingEventsForFrame(dvFrame, impID);
            
        };

        function sendWaitingEventsForFrame(dvFrame, impID) {
            if (waitingMessages[dvFrame.$frmId]) {
                var eventObject = {};
                while (waitingMessages[dvFrame.$frmId].length) {
                    var obj = waitingMessages[dvFrame.$frmId].shift();
                    for (var key in obj) {
                        if (typeof obj[key] !== 'function' && obj.hasOwnProperty(key)) {
                            eventObject[key] = obj[key];
                        }
                    }
                }
                that.registerEventCall(impID, eventObject);
            }
        }

        function startMessageManager() {
            for (var frm in waitingMessages) {
                if (frm && frm.$uid) {
                    sendWaitingEventsForFrame(frm, frm.$uid);
                }
            }
            setTimeout(startMessageManager, 10);
        }
    };
    this.messages = new messagesClass();

    var MAX_EVENTS_THRESHOLD = 100;
    window.eventsCounter = window.eventsCounter || {};
    var getImpressionIdToCall = function (impressionId) {
        return window.eventsCounter[impressionId] < MAX_EVENTS_THRESHOLD ? impressionId : 'tme-' + impressionId;
    };
    this.registerEventCall = function (impressionId, eventObject, timeoutMs, isRegisterEnabled, usePrerenderedImage) {
            window.eventsCounter[impressionId] =
                window.eventsCounter[impressionId] ? window.eventsCounter[impressionId] + 1 : 1;

            var avoTimeout = 3000;
            if (this.tags[impressionId] && this.tags[impressionId].AVO
                && this.tags[impressionId].AVO['cto'] != undefined && !isNaN(this.tags[impressionId].AVO['cto'])) {
                avoTimeout = window._dv_win.$dv.tags[impressionId].AVO['cto'];
            }

            if (isRegisterEnabled !== false && avoTimeout) {
                addEventCallForDispatch(impressionId, eventObject);

                if (!timeoutMs || isNaN(timeoutMs)) {
                    timeoutMs = avoTimeout;
                }

                var localThat = this;
                setTimeout(
                    function () {
                        localThat.dispatchEventCalls(impressionId);
                    }, timeoutMs);

            } else {
                this.dispatchEventImmediate(impressionId, eventObject);
            }
    };

    this.dispatchEventImmediate = function (impressionId, eventObject, timeoutMs, isRegisterEnabled, usePrerenderedImage) {
        var url = this.tags[impressionId].protocol + '//' + this.tags[impressionId].ServerPublicDns + "/event.gif?impid=" +impressionId + '&' + createQueryStringParams(eventObject);

        this.domUtilities.addImage(url, this.tags[impressionId].tagElement.parentNode, false, usePrerenderedImage);
    };

    var mraidObjectCache;
    this.getMraid = function () {
        var context = window._dv_win || window;
        var iterationCounter = 0;
        var maxIterations = 20;

        function getMraidRec(context) {
            iterationCounter++;
            var isTopWindow = context.parent == context;
            if (context.mraid || isTopWindow) {
                return context.mraid;
            } else {
                return ( iterationCounter <= maxIterations ) && getMraidRec(context.parent);
            }
        }

        try {
            return mraidObjectCache = mraidObjectCache || getMraidRec(context);
        } catch (e) {
        }
    };

    var dispatchEventCallsNow = function (impressionId, eventObject) {
        addEventCallForDispatch(impressionId, eventObject);
        dispatchEventCalls(impressionId);
    };

    var addEventCallForDispatch = function (impressionId, eventObject) {
        for (var key in eventObject) {
            if (typeof eventObject[key] !== 'function' && eventObject.hasOwnProperty(key)) {
                if (!eventsForDispatch[impressionId]) {
                    eventsForDispatch[impressionId] = {};
                }
                eventsForDispatch[impressionId][key] = eventObject[key];
            }
        }
    };

    this.dispatchRegisteredEventsFromAllTags = function () {
        for (var impressionId in this.tags) {
            if (typeof this.tags[impressionId] !== 'function' && typeof this.tags[impressionId] !== 'undefined') {
                this.dispatchEventCalls(impressionId);
            }
        }

        
        this.registerEventCall = this.dispatchEventImmediate;
    };

    this.dispatchEventCalls = function (impressionId) {
        if (typeof eventsForDispatch[impressionId] !== 'undefined' && eventsForDispatch[impressionId] != null) {
            var url = this.tags[impressionId].protocol + '//' + this.tags[impressionId].ServerPublicDns +
                "/event.gif?impid=" + impressionId+ '&' + createQueryStringParams(eventsForDispatch[impressionId]);
            this.domUtilities.addImage(url, this.tags[impressionId].tagElement.parentElement);
            eventsForDispatch[impressionId] = null;
        }
    };

    if (window.addEventListener) {
        window.addEventListener('unload', function () {
            that.dispatchRegisteredEventsFromAllTags();
        }, false);
        window.addEventListener('beforeunload', function () {
            that.dispatchRegisteredEventsFromAllTags();
        }, false);
    }
    else if (window.attachEvent) {
        window.attachEvent('onunload', function () {
            that.dispatchRegisteredEventsFromAllTags();
        }, false);
        window.attachEvent('onbeforeunload', function () {
            that.dispatchRegisteredEventsFromAllTags();
        }, false);
    }
    else {
        window.document.body.onunload = function () {
            that.dispatchRegisteredEventsFromAllTags();
        };
        window.document.body.onbeforeunload = function () {
            that.dispatchRegisteredEventsFromAllTags();
        };
    }

    var createQueryStringParams = function (values) {
        var params = '';
        for (var key in values) {
            if (typeof values[key] !== 'function') {
                var value = encodeURIComponent(values[key]);
                if (params === '') {
                    params += key + '=' + value;
                }
                else {
                    params += '&' + key + '=' + value;
                }
            }
        }

        return params;
    };

    this.Enums = {
        BrowserId: {Others: 0, IE: 1, Firefox: 2, Chrome: 3, Opera: 4,
            Safari: 5, ChromeWebView: 6, SafariWebView: 7, PhantomJS: 99},
        TrafficScenario: {OnPage: 1, SameDomain: 2, CrossDomain: 128}
    };

    this.CommonData = {};

    var runSafely = function (action) {
        try {
            var ret = action();
            return ret !== undefined ? ret : true;
        } catch (e) {
            return false;
        }
    };

    var objectsToUpperCase = function () {
        var upperCaseObj = {};
        for (var i = 0; i < arguments.length; i++) {
            var obj = arguments[i];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    upperCaseObj[key.toUpperCase()] = obj[key];
                }
            }
        }
        return upperCaseObj;
    };

    var appendCacheBuster = function (url) {
        if (url !== undefined && url !== null && url.match("^http") == "http") {
            if (url.indexOf('?') !== -1) {
                if (url.slice(-1) == '&') {
                    url += 'cbust=' + dv_GetRnd();
                }
                else {
                    url += '&cbust=' + dv_GetRnd();
                }
            }
            else {
                url += '?cbust=' + dv_GetRnd();
            }
        }
        return url;
    };
}

var BrowserDetector = function () {
    var DetectionAreaEnum = {
        USER_AGENT_ONLY: 0,
        PROPERTIES_ONLY: 1,
        USER_AGENT_AND_PROPERTIES: 2
    };
    var BrowserTypeEnum = {
        Other: 0,
        IE: 1,
        Firefox: 2,
        Chrome: 3,
        Opera: 4,
        Safari: 5,
        ChromeWebView: 6,
        SafariWebView: 7,
        PhantomJS: 99
    };

    var Browser = function (browserID, detectionArea, browserDetectorRegexStr, browserVersionRegexStr, propertiesRuleFunc) {
        return {
            browserID: browserID,
            version: '',
            detectionArea: detectionArea,
            userAgentRules: {
                browserTypeRegexStr: browserDetectorRegexStr,
                browserVersionRegexStr: browserVersionRegexStr,
                passed: false
            },
            propertiesRules: {
                evaluatePropertiesRule: propertiesRuleFunc,
                passed: false
            }
        }
    };

    
    var BrowsersData = [

        
        Browser(
            BrowserTypeEnum.ChromeWebView,
            DetectionAreaEnum.USER_AGENT_ONLY,
            '(?:wv(.*?))version\/[0-9]+(?:.[0-9]+)* chrome\/[0-9]+(?:.[0-9]+)* mobile|version\/[0-9]+(?:.[0-9]+)* chrome\/[0-9]+(?:.[0-9]+)* mobile', 'chrome\/',
            null),
        Browser(
            BrowserTypeEnum.SafariWebView,
            DetectionAreaEnum.USER_AGENT_AND_PROPERTIES,
            '(?=.*(iphone|ipod|ipad))(?=^(?:(?!safari).)*$).*$', '',
            function () {
                return !window.navigator.standalone;
            }
        ),
        Browser(
            BrowserTypeEnum.IE,
            DetectionAreaEnum.PROPERTIES_ONLY,
            'msie|trident/7.*rv:11|rv:11.*trident/7|edge/', '(msie |rv:| edge/)',
            function () {
                return document.uniqueID != undefined &&
                    typeof document.uniqueID == 'string' &&
                    ((document.documentMode != undefined && document.documentMode >= 0) ||
                    (document.all != undefined && typeof document.all == 'object') ||
                    (window.ActiveXObject != undefined && typeof window.ActiveXObject == "function")) ||
                    (window.document && window.document.updateSettings && typeof window.document.updateSettings == "function");
            }),
        Browser(
            BrowserTypeEnum.Firefox,
            DetectionAreaEnum.PROPERTIES_ONLY,
            'firefox', 'firefox\/',
            function () {
                return window.mozInnerScreenY != undefined &&
                    typeof window.mozInnerScreenY == 'number' &&
                    window.mozPaintCount != undefined &&
                    window.mozPaintCount >= 0 &&
                    window.InstallTrigger != undefined &&
                    window.InstallTrigger.install != undefined;
            }),
        Browser(
            BrowserTypeEnum.Opera,
            DetectionAreaEnum.PROPERTIES_ONLY,
            'opr|opera', 'opr\/|version\/',
            function () {
                return (window.opera != undefined && window.history.navigationMode != undefined) ||
                    (window.opr != undefined && window.opr.addons != undefined
                    && typeof window.opr.addons.installExtension == 'function');
            }),
        Browser(
            BrowserTypeEnum.Chrome,
            DetectionAreaEnum.PROPERTIES_ONLY,
            'chrome', 'chrome\/',
            function () {
                return window.chrome != undefined &&
                    typeof window.chrome.csi == 'function' &&
                    typeof window.chrome.loadTimes == 'function' &&
                    document.webkitHidden != undefined &&
                    (document.webkitHidden == true || document.webkitHidden == false);
            }),
        Browser(
            BrowserTypeEnum.Safari,
            DetectionAreaEnum.PROPERTIES_ONLY,
            'safari|(os |os x )[0-9].*applewebkit', 'version\/',
            function () {
                var p = document.createElement('p');
                p.innerText = '.';
                p.style = 'text-shadow: rgb(99, 116, 171) 20px -12px 2px';

                return ((Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) ||
                    (window.webkitAudioPannerNode && window.webkitConvertPointFromNodeToPage)) &&
                    window.innerWidth != undefined && window.innerHeight != undefined && p.style.textShadow != undefined;
            }),
        Browser(
            BrowserTypeEnum.PhantomJS,
            DetectionAreaEnum.PROPERTIES_ONLY,
            '',
            '',
            function () {
                return typeof window.callPhantom === 'function';
            }),
        Browser(
            BrowserTypeEnum.Other,
            DetectionAreaEnum.USER_AGENT_ONLY,
            'mozilla.*android.*applewebkit(?!.*chrome.*)|linux.*android.*applewebkit.* version/.*chrome',
            '',
            null),
        Browser(
            BrowserTypeEnum.Other,
            DetectionAreaEnum.USER_AGENT_ONLY,
            'aol/.*aolbuild/|aolbuild/.*aol/|puffin|maxthon|valve|silk|playstation|playstation|nintendo|wosbrowser',
            '',
            null)
    ];

    var getBrowserVersion = function (browserVersionRegexStr, useragent) {
        var browserVersionRegex;
        var browserVersion = '';

        if (browserVersionRegexStr.length > 0) {
            browserVersionRegex = new RegExp(browserVersionRegexStr + '[0-9]+(?:.[0-9]+)*');
            var match = useragent.match(browserVersionRegex);
            if (match != null && match[0] != null) {
                browserVersion = match[0].replace(useragent.match(new RegExp(browserVersionRegexStr))[0], '');
            }
        }

        return browserVersion;
    };
    
    var isBrowserType = function (browserTypeRegexStr, useragent) {

        var browserTypeRegExp;
        if (browserTypeRegexStr.length > 0) {
            browserTypeRegExp = new RegExp(browserTypeRegexStr);
            return browserTypeRegExp.test(useragent);
        }
    };

    var fillBrowserDetailsByUserAgent = function (ua) {
        var useragent_lowerCase = ua.toLowerCase();
        for (var i = 0; i < BrowsersData.length; i++) {

            if (isBrowserType(BrowsersData[i].userAgentRules.browserTypeRegexStr ,useragent_lowerCase)) {
                BrowsersData[i].userAgentRules.passed = true;
                BrowsersData[i].version = getBrowserVersion(BrowsersData[i].userAgentRules.browserVersionRegexStr, useragent_lowerCase);
            }
        }
    };

    var fillBrowserDetailsByProperties = function () {
        for (var i = 0; i < BrowsersData.length; i++) {
            if (BrowsersData[i].propertiesRules.evaluatePropertiesRule) {
                try {
                    BrowsersData[i].propertiesRules.passed = BrowsersData[i].propertiesRules.evaluatePropertiesRule();
                }
                catch (e) {}
            }
        }
    };

    this.getBrowsersData = function () {
      return BrowsersData;
    };

    this.getBrowserIdAndVersion = function (ua) {
        var browserIdByUserAgent;
        var browserIdByProperties;
        var browserVersion;

        fillBrowserDetailsByUserAgent(ua);
        fillBrowserDetailsByProperties();

        for (var i = 0; i < BrowsersData.length; i++) {

            if (BrowsersData[i].detectionArea == DetectionAreaEnum.USER_AGENT_AND_PROPERTIES) {
                if (BrowsersData[i].userAgentRules.passed == true &&
                    BrowsersData[i].propertiesRules.passed == true) {
                    browserIdByUserAgent = BrowsersData[i].browserID;
                    browserIdByProperties = BrowsersData[i].browserID;
                }
            }
            else if (BrowsersData[i].detectionArea == DetectionAreaEnum.USER_AGENT_ONLY) {
                if (BrowsersData[i].userAgentRules.passed == true) {
                    
                    browserIdByUserAgent = BrowsersData[i].browserID;
                    browserIdByProperties = BrowsersData[i].browserID;
                }
            }
            else {
                if (browserIdByUserAgent == undefined && BrowsersData[i].userAgentRules.passed == true) {
                    browserIdByUserAgent = BrowsersData[i].browserID;
                }
                if (browserIdByProperties == undefined && BrowsersData[i].propertiesRules.passed == true) {
                    browserIdByProperties = BrowsersData[i].browserID;
                }
            }

            if (browserIdByProperties != undefined && browserIdByUserAgent != undefined) {
                break;
            }
        }

        browserVersion = browserIdByProperties === browserIdByUserAgent ? BrowsersData[i].version : '';
        return {
            ID: browserIdByProperties,
            version: browserVersion,
            ID_UA: browserIdByUserAgent
        };
    };
};

function dv_baseHandler(){function V(b){var c=window._dv_win,f=0;try{for(;10>f;){if(c[b]&&"object"===typeof c[b])return!0;if(c==c.parent)break;f++;c=c.parent}}catch(e){}return!1}function W(){var b="http:";"http:"!=window._dv_win.location.protocol&&(b="https:");return b}function X(b){var c="http:";"https"!=b.match("^https")||"http"==window._dv_win.location.toString().match("^http")&&"https"!=window._dv_win.location.toString().match("^https")||(c="https:");return c}function Y(){var b="";try{var c=eval(function(b,
c,d,g,m,k){m=function(b){return(b<c?"":m(parseInt(b/c)))+(35<(b%=c)?String.fromCharCode(b+29):b.toString(36))};if(!"".replace(/^/,String)){for(;d--;)k[m(d)]=g[d]||m(d);g=[function(b){return k[b]}];m=function(){return"\\w+"};d=1}for(;d--;)g[d]&&(b=b.replace(new RegExp("\\b"+m(d)+"\\b","g"),g[d]));return b}("(13(){1C{1C{2m('1a?1x:1Y')}1v(e){y{m:\"-99\"}}13 3r(21,2J,1V){10(d 1S 3T 21){G(1S.3u(2J)>-1&&(!1V||1V(21[1S])))y 1x}y 1Y}13 g(s){d h=\"\",t=\"6s.;j&6w}6u/0:6l'6d=B(6c-5E!,5c)5r\\\\{ >4Y+4W\\\"5w<\";10(i=0;i<s.1c;i++)f=s.3l(i),e=t.3u(f),0<=e&&(f=t.3l((e+41)%82)),h+=f;y h}13 1X(34,1m){1C{G(34())m.1B((1a==1a.2z?-1:1)*1m)}1v(e){m.1B(-5z*1m);V.1B(1m+\"=\"+(e.5A||\"5s\"))}}d c=['5q\"1u-5f\"5o\"2O','p','l','60&p','p','{','\\\\<}4\\\\5n-5S<\"5m\\\\<}4\\\\5p<Z?\"6','e','5l','-5,!u<}\"5k}\"','p','J','-5g}\"<5h','p','=o','\\\\<}4\\\\35\"2f\"w\\\\<}4\\\\35\"2f\"5i}2\"<,u\"<5}?\"6','e','J=',':<5j}T}<\"','p','h','\\\\<}4\\\\8-2}\"E(n\"18}9?\\\\<}4\\\\8-2}\"E(n\"2p<N\"[1p*1t\\\\\\\\2V-5B<25\"24\"5C]1i}C\"12','e','5D','\\\\<}4\\\\5y;5u||\\\\<}4\\\\5t?\"6','e','+o','\"1l\\\\<}4\\\\3w\"I<-5v\"2h\"5\"5x}2k<}5e\"1l\\\\<}4\\\\1D}1Q>1I-1N}2}\"2h\"5\"5d}2k<}4V','e','=J','17}U\"<5}4X\"7}F\\\\<}4\\\\[4Z}4U:4T]k}b\\\\<}4\\\\[t:33\"4P]k}b\\\\<}4\\\\[4O})5-u<}t]k}b\\\\<}4\\\\[4Q]k}b\\\\<}4\\\\[4R}4S]k}50','e','51',':59}<\"K-1J/2M','p','5a','\\\\<}4\\\\1d<U/1s}b\\\\<}4\\\\1d<U/!k}9','e','=l','14\\\\<}4\\\\5b}/58}U\"<5}57\"7}53<2n}52\\\\54\"55}/k}2o','e','=S=','\\\\<}4\\\\E-56\\\\<}4\\\\E-5F\"5\\\\U?\"6','e','+J','\\\\<}4\\\\22!6g\\\\<}4\\\\22!6h)p?\"6','e','6i','-}\"6j','p','x{','\\\\<}4\\\\E<23-6f}6e\\\\<}4\\\\6a\"69-6b\\\\<}4\\\\6k.42-2}\"6t\\\\<}4\\\\6v<N\"K}6r?\"6','e','+S','17}U\"<5}Q\"1g\"7}F\\\\<}4\\\\v<1E\"1l\\\\<}4\\\\v<2t}U\"<5}1j\\\\<}4\\\\1o-2.42-2}\"w\\\\<}4\\\\1o-2.42-2}\"1q\"L\"\"M<38\"39\"3a<\"<5}2X\"3h\\\\<Z\"3z<X\"3y{3B:3s\\\\36<1r}3v-3x<}3g\"2Y\"1w%3f<X\"1w%3e?\"3d\"16\"7}2W','e','6n','6m:,','p','6o','\\\\<}4\\\\6p\\\\<}4\\\\2I\"2H\\\\<}4\\\\2I\"2G,T}2R+++++1j\\\\<}4\\\\6q\\\\<}4\\\\2q\"2H\\\\<}4\\\\2q\"2G,T}2R+++++t','e','68','\\\\<}4\\\\67\"1J\"5P}b\\\\<}4\\\\E\\\\5O<M?\"6','e','5Q','17}U\"<5}Q:5R\\\\<}4\\\\8-2}\"1q\".42-2}\"4N-5N<N\"5L<5H<5G}C\"3H<5I<5J[<]E\"27\"1u}\"2}\"5K[<]E\"27\"1u}\"2}\"E<}1h&5T\"1\\\\<}4\\\\2u\\\\5U\\\\<}4\\\\2u\\\\1D}1Q>1I-1N}2}\"z<63-2}\"64\"2.42-2}\"65=66\"7}62\"7}P=61','e','x','5W)','p','+','\\\\<}4\\\\2B:5V<5}5X\\\\<}4\\\\2B\"5Y?\"6','e','5Z','L!!6x.3Q.K 3R','p','x=','\\\\<}4\\\\3O}3N)u\"3K\\\\<}4\\\\3Z-2?\"6','e','+=','\\\\<}4\\\\2r\"40\\\\<}4\\\\2r\"3Y--3X<\"2f?\"6','e','x+','\\\\<}4\\\\8-2}\"2v}\"2w<N\"w\\\\<}4\\\\8-2}\"2v}\"2w<N\"3U\")3V\"<:3W\"44}9?\"6','e','+x','\\\\<}4\\\\2F)u\"3C\\\\<}4\\\\2F)u\"3I?\"6','e','3G','\\\\<}4\\\\2P}s<3F\\\\<}4\\\\2P}s<3D\" 4M-4z?\"6','e','4B','\\\\<}4\\\\E\"4y-2}\"E(n\"4x<N\"[1p*45\"4t<4u]4v?\"6','e','+e','\\\\<}4\\\\8-2}\"E(n\"18}9?\\\\<}4\\\\8-2}\"E(n\"4w<:[\\\\4C}}2M][\\\\4D,5}2]4J}C\"12','e','4K','14\\\\<}4\\\\4L}4H\\\\<}4\\\\4F$4G','e','4s',':4r<Z','p','4c','\\\\<}4\\\\E-4d\\\\<}4\\\\E-4e}4b\\\\<}4\\\\E-47<48?\"6','e','49','$K:4g}Z!4h','p','+h','\\\\<}4\\\\E\"1K\\\\<}4\\\\E\"1O-4o?\"6','e','4p','14\\\\<}4\\\\4q:,2j}U\"<5}1A\"7}4n<4m<2n}2o','e','4j','\\\\<}4\\\\1d<U/4k&2i\"E/30\\\\<}4\\\\1d<U/4l}C\"3b\\\\<}4\\\\1d<U/f[&2i\"E/30\\\\<}4\\\\1d<U/4i[S]]3w\"46}9?\"6','e','4a','4E}4I}4A>2s','p','3E','\\\\<}4\\\\1e:<1G}s<3J}b\\\\<}4\\\\1e:<1G}s<43<}f\"u}2g\\\\<}4\\\\2e\\\\<}4\\\\1e:<1G}s<C[S]E:33\"1s}9','e','l{','3S\\'<}4\\\\T}3M','p','==','\\\\<}4\\\\v<1E\\\\<}4\\\\v<2C\\\\<Z\"2y\\\\<}4\\\\v<2x<X\"?\"6','e','3L','\\\\<}4\\\\3k}3j-3p\"}2b<3P\\\\<}4\\\\3k}3j-3p\"}2b/2Q?\"6','e','=8q','\\\\<}4\\\\E\"2f\"8r\\\\<}4\\\\8s<8p?\"6','e','o{','\\\\<}4\\\\8o-)2\"2U\"w\\\\<}4\\\\1e-8k\\\\1u}s<C?\"6','e','+l','\\\\<}4\\\\31-2\"8l\\\\<}4\\\\31-2\"8m<Z?\"6','e','+{','\\\\<}4\\\\E:8n}b\\\\<}4\\\\8t-8u}b\\\\<}4\\\\E:8B\"<8C\\\\}k}9?\"6','e','{S','\\\\<}4\\\\1f}\"11}8D\"-8A\"2f\"q\\\\<}4\\\\r\"<5}8z?\"6','e','o+',' &K)&8v','p','8w','\\\\<}4\\\\E.:2}\"c\"<8x}b\\\\<}4\\\\8y}b\\\\<}4\\\\8j<}f\"u}2g\\\\<}4\\\\2e\\\\<}4\\\\1D:}\"k}9','e','8i','83\"5-\\'2d:2M','p','J{','\\\\<}4\\\\85\"5-\\'2d:86}81=80:D|q=2l|7W-5|7X--1J/2\"|2N-2l|7Z\"=87\"2f\"q\\\\<}4\\\\1R\"2c:2a<1r}D?\"6','e','=88','\\\\<}4\\\\8-2}\"E(n\"18}9?\\\\<}4\\\\8-2}\"E(n\"2p<N\"[1p*1t\\\\\\\\2V-25\"24/8f<8g]1i}C\"12','e','8h',')8e!8d}s<C','p','8F','\\\\<}4\\\\26<<8a\\\\<}4\\\\26<<8b<}f\"u}8c?\"6','e','{l','\\\\<}4\\\\28.L>g;K\\'T)Y.8E\\\\<}4\\\\28.L>g;6y&&92>K\\'T)Y.I?\"6','e','l=','14\\\\<}4\\\\8X\\\\95>8Z}U\"<5}1A\"7}F\"2T}U\"<5}94\\\\<}4\\\\9a<23-20\"u\"97}U\"<5}1A\"7}F\"2T}U\"<5}96','e','{J','K:<Z<:5','p','8W','\\\\<}4\\\\k\\\\<}4\\\\E\"8V\\\\<}4\\\\r\"<5}3A\"3c}/1j\\\\<}4\\\\8-2}\"37<}1h&8L\\\\<}4\\\\r\"<5}1k\"}u-8K=?17}U\"<5}Q\"8J:8H\\\\<}4\\\\1f}\"r\"<5}8N\"7}8O\"16\"7}F\"8U','e','8S','\\\\<}4\\\\1L-U\\\\w\\\\<}4\\\\1L-8R\\\\<}4\\\\1L-\\\\<}?\"6','e','8P','8Q-N:8T','p','8G','\\\\<}4\\\\1M\"8M\\\\<}4\\\\1M\"98\"<5}8Y\\\\<}4\\\\1M\"90||\\\\<}4\\\\91?\"6','e','h+','89<u-7U/','p','{=','\\\\<}4\\\\r\"<5}1k\"}u-70\\\\<}4\\\\1D}1Q>1I-1N}2}\"q\\\\<}4\\\\r\"<5}1k\"}u-2D','e','=S','\\\\<}4\\\\71\"1l\\\\<}4\\\\72}U\"<5}1j\\\\<}4\\\\6Z?\"6','e','{o','\\\\<}4\\\\7V}<6Y\\\\<}4\\\\6U}?\"6','e','=6W','\\\\<}4\\\\v<1E\\\\<}4\\\\v<2C\\\\<Z\"2y\\\\<}4\\\\v<2x<X\"w\"1l\\\\<}4\\\\v<2t}U\"<5}t?\"6','e','J+','c>A','p','=','17}U\"<5}Q\"1g\"7}F\\\\<}4\\\\E\"73\"74:7a}7b^[7c,][79+]78\\'<}4\\\\75\"2f\"q\\\\<}4\\\\E}u-77\"16\"7}6T=6S','e','6F','\\\\<}4\\\\1P:!32\\\\<}4\\\\8-2}\"E(n\"18}9?\\\\<}4\\\\8-2}\"E(n\"1H<:[f\"2O*6G<X\"6H]6E<:[<Z*1t:Z,1F]1i}C\"12','e','=6D','\\\\<}4\\\\2S\"<2L-2K-u}6z\\\\<}4\\\\2S\"<2L-2K-u}6A?\"6','e','{x','6B}7K','p','6C','\\\\<}4\\\\8-2}\"E(n\"18}9?\\\\<}4\\\\8-2}\"E(n\"1H<:[<Z*1t:Z,1F]F:<6J[<Z*6P]1i}C\"12','e','h=','6Q-2}\"r\"<5}k}9','e','6R','\\\\<}4\\\\8-2}\"E(n\"18}9?\\\\<}4\\\\8-2}\"E(n\"1H<:[<Z*6O}1F]R<-C[1p*6K]1i}C\"12','e','6L','14\\\\<}4\\\\29\"\\\\6M\\\\<}4\\\\29\"\\\\7d','e','7e','\\\\<}4\\\\1R\"w\\\\<}4\\\\1R\"2c:2a<1r}?\"6','e','{e','\\\\<}4\\\\7G}Z<}7H}b\\\\<}4\\\\7I<f\"k}b\\\\<}4\\\\7F/<}C!!7E<\"42.42-2}\"1s}b\\\\<}4\\\\7A\"<5}k}9?\"6','e','7B','T>;7C\"<4f','p','h{','\\\\<}4\\\\7J<u-7L\\\\7R}b\\\\<}4\\\\1e<}7S}9?\"6','e','7T','\\\\<}4\\\\E\"1K\\\\<}4\\\\E\"1O-3o}U\"<5}Q\"1g\"7}F\\\\<}4\\\\1f}\"r\"<5}1k\"E<}1h&3n}3m=w\\\\<}4\\\\1f}\"8-2}\"1q\".42-2}\"7Q}\"u<}7P}7M\"16\"7}F\"3t?\"6','e','{h','\\\\<}4\\\\7N\\\\<}4\\\\7O}<(7z?\"6','e','7y','\\\\<}4\\\\7l<U-2Z<7m&p?14\\\\<}4\\\\7n<U-2Z<7k/2j}U\"<5}1A\"7}F\"7j','e','=7f','7g\\'<7h\"','p','{{','\\\\<}4\\\\E\"1K\\\\<}4\\\\E\"1O-3o}U\"<5}Q\"1g\"7}F\\\\<}4\\\\1f}\"r\"<5}1k\"E<}1h&3n}3m=7i\"16\"7}F\"3t?\"6','e','7o','17}U\"<5}Q\"1g\"7}F\\\\<}4\\\\1P:!32\\\\<}4\\\\1o-2.42-2}\"w\\\\<}4\\\\1o-2.42-2}\"1q\"L\"\"M<38\"39\"3a<\"<5}2X\"3h\\\\<Z\"3z<X\"3y{3B:3s\\\\36<1r}3v-3x<}3g\"2Y\"1w%3f<X\"1w%3e?\"3d\"16\"7}2W','e','{+','\\\\<}4\\\\7t<7q a}7s}b\\\\<}4\\\\E}7r\"7u 7x- 1s}9','e','7w','7v\\\\<}4\\\\r\"<5}1P}7p\"5M&M<C<}7D}C\"3b\\\\<}4\\\\r\"<5}3A\"3c}/1j\\\\<}4\\\\8-2}\"6N\\\\<}4\\\\8-2}\"37<}1h&6I[S]76=?\"6','e','l+'];d 1y='(13(){d m=[],V=[];'+3r.3q()+1X.3q()+'';10(d j=0;j<c.1c;j+=3){1y+='1X(13(){y '+(c[j+1]=='p'?'1a[\"'+g(c[j])+'\"]!=6X':g(c[j]))+'}, '+6V(g(c[j+2]))+');'}1y+='y {m:m,V:V}})();';d H=[];d 1W=[];d 1b=1a;10(d i=0;i<93;i++){d O=1b.2m(1y);G(O.V.1c>15){y{m:O.V[0]}}10(d 19=0;19<O.m.1c;19++){d 1z=1Y;10(d W=0;W<H.1c;W++){G(H[W]==O.m[19]){1z=1x;1n}2A G(1Z.1T(H[W])==1Z.1T(O.m[19])){H[W]=1Z.1T(H[W]);1z=1x;1n}}G(!1z)H.1B(O.m[19])}G(1b==1a.2z){1n}2A{1C{G(1b.2E.7Y.84)1b=1b.2E}1v(e){1n}}}d 1U={m:H.3i(\",\")};G(1W.1c>0)1U.V=1W.3i(\"&\");y 1U}1v(e){y{m:\"-8I\"}}})()",
62,569,"    Z5  Ma2vsu4f2 aM EZ5Ua a44  a44OO  var       P1  res a2MQ0242U    E45Uu    E3 OO  return        if results   _    currentResults  qD8     err ri C3   for  3RSvsu4f2 function U5q  U3q2D8M2 qsa 5ML44P1 cri window currWindow length EBM E_ ENuM2 MQ8M2 Z27 WDE42 tOO E35f QN25sF ci break EsMu fMU EC2 ZZ2 fP1  g5 catch vFoS true fc exists q5D8M2 push try E2 M5OO _t ZU5 5ML44qWZ Tg5 uM UIuCTZOO Euf EuZ N5 UT Eu U5Z2c EfaNN_uZf_35f prop abs response func errors ei false Math  wnd E_Y sMu MuU kN7 E__  EcIT_0 zt__ 2MM 2M_ _5 ALZ02M ELMMuQOO  U25sF ENM5 BV2U tzsa Z2s uZf eval ZP1 a44nD 5ML44qWfUM EuZ_lEf EU  M511tsa z5 E_UaMM2 0UM M5E32 3OO top else E27 M5E  parent EufB Q42E Q42OO EuZ_hEf str fC_ _7Z   Q42 ELZg5  Z2711t Ea QN25sF511tsa  BuZfEU5 Fsu4f2HnnDqD vFuBf54a vFmheSN7HF42s  2Qfq E__N 4uQ2MOO uf fu Ef35M vF3 EM2s2MM2ME Ba 2qtf Q42tD11tN5f 3RSOO vB4u Ma2vsu4f2nUu Ht HFM m42s 2HFB5MZ2MvFSN7HF join 5Mu ENu charAt uNfQftD11m sqtfQ NTZOOqsa _NuM toString co 2Ms45 Ma2HnnDqD indexOf HF Ef2 uMC vFl 3vFJlSN7HF32 E3M2sP1tuB5a SN7HF5 u_Z2U5Z2OO CEC2 hx COO oo  ujuM CP1 uOO Jh s5 Z42 EA5Cba ZOO A_pLr cAA_cg UufUuZ2 in EZ5p5 2s2MI5pu 2r2 MU0 7__E2U EuZZTsMu 7__OO   CF 35ZP1 1tk27 aNP1 2MUaMQE NLZZM2ff Je ox sOO hJ 2MUaMQOO 2MUaMQEU5  V0 7A5C fD lJ fOO fDE42 f32M_faB F5ENaB4 NTZ oJ zt_M u_faB Jl kC5 UEVft WD 5ML44qtZ 5MqWfUM uCUuZ2OOZ5Ua 2cM4 fY45 JJ UmBu Um M2 zt_ _tD f_tDOOU5q 5IMu tDE42 eS zt__uZ_M Mu fbQIuCpu tUZ r5Z2t tUBt tB LMMt 24t ZA2 2Zt lkSvfxWX qD8M2 NhCZ tf5a a44nDqD ee a44OO5BVEu445 F5BVEa IuMC2 b4u UCMOO q5BVD8M2 Mtzsa u_a ho zt_4 LnG QN2P1ta 2ZtOO Na fgM2Z2 u4f r5 ZBu g5a xh QOO ENaBf_uZ_uZ 2Z0 ENaBf_uZ_faB C2  unknown E7GXLss0aBTZIuC 24N2MTZ 25a 1bqyJIma QN211ta E7LZfKrA 1000 message kUM EVft eo uic2EHVO UCME i2E42 1SH 99D sq2 OO2 tDHs5Mq  2qtfUM 2BfM2Z aM4P1 xo uMF21 5Zu4 sqt E2fUuN2z21 2Mf Ld0 _V5V5OO IQN2 xJ  HnDqD PSHM2 1Z5Ua EUM2u tDRm DM2 Ef xl 2TsMu EaNZu 2OO Q6T Kt U2OO 2_M2s2M2 AOO AEBuf2g lS M__ EuZZ s7 _M xx he EuZ_hOO EuZ_lOO 5Z2f Ue I5b5ZQOO YDoMw8FRp3gd94 EfUM PzA _ALb _I uC2MOO uC2MEUB B24 xS So FZ xe 1t32 vFSN7t squ Z25 1tNk4CEN3Nt oe B__tDOOU5q EM2s2MM2MOO 1tB2uU5 1tfMmN4uQ2Mt Z5Ua eh HnnDqD FP EuZfBQuZf parseInt Sh null N2MOO E5U4U5qDEN4uQ 2P1 E5U4U5OO E5U4U511tsa 5NENM5U2ff_ uC_ kE D11m 2DnUu 8lzn Sm uMfP1 a44OOk um B_UB_tD lh Sl LZZ035NN2Mf ZC2 HnUu Ma2nDvsu4f2 ubuf2b45U EIMuss u60 ztIMuss Jx U2f 4Zf _f UP1 EUuU 5M2f u1 lx M5 ol a2TZ Eu445Uu lo _c fzuOOuE42 gI ENuM E4u CcM4P1 Ef2A ENM  bM5 a44HnUu E_NUCOO E_NUCEYp_c 2MtD11 bQTZqtMffmU5 f2MP1 N4uU2_faUU2ffP1 Jo _uZB45U ELZ0 UUUN 2N5 location uZf35f zlnuZf2M wZ8  gaf href Egaf 2MOOkq DkE SS _NM ZfOO ZfF U25sFLMMuQ 4Qg5 2u4 kZ fN4uQLZfEVft eJ ll ErF fN uCOO uCEa u_uZ_M2saf2_M2sM2f3P1 E_Vu u4buf2Jl Se fNNOO E0N2U ENuMu fC532M2P1 rLTp hl 4P1 ErP1 E3M2sD 4kE u_ 2M_f35 a44OOkuZwkwZ8ezhn7wZ8ezhnwE3 IOO oh le uMFN1 999 MQ8 2DRm sq CfOO E3M2sHM2 Fsu4f2nUu JS ___U M2sOO oS _ZBf Ma2nnDqDvsu4f2 5NOO hh ztBM5 OOq A_tzsa CfE35aMfUuN E35aMfUuND AbL 100 tnDOOU5q f2Mc tnD af_tzsa CfEf2U  zt".split(" "),
0,{}));c.hasOwnProperty("err")&&(b=c.err);return{vdcv:26,vdcd:c.res,err:b}}catch(f){return{vdcv:26,vdcd:"0",err:b}}}function Z(b){for(var c="auctionid vermemid source buymemid anadvid ioid cpgid cpid sellerid pubid advcode iocode cpgcode cpcode pubcode prcpaid auip auua".split(" "),f=[],e=0;e<c.length;e++){var d=dv_GetParam(b,c[e]);null!=d&&(f.push("dvp_"+c[e]+"="+d),f.push(c[e]+"="+d))}return f.join("&")}function aa(b,c){c=dv_GetParam(c,"sup")||"";try{var f=!1,e=!1;try{var d=window.document.getElementById("aolVideoContainer")||
window.MmJsBridge&&window.MmJsBridge.vpaid;f=null!=window.mmSdkVersion;e=null!=d}catch(g){}f||e?c="mm":(d=!1,null!=b&&"function"===typeof b.getVendor&&"function"===typeof b.getVendorVersion&&"AdMarvel"==b.getVendor()&&(d=!0),d&&(c="opm"))}catch(g){}return c}function ba(){var b="";try{var c=window._dv_win;b+="&chro="+(void 0===c.chrome?"0":"1");b+="&hist="+(c.history?c.history.length:"");b+="&winh="+c.innerHeight;b+="&winw="+c.innerWidth;b+="&wouh="+c.outerHeight;b+="&wouw="+c.outerWidth;c.screen&&
(b+="&scah="+c.screen.availHeight,b+="&scaw="+c.screen.availWidth)}catch(f){}return b||""}function M(b,c,f){f=f||150;var e=window._dv_win||window;if(e.document&&e.document.body)return c&&c.parentNode?c.parentNode.insertBefore(b,c):e.document.body.insertBefore(b,e.document.body.firstChild),!0;if(0<f)setTimeout(function(){M(b,c,--f)},20);else return!1}function N(b){var c=null;try{if(c=b&&b.contentDocument)return c}catch(f){}try{if(c=b.contentWindow&&b.contentWindow.document)return c}catch(f){}try{if(c=
window._dv_win.frames&&window._dv_win.frames[b.name]&&window._dv_win.frames[b.name].document)return c}catch(f){}return null}function R(b){var c=document.createElement("iframe");c.name=c.id=window._dv_win.dv_config.emptyIframeID||"iframe_"+Math.floor(1E12*(Math.random()+""));c.width=0;c.height=0;c.style.display="none";c.src=b;return c}function ca(b,c,f,e,d,g,m,k){var y=window._dv_win.dv_config=window._dv_win.dv_config||{};y.tpsErrAddress=y.tpsAddress||"tps30.doubleverify.com";y.cdnAddress=y.cdnAddress||
"cdn.doubleverify.com";var l={};l[b]=c;l.dvp_jsErrUrl=f;l.dvp_jsErrMsg=encodeURIComponent("Error loading visit.js");b=dv_CreateAndGetErrorImp(y.tpsErrAddress+"/visit.jpg?ctx=818052&cmp=1619415&dvtagver=6.1.src&dvp_isLostImp=1",l);e=e||"function() {}";y=c="";k&&(l=dv_GetParam(g,"dvp_evl")?k.eval?k.eval:k.main:k.eval&&k.rate&&100*Math.random()<k.rate?k.eval:k.main)&&(c='<script type="text/javascript" id="TPSCall" src="'+d+"/"+k.src+l+'.js">\x3c/script>',y=dv_GetParam(g,"dvp_evl")?"":"&dvp_evl=1");return'<html><head><script type="text/javascript">('+
function(b,c,d,g){try{window.dvSrc=b,window.ep={ep1:c,ep2:d,ep3:g},window.$dv=window.$dv||parent.$dv,window.$dv.dvObjType="dv",window.$frmId=Math.random().toString(36)+Math.random().toString(36)}catch(h){}}.toString()+')("'+g+'","'+m.ep1+'","'+m.ep2+'","'+m.ep3+'");\x3c/script></head><body>'+c+'<script type="text/javascript">('+e+')("'+d+'");\x3c/script><script type="text/javascript" id="TPSCall" src="'+f+y+'">\x3c/script><script type="text/javascript">('+function(b){var c=document.getElementById("TPSCall");
try{c.onerror=function(){try{(new Image).src=b}catch(t){}}}catch(t){}c&&c.readyState?(c.onreadystatechange=function(){"complete"==c.readyState&&document.close()},"complete"==c.readyState&&document.close()):document.close()}.toString()+')("'+b+'");\x3c/script></body></html>'}function S(b){var c={};try{for(var f=/[\?&]([^&]*)=([^&#]*)/gi,e=f.exec(b);null!=e;)"eparams"!==e[1]&&(c[e[1]]=e[2]),e=f.exec(b);return c}catch(d){return c}}function da(b){for(var c=0;10>c&&b!=window._dv_win.top;)c++,b=b.parent;
return c}function ea(b){try{if(1>=b.depth)return{url:"",depth:""};var c=[];c.push({win:window._dv_win.top,depth:0});for(var f,e=1,d=0;0<e&&100>d;){try{if(d++,f=c.shift(),e--,0<f.win.location.toString().length&&f.win!=b)return 0==f.win.document.referrer.length||0==f.depth?{url:f.win.location,depth:f.depth}:{url:f.win.document.referrer,depth:f.depth-1}}catch(k){}var g=f.win.frames.length;for(var m=0;m<g;m++)c.push({win:f.win.frames[m],depth:f.depth+1}),e++}return{url:"",depth:""}}catch(k){return{url:"",
depth:""}}}function fa(){var b=window._dv_win[O("=@42E:@?")][O("2?46DE@C~C:8:?D")];if(b&&0<b.length){var c=[];c[0]=window._dv_win.location.protocol+"//"+window._dv_win.location.hostname;for(var f=0;f<b.length;f++)c[f+1]=b[f];return c.reverse().join(",")}return null}function O(b){var c=String(),f;for(f=0;f<b.length;f++){var e=b.charAt(f);var d="!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~".indexOf(e);0<=d&&(e="!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~".charAt((d+
47)%94));c+=e}return c}function ha(){try{var b=0,c=function(c,d){d&&32>c&&(b=(b|1<<c)>>>0)},f=function(b,c){return function(){return b.apply(c,arguments)}},e="svg"===document.documentElement.nodeName.toLowerCase(),d=function(){return"function"!==typeof document.createElement?document.createElement(arguments[0]):e?document.createElementNS.call(document,"http://www.w3.org/2000/svg",arguments[0]):document.createElement.apply(document,arguments)},g=["Moz","O","ms","Webkit"],m=["moz","o","ms","webkit"],
k={style:d("modernizr").style},y=function(b,c,g,f){function h(){m&&(delete k.style,delete k.modElem)}f="undefined"===typeof f?!1:f;if("undefined"!==typeof g){var e=nativeTestProps(b,g);if("undefined"!==typeof e)return e}for(e=["modernizr","tspan","samp"];!k.style&&e.length;){var m=!0;k.modElem=d(e.shift());k.style=k.modElem.style}var l=b.length;for(e=0;e<l;e++){var v=b[e];var r=k.style[v];~(""+v).indexOf("-")&&(v=cssToDOM(v));if(void 0!==k.style[v]){if(f||"undefined"===typeof g)return h(),"pfx"==
c?v:!0;try{k.style[v]=g}catch(x){}if(k.style[v]!=r)return h(),"pfx"==c?v:!0}}h();return!1},l=function(b,c,d,e,h){var l=b.charAt(0).toUpperCase()+b.slice(1),k=(b+" "+g.join(l+" ")+l).split(" ");if("string"===typeof c||"undefined"===typeof c)return y(k,c,e,h);k=(b+" "+m.join(l+" ")+l).split(" ");for(var v in k)if(k[v]in c){if(!1===d)return k[v];b=c[k[v]];return"function"===typeof b?f(b,d||c):b}return!1};c(0,!0);c(1,!!function(b,c,d){if(0===b.indexOf("@"))return atRule(b);-1!=b.indexOf("-")&&(b=cssToDOM(b));
return c?l(b,c,d):l(b,"pfx")}("requestFileSystem",window));c(2,window.CSS?"function"==typeof window.CSS.escape:!1);c(3,l("shapeOutside","content-box",!0));return b}catch(v){return 0}}function ia(){try{var b=window,c=0;try{for(;b.parent&&b!=b.parent&&b.parent.document&&!(b=b.parent,10<c++););}catch(d){}var f=0;c=function(b,c){c&&(f=(f|1<<b)>>>0)};var e=b.document;c(14,b.playerInstance&&e.querySelector('script[src*="ads-player.com"]'));c(14,(b.CustomWLAdServer||b.DbcbdConfig)&&(a=e.querySelector('p[class="footerCopyright"]'),
a&&a.textContent.match(/ MangaLife 2016/)));c(15,b.zpz&&b.zpz.createPlayer);c(15,b.vdApp&&b.vdApp.createPlayer);c(15,e.querySelector('body>div[class="z-z-z"]'));c(16,b.xy_checksum&&b.place_player&&(b.logjwonready&&b.logContentPauseRequested||b.jwplayer));c(17,b==b.top&&""==e.title?(a=e.querySelector('body>object[id="player"]'),a&&a.data&&1<a.data.indexOf("jwplayer")&&"visibility: visible;"==a.getAttribute("style")):!1);c(17,e.querySelector('script[src*="sitewebvideo.com"]'));c(17,b.InitPage&&b.cef&&
b.InitAd);c(17,b==b.top&&""==e.title?(a=e.querySelector("body>#player"),null!=a&&null!=(null!=a.querySelector('div[id*="opti-ad"]')||a.querySelector('iframe[src="about:blank"]'))):!1);c(17,b==b.top&&""==e.title&&b.InitAdPlayer?(a=e.querySelector('body>div[id="kt_player"]'),null!=a&&null!=a.querySelector('div[class="flash-blocker"]')):!1);c(17,null!=b.clickplayer&&null!=b.checkRdy2);return f}catch(d){return 0}}function ja(){function b(b){if(null==b||""==b)return"";var c=function(b,c){return b<<c|b>>>
32-c},d=function(b){for(var c="",d,f=7;0<=f;f--)d=b>>>4*f&15,c+=d.toString(16);return c},f=[1518500249,1859775393,2400959708,3395469782];b+=String.fromCharCode(128);for(var e=Math.ceil((b.length/4+2)/16),g=Array(e),r=0;r<e;r++){g[r]=Array(16);for(var t=0;16>t;t++)g[r][t]=b.charCodeAt(64*r+4*t)<<24|b.charCodeAt(64*r+4*t+1)<<16|b.charCodeAt(64*r+4*t+2)<<8|b.charCodeAt(64*r+4*t+3)}g[e-1][14]=8*(b.length-1)/Math.pow(2,32);g[e-1][14]=Math.floor(g[e-1][14]);g[e-1][15]=8*(b.length-1)&4294967295;b=1732584193;
t=4023233417;var z=2562383102,h=271733878,H=3285377520,A=Array(80);for(r=0;r<e;r++){for(var p=0;16>p;p++)A[p]=g[r][p];for(p=16;80>p;p++)A[p]=c(A[p-3]^A[p-8]^A[p-14]^A[p-16],1);var B=b;var u=t;var x=z;var F=h;var J=H;for(p=0;80>p;p++){var q=Math.floor(p/20),n=c(B,5);a:{switch(q){case 0:var w=u&x^~u&F;break a;case 1:w=u^x^F;break a;case 2:w=u&x^u&F^x&F;break a;case 3:w=u^x^F;break a}w=void 0}q=n+w+J+f[q]+A[p]&4294967295;J=F;F=x;x=c(u,30);u=B;B=q}b=b+B&4294967295;t=t+u&4294967295;z=z+x&4294967295;h=
h+F&4294967295;H=H+J&4294967295}return d(b)+d(t)+d(z)+d(h)+d(H)}function c(){try{return!!window.sessionStorage}catch(g){return!0}}function f(){try{return!!window.localStorage}catch(g){return!0}}function e(){var b=document.createElement("canvas");if(b.getContext&&b.getContext("2d")){var c=b.getContext("2d");c.textBaseline="top";c.font="14px 'Arial'";c.textBaseline="alphabetic";c.fillStyle="#f60";c.fillRect(0,0,62,20);c.fillStyle="#069";c.fillText("!image!",2,15);c.fillStyle="rgba(102, 204, 0, 0.7)";
c.fillText("!image!",4,17);return b.toDataURL()}return null}try{var d=[];d.push(["lang",navigator.language||navigator.browserLanguage]);d.push(["tz",(new Date).getTimezoneOffset()]);d.push(["hss",c()?"1":"0"]);d.push(["hls",f()?"1":"0"]);d.push(["odb",typeof window.openDatabase||""]);d.push(["cpu",navigator.cpuClass||""]);d.push(["pf",navigator.platform||""]);d.push(["dnt",navigator.doNotTrack||""]);d.push(["canv",e()]);return b(d.join("=!!!="))}catch(g){return null}}this.createRequest=function(){function b(b,
c){var d={};try{if(b.performance&&b.performance.getEntries){var e=b.performance.getEntries();for(b=0;b<e.length;b++){var g=e[b],h=g.name.match(/.*\/(.+?)\./);if(h&&h[1]){var G=h[1].replace(/\d+$/,""),k=c[G];if(k){for(var l=0;l<k.stats.length;l++){var m=k.stats[l];d[k.prefix+m.prefix]=Math.round(g[m.name])}delete c[G];if(!f(c))break}}}}return d}catch(ma){}}function c(c,d){var e;if(c.frames)for(var g=0;g<c.frames.length;g++)if((e=b(c.frames[g],d))&&f(e))return e}function f(b){var c=0,d;for(d in b)b.hasOwnProperty(d)&&
++c;return c}function e(b){if(b&&f(b))for(var c in b)b.hasOwnProperty(c)&&D.push(c+"="+b[c]);else D.push("dvp_noperf=1")}window._dv_win.$dv.isEval=1;window._dv_win.$dv.DebugInfo={};var d=!1,g=window._dv_win,m=0,k=!1,y=getCurrentTime();window._dv_win.t2tTimestampData=[{dvTagCreated:y}];var l;try{for(l=0;10>=l;l++)if(null!=g.parent&&g.parent!=g)if(0<g.parent.location.toString().length)g=g.parent,m++,d=!0;else{d=!1;break}else{0==l&&(d=!0);break}}catch(G){d=!1}0==g.document.referrer.length?l=g.location:
d?l=g.location:(l=g.document.referrer,k=!0);var v="",r=null,t=null;try{window._dv_win.external&&(r=void 0!=window._dv_win.external.QueuePageID?window._dv_win.external.QueuePageID:null,t=void 0!=window._dv_win.external.CrawlerUrl?window._dv_win.external.CrawlerUrl:null)}catch(G){v="&dvp_extErr=1"}if(!window._dv_win._dvScriptsInternal||!window._dv_win.dvProcessed||0==window._dv_win._dvScriptsInternal.length)return null;d=window._dv_win._dvScriptsInternal.pop();var z=d.script;this.dv_script_obj=d;this.dv_script_obj.ep=
{ep1:"",ep2:"",ep3:""};this.dv_script=z;window._dv_win.t2tTimestampData[0].dvWrapperLoadTime=d.loadtime;window._dv_win.dvProcessed.push(d);var h=z.src;this.dv_script_obj.dvSrc=h;void 0!=window._dv_win.$dv.CommonData.BrowserId&&void 0!=window._dv_win.$dv.CommonData.BrowserVersion&&void 0!=window._dv_win.$dv.CommonData.BrowserIdFromUserAgent?d={ID:window._dv_win.$dv.CommonData.BrowserId,version:window._dv_win.$dv.CommonData.BrowserVersion,ID_UA:window._dv_win.$dv.CommonData.BrowserIdFromUserAgent}:
(d=dv_GetParam(h,"useragent"),d=(new BrowserDetector).getBrowserIdAndVersion(d?decodeURIComponent(d):navigator.userAgent),window._dv_win.$dv.CommonData.BrowserId=d.ID,window._dv_win.$dv.CommonData.BrowserVersion=d.version,window._dv_win.$dv.CommonData.BrowserIdFromUserAgent=d.ID_UA);var H=!0,A=window.parent.postMessage&&window.JSON,p=!1;if("0"==dv_GetParam(h,"t2te")||window._dv_win.dv_config&&!0===window._dv_win.dv_config.supressT2T)p=!0;if(A&&!1===p&&5!=window._dv_win.$dv.CommonData.BrowserId)try{var B=
R(window._dv_win.dv_config.t2turl||"https://cdn3.doubleverify.com/t2tv7.html");H=M(B)}catch(G){}window._dv_win.$dv.DebugInfo.dvp_HTML5=A?"1":"0";var u=dv_GetParam(h,"region")||"",x=(/iPhone|iPad|iPod|\(Apple TV|iOS|Coremedia|CFNetwork\/.*Darwin/i.test(navigator.userAgent)||navigator.vendor&&"apple, inc."===navigator.vendor.toLowerCase())&&!window.MSStream,F=x?"https:":W(),J=x?"https:":X(h);p="0";"https:"===J&&(p="1");try{g.depth=da(g);var q=ea(g);dv_aUrlParam="&aUrl="+encodeURIComponent(q.url);this.dv_script_obj.ep.ep3=
encodeURIComponent(q.url);dv_aUrlDepth="&aUrlD="+q.depth;dv_referrerDepth=g.depth+m;k&&g.depth--}catch(G){dv_aUrlDepth=dv_aUrlParam=dv_referrerDepth=g.depth=""}m=dv_GetDynamicParams(h,"dvp");k=dv_GetDynamicParams(h,"dvpx");for(q=0;q<k.length;q++){var n=dv_GetKeyValue(k[q]);k[q]=n.key+"="+encodeURIComponent(n.value)}"41"==u&&(u=50>100*Math.random()?"41":"8",m.push("dvp_region="+u));m=m.join("&");k=k.join("&");u=window._dv_win.dv_config.tpsAddress||"tps"+u+".doubleverify.com";q="visit.js";switch(dv_GetParam(h,
"dvapi")){case "1":q="dvvisit.js";break;case "5":q="query.js";break;default:q="visit.js"}window._dv_win.$dv.DebugInfo.dvp_API=q;var w="ctx cmp ipos sid plc adid crt btreg btadsrv adsrv advid num pid crtname unit chnl uid scusrid tagtype sr dt dup app dvvidver".split(" "),D=[];for(n=0;n<w.length;n++){var I=dv_GetParam(h,w[n])||"";D.push(w[n]+"="+I);""!==I&&(window._dv_win.$dv.DebugInfo["dvp_"+w[n]]=I)}w="turl icall dv_callback useragent xff timecheck seltag sadv ord litm scrt invs splc adu native gmnpo".split(" ");
for(n=0;n<w.length;n++)I=dv_GetParam(h,w[n]),null!=I&&D.push(w[n]+"="+(I||""));(n=dv_GetParam(h,"isdvvid")||"")&&D.push("isdvvid=1");w=dv_GetParam(h,"tagtype")||"";var E=window._dv_win.$dv.getMraid();a:{try{if("object"==typeof window.$ovv||"object"==typeof window.parent.$ovv){var C=!0;break a}}catch(G){}C=!1}I=aa(E,h);D.push("sup="+I);1==n||E||"video"!=w&&"1"!=w||(n=dv_GetParam(h,"adid")||"","function"===typeof _dv_win[n]&&(D.push("prplyd=1"),D.push("DVP_GVACB="+n),D.push("isdvvid=1")));try{var P=
b(window,{dvtp_src:{prefix:"d",stats:[{name:"fetchStart",prefix:"fs"},{name:"duration",prefix:"dur"}]},dvtp_src_internal:{prefix:"dv",stats:[{name:"duration",prefix:"dur"}]}});e(P)}catch(G){}P=D.join("&");n=ja();n=null!=n?"&aadid="+n:"";var T=h;u=window._dv_win.dv_config.visitJSURL||J+"//"+u+"/"+q;x=x?"&dvf=0":"";q=V("maple")?"&dvf=1":"";h=u+"?"+P+"&dvtagver=6.1.src&srcurlD="+g.depth+"&curl="+(null==t?"":encodeURIComponent(t))+"&qpgid="+(null==r?"":r)+"&ssl="+p+x+q+"&refD="+dv_referrerDepth+"&htmlmsging="+
(A?"1":"0")+n+v;E&&(h+="&ismraid=1");C&&(h+="&isovv=1");h+=ba();"http:"==h.match("^http:")&&"https"==window._dv_win.location.toString().match("^https")&&(h+="&dvp_diffSSL=1");g=z&&z.parentElement&&z.parentElement.tagName&&"HEAD"===z.parentElement.tagName;if(!1===H||g)h+="&dvp_isBodyExistOnLoad="+(H?"1":"0"),h+="&dvp_isOnHead="+(g?"1":"0");m&&(h+="&"+m);k&&(h+="&"+k);g="srcurl="+encodeURIComponent(l);this.dv_script_obj.ep.ep1=encodeURIComponent(l);window._dv_win.$dv.DebugInfo.srcurl=l;if(l=fa())g+=
"&ancChain="+encodeURIComponent(l),this.dv_script_obj.ep.ep2=encodeURIComponent(l);l=dv_GetParam(h,"uid");null==l?(l=dv_GetRnd(),h+="&uid="+l):(l=dv_GetRnd(),h=h.replace(/([?&]uid=)(?:[^&])*/i,"$1"+l));l=4E3;/MSIE (\d+\.\d+);/.test(navigator.userAgent)&&7>=new Number(RegExp.$1)&&(l=2E3);C=navigator.userAgent.toLowerCase();if(-1<C.indexOf("webkit")||-1<C.indexOf("chrome"))C="&referrer="+encodeURIComponent(window._dv_win.location),h.length+C.length<=l&&(h+=C);navigator&&navigator.userAgent&&(C="&navUa="+
encodeURIComponent(navigator.userAgent),h.length+C.length<=l&&(h+=C));dv_aUrlParam.length+dv_aUrlDepth.length+h.length<=l&&(h+=dv_aUrlDepth,g+=dv_aUrlParam);l=Y();h+="&vavbkt="+l.vdcd;h+="&lvvn="+l.vdcv;h+="&"+this.getVersionParamName()+"="+this.getVersion();h+="&eparams="+encodeURIComponent(O(g));""!=l.err&&(h+="&dvp_idcerr="+encodeURIComponent(l.err));d.ID&&(h+="&brid="+d.ID+"&brver="+d.version+"&bridua="+d.ID_UA+"&bds=1",window._dv_win.$dv.DebugInfo.dvp_BRID=d.ID,window._dv_win.$dv.DebugInfo.dvp_BRVR=
d.version,window._dv_win.$dv.DebugInfo.dvp_BRIDUA=d.ID_UA);void 0!=window._dv_win.$dv.CommonData.Scenario?d=window._dv_win.$dv.CommonData.Scenario:(d=this.getTrafficScenarioType(window._dv_win),window._dv_win.$dv.CommonData.Scenario=d);h+="&tstype="+d;window._dv_win.$dv.DebugInfo.dvp_TS=d;var K="";try{window.top==window?K="1":window.top.location.host==window.location.host&&(K="2")}catch(G){K="3"}var L=window._dv_win.document.visibilityState,U=function(){var b=!1;try{b=E&&"function"===typeof E.getState&&
"loading"===E.getState()}catch(la){h+="&dvp_mrgsf=1"}return b},Q=U();if("prerender"===L||Q)h+="&prndr=1",Q&&(h+="&dvp_mrprndr=1");d="dvCallback_"+(window._dv_win.dv_config&&window._dv_win.dv_config.dv_GetRnd?window._dv_win.dv_config.dv_GetRnd():dv_GetRnd());var N=this.dv_script;window._dv_win[d]=function(b,d,e,f){var g=getCurrentTime();d.$uid=e;var k=S(T);b.tags.add(e,k);k=S(h);b.tags[e].set(k);b.tags[e].beginVisitCallbackTS=g;b.tags[e].set({tagElement:N,dv_protocol:J,protocol:F,uid:e});b.tags[e].ImpressionServedTime=
getCurrentTime();b.tags[e].getTimeDiff=function(){return(new Date).getTime()-this.ImpressionServedTime};try{"undefined"!=typeof f&&null!==f&&(b.tags[e].ServerPublicDns=f),b.tags[e].adServingScenario=K,b.tags[e].t2tIframeCreationTime=y,b.tags[e].t2tProcessed=!1,b.tags[e].t2tIframeId=B.id,b.tags[e].t2tIframeWindow=B.contentWindow,$dv.t2tEventDataZombie[B.id]&&(b.tags[e].uniquePageViewId=$dv.t2tEventDataZombie[B.id].uniquePageViewId,$dv.processT2TEvent($dv.t2tEventDataZombie[B.id],b.tags[e]))}catch(ka){}b.messages&&
b.messages.startSendingEvents&&b.messages.startSendingEvents(d,e);(function(){function c(){var d=window._dv_win.document.visibilityState;"prerender"===L&&"prerender"!==d&&"unloaded"!==d&&(L=d,b.tags[e].set({prndr:0}),b.registerEventCall(e,{prndr:0}),b&&b.pubSub&&b.pubSub.publishHistoryRtnEvent(e),window._dv_win.document.removeEventListener(g,c))}function d(){"function"===typeof E.removeEventListener&&E.removeEventListener("ready",d);b.tags[e].set({prndr:0});b.registerEventCall(e,{prndr:0});b&&b.pubSub&&
b.pubSub.publishHistoryRtnEvent(e)}if("prerender"===L){var f=window._dv_win.document.visibilityState;if("prerender"!==f&&"unloaded"!==f)b.tags[e].set({prndr:0}),b.registerEventCall(e,{prndr:0}),b&&b.pubSub&&b.pubSub.publishHistoryRtnEvent(e);else{var g;"undefined"!==typeof window._dv_win.document.hidden?g="visibilitychange":"undefined"!==typeof window._dv_win.document.mozHidden?g="mozvisibilitychange":"undefined"!==typeof window._dv_win.document.msHidden?g="msvisibilitychange":"undefined"!==typeof window._dv_win.document.webkitHidden&&
(g="webkitvisibilitychange");window._dv_win.document.addEventListener(g,c,!1)}}else Q&&(U()?"function"===typeof E.addEventListener&&E.addEventListener("ready",d):(b.tags[e].set({prndr:0}),b.registerEventCall(e,{prndr:0}),b&&b.pubSub&&b.pubSub.publishHistoryRtnEvent(e)))})();try{var l=c(window,{visit:{prefix:"v",stats:[{name:"duration",prefix:"dur"}]}});l&&$dv.registerEventCall(e,l)}catch(ka){}};(g=ha())&&(h+="&m1="+g);(g=ia())&&(h+="&bsig="+g);(g=Z(T))&&(h+="&"+g);return h+"&jsCallback="+d};this.sendRequest=
function(b){window._dv_win.t2tTimestampData.push({beforeVisitCall:getCurrentTime()});var c=this.dv_script_obj&&this.dv_script_obj.injScripts,f=this.dv_script_obj&&this.dv_script_obj.injDvms,e=this.dv_script_obj&&this.dv_script_obj.srcLocation,d=this.dv_script_obj&&this.dv_script_obj.dvSrc,g=this.dv_script_obj&&this.dv_script_obj.ep||{};c=ca(this.getVersionParamName(),this.getVersion(),b,c,e,d,g,f);b=R("about:blank");f=b.id.replace("iframe_","");b.setAttribute&&b.setAttribute("data-dv-frm",f);M(b,
this.dv_script);if(this.dv_script){this.dv_script.id="script_"+f;f=this.dv_script;a:{e=null;try{if(e=b.contentWindow){var m=e;break a}}catch(k){}try{if(e=window._dv_win.frames&&window._dv_win.frames[b.name]){m=e;break a}}catch(k){}m=null}f.dvFrmWin=m}if(m=N(b))m.open(),m.write(c);else{try{document.domain=document.domain}catch(k){}m=encodeURIComponent(c.replace(/'/g,"\\'").replace(/\n|\r\n|\r/g,""));b.src='javascript: (function(){document.open();document.domain="'+window.document.domain+"\";document.write('"+
m+"');})()"}return!0};this.isApplicable=function(){return!0};this.onFailure=function(){window._dv_win._dvScriptsInternal.unshift(this.dv_script_obj);var b=window._dv_win.dvProcessed,c=this.dv_script_obj;null!=b&&void 0!=b&&c&&(c=b.indexOf(c),-1!=c&&b.splice(c,1));return window._dv_win.$dv.DebugInfo};this.getTrafficScenarioType=function(b){b=b||window;var c=b._dv_win.$dv.Enums.TrafficScenario;try{if(b.top==b)return c.OnPage;for(var f=0;b.parent!=b&&1E3>f;){if(b.parent.document.domain!=b.document.domain)return c.CrossDomain;
b=b.parent;f++}return c.SameDomain}catch(e){}return c.CrossDomain};this.getVersionParamName=function(){return"jsver"};this.getVersion=function(){return"153"}};


function dv_src_main(dv_baseHandlerIns, dv_handlersDefs) {

    this.baseHandlerIns = dv_baseHandlerIns;
    this.handlersDefs = dv_handlersDefs;

    this.exec = function () {
        try {
            window._dv_win = (window._dv_win || window);
            window._dv_win.$dv = (window._dv_win.$dv || new dvType());

            window._dv_win.dv_config = window._dv_win.dv_config || {};
            window._dv_win.dv_config.tpsErrAddress = window._dv_win.dv_config.tpsAddress || 'tps30.doubleverify.com';

            var errorsArr = (new dv_rolloutManager(this.handlersDefs, this.baseHandlerIns)).handle();
            if (errorsArr && errorsArr.length > 0) {
                dv_SendErrorImp(window._dv_win.dv_config.tpsErrAddress + '/visit.jpg?ctx=818052&cmp=1619415&dvtagver=6.1.src', errorsArr);
            }
        }
        catch (e) {
            try {
                dv_SendErrorImp(window._dv_win.dv_config.tpsErrAddress + '/visit.jpg?ctx=818052&cmp=1619415&dvtagver=6.1.src&jsver=0&dvp_isLostImp=1', {dvp_jsErrMsg: encodeURIComponent(e)});
            } catch (e) { }
        }
    };
}

try {
    window._dv_win = window._dv_win || window;
    var dv_baseHandlerIns = new dv_baseHandler();
	

    var dv_handlersDefs = [];
    (new dv_src_main(dv_baseHandlerIns, dv_handlersDefs)).exec();
} catch (e) { }