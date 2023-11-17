$(document).ready(() => {
    $('#register').click(() => {
        $('#register-div').show();
        $('#login-div').hide();
    })

    $('#login').click(() => {
        $("#register-div").hide();
        $("#login-div").show();

    })
    $('#login-div').hide();
})