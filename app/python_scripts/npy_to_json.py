import numpy as np
import typer
import json


def npy_to_json(
    npy_path, json_path, min_lat=-80, max_lat=90, min_lon=-180, max_lon=180
):
    array = np.load(npy_path)

    print(array.min(), array.max())

    base_json = {
        "lo1": min_lon,
        "la1": max_lat,  # NO ESTOY SEGURO DE SI ES MAX O MIN
        "lo2": max_lon,
        "la2": min_lat,
        "dx": 1.0,
        "dy": 1.0,
        "basicAngle": 0,
        "subDivisions": 0,
    }

    lat_json = base_json.copy()
    lat_json["data"] = array[0, :, :].flatten()

    lon_json = base_json.copy()
    lon_json["data"] = array[1, :, :].flatten()

    json_dict = [lat_json, lon_json]

    with open(json_path, "w") as f:
        f.write(json.dumps(json_dict))


if __name__ == "__main__":
    typer.run(npy_to_json)
