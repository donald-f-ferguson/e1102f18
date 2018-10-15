from e1102f18.dataaccess import common
import json

def test_connect():

    q = "show tables"
    result = common.run_q(q, None, True)
    print("test_connect: result = ", json.dumps(result, indent=2))


test_connect()