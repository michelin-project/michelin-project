// ============================================================
//  Transform `_raw` → `products` + créer les indexes
//  Tour 2/3 du bootstrap Michelin.
// ============================================================

const DB_NAME = "michelin_catalog";
db = db.getSiblingDB(DB_NAME);

print("[01-transform] début transformation _raw → products");

const INT_FIELDS = [
  "Width ETRTO", "Diameter ETRTO", "Valve Length",
  "Web Diameter (mm)", "Web Width (mm)",
  "Web Diameter (Inch)", "Web Width (Inch)",
  "Conditioning", "Weight (g)",
  "Unit Packaging Weight (g)",
  "Unit Packaging Width (mm)", "Unit Packaging Depth (mm)", "Unit Packaging Heigth (mm)",
  "Transportation packaging Weight",
  "Transportation Packaging Width (mm)",
  "Transportation Packaging Depth (mm)", "Transportation Packaging Heigth (mm)",
  "TPI",
  "Minimum Pressure (Bar)", "Maximum Pressure (Bar)",
  "Minimum Pressure (Psi)", "Maximum Pressure (Psi)",
  "Conversion Psi mini", "Conversion Psi maxi",
  "POIDS TOTAL (g)"
];

const BOOL_FIELDS = ["Reflective strip", "Knurling strip"];

const MULTI_VALUE_FIELDS = [
  "Terrain Types", "Use",
  "Rubber Technologies", "Casing Technologies",
  "Tread Pattern Technologies", "Reinforcement Technologies",
  "E-Bike Technologies", "Cycle Type Web"
];

// Champs à exclure du document final (déjà restructurés ailleurs ou inutiles)
const SKIP_FIELDS = new Set(["_id"]);

// Construit la pipeline d'agrégation
const setStage = {};

// 1) Conversions de type
for (const f of INT_FIELDS) {
  setStage[f] = {
    $convert: {
      input: { $ifNull: [`$${f}`, ""] },
      to: "int",
      onError: null,
      onNull: null
    }
  };
}
for (const f of BOOL_FIELDS) {
  setStage[f] = {
    $switch: {
      branches: [
        { case: { $in: [{ $toUpper: { $ifNull: [`$${f}`, ""] } }, ["YES","Y","TRUE","1"]] }, then: true },
        { case: { $in: [{ $toUpper: { $ifNull: [`$${f}`, ""] } }, ["NO","N","FALSE","0"]] }, then: false }
      ],
      default: null
    }
  };
}
for (const f of MULTI_VALUE_FIELDS) {
  setStage[f] = {
    $cond: {
      if: { $eq: [{ $ifNull: [`$${f}`, ""] }, ""] },
      then: null,
      else: {
        $map: {
          input: {
            // Normalise tous les séparateurs en un seul (point-virgule),
            // puis split. $replaceAll ne supporte pas les regex.
            $split: [
              { $replaceAll: { input: { $replaceAll: { input: { $replaceAll: { input: { $trim: { input: `$${f}` } }, find: "\n", replacement: ";" } }, find: ";", replacement: ";" } }, find: ",", replacement: ";" } },
              ";"
            ]
          },
          as: "p",
          in: { $trim: { input: "$$p" } }
        }
      }
    }
  };
}

// 2) Blocs normalisés
setStage.sizing = {
  width_mm:     setStage["Width ETRTO"],
  diameter_mm:  setStage["Diameter ETRTO"],
  diameter_inch: { $ifNull: ["$Web Diameter (Inch)", null] },
  width_inch:    { $ifNull: ["$Web Width (Inch)", null] },
  etrito:        { $ifNull: ["$Designation (Internal)", null] }
};
setStage.pressure = {
  min_bar: setStage["Minimum Pressure (Bar)"],
  max_bar: setStage["Maximum Pressure (Bar)"],
  min_psi: setStage["Minimum Pressure (Psi)"],
  max_psi: setStage["Maximum Pressure (Psi)"]
};
setStage.weights = {
  tyre_g:  setStage["Weight (g)"],
  total_g: setStage["POIDS TOTAL (g)"]
};
setStage.tech = {
  tpi:            setStage["TPI"],
  sealing:        { $ifNull: [`$Sealing`, null] },
  bead:           { $ifNull: [`$Bead`, null] },
  fitting:        { $ifNull: [`$Fitting`, null] },
  sidewall_type:  { $ifNull: [`$Sidewall Type`, null] },
  shore:          { $ifNull: [`$Shore`, null] },
  label_type:     { $ifNull: [`$Label type`, null] },
  rim_type:       { $ifNull: [`$Rim Type`, null] }
};
setStage.identifiers = {
  ean:  { $ifNull: [`$EAN Code`, null] },
  upc:  { $ifNull: [`$UPC Code`, null] },
  mspn: { $ifNull: [`$MSPN Code (Internal)`, null] },
  cai:  { $ifNull: [`$CAI (Manufacturer Code)`, null] }
};

// 3) Pricing placeholder
setStage.pricing = {
  currency:       null,
  msrp_eur:       null,
  cost_eur:       null,
  vat_included:   null,
  source:         null,
  updated_at:     null
};

// 4) _id unique basé sur CAI > EAN > MSPN > Global ID
setStage._id = {
  $ifNull: [
    `$CAI (Manufacturer Code)`,
    { $ifNull: [`$EAN Code`, { $ifNull: [`$MSPN Code (Internal)`, `$Global ID`] }] }
  ]
};

// 5) Timestamp d'import
setStage._imported_at = "$$NOW";

// 6) Suppression des champs bruts qu'on a restructurés
const unsetStage = {};
for (const f of [...INT_FIELDS, ...BOOL_FIELDS]) unsetStage[f] = "";
for (const f of [
  "Web Diameter (Inch)", "Web Width (Inch)",
  "Designation (Internal)",
  "Sealing", "Bead", "Fitting", "Sidewall Type", "Shore", "Label type", "Rim Type",
  "EAN Code", "UPC Code", "MSPN Code (Internal)", "CAI (Manufacturer Code)"
]) unsetStage[f] = "";

// 7) Pipeline
const pipeline = [
  { $addFields: setStage },
  { $project: { ...Object.fromEntries(Object.keys(unsetStage).map(k => [k, 0])) } }
];

const result = db.getCollection("_raw").aggregate(pipeline, { allowDiskUse: true }).toArray();
print(`[01-transform] ${result.length} documents transformés`);

db.products.drop();
db.products.insertMany(result);
db.getCollection("_raw").drop();
print(`[01-transform] ${db.products.countDocuments({})} docs dans products, _raw supprimée`);

// ---------- Indexes ----------
print("[01-indexes] création des index");

db.products.createIndex({ "Cycle Type": 1 });
db.products.createIndex({ "Segment": 1 });
db.products.createIndex({ "Range (Internal)": 1 });
db.products.createIndex({ "Brand": 1 });
db.products.createIndex({ "E-Bike Technologies": 1 });
db.products.createIndex(
  {
    "Web Range Name": "text",
    "Web Product Designation": "text",
    "Range (Internal)": "text"
  },
  { name: "text_search_idx", default_language: "english" }
);
db.products.createIndex({ "identifiers.ean":  1 }, { sparse: true });
db.products.createIndex({ "identifiers.upc":  1 }, { sparse: true });
db.products.createIndex({ "identifiers.mspn": 1 }, { sparse: true });

const idxCount = db.products.getIndexes().length;
print(`[01-indexes] ${idxCount} index présents`);

print("[01-transform] OK");