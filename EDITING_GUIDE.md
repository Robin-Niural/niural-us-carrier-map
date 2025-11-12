# 📝 STEP-BY-STEP: How to Edit Your JSON Files

## The Golden Rule

### ⚠️ **KEY NAMES MUST MATCH EXACTLY**

```
appConfig.json has:          stateData.json MUST have:
{ "key": "brokerName" }  ==  "brokerName": "value"
```

Not matching = field shows as "TBD" or "—"

---

## Visual Editing Guide

### Your Current Setup

#### appConfig.json (Current)
```json
"cardFields": [
  { "key": "carrier",              "label": "Primary Carrier",       "showColor": true },
  { "key": "largeGroupDefinition", "label": "Large Group Definition", "showColor": false },
  { "key": "coverageNotes",        "label": "Coverage Notes",         "showColor": false },
  { "key": "sdiRequirements",      "label": "SDI Requirements",       "showColor": false },
  { "key": "salesNotes",           "label": "Sales Notes",            "showColor": false }
]
```

#### stateData.json (Current - HI example)
```json
"HI": {
  "coverageNotes":   "Aetna does not offer...",
  "salesNotes":      "",
  "sdiRequirements": "Employers must maintain...",
  "brokerContact":   "Contact HI regional broker"  ← EXTRA! Not in cardFields
}
```

**⚠️ PROBLEM:** `brokerContact` exists in stateData but NOT in cardFields, so it won't display!

---

## How to Add a New Field (Step-by-Step)

### Let's Add: "Broker Contact"

### STEP 1: Edit appConfig.json

**FIND THIS:**
```json
"cardFields": [
  { "key": "carrier", "label": "Primary Carrier", "showColor": true },
  { "key": "largeGroupDefinition", "label": "Large Group Definition", "showColor": false },
  { "key": "coverageNotes", "label": "Coverage Notes", "showColor": false },
  { "key": "sdiRequirements", "label": "SDI Requirements", "showColor": false },
  { "key": "salesNotes", "label": "Sales Notes", "showColor": false }
]
```

**CHANGE TO THIS:**
```json
"cardFields": [
  { "key": "carrier", "label": "Primary Carrier", "showColor": true },
  { "key": "largeGroupDefinition", "label": "Large Group Definition", "showColor": false },
  { "key": "brokerContact", "label": "Broker Contact", "showColor": false },  ← ADD THIS LINE
  { "key": "coverageNotes", "label": "Coverage Notes", "showColor": false },
  { "key": "sdiRequirements", "label": "SDI Requirements", "showColor": false },
  { "key": "salesNotes", "label": "Sales Notes", "showColor": false }
]
```

**IMPORTANT:** 
- Notice the comma `,` at end of brokerContact line? ✅ **Correct**
- The `"key"` must be lowercase: `"brokerContact"` ✅
- Spelling must be exact - one letter off = breaks!

### STEP 2: Edit stateData.json

**FIND THIS (HI section):**
```json
"HI": {
  "coverageNotes": "Aetna does not offer compliant plans in HI for PEOs. Therefore, Aetna is restricted.",
  "salesNotes": "",
  "sdiRequirements": "Employers must maintain an approved Temporary Disability Insurance (TDI) policy and pay ≥ 50 % of premium.",
  "brokerContact": "Contact HI regional broker"
}
```

**IT'S ALREADY THERE!** ✅ The field is already in stateData.json. This is why the system might seem broken.

But now that we added it to `cardFields` in appConfig.json, it should work!

### STEP 3: Reload Page

- Save both files
- In browser: Press `Ctrl+Shift+R` (hard refresh)
- Hover over Hawaii
- You should now see "Broker Contact: Contact HI regional broker"

---

## Understanding the Key Naming Convention

### How Keys Should Be Named

```
appConfig.json                  stateData.json
Key Name Format                 Value Location
────────────────────────────────────────────────
{ "key": "carrier" }       ==   "carrier": "Aetna"
{ "key": "networkType" }   ==   "networkType": "PPO"
{ "key": "brokerName" }    ==   "brokerName": "ABC Brokers"
{ "key": "minEmployees" }  ==   "minEmployees": "50+"
```

### Camel Case Rule
- First word lowercase: `broker`
- Next words capitalize first letter: `Contact`
- Combined: `brokerContact` ✅

**NOT:** `broker_contact` or `BrokerContact` or `broker Contact`

---

## Adding a Field Step-by-Step With Pictures

### Want to add: "Network Type" for AK

### Step 1: appConfig.json

**Before:**
```json
"cardFields": [
  { "key": "carrier", "label": "Primary Carrier", "showColor": true },
  { "key": "largeGroupDefinition", "label": "Large Group Definition", "showColor": false },
  { "key": "coverageNotes", "label": "Coverage Notes", "showColor": false },
  ...
]
```

**After (add this line):**
```json
"cardFields": [
  { "key": "carrier", "label": "Primary Carrier", "showColor": true },
  { "key": "largeGroupDefinition", "label": "Large Group Definition", "showColor": false },
  { "key": "networkType", "label": "Network Type", "showColor": false },  ← NEW
  { "key": "coverageNotes", "label": "Coverage Notes", "showColor": false },
  ...
]
```

### Step 2: stateData.json

