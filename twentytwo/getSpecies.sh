#!/bin/bash

wget -O SpeciesList "http://geoserver-rls.imas.utas.edu.au/geoserver/RLS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=RLS:SpeciesList&outputFormat=csv&propertyName=Species_name&CQL_FILTER=strIndexOf(Species_name,'[')=-1"

sed -r 's/,/\t/g' SpeciesList |  awk -F'\t' -v OFS=',' '{print $3,$4}'  > SpeciesList_2col


rm ./SpeciesList

