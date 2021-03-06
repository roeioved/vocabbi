﻿chrome.tabs.getAllInWindow(null, function (tabs) {
    for (var tab in tabs) {
        chrome.pageAction.show(tabs[tab].id);
    }
});

chrome.tabs.onCreated.addListener(function (tab) {
    chrome.pageAction.show(tab.id);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    chrome.pageAction.show(tabId);
});

chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        if (request.op == "getTranslation") {
            $.ajax({
                url: 'https://clients5.google.com/translate_a/t',
                data: 'client=dict-chrome-ex&sl=' + request.source_language + '&tl=' + request.target_language + '&q=' + request.text,
                type: 'GET',
                complete: function(jqXHR, textStatus) {
                    var result = {};

                    if (jqXHR.responseText) {
                        var json = $.parseJSON(jqXHR.responseText);
                        result.success = true;
                        result.translation = json.sentences[0].trans;
                        result.source_language = json.src;
                    } else {
                        result.success = false;
                    }

                    sendResponse(result);
                }
            });
        }
        else if (request.op == "getView") {
            var view = $.View(request.url, request.params);
            //console.log("view in background: " + view);
            sendResponse(view);
        }
        else if (request.op == "getSettings") {
            sendResponse(Settings.get_settings());
        }
        else if (request.op == "setItem") {
            localStorage[request.key] = request.value;
        }
        else if (request.op == "getItem") {
            sendResponse(localStorage[request.key]);
        }
        else if (request.op == "getAllItems") {
            result = {};
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i)
                result[key] = localStorage[key];
            }
            sendResponse(result);
        }
        else if (request.op == "getTagsHashList") {

        }
    }
);