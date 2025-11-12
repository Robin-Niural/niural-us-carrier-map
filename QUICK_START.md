# Quick Start: Adding Custom Fields to State Info Cards

## The Fastest Way to Add Custom Data

### 3-Step Process

#### **Step 1: Add your custom field to appConfig.json**

Open `data/appConfig.json` and add your field to the `cardFields` array:

```json
"cardFields": [
  { "key": "carrier", "label": "Primary Carrier", "showColor": true },
  { "key": "largeGroupDefinition", "label": "Large Group Definition", "showColor": false },
  { "key": "yourCustomKey", "label": "Your Custom Label", "showColor": false }  ← ADD THIS
]
```

#### **Step 2: Add the data to states in stateData.json**

Find the state you want to update and add your custom key:

```json
"importantStates": {
  "CA": {
    "coverageNotes": "...",
    "yourCustomKey": "Your custom value here"  ← ADD THIS
  }
}
```

#### **Step 3: Reload the page**

That's it! Your custom field now appears in both the tooltip (hover) and sidebar card (select state).

---

## Common Examples

### Add a "Network Type" field

**appConfig.json:**
```json
{ "key": "networkType", "label": "Network Type", "showColor": false }
```

**stateData.json:**
```json
"AK": {
  "networkType": "PPO/Indemnity Only"
}
```

### Add a "Min WSEs" requirement

**appConfig.json:**
```json
{ "key": "minEmployees", "label": "Minimum Employees", "showColor": false }
```

**stateData.json:**
```json
"MD": {
  "minEmployees": "50 WSEs minimum"
}
```

### Add a "Broker" contact

**appConfig.json:**
```json
{ "key": "brokerName", "label": "Regional Broker", "showColor": false }
```

**stateData.json:**
```json
"HI": {
  "brokerName": "Pacific Brokers LLC"
}
```

---

## How It Appears

### When Hovering Over a State (Tooltip):
```
California (CA)
┌─────────────────────────┐
│ Primary Carrier    Both │
│ Large Group Def.   101+ │
│ Network Type       PPO  │
│ Coverage Notes     ...  │
└─────────────────────────┘
```

### When Selecting a State (Sidebar):
```
┌──────────────────────┐
│ California (CA)      │
├──────────────────────┤
│ Primary Carrier: Both│
│ Large Group Def: 101+│
│ Network Type: PPO    │
│ Coverage Notes: ...  │
└──────────────────────┘
```

---

## Field Parameters Explained

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `key` | string | `"carrier"` | The property name in state data |
| `label` | string | `"Primary Carrier"` | Display name in the card |
| `showColor` | boolean | `true` | Show colored dot (carrier only) |

---

## Important Notes

✅ **DO:**
- Match key names exactly between appConfig and stateData
- Use descriptive, concise labels
- Only set `showColor: true` for the carrier field
- Reload page after making changes

❌ **DON'T:**
- Use special characters in keys
- Leave keys as empty strings
- Add `showColor: true` to non-carrier fields
- Forget to reload the page

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Custom field shows "TBD" or "—" | Check that the `key` matches exactly in stateData.json |
| Field doesn't appear at all | Verify JSON syntax is valid (use jsonlint.com) |
| Page shows errors | Check browser console (F12) for JSON parsing errors |
| Changes don't show | Hard refresh page (Ctrl+Shift+R or Cmd+Shift+R) |

---

## Files You'll Edit

- 📝 `data/appConfig.json` - Define what fields to show
- 📝 `data/stateData.json` - Add data for each state

That's all you need! No code changes required.

