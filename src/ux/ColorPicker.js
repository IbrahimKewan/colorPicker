/**
 * ExtJS Color Picker Component
 * Ein erweiterter Color Picker ähnlich dem Windows Color Dialog
 */
Ext.define('Ext.ux.ColorPicker', {
    extend: 'Ext.window.Window',
    alias: 'widget.colorpicker',

    requires: [
        'Ext.layout.container.Border',
        'Ext.layout.container.VBox',
        'Ext.layout.container.HBox',
        'Ext.form.field.Number'
    ],

    title: 'Farbe',
    width: 480,
    height: 400,
    modal: true,
    resizable: false,
    closable: true,
    layout: 'border',

    config: {
        /**
         * @cfg {String} selectedColor
         * Die aktuell ausgewählte Farbe im Hex-Format
         */
        selectedColor: '#FF0000',

        /**
         * @cfg {Array} customColors
         * Array für benutzerdefinierte Farben
         */
        customColors: []
    },

    /**
     * Grundfarben Palette
     */
    basicColors: [
        // Zeile 1
        ['#FFB6C1', '#FFFFE0', '#90EE90', '#00FF00', '#7FFFD4', '#1E90FF', '#DDA0DD', '#FFB6C1'],
        // Zeile 2
        ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF', '#C0C0C0', '#FF00FF'],
        // Zeile 3
        ['#8B0000', '#FFD700', '#008000', '#008080', '#000080', '#8B008B', '#808080', '#8B008B'],
        // Zeile 4
        ['#800000', '#FF8C00', '#006400', '#008B8B', '#00008B', '#4B0082', '#696969', '#4B0082'],
        // Zeile 5
        ['#8B4513', '#DAA520', '#556B2F', '#2F4F4F', '#191970', '#483D8B', '#2F4F4F', '#483D8B'],
        // Zeile 6
        ['#000000', '#808000', '#556B2F', '#A9A9A9', '#708090', '#D3D3D3', '#4B0082', '#FFFFFF']
    ],

    initComponent: function() {
        var me = this;

        // Initialisiere custom colors array
        if (!me.customColors || me.customColors.length === 0) {
            me.customColors = new Array(16).fill('#FFFFFF');
        }

        me.items = [
            me.createLeftPanel(),
            me.createCenterPanel(),
            me.createBottomPanel()
        ];

        me.callParent(arguments);

        // Nach dem Rendern Initialisierung durchführen
        me.on('afterrender', me.onAfterRender, me);
    },

    /**
     * Erstellt das linke Panel mit Farb-Paletten
     */
    createLeftPanel: function() {
        var me = this;

        return {
            xtype: 'container',
            region: 'west',
            width: 240,
            padding: 10,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'label',
                    text: 'Grundfarben',
                    margin: '0 0 5 0'
                },
                me.createBasicColorPalette(),
                {
                    xtype: 'label',
                    text: 'Benutzerdefinierte Farben',
                    margin: '15 0 5 0'
                },
                me.createCustomColorPalette(),
                {
                    xtype: 'button',
                    text: 'Farben definieren >>',
                    margin: '10 0 0 0',
                    handler: me.onDefineColors,
                    scope: me
                }
            ]
        };
    },

    /**
     * Erstellt die Grundfarben-Palette
     */
    createBasicColorPalette: function() {
        var me = this,
            items = [];

        me.basicColors.forEach(function(row) {
            row.forEach(function(color) {
                items.push({
                    xtype: 'button',
                    width: 24,
                    height: 20,
                    style: {
                        backgroundColor: color,
                        border: '1px solid #999',
                        cursor: 'pointer'
                    },
                    margin: 1,
                    color: color,
                    handler: function() {
                        me.setColorFromHex(color);
                    }
                });
            });
        });

        return {
            xtype: 'container',
            layout: {
                type: 'table',
                columns: 8
            },
            items: items
        };
    },

    /**
     * Erstellt die benutzerdefinierte Farben-Palette
     */
    createCustomColorPalette: function() {
        var me = this,
            items = [];

        for (var i = 0; i < 16; i++) {
            items.push({
                xtype: 'button',
                width: 24,
                height: 20,
                itemId: 'customColor' + i,
                colorIndex: i,
                style: {
                    backgroundColor: me.customColors[i] || '#FFFFFF',
                    border: '1px solid #999',
                    cursor: 'pointer'
                },
                margin: 1,
                handler: function(btn) {
                    var color = me.customColors[btn.colorIndex];
                    if (color && color !== '#FFFFFF') {
                        me.setColorFromHex(color);
                    }
                }
            });
        }

        return {
            xtype: 'container',
            itemId: 'customColorPalette',
            layout: {
                type: 'table',
                columns: 8
            },
            items: items
        };
    },

    /**
     * Erstellt das mittlere Panel mit Farbverlauf und Helligkeit
     */
    createCenterPanel: function() {
        var me = this;

        return {
            xtype: 'container',
            region: 'center',
            padding: '10 10 0 10',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'container',
                    itemId: 'colorGradient',
                    width: 200,
                    height: 200,
                    style: {
                        position: 'relative',
                        cursor: 'crosshair',
                        border: '1px solid #000'
                    },
                    listeners: {
                        afterrender: function(cmp) {
                            me.gradientEl = cmp.getEl();
                            me.setupGradientListeners();
                        }
                    }
                },
                {
                    xtype: 'container',
                    itemId: 'brightnessSlider',
                    width: 30,
                    height: 200,
                    margin: '0 0 0 10',
                    style: {
                        position: 'relative',
                        cursor: 'pointer',
                        border: '1px solid #000'
                    },
                    listeners: {
                        afterrender: function(cmp) {
                            me.brightnessEl = cmp.getEl();
                            me.setupBrightnessListeners();
                        }
                    }
                }
            ]
        };
    },

    /**
     * Erstellt das untere Panel mit Eingabefeldern und Buttons
     */
    createBottomPanel: function() {
        var me = this;

        return {
            xtype: 'container',
            region: 'south',
            padding: 10,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'container',
                            flex: 1,
                            layout: 'form',
                            defaults: {
                                xtype: 'numberfield',
                                labelWidth: 40,
                                width: 100,
                                listeners: {
                                    change: function() {
                                        me.onHSLChange();
                                    }
                                }
                            },
                            items: [
                                {
                                    fieldLabel: 'Farb',
                                    itemId: 'hueField',
                                    minValue: 0,
                                    maxValue: 360,
                                    value: 0
                                },
                                {
                                    fieldLabel: 'Sät',
                                    itemId: 'satField',
                                    minValue: 0,
                                    maxValue: 240,
                                    value: 240
                                },
                                {
                                    fieldLabel: 'Hell',
                                    itemId: 'lumField',
                                    minValue: 0,
                                    maxValue: 240,
                                    value: 120
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            flex: 1,
                            margin: '0 0 0 10',
                            layout: 'form',
                            defaults: {
                                xtype: 'numberfield',
                                labelWidth: 40,
                                width: 100,
                                listeners: {
                                    change: function() {
                                        me.onRGBChange();
                                    }
                                }
                            },
                            items: [
                                {
                                    fieldLabel: 'Rot',
                                    itemId: 'redField',
                                    minValue: 0,
                                    maxValue: 255,
                                    value: 255
                                },
                                {
                                    fieldLabel: 'Grün',
                                    itemId: 'greenField',
                                    minValue: 0,
                                    maxValue: 255,
                                    value: 0
                                },
                                {
                                    fieldLabel: 'Blau',
                                    itemId: 'blueField',
                                    minValue: 0,
                                    maxValue: 255,
                                    value: 0
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    margin: '10 0 0 0',
                    items: [
                        {
                            xtype: 'button',
                            text: 'Farben hinzufügen',
                            handler: me.onAddColor,
                            scope: me
                        },
                        {
                            xtype: 'component',
                            flex: 1
                        },
                        {
                            xtype: 'button',
                            text: 'OK',
                            width: 80,
                            handler: me.onOK,
                            scope: me
                        },
                        {
                            xtype: 'button',
                            text: 'Abbrechen',
                            width: 80,
                            margin: '0 0 0 5',
                            handler: me.onCancel,
                            scope: me
                        }
                    ]
                }
            ]
        };
    },

    /**
     * Nach dem Rendern
     */
    onAfterRender: function() {
        var me = this;
        me.updateGradient();
        me.updateBrightnessSlider();
        me.setColorFromHex(me.selectedColor);
    },

    /**
     * Setup Gradient Listeners
     */
    setupGradientListeners: function() {
        var me = this;

        me.gradientEl.on('click', function(e) {
            var box = me.gradientEl.getBox(),
                x = e.getX() - box.x,
                y = e.getY() - box.y;

            me.onGradientClick(x, y, box.width, box.height);
        });
    },

    /**
     * Setup Brightness Listeners
     */
    setupBrightnessListeners: function() {
        var me = this;

        me.brightnessEl.on('click', function(e) {
            var box = me.brightnessEl.getBox(),
                y = e.getY() - box.y;

            me.onBrightnessClick(y, box.height);
        });
    },

    /**
     * Gradient Klick Handler
     */
    onGradientClick: function(x, y, width, height) {
        var me = this,
            hue = (x / width) * 360,
            sat = 240,
            lum = (1 - (y / height)) * 120 + 120;

        me.down('#hueField').setValue(Math.round(hue));
        me.down('#satField').setValue(Math.round(sat));
        me.down('#lumField').setValue(Math.round(lum));

        me.onHSLChange();
    },

    /**
     * Brightness Klick Handler
     */
    onBrightnessClick: function(y, height) {
        var me = this,
            brightness = (1 - (y / height)) * 255;

        me.currentBrightness = brightness / 255;
        me.updateFromCurrentColor();
    },

    /**
     * Update Gradient Hintergrund
     */
    updateGradient: function() {
        var me = this,
            gradient = me.down('#colorGradient');

        if (gradient && gradient.getEl()) {
            gradient.getEl().setStyle({
                background: 'linear-gradient(to right, ' +
                    'rgb(255,0,0) 0%, ' +
                    'rgb(255,255,0) 17%, ' +
                    'rgb(0,255,0) 33%, ' +
                    'rgb(0,255,255) 50%, ' +
                    'rgb(0,0,255) 67%, ' +
                    'rgb(255,0,255) 83%, ' +
                    'rgb(255,0,0) 100%), ' +
                    'linear-gradient(to bottom, ' +
                    'rgba(255,255,255,1) 0%, ' +
                    'rgba(255,255,255,0) 50%, ' +
                    'rgba(0,0,0,1) 100%)'
            });
        }
    },

    /**
     * Update Brightness Slider
     */
    updateBrightnessSlider: function() {
        var me = this,
            slider = me.down('#brightnessSlider'),
            currentColor = me.getCurrentRGB();

        if (slider && slider.getEl()) {
            slider.getEl().setStyle({
                background: 'linear-gradient(to bottom, ' +
                    'rgb(' + currentColor.r + ',' + currentColor.g + ',' + currentColor.b + ') 0%, ' +
                    'rgb(0,0,0) 100%)'
            });
        }
    },

    /**
     * HSL Change Handler
     */
    onHSLChange: function() {
        var me = this,
            h = me.down('#hueField').getValue(),
            s = me.down('#satField').getValue(),
            l = me.down('#lumField').getValue();

        if (h === null || s === null || l === null) return;

        var rgb = me.hslToRgb(h, s / 240, l / 240);

        me.suspendRGBEvents = true;
        me.down('#redField').setValue(rgb.r);
        me.down('#greenField').setValue(rgb.g);
        me.down('#blueField').setValue(rgb.b);
        me.suspendRGBEvents = false;

        me.selectedColor = me.rgbToHex(rgb.r, rgb.g, rgb.b);
    },

    /**
     * RGB Change Handler
     */
    onRGBChange: function() {
        var me = this;

        if (me.suspendRGBEvents) return;

        var r = me.down('#redField').getValue(),
            g = me.down('#greenField').getValue(),
            b = me.down('#blueField').getValue();

        if (r === null || g === null || b === null) return;

        var hsl = me.rgbToHsl(r, g, b);

        me.suspendHSLEvents = true;
        me.down('#hueField').setValue(Math.round(hsl.h));
        me.down('#satField').setValue(Math.round(hsl.s * 240));
        me.down('#lumField').setValue(Math.round(hsl.l * 240));
        me.suspendHSLEvents = false;

        me.selectedColor = me.rgbToHex(r, g, b);
    },

    /**
     * Setzt Farbe von Hex-Wert
     */
    setColorFromHex: function(hex) {
        var me = this,
            rgb = me.hexToRgb(hex);

        me.down('#redField').setValue(rgb.r);
        me.down('#greenField').setValue(rgb.g);
        me.down('#blueField').setValue(rgb.b);

        me.onRGBChange();
    },

    /**
     * Holt aktuellen RGB-Wert
     */
    getCurrentRGB: function() {
        var me = this;
        return {
            r: me.down('#redField').getValue() || 0,
            g: me.down('#greenField').getValue() || 0,
            b: me.down('#blueField').getValue() || 0
        };
    },

    /**
     * Update von aktueller Farbe
     */
    updateFromCurrentColor: function() {
        var me = this,
            rgb = me.getCurrentRGB();

        me.setColorFromHex(me.rgbToHex(rgb.r, rgb.g, rgb.b));
    },

    /**
     * HSL zu RGB Konvertierung
     */
    hslToRgb: function(h, s, l) {
        h = h / 360;
        var r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            var hue2rgb = function(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;

            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    },

    /**
     * RGB zu HSL Konvertierung
     */
    rgbToHsl: function(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        var max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return {
            h: h * 360,
            s: s,
            l: l
        };
    },

    /**
     * RGB zu Hex Konvertierung
     */
    rgbToHex: function(r, g, b) {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    },

    /**
     * Hex zu RGB Konvertierung
     */
    hexToRgb: function(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    },

    /**
     * Event Handlers
     */
    onDefineColors: function() {
        // TODO: Erweiterte Farbdefinition implementieren
        Ext.Msg.alert('Info', 'Erweiterte Farbdefinition - nicht implementiert');
    },

    onAddColor: function() {
        var me = this,
            color = me.selectedColor;

        // Finde ersten freien Slot
        for (var i = 0; i < me.customColors.length; i++) {
            if (me.customColors[i] === '#FFFFFF') {
                me.customColors[i] = color;

                var btn = me.down('#customColor' + i);
                if (btn) {
                    btn.setStyle({
                        backgroundColor: color,
                        border: '1px solid #999'
                    });
                }
                break;
            }
        }
    },

    onOK: function() {
        var me = this;
        me.fireEvent('colorselected', me, me.selectedColor);
        me.close();
    },

    onCancel: function() {
        this.close();
    }
});
