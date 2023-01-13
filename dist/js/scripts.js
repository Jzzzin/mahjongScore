/*!
    * Start Bootstrap - Mahjong Score v1.0.0 (undefined)
    * Copyright 2013-2023 undefined
    * Licensed under MIT (https://github.com/StartBootstrap/mahjong_score/blob/master/LICENSE)
    */
    //
// Scripts
//

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

    const logoutBtn = document.body.querySelector('#logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', event => {
            event.preventDefault();
            sessionStorage.setItem("token", "");
            alert("로그아웃 되었습니다.");
            return false;
        });
    }


});

$(document).ready(function() {
    const token = sessionStorage.getItem("token");
    if (token) {
        $('#login').hide();
    } else {
        $('#logout').hide();
    }
});
