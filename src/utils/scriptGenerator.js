const fs = require("fs");
const path = require("path");

function generateMonthName(month) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month - 1];
}

function generateScript(params) {
  console.log(params);
  const scriptName = `${params.model}_${params.Name}_${generateMonthName(
    params.month
  )}_${params.year}_z${params.z}_${params.durationSeed}days${
    params.V ? "_verticalMixing" : ""
  }_${Date.now()}`;
  const scriptContent = `#!/usr/bin/env python
"""
${generateMonthName(params.month)} ${params.year} - ${params.Name} - ${
    params.particles
  } particles - z = ${params.z}
==================================
"""

from datetime import timedelta, datetime
from opendrift.readers import reader_netCDF_CF_generic
${
  params.model === "OceanDrift"
    ? "from opendrift.models.oceandrift import OceanDrift"
    : "from opendrift.models.plastdrift import PlastDrift"
}

o = ${params.model}(loglevel=20, logfile='simulation.log')
o.add_readers_from_list([
  ${params.readers.map((url) => `"${url}"`).join(",\n")}
])

${params.verticalMixing ? "o.set_config('drift:vertical_mixing', True)" : ""}

start_time = datetime(${params.year}, ${params.month}, ${params.day}, 0)
end_time = start_time + timedelta(days=${params.duration})
time = [start_time, end_time]
print('Simulation time:')
print(time)

#%%
# Seeding some particles
lon = ${params.lon}; lat = ${params.lat}
o.set_config('general:coastline_action', 'stranding')
o.seed_elements(lon, lat, radius=${params.radius}, number=${params.particles}*${
    params.durationSeed
  }, time=[start_time, start_time+timedelta(days=${params.durationSeed})], z=${
    params.z
  })
o.run(end_time=end_time, time_step=${params.timeStep}, time_step_output=${
    params.timeStep
  }${params.export ? `, outfile='Run_${scriptName}.nc'` : ""})

#%%
# Print and plot results
print(o)
o.animation(fast=True, filename='Animation_${scriptName}.gif', color='z')
o.plot(fast=True, filename='Plot_${scriptName}.png')
`;
  const scriptPath = path.join(
    __dirname,
    "../pythonScripts",
    `${scriptName}.py`
  );
  fs.writeFileSync(scriptPath, scriptContent);
}

module.exports = {
  generateScript,
};
