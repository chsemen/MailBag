import requests
# import json
# from pprint import pprint

u='http://localhost/mailboxes'
print(u)
r=requests.get(u)
print(r.status_code)
j=r.json()
print(j)

#pprint(vars(r))
#dir(r)
#r.content
# list = json.loads(r.content)
# for v in list:
#     print(v)

u='http://localhost/mailboxes/INBOX'
print(u)
r=requests.get(u)
print(r.status_code)
j=r.json()
print(j)




