CCTVList = new Ext.Application({
    name: "CCTVList",
    launch: function() {
        CCTVList.detailToolbar = new Ext.Toolbar({
            items: [{
                text: 'Back',
                ui: 'back',
                handler: function() {
                    CCTVList.Viewport.setActiveItem('listwrapper', {type:'slide', direction:'right'});
                }
            }]
        });

        CCTVList.detailPanel = new Ext.Panel({
            id: 'detailpanel',
            tpl: '<img width= "100%" src="{link_img}" alt="{name}"/>',
            dockedItems: [CCTVList.detailToolbar]
        });

        CCTVList.listPanel = new Ext.List({
            id: 'indexlist',
            store: store,
            itemTpl: '<div class="contact">{name}</div>',
            grouped: true,
            onItemDisclosure: function(record) {
                var name = record.data.name;
                CCTVList.detailToolbar.setTitle(name);
                CCTVList.detailPanel.update(record.data);
                CCTVList.Viewport.setActiveItem('detailpanel');
            }
        });

        CCTVList.listWrapper = new Ext.Panel({
            id: 'listwrapper',
            layout: 'fit',
            items: [CCTVList.listPanel],
            dockedItems: [{
                xtype: 'toolbar',
                title: 'CCTV ทั่วกรุงเทพ'
            }]
        });

        CCTVList.Viewport = new Ext.Panel ({
            fullscreen: true,
            layout: 'card',
            cardSwitchAnimation: 'slide',
            items: [CCTVList.listWrapper, CCTVList.detailPanel]
        });

    }
});


Ext.regModel('CCTV', {
    fields: [
        {
            name: 'id', type: 'integer',
            name: 'name', type: 'string',
            name: 'link_img', type: 'string',
        }
    ]
});

var store;
Ext.util.JSONP.request({
                url: 'http://www.together.in.th/drupal/traffy/wrapper/getcctv',
                callbackKey: 'call',
                params: { available:'t', api: 'getCCTV', format: 'JS', },
                callback: function(data) {
                    var arr = []
                    Ext.iterate(data, function(k, row) {
                      arr.push({id: k, name: row.name_th, link_img: row.url});
                    })
                    store = new Ext.data.JsonStore({
                        model  : 'CCTV',
                        sorters: 'name',
                        getGroupString : function(record) {
                          return record.get('name')[0];
                        },
                        data: arr
                    });
                }
});
