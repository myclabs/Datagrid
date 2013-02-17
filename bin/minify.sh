#!/bin/sh

INPUT_JS=../demo/js/datagrid*.js
OUTPUT_JS=../src/datagrid.min.js

java -jar yuicompressor-*.jar -o ${OUTPUT_JS} ${INPUT_JS}

INPUT_CSS=../demo/css/datagrid*.css
OUTPUT_CSS=../src/datagrid.min.css

java -jar yuicompressor-*.jar -o ${OUTPUT_CSS} ${INPUT_CSS}
