# app1/views.py

from flask import render_template, request, jsonify
from app1 import app1

import pandas as pd 
import psycopg2 as pg 
mydb = pg.connect("dbname=blank") 

import time
from datetime import date, timedelta, datetime

@app1.route("/")
def home():
    return render_template('home.html')

# backend function to create a time series graph
@app1.route('/graph', methods = ['POST'])
def get_mt():
    if request.method == 'POST':
        datetext = request.form.get('date_backend').split(' - ')
        qstring1 = """select created_on, sum(count) from test_table where date(created_on) >= '%s' and date(created_on) <= '%s' 
                     group by created_on order by created_on""" % (str(datetext[0]), str(datetext[1]))
        mt = pd.read_sql(qstring1, mydb)
        mt_dict = {}
        for col in mt.columns.values:
            mt_dict[col] = list(mt[col])
        mt_dict['created_on'] = map(lambda x: x.strftime("%Y-%m-%d"), mt_dict['created_on']) #dict formatted as {'column1': [1,2,3,...], 'column2':['2016-06-01',...]}
        return jsonify(mt_dict)
    return {} #function requires a return


