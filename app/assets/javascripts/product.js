var data_url = '/products.json';//url json file
var update_url = '/update_extjs'
var create_url = '/create_extjs'
var destroy_url = '/destroy_extjs'
//import data from json file to variable store
var store = new Ext.data.JsonStore({
  url: data_url,
  //choice field 
  fields: [
  'id',
  'title',
  'image',
  'description',
  'price']
});

store.load();
//editor 
var title_edit = new Ext.form.TextField();
var image_edit = new Ext.form.TextField();
var desciption_edit = new Ext.form.TextField();
var price_edit = new Ext.form.NumberField();
//new row
var ds_model = Ext.data.Record.create([
  'id',
  'title',
  'image',
  'description',
  {name: 'price', type: 'float'}
]);
Ext.onReady( function(){
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
    height:250,
    width:530,
    store: store,
    clickstoEdit: 1,
    columns: [
      {id: 'ID', dataIndex: 'id', sortable: true},
      {header: 'Title', dataIndex: "title", sortable: true, editor: title_edit},
      {header: 'Image', dataIndex: 'image', sortable: true, editor: image_edit},
      {header: 'Description', dataIndex: 'description', sortable: true, editor: desciption_edit},
      {header: 'Price', dataIndex: 'price', sortable: true, editor: price_edit}
    ],
    tbar: [
      {
        text: 'Add',
        cls: 'x-btn-text-icon',
        handler: function(){
          Ext.Ajax.request({
            url: create_url,
            params: {
              title:'New products'
            },
            success: function(resp,opt){
              store.reload();
              var insert_id = Ext.util.JSON.decode(
                resp.responseText
              ).insert_id;
              grid.getStore().insert(
                grid.getStore().getCount(),
                new ds_model
              );
              grid.startEditing(grid.getStore().getCount()-1,0);
            },
            failure: function(resp,opt) {
              Ext.Msg.alert('Error','Unable to add product');
            }
            });
        } 
      },
      {
        text: 'Delete',
        cls: 'x-btn-text-icon',
        handler: function(){
          var sm = grid.getSelectionModel();
          var sel = sm.selection;
          if (sm.hasSelection()){
            Ext.Msg.show({
              title: 'Remove Product',
              buttons: Ext.MessageBox.YESNOCANCEL,
              msg: 'Remove ' + sel.record.data.title + '?',
              fn: function(btn){
                if (btn == 'yes'){
                  Ext.Ajax.request({
                    url: destroy_url,
                    method: 'POST',
                    params: {
                      action: 'delete',
                      id: sel.record.data.id
                    },
                    success: function(resp,opt){
                      grid.getStore().remove(sel);
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