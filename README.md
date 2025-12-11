# ExtJS ColorPicker Component

Ein erweiterter Color Picker für Sencha ExtJS, der dem klassischen Windows Color Dialog nachempfunden ist.

## Features

- **Grundfarben-Palette**: 48 vordefinierte Grundfarben zur schnellen Auswahl
- **Benutzerdefinierte Farben**: 16 Slots zum Speichern eigener Farben
- **Farbverlauf**: Interaktiver Farbverlauf zur präzisen Farbauswahl
- **Helligkeitsregler**: Vertikaler Slider zur Anpassung der Helligkeit
- **RGB-Eingabe**: Direkte Eingabe von Rot-, Grün- und Blau-Werten (0-255)
- **HSL-Eingabe**: Eingabe von Farbton (Farb), Sättigung (Sät) und Helligkeit (Hell)
- **Farben hinzufügen**: Speichern der aktuellen Farbe in den benutzerdefinierten Farben

## Dateien

```
colorPicker/
├── ColorPicker.xml              # XML-Konfiguration (für Sencha Architect)
├── src/
│   └── ux/
│       ├── ColorPicker.js       # JavaScript-Implementierung
│       └── ColorPicker.css      # CSS-Styling
├── app.js                       # Demo-Anwendung
├── index.html                   # Demo-Seite
└── README.md                    # Diese Datei
```

## Installation

### 1. Dateien einbinden

Kopieren Sie die ColorPicker-Dateien in Ihr ExtJS-Projekt:

```
your-project/
├── app/
│   └── ux/
│       ├── ColorPicker.js
│       └── ColorPicker.css
```

### 2. CSS einbinden

In Ihrer HTML-Datei:

```html
<link rel="stylesheet" type="text/css" href="app/ux/ColorPicker.css">
```

### 3. JavaScript einbinden

In Ihrer `app.js` oder `Application.js`:

```javascript
Ext.application({
    name: 'MyApp',

    requires: [
        'Ext.ux.ColorPicker'
    ],

    // ...
});
```

## Verwendung

### Einfache Verwendung

```javascript
// ColorPicker erstellen und anzeigen
var picker = Ext.create('Ext.ux.ColorPicker', {
    selectedColor: '#FF0000',  // Startfarbe (optional)
    listeners: {
        colorselected: function(picker, color) {
            console.log('Ausgewählte Farbe:', color);
            // Ihre Logik hier...
        }
    }
});

picker.show();
```

### In einem Button

```javascript
{
    xtype: 'button',
    text: 'Farbe auswählen',
    handler: function() {
        var picker = Ext.create('Ext.ux.ColorPicker', {
            selectedColor: '#00FF00',
            listeners: {
                colorselected: function(picker, color) {
                    // Farbe wurde ausgewählt
                    Ext.Msg.alert('Farbe', 'Ausgewählte Farbe: ' + color);
                }
            }
        });
        picker.show();
    }
}
```

### Mit Callback-Funktion

```javascript
function showColorPicker(currentColor, callback) {
    var picker = Ext.create('Ext.ux.ColorPicker', {
        selectedColor: currentColor,
        listeners: {
            colorselected: function(picker, color) {
                callback(color);
            }
        }
    });
    picker.show();
}

// Verwendung:
showColorPicker('#FF0000', function(selectedColor) {
    console.log('Neue Farbe:', selectedColor);
});
```

## Konfiguration

### Optionen

| Option | Typ | Standard | Beschreibung |
|--------|-----|----------|--------------|
| `selectedColor` | String | `'#FF0000'` | Die initial ausgewählte Farbe im Hex-Format |
| `customColors` | Array | `[]` | Array mit benutzerdefinierten Farben (max. 16) |

### Events

| Event | Parameter | Beschreibung |
|-------|-----------|--------------|
| `colorselected` | `picker, color` | Wird ausgelöst, wenn eine Farbe ausgewählt und OK geklickt wurde |

## Beispiel: Integration in ein Formular

```javascript
Ext.define('MyApp.view.MyForm', {
    extend: 'Ext.form.Panel',

    items: [
        {
            xtype: 'textfield',
            fieldLabel: 'Name',
            name: 'name'
        },
        {
            xtype: 'container',
            layout: 'hbox',
            items: [
                {
                    xtype: 'textfield',
                    fieldLabel: 'Farbe',
                    name: 'color',
                    itemId: 'colorField',
                    readOnly: true,
                    value: '#FF0000',
                    flex: 1
                },
                {
                    xtype: 'button',
                    text: '...',
                    margin: '0 0 0 5',
                    handler: function(btn) {
                        var form = btn.up('form'),
                            colorField = form.down('#colorField');

                        var picker = Ext.create('Ext.ux.ColorPicker', {
                            selectedColor: colorField.getValue(),
                            listeners: {
                                colorselected: function(picker, color) {
                                    colorField.setValue(color);
                                    colorField.setFieldStyle({
                                        backgroundColor: color
                                    });
                                }
                            }
                        });
                        picker.show();
                    }
                }
            ]
        }
    ]
});
```

## Demo ausführen

1. Öffnen Sie `index.html` in einem Webbrowser
2. Klicken Sie auf "Farbe auswählen"
3. Wählen Sie eine Farbe aus und klicken Sie auf "OK"

## XML-Konfiguration (Sencha Architect)

Die Datei `ColorPicker.xml` kann in Sencha Architect importiert werden:

1. Öffnen Sie Sencha Architect
2. Wählen Sie "File" → "Import" → "ExtJS Component"
3. Wählen Sie die `ColorPicker.xml` Datei
4. Der ColorPicker wird als wiederverwendbare Komponente hinzugefügt

## Browser-Kompatibilität

- Chrome (empfohlen)
- Firefox
- Safari
- Edge
- IE 11+ (mit ExtJS 6.x)

## ExtJS Version

Getestet mit ExtJS 6.2.0 und höher.
Sollte auch mit ExtJS 5.x und 7.x kompatibel sein.

## Lizenz

Dieses Component ist ein Beispiel und kann frei verwendet und modifiziert werden.

## Autor

Erstellt mit Claude Code für ExtJS/Sencha Framework

## Support

Bei Fragen oder Problemen erstellen Sie bitte ein Issue im Repository.

## Changelog

### Version 1.0.0
- Initiale Version
- Grundfarben-Palette
- Benutzerdefinierte Farben
- RGB/HSL Eingabe
- Farbverlauf und Helligkeitsregler
