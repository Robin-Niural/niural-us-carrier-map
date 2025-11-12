# State Info Card Customization - Implementation Summary

## ✅ What's Been Implemented

### 1. **Dynamic Card Field Configuration**
The state info cards (tooltip on hover + sidebar detail card) now read their field configuration from `data/appConfig.json` instead of being hardcoded.

### 2. **Custom Key-Value Support**
You can add any custom fields to individual states in `data/stateData.json`:
- `restrictedStates` - Restricted states
- `importantStates` - Important/special states
- `notableStates` - Notable states with special rules

### 3. **No Code Changes Required**
All customization is done through JSON config files - no JavaScript changes needed.

## 📋 How to Use

### Step 1: Define Card Fields (appConfig.json)
```json
"cardFields": [
  { "key": "carrier", "label": "Primary Carrier", "showColor": true },
  { "key": "largeGroupDefinition", "label": "Large Group Definition", "showColor": false },
  { "key": "customField", "label": "Your Custom Label", "showColor": false }
]
```

### Step 2: Add Custom Data to States (stateData.json)
```json
"importantStates": {
  "AK": {
    "coverageNotes": "PPO only...",
    "networkType": "PPO/Indemnity Only",
    "limitation": "Geographic coverage limited"
  }
}
```

### Step 3: Reload Page
Changes take effect immediately on page reload!

## 🎯 Real-World Examples

### Example 1: Add Broker Information
**appConfig.json:**
```json
"cardFields": [
  { "key": "carrier", "label": "Primary Carrier", "showColor": true },
  { "key": "brokerContact", "label": "Broker Contact", "showColor": false },
  { "key": "coverageNotes", "label": "Coverage Notes", "showColor": false }
]
```

**stateData.json:**
```json
"restrictedStates": {
  "HI": {
    "brokerContact": "Contact HI regional broker",
    "coverageNotes": "..."
  }
}
```

### Example 2: Add Minimum Requirements
**appConfig.json:**
```json
"cardFields": [
  { "key": "carrier", "label": "Carrier", "showColor": true },
  { "key": "minWSE", "label": "Minimum WSEs", "showColor": false },
  { "key": "coverageNotes", "label": "Coverage", "showColor": false }
]
```

**stateData.json:**
```json
"importantStates": {
  "MD": {
    "minWSE": "50+ WSEs required",
    "coverageNotes": "..."
  }
}
```

## 🔄 How It Works

### Tooltip (on hover):
- Reads `appConfig.cardFields` configuration
- Dynamically renders each field from the state's data object
- Shows colored dot for carrier field if `showColor: true`
- Displays "TBD" if field data is missing

### Sidebar Detail Card (when selected):
- Uses the same `appConfig.cardFields` configuration
- Renders all fields in order
- Displays "—" if field data is missing
- Carrier field shown with colored chip

## ✨ Key Features

1. **Flexible** - Add any custom fields you want
2. **No Code Changes** - JSON configuration only
3. **Reorderable** - Change field order in `cardFields` array
4. **Fallback Values** - Shows "TBD" or "—" for missing data
5. **Consistent** - Same fields appear in both tooltip and sidebar
6. **Color Support** - Highlight important fields with color dots

## 📝 Tips for Adding Custom Fields

1. **Keep labels concise** for tooltip readability
2. **Match key names exactly** to field names in state data
3. **Use consistent naming** across all states (e.g., always use "brokerContact" not sometimes "broker")
4. **Test on reload** to verify your JSON syntax is valid
5. **Use showColor sparingly** - usually only for carrier field

## 🗂️ File References

- **Configuration:** `data/appConfig.json` → `cardFields` array
- **State Data:** `data/stateData.json` → All state objects
- **JavaScript:** `assets/js/main.js` → `showTooltip()` and `renderDetail()` functions

## 📚 Full Documentation

See `CONFIG_GUIDE.md` for detailed configuration examples and advanced usage patterns.

