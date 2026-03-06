#!/usr/bin/env node
/**
 * Builds ahrfCountyLookup.json from AHRF CSV files.
 * Run: npm run build:ahrf
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse/sync";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const AHRF_DIR = join(ROOT, "src/data/technical data/NCHWA-2024-2025+AHRF+COUNTY+CSV");
const OUTPUT = join(ROOT, "src/data/ahrfCountyLookup.json");

function parseCsv(path) {
  const raw = readFileSync(path, "utf-8");
  return parse(raw, { columns: true, skip_empty_lines: true });
}

function parseNum(val) {
  if (val === "" || val == null) return 0;
  const n = parseInt(val, 10);
  return isNaN(n) ? 0 : n;
}

function classifyAccess(facilities, clinicians) {
  if (facilities === 0 && clinicians === 0) return "desert";
  if (facilities <= 1 || clinicians <= 2) return "low";
  if (facilities <= 2 || clinicians <= 6) return "moderate";
  return "adequate";
}

function main() {
  const hp = parseCsv(join(AHRF_DIR, "AHRF2025hp.csv"));
  const hf = parseCsv(join(AHRF_DIR, "AHRF2025hf.csv"));
  const pop = parseCsv(join(AHRF_DIR, "AHRF2025pop.csv"));

  const hpByFips = new Map();
  for (const row of hp) {
    hpByFips.set(row.fips_st_cnty, row);
  }
  const hfByFips = new Map();
  for (const row of hf) {
    hfByFips.set(row.fips_st_cnty, row);
  }
  const popByFips = new Map();
  for (const row of pop) {
    popByFips.set(row.fips_st_cnty, row);
  }

  const allFips = new Set([...hpByFips.keys(), ...hfByFips.keys(), ...popByFips.keys()]);
  const lookup = {};

  for (const fips of allFips) {
    const hpRow = hpByFips.get(fips);
    const hfRow = hfByFips.get(fips);
    const popRow = popByFips.get(fips);

    const obgynGen = parseNum(hpRow?.tot_md_do_obgyn_gen_23);
    const obgynSubsp = parseNum(hpRow?.tot_md_do_obgyn_subsp_23);
    const midwives = parseNum(hpRow?.apn_midwvs_npi_23);
    const obstetricClinicians = obgynGen + obgynSubsp + midwives;

    const birthingFacilities = parseNum(hfRow?.stgh_obstetrc_care_23);

    const fem1519 = parseNum(popRow?.popn_fem_15_19_20);
    const fem2024 = parseNum(popRow?.popn_fem_20_24_20);
    const fem2529 = parseNum(popRow?.popn_fem_25_29_20);
    const fem3034 = parseNum(popRow?.popn_fem_30_34_20);
    const fem3544 = parseNum(popRow?.popn_fem_35_44_20);
    const womenReproductiveAge = fem1519 + fem2024 + fem2529 + fem3034 + fem3544;

    const accessLevel = classifyAccess(birthingFacilities, obstetricClinicians);

    lookup[fips] = {
      accessLevel,
      womenReproductiveAge,
      birthingFacilities,
      obstetricClinicians,
    };
  }

  writeFileSync(OUTPUT, JSON.stringify(lookup, null, 0), "utf-8");
  console.log(`Wrote ${Object.keys(lookup).length} counties to ${OUTPUT}`);
}

main();
