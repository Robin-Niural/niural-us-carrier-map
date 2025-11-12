# 📖 COMPLETE ANSWER: How Your JSON System Works

## The Core Issue (In Plain English)

Your data has **two separate files talking to each other**:

1. **appConfig.json** - Says "Please show these 5 fields"
2. **stateData.json** - Has data for 9 fields

**The Problem:** stateData has 4 extra fields (brokerContact, networkType, minWSE, customNote) that appConfig never asked for, so they never display!

---

## How It Works (Simple)

### The Journey of Data

```
You write in appConfig.json:
"I want to display carrier, coverageNotes, sdiRequirements"
              ↓
JavaScript reads this
              ↓
JavaScript asks stateData:
"Give me carrier, coverageNotes, sdiRequirements"
              ↓
stateData sends back:
carrier: "Restricted"
coverageNotes: "Aetna restricted..."
sdiRequirements: "Must maintain TDI"
              ↓
Display in tooltip/sidebar
```

**BUT** if stateData also has `brokerContact: "..."`, it never gets shown because you never asked for it!

---

## The Three Files You Have

### 1. appConfig.json (Configuration)
**What it does:** Tells the app "Here are the fields to display"

**Current content:**
```json
"cardFields": [
  "carrier",
  "largeGroupDefinition", 
  "coverageNotes",
  "sdiRequirements",
  "salesNotes"
]
```

### 2. stateData.json (Data)
**What it does:** Stores actual information for each state

**Current content (example HI):**
```json
"HI": {
  "carrier": "Restricted",
  "coverageNotes": "Aetna restricted...",
  "sdiRequirements": "Must maintain TDI",
  "salesNotes": "",
  "brokerContact": "Contact HI regional broker" ← EXTRA!
}
```

### 3. main.js (Logic - Already Fixed!)
**What it does:** 
- Reads appConfig to know what fields to show
- Reads stateData to get the values
- Displays them in tooltip and sidebar
- **Already set up correctly!** No changes needed here.

---

## The Exact Problem & Solution

### PROBLEM
```
appConfig says:        stateData has:
"Show carrier"    ✅   carrier: "Restricted"
"Show coverage"   ✅   coverage: "..."
"Show sdi"        ✅   sdi: "..."
(done)                 brokerContact: "..." ← IGNORED!
                       networkType: "..." ← IGNORED!
                       minWSE: "..." ← IGNORED!
                       customNote: "..." ← IGNORED!
```

### SOLUTION
Update appConfig to also ask for those fields:
```json
"cardFields": [
  "carrier",
  "largeGroupDefinition",
  "brokerContact",      ← ADD THIS
  "networkType",        ← ADD THIS
  "minWSE",            ← ADD THIS
  "customNote",        ← ADD THIS
  "coverageNotes",
  "sdiRequirements",
  "salesNotes"
]
```

---

## How to Make It Work

### EXACT STEPS

1. Open `data/appConfig.json`
2. Find this section:
```json
"cardFields": [
  { "key": "carrier", "label": "Primary Carrier", "showColor": true },
  { "key": "largeGroupDefinition", "label": "Large Group Definition", "showColor": false },
  { "key": "coverageNotes", "label": "Coverage Notes", "showColor": false },
  { "key": "sdiRequirements", "label": "SDI Requirements", "showColor": false },
  { "key": "salesNotes", "label": "Sales Notes", "showColor": false }
]
```

3. Replace with:
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

4. Save file
5. Hard refresh browser: `Ctrl+Shift+R`

**DONE!** ✅ All fields now display.

---

## Visual Before/After

### BEFORE (Current)
When you hover Hawaii:
```
Primary Carrier           Restricted
Large Group Def.          TBD
Coverage Notes            Aetna does not...
SDI Requirements          Must maintain...
Sales Notes               (empty)

↑ Missing: "Broker Contact: Contact HI regional broker"
```

### AFTER (Fixed)
When you hover Hawaii:
```
Primary Carrier           Restricted
Large Group Def.          TBD
Broker Contact            Contact HI regional broker ✅
Network Type              TBD
Minimum WSEs              TBD
Special Notes             TBD
Coverage Notes            Aetna does not...
SDI Requirements          Must maintain...
Sales Notes               (empty)
```

---

## Understanding Each Field

