from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
import pandas as pd

class ItemRequest(BaseModel):
    item: str

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


USER = "postgres.gztwxiuuautxwkghxehl"
PASSWORD = "sridhar6379426473"
HOST = "aws-0-ap-southeast-1.pooler.supabase.com"
PORT = "6543"
DBNAME = "postgres"


conn = psycopg2.connect(
    dbname=DBNAME,
    user=USER,
    password=PASSWORD,
    host=HOST,
    port=PORT
)


@app.get("/")
async def root():
    query = "select * from salestable limit 1"
    df = pd.read_sql(query, conn)

    # Fill NaN values with 0
    df = df.fillna(0)

    # Close the connection
    

    # Return the dataframe as JSON
    return df.to_dict(orient="records")

@app.get("/product_id")
async def product_id(id:str):
    place_id = id
    query = f"select * from salestable where id = {place_id}"
    df = pd.read_sql(query, conn)

    # Fill NaN values with 0
    df = df.fillna(0)

    # Close the connection
    

    # Return the dataframe as JSON
    return df.to_dict(orient="records")


@app.get("/stock_level")
async def stock_level(item: str):
    stock_levels = {"phone": 2, "mobile": 5}
    
    if item in stock_levels:
        return {item: stock_levels[item]}
    else:
        return {"error": f"{item} not found in stock levels"}
    

@app.post("/stock_level_from_body")
async def stock_level_from_body(request: ItemRequest):
    stock_levels = {"phone": 2, "mobile": 5}
    
    # Check if the item is in the stock_levels
    if request.item in stock_levels:
        return {request.item: stock_levels[request.item]}
    else:
        return {"error": f"{request.item} not found in stock levels"}

#.\myenv\Scripts\Activate
#uvicorn app.main:app --host 0.0.0.0 --port $PORT --reload