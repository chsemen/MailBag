// Style imports.
import "normalize.css";
import "../css/main.css";

// React imports.
import React from "react";
import ReactDOM from "react-dom";

// App imports.
import BaseLayout from "./components/BaseLayout";
import * as BL from "./components/BaseLayout";
import * as IMAP from "./IMAP";
import * as Contacts from "./Contacts";

// Render the UI.
const baseComponent = ReactDOM.render(<BaseLayout />, document.body);
//ReactDOM.render(<BaseLayout />, document.getElementById('root'));

// Now go fetch the user's mailboxes, and then their contacts.
//baseComponent.state.showHidePleaseWait(true);
BL.getState().showHidePleaseWait(true);
async function getMailboxes() {
  const imapWorker: IMAP.Worker = new IMAP.Worker();
  const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes();
  mailboxes.forEach((inMailbox) => {
    //baseComponent.state.addMailboxToList(inMailbox);
    BL.getState().addMailboxToList(inMailbox);
  });
}
getMailboxes().then(function() {
  // Now go fetch the user's contacts.
  async function getContacts() {
    const contactsWorker: Contacts.Worker = new Contacts.Worker();
    const contacts: Contacts.IContact[] = await contactsWorker.listContacts();
    contacts.forEach((inContact) => {
      //baseComponent.state.addContactToList(inContact);
      BL.getState().addContactToList(inContact);
    });
  }
  //getContacts().then(() => baseComponent.state.showHidePleaseWait(false));
  getContacts().then(() => BL.getState().showHidePleaseWait(false));
});
