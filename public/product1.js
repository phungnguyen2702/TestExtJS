//import data from json file to variable store
var store = new Ext.data.JsonStore({
  url: data_url,
  //choice field 
  fields: [
    'id',
    'title',
    'image',
    'description',
    'price',
    'product_type'
  ]
});

store.load();
//editor 
var text_edit = new Ext.form.TextField();
var number_edit = new Ext.form.NumberField();
//new row
var ds_model = Ext.data.Record.create([
  'id',
  'title',
  'image',
  'description',
  {name: 'price', type: 'float'},
  {name: 'product_type', type: 'integer'}
]);


Ext.onReady( function(){
  var selModel = new Ext.grid.CheckboxSelectionModel({
    // override private method to allow toggling of selection on or off for multiple rows.
    handleMouseDown : function(g, rowIndex, e){
      var view = this.grid.getView();
      var isSelected = this.isSelected(rowIndex);
      if(isSelected) {
        this.deselectRow(rowIndex);
      } 
      else if(!isSelected || this.getCount() > 1) {
        this.selectRow(rowIndex, true);
        view.focusRow(rowIndex);
      }
    },
    singleSelect: false
  });
  
  var grid = new Ext.grid.EditorGridPanel({
    listeners: {
      afteredit: function(e){
        Ext.Ajax.request({
          url: update_url,
          method: 'POST',
          params: {
            id: e.record.id,
            field: e.field,
            value: e.value
          },
          success: function(resp,opt) {
            e.record.commit();
          },
          failure: function(resp,opt) {
            e.record.reject();
          }
        });
      }
    },
    renderTo:  Ext.get("table_products"),
    frame:true,
    title: 'Product Database',
    height: 650,
    width: 550,
    store: store,
    clickstoEdit: 1,
    sm: selModel,
    columns: [
      selModel,
      {id: 'ID', dataIndex: 'id', sortable: true, width: 40},
      {header: 'Title', dataIndex: "title", sortable: true, editor: text_edit},
      {header: 'Image', dataIndex: 'image', sortable: true, editor: text_edit},
      {header: 'Description', dataIndex: 'description', sortable: true, editor: text_edit},
      {header: 'Price', dataIndex: 'price', sortable: true, editor: number_edit},
      {header: 'Type', dataIndex: 'product_type', width: 55, sortable: true, editor: number_edit}
    ],
    tbar:[
      {
        text: 'Add',
        cls: 'x-btn-text-icon',
        handler: function(){
          var win = new  Ext.Window({
            title: 'New Product',
            layout: 'form',
            autoScroll: true,
            y: 120,
            width: 300,
            height: 170,
            modal: true,
            items: [{
              xtype: 'textfield',
              fieldLabel: 'Title',
              allowBlank: false,
              id: 'title',
              width: 180
            },
            {
              xtype: 'textfield',
              fieldLabel: 'Image',
              id: 'image',
              width: 180
            },
            {
              xtype: 'textfield',
              fieldLabel: 'Description',
              id: 'description',
              width: 180
            },
            {
              xtype: 'numberfield',
              fieldLabel: 'Price',
              id: 'price',
              width: 180
            },
            {
              xtype: 'numberfield',
              fieldLabel: 'Type',
              id: 'type',
              width: 180
            }],
            
            buttons: [{
              
              text: 'Create',
              key: Ext.EventObject.ENTER,
              handler: function(){
                var title = Ext.getCmp('title').getValue(),
                    image = Ext.getCmp('image').getValue(),
                    description = Ext.getCmp('description').getValue(),
                    price = Ext.getCmp('price').getValue(),
                    type = Ext.getCmp('type').getValue()
                Ext.Ajax.request({
                  url: create_url,
                  params: {
                      action: 'create',
                      title: title,
                      image: image,
                      description: description,
                      price: price,
                      product_type: type
                  },
                  success: function(resp,opt){
                    if(title == ""){
                      Ext.Msg.alert('Error','Title is not null!!!');
                    }
                    else if(Number.isNaN(parseInt(price)) == true){
                      Ext.Msg.alert('Error','Price is not a number!!!');
                    }
                    else{
                    store.reload();
                    var insert_id = Ext.util.JSON.decode(
                      resp.responseText
                    ).insert_id;
                    grid.getStore().insert(
                      grid.getStore().getCount(),
                      new ds_model
                    );
                    grid.startEditing(grid.getStore().getCount()-1,0);
                  }},
                  failure: function(resp,opt) {
                    Ext.Msg.alert('Error','Unable to add product');
                  }
                });
                
              win.close();
            }
            },{
              text: 'Cancel',
              handler: function(){
                win.close();
              }
            }]
          });
          win.show();
        }
      },
      {
        text: 'Delete',
        cls: 'x-btn-text-icon',
        handler: function(){
          var sm = grid.getSelectionModel();
          if (sm.hasSelection()){
            var sel = sm.selections.items;
            var ids ='';
            for(var i = 0; i < sel.length; i++){
              ids += sel[i].id
              if(i != sel.length-1)
                 ids += ",";
            }
            Ext.Msg.show({
              title: 'Remove Product',
              buttons: Ext.MessageBox.YESNOCANCEL,
              msg: 'Do you want Remove ?',
              fn: function(btn){
                if (btn == 'yes'){
                  Ext.Ajax.request({
                    url: destroy_url,
                    method: 'POST',
                    params: {
                      action: 'delete',
                      items: ids
                    },
                    success: function(resp,opt){
                      //grid.getStore().remove(sel);
                      store.reload();                        
                    },
                    failure: function(resp,opt){
                      Ext.Msg.alert('Error', 'Unable to delete product');
                    }
                  });
                }
              }
            });
          };
        }
      }
    ],
  });
});