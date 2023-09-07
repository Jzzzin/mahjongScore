window.addEventListener('DOMContentLoaded', event => {

    const submitBtn = document.body.querySelector('#submit');
    if (submitBtn) {
        submitBtn.addEventListener('click', event => {
            event.preventDefault();
            const currentURL = window.location.protocol + "//" + window.location.host;
            const url = currentURL + "/api/game";
            const meetNo = $('#meetList option:selected').val();
            const memberList = [];

            $('#resultDiv ul li').each(function () {
                                    const member = {
                        "memberNo": $(this).children('div')[0].className,
                        "score": parseInt($(this).children('input').val())
                }
memberList.push(member);
            });
            const formData = {
                "gameNo": "0",
                "orgMeetNo": meetNo,
                //"orgGameNumber": $('#inputOrgGameNumber').val(),
                "meetNo": meetNo,
                "gameMemberCount": $('input:radio[name="gameMemberCount"]:checked').val(),
                "gameType": $('input:radio[name="gameType"]:checked').val(),
                "comment": $('#inputComment').val(),
                "memberList": memberList
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
inputInit();
            const meetNo = $('#meetList option:selected').val();
            $('.member-list').each(function () {
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
        $('#inputStartScore').html(35000);
        $('#inputReturnScore').html(40000);
        $('#inputOkaPoint').html(15);
    } else if (gameMemberCount === '4') {
        $('#inputStartScore').html(25000);
        $('#inputReturnScore').html(30000);
        $('#inputOkaPoint').html(20);
    }
});

$('input:radio[name="gameType"]').change(function () {
    const gameType = $('input:radio[name="gameType"]:checked').val();
    if (gameType === 'HALF') {
        $('input:radio[name="umaPoint"]:input[value="10"]').prop('checked', true);
        $('#umaPoint').html('10(20)')
    }
    else {
        $('input:radio[name="umaPoint"]:input[value="5"]').prop('checked', true);
        $('#umaPoint').html('5(10)')
    }
});
$('#btncheck').on('click', () => { btncheck()});
$(document).ready(function() {

    const currentURL = window.location.protocol + "//" + window.location.host;
    const url = currentURL + "/api/meetForGame";

    $('input:radio[name="gameMemberCount"]:input[value="4"]').prop('checked', true);
    $('input:radio[name="gameType"]:input[value="HALF"]').prop('checked', true);
    $('#inputStartScore').html('25000');
    $('#inputReturnScore').html('30000');
    $('#inputOkaPoint').html('20');
    $('input:radio[name="umaPoint"]:input[value="10"]').prop('checked', true);

    $('#umaPoint').html('10(20)')

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
                    const option = $('<option value="' + value.meetNo + '">' + value.meetDay + '</option>');
                    if (idx === 0) option.prop("selected", true);
                    $('#meetList').append(option);

                    value.memberList.forEach(member => {
                        const id = value.meetNo + member.memberName;
                        const li = $('<li style="display: inline; padding: 2px 3px" class="member-list"><input onchange="inputChange(this)" type="checkbox" name="memberList" id="' + id + '" value="' + member.memberNo + '" class="' + value.meetNo + '"/>' +
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
function inputChange(e) {
    let memberNum = parseInt($('input:radio[name="gameMemberCount"]:checked').val());
    if ($('#resultDiv ul li input').length >= memberNum && e.checked) {
        alert('참여 인원 수를 초과했습니다.');
        e.checked = false;
        return;
    }

    const checkedMember = document.body.querySelectorAll('#memberList li input:checked');
    let trList = '';
    const meetNo = $('#meetList option:selected').val();
    checkedMember.forEach(el => {
        if (meetNo == el.className) {
            let tmp = '<li><div class='+el.value+'>'+el.labels[0].innerHTML+'</div><input class="input-el" type=text></li>'
            trList += tmp;
        }
    })
    $('#resultDiv ul').html(trList);
}

function inputInit() {
    $('.member-list input').prop('checked',false);
    $('#resultDiv ul').html('');
}
