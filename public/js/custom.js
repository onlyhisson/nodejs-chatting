/* declare global variable value */
let COMMON_VAL = {};    
$(function() {
    $.getJSON('../../public/static/globalVar.json', function(data) {
            COMMON_VAL = data;
    });
})

/* express-flash 응답값 */
function showToastr(type, msg) {
    setTimeout(function () {
        toastr.options = {
            "positionClass": "toast-top-right",
            "closeButton": true,
            "progressBar": true,
            "showEasing": "swing",
            "timeOut": "6000"
        };
        if(type == "success") {
            toastr.success(`<strong>${type.toUpperCase()}</strong> <br/><small>${msg} </small>`);
        };
        if(type == "info") {
            toastr.info(`<strong>${type.toUpperCase()}</strong> <br/><small>${msg} </small>`);
        };
        if(type == "warning") {
            toastr.warning(`<strong>${type.toUpperCase()}</strong> <br/><small>${msg} </small>`);
        };
        if(type == "error") {
            toastr.error(`<strong>${type.toUpperCase()}</strong> <br/><small>${msg} </small>`);
        };
    }, 700)
};
