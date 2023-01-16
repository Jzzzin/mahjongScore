window.addEventListener('DOMContentLoaded', event => {

    const submitBtn = document.body.querySelector('#submit');
    if (submitBtn) {
        submitBtn.addEventListener('click', event => {
            event.preventDefault();
            const currentURL = window.location.protocol + "//" + window.location.host;
            const url = currentURL + "/api/game";

            const meetNo = $('#meetList option:selected').val();
            const memberNoList = [];
            $('input:checkbox[name=memberList]').each(function () {
                if($(this).is(":checked") === true && $(this).attr('class') === meetNo) memberNoList.push($(this).val())
            });
            const formData = {
                "gameNo": "0",
                "orgMeetNo": meetNo,
                "orgGameNumber": $('#inputOrgGameNumber').val(),
                "meetNo": meetNo,
                "gameMemberCount": $('input:radio[name="gameMemberCount"]:checked').val(),
                "gameType": $('input:radio[name="gameType"]:checked').val(),
                "comment": $('#inputComment').val(),
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
                const classNo = $(this).children('input').attr('class');
                if (classNo === meetNo) $(this).show();
                else $(this).hide();
            });
        })
    }

    const commentArea = document.body.querySelector('#inputComment');
    if (commentArea) {
        commentArea.addEventListener('input', event => {
            const rowCount = $('#inputComment').val().split(/\r\n|\r|\n/).length;
            commentArea.style.height= (rowCount * 18 + 36) + "px";
        })
    }
});

$('input:radio[name="gameMemberCount"]').change(function () {
    const gameMemberCount = $('input:radio[name="gameMemberCount"]:checked').val();
    if (gameMemberCount === '3') {
        $('#inputStartScore').val(35000);
        $('#inputReturnScore').val(40000);
        $('#inputOkaPoint').val(15);
    } else if (gameMemberCount === '4') {
        $('#inputStartScore').val(25000);
        $('#inputReturnScore').val(30000);
        $('#inputOkaPoint').val(20);
    }
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

                    value.memberList.forEach(member => {
                        const id = value.meetNo + member.memberName;
                        const li = $('<li style="display: inline; padding: 10px" class="memberList"><input type="checkbox" name="memberList" id="' + id + '" value="' + member.memberNo + '" class="' + value.meetNo + '"/>' +
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
