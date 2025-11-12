# 🔴 CURRENT STATE ANALYSIS - What's Working vs Not Working

## Your Data Right Now

### appConfig.json - Current cardFields
```json
"cardFields": [
  { "key": "carrier", "label": "Primary Carrier", "showColor": true },
  { "key": "largeGroupDefinition", "label": "Large Group Definition", "showColor": false },
  { "key": "coverageNotes", "label": "Coverage Notes", "showColor": false },
  { "key": "sdiRequirements", "label": "SDI Requirements", "showColor": false },
  { "key": "salesNotes", "label": "Sales Notes", "showColor": false }
]
```

### stateData.json - What Data Exists

| State | Available Fields | Status |
|-------|-----------------|--------|
| HI (restricted) | carrier, coverageNotes, salesNotes, sdiRequirements, **brokerContact** | 1 hidden field |
| AK (important) | carrier, coverageNotes, salesNotes, sdiRequirements, **networkType** | 1 hidden field |
| MD (important) | carrier, coverageNotes, salesNotes, sdiRequirements, **minWSE** | 1 hidden field |
| NY (notable) | carrier, coverageNotes, salesNotes, sdiRequirements, **customNote** | 1 hidden field |

---

## The Mismatch Problem

### ✅ FIELDS THAT DISPLAY (In appConfig.cardFields)
1. `carrier` ✅ Shows in appConfig
2. `largeGroupDefinition` ✅ Shows in appConfig  
3. `coverageNotes` ✅ Shows in appConfig
4. `sdiRequirements` ✅ Shows in appConfig
5. `salesNotes` ✅ Shows in appConfig

### ❌ FIELDS THAT DON'T DISPLAY (Missing from appConfig.cardFields)
1. `brokerContact` ❌ Exists in stateData (HI) but NOT in appConfig
2. `networkType` ❌ Exists in stateData (AK) but NOT in appConfig
3. `minWSE` ❌ Exists in stateData (MD) but NOT in appConfig
4. `customNote` ❌ Exists in stateData (NY) but NOT in appConfig

---

## Current Situation - Visualized

### When You Hover Hawaii

**What stateData.json HAS:**
```json
"HI": {
  "coverageNotes": "Aetna does not offer...",
  "salesNotes": "",
  "sdiRequirements": "Employers must maintain...",
  "brokerContact": "Contact HI regional broker"
}
```

**What appConfig.cardFields ASKS FOR:**
```json
[
  { "key": "carrier", ... },              ✅ Found
  { "key": "largeGroupDefinition", ... }, ? Not in stateData
  { "key": "coverageNotes", ... },        ✅ Found
  { "key": "sdiRequirements", ... },      ✅ Found
  { "key": "salesNotes", ... }            ✅ Found
]
```

**What Gets Displayed:**
```
Primary Carrier        🟣 Restricted
Large Group Definition TBD (not in stateData)
Coverage Notes         Aetna does not offer...
SDI Requirements       Employers must maintain...
Sales Notes            (empty)

brokerContact: "Contact HI regional broker"  ← HIDDEN! Not in cardFields!
```

---

## The Fix

### Option 1: Add Missing Fields to cardFields (RECOMMENDED)

**Edit appConfig.json - Replace cardFields with:**

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

**Result after reload:**
```
When hovering Hawaii:
Primary Carrier        🟣 Restricted
Large Group Definition TBD
Broker Contact         Contact HI regional broker  ← NOW VISIBLE!
Network Type           TBD (not in HI)
Minimum WSEs           TBD (not in HI)
Special Notes          TBD (not in HI)
Coverage Notes         Aetna does not offer...
SDI Requirements       Employers must maintain...
Sales Notes            (empty)
```

### Option 2: Keep it Simple (Only Show What Every State Has)

**Just keep 5 existing fields:**

```json
"cardFields": [
  { "key": "carrier", "label": "Primary Carrier", "showColor": true },
  { "key": "largeGroupDefinition", "label": "Large Group Definition", "showColor": false },
  { "key": "coverageNotes", "label": "Coverage Notes", "showColor": false },
  { "key": "sdiRequirements", "label": "SDI Requirements", "showColor": false },
  { "key": "salesNotes", "label": "Sales Notes", "showColor": false }
]
```

This is already working perfectly. Custom fields will show as "TBD" unless added to ALL states.

---

## State-by-State Current State

### Hawaii (HI) - Restricted State
**Has these in stateData:**
- ✅ carrier: "Restricted"
- ❓ largeGroupDefinition: (not present - shows TBD)
- ❓ brokerContact: "Contact HI regional broker" (not in cardFields - hidden!)
- ✅ coverageNotes: "Aetna does not offer..."
- ✅ sdiRequirements: "Employers must maintain..."
- ✅ salesNotes: ""

### Alaska (AK) - Important State
**Has these in stateData:**
- ✅ carrier: "Both"
- ❓ largeGroupDefinition: (not present - shows TBD)
- ❓ networkType: "PPO/Indemnity Only" (not in cardFields - hidden!)
- ✅ coverageNotes: "PPO only and many areas..."
- ✅ sdiRequirements: "—"
- ✅ salesNotes: ""

