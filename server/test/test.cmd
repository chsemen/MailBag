curl localhost/mailboxes
curl localhost/mailboxes/INBOX
curl localhost/messages/INBOX/103319
curl -X DELETE localhost/messages/INBOX/103319
curl -d @testNewMessage.json -H "Content-Type:application/json" -X POST localhost/messages