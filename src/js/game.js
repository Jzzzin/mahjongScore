window.addEventListener('DOMContentLoaded', event => {
    // Simple-DataTables
    // https://github.com/fiduswriter/Simple-DataTables/wiki

    const gameDataTable = document.getElementById('gameDataTable');
    if (gameDataTable) {
        new simpleDatatables.DataTable(gameDataTable, {
            searchable: false,
            perPageSelect: false,
            sortable: false
        });
    }
});

// Call the dataTables jQuery plugin
$(document).ready(function() {
    $('#gameDataTable').DataTable({
        ajax: {
            url: 'http://localhost:8080/api/game',
            dataSrc: ''
        },
        searching: false,
        lengthChange: false,
        order: [[2, 'DESC']],
        columns: [
            {
                data: 'gameNo',
                visible: false,
                searchable: false,
            },
            {
                data: 'meetDay',
                render: function (data, type) {
                    if (type === 'display') {
                        return data.substr(0, 4) + '-' + data.substr(4, 2) + '-' + data.substr(6, 2);
                    }

                    return data;
                },
            },
            { data: 'gameNumber' },
            {
                data: 'memberList.0.memberNo',
                defaultContent: '',
                visible: false,
                searchable: false,
            },
            { data: 'memberList.0.rank', defaultContent: '' },
            {
                data: 'memberList.0.memberName',
                defaultContent: '',
                render: function (data, type, row) {
                    if (type === 'display' && data) {
                        let link = 'game-result.html?gameNo=' + row.gameNo + '&memberNo=' + row.memberList[0].memberNo + '&name=' + data + '&position=' + row.memberList[0].position + '&score=' + row.memberList[0].score;

                        return '<a href="' + link + '">' + data + '</a>';
                    }

                    return data;
                }
            },
            {
                data: 'memberList.0.position',
                defaultContent: '',
                visible: false,
                searchable: false,
            },
            { data: 'memberList.0.score', defaultContent: '' },
            {
                data: 'memberList.1.memberNo',
                defaultContent: '',
                visible: false,
                searchable: false,
            },
            { data: 'memberList.1.rank', defaultContent: '' },
            {
                data: 'memberList.1.memberName',
                defaultContent: '',
                render: function (data, type, row) {
                    if (type === 'display' && data) {
                        let link = 'game-result.html?gameNo=' + row.gameNo + '&memberNo=' + row.memberList[1].memberNo + '&name=' + data + '&position=' + row.memberList[1].position + '&score=' + row.memberList[1].score;

                        return '<a href="' + link + '">' + data + '</a>';
                    }

                    return data;
                }
            },
            {
                data: 'memberList.1.position',
                defaultContent: '',
                visible: false,
                searchable: false,
            },
            { data: 'memberList.1.score', defaultContent: '' },
            {
                data: 'memberList.2.memberNo',
                defaultContent: '',
                visible: false,
                searchable: false,
            },
            { data: 'memberList.2.rank', defaultContent: '' },
            {
                data: 'memberList.2.memberName',
                defaultContent: '',
                render: function (data, type, row) {
                    if (type === 'display' && data) {
                        let link = 'game-result.html?gameNo=' + row.gameNo + '&memberNo=' + row.memberList[2].memberNo + '&name=' + data + '&position=' + row.memberList[2].position + '&score=' + row.memberList[2].score;

                        return '<a href="' + link + '">' + data + '</a>';
                    }

                    return data;
                }
            },
            {
                data: 'memberList.2.position',
                defaultContent: '',
                visible: false,
                searchable: false,
            },
            { data: 'memberList.2.score', defaultContent: '' },
            {
                data: 'memberList.3.memberNo',
                defaultContent: '',
                visible: false,
                searchable: false,
            },
            { data: 'memberList.3.rank', defaultContent: '' },
            {
                data: 'memberList.3.memberName',
                defaultContent: '',
                render: function (data, type, row) {
                    if (type === 'display' && data) {
                        let link = 'game-result.html?gameNo=' + row.gameNo + '&memberNo=' + row.memberList[3].memberNo + '&name=' + data + '&position=' + row.memberList[3].position + '&score=' + row.memberList[3].score;

                        return '<a href="' + link + '">' + data + '</a>';
                    }

                    return data;
                }
            },
            {
                data: 'memberList.3.position',
                defaultContent: '',
                visible: false,
                searchable: false,
            },
            { data: 'memberList.3.score', defaultContent: '' },
            {
                data: 'endYn',
                render: function (data, type) {
                    if (type === 'display') {
                        console.log(data);
                        if (String(data) === '1') return '종료';
                        else return '진행';
                    }

                    return data;
                },
            },
            {
                targets: -1,
                data: 'gameNo',
                render: function (data, type) {
                    if (type === 'display') {
                        let link = 'game-edit.html?gameNo=' + data;

                        return '<a href="' + link + '">수정</a>';
                    }

                    return data;
                },
            },
        ]
    });
});
