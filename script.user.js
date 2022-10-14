// ==UserScript==
// @name         UNILIM-moodle-auto-login
// @namespace    http://tampermonkey.net/
// @version      3.1415
// @description  An auto-login script for Community.
// @author       .
// @match        https://community-ensil.unilim.fr/*
// @exclude      https://community-ensil.unilim.fr/pluginfile.php/*
// @match        https://cas.unilim.fr/*
// @match        https://jazz.ensil.unilim.fr/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      http://crypto.stanford.edu/sjcl/sjcl.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

var encryptKey = GM_getValue("encryptKey", "");
var username = GM_getValue("username", "");
var password = GM_getValue("password", "");

GM_registerMenuCommand ("Reset Username/Password", resetAll);

if (!(encryptKey && username && password)) {
    resetAll();
}

username = decode(username, "Username", "username");
password = decode(password, "Password", "password");

var loginDetails = {
    username: username,
    password: password,
}


function genKey(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function decode(targVar, userPrompt, setValVarName) {
    targVar = unStoreAndDecrypt (targVar);
    return targVar;
}

function askVar(targVar, userPrompt, setValVarName) {
    targVar = prompt (
        'UNILIM-moodle-auto-login\n\n' + userPrompt + ':',
        ''
    );
    GM_setValue(setValVarName, encryptAndStore (targVar));
    return targVar;
}


function encryptAndStore (clearText) {
    return JSON.stringify(sjcl.encrypt (encryptKey, clearText));
}

function unStoreAndDecrypt (jsonObj) {
    return sjcl.decrypt(encryptKey, JSON.parse (jsonObj));
}

function changeUsername () {
    promptAndChangeStoredValue(username, "Username", "username");
}

function changePassword () {
    promptAndChangeStoredValue(password, "Password", "password");
}

function resetAll () {
    encryptKey = genKey(15);
    GM_setValue("encryptKey", encryptKey);
    username = password = "";
    username = askVar(username, "Username", "username");
    password = askVar(password, "Password", "password");
    main();
}

function promptAndChangeStoredValue (targVar, userPrompt, setValVarName) {
    targVar = prompt (
        'UNILIM-moodle-auto-login:\n' + userPrompt + ':',
        ''
    );
    GM_setValue (setValVarName, encryptAndStore (targVar));
}

function loginCommunity(){
    document.querySelector(".form-control").value = loginDetails.username;
    document.querySelector(".form-control.key").value = loginDetails.password;
    document.querySelector(".btn-primary").click();
}

function loginJazz(){
    document.getElementsByName('login_ensil')[0].value = loginDetails.username;
    document.getElementsByName('passwd_ensil')[0].value = loginDetails.password;
    document.querySelectorAll('input[type=submit]')[0].click();
}

function isLoggedInCommunity() {
    return document.getElementsByClassName('usertext').length > 0;
}

function isLoggedInJazz() {
    return (document.documentElement.textContent || document.documentElement.innerText).indexOf('deconnexion') > -1;
}

function redirectToLoginCommunity() {
    window.location.href = 'https://community-ensil.unilim.fr/login/index.php?authCAS=CAS';
}

function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function main() {
    var host = window.location.host;
    if (host == "community-ensil.unilim.fr") {
        if (!isLoggedInCommunity()) {
            redirectToLoginCommunity();
        }
    } else if (host == "cas.unilim.fr") {
        ready(loginCommunity());
    } else if (host == "jazz.ensil.unilim.fr") {
        if (!isLoggedInJazz()) {
            ready(loginJazz());
        }
    }
}

main();
