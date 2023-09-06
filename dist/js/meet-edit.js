window.addEventListener('DOMContentLoaded', event => {

    const submitBtn = document.body.querySelector('#submit');
    if (submitBtn) {
        submitBtn.addEventListener('click', event => {
            event.preventDefault();
            const meetNo = $('#inputMeetNo').val();
            const currentURL = window.location.protocol + "//" + window.location.host;
            const url = currentURL + "/api/meet/" + meetNo;
            const locationNo = $('#locationList option:selected').val();
            const memberNoList = [];
            $('input:checkbox[name=memberList]').each(function () {
                if($(this).is(":checked") === true) memberNoList.push($(this).val())
            });
            const formData = {
                "meetNo": meetNo,
                "meetDay": $('#inputMeetDay').val(),
                "meetTime": $('#inputMeetTime').val(),
                "locationNo": locationNo,
                "memberNoList": memberNoList,
                "endYn": $('input:radio[name="endYn"]:checked').val()
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
                        window.location = 'meet.html';
                    } else {
                        alert('이미 등록된 날짜입니다.');
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
});

$(document).ready(function() {

    const urlParams = new URL(location.href).searchParams;
    const meetNo = urlParams.get('meetNo');
    const currentURL = window.location.protocol + "//" + window.location.host;
    let url = currentURL + "/api/meet/" + meetNo;

    $.ajax({
        type: "GET",
        url: url,
        dataType: 'json',
        beforeSend: function () { // Before we send the request, remove the .hidden class from the spinner and default to inline-block.
        },
        success: function (data) {
            // On Success, build our rich list up and append it to the #richList div.
            if (data) {
                $('#inputMeetNo').val(data.meetNo);
                $('#inputMeetDay').val(data.meetDay);
                $('#inputMeetTime').val(data.meetTime);
                $('#inputLocationNo').val(data.locationNo);
                const option = $('<option value="' + data.locationNo + '" selected>' + data.locationName + '</option>');
                $('#locationList').append(option);
                if (data.endYn === 0)
                    $('#inputEndYn1').prop('checked', true);
                else
                    $('#inputEndYn2').prop('checked', true);
                data.memberList.forEach(value => {
                    const id = value.memberName + value.memberNo;
                    const li = $('<li style="display: inline; padding: 10px"><input type="checkbox" name="memberList" id="' + id + '" value="' + value.memberNo + '"/>' +
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
                url: currentURL + "/api/location",
                dataType: 'json',
                beforeSend: function () { // Before we send the request, remove the .hidden class from the spinner and default to inline-block.
                },
                success: function (data) {
                    // On Success, build our rich list up and append it to the #richList div.
                    if (data) {
                        data.forEach((value) => {
                            const locationNo = $('#inputLocationNo').val();
                            if (String(value.locationNo) !== String(locationNo)) {
                                const option = $('<option value="' + value.locationNo + '">' + value.locationName + '</option>');
                                $('#locationList').append(option);
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