**Find AK in importantStates:**
```json
"AK": {
  "coverageNotes": "PPO only and many areas would only have access to our Indemnity or CMED plan.",
  "salesNotes": "",
  "sdiRequirements": "—",
  "networkType": "PPO/Indemnity Only"  ← ALREADY THERE!
}
```

Great! It's already in stateData, and now that you added it to cardFields, it will display!

### Step 3: Reload
- Hard refresh browser (Ctrl+Shift+R)
- Hover Alaska
- See: "Network Type: PPO/Indemnity Only" ✅

---

## Real-World Example: Adding "Min WSE" Field

Currently you have in stateData.json for MD:
```json
"MD": {
  "coverageNotes": "State regulations prohibit a PEO from offering its large group medical master policy to headquartered companies with fewer than 50 eligible WSEs.",
  "salesNotes": "",
  "sdiRequirements": "—",
  "minWSE": "50+ WSEs required"  ← EXISTS but not displayed
}
```

### To Display It:

**Edit appConfig.json - Add to cardFields:**
```json
{ "key": "minWSE", "label": "Minimum WSEs", "showColor": false }
```

**Result:**
When you click MD, you'll see:
```
Maryland (MD)
━━━━━━━━━━━━━━━━━━━━━━━━━
Primary Carrier      🟣 Restricted
Large Group Def.     51+ FTEs
Minimum WSEs         50+ WSEs required  ← NOW DISPLAYS!
Coverage Notes       State regulations...
SDI Requirements     —
Sales Notes          (empty)
```

---

## JSON Syntax Rules (Critical!)

### ✅ CORRECT

```json
{
  "field1": "value1",
  "field2": "value2"
}
```

### ❌ WRONG (Common Mistakes)

```json
// Missing comma
{
  "field1": "value1"
  "field2": "value2"
}

// Missing quotes
{
  field1: "value1",
  "field2": "value2"
}

// Extra comma
{
  "field1": "value1",
  "field2": "value2",  ← COMMA HERE!
}

// Missing colon
{
  "field1" "value1",
  "field2": "value2"
}
```

---

## The Complete Workflow

### Workflow Diagram

```
1. Plan
   ↓
   What field do I want? (e.g., "brokerName")
   
2. appConfig.json
   ↓
   Add: { "key": "brokerName", "label": "Broker", "showColor": false }
   
3. stateData.json
   ↓
   For each state that needs it, add: "brokerName": "Your value"
   
4. Save Both Files
   ↓
   Make sure no syntax errors
   
5. Reload Browser
   ↓
   Ctrl+Shift+R (hard refresh)
   
6. Test
   ↓
   Hover/Click states to verify field appears
   
7. Done! ✅
```

---

## Troubleshooting Checklist

### "Field shows TBD or blank"

Check:
- [ ] Key in appConfig matches key in stateData EXACTLY
- [ ] No typos (case-sensitive!)
- [ ] Page was reloaded
- [ ] Field was added to the state (not just appConfig)

### "Page won't load or error in console"

Check:
- [ ] Valid JSON syntax (use jsonlint.com)
- [ ] All commas in place
- [ ] All quotes matching
- [ ] No extra commas after last item in array/object

### "Field appears in some states, not others"

Check:
- [ ] Field added to stateData for all states that need it
- [ ] Each state object has the field key

---

## Template: Copy & Paste Structure

### To add a new field called "YourFieldName":

**appConfig.json - Add this line:**
```json
{ "key": "yourFieldName", "label": "Your Label", "showColor": false }
```

**stateData.json - Add to each state:**
```json
"CA": {
  "existingField": "value",
  "yourFieldName": "Your value here",  ← ADD THIS
}
```

---

## Your Current Fields (Already Working)

These fields are already set up and working:

| Key | Label | Where It Displays |
|-----|-------|-------------------|
| `carrier` | Primary Carrier | ✅ Everywhere |
| `largeGroupDefinition` | Large Group Definition | ✅ Everywhere |
| `coverageNotes` | Coverage Notes | ✅ Everywhere |
| `sdiRequirements` | SDI Requirements | ✅ Everywhere |
| `salesNotes` | Sales Notes | ✅ Everywhere |

These exist in stateData but NOT in cardFields (so they won't display):

| Key | Status |
|-----|--------|
| `brokerContact` | ⚠️ In stateData, NOT in cardFields |
| `networkType` | ⚠️ In stateData, NOT in cardFields |
| `minWSE` | ⚠️ In stateData, NOT in cardFields |
| `customNote` | ⚠️ In stateData, NOT in cardFields |

---

## Quick Fix: Make Hidden Fields Visible

To display `brokerContact`, `networkType`, and `minWSE`:

**Just add these 3 lines to appConfig.json cardFields:**

```json
{ "key": "brokerContact", "label": "Broker Contact", "showColor": false },
{ "key": "networkType", "label": "Network Type", "showColor": false },
{ "key": "minWSE", "label": "Minimum WSEs", "showColor": false },
```

Done! Reload page and you'll see them. ✅

---

## Summary

1. **appConfig.json** - Defines what fields to display and their labels
2. **stateData.json** - Provides the actual data values for each state
3. **Keys MUST match exactly** - Or field shows as "TBD"
4. **JSON syntax must be perfect** - Any typo breaks it
5. **Reload page** - Changes don't show until you reload

**Most common error:** Key name typo or JSON syntax error.

Use jsonlint.com to validate your JSON! ✅

