import argparse
import os
from datetime import datetime, timedelta

def generate_month_name(month):
    return datetime(1900, month, 1).strftime('%B')

def generate_script(params):
    script_name = f"{params.model}_{params.Name}_{generate_month_name(params.month)}_{params.year}_z{params.depth}_{params.duration}days{'_verticalMixing' if params.verticalMixing else ''}_{int(datetime.now().timestamp())}"
    nl = ',\n  '
    list_of_readers = nl.join([f'"{url}"' for url in params.readers])
    list_of_export_variables = ', '.join([f'\"{v}\"' for v in params.exportVariables])
    params.lon = params.longitude
    params.lat = params.latitude
    script_content = f"""#!/usr/bin/env python
\"\"\"
{generate_month_name(params.month)} {params.year} - {params.Name} - {params.particles} particles - z = {params.depth}
==================================
\"\"\"
from datetime import timedelta, datetime
from opendrift.readers import reader_netCDF_CF_generic
{'from opendrift.models.oceandrift import OceanDrift' if params.model == 'OceanDrift' else 'from opendrift.models.plastdrift import PlastDrift'}
o = {params.model}(loglevel=20, logfile='{script_name}.log')
o.add_readers_from_list([
  {list_of_readers}
])
{f"o.set_config('drift:vertical_mixing', True)" if params.verticalMixing else ''}
start_time = datetime({params.year}, {params.month}, {params.day}, 0)
end_time = start_time + timedelta(days={params.duration})
time = [start_time, end_time]
print('Simulation time:')
print(time)
# Seeding some particles
lon = {params.lon}; lat = {params.lat}
o.set_config('general:coastline_action', 'stranding')
o.seed_elements(lon, lat, radius={params.radius}, number={params.particles}*{params.durationSeed}, time=[start_time, start_time+timedelta(days={params.durationSeed})], z={params.depth})
o.run(end_time=end_time, time_step={params.timeStep}, time_step_output={params.timeStep}{f", outfile='Run_{script_name}.nc'" if params.export else ''}{f", export_buffer_length={params.bufferLength}" if params.bufferLength else ''}{f", export_variables=[{list_of_export_variables}]" if params.exportVariables else ''})
# Print and plot results
print(o)
o.animation(fast=True, filename='Animation_{script_name}.gif', color='z')
o.plot(fast=True, filename='Plot_{script_name}.png')
"""
    script_path = os.path.join(os.path.dirname(__file__), "pythonScripts", f"{script_name}.py")
    with open(script_path, "w") as script_file:
        script_file.write(script_content)
    print(f'Script "{script_name}" generated!')

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate OpenDrift simulation script")
    parser.add_argument("--model", choices=["OceanDrift", "PlastDrift"], default="OceanDrift", help="OpenDrift model to use")
    parser.add_argument("--export", action="store_true", help="Whether to export the results to a file")
    parser.add_argument("--bufferLength", type=int, default=100, help="export_buffer_length value, to reduce memory consumption")
    parser.add_argument("--exportVariables", nargs="*", default=[], help="export_variables array, to reduce memory consumption")
    parser.add_argument("--Name", default="Site1", help="Name of the area of interest")
    parser.add_argument("--day", type=int, default=1, help="Day of the month")
    parser.add_argument("--month", type=int, default=1, help="Month of the year")
    parser.add_argument("--year", type=int, default=datetime.now().year, help="Year")
    parser.add_argument("--depth", type=int, default=0, help="Depth of the seed elements")
    parser.add_argument("--duration", type=int, default=30, help="Duration of the simulation in days")
    parser.add_argument("--durationSeed", type=int, default=1, help="Duration of the seed in days")
    parser.add_argument("--verticalMixing", action="store_true", help="Vertical mixing value")
    parser.add_argument("--readers", nargs="*", default=[], help="Readers to use")
    parser.add_argument("--longitude", type=float, required=True, help="Longitude for seeding particles")
    parser.add_argument("--latitude", type=float, required=True, help="Latitude for seeding particles")
    parser.add_argument("--radius", type=float, required=True, help="Radius for seeding particles")
    parser.add_argument("--particles", type=int, required=True, help="Number of particles to seed")
    parser.add_argument("--timeStep", type=int, required=True, help="Time step for the simulation")

    args = parser.parse_args()
    generate_script(args)