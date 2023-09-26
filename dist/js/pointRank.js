window.addEventListener('DOMContentLoaded', event => {
    // Simple-DataTables
    // https://github.com/fiduswriter/Simple-DataTables/wiki

    const yearSelect = document.body.querySelector('#yearList');
    if (yearSelect) {
        yearSelect.addEventListener('change', event => {
            event.preventDefault();
            const year = $('#yearList option:selected').val();
            location.replace('/index.html?year='+year);
        })
    }


    const pointRankDataTable = document.getElementById('pointRankDataTable');
    if (pointRankDataTable) {
        new simpleDatatables.DataTable(pointRankDataTable, {
            searchable: false,
            perPageSelect: false,
            sortable: false
        });
    }
});

// Call the dataTables jQuery plugin
$(document).ready(function() {
    const currentURL = window.location.protocol + "//" + window.location.host;
    const url = currentURL + "/api/year";
    let year = new URLSearchParams(location.search).get('year');

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
                    const option = $('<option value="' + value.year + '">' + value.year + '</option>');
                    if(year) {
                        if (String(value.year) === String(year)) option.prop("selected", true);
                    } else {
                        if (idx === 0) {
                            option.prop("selected", true);
                            year = value.year;
                        }
                    }
                    $('#yearList').append(option);
                });
            }
        },
        complete: function () { // Set our complete callback, adding the .hidden class and hiding the spinner.

            $('#pointRankDataTable').DataTable({
                ajax: {
                    url: currentURL + '/api/pointRank?year=' + year,
                    dataSrc: ''
                },
                searching: false,
                lengthChange: false,
                columns: [
                    { data: 'rank' },
                    { data: 'memberName',
                      render: function (data, type, row, meta) {
                        if (row.rank === 1) return '<div class="winner-block">' + data + '<img class="winner-crown" src="../assets/img/yellow-crown.svg" alt="winner star"/></div>';
                        else if (row.rank === row.yearMemberCnt) return '<div class="loser-block">' + data + '<img class="loser-badge" src="../assets/img/loser-badge.svg" alt="loser badge"/></div>';
                        return data;
                      }
                    },
                    { data: 'meetWinCnt'},
                    { data: 'yakumanCnt'},
                    { data: 'totalPoint' },
                    { data: 'secondCnt' },
                    { data: 'thirdCnt' },
                    { data: 'totalMeetCnt' }
                ]
            });
        },
    });
});
