curl localhost/mailboxes
curl localhost/mailboxes/INBOX
curl localhost/mailboxes/INBOX

$c=curl localhost/mailboxes/INBOX | select -expand Content | ConvertFrom-Json
$id = $c | select -expand id | select -first 1
$id
curl localhost/messages/INBOX/$id

rem curl -X DELETE localhost/messages/INBOX/2
curl -method DELETE localhost/messages/INBOX/$id

# curl -d @testNewMessage.json -H "Content-Type:application/json" -X POST localhost/messages
curl -inFile "testNewMessage.json" -Headers @{"Content-Type"="application/json"} -method POST localhost/messages

curl localhost/contacts
# curl -d @newContact.json -H "Content-Type:application/json" -X POST localhost/contacts
# rem curl localhost/contacts/v3kIznMU5quHrZgZ
# curl -d @newContact2.json -H "Content-Type:application/json" -X PUT localhost/contacts/v3kIznMU5quHrZgZ
# curl -d @newContact.json -H "Content-Type:application/json" -X PUT localhost/contacts/v3kIznMU5quHrZgZ
# curl -d @newContact.json -H "Content-Type:application/json" -method PUT localhost/contacts/v3kIznMU5quHrZgZ

curl localhost/contacts | select -expand Content | ConvertFrom-Json
curl -inFile "newContact.json" -Headers @{"Content-Type"="application/json"} -method POST localhost/contacts/
$c=curl localhost/contacts | select -expand Content | ConvertFrom-Json
$id = $c | select -expand _id | select -first 1
$id

curl -inFile "newContact2.json" -Headers @{"Content-Type"="application/json"} -method PUT localhost/contacts/$id
curl -method DELETE localhost/contacts/$id
curl localhost/contacts

curl localhost/mailboxes/%5BGmail%5D%2FTrash