### Maryland (MD) - Important State
**Has these in stateData:**
- ✅ carrier: "Both"
- ❓ largeGroupDefinition: (not present - shows TBD)
- ❓ minWSE: "50+ WSEs required" (not in cardFields - hidden!)
- ✅ coverageNotes: "State regulations prohibit..."
- ✅ sdiRequirements: "—"
- ✅ salesNotes: ""

### New York (NY) - Notable State
**Has these in stateData:**
- ✅ carrier: "Both"
- ❓ largeGroupDefinition: (not present - shows TBD)
- ❓ customNote: "NY specific custom field" (not in cardFields - hidden!)
- ✅ coverageNotes: "Standard Aetna PPO and EPO..."
- ✅ sdiRequirements: "Employers must provide both..."
- ✅ salesNotes: ""

---

## Why It Seems "Broken"

### The Issue
Some custom fields exist in your stateData but don't show up because they're **not defined in cardFields**.

It's like having a book with chapters you never listed in the table of contents!

### The Solution
Just add those field definitions to the `cardFields` array in appConfig.json.

---

## What Happens When Page Loads

### Current Flow

```
1. appConfig.json loads
   ↓
2. JavaScript reads: "Show these 5 fields"
   [carrier, largeGroupDefinition, coverageNotes, sdiRequirements, salesNotes]
   ↓
3. stateData.json loads
   ↓
4. When you hover HI:
   - JavaScript looks for each of the 5 fields
   - carrier: ✅ Found "Restricted"
   - largeGroupDefinition: ❌ Not found → Shows "TBD"
   - coverageNotes: ✅ Found "Aetna does not..."
   - sdiRequirements: ✅ Found "Employers must..."
   - salesNotes: ✅ Found "" (empty)
   ↓
5. Tooltip shows:
   Primary Carrier        Restricted
   Large Group Definition TBD
   Coverage Notes         Aetna does not...
   SDI Requirements       Employers must...
   Sales Notes            (empty)
   
   BUT: brokerContact, networkType, minWSE IGNORED
   (Not in cardFields, so never requested!)
```

---

## Exact Fix to Apply Right Now

### Step 1: Open appConfig.json

### Step 2: Find this section:
```json
"cardFields": [
  { "key": "carrier", "label": "Primary Carrier", "showColor": true },
  { "key": "largeGroupDefinition", "label": "Large Group Definition", "showColor": false },
  { "key": "coverageNotes", "label": "Coverage Notes", "showColor": false },
  { "key": "sdiRequirements", "label": "SDI Requirements", "showColor": false },
  { "key": "salesNotes", "label": "Sales Notes", "showColor": false }
]
```

### Step 3: Replace with:
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

### Step 4: Save and reload page

**Result:** All custom fields now visible (or show "TBD" if not in that state)

---

## Summary Table

| Field | In stateData? | In cardFields? | Shows? | Fix |
|-------|--------------|---------------|--------|-----|
| carrier | ✅ All states | ✅ Yes | ✅ YES | No fix needed |
| largeGroupDefinition | ❌ Some states | ✅ Yes | ⚠️ TBD sometimes | Add to more states |
| brokerContact | ✅ HI only | ❌ No | ❌ NO | Add to cardFields |
| networkType | ✅ AK only | ❌ No | ❌ NO | Add to cardFields |
| minWSE | ✅ MD only | ❌ No | ❌ NO | Add to cardFields |
| customNote | ✅ NY only | ❌ No | ❌ NO | Add to cardFields |
| coverageNotes | ✅ All states | ✅ Yes | ✅ YES | No fix needed |
| sdiRequirements | ✅ All states | ✅ Yes | ✅ YES | No fix needed |
| salesNotes | ✅ All states | ✅ Yes | ✅ YES | No fix needed |

---

## Why You Have "TBD" for Large Group Definition

### The Issue
`largeGroupDefinition` is in `cardFields` but not consistently in stateData.

- ✅ Exists for some states
- ❌ Missing for others

### The Fix
Either:
1. Add it to all states in stateData.json
2. Remove it from cardFields if you don't want it

### Add to All States:
```json
"AK": {
  "largeGroupDefinition": "51+ FTEs",
  ...
}
```

---

## Test After Making Changes

1. ✅ Save appConfig.json
2. ✅ Save stateData.json
3. ✅ Hard refresh browser (Ctrl+Shift+R)
4. ✅ Hover over Hawaii
   - Should now see: "Broker Contact: Contact HI regional broker"
5. ✅ Hover over Alaska
   - Should now see: "Network Type: PPO/Indemnity Only"
6. ✅ Click Maryland
   - Should now see: "Minimum WSEs: 50+ WSEs required"

---

## The Bottom Line

Your system IS working. It's just:
- Some fields defined in stateData aren't in cardFields (so they don't display)
- Some fields in cardFields don't exist in all states (so they show TBD)

**Simple fix:** Add the missing field definitions to cardFields and you're golden! ✅

