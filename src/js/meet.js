window.addEventListener('DOMContentLoaded', event => {
    // Simple-DataTables
    // https://github.com/fiduswriter/Simple-DataTables/wiki

    const meetDataTable = document.getElementById('meetDataTable');
    if (meetDataTable) {
        new simpleDatatables.DataTable(meetDataTable, {
            searchable: false,
            perPageSelect: false,
            sortable: false
        });
    }
});

// Call the dataTables jQuery plugin
$(document).ready(function() {
    const currentURL = window.location.protocol + "//" + window.location.host;
    $('#meetDataTable').DataTable({
        ajax: {
            url: currentURL + '/api/meet',
            dataSrc: ''
        },
        searching: false,
        lengthChange: false,
        order: [[0, 'DESC']],
        columns: [
            {
                data: 'meetDay',
                render: function (data, type) {
                    if (type === 'display') {
                        return data;
                    }

                    return data;
                },
            },
            {
                data: 'meetTime',
                render: function (data, type) {
                    if (type === 'display') {
                        return data;
                    }

                    return data;
                },
            },
            { data: 'locationName' },
            {
                data: 'memberList',
                render: '[, ].memberName'
            },
            { data: 'winMemberName' },
            {
                data: 'endYn',
                render: function (data, type) {
                    if (type === 'display') {
                        if (String(data) === '1') return '종료';
                        else return '진행';
                    }

                    return data;
                },
            },
            {
                targets: -1,
                data: 'meetNo',
                render: function (data, type) {
                    if (type === 'display') {
                        let link = 'meet-edit.html?meetNo=' + data;

                        return '<a href="' + link + '">수정</a>';
                    }

                    return data;
                },
            },
        ]
    });
});
