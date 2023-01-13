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
        columns: [
            { data: 'memberName' },
            { data: 'createdDate'},
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
