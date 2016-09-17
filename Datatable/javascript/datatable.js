function format ( d ) {
    // `d` is the original data object for the row
    if(ESData!=undefined && FSData!=undefined && OMData!=undefined){
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
            '<tr>'+
            '<td> Operating Unit ID</td>'+
            '<td>'+OMData.operatingUnitId+'</td>'+
            '</tr>'+
            '<tr>'+
            '<td>Paryent Terms</td>'+
            '<td>'+FSData.paymentTermsDescription+'</td>'+
            '</tr>'+
            '<tr>'+
            '<td>PSI Data</td>'+
            '<td>'+ESData.psiDescription+'</td>'+
            '</tr>'+
            '</table>';
    }else
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
            '<tr>'+
            '<td>Search Order</td>'+
            '<td></td>'+
            '</tr>'+
            '<tr>'+
            '<td>Search Order</td>'+
            '<td></td>'+
            '</tr>'+
            '<tr>'+
            '<td>Search Order</td>'+
            '<td></td>'+
            '</tr>'+
            '</table>';


}

function fetchData(value){
    var reg=/^[0-9]/;
    if(value.value==null || value.value=="" || value.value==undefined || !reg.test(value.value)){
        alert("Enter valid Order Number");
    }else{

        var xmlhttp1=false;
        if (!xmlhttp1 && typeof XMLHttpRequest!='undefined') {
            try {
                xmlhttp1 = new XMLHttpRequest();
            } catch (e) {
                xmlhttp1=false;
            }
        }
        if (!xmlhttp1 && window.createRequest) {
            try {
                xmlhttp1 = window.createRequest();
            } catch (e) {
                xmlhttp1=false;
            }
        }
        xmlhttp1.open("GET","https://eomapiauthentication.run.aws-usw02-pr.ice.predix.io/geteOMOrderDetails/"+value.value+"/fulfillmentSets/1",true);
        xmlhttp1.onreadystatechange=function() {
            if (xmlhttp1.readyState==4) {
                FSData=JSON.parse(xmlhttp1.responseText);
            }
        }
        xmlhttp1.send(null);

        var xmlhttp2=false;
        if (!xmlhttp2 && typeof XMLHttpRequest!='undefined') {
            try {
                xmlhttp2 = new XMLHttpRequest();
            } catch (e) {
                xmlhttp2=false;
            }
        }
        if (!xmlhttp2 && window.createRequest) {
            try {
                xmlhttp2 = window.createRequest();
            } catch (e) {
                xmlhttp2=false;
            }
        }
        xmlhttp2.open("GET","https://eomapiauthentication.run.aws-usw02-pr.ice.predix.io/geteOMOrderDetails/"+value.value+"/fulfillmentSets/1/equipmentSets/1",true);
        xmlhttp2.onreadystatechange=function() {
            if (xmlhttp2.readyState==4) {
                ESData=JSON.parse(xmlhttp2.responseText);
            }
        }
        xmlhttp2.send(null);

        var xmlhttp3=false;
        if (!xmlhttp3 && typeof XMLHttpRequest!='undefined') {
            try {
                xmlhttp3 = new XMLHttpRequest();
            } catch (e) {
                xmlhttp3=false;
            }
        }
        if (!xmlhttp3 && window.createRequest) {
            try {
                xmlhttp3 = window.createRequest();
            } catch (e) {
                xmlhttp3=false;
            }
        }
        xmlhttp3.open("GET","https://eomapiauthentication.run.aws-usw02-pr.ice.predix.io/geteOMOrderDetails/"+value.value,true);
        xmlhttp3.onreadystatechange=function() {
            if (xmlhttp3.readyState==4) {
                OMData=JSON.parse(xmlhttp3.responseText);
            }
        }
        xmlhttp3.send(null);

        setTimeout(dataRepopulate,5000);

    }
}
var ESData;
var FSData;
var OMData;
var table;
var TableData;


function dataRepopulate(){
    TableData.data[0].Onum=OMData['orderNumber'];
    TableData.data[0].Fnum=FSData['fulfillmentSetNumber'];
    TableData.data[0].Enum=ESData['fulfillmentSetNumber'];
    TableData.data[0].OUName=OMData['operatingUnitName'];
    table.clear().draw();
    table.row.add(TableData.data[0]).draw(false);
}

$(document).ready(function() {
    TableData={
        "data": [
            {
                Onum: "Search Data",
                OUName:"Search Data",
                Fnum: "Search Data",
                Enum: "Search Data"

            }
        ]
    };
     table= $('#example').DataTable( {
        paging:false,
        "data": TableData.data,
        "columns": [
            {
                "className":      'details-control mdl-data-table__cell--non-numeric',
                "orderable":      false,
                "data":           null,
                "defaultContent": ''

            },
            { "data": "Onum" },
            { "data": "OUName" },
            { "data": "Enum" },
            { "data": "Fnum" }

        ],
        "order": [[1, 'asc']],
        columnDefs: [
            {
                targets: [ 0, 1, 2 ,3,4],
                className: 'mdl-data-table__cell--non-numeric'
            }
        ]
    } );

    // Add event listener for opening and closing details
    $('#example tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row( tr );

        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format(row.data()) ).show();
            tr.addClass('shown');
        }
    } );
} );