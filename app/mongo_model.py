import datetime as dt
import json
import logging
from pprint import pprint
from typing import Dict, Optional

import numpy as np
import pymongo
from pymongo.errors import ServerSelectionTimeoutError


HOST = "mongodb://mongo:27017/"
client = pymongo.MongoClient(HOST)
db = client['results']

def cloneZappaDB():
    """
    Clone the database hosted in zappa and replace it for the local database.
    After it, it prints the current database stored
    """
    client_clapton = pymongo.MongoClient("mongodb://localhost:27017/")
    db_clapton = client_clapton['results']
    train_data = db_clapton['train_data']
    zappa_client = pymongo.MongoClient('mongodb://150.214.91.194:27017/')
    zappa_train= zappa_client['results']['train_data']

    train_data.delete_many( { } )

    for doc in zappa_train.find({}):
        train_data.insert_one(doc)
    
    for cursor in train_data.find():
            pprint(cursor)


def print_db(db: pymongo.database):
    """Pretty print of mongo database

    Parameters
    ----------
    db : pymongo.database
        Database that will be printed.
    """
    for col in db.list_collection_names():
        print(f"===== {col} =====")
        for cursor in db[col].find():
            pprint(cursor)

def get_route(
    port_start: str, port_end: str, date: dt.datetime, boat_id: int = 0
) -> dict:
    """Return a route specified by its key (port_start,port_end,date)

    Parameters
    ----------
    port_start : string
        Port where the route starts
    port_end : string
        Port of arrival
    string_date : string
        Date of departure

    Returns
    -------
    dict
        Contains the desired route or none if it doesnt exist
    """

    string_date = date.strftime("%m/%d/%Y/%H:%M:%S")

    route = db["train_data"].find_one(
        {"_id": f"{port_start}-{port_end}-{string_date}-{boat_id}"}
    )

    return route


def delete_route(
    port_start: str, port_end: str, date: dt.datetime, boat_id: int = 0
) -> bool:
    """Return a route specified by its key (port_start,port_end,date)

    Parameters
    ----------
    port_start : string
        Port where the route starts
    port_end : string
        Port of arrival
    string_date : string
        Date of departure

    Returns
    -------
    bool
        True if that route doesnt exist anymore
    """

    string_date = date.strftime("%m/%d/%Y/%H:%M:%S")

    db["train_data"].delete_one(
        {"_id": f"{port_start}-{port_end}-{string_date}-{boat_id}"}
    )

    if db["train_data"].find_one(
        {"_id": f"{port_start}-{port_end}-{string_date}-{boat_id}"}
    ):
        return False
    else:
        return True


def delete_collection(col: str ) -> bool:
    """Remove train_data collection
    Parameters
    ----------
    col : str
        Name of the collection to be deleted
        default= "train_data"
     bool
        True if the collection was deleted
        False if the collection didnt exist

    """

    if col in db.list_collection_names():
        colection = db.col
        colection.drop()
        return True
    else:
        return False

def get_available_routes() -> dict:
    """Get the available routes stored
    Parameters
    ----------
     Returns
    -------
    json dict
        Containing all the available routes
    """
    query_result = db["train_data"].find(
        {}, {"_id": 0, "city_start": 1, "city_end": 1}
    )
    return list(query_result)


def load_route( boat : int, city_start: str , city_end : str , time_start : dt.datetime):
    """load a route from train_data given a spefic time_start
    Parameters
    ----------
    boat : int
        Name of the collection to be deleted
        default= "train_data"
    city_start: str
       Name of the city where the route starts
    city_end: str
       Name of the city where the route end
    time_start: dt.datetime
        date of departure for the route

    Returns
-------
    json dict
        Containing all the available routes
    """
    found_ordered = list(
        db["train_data"].aggregate(
            [
                {"$match": {"boat": boat}},
                {"$match": {"city_start": city_start}},
                {"$match": {"city_end": city_end}},
                {
                    "$addFields": {
                        "time_dif": {"$abs": {"$subtract": [time_start, "$time_start"]}}
                    }
                },
                {"$sort": {"time_dif": 1}},
                {"$project": {"_id": 0, "time_dif": 0}},
            ],
        )
    )

    if len(found_ordered) == 0:
        abort(404)

    closest_found = found_ordered[0]

    return json.dumps(closest_found, default=str)