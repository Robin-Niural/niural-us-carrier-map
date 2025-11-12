# Visual Guide: Adding Custom Fields

## The System Architecture

```
┌─────────────────────────────────────────────────────┐
│  data/appConfig.json                                │
│  ┌─────────────────────────────────────────────────┐│
│  │ "cardFields": [                                  ││
│  │   { "key": "carrier", "label": "...", ... },   ││
│  │   { "key": "customField", "label": "...", ... }││
│  │ ]                                               ││
│  └─────────────────────────────────────────────────┘│
│           ↓                                          │
│           Defines structure and labels              │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  assets/js/main.js                                  │
│  ┌─────────────────────────────────────────────────┐│
│  │ showTooltip() {                                  ││
│  │   fields.forEach(field => {                     ││
│  │     value = info[field.key] || "TBD"           ││
│  │     // Render field dynamically                 ││
│  │   })                                            ││
│  │ }                                               ││
│  └─────────────────────────────────────────────────┘│
│           ↓                                          │
│      Reads config and data                          │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  data/stateData.json                                │
│  ┌─────────────────────────────────────────────────┐│
│  │ "importantStates": {                            ││
│  │   "AK": {                                       ││
│  │     "carrier": "...",                           ││
│  │     "customField": "Your data here"             ││
│  │   }                                             ││
│  │ }                                               ││
│  └─────────────────────────────────────────────────┘│
│           ↓                                          │
│      Provides actual data values                    │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  Tooltip & Sidebar Cards                            │
│  ┌─────────────────────────────────────────────────┐│
│  │ Alaska (AK) *                                   ││
│  │ ───────────────────────────────────             ││
│  │ Carrier:    🟣 Aetna                            ││
│  │ Field 1:    PPO/Indemnity Only                  ││
│  │ CustomFld:  Your data here                      ││
│  │ Coverage:   Limited network...                  ││
│  └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

## Step-by-Step Flow

### Example: Add a "Network Type" field for Alaska

**Step 1: Define in appConfig.json**
```json
"cardFields": [
  { "key": "carrier", "label": "Carrier", "showColor": true },
  { "key": "networkType", "label": "Network Type", "showColor": false },  ← ADD THIS
  { "key": "coverageNotes", "label": "Coverage", "showColor": false }
]
```

**Step 2: Add data in stateData.json**
```json
"importantStates": {
  "AK": {
    "coverageNotes": "PPO only...",
    "networkType": "PPO/Indemnity Only"  ← ADD THIS
  }
}
```

**Step 3: Reload page**

**Result:**
```
When you hover/select Alaska:

Alaska (AK) *
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Carrier              🟣 Aetna
Network Type         PPO/Indemnity
Coverage             Limited areas...
```

## Data Flow Example

```
User hovers over Alaska (AK)
        ↓
JavaScript triggers showTooltip()
        ↓
Reads appConfig.cardFields
        ↓
For each field in cardFields:
  → Read the "key" property (e.g., "networkType")
  → Look up info["networkType"] from stateData
  → Display the label + value
        ↓
Tooltip appears with all fields rendered
```

## Multiple Custom Fields Example

**appConfig.json:**
```json
"cardFields": [
  { "key": "carrier", "label": "Carrier", "showColor": true },
  { "key": "brokerName", "label": "Broker", "showColor": false },
  { "key": "networkType", "label": "Network", "showColor": false },
  { "key": "minEmployees", "label": "Min Size", "showColor": false },
  { "key": "coverageNotes", "label": "Coverage", "showColor": false }
]
```

**stateData.json:**
```json
"importantStates": {
  "MD": {
    "brokerName": "Mid-Atlantic Brokers",
    "networkType": "PPO/EPO",
    "minEmployees": "50+ WSEs required",
    "coverageNotes": "State regulations require verification"
  }
}
```

**Display Result:**
```
Maryland (MD)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Carrier           🟣 Both
Broker            Mid-Atlantic Brokers
Network           PPO/EPO
Min Size          50+ WSEs required
Coverage          State regulations...
```

## Comparison: Before vs After

### ❌ BEFORE (Hardcoded)
```javascript
// Had to edit JavaScript code to change fields
function renderDetail(name, code, info) {
  // Hardcoded labels and fields
  const rows = [
    ['Primary carrier', info.carrier || 'Unknown'],
    ['Large group definition', info.largeGroupDefinition || 'TBD'],
    // ...add new field here? Need to code!
  ];
}
```

### ✅ AFTER (Configurable)
```json
{
  "cardFields": [
    { "key": "carrier", "label": "Primary Carrier", "showColor": true },
    { "key": "newField", "label": "New Field", "showColor": false }  ← Just add here!
  ]
}
```

## Common Patterns

### Pattern 1: Broker Information
```json
"cardFields": [
  { "key": "carrier", "label": "Carrier", "showColor": true },
  { "key": "brokerName", "label": "Broker Name", "showColor": false },
  { "key": "brokerPhone", "label": "Broker Phone", "showColor": false },
  { "key": "brokerEmail", "label": "Broker Email", "showColor": false }
]
```

### Pattern 2: Compliance Requirements
```json
"cardFields": [
  { "key": "carrier", "label": "Carrier", "showColor": true },
  { "key": "minEmployees", "label": "Min Employees", "showColor": false },
  { "key": "maxAge", "label": "Max Age", "showColor": false },
  { "key": "complianceNotes", "label": "Special Rules", "showColor": false }
]
```

### Pattern 3: Network Details
```json
"cardFields": [
  { "key": "carrier", "label": "Carrier", "showColor": true },
  { "key": "networkType", "label": "Network Type", "showColor": false },
  { "key": "providerCount", "label": "Providers", "showColor": false },
  { "key": "coverage", "label": "Coverage", "showColor": false }
]
```

## Error Prevention

| Problem | Why It Happens | Solution |
|---------|---|---|
| Field shows "TBD" | Key in appConfig doesn't match stateData | Check spelling exactly matches |
| Field doesn't show | JSON syntax error | Validate with jsonlint.com |
| Value always blank | No data added to state | Add the custom field to state object |
| Page won't load | Invalid JSON | Check all quotes and commas |

## Quick Checklist

✓ Define field in `appConfig.json` cardFields  
✓ Spell key exactly the same in both files  
✓ Add data to state object in `stateData.json`  
✓ Use valid JSON (check syntax)  
✓ Reload page (hard refresh if needed)  
✓ Check browser console for errors (F12)  

That's it! 🎉

