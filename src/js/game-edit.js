window.addEventListener('DOMContentLoaded', event => {

    const submitBtn = document.body.querySelector('#submit');
    if (submitBtn) {
        submitBtn.addEventListener('click', event => {
            event.preventDefault();
            const gameNo = $('#inputGameNo').val();
            const currentURL = window.location.protocol + "//" + window.location.host;
            const url = currentURL +  "/api/game/" + gameNo;
            const meetNo = $('#meetList option:selected').val();
            const memberList = [];
            const yakumanMember = !!$('#yakumanSelect').val() ? $('#yakumanSelect').val() : 0;

            if (!returnScoreCheck()) {
                alert('반환점수를 넘는 참여자가 없습니다.');
                return;
            }
            if (parseInt($('.left-score span').html()) !== 0) {
                alert('총 점수의 합이 틀렸습니다.');
                return;
            }
            $('#resultDiv ul li').each(function () {
                const member = {
                    "memberNo": $(this).children('.member-name')[0].getAttribute("value"),
                    "score": parseInt($($($(this).children()[1])[0]).val())
                }
                memberList.push(member);
            });
            const formData = {
                "gameNo": gameNo,
                "orgMeetNo": $('#inputOrgMeetNo').val(),
                "orgGameNumber": $('#inputOrgGameNumber').val(),
                "meetNo": meetNo,
                "gameMemberCount": $('input:radio[name="gameMemberCount"]:checked').val(),
                "gameType": $('input:radio[name="gameType"]:checked').val(),
                "yakumanMemberNo": yakumanMember,
                "comment": $('#inputComment').val(),
                "memberList": memberList
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
                        alert('수정에 성공하였습니다.');
                        window.location = 'game.html';
                    } else {
                        alert('종료된 게임입니다.');
                        window.location.reload();
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
        if ($('#resultDiv ul li input').length > 3) {
            alert('참여 인원 수를 초과했습니다.');
            $('#inputGameMemberCount2').prop('checked', true);
            return;
        }
        $('#inputStartScore').html(35000);
        $('#inputReturnScore').html(40000);
        $('#inputOkaPoint').html(15);
        getTotalScore(3, 35000, 40000);
    } else if (gameMemberCount === '4') {
        $('#inputStartScore').html(25000);
        $('#inputReturnScore').html(30000);
        $('#inputOkaPoint').html(20);
        getTotalScore(4, 25000, 30000);
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

$(document).ready(function() {
    const urlParams = new URL(location.href).searchParams;
    const gameNo = urlParams.get('gameNo');
    const currentURL = window.location.protocol + "//" + window.location.host;
    const url = currentURL + "/api/game/" + gameNo;
    let attendMember = [];
    $.ajax({
        type: "GET",
        url: url,
        dataType: 'json',
        beforeSend: function () { // Before we send the request, remove the .hidden class from the spinner and default to inline-block.
        },
        success: function (data) {
            // On Success, build our rich list up and append it to the #richList div.
            if (data) {
                $('#inputGameNo').val(data.gameNo);
                $('#inputOrgMeetNo').val(data.meetNo);
                $('#inputMeetNo').val(data.meetNo);
                const option = $('<option value="' + data.meetNo + '" selected>' + data.meetDay + '</option>');
                $('#meetList').append(option);
                $('#inputOrgGameNumber').val(data.gameNumber);

                if (data.gameMemberCount === 3)
                    $('#inputGameMemberCount1').prop('checked', true);
                else
                    $('#inputGameMemberCount2').prop('checked', true);
                if (data.gameType === "HALF")
                    $('#inputGameType1').prop('checked', true);
                else
                    $('#inputGameType2').prop('checked', true);
                $('#inputStartScore').html(data.startScore);
                $('#inputReturnScore').html(data.returnScore);
                $('#inputOkaPoint').html(data.okaPoint);
                
                getTotalScore(data.gameMemberCount, data.startScore, data.returnScore);
                const umaPoint = data.umaPoint+"("+data.umaPoint*2+")";
                if (data.umaPoint === 5)
                    //$('#inputUmaPoint1').prop('checked', true);
                    $('#umaPoint').html(umaPoint)
                else
                    //$('#inputUmaPoint2').prop('checked', true);
                    $('#umaPoint').html(umaPoint)
                $('#inputComment').val(data.comment ?? '');
                const rowCount = $('#inputComment').val().split(/\r\n|\r|\n/).length;
                $('#inputComment').height((rowCount * 18 + 36) + "px");

                if (data.endYn === 0)
                    $('#inputEndYn1').prop('checked', true);
                else
                    $('#inputEndYn2').prop('checked', true);
                let options = '<option value=""></option>';
                data.memberList.forEach(member => {
                    if (member.attendYn) {
                        let tmp = '<li><div class="member-name" value='+member.memberNo+'>'+member.memberName+'</div><input class="input-el" onchange="scoreCheck()" type=text value='+ member.score+'></li>';
                        $('#resultDiv ul').append(tmp);
                        attendMember.push(member.memberNo);
                        options += '<option value="'+member.memberNo+'">'+member.memberName+'</option>'
                    }
                    $('#yakumanSelect').html(options);    
                })
                $('#yakumanSelect').val(data.yakumanMemberNo);
            }
        },
        complete: function () { // Set our complete callback, adding the .hidden class and hiding the spinner.
            const currentURL = window.location.protocol + "//" + window.location.host;
            $.ajax({
                type: "GET",
                url: currentURL + "/api/meetForGame",
                dataType: 'json',
                beforeSend: function () { // Before we send the request, remove the .hidden class from the spinner and default to inline-block.
                },
                success: function (data) {
                    // On Success, build our rich list up and append it to the #richList div.
                    if (data) {
                        const meetNo = $('#inputMeetNo').val();
                        data.forEach((value) => {
                            if (String(value.meetNo) !== String(meetNo)) {
                                const option = $('<option value="' + value.meetNo + '">' + value.meetDay + '</option>');
                                $('#meetList').append(option);
                                value.memberList.forEach(member => {
                                    const id = member.meetNo + member.memberName;
                                    const li = $('<li style="display: inline; padding: 2px 3px"'+'" value="' + member.memberNo + '" class="member-list"><input onchange="inputChange(this)" type="checkbox" name="memberList" id="' + id + '" class="' + member.meetNo + '"/>' +
                                      '<label for="' + id + '"></label></li>');
                                    li.find('label').text(member.memberName);
                                    li.hide();
                                    $('#memberList').append(li);
                                });
                            }
                            else {
                                    value.memberList.forEach(member => {
                                        const id = member.meetNo + member.memberName;
                                        const li = $('<li style="display: inline; padding: 2px 3px"'+'" value="' + member.memberNo + '" class="member-list"><input onchange="inputChange(this)" type="checkbox" name="memberList" id="' + id + '" class="' + member.meetNo + '"/>' +
                                          '<label for="' + id + '"></label></li>');
                                        li.find('label').text(member.memberName);
                                        if (attendMember.includes(member.memberNo))
                                            li.find('input').prop('checked', true);
                                        $('#memberList').append(li);
                                    });
                            }
                            // if (!isGameOn()) {
                            //     $('#memberDiv').html('종료된 모임입니다.');
                            //     $('#memberDiv').css('width', 'unset');
                            // }
                            scoreCheck();
                        });
                    }
                },
                complete: function () { // Set our complete callback, adding the .hidden class and hiding the spinner.
                },
            });
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
    if (e.checked) {      //추가
        let memberVal = $(e).parent().val();
        let memberName = e.id.replace(/[0-9]/g, '');
        let tmp = '<li><div class="member-name" value='+memberVal+'>'+memberName+'</div><input class="input-el" onchange="scoreCheck()" type=text value=""></li>'
        $('#resultDiv ul').append(tmp);
    }
    else {      //삭제
        let name = (e.id).replace(/[0-9]/g, '');
        $('#resultDiv ul li .member-name').map((idx, el) => {
            if (name === $(el).text()) $(el).parent().remove();
        })
    }
    const checkedMember = document.body.querySelectorAll('#memberList li input:checked');
    const meetNo = $('#meetList option:selected').val();
    let options = '<option value=""></option>';
    checkedMember.forEach(el => {
        if (meetNo == el.className) {
            // let tmp = '<li><div class='+el.value+'>'+el.labels[0].innerHTML+'</div><input class="input-el" onchange="scoreCheck()" type=text></li>'
            // trList += tmp;
            options += '<option value="'+$(el).parent().val()+'">'+el.labels[0].innerHTML+'</option>'
        }
    })
    $('#yakumanSelect').html(options);
}

function inputInit() {
    $('.member-list input').prop('checked',false);
    $('#resultDiv ul').html('');
}

function isGameOn() {
    let isOn = false;
    $('#memberDiv').children().each((idx, el) => {
        if ($(el).children().css('display') !== 'none') isOn = true;
    })
    return isOn;
}

function getTotalScore(memberNum, startScore, returnScore) {
    let totalScore = memberNum * startScore;
    $('.total-score span').html(totalScore);
}

function scoreCheck() {
    let sumValue = 0;
    $('#resultDiv input').each((idx, el) => {
        if (el.value === '') el.value = 0;
        sumValue += parseInt(el.value);
    })
    $('.left-score span').html(parseInt($('.total-score span').html()) - sumValue);
}

function returnScoreCheck() {
    let isOver = 0;
    $('input.input-el').each((idx, item) => {
        if (parseInt($(item).val()) >= parseInt($('#inputReturnScore').html())) isOver += 1;
    })
    if (isOver !== 0) return true;
    return false;
}