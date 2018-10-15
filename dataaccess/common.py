import pymysql.cursors
import pandas as pd
import json

import requests.structures

db_schema = 'lahman2017'


# Connect to the database over the network. Use the connection
# to send commands to the DB.
cnx = pymysql.connect(host='localhost',
                             user='dbuser',
                             password='dbuser',
                             db=db_schema,
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)


def run_q(q, args, fetch=False):
    """
    # Helper method to centralize database queries and returning responses.
    :param q: SQL query string that MAY contain %s entries to be filled with args.
    :param args: Optional args to include with query submission to insert into %s
    :param fetch: If true, call and return fetchall(). Not all SQL statements return a value.
    :return: Query result or None
    """
    print("run_q: q= " + q, args)

    result  =   None
    cursor = cnx.cursor()
    cursor.execute(q, args)

    # Obtain query results if requested.
    if fetch:
        result = cursor.fetchall()

    cnx.commit()    # Commit operation, release active session and release locks.
    return result
