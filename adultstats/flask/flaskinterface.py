from gevent import monkey
monkey.patch_all()
import sys
import flask
import flask.views
import functools
import json
import inspect
import config
import traceback
import pprint
import werkzeug.contrib.fixers
from gevent.pywsgi import WSGIServer

def getInstance(collectionName):
    modules = map(__import__, config.applicationModules)
    for module in modules:
            if hasattr(module, collectionName):
                klass = getattr(module, collectionName)
                if inspect.isclass(klass):
                    instance = klass()
                    return instance
    return None

def requestValidator(f):

    @functools.wraps(f)
    def decarator(*args, **kwargs):

        collectionName = kwargs["collection"].title().replace("_", "")
        flask.g.handler = getInstance(collectionName)
        if not flask.g.handler:
            return flask.Response(json.dumps({"status": "error", "msg": "Unknown Collection: %s" % (collectionName,)}),
                                  200, [("Content-Type", "application/json"), ('Cache-Control', 'private, max-age=0, no-cache, no-store')])



        return f(*args, **kwargs)

    return decarator


class RequestHandler(flask.views.MethodView):
    decorators = [requestValidator]

    def get(self, collection, id=None, action=None):

        if action and hasattr(flask.g.handler, action):
            actionHandler = getattr(flask.g.handler, action, None)
            kwargs = None
            flask.request.files
            if flask.request.args:
                kwargs = {}
                for k, v in flask.request.args.items():
                    if not k == "partnerId":
                        kwargs[k] = v

            if kwargs and len(kwargs):
                (status, msg) = actionHandler(id, **kwargs)
            else:
                (status, msg) = actionHandler(id)

        elif (id is not None) :
            (status, msg) = flask.g.handler.get(id)
        else:
            status = False
            msg = "Not Authorized to get data from collection: %s" % (collection)

        return flask.Response(json.dumps({"status": "ok" if status else "error", "msg": msg}), 200,
                              [('Content-Type', 'application/json'), ('Cache-Control', 'private, max-age=0, no-cache, no-store')])

    def post(self, collection, id=None, action=None):
        if action and hasattr(flask.g.handler, action):
            actionHandler = getattr(flask.g.handler, action, None)
            kwargs = None
            flask.request.files
            if flask.request.data:
                kwargs = flask.request.json
            if kwargs:
                (status, msg) = actionHandler(id, **kwargs)
            else:
                (status, msg) = actionHandler(id)
        elif id is None and action is None and hasattr(flask.g.handler, "create"):
            (status, msg) = flask.g.handler.create(flask.request.json)
        else:
            status = False
            msg = "Invalid or unauthorized access %s / %s" % (collection, action)
        return flask.Response(json.dumps({"status": "ok" if status else "error", "msg": msg}), 200,
                              [('Content-Type', 'application/json'), ('Cache-Control', 'private, max-age=0, no-cache, no-store')])

    #PUT will be handled only for an instance in a collection, i.e. to update an instance
    def put(self, collection, id):
        if (id is not None) and hasattr(flask.g.handler, "modify"):
            (status, msg) = flask.g.handler.modify(id, flask.request.json)
        else:
            status = False
            msg = "Invalid or unauthorized access %s / %s" % (collection, id)
        return flask.Response(json.dumps({"status": "ok" if status else "error", "msg": msg}), 200,
                              [('Content-Type', 'application/json'), ('Cache-Control', 'private, max-age=0, no-cache, no-store')])

    #DELETE will be handled only for an instance in a collection, i.e. to delete an instance
    def delete(self, collection, id):
        if (id is not None) and hasattr(flask.g.handler, "delete"):
            (status, msg) = flask.g.handler.delete(id)
        else:
            status = False
            msg = "Invalid or unauthorized access %s / %s" % (collection, id)
        return flask.Response(json.dumps({"status": "ok" if status else "error", "msg": msg}), 200,
                              [('Content-Type', 'application/json'), ('Cache-Control', 'private, max-age=0, no-cache, no-store')])

def create_app():
    app = flask.Flask(__name__)
    app.secret_key = config.secretKey

    app.add_url_rule(config.flaskBaseUrl+"/<collection>", view_func=RequestHandler.as_view("collection"),
                     methods=["HEAD", "GET", "POST"])
    app.add_url_rule(config.flaskBaseUrl+"/<collection>/<id>", view_func=RequestHandler.as_view("instance"),
                     methods=["GET", "PUT", "DELETE"])
    app.add_url_rule(config.flaskBaseUrl+"/<collection>/<id>/<action>", view_func=RequestHandler.as_view("action"), methods=["POST", "GET"])

    return app

app = create_app()

@app.errorhandler(500)
def exceptionHandler(error):
    errFormat = '''Error:
Stack Trace:
%s
Environment:
%s
Payload Data:
%s
    ''' % (traceback.format_exc(), pprint.pformat(flask.request.environ), flask.request.data)
    return '{"status": "error", "msg": "Internal Error"}'



if __name__ == "__main__":  

    print(app)
    http_server =  WSGIServer(('', int(sys.argv[1])), werkzeug.contrib.fixers.ProxyFix(app))
    http_server.serve_forever()     
