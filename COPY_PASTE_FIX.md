# ✅ COPY-PASTE FIXES - Ready to Use

## The Problem (In One Sentence)
You have custom fields in stateData.json (like `brokerContact`, `networkType`) but they're not listed in appConfig.json's `cardFields`, so they don't display.

## The Solution
Add those fields to appConfig.json's `cardFields` array.

---

## OPTION 1: Show ALL Custom Fields (Recommended)

### Step 1: Open `data/appConfig.json`

### Step 2: Find the `cardFields` section (looks like this):
```json
"cardFields": [
  { "key": "carrier", "label": "Primary Carrier", "showColor": true },
  { "key": "largeGroupDefinition", "label": "Large Group Definition", "showColor": false },
  { "key": "coverageNotes", "label": "Coverage Notes", "showColor": false },
  { "key": "sdiRequirements", "label": "SDI Requirements", "showColor": false },
  { "key": "salesNotes", "label": "Sales Notes", "showColor": false }
]
```

### Step 3: Replace ENTIRE `cardFields` array with this:

```json
"cardFields": [
  { "key": "carrier", "label": "Primary Carrier", "showColor": true },
  { "key": "largeGroupDefinition", "label": "Large Group Definition", "showColor": false },
  { "key": "brokerContact", "label": "Broker Contact", "showColor": false },
  { "key": "networkType", "label": "Network Type", "showColor": false },
  { "key": "minWSE", "label": "Minimum WSEs", "showColor": false },
  { "key": "customNote", "label": "Special Notes", "showColor": false },
  { "key": "coverageNotes", "label": "Coverage Notes", "showColor": false },
  { "key": "sdiRequirements", "label": "SDI Requirements", "showColor": false },
  { "key": "salesNotes", "label": "Sales Notes", "showColor": false }
]
```

### Step 4: Save file

### Step 5: Hard refresh browser (Ctrl+Shift+R)

### Result ✅
All custom fields now display (or show "TBD" if not in that state):
- ✅ Broker Contact (shows for HI)
- ✅ Network Type (shows for AK)
- ✅ Minimum WSEs (shows for MD)
- ✅ Special Notes (shows for NY)

---

## OPTION 2: Show Only Essential Fields (If Too Cluttered)

### Use this instead:

```json
"cardFields": [
  { "key": "carrier", "label": "Primary Carrier", "showColor": true },
  { "key": "coverageNotes", "label": "Coverage Notes", "showColor": false },
  { "key": "sdiRequirements", "label": "SDI Requirements", "showColor": false },
  { "key": "salesNotes", "label": "Sales Notes", "showColor": false }
]
```

This shows only fields that exist for ALL states.

---

## OPTION 3: Custom Combination

Mix and match fields you want to display:

```json
"cardFields": [
  { "key": "carrier", "label": "Primary Carrier", "showColor": true },
  { "key": "brokerContact", "label": "Broker Contact", "showColor": false },
  { "key": "coverageNotes", "label": "Coverage Notes", "showColor": false },
  { "key": "sdiRequirements", "label": "SDI Requirements", "showColor": false }
]
```

---

## How to Make the Edit (Visual Guide)

### BEFORE (What you have now):
```
{
  "cardFields": [
    { "key": "carrier", "label": "Primary Carrier", "showColor": true },
    ...
    { "key": "salesNotes", "label": "Sales Notes", "showColor": false }
  ]
}
```

### AFTER (What you'll have):
```
{
  "cardFields": [
    { "key": "carrier", "label": "Primary Carrier", "showColor": true },
    ...additional fields here...
    { "key": "salesNotes", "label": "Sales Notes", "showColor": false }
  ]
}
```

---

## Complete appConfig.json (Option 1)

If you want to replace the ENTIRE file, here it is:

```json
{
  "branding": {
    "title": "PEO MHP Carrier Availability",
    "subtitle": "Hover or tap a state for carrier, large-group definition, age-rating notes, and sales nuances."
  },
  "legend": {
    "aetna": "Aetna Only",
    "kaiser": "Kaiser Only",
    "both": "Aetna & Kaiser",
    "restricted": "Restricted States"
  },
  "cardFields": [
    { "key": "carrier", "label": "Primary Carrier", "showColor": true },
    { "key": "largeGroupDefinition", "label": "Large Group Definition", "showColor": false },
    { "key": "brokerContact", "label": "Broker Contact", "showColor": false },
    { "key": "networkType", "label": "Network Type", "showColor": false },
    { "key": "minWSE", "label": "Minimum WSEs", "showColor": false },
    { "key": "customNote", "label": "Special Notes", "showColor": false },
    { "key": "coverageNotes", "label": "Coverage Notes", "showColor": false },
    { "key": "sdiRequirements", "label": "SDI Requirements", "showColor": false },
    { "key": "salesNotes", "label": "Sales Notes", "showColor": false }
  ],
  "territories": {
    "Puerto Rico": "HQ in PR may not offer an Aetna PEO medical master policy. Aetna can cover WSEs of continental US HQs with WSEs in PR. Indemnity / CMED only.",
    "US Virgin Islands": "Similar to PR: continental US HQs with WSEs in VI may be covered; Indemnity / CMED plans only."
  },
  "footerText": "© 2025 Niural AI | v1.0 "
}
```

