# ml/test_connection.py
import sys
import json

if __name__ == "__main__":
    # Reading arguments passed from Node.js
    # sys.argv[0] is the script name, sys.argv[1] is the first arg
    input_data = sys.argv[1] if len(sys.argv) > 1 else "No Data"

    result = {
        "status": "success",
        "message": "Python received your data!",
        "received_input": input_data,
        "prediction": "Go lift heavy things."
    }

    # Print JSON so Node.js can parse it
    print(json.dumps(result))