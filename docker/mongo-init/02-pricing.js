// ============================================================
//  Application de la grille tarifaire Michelin
//  Tour 3/3 du bootstrap.
//  Grille calibrée sur RRP observés Mantel.com + Bike24 (2025-2026)
// ============================================================

const DB_NAME = "michelin_catalog";
db = db.getSiblingDB(DB_NAME);

print("[02-pricing] injection des prix");

// ---------- Grille de prix de base ----------
// (Product Type × Cycle Type × Segment × Range) → € TTC
const PRICE_GRID = {
  TYRE: {
    ROAD: {
      "PREMIUM RACING LINE": {
        "POWER CUP S": 84.90, "POWER CUP TUBULAR": 119.90,
        "POWER CYCLOCROSS MUD TUBULAR": 119.90, "POWER CYCLOCROSS JET TUBULAR": 119.90,
        "POWER TIME TRIAL": 89.90, "POWER GRAVEL RS": 89.90
      },
      "PREMIUM COMPETITION LINE": {
        "POWER CUP": 57.95, "POWER CUP TLR": 70.95,
        "POWER CYCLOCROSS JET": 64.90, "POWER CYCLOCROSS MUD": 64.90,
        "POWER PROTECTION TLR": 69.90, "POWER ROAD": 54.90, "POWER ROAD TLR": 67.90,
        "POWER ADVENTURE": 69.95, "POWER GRAVEL": 63.95, "POWER GRAVEL EXTREME": 74.90,
        "PRO5": 63.95, "POWER ALL SEASON": 59.90
      },
      "PREMIUM PERFORMANCE LINE": { "LITHION 2": 49.90, "LITHION 4": 59.90 },
      "ACCESS LINE": { "DYNAMIC CLASSIC": 22.90, "DYNAMIC SPORT": 24.90 }
    },
    CITY: {
      "PREMIUM COMPETITION LINE": {
        "CITY CARGO": 64.90, "CITY STREET (FB)": 59.90,
        "CITY TOURING (FB)": 54.90, "CITY TREKKING (FB)": 54.90,
        "PROTEK MAX": 49.90, "STARGRIP": 39.90
      },
      "PREMIUM PERFORMANCE LINE": {
        "CITY STREET": 41.90, "CITY TOURING": 36.90, "CITY TREKKING": 36.90,
        "PROTEK CROSS MAX": 32.90, "PROTEK MAX": 29.90,
        "WILD RUN'R PERFORMANCE LINE": 24.90
      },
      "ACCESS LINE": {
        "CITY'J": 14.90, "COUNTRY'J": 16.90, "COUNTRY ROCK": 18.90,
        "PROTEK": 22.90, "PROTEK CROSS": 24.90, "WORLD TOUR": 19.90, "ZZ": 18.90
      }
    },
    MTB: {
      "PREMIUM RACING LINE": {
        "DH16": 94.90, "DH22": 89.90, "DH34": 84.90, "DH MUD": 89.90,
        "E-WILD FRONT RL": 89.90, "E-WILD REAR RL": 89.90,
        "FORCE XC2 RACING LINE": 74.90, "FORCE XC3": 79.90,
        "JET XC2": 74.90, "JET XC3": 79.90, "WILD XC RACING LINE": 79.90,
        "FORCE DC": 79.90, "WILD DC": 79.90,
        "WILD ENDURO FRONT RACING LINE": 94.90,
        "WILD ENDURO MH RL": 89.90, "WILD ENDURO MS RL": 89.90,
        "WILD ENDURO REAR RACING LINE": 89.90, "WILD ENDURO REAR RL": 84.90,
        "PILOT SX": 39.90, "PILOT SX SLICK": 44.90, "PILOT FREESTYLE": 44.90
      },
      "PREMIUM COMPETITION LINE": {
        "FORCE AM COMPETITION LINE": 64.90, "FORCE AM2 COMPETITION LINE": 69.90,
        "WILD AM COMPETITION LINE": 64.90, "WILD AM2 COMPETITION LINE": 69.90,
        "MUD ENDURO": 74.90,
        "WILD ENDURO FRONT GUM-X COMPETITION LINE": 84.90,
        "WILD ENDURO FRONT MAGI-X COMPETITION LINE": 89.90,
        "WILD ENDURO REAR COMPETITION LINE": 84.90, "WILD MUD": 79.90,
        "E-WILD FRONT CL": 79.90, "E-WILD REAR CL": 79.90,
        "PILOT SLOPE": 49.90, "PILOT PUMP": 49.90, "PROTEK MAX": 49.90
      },
      "PREMIUM PERFORMANCE LINE": {
        "FORCE AM PERFORMANCE LINE": 49.90,
        "FORCE XC PERFORMANCE LINE": 44.90, "FORCE XC2 PERFORMANCE LINE": 49.90,
        "FORCE XC3": 54.90, "JET XC3": 54.90, "WILD XC PERFORMANCE LINE": 54.90,
        "WILD AM PERFORMANCE LINE": 49.90,
        "WILD ENDURO MH PL": 64.90, "WILD ENDURO MS PL": 64.90,
        "WILD ENDURO REAR PL": 59.90, "WILD ROCK'R": 39.90,
        "DH34 BIKE PARK": 64.90,
        "E-WILD FRONT PL": 59.90, "E-WILD REAR PL": 59.90
      },
      "ACCESS LINE": {
        "FORCE": 26.90, "WILD": 26.90, "MICHELIN JET": 26.90,
        "COUNTRY A.T.": 19.90, "COUNTRY CROSS": 22.90, "COUNTRY DRY2": 22.90,
        "COUNTRY GRIP'R": 24.90, "COUNTRY GRIP'R TS": 29.90,
        "COUNTRY RACE'R": 24.90, "COUNTRY TRAIL": 27.90
      }
    }
  },
  TUBE: {
    ROAD: {
      "PREMIUM COMPETITION LINE": { "LATEX": 11.90, "AIR COMP": 8.90, "RCOMP ULTRALIGHT": 9.90 },
      "ACCESS LINE": { "AIR STOP": 5.90, "RSTOP": 5.50 }
    },
    CITY: {
      "PREMIUM COMPETITION LINE": { "AIR COMP": 8.90, "PROTEK MAX": 9.90 },
      "ACCESS LINE": { "AIR STOP": 6.90 }
    },
    MTB: {
      "PREMIUM COMPETITION LINE": { "AIR COMP": 8.90, "PROTEK MAX": 12.90 },
      "ACCESS LINE": { "AIR STOP": 7.90 }
    }
  },
  TUBULAR: {
    ROAD: {
      "PREMIUM RACING LINE": {
        "POWER CUP TUBULAR": 119.90,
        "POWER CYCLOCROSS JET TUBULAR": 119.90,
        "POWER CYCLOCROSS MUD TUBULAR": 119.90
      }
    }
  }
};

