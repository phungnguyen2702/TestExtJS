class ProductsController < ApplicationController
  before_action :set_product, only: [:show, :edit, :update, :destroy]
  skip_before_action :verify_authenticity_token


  # ID: 6f433d68-d4d9-4796-8bf4-263ef7e6e26f
  # secret: 9jPZiqikU6ZfIYb7DHy7JKvkzH09L8kqetaii9xKMVQ=



  # GET /products
  # GET /products.json
  def index

    # @products = Product.all
    # hash_products = Hash.new
    
    # @products.each { |p|
    #   hash_products[p.product_type] = Array.new if !hash_products[p.product_type]
    #   hash_products[p.product_type] << p
    # }
    
    # top_price_min_products = Array.new
    # hash_products.each_value{ |value| 
    #     value.uniq!(&:price)[0..4]
    #   top_price_min_products += value.sort_by(&:price) if value.first.product_type == 1
    #   top_price_min_products += value.sort if value.first.product_type  == 2
    #   top_price_min_products += value.sort_by(&:title) if value.first.product_type == 3
    # }
    # top_price_min_products.sort_by!(&:product_type)
    top_price_min_products = Product.find_by_sql 'Select * from( Select *, row_number()
                                                        over(partition by product_type order by price ASC) as pt
                                                        from (Select distinct on (product_type, price) * from products) as P ) as P
                                                  where P.pt <= 5
                                                  order by
                                                        case when product_type = 1 then price end,
                                                        case when product_type = 2 then title end,
                                                        case when product_type = 3 then id end'
    respond_to do |format|
      format.html 
      format.json {render json:  top_price_min_products }#create file Json 
    end
  end
  
  def index2
    Product.find_by_sql 'select * from products order by price ASC limit 10'
    # lấy top 5 sp giá thấp nhất của mỗi loại
    Product.find_by_sql 'Select * from( Select *, row_number() 
                                        over(partition by product_type order by price ASC) as pt 
                                        from products as P ) as P 
                                  where P.pt <= 5'

    # lấy top 5 sp thấp giá nhất mỗi loại điều kiện giá ko trùng nhau mỗi loại sắp xếp khác nhau
    Product.find_by_sql 'WITH pro as (select distinct on (product_type, price) * from products)
                                                  Select * from( Select *, row_number() 
                                                        over(partition by product_type order by price ASC) as pt 
                                                        from pro as P ) as P 
                                                  where P.pt <= 5
                                                  order by  
                                                          case when product_type = 1 then price end,
                                                          case when product_type = 2 then title end,
                                                          case when product_type = 3 then id end'
  end
 
  # GET /products/1
  # GET /products/1.json
  # def show
  # end

  # # GET /products/new
  # def new
  #   @product = Product.new
  # end

  # # GET /products/1/edit
  # def edit
  # end

  # # POST /products
  # # POST /products.json
  # def create
  #   @product = Product.new(product_params)
  #   respond_to do |format|
  #     if @product.save
  #       format.html { redirect_to @product, notice: 'Product was successfully created.' }
  #       format.json { render :show, status: :created, location: @product }
  #     else
  #       format.html { render :new }
  #       format.json { render json: @product.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end

  # # PATCH/PUT /products/1
  # # PATCH/PUT /products/1.json
  # def update
  #   #binding.pry
  #   respond_to do |format|
  #     if @product.update(product_params)
  #       format.html { redirect_to @product, notice: 'Product was successfully updated.' }
  #       format.json { render :show, status: :ok, location: @product }
  #     else
  #       format.html { render :edit }
  #       format.json { render json: @product.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end

  # # DELETE /products/1
  # # DELETE /products/1.json
  # def destroy
  #   @product.destroy
  #   respond_to do |format|
  #     format.html { redirect_to products_url, notice: 'Product was successfully destroyed.' }
  #     format.json { head :no_content }
  #   end
  # end

  ############################ Def ExtJS
  def create_extjs
    @product = Product.new(title: params['title'], image: params['image'],
                              description: params['description'],price: params['price'])
    @product.save
  end
  
  def update_extjs
    @product = Product.find_by_id(params["id"])
    @product.update_column :"#{params["field"]}", params["value"]
  end
  def destroy_extjs
    arr = params['items'].split(',').map(&:to_i)
    #arr.map!{|item| item.to_i}
    #Product.where(id: arr).destroy_all
    Product.destroy(arr)
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_product
      @product = Product.find(params[:id])
    end
    
    # Never trust parameters from the scary internet, only allow the white list through.
    # def product_params
    #   params.require(:product).permit(:title, :image, :description, :price)
    # end
end
# [1,2,3,3,4,4]