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
            const memberNo = $('#inputMemberNo').val();
            const url = "http://localhost:8080/api/member/" + memberNo;
            const formData = {
                "memberNo": memberNo,
                "memberName": $('#inputMemberName').val(),
                "useYn": $('input:radio[name="useYn"]:checked').val()
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
                        window.location = 'member.html';
                    } else {
                        alert('이미 등록된 이름입니다.');
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
    const memberNo = urlParams.get('memberNo');
    const url = "http://localhost:8080/api/member/" + memberNo;

    $.ajax({
        type: "GET",
        url: url,
        dataType: 'json',
        beforeSend: function () { // Before we send the request, remove the .hidden class from the spinner and default to inline-block.
        },
        success: function (data) {
            // On Success, build our rich list up and append it to the #richList div.
            if (data) {
                $('#inputMemberNo').val(data.memberNo);
                $('#inputMemberName').val(data.memberName);
                if (data.useYn === 1)
                    $('#inputUseYn2').prop('checked', true);
                else
                    $('#inputUseYn1').prop('checked', true);
            }
        },
        complete: function () { // Set our complete callback, adding the .hidden class and hiding the spinner.
        },
    });
});
