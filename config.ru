# This file is used by Rack-based servers to start the application.

require_relative 'config/environment'

require "tus/server"

run Rails.application

map "/files" do
  run Tus::Server
end
