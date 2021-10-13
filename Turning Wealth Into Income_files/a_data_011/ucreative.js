function isSet(val) {
    switch (typeof val) {
        case "string":
            return val !== undefined && val !== "" && val !== null;
        case "object":
            return val !== null;
        case "number":
        case "boolean":
            return true;
        default:
            return false;
    }
}

try {
    if (hbTargetingParams.ct === "2") {
        var rtcAdUrl = "https://amprtc.media.net/rtb/getadm?as=1&aid=" + hbTargetingParams.auctionId + "&bid=" + hbTargetingParams.bidder + "&cid=" + hbTargetingParams.cid + "&slot=" + hbTargetingParams.crid + "&act=" + hbTargetingParams.auctionType + "&scpvid=" + hbTargetingParams.secondProviderId + "&mnetfsc=" + hbTargetingParams.mnetfsc;//jscs:ignore
        window.location.replace(rtcAdUrl);
    } else if (hbTargetingParams.auctionId && window.parent.advBidxc) {
        window.parent.advBidxc.deliverImpression({
            frameWindow: window,
            crid: hbTargetingParams.crid,
            auctionId: hbTargetingParams.auctionId,
            bidder: hbTargetingParams.bidder,
            isExternal: hbTargetingParams.isExternal,
            isPmp: hbTargetingParams.isPmp,
            customObj: hbCustomParams
        });
    } else {
        throw new Error();
    }
} catch (e) {
    function handleSafeFrame(event) {
        try {
            if (!(isSet(event) && isSet(event.data) && isSet(event.data.isMnetHB))) {
                return;
            }
            if (!(isSet(event.data.adCode) && isSet(event.data.width) && isSet(event.data.height))) {
                throw new Error("improper response from advBidxc");
            }
            var ifr = document.createElement("iframe");
            ifr.setAttribute("width", event.data.width);
            ifr.setAttribute("height", event.data.height);
            ifr.setAttribute("frameBorder", "0");
            ifr.setAttribute("marginWidth", "0");
            ifr.setAttribute("marginHeight", "0");
            ifr.setAttribute("scrolling", "no");
            ifr.setAttribute("allowtransparency", "true");
            document.body.appendChild(ifr);
            ifr.contentWindow.document.open();
            ifr.contentWindow.document.write(event.data.adCode);
            ifr.contentWindow.document.close();
            window.parent.postMessage({
                isMnetHB: 1,
                safeframeRenderSuccess: 1,
                isExt: hbTargetingParams.isExternal,
                bidder: hbTargetingParams.bidder,
                auctionId: hbTargetingParams.auctionId
            }, '*');
        } catch (e) {
            (new Image()).src = protocol + domain + "/log?logid=kfk&evtid=belog&lvl=3&name=SAFEFRAME_RENDER_ERROR&cid=" + hbTargetingParams.cid + "&crid=" + hbTargetingParams.crid + "&pvid=" + hbTargetingParams.bidder + "&cc=" + hbTargetingParams.cc + "&ugd=" + hbTargetingParams.ugd + "&stack=" + encodeURIComponent((e.name || "") + "|" + (e.message || ""));//jscs:ignore
        }
    }

    if (window.addEventListener) {
        window.addEventListener("message", handleSafeFrame, false);
    } else if (window.attachEvent) {
        window.attachEvent("onmessage", handleSafeFrame);
    }
    window.parent.postMessage({
        isExt: hbTargetingParams.isExternal,
        isPmp: hbTargetingParams.isPmp,
        placement: hbTargetingParams.crid,
        bidder: hbTargetingParams.bidder,
        customParam: hbCustomParams,
        pageID: hbTargetingParams.auctionId,
        isMnetHB: 1
    }, '*');
}
