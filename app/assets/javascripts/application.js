// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
// require turbolinks
//= require tus


jQuery(function() {
 $("input[type=file]").on("change", function(e) {
    var file = e.target.files[0];
    var fileField = $(e.target)

    fileField.val("");

    var upload = new tus.Upload(file, {
      endpoint: "http://localhost:3006/files", 
      metadata: {filename: file.name, content_type: file.type},
      onError: function(error) {
        alert(error);
      },
      onProgress: function(bytesSent, bytesTotal) {
        var progress = parseInt(bytesSent / bytesTotal * 100, 10);
        var percentage = progress.toString() + '%';
        progressBar.find(".progress-bar").css("width", percentage).html(percentage);
      },
      onSuccess: function(result) {
        progressBar.remove();

        var file = {
          storage: "cache",
          id: upload.url,
          metadata: {
            filename:  upload.file.name.match(/[^\/\\]+$/)[0], // IE returns full path
            size:      upload.file.size,
            mime_type: upload.file.type,
          }
        }

        /*alert(upload.url); */
        fileField.prev().val(JSON.stringify(file));
        fileField.after($('<p> <img src="' + upload.url + '"></img></p>'));
      }
    });

    var progressBar = $('<div class="progress" style="width: 300px"><div class="progress-bar"></div></div>').insertBefore(e.target);

    upload.start();
})
});
