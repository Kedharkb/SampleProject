import pandas
from pymongo import MongoClient
import json
from bson import ObjectId
import redis

#connection to Mongo
client=MongoClient('localhost')['sampleproject']

#connection to Redis
r = redis.StrictRedis(host='localhost', port=6379, db=0)

class AdultsData():

    def getData(self,id,query):
        records={}
        tookFromRedis = False

        #for caching mechanism  redis is being used.


        #check if filters to be applied
        if 'filters' in query and len(query['filters'].keys())>0:
            length=client['adultdata'].find(query['filters'],{'_id':False}).count()
            redisDoc = r.get(str(query['filters']))
            if redisDoc is not None:
                data = eval(redisDoc)

            else:
                data = list(client['adultdata'].find(query['filters'],{'_id':False}))
                # pickled_object = json.dumps(data)
                r.set(str(query['filters']),data,ex=20)

        else:
            #load the cached index page directly from the redis if available else load from mongo
            redisDoc=r.get(str(query['index']))
            length =client['adultdata'].find({},{'_id':False}).count()
            if redisDoc is not None:
                data=eval(redisDoc)
                tookFromRedis=True
            else:
                data=list(client['adultdata'].find({},{'_id':False}))
                tookFromRedis=False
                r.set(str(query['index']), data, ex=20)



        # Pagination Logic
        index = query['index']
        pageSize = query['pageSize']

        maxPages = ((length / pageSize) + 1)
        skip = (index * pageSize) - pageSize

        limit = (index * pageSize)
        if limit < 0:
            limit = len(data) + 1

        if not tookFromRedis:
            data = data[skip:limit]


        records['maxPages'] = maxPages
        records['data'] = data

        if len(data)>0:
            records['columns'] = data[0].keys()
        else:
            records['columns']=[]
        return True,records


    def getGraphData(self,id):
        # build data for graph
        data = list(client['adultdata'].find())
        df = pandas.DataFrame(data)
        df = df.fillna('')
        graph={}
        df=df[df['sex']!='']

        # GroupBy applied to get the x and y axis details for the graph
        sexGroup=df.groupby(['sex']).size().reset_index(name='counts')

        relationGroup=df.groupby(['relationship']).size().reset_index(name='counts')

        raceGroup=df.groupby(['race']).size().reset_index(name='counts')

        graph['sex']=sexGroup.to_dict(orient='list')
        graph['relation']=relationGroup.to_dict(orient='list')
        graph['race']=raceGroup.to_dict(orient='list')

        return True,graph

