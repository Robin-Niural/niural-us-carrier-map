# Configuration Guide - State Info Cards

## Overview
The state info cards (both hover tooltips and the sidebar details card) are now fully configurable via the `data/appConfig.json` file. You can customize which fields appear, their labels, and their display options.

## How to Customize Card Fields

### 1. Edit `data/appConfig.json`

The `cardFields` array in `appConfig.json` controls what information displays on both the tooltip and the sidebar detail card:

```json
"cardFields": [
  { "key": "carrier", "label": "Primary Carrier", "showColor": true },
  { "key": "largeGroupDefinition", "label": "Large Group Definition", "showColor": false },
  { "key": "coverageNotes", "label": "Coverage Notes", "showColor": false },
  { "key": "sdiRequirements", "label": "SDI Requirements", "showColor": false },
  { "key": "salesNotes", "label": "Sales Notes", "showColor": false }
]
```

### 2. Customize Fields

**Parameters:**
- `key` - The property name to read from state data (must match state data JSON)
- `label` - Display label shown in the card
- `showColor` - If `true` and key is "carrier", displays a colored dot next to the value

**Example - Add a custom field:**

Add to state data for a specific state in `data/stateData.json`:
```json
{
  "notableStates": {
    "CA": {
      "coverageNotes": "...",
      "brokerNetwork": "Includes major California brokers"
    }
  }
}
```

Then add to `cardFields` in `appConfig.json`:
```json
{ "key": "brokerNetwork", "label": "Broker Network", "showColor": false }
```

### 3. Add State-Specific Custom Data

You can add any custom key-value pairs to individual states in `data/stateData.json`:

**restrictedStates example:**
```json
"restrictedStates": {
  "HI": {
    "coverageNotes": "...",
    "customField1": "Your custom value here",
    "customField2": "Another custom value"
  }
}
```

**importantStates example:**
```json
"importantStates": {
  "AK": {
    "coverageNotes": "...",
    "ageLimits": "Age limits apply",
    "networkRestrictions": "Limited provider network"
  }
}
```

**notableStates example:**
```json
"notableStates": {
  "NY": {
    "coverageNotes": "...",
    "mandatedBenefits": "Additional mandated benefits required"
  }
}
```

### 4. Order Matters

Fields appear in the order you specify in the `cardFields` array. Rearrange to change the display order:

```json
"cardFields": [
  { "key": "carrier", "label": "Primary Carrier", "showColor": true },
  { "key": "largeGroupDefinition", "label": "Large Group Definition", "showColor": false },
  { "key": "customField1", "label": "Your Custom Field", "showColor": false },
  { "key": "coverageNotes", "label": "Coverage Notes", "showColor": false }
]
```

### 5. Fallback Behavior

- If a field key doesn't exist in state data, it displays "—"
- If `cardFields` is not defined, defaults to the original fields
- Custom fields work seamlessly with the tooltip and sidebar card

## Examples

### Example 1: Add Broker Information
**appConfig.json:**
```json
"cardFields": [
  { "key": "carrier", "label": "Primary Carrier", "showColor": true },
  { "key": "largeGroupDefinition", "label": "Large Group Definition", "showColor": false },
  { "key": "primaryBroker", "label": "Primary Broker", "showColor": false },
  { "key": "coverageNotes", "label": "Coverage Notes", "showColor": false },
  { "key": "sdiRequirements", "label": "SDI Requirements", "showColor": false }
]
```

**stateData.json:**
```json
"notableStates": {
  "CA": {
    "coverageNotes": "Standard Aetna PPO and EPO networks available.",
    "sdiRequirements": "Employees fund SDI",
    "primaryBroker": "XYZ Brokerage (West Coast specialist)"
  }
}
```

### Example 2: Add Compliance Notes
**appConfig.json:**
```json
"cardFields": [
  { "key": "carrier", "label": "Primary Carrier", "showColor": true },
  { "key": "complianceNotes", "label": "Compliance Requirements", "showColor": false },
  { "key": "coverageNotes", "label": "Coverage Notes", "showColor": false }
]
```

**stateData.json:**
```json
"importantStates": {
  "MD": {
    "coverageNotes": "State regulations...",
    "complianceNotes": "Must verify 50+ WSE threshold before offering"
  }
}
```

### Example 3: Mix Default and Custom Fields
```json
"cardFields": [
  { "key": "carrier", "label": "Carrier Available", "showColor": true },
  { "key": "largeGroupDefinition", "label": "Large Group Size", "showColor": false },
  { "key": "ageLimits", "label": "Age Rating Limits", "showColor": false },
  { "key": "coverageNotes", "label": "Network Coverage", "showColor": false },
  { "key": "specialNotes", "label": "Special Notes", "showColor": false }
]
```

## Default Fields (if not specified)

If you don't define `cardFields`, these are used:

```json
"cardFields": [
  { "key": "carrier", "label": "Primary Carrier", "showColor": true },
  { "key": "largeGroupDefinition", "label": "Large Group Definition", "showColor": false },
  { "key": "coverageNotes", "label": "Coverage Notes", "showColor": false },
  { "key": "sdiRequirements", "label": "SDI Requirements", "showColor": false },
  { "key": "salesNotes", "label": "Sales Notes", "showColor": false }
]
```

## Tips

1. **Keep Labels Short** - Tooltips have limited space, so use concise labels
2. **Test Your Config** - Changes take effect immediately on page refresh
3. **Use Consistent Keys** - Make sure the `key` matches the field name in your state data
4. **Don't Remove Default Fields** - You can reorder them, but removing key info may confuse users
5. **Color for Important Fields** - Use `showColor: true` only for the carrier field

## Notes

- Both the **tooltip** (on hover) and the **sidebar detail card** (when selected) use the same `cardFields` configuration
- Changes to `appConfig.json` take effect on page reload
- Custom fields persist through the detail sidebar and appear consistently