---

## Validation Checklist

After making changes:

- [ ] Saved appConfig.json
- [ ] File has no syntax errors (check with jsonlint.com)
- [ ] Reloaded browser with Ctrl+Shift+R
- [ ] Fields appear in tooltip when hovering state
- [ ] Fields appear in sidebar when selecting state
- [ ] No "TBD" for fields that have data (check your stateData)

---

## What Each Field Shows

### After applying Option 1, here's what you'll see:

#### Hawaii (HI) - Hover:
```
Hawaii (HI)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Primary Carrier           🔴 Restricted
Large Group Definition    TBD
Broker Contact            Contact HI regional broker ✅ NOW SHOWS!
Network Type              TBD
Minimum WSEs              TBD
Special Notes             TBD
Coverage Notes            Aetna does not offer...
SDI Requirements          Employers must maintain...
Sales Notes               (empty)
```

#### Alaska (AK) - Hover:
```
Alaska (AK) *
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Primary Carrier           🟢 Both
Large Group Definition    TBD
Broker Contact            TBD
Network Type              PPO/Indemnity Only ✅ NOW SHOWS!
Minimum WSEs              TBD
Special Notes             TBD
Coverage Notes            PPO only and many areas...
SDI Requirements          —
Sales Notes               (empty)
```

#### Maryland (MD) - Hover:
```
Maryland (MD)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Primary Carrier           🟢 Both
Large Group Definition    TBD
Broker Contact            TBD
Network Type              TBD
Minimum WSEs              50+ WSEs required ✅ NOW SHOWS!
Special Notes             TBD
Coverage Notes            State regulations prohibit...
SDI Requirements          —
Sales Notes               (empty)
```

---

## If You Want to ADD More Fields

### Step 1: Define in appConfig.json

Add a line to `cardFields`:
```json
{ "key": "yourNewField", "label": "Your Label", "showColor": false }
```

### Step 2: Add data to stateData.json

For the states that need it:
```json
"CA": {
  "yourNewField": "Your data value here"
}
```

### Example: Add "Age Limits"

**appConfig.json:**
```json
{ "key": "ageLimits", "label": "Age Limits", "showColor": false }
```

**stateData.json - CA:**
```json
"CA": {
  "ageLimits": "No age limits",
  ...
}
```

---

## After Editing - Quick Test

1. Save appConfig.json
2. Press Ctrl+Shift+R in browser
3. Hover over Hawaii → Should see "Broker Contact: Contact HI regional broker"
4. Hover over Alaska → Should see "Network Type: PPO/Indemnity Only"
5. Hover over Maryland → Should see "Minimum WSEs: 50+ WSEs required"

If you don't see these, check:
- ✅ File was saved
- ✅ Browser was hard refreshed (Ctrl+Shift+R, not F5)
- ✅ No JSON syntax errors
- ✅ Browser console (F12) has no errors

---

## Still Not Working?

### Check 1: JSON Syntax
Go to https://jsonlint.com and paste your appConfig.json. If it says "Valid JSON" you're good.

### Check 2: Browser Console
Press F12, go to Console tab. If there are red errors, that's the problem.

### Check 3: Key Spelling
Make sure the `key` in appConfig.json matches EXACTLY the field name in stateData.json:
- ✅ `"brokerContact"` matches `"brokerContact"`
- ❌ `"brokerContact"` doesn't match `"brokercontact"` (case matters!)

### Check 3: Reload Type
- ❌ Don't just press F5
- ✅ Do press Ctrl+Shift+R (hard refresh to clear cache)

---

## Support Table

| Issue | Check |
|-------|-------|
| Field shows "TBD" | Key name typo or field not in stateData |
| Field doesn't appear | Field not in cardFields in appConfig |
| Page won't load | JSON syntax error (validate at jsonlint.com) |
| Changes don't show | Browser not hard-refreshed (use Ctrl+Shift+R) |

---

## That's It!

Just follow Option 1 above and you're done. All fields will display correctly. ✅

