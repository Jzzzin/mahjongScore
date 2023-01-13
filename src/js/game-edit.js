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
            const gameNo = $('#inputGameNo').val();
            const currentURL = window.location.protocol + "//" + window.location.host;
            const url = currentURL +  "/api/game/" + gameNo;

            const meetNo = $('#meetList option:selected').val();
            const memberNoList = [];
            $('input:checkbox[name=memberList]').each(function () {
                if($(this).is(":checked") === true && $(this).attr('id') === meetNo) memberNoList.push($(this).val())
            });
            const formData = {
                "gameNo": gameNo,
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
            const meetNo = $('#meetList option:selected').val();
            $('.memberList').each(function () {
                const classNo = $(this).children('input').attr('class');
                if (classNo === meetNo) $(this).show();
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

    const urlParams = new URL(location.href).searchParams;
    const gameNo = urlParams.get('gameNo');
    const currentURL = window.location.protocol + "//" + window.location.host;
    const url = currentURL + "/api/game/" + gameNo;

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
                $('#inputMeetNo').val(data.meetNo);
                const meetDay = `${data.meetDay.substring(0, 4)}년 ${data.meetDay.substring(4, 6)}월 ${data.meetDay.substring(6, 8)}일`
                const option = $('<option value="' + data.meetNo + '" selected>' + meetDay + '</option>');
                $('#meetList').append(option);
                $('#inputGameNumber').val(data.gameNumber);
                if (data.gameMemberCount === 3)
                    $('#inputGameMemberCount1').prop('checked', true);
                else
                    $('#inputGameMemberCount2').prop('checked', true);
                if (data.gameType === "HALF")
                    $('#inputGameType1').prop('checked', true);
                else
                    $('#inputGameType2').prop('checked', true);
                $('#inputStartScore').val(data.startScore);
                $('#inputReturnScore').val(data.returnScore);
                $('#inputOkaPoint').val(data.okaPoint);
                if (data.umaPoint === 5)
                    $('#inputUmaPoint1').prop('checked', true);
                else
                    $('#inputUmaPoint2').prop('checked', true);
                if (data.endYn === 0)
                    $('#inputEndYn1').prop('checked', true);
                else
                    $('#inputEndYn2').prop('checked', true);
                data.memberList.forEach(value => {
                    const id = data.meetNo;
                    const li = $('<li style="display: inline; padding: 10px" class="memberList"><input type="checkbox" name="memberList" id="' + id + '" value="' + value.memberNo + '"/>' +
                      '<label for="' + id + '"></label></li>');
                    li.find('label').text(value.memberName);
                    if (value.attendYn === 1)
                        li.find('input').prop('checked', true);
                    $('#memberList').append(li);
                });
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
                                const meetDay = `${value.meetDay.substring(0, 4)}년 ${value.meetDay.substring(4, 6)}월 ${value.meetDay.substring(6, 8)}일`
                                const option = $('<option value="' + value.meetNo + '">' + meetDay + '</option>');
                                $('#meetList').append(option);

                                value.memberList.forEach(member => {
                                    const id = value.meetNo + member.memberName;
                                    const li = $('<li style="display: inline; padding: 10px" class="memberList"><input type="checkbox" name="memberList" id="' + id + '" value="' + member.memberNo + ' class="' + value.meetNo +  '"/>' +
                                        '<label for="' + id + '"></label></li>');
                                    li.find('label').text(member.memberName);
                                    li.hide();
                                    $('#memberList').append(li);
                                })
                            }
                        });
                    }
                },
                complete: function () { // Set our complete callback, adding the .hidden class and hiding the spinner.
                },
            });
        },
    });

});
