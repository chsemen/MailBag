import path from "path";
import express, { Express, NextFunction, Request, Response } from "express";
import { serverInfo } from "./ServerInfo";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";
import * as Contacts from "./Contacts";
import { IContact } from "./Contacts";

const app: Express = express();

app.use(express.json());
app.use("/",
    express.static(path.join(__dirname, "../../client/dist"))
);

app.use(function (inRequest: Request, inResponse: Response,
    inNext: NextFunction) {
    inResponse.header("Access-Control-Allow-Origin", "*");
    inResponse.header("Access-Control-Allow-Methods",
        "GET,POST,DELETE,OPTIONS"
    );
    inResponse.header("Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept"
    );
    inNext();
});

app.get("/mailboxes",
    async (inRequest: Request, inResponse: Response) => {
        console.log("GET /mailboxes (1)");
        try {
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes();
            console.log("GET /mailboxes (1): Ok", mailboxes);
            inResponse.json(mailboxes);
        } catch (inError) {
            console.log("GET /mailboxes (1): Error", inError);
            // inResponse.send("error");
            inResponse.sendStatus(500);
        }
    }
);

app.get("/mailboxes/:mailbox",
    async (inRequest: Request, inResponse: Response) => {
        //var s = `"${inRequest.params.mailbox}"`        
        // var s = inRequest.params.mailbox;        
        console.log("GET /mailboxes (2)", inRequest.params.mailbox);
        //console.log(`GET /mailboxes (2) ${s}`);
        // s = "[Gmail]/Trash";
        // console.log(`GET /mailboxes (2) ${s}|`);
        try {
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            const messages: IMAP.IMessage[] = await imapWorker.listMessages({
                mailbox: inRequest.params.mailbox
                // mailbox: s
            });
            console.log("GET /mailboxes (2): Ok", messages);
            inResponse.json(messages);
        } catch (inError) {
            console.log("GET /mailboxes (2): Error", inError);
            // inResponse.send("error");
            inResponse.sendStatus(500);
        }
    }
);

app.get("/messages/:mailbox/:id",
    async (inRequest: Request, inResponse: Response) => {
        console.log("GET /messages (3)", inRequest.params.mailbox, inRequest.params.id);
        try {
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            const messageBody: string | undefined = await imapWorker.
                getMessageBody({
                    mailbox: inRequest.params.mailbox,
                    id: parseInt(inRequest.params.id, 10)
                });
            console.log("GET /messages (3): Ok", messageBody);
            inResponse.send(messageBody);
        } catch (inError) {
            console.log("GET /messages (3): Error", inError);
            // inResponse.send("error");
            inResponse.sendStatus(500);
        }
    }
);

app.delete("/messages/:mailbox/:id",
    async (inRequest: Request, inResponse: Response) => {
        console.log("DELETE /messages");
        try {
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            await imapWorker.deleteMessage({
                mailbox: inRequest.params.mailbox,
                id: parseInt(inRequest.params.id, 10)
            });
            console.log("DELETE /messages: Ok");
            inResponse.send("ok");
        } catch (inError) {
            console.log("DELETE /messages: Error", inError);
            // inResponse.send("error");
            inResponse.sendStatus(500);
        }
    }
);

app.post("/messages",
    async (inRequest: Request, inResponse: Response) => {
        console.log("POST /messages", inRequest.body);
        try {
            const smtpWorker: SMTP.Worker = new SMTP.Worker(serverInfo);
            await smtpWorker.sendMessage(inRequest.body);
            console.log("POST /messages: Ok");
            inResponse.send("ok");
        } catch (inError) {
            console.log("POST /messages: Error", inError);
            // inResponse.send("error");
            inResponse.sendStatus(500);
        }
    }
);

app.get("/contacts",
    async (inRequest: Request, inResponse: Response) => {
        console.log("GET /contacts");
        try {
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            const contacts: IContact[] = await contactsWorker.listContacts();
            console.log("GET /contacts: Ok", contacts);
            inResponse.json(contacts);
        } catch (inError) {
            console.log("GET /contacts: Error", inError);
            // inResponse.send("error");
            inResponse.sendStatus(500);
        }
    }
);

app.post("/contacts",
    async (inRequest: Request, inResponse: Response) => {
        console.log("POST /contacts", inRequest.body);
        try {
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            const contact: IContact = await contactsWorker.
                addContact(inRequest.body);
            console.log("POST /contacts: Ok", contact);
            inResponse.json(contact);
        } catch (inError) {
            console.log("POST /contacts: Error", inError);
            // inResponse.send("error");
            inResponse.sendStatus(500);
        }
    }
);

app.put("/contacts/:id",
    async (inRequest: Request, inResponse: Response) => {
        console.log("PUT /contacts", inRequest.body);
        try {
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            const numReplaced : number = await contactsWorker.
                updateContact(inRequest.params.id, inRequest.body);
            console.log("PUT /contacts: Ok", numReplaced);
            inResponse.json({numReplaced : numReplaced});
        } catch (inError) {
            console.log("PUT /contacts: Error", inError);
            // inResponse.send("error");
            inResponse.sendStatus(500);
        }
    }
);


app.delete("/contacts/:id",
    async (inRequest: Request, inResponse: Response) => {
        console.log("DELETE /contacts", inRequest.body);
        try {
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            await contactsWorker.deleteContact(inRequest.params.id);
            console.log("Contact deleted");
            inResponse.send("ok");
        } catch (inError) {
            console.log(inError);
            // inResponse.send("error");
            inResponse.sendStatus(500);
        }
    }
);

// Start app listening.
app.listen(80, () => {
    console.log("MailBag server open for requests");
});