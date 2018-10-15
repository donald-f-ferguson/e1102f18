# Lahman.py

# Convert to/from web native JSON and Python/RDB types.
import json

# Include Flask packages
from flask import Flask
from flask import request
import copy

from e1102f18.services import interactivesvc


app = Flask(__name__)

# Return the index page as HTML. This is not part of the API
@app.route('/static/lahman')
def root():
    fn = "index.html"
    #debug_message("Trying to send file: " + fn)
    return app.send_static_file(fn)

@app.route('/connect_test')
def connect_test():

    result = interactivesvc.connect_test()
    return json.dumps(result), 200


if __name__ == '__main__':
    app.run()




