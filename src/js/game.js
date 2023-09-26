window.addEventListener('DOMContentLoaded', event => {
    // Simple-DataTables
    // https://github.com/fiduswriter/Simple-DataTables/wiki

    const meetSelect = document.body.querySelector('#meetList');
    if (meetSelect) {
        meetSelect.addEventListener('change', event => {
            event.preventDefault();
            const meetNo = $('#meetList option:selected').val();
            location.replace('/game.html?meetNo='+meetNo);
        })
    }

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
            $('#gameDataTable').DataTable({
                ajax: {
                    url: currentURL + '/api/game?meetNo=' + meetNo,
                    dataSrc: ''
                },
                searching: false,
                lengthChange: false,
                order: [[1, 'DESC'], [0, 'DESC']],
                columns: [
                    {
                        data: 'gameNo',
                        visible: false,
                        searchable: false,
                    },
                    {
                        data: 'meetDay'
                    },
                    {
                        data: 'gameMemberCount',
                        render: function (data, type, row) {
                            if (type === 'display') {
                                let gameType = row.gameType === 'HALF' ? '반장전' : '동장전';
                                return data + '인 / ' + gameType;
                            }

                            return data;
                        }
                    },
                    {
                        data: 'memberList.0.memberNo',
                        defaultContent: '',
                        visible: false,
                        searchable: false,
                    },
                    {
                        data: 'memberList.0.memberName',
                        defaultContent: '',
                        render: function (data, type, row) {
                            if (type === 'display' && data) {
                                let link = 'game-result.html?gameNo=' + row.gameNo + '&memberNo=' + row.memberList[0].memberNo + '&name=' + data + '&position=' + row.memberList[0].position + '&score=' + row.memberList[0].score + '&rank=' + row.memberList[0].rank + '&point=' + row.memberList[0].point;
                                return '<div class="winner-block"><a href="' + link + '">' + data + '</a>' + '<img class="winner-star" src="../assets/img/yellow-star.svg" alt="winner star"/></div>';
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
                        data: 'memberList.0.rank',
                        defaultContent: '',
                        visible: false,
                        searchable: false,
                    },
                    {
                        data: 'memberList.0.point',
                        defaultContent: '',
                        visible: false,
                        searchable: false,
                    },
                    {
                        data: 'memberList.1.memberNo',
                        defaultContent: '',
                        visible: false,
                        searchable: false,
                    },
                    {
                        data: 'memberList.1.memberName',
                        defaultContent: '',
                        render: function (data, type, row) {
                            if (type === 'display' && data) {
                                let link = 'game-result.html?gameNo=' + row.gameNo + '&memberNo=' + row.memberList[1].memberNo + '&name=' + data
                                    + '&position=' + row.memberList[1].position + '&score=' + row.memberList[1].score + '&rank=' + row.memberList[1].rank + '&point=' + row.memberList[1].point;

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
                        data: 'memberList.1.rank',
                        defaultContent: '',
                        visible: false,
                        searchable: false,
                    },
                    {
                        data: 'memberList.1.point',
                        defaultContent: '',
                        visible: false,
                        searchable: false,
                    },
                    {
                        data: 'memberList.2.memberNo',
                        defaultContent: '',
                        visible: false,
                        searchable: false,
                    },
                    {
                        data: 'memberList.2.memberName',
                        defaultContent: '',
                        render: function (data, type, row) {
                            if (type === 'display' && data) {
                                let link = 'game-result.html?gameNo=' + row.gameNo + '&memberNo=' + row.memberList[2].memberNo + '&name=' + data
                                    + '&position=' + row.memberList[2].position + '&score=' + row.memberList[2].score + '&rank=' + row.memberList[2].rank + '&point=' + row.memberList[2].point;

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
                        data: 'memberList.2.rank',
                        defaultContent: '',
                        visible: false,
                        searchable: false,
                    },
                    {
                        data: 'memberList.2.point',
                        defaultContent: '',
                        visible: false,
                        searchable: false,
                    },
                    {
                        data: 'memberList.3.memberNo',
                        defaultContent: '',
                        visible: false,
                        searchable: false,
                    },
                    {
                        data: 'memberList.3.memberName',
                        defaultContent: '',
                        render: function (data, type, row) {
                            if (type === 'display' && data) {
                                let link = 'game-result.html?gameNo=' + row.gameNo + '&memberNo=' + row.memberList[3].memberNo + '&name=' + data
                                    + '&position=' + row.memberList[3].position + '&score=' + row.memberList[3].score + '&rank=' + row.memberList[3].rank + '&point=' + row.memberList[3].point;

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
                        data: 'memberList.3.rank',
                        defaultContent: '',
                        visible: false,
                        searchable: false,
                    },
                    {
                        data: 'memberList.3.point',
                        defaultContent: '',
                        visible: false,
                        searchable: false,
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
        },
    });
});
