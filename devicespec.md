A device has public facing "properties" that will be shown on the UI:

```json
{
  "on": {
    "name": "Allumé",
    "type": "boolean",
    "value": true
  },
  "intensity": {
    "name": "Intensité",
    "type": "range",
    "range": [0, 100],
    "value": 50
  },
  "color": {
    "name": "Couleur",
    "type": "color",
    "value": [255, 0, 0]
  }
}
```

A device has secret properties referred to as "credentials":

```json
{
  "password": "abc"
}
```

A device also exposes "actions", based on its state:

```json
{
  "turnOff": {
    "name": "Éteindre"
  },
  "setIntensity": {
    "name": "Définir l'intensité",
    "accepts": [
      { "type": "range", "range": [0, 100] }
    ]
  },
  "setColor": {
    "name": "Définir la couleur",
    "accepts": [
      { "type": "color" }
    ]
  }
}
```
