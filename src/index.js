const yargs = require("yargs");
const { generateScript } = require("./utils/scriptGenerator");

const argv = yargs
  .option("model", {
    alias: "m",
    description: "OpenDrift model to use",
    type: "string",
    choices: ["OceanDrift", "PlastDrift"],
    default: "OceanDrift",
  })
  .option("export", {
    alias: "e",
    description: "Wheter to export the results to a file",
    type: "boolean",
    default: true,
  })
  .option("Name", {
    alias: "n",
    description: "Name of the area of interest",
    type: "string",
    default: "Site1",
  })
  .option("day", {
    alias: "d",
    description: "Day of the month",
    type: "number",
    default: 1,
  })
  .option("month", {
    alias: "M",
    description: "Month of the year",
    type: "number",
    default: 1,
  })
  .option("year", {
    alias: "Y",
    description: "Year",
    type: "number",
    default: new Date().getFullYear(),
  })
  .option("depth", {
    alias: "z",
    description: "Depth of the seed elements",
    type: "number",
    default: 0,
  })
  .option("duration", {
    alias: "D",
    description: "Duration of the simulation in days",
    type: "number",
    default: 30,
  })
  .option("durationSeed", {
    alias: "S",
    description: "Duration of the seed in days",
    type: "number",
    default: 1,
  })
  .option("verticalMixing", {
    alias: "V",
    description: "Vertical mixing value",
    type: "boolean",
    default: false,
  })
  .option("readers", {
    alias: "r",
    description: "Readers to use",
    type: "array",
    default: [
      "https://pae-paha.pacioos.hawaii.edu/thredds/dodsC/ncep_global/NCEP_Global_Atmospheric_Model_best.ncd",
      "https://tds.hycom.org/thredds/dodsC/GLBy0.08/latest",
      "https://tds.hycom.org/thredds/dodsC/GLBy0.08/expt_93.0/uv3z",
    ],
  })
  .option("longitude", {
    alias: "lon",
    description: "Longitude of the area of interest",
    type: "number",
    default: -73,
  })
  .option("latitude", {
    alias: "lat",
    description: "Latitude of the area of interest",
    type: "number",
    default: -36,
  })
  .option("particles", {
    alias: "p",
    description: "Number of particles to use",
    type: "number",
    default: 100,
  })
  .option("radius", {
    alias: "R",
    description: "Radius of the area of interest",
    type: "number",
    default: 1000,
  })
  .option("timeStep", {
    alias: "t",
    description: "Time step of the simulation",
    type: "number",
    default: 3600,
  }).argv;

generateScript(argv);
