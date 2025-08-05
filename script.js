// ==UserScript==
// @name         Favorite-collisions
// @namespace    https://github.com/Icey-e621/Favorite-collision
// @version      0.1.0
// @description  Checks what favorites you and another e621 user have in common.
// @author       Icey
// @license      GNU
// @match        *://e621.net/*
// @match        *://e926.net/*
// @connect      self
// @connect      e621.net
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @require      file://E:\Programacion\Scripts\Favorite-collision\script.js
// ==/UserScript==

var LocalFav = null;
(function () {
    'use strict';

    const users = $("[id='page']").find("[href^='/users/']");
    if (users != null) {
        var th = document.createElement("th");
        th.textContent = "Favorite collisions";
        users.parents("table").find("thead tr")[0].append(th);
    }
    $("[id='page']").find("[href^='/users/']").each(async function () {
        var currId = $(this).attr('href').split('/').pop();
        var td = document.createElement("td");
        td.textContent = await compareFavorites(currId);
        $(this).closest("tr").append(td);
    })
})();
async function compareFavorites(User) {
    if (LocalFav == null) {
        const LocalRes = await GM.xmlHttpRequest({
            method: "GET",
            url: "https://e621.net/favorites.json",
            headers: {
                "Content-Type": "application/json"
            },
            nocache: true,
            responseType: "json"
        }).catch(e => console.error(e));

        LocalFav = LocalRes.response.posts;
    }
    const RemoteRes = await GM.xmlHttpRequest({
        method: "GET",
        url: "https://e621.net/favorites.json?user_id=" + User,
        headers: {
            "Content-Type": "application/json"
        },
        nocache: true,
        responseType: "json"
    }).catch(e => console.error(e));
    console.log(RemoteRes.responseXML);
    var RemoteFav = RemoteRes.response.posts;
    var Count = {};
    Count.Count = 0;
    for (var i = 0; i < LocalFav.length; i++) {
        for (var j = 0; j < RemoteFav.length; j++) {
            if (LocalFav[i].id == RemoteFav[j].id) {
                Count.Count = Count.Count + 1;
            }
        }
    }
    
    return Count.Count;
}