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
    $('#memberDataTable').DataTable({
        ajax: {
            url: 'http://localhost:8080/api/member',
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
