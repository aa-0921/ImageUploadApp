class ImageUploader < CarrierWave::Uploader::Base
  # if Rails.env.development?
  #   storage :file
  # elsif Rails.env.test?
  #   storage :file
  # else
  #   storage :fog
  # end

  storage :fog

  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
    # => "uploads/image/image/4"

    # => "image"
    # model=> #<Image:0x00007fd5601c28d8
    #  id: nil,
    #  name: "2021/08/15 15:56:03 pry",
    #  image: nil,
    #  created_at: nil,
    #  updated_at: nil>
  end

  def extension_whitelist
    %w[jpg jpeg gif png]
  end

  def filename
    # self.file.extension => "png"    original_filename => "四角顔アイコン.png"
    "#{secure_token}.#{file.extension}" if original_filename.present?
  end

  protected

  # filenameメソッドで使われている
  def secure_token
    # self.class => ImageUploader
    # self.mounted_as => :image
    var = :"@#{mounted_as}_secure_token" # => :@image_secure_token
    #  nil  or   "ed3a76ee-0177-4fea-b75e-12eb6e5bb52d"
    model.instance_variable_get(var) or model.instance_variable_set(var, SecureRandom.uuid)
  end

  # Include RMagick or MiniMagick support:
  # include CarrierWave::RMagick
  # include CarrierWave::MiniMagick

  # Choose what kind of storage to use for this uploader:
  # storage :file
  # storage :fog

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  # def store_dir
  #   "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  # end

  # Provide a default URL as a default if there hasn't been a file uploaded:
  # def default_url(*args)
  #   # For Rails 3.1+ asset pipeline compatibility:
  #   # ActionController::Base.helpers.asset_path("fallback/" + [version_name, "default.png"].compact.join('_'))
  #
  #   "/images/fallback/" + [version_name, "default.png"].compact.join('_')
  # end

  # Process files as they are uploaded:
  # process scale: [200, 300]
  #
  # def scale(width, height)
  #   # do something
  # end

  # Create different versions of your uploaded files:
  # version :thumb do
  #   process resize_to_fit: [50, 50]
  # end

  # Add an allowlist of extensions which are allowed to be uploaded.
  # For images you might use something like this:
  # def extension_allowlist
  #   %w(jpg jpeg gif png)
  # end

  # Override the filename of the uploaded files:
  # Avoid using model.id or version_name here, see uploader/store.rb for details.
  # def filename
  #   "something.jpg" if original_filename
  # end
end
