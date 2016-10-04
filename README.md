# shrine-rails-example


Rails Project using [Shrine](https://github.com/janko-m/shrine) and [Tus-Ruby-Server](https://github.com/janko-m/tus-ruby-server)


## Files

config.ru
```ruby 
# Add This Lines
require "tus/server"

map "/files" do
  run Tus::Server
end
```

config/initializers/shrine.rb
```ruby
require "shrine"
require "shrine/storage/file_system"
require "shrine/storage/url"

Shrine.storages = {

  cache: Shrine::Storage::Url.new, # temporary
  store: Shrine::Storage::FileSystem.new("public", prefix: "upload_files/store" ), # permanent
}

Shrine.plugin :activerecord
Shrine.plugin :cached_attachment_data # for forms
Shrine.plugin :logging, logger: Rails.logger
Shrine.plugin :rack_file
```

app/uploder/image_uploader.rb
```ruby
class ImageUploader  < Shrine

    plugin :determine_mime_type
    plugin :restore_cached_data
    plugin :validation_helpers

    Attacher.validate do
      validate_max_size 5.megabytes, message: 'is too large (max is 5 MB)'
      validate_mime_type_inclusion ['image/jpeg', 'image/png', 'image/gif']
    end

end
```

app/models/album.rb
```ruby
class Album < ApplicationRecord
  include ImageUploader[:image]
end
```

app/assets/javascripts/application.js
```javascript

//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require tus


jQuery(function() {
 $("input[type=file]").on("change", function(e) {
    var file = e.target.files[0];
    var fileField = $(e.target)

    fileField.val("");

    var upload = new tus.Upload(file, {
      endpoint: "http://localhost:3006/files",.
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

        fileField.prev().val(JSON.stringify(file));
        fileField.after($('<p> <img src="' + upload.url + '"></img></p>'));
      }
    });

    var progressBar = $('<div class="progress" style="width: 300px"><div class="progress-bar"></div></div>').insertBefore(e.target);

    upload.start();
})
});
```


## Usage

This sample Running server on 3006 port.

If you wanna another port, change `application.js`  file Line 27

Thanks to Help [janko-m](https://github.com/janko-m)


## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Added some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request


## License

The gem is available as open source under the terms of the [MIT
License](http://opensource.org/licenses/MIT).



