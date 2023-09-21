window.addEventListener('DOMContentLoaded', event => {
    // Simple-DataTables
    // https://github.com/fiduswriter/Simple-DataTables/wiki

    const meetSelect = document.body.querySelector('#meetList');
    if (meetSelect) {
        meetSelect.addEventListener('change', event => {
            event.preventDefault();
            const meetNo = $('#meetList option:selected').val();
            location.replace('/index.html?meetNo='+meetNo);
        })
    }


    const rankDataTable = document.getElementById('rankDataTable');
    if (rankDataTable) {
        new simpleDatatables.DataTable(rankDataTable, {
            searchable: false,
            perPageSelect: false,
            sortable: false
        });
    }
});

// Call the dataTables jQuery plugin
$(document).ready(function() {
    const currentURL = window.location.protocol + "//" + window.location.host;
    const url = currentURL + "/api/meet";
    let meetNo = new URLSearchParams(location.search).get('meetNo');

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
                    if(meetNo) {
                        if (String(value.meetNo) === String(meetNo)) option.prop("selected", true);
                    } else {
                        if (idx === 0) {
                            option.prop("selected", true);
                            meetNo = value.meetNo;
                        }
                    }
                    $('#meetList').append(option);
                });
            }
        },
        complete: function () { // Set our complete callback, adding the .hidden class and hiding the spinner.

            $('#rankDataTable').DataTable({
                ajax: {
                    url: currentURL + '/api/rank?meetNo=' + meetNo,
                    dataSrc: ''
                },
                searching: false,
                lengthChange: false,
                columns: [
                    { data: 'rank' },
                    { data: 'memberName',
                      render: function (data, type, row, meta) {
                        if (row.rank === 1) return '<div class="winner-block">' + data + '<img class="winner-crown" src="../assets/img/yellow-crown.svg" alt="winner star"/></div>';
                        else if (row.rank === row.meetMemberCnt) return '<div class="loser-block">' + data + '<img class="loser-badge" src="../assets/img/loser-badge.svg" alt="loser badge"/></div>';
                        return data;
                      }
                    },
                    { data: 'meetWinCnt'},
                    { data: 'yakumanCnt'},
                    { data: 'totalPoint' },
                    { data: 'avgPoint' },
                    { data: 'winRate' },
                    { data: 'upRate' },
                    { data: 'forthRate' },
                    { data: 'winCnt' },
                    { data: 'secondCnt' },
                    { data: 'thirdCnt' },
                    { data: 'forthCnt' },
                    { data: 'rankRate' },
                    { data: 'totalGameCnt' }
                ]
            });
        },
    });
});
