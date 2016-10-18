#!/usr/bin/python

import csv
import json

csvfile = open('SpeciesList_2col', 'r')
jsonfile = open('SpeciesList_2col.json', 'w')

fieldnames = ("sid","name")
reader = csv.DictReader( csvfile, fieldnames)
for row in reader:
    json.dump(row, jsonfile)
    jsonfile.write(',\n')
