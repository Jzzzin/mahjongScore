window.addEventListener('DOMContentLoaded', event => {
    // Simple-DataTables
    // https://github.com/fiduswriter/Simple-DataTables/wiki

    const memberDataTable = document.getElementById('memberDataTable');
    if (memberDataTable) {
        new simpleDatatables.DataTable(memberDataTable, {
            searchable: false,
            perPageSelect: false,
            sortable: false
        });
    }
});

// Call the dataTables jQuery plugin
$(document).ready(function() {
    const currentURL = window.location.protocol + "//" + window.location.host;
    $('#memberDataTable').DataTable({
        ajax: {
            url: currentURL + '/api/member',
            dataSrc: ''
        },
        searching: false,
        lengthChange: false,
        order: [[1, 'ASC']],
        columns: [
            { data: 'memberName',
              render: function(data, type, row, meta) {
                let tmp = [];
                let fiveCount = parseInt(row.meetWinCnt / 5);
                let threeCount = parseInt(parseInt(row.meetWinCnt - fiveCount * 5) / 3);
                let oneCount = parseInt(row.meetWinCnt - fiveCount * 5 - threeCount * 3);
                tmp.push('<div class="winner-inline"><img class="winner-crown" src="../assets/img/winner-trophy.svg" alt="winner badge"/>'.repeat(fiveCount));
                tmp.push('<div class="winner-inline"><img class="winner-crown" src="../assets/img/winner-medal.svg" alt="winner medal"/>'.repeat(threeCount));
                tmp.push('<div class="winner-inline"><img class="winner-crown" src="../assets/img/winner-badge.svg" alt="winner trophy"/>'.repeat(oneCount));
                tmp.push(data);
                tmp = tmp.join();
                return tmp.replace(/\,/g,"");
              } 
            },
            { data: 'meetWinCnt'},
            { data: 'yakumanCnt' },
            { data: 'createdDate' },
            {
                targets: -1,
                data: 'memberNo',
                render: function (data, type) {
                    if (type === 'display') {
                        let link = 'member-edit.html?memberNo=' + data;

                        return '<a href="' + link + '">수정</a>';
                    }

                    return data;
                },
            }
        ]
    });
});