// ---------- Modificateurs ----------
const LABEL_MOD = { "DARK": 1.08, "CLASSIC": 0.96 };
const E_BIKE_50 = 1.15;
const E_BIKE_READY = 1.05;
const WIRE_BEAD = 0.78;
const WIDE_MTB = 1.08;     // ≥ 62 mm (~2.40")
const CITY_CARGO = 1.12;
const SIZE_STEP = 0.025;   // +2.5% par mm au-dessus de 28
const SIZE_STEP_MAX = 0.20;
const SIZE_BELOW_23 = 0.92;

function roundPrice(v) {
  const w = Math.floor(v);
  const d = v - w;
  if (d >= 0.85) return w + 0.95;
  if (d >= 0.45) return w + 0.90;
  return w + 0.49;
}

function computePrice(doc) {
  const pt = doc["Product Type"];
  const cy = doc["Cycle Type"];
  const sg = doc["Segment"];
  const rg = doc["Range (Internal)"];

  const tier = PRICE_GRID[pt];
  if (!tier || !tier[cy] || !tier[cy][sg] || tier[cy][sg][rg] === undefined) {
    return { ok: false };
  }

  let price = tier[cy][sg][rg];

  // Taille
  const w = doc["sizing"] && doc["sizing"]["width_mm"];
  if (typeof w === "number") {
    if (w < 23) price *= SIZE_BELOW_23;
    else if (w > 28) {
      const bump = Math.min((w - 28) * SIZE_STEP, SIZE_STEP_MAX);
      price *= (1 + bump);
    }
  }

  // Label
  const label = doc["Label type"];
  if (LABEL_MOD[label] !== undefined) price *= LABEL_MOD[label];

  // E-bike
  const eb = doc["E-Bike Technologies"];
  if (Array.isArray(eb) && eb.length > 0) {
    const joined = eb.join(",").toUpperCase();
    if (joined.indexOf("E-50") >= 0)        price *= E_BIKE_50;
    else if (joined.indexOf("E-BIKE") >= 0)  price *= E_BIKE_READY;
  }

  // Wire bead
  if (doc["Bead"] === "WIRE BEAD") price *= WIRE_BEAD;

  // Wide MTB
  if (cy === "MTB" && typeof w === "number" && w >= 62) price *= WIDE_MTB;

  // City Cargo
  if (cy === "CITY" && typeof rg === "string" && rg.indexOf("CARGO") >= 0) price *= CITY_CARGO;

  return { ok: true, price: roundPrice(price) };
}

// ---------- Application ----------
const cursor = db.products.find({}, {
  _id: 1, "Product Type": 1, "Cycle Type": 1, "Segment": 1,
  "Range (Internal)": 1, "sizing.width_mm": 1, "Label type": 1,
  "Bead": 1, "E-Bike Technologies": 1
});

const ops = [];
let matched = 0, unmatched = 0;

cursor.forEach(doc => {
  const r = computePrice(doc);
  if (!r.ok) { unmatched++; return; }
  ops.push({
    updateOne: {
      filter: { _id: doc._id },
      update: {
        $set: {
          "pricing.msrp_eur":     r.price,
          "pricing.currency":     "EUR",
          "pricing.vat_included": true,
          "pricing.source":       "calibration_grid_2026-06",
          "pricing.updated_at":   new Date()
        }
      }
    }
  });
  matched++;
});

if (ops.length > 0) {
  const res = db.products.bulkWrite(ops, { ordered: false });
  print(`[02-pricing] matched=${res.matchedCount} modified=${res.modifiedCount}`);
}
print(`[02-pricing] ${matched} prixés, ${unmatched} sans base`);

// ---------- Distribution par segment ----------
print("[02-pricing] distribution par Segment :");
db.products.aggregate([
  { $match: { "pricing.msrp_eur": { $ne: null } } },
  { $group: {
      _id: "$Segment",
      count: { $sum: 1 },
      avg:   { $avg: "$pricing.msrp_eur" },
      min:   { $min: "$pricing.msrp_eur" },
      max:   { $max: "$pricing.msrp_eur" }
  }},
  { $sort: { avg: -1 } }
]).forEach(r => {
  const seg = String(r._id).padEnd(35, " ");
  const line = "  " + seg +
    "  n=" + String(r.count).padStart(3, " ") +
    "  avg=" + r.avg.toFixed(2) + "€" +
    "  min=" + r.min.toFixed(2) + "€" +
    "  max=" + r.max.toFixed(2) + "€";
  print(line);
});

print("[02-pricing] OK");