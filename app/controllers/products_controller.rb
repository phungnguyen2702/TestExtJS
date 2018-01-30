class ProductsController < ApplicationController
  before_action :set_product, only: [:show, :edit, :update, :destroy]
  skip_before_action :verify_authenticity_token
  # GET /products
  # GET /products.json
  def index
    @products = Product.all
    @productss
    for i in 1..3
      @productss = @products.where(product_type: i)
    end 

    respond_to do |format|  
      format.html 
      format.json { render json:  @productss }#create file Json 
    end
  end
  def index2
    Product.find_by_sql 'select * from products order by price ASC limit 10'
    # lấy top 3 sp giá thấp nhất của mỗi loại
    Product.find_by_sql 'Select *, rank() 
              over(partition by product_type order by product_type, price ASC) AS stt
              From products'
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