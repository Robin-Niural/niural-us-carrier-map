# 🔍 DEBUGGING: How the Custom Fields System Actually Works

## The Problem

The system reads from `appConfig.cardFields` but there's a **CRITICAL ISSUE** - it's also rendering `salesNotes` TWICE in the tooltip!

Look at lines 521-524 in main.js:
```javascript
fieldsHTML += '</div>';

tooltipEl.html(`
  <h4>...</h4>
  ${fieldsHTML}
  ${info.salesNotes ? `<div style="margin-top:6px; color:var(--muted)">${info.salesNotes}</div>` : ''}  ← EXTRA RENDERING!
`);
```

**The issue:** `salesNotes` is being rendered TWICE:
1. Once as a regular field from `cardFields`
2. Once again separately at the bottom

---

## How the System Currently Works

### Step 1: appConfig.json Defines Fields
```json
"cardFields": [
  { "key": "carrier", "label": "Primary Carrier", "showColor": true },
  { "key": "largeGroupDefinition", "label": "Large Group Definition", "showColor": false },
  { "key": "coverageNotes", "label": "Coverage Notes", "showColor": false },
  { "key": "sdiRequirements", "label": "SDI Requirements", "showColor": false },
  { "key": "salesNotes", "label": "Sales Notes", "showColor": false }
]
```

### Step 2: main.js Reads These Fields
```javascript
const fields = appConfig.cardFields || [/* defaults */];

fields.forEach(field => {
  const value = info[field.key] || 'TBD';  // ← Read from state data
  // Render the field
});
```

### Step 3: stateData.json Provides Data
```json
"HI": {
  "carrier": "Restricted",
  "largeGroupDefinition": "51+ FTEs",
  "coverageNotes": "Aetna restricted in HI",
  "sdiRequirements": "Must maintain TDI",
  "salesNotes": "Contact HI broker"
}
```

---

## The Data Flow Diagram

```
appConfig.json
┌────────────────────────────────────────┐
│ "cardFields": [                        │
│   { "key": "carrier", "label": ... }   │
│   { "key": "customField", ... }        │
│ ]                                      │
└────────────────────────────────────────┘
             ↓
        KEY MATCHING
             ↓
stateData.json
┌────────────────────────────────────────┐
│ "HI": {                                │
│   "carrier": "Restricted",             │
│   "customField": "Your value"          │
│ }                                      │
└────────────────────────────────────────┘
             ↓
        main.js reads both
             ↓
  Renders each field in order
             ↓
     Tooltip & Sidebar Display
```

---

## Exact Editing Steps (With Examples)

### Example 1: Add "Broker Contact" Field

**Step 1: Edit appConfig.json**
```json
"cardFields": [
  { "key": "carrier", "label": "Primary Carrier", "showColor": true },
  { "key": "largeGroupDefinition", "label": "Large Group Definition", "showColor": false },
  { "key": "brokerContact", "label": "Broker Contact", "showColor": false },  ← ADD THIS
  { "key": "coverageNotes", "label": "Coverage Notes", "showColor": false },
  { "key": "sdiRequirements", "label": "SDI Requirements", "showColor": false },
  { "key": "salesNotes", "label": "Sales Notes", "showColor": false }
]
```

**Step 2: Edit stateData.json - Add to HI**
```json
"HI": {
  "coverageNotes": "Aetna does not offer compliant plans in HI for PEOs. Therefore, Aetna is restricted.",
  "salesNotes": "",
  "sdiRequirements": "Employers must maintain an approved Temporary Disability Insurance (TDI) policy and pay ≥ 50 % of premium.",
  "brokerContact": "Contact HI regional broker"  ← ADD THIS
}
```

**Step 3: Reload page**

**Result when hovering HI:**
```
Hawaii (HI)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Primary Carrier      🟣 Restricted
Large Group Def.     51+ FTEs
Broker Contact       Contact HI regional broker  ← NOW SHOWS!
Coverage Notes       Aetna does not offer...
SDI Requirements     Must maintain TDI...
Sales Notes          (empty)
```

---

### Example 2: Add "Network Type" Field

**Step 1: Edit appConfig.json**
Add to cardFields array:
```json
{ "key": "networkType", "label": "Network Type", "showColor": false }
```

**Step 2: Edit stateData.json - Add to AK**
```json
"AK": {
  "coverageNotes": "PPO only and many areas would only have access to our Indemnity or CMED plan.",
  "salesNotes": "",
  "sdiRequirements": "—",
  "networkType": "PPO/Indemnity Only"  ← ADD THIS
}
```

**Step 3: Reload page**

---

## Critical Point: Key Names MUST Match EXACTLY

### ✅ CORRECT
```json
// In appConfig.json
{ "key": "brokerContact", "label": "...", "showColor": false }

// In stateData.json
"brokerContact": "Your value"  ← EXACT MATCH!
```

### ❌ WRONG
```json
// In appConfig.json
{ "key": "brokerName", "label": "...", "showColor": false }

// In stateData.json
"broker_name": "Your value"  ← DIFFERENT! Won't work!
```

---

## Why It Might Not Be Working

### Issue 1: Key Name Mismatch
```javascript
// appConfig.json has:
{ "key": "brokerContact", ... }

// But stateData.json has:
"brokercontact": "value"  ← TYPO! Different case
```
**Fix:** Make sure keys match EXACTLY (case-sensitive)

### Issue 2: JSON Syntax Error
```json
// WRONG:
"brokerContact" "Your value"  ← Missing colon

// CORRECT:
"brokerContact": "Your value"  ← Has colon
```
**Fix:** Check for missing colons, quotes, or commas

### Issue 3: Not Reloading Page
Your edits won't show until you:
1. Save the file
2. Reload browser (F5 or Ctrl+R)

**Fix:** Hard refresh (Ctrl+Shift+R) to clear cache

### Issue 4: Data Only Added to One State
```json
// WRONG - only HI has the field:
"HI": { "brokerContact": "..." },
"AK": { /* doesn't have brokerContact */ }

// CORRECT - add to all states that need it:
"HI": { "brokerContact": "Contact HI broker" },
"AK": { "brokerContact": "Contact AK broker" }
```
**Fix:** Add the field to each state's object

---

## Complete Working Example

### File 1: appConfig.json
```json
{
  "branding": { ... },
  "legend": { ... },
  "cardFields": [
    { "key": "carrier", "label": "Primary Carrier", "showColor": true },
    { "key": "largeGroupDefinition", "label": "Large Group Definition", "showColor": false },
    { "key": "brokerContact", "label": "Broker Contact", "showColor": false },
    { "key": "networkType", "label": "Network Type", "showColor": false },
    { "key": "coverageNotes", "label": "Coverage Notes", "showColor": false },
    { "key": "sdiRequirements", "label": "SDI Requirements", "showColor": false },
    { "key": "salesNotes", "label": "Sales Notes", "showColor": false }
  ],
  "territories": { ... }
}
```

### File 2: stateData.json
```json
{
  "rules": { ... },
  "restrictedStates": {
    "HI": {
      "coverageNotes": "Aetna restricted in HI",
      "sdiRequirements": "Must maintain TDI",
      "salesNotes": "",
      "brokerContact": "Contact HI regional broker",
      "networkType": "Limited"
    }
  },
  "importantStates": {
    "AK": {
      "coverageNotes": "PPO only",
      "sdiRequirements": "—",
      "salesNotes": "",
      "brokerContact": "Contact AK broker",
      "networkType": "PPO/Indemnity Only"
    }
  }
}
```

---

## Field Matching Process (How It Works)

When you hover over HI:

```
1. JavaScript reads appConfig.cardFields:
   [
     { key: "carrier", label: "Primary Carrier", ... },
     { key: "brokerContact", label: "Broker Contact", ... },
     ...
   ]

2. For each field, it looks up the KEY in the state data:
   
   Field 1: key = "carrier"
   → Looks for info["carrier"]
   → Finds: "Restricted"
   → Displays: "Primary Carrier: Restricted"
   
   Field 2: key = "brokerContact"
   → Looks for info["brokerContact"]
   → Finds: "Contact HI regional broker"
   → Displays: "Broker Contact: Contact HI regional broker"
   
   Field 3: key = "missingField"
   → Looks for info["missingField"]
   → Doesn't find it
   → Displays: "Missing Field: TBD" (or "—" in sidebar)

3. Renders all in order defined in cardFields
```

---

## Quick Checklist When Adding Fields

✅ **Step 1: appConfig.json**
- [ ] Add `{ "key": "fieldName", "label": "Display Label", "showColor": false }` to cardFields array
- [ ] Key is unique (not duplicated)
- [ ] Label is descriptive
- [ ] Spelling is exactly correct

✅ **Step 2: stateData.json**
- [ ] Add `"fieldName": "Your value"` to each state that needs it
- [ ] Key spelling matches appConfig exactly (case-sensitive!)
- [ ] Value is in quotes and not empty
- [ ] JSON syntax is valid (all commas and braces correct)

✅ **Step 3: Test**
- [ ] Save both files
- [ ] Reload page (Ctrl+Shift+R for hard refresh)
- [ ] Hover over state to see tooltip
- [ ] Click state to see sidebar
- [ ] Check browser console (F12) for errors

---

## Common Mistakes & Fixes

| Mistake | How to Fix |
|---------|-----------|
| Field shows "TBD" | Key in appConfig doesn't match key in stateData |
| Field doesn't appear at all | JSON syntax error or typo in key name |
| Page won't load | Invalid JSON (check for missing quotes/commas) |
| Changes don't show | Page not reloaded or cache not cleared |
| Field appears in some states not others | Field only added to some state objects |

---

## How to Validate Your JSON

### Method 1: Use Online Tool
1. Go to https://jsonlint.com
2. Paste your stateData.json content
3. Click "Validate"
4. If it says "Valid JSON" you're good!

### Method 2: Check Browser Console
1. Press F12 to open developer tools
2. Look at the Console tab
3. If there are red errors, JSON is invalid

---

## Example: Full Working Setup for Two States

### appConfig.json:
```json
"cardFields": [
  { "key": "carrier", "label": "Carrier", "showColor": true },
  { "key": "brokerName", "label": "Broker", "showColor": false },
  { "key": "coverageNotes", "label": "Coverage", "showColor": false }
]
```

### stateData.json:
```json
"restrictedStates": {
  "HI": {
    "coverageNotes": "Aetna restricted",
    "brokerName": "Pacific Brokers",
    "salesNotes": ""
  },
  "NM": {
    "coverageNotes": "Aetna recommends against",
    "brokerName": "Southwest Brokers",
    "salesNotes": ""
  }
}
```

### Result:
**HI card:**
```
Carrier: 🔴 Restricted
Broker: Pacific Brokers
Coverage: Aetna restricted
```

**NM card:**
```
Carrier: 🔴 Restricted
Broker: Southwest Brokers
Coverage: Aetna recommends against
```

---

## Summary

The system works by:
1. ✅ You define field names in `appConfig.json` (cardFields)
2. ✅ You provide data in `stateData.json` (matching those field names)
3. ✅ JavaScript automatically matches keys and displays them
4. ✅ Reload page to see changes

**Most common issue:** Key name typo. Make sure they match EXACTLY!

