window.addEventListener('DOMContentLoaded', event => {

    const submitBtn = document.body.querySelector('#submit');
    if (submitBtn) {
        submitBtn.addEventListener('click', event => {
            event.preventDefault();
            const currentURL = window.location.protocol + "//" + window.location.host;
            const url = currentURL + "/api/game/result";

            const formData = {
                "gameNo": $('#inputGameNo').val(),
                "memberNo": $('#inputMemberNo').val(),
                "position": $('input:radio[name="position"]:checked').val(),
                "score": $('#inputScore').val()
            }
            $.ajax({
                type: 'PUT',
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

$(document).ready(function() {

    const urlParams = new URL(location.href).searchParams;
    const gameNo = urlParams.get('gameNo');
    const memberNo = urlParams.get('memberNo');
    const name = urlParams.get('name');
    const position = urlParams.get('position');
    const score = urlParams.get('score');
    $('#inputGameNo').val(gameNo);
    $('#inputMemberNo').val(memberNo);
    $('#inputName').val(name);
    switch (position) {
        case "EAST":
            $('#inputPosition1').prop('checked', true);
            break;
        case "SOUTH":
            $('#inputPosition2').prop('checked', true);
            break;
        case "WEST":
            $('#inputPosition3').prop('checked', true);
            break;
        case "NORTH":
            $('#inputPosition4').prop('checked', true);
            break;
    }
    $('#inputScore').val(score);
});
