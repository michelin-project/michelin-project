#!/bin/bash
# ============================================================
#  Import brut du CSV Michelin via mongoimport
#  Tour 1/3 du bootstrap : on charge le CSV tel quel dans
#  la collection `_raw`. Le JS suivant le transforme.
# ============================================================
set -e

CSV_PATH="/docker-entrypoint-initdb.d/catalog.csv"
DB_NAME="michelin_catalog"

echo "[00-import-csv] mongoimport vers ${DB_NAME}._raw"

mongoimport \
  --host localhost:27017 \
  --username michelin \
  --password michelin_dev_pwd \
  --authenticationDatabase admin \
  --db "${DB_NAME}" \
  --collection _raw \
  --type csv \
  --headerline \
  --ignoreBlanks \
  --drop \
  --file "${CSV_PATH}"

echo "[00-import-csv] OK"