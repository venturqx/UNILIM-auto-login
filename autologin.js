// ==UserScript==
// @name         Community Unilim Auto Login
// @namespace    http://tampermonkey.net/
// @version      3.1415
// @description  An automatic login script for Community.
// @author       .
// @match        https://community-ensil.unilim.fr/*
// @exclude      https://community-ensil.unilim.fr/pluginfile.php/*
// @match        https://cas.unilim.fr/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var loginDetails = {
        userName: "IDENTIFIANT",
        password: "MOT_DE_PASSE",
    }

    function login(){
        document.querySelector(".form-control").value = loginDetails.userName;
        document.querySelector(".form-control.key").value = loginDetails.password;
        clickLoginButton()
    }

    function clickLoginButton(){
        document.querySelector(".btn-primary").click()
    }

    function isLoggedIn() {
        return document.getElementsByClassName('usertext').length > 0
    }

    function redirectToLogin() {
        window.location.href = 'https://community-ensil.unilim.fr/login/index.php?authCAS=CAS';
    }

    function ready(fn) {
        if (document.readyState != 'loading'){
            fn(); } else { document.addEventListener('DOMContentLoaded', fn); } }

    var host = window.location.host;
    if (host == "community-ensil.unilim.fr") {
        if (!isLoggedIn()) {
            redirectToLogin()
        }
    } else if (host == "cas.unilim.fr") {
        ready(login())
    }

})();