| Field Name | What It Contains | Example Value | Where Added |
|------------|-----------------|---------------|------------|
| carrier | Which carrier can serve | "Restricted", "Both", "Aetna" | All states |
| largeGroupDefinition | Employee count threshold | "51+ FTEs", "101+ FTEs" | Some states |
| brokerContact | Broker to contact | "Contact HI regional broker" | HI only |
| networkType | Type of coverage network | "PPO/Indemnity Only" | AK only |
| minWSE | Minimum employees | "50+ WSEs required" | MD only |
| customNote | Any custom note | "NY specific..." | NY only |
| coverageNotes | Details about coverage | "Aetna restricted...", "PPO only..." | All states |
| sdiRequirements | Disability insurance rules | "Must maintain TDI", "—" | All states |
| salesNotes | Sales-related notes | (mostly empty) | All states |

---

## Why Some Show "TBD"

When a field is in `cardFields` but not in stateData for that state:

```json
// appConfig says: "Show largeGroupDefinition"
// But HI doesn't have this field in stateData

Result: Shows "TBD"
```

To fix: Add the field to stateData for all states, or remove it from cardFields.

---

## The Matching Process (Step by Step)

When you hover Hawaii, here's what happens:

```
Step 1: Load appConfig.json
        → Read cardFields: ["carrier", "largeGroupDefinition", ...]
        
Step 2: Load stateData.json
        → Read HI object: {carrier: "...", brokerContact: "..."}
        
Step 3: For each field in cardFields:
        
        carrier:
        → Look for info["carrier"]
        → Found: "Restricted"
        → Display: "Primary Carrier: Restricted" ✅
        
        largeGroupDefinition:
        → Look for info["largeGroupDefinition"]
        → Not found
        → Display: "Large Group Definition: TBD" ⚠️
        
        brokerContact:
        → Look for info["brokerContact"]
        → Found: "Contact HI regional broker"
        → Display: "Broker Contact: Contact HI regional..." ✅
        
        (continue for all fields)
        
Step 4: Show tooltip with all results
```

---

## The Most Important Rule

## ⚠️ KEYS MUST MATCH EXACTLY

```
appConfig.json has:         stateData.json must have:
{ "key": "brokerContact" }  "brokerContact": "value"
                            ↑ EXACT SPELLING!
```

If keys don't match:
- `"brokerContact"` ✅ works
- `"brokercontact"` ❌ doesn't work (lowercase 'c')
- `"BrokerContact"` ❌ doesn't work (capital 'B')
- `"broker_contact"` ❌ doesn't work (underscore)

**Case matters! Spelling matters!**

---

## Common Questions

### "Why does it show 'TBD'?"
The field is in appConfig but not in that state's stateData. Either add the data to stateData or remove the field from appConfig.

### "Why doesn't the field appear at all?"
The field is in stateData but not in appConfig.cardFields. You need to add it to appConfig.

### "The page shows an error"
JSON syntax error. Use jsonlint.com to validate.

### "I made changes but nothing happened"
Browser cache. Do a hard refresh: Ctrl+Shift+R (not just F5).

### "How do I add a brand new field?"
1. Add to appConfig.cardFields
2. Add to stateData for states that need it
3. Reload page

---

## The Final Answer

Your system is **designed to work this way**:

1. **appConfig.json** = Menu of what to show
2. **stateData.json** = Kitchen with all the ingredients
3. **main.js** = Chef that looks at the menu and gets ingredients

Right now:
- ✅ main.js is perfect (chef works great)
- ✅ stateData.json has all the ingredients (kitchen is stocked)
- ❌ appConfig.json is incomplete (menu is missing items)

**Solution:** Update the menu (appConfig.json) to include all the items you want to serve.

---

## That's It!

You now understand exactly how your system works and how to fix it.

**Next step:** Apply the fix from `COPY_PASTE_FIX.md` and you're done! ✅

---

## Quick Reference Card

| Term | Means | Location |
|------|-------|----------|
| `cardFields` | "What fields to display" | appConfig.json |
| `key` | Field identifier (must match!) | Both files |
| `label` | Display name for user | appConfig.json |
| `showColor` | Show colored dot? (true/false) | appConfig.json |
| State data | Actual information for a state | stateData.json |

---

## Visual Quick Guide

```
appConfig.json
┌─────────────────────────────────────┐
│ cardFields: [                       │
│   { key: "carrier", label: "..." }  │
│   { key: "brokerContact", ... }     │ ← Defines what to show
│   ...                               │
│ ]                                   │
└─────────────────────────────────────┘
           ↓ Asks for
stateData.json
┌─────────────────────────────────────┐
│ HI: {                               │
│   carrier: "Restricted",            │ ← Provides data
│   brokerContact: "...",             │
│   ...                               │
│ }                                   │
└─────────────────────────────────────┘
           ↓ Displays
        Tooltip
┌─────────────────────────────────────┐
│ Carrier: Restricted                 │
│ Broker Contact: Contact HI broker   │
│ ...                                 │
└─────────────────────────────────────┘
```

Done! 🎉

