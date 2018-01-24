class Product < ApplicationRecord
  validates :title, presence: :true
  validates :price, numericality: :true
end
