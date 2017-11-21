$(document).ready(function() {

  $('#header h1').text(Context.appName);

  if (Context.env !== "development") {
    $('#header #deploy-btn-group').hide();
  }

  $('#header #open-btn').attr('href', 'http://' + window.location.host);

 
  $( "#files" ).click(function() {
    $( "#body-container" ).hide();
    $( "#body-container1" ).show(); 
  });

  $( "#apis" ).click(function() {
    $( "#body-container1" ).hide();
    $( "#body-container" ).show(); 
  });

});