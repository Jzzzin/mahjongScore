window.addEventListener('DOMContentLoaded', event => {
    // Simple-DataTables
    // https://github.com/fiduswriter/Simple-DataTables/wiki

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
    $('#rankDataTable').DataTable({
        ajax: {
            url: currentURL + '/api/rank',
            dataSrc: ''
        },
        searching: false,
        lengthChange: false,
        columns: [
            { data: 'rank' },
            { data: 'memberName' },
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
});
