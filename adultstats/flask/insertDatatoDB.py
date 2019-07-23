import pandas as pd
from pymongo import MongoClient

df=pd.read_csv('/usr/share/nginx/www/adultstats/adult_dataset.csv',dtype=str)
client=MongoClient('localhost')['sampleproject']['adultdata']
for col in df.columns:
    df[col]=df[col].fillna('')
    df[col]=df[col].str.strip()

doc=df.to_dict(orient='records')
client.insert(doc)





