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

    const submitBtn = document.body.querySelector('#submit');
    if (submitBtn) {
        submitBtn.addEventListener('click', event => {
            event.preventDefault();
            const currentURL = window.location.protocol + "//" + window.location.host;
            const url = currentURL + "/api/game";

            const meetNo = $('#meetList option:selected').val();
            const memberNoList = [];
            $('input:checkbox[name=memberList]').each(function () {
                if($(this).is(":checked") === true && $(this).attr('id') === meetNo) memberNoList.push($(this).val())
            });
            const formData = {
                "gameNo": "0",
                "meetNo": meetNo,
                "gameNumber": $('#inputGameNumber').val(),
                "gameMemberCount": $('input:radio[name="gameMemberCount"]:checked').val(),
                "gameType": $('input:radio[name="gameType"]:checked').val(),
                "startScore": $('#inputStartScore').val(),
                "returnScore": $('#inputReturnScore').val(),
                "umaPoint": $('input:radio[name="umaPoint"]:checked').val(),
                "memberNoList": memberNoList
            }
            $.ajax({
                type: 'POST',
                url: url,
                data: JSON.stringify(formData),
                beforeSend: function (xhr) {
                    const token = sessionStorage.getItem("token");
                    xhr.setRequestHeader("Content-type", "application/json");
                    xhr.setRequestHeader("Authorization", "Bearer " + token);
                },
                success: function (data) {
                    if (data) {
                        alert('등록에 성공하였습니다.');
                        window.location = 'game.html';
                    } else {
                        alert('등록에 실패하였습니다.');
                    }
                },
                error: function (xhr, status, msg) {
                    if (xhr.status === 401 || xhr.status === 403) {
                        alert('로그인이 필요합니다!');
                        window.location = 'login.html';
                    } else {
                        alert(xhr.status + " : " + status + msg);
                    }
                }
            });
            return false;
        });
    }

    const meetSelect = document.body.querySelector('#meetList');
    if (meetSelect) {
        meetSelect.addEventListener('change', event => {
            event.preventDefault();
            const meetNo = $('#meetList option:selected').val();
            $('.memberList').each(function () {
                const id = $(this).children('input').attr('id');
                if (id === meetNo) $(this).show();
                else $(this).hide();
            });
        })
    }
});

$('#inputStartScore').change(function () {
    const startScore = $(this).val();
    const returnScore = $('#inputReturnScore').val();
    const gameMemberCount = $('input:radio[name="gameMemberCount"]:checked').val();
    const okaPoint = (returnScore - startScore) * gameMemberCount / 1000;
    $('#inputOkaPoint').val(okaPoint);
});

$('#inputReturnScore').change(function () {
    const startScore = $('#inputStartScore').val();
    const returnScore = $(this).val();
    const gameMemberCount = $('input:radio[name="gameMemberCount"]:checked').val();
    const okaPoint = (returnScore - startScore) * gameMemberCount / 1000;
    $('#inputOkaPoint').val(okaPoint);
});

$('input:radio[name="gameMemberCount"]').change(function () {
    const startScore = $('#inputStartScore').val();
    const returnScore = $('#inputReturnScore').val();
    const gameMemberCount = $('input:radio[name="gameMemberCount"]:checked').val();
    const okaPoint = (returnScore - startScore) * gameMemberCount / 1000;
    $('#inputOkaPoint').val(okaPoint);
});

$('input:radio[name="gameType"]').change(function () {
    const gameType = $('input:radio[name="gameType"]:checked').val();
    if (gameType === 'HALF') $('input:radio[name="umaPoint"]:input[value="10"]').prop('checked', true);
    else $('input:radio[name="umaPoint"]:input[value="5"]').prop('checked', true);
});

$(document).ready(function() {

    const currentURL = window.location.protocol + "//" + window.location.host;
    const url = currentURL + "/api/meetForGame";

    $('input:radio[name="gameMemberCount"]:input[value="4"]').prop('checked', true);
    $('input:radio[name="gameType"]:input[value="HALF"]').prop('checked', true);
    $('#inputStartScore').val('25000');
    $('#inputReturnScore').val('30000');
    $('#inputOkaPoint').val('20');
    $('input:radio[name="umaPoint"]:input[value="10"]').prop('checked', true);

    $.ajax({
        type: "GET",
        url: url,
        dataType: 'json',
        beforeSend: function () { // Before we send the request, remove the .hidden class from the spinner and default to inline-block.
        },
        success: function (data) {
            // On Success, build our rich list up and append it to the #richList div.
            if (data) {
                data.forEach((value, idx) => {
                    const meetDay = `${value.meetDay.substring(0, 4)}년 ${value.meetDay.substring(4, 6)}월 ${value.meetDay.substring(6, 8)}일`
                    const option = $('<option value="' + value.meetNo + '">' + meetDay + '</option>');
                    if (idx === 0) option.prop("selected", true);
                    $('#meetList').append(option);

                    const id = value.meetNo;
                    value.memberList.forEach(member => {
                        const li = $('<li style="display: inline; padding: 10px" class="memberList"><input type="checkbox" name="memberList" id="' + id + '" value="' + member.memberNo + '"/>' +
                            '<label for="' + id + '"></label></li>');
                        li.find('label').text(member.memberName);
                        if (idx !== 0) li.hide();
                        $('#memberList').append(li);
                    })
                });
            }
        },
        complete: function () { // Set our complete callback, adding the .hidden class and hiding the spinner.
        },
    });
});
