class AlbumsController < ApplicationController
  def index
    @photos = Album.all
  end

  def new
    @album = Album.new
  end

  def create
    @photo = Album.new(photo_params)
    if @photo.save
      redirect_to albums_url, :notice => "Successfully created Photo."
    else
      render :new
    end
  end
  
  private
  def photo_params
    params.require(:album).permit(:title, :image)
  end
 
end
