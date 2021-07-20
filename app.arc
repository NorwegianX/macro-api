@app
macro-api

@aws
region eu-west-1
profile default

@http
/*
  method options
  src dist/http/options-index

/
  method get
  src dist/http/get-index

/project
  method get
  src dist/http/get-project

/project
  method put
  src dist/http/put-project

/project
  method delete
  src dist/http/delete-project

/project
  method post
  src dist/http/post-project

@tables
macro-api
  PK *String
  SK **String
  stream true

@indexes
macro-api
  GSI1PK *String
  GSI1SK **String
  name GSI1

macro-api
  GSI2PK *String
  GSI2SK **String
  name GSI2
