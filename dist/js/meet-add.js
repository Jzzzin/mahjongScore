window.addEventListener('DOMContentLoaded', event => {

    const submitBtn = document.body.querySelector('#submit');
    if (submitBtn) {
        submitBtn.addEventListener('click', event => {
            event.preventDefault();
            const meetNo = "0";
            const currentURL = window.location.protocol + "//" + window.location.host;
            const url = currentURL + "/api/meet";
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

    const currentURL = window.location.protocol + "//" + window.location.host;
    let url = currentURL + "/api/member";

    $.ajax({
        type: "GET",
        url: url,
        dataType: 'json',
        beforeSend: function () { // Before we send the request, remove the .hidden class from the spinner and default to inline-block.
        },
        success: function (data) {
            // On Success, build our rich list up and append it to the #richList div.
            if (data) {
                data.forEach(value => {
                    const id = value.memberName + value.memberNo;
                    const li = $('<li style="display: inline; padding: 10px"><input type="checkbox" name="memberList" id="' + id + '" value="' + value.memberNo + '"/>' +
                      '<label for="' + id + '"></label></li>');
                    li.find('label').text(value.memberName);
                    $('#memberList').append(li);
                });
            }
        },
        complete: function () { // Set our complete callback, adding the .hidden class and hiding the spinner.
        },
    });

    url = currentURL + "/api/location";

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
                    const option = $('<option value="' + value.locationNo + '">' + value.locationName + '</option>');
                    if (idx === 0) option.prop("selected", true);
                    $('#locationList').append(option);
                });
            }
        },
        complete: function () { // Set our complete callback, adding the .hidden class and hiding the spinner.
        },
    });
});
