from flask import Flask, jsonify, request
from sklearn.linear_model import LinearRegression
import numpy as np
from scipy.optimize import minimize
import pandas as pd
import json
import datetime



app = Flask(__name__)


def calculate(current, data):
    # TODO predict activity level based on day of week, weighted towards recency
    
    df = pd.json_normalize(data)
    
    weights = np.linspace(1, 2, num=len(data) - 1)

    Y = [element['activity_time'] for element in data[1:]]
    X = []
    
    min_w, max_w = float('inf'), 0
    
    for index, row in df.iterrows():
        min_w = min(min_w, row['water_drank'])
        max_w = max(max_w, row['water_drank'])
        
        if index == 0:
            continue
        to_append = []
        
        year, month, day = [int(element) for element in row["date"].split("-")]
        date = datetime.datetime(year, month, day)
        to_append.append(date.weekday())
        to_append.append(date.month)
        to_append.append(row["avg_temp"])
        to_append.append(row["avg_hum"])
        to_append.append(df.iloc[index - 1]["activity_time"])
        to_append = to_append + [pow(element, 2) for element in to_append]
        X.append(to_append)
    
    # process to make prediction
    X = np.array(X)
    activity_model = LinearRegression().fit(X, Y, weights)
    today = datetime.datetime.today()
    current_X = [today.weekday(), today.month, current["avg_temp"], current["avg_hum"], df.iloc[-1]["activity_time"]]
    current_X = current_X + [pow(element, 2) for element in current_X]
    current_X = np.array(current_X).reshape(1, -1)
    # predicted activity
    pred_ex = activity_model.predict(current_X)
    # WORKS UP TO HERE
    
    
    Y = [element['score'] for element in data[1:]]
    X = []
    for index, row in df.iterrows():
        if index == 0:
            continue
        to_append = []
        to_append.append(row['water_drank'])
        to_append.append(row["avg_temp"])
        to_append.append(row["avg_hum"])
        to_append.append(row["activity_time"])
        # use previous days bodywater measure
        to_append.append(df.iloc[index - 1]['body_water'])
        to_append = to_append + [pow(element, 2) for element in to_append]

        X.append(to_append)
        
    water_model = LinearRegression().fit(X, Y, weights)
    
    # REGRESS A FUNCTION OF WATER DRANK AND ACTIVITY LEVEL TO SATISFACTION RATING THEN FIND MAX VALUE SPECIFIED BELOW

    for i, value in enumerate(np.linspace(min_w, max_w, num=100)):
        water_row = [value, current["avg_temp"], current["avg_hum"], pred_ex[0], df.iloc[-1]['body_water']]
        water_row = water_row + [pow(element, 2) for element in water_row]
        water_row = np.array(water_row).reshape(1, -1)
        if i == 0:
            current_max = water_row
        else:
            current_max = min(current_max, water_row, key=lambda x: abs(water_model.predict(x) - 5))

        
    return current_max[0][0]

@app.route('/', methods = ['POST'])
def regress():
    data = request.json
    prediction = calculate(data)
    return jsonify(result=prediction)


if __name__ == '__main__':
    # TEST SHIT
    with open("test.json", "r") as test_data:
        data = json.loads(test_data.read())
        data = {"current" : {"avg_temp": 18, "avg_hum": 20}, "prev": data}
        current, prev = data["current"], data["prev"]
        print(calculate(current, prev))
    
    app.run(debug = True)