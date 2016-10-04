require "shrine"
require "shrine/storage/file_system"
require "shrine/storage/url"

Shrine.storages = {
  #cache: Shrine::Storage::FileSystem.new("public", prefix: "files/cache" ), # temporary
  #store: Shrine::Storage::FileSystem.new("public", prefix: "files/store" ), # permanent
  cache: Shrine::Storage::Url.new, # temporary
  store: Shrine::Storage::FileSystem.new("public", prefix: "upload_files/store" ), # permanent
}

Shrine.plugin :activerecord
Shrine.plugin :cached_attachment_data # for forms
Shrine.plugin :logging, logger: Rails.logger
Shrine.plugin :rack_file
#Shrine.plugin :direct_upload, presign: true
#Shrine.plugin :backgrounding

#Shrine::Attacher.promote { |data| PromoteJob.perform_async(data) }
#Shrine::Attacher.delete { |data| DeleteJob.perform_async(data) }
