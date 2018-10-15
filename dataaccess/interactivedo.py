from . import common

def test_connect():

    q = "show tables"
    result = common.run_q(q, None, True)
    return result
