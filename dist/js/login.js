window.addEventListener('DOMContentLoaded', event => {

    const loginBtn = document.body.querySelector('#login');
    if (loginBtn) {
        loginBtn.addEventListener('click', event => {
            event.preventDefault();
            const currentURL = window.location.protocol + "//" + window.location.host;
            const url = currentURL + "/api/login";
            const formData = {
                "userId": $('#inputUserId').val(),
                "password": $('#inputPassword').val()
            }
            $.ajax({
                type: 'POST',
                url: url,
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(formData),
                success: function (data) {
                    if (data.status) {
                        alert('로그인 되었습니다.');
                        sessionStorage.setItem("token", data.token);
                        window.location = document.referrer;
                    } else {
                        alert('로그인에 실패하였습니다.');
                    }
                },
                error: function (xhr, status, msg) {
                    alert(xhr.status + " : " + status + msg);
                }
            });
            return false;
        });
    }
});
