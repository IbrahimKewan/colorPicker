/**
 * Beispiel-Anwendung für den ExtJS ColorPicker
 */

Ext.application({
    name: 'ColorPickerDemo',

    requires: [
        'Ext.ux.ColorPicker'
    ],

    launch: function() {
        // Hauptfenster erstellen
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [{
                xtype: 'panel',
                title: 'ExtJS ColorPicker Demo',
                layout: {
                    type: 'vbox',
                    align: 'center',
                    pack: 'center'
                },
                items: [
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        items: [
                            {
                                xtype: 'label',
                                text: 'Klicken Sie auf den Button, um den ColorPicker zu öffnen',
                                margin: '0 0 20 0',
                                style: {
                                    fontSize: '16px',
                                    fontWeight: 'bold'
                                }
                            },
                            {
                                xtype: 'button',
                                text: 'Farbe auswählen',
                                scale: 'large',
                                handler: function() {
                                    // ColorPicker erstellen und anzeigen
                                    var picker = Ext.create('Ext.ux.ColorPicker', {
                                        selectedColor: '#FF0000',
                                        listeners: {
                                            colorselected: function(picker, color) {
                                                // Ausgewählte Farbe anzeigen
                                                Ext.Msg.alert('Farbe ausgewählt', 'Sie haben die Farbe <b>' + color + '</b> ausgewählt.');

                                                // Hintergrundfarbe des Demo-Bereichs ändern
                                                var colorDisplay = Ext.ComponentQuery.query('#colorDisplay')[0];
                                                if (colorDisplay) {
                                                    colorDisplay.setStyle({
                                                        backgroundColor: color
                                                    });
                                                }

                                                // Hex-Wert anzeigen
                                                var colorLabel = Ext.ComponentQuery.query('#colorLabel')[0];
                                                if (colorLabel) {
                                                    colorLabel.setText('Ausgewählte Farbe: ' + color);
                                                }
                                            }
                                        }
                                    });

                                    picker.show();
                                }
                            },
                            {
                                xtype: 'container',
                                itemId: 'colorDisplay',
                                width: 200,
                                height: 100,
                                margin: '20 0 10 0',
                                style: {
                                    backgroundColor: '#FF0000',
                                    border: '2px solid #000'
                                }
                            },
                            {
                                xtype: 'label',
                                itemId: 'colorLabel',
                                text: 'Ausgewählte Farbe: #FF0000',
                                style: {
                                    fontSize: '14px',
                                    fontWeight: 'bold'
                                }
                            }
                        ]
                    }
                ]
            }]
        });
    }
});
