import imaplib
import time

################ IMAP SSL ##############################

with imaplib.IMAP4_SSL(host="imap.gmail.com", port=imaplib.IMAP4_SSL_PORT) as imap_ssl:
    print("Connection Object : {}".format(imap_ssl))

    ############### Login to Mailbox ######################
    print("Logging into mailbox...")
    resp_code, response = imap_ssl.login("chsemen202412@gmail.com", "dzwv faft sagm srsx")

    print("Response Code : {}".format(resp_code))
    print("Response      : {}\n".format(response[0].decode()))

    #################### List Directores #####################
    resp_code, directories = imap_ssl.list()

    print("Response Code : {}".format(resp_code))
    print("========= List of Directories =================\n")
    for directory in directories:
        print(directory.decode())

    ############### Number of Messages per Directory ############
    print("\n=========== Mail Count Per Directory ===============\n")
    for directory in directories:
        directory_name = directory.decode().split('"')[-2]
        directory_name = '"' + directory_name + '"'
        if directory_name == '"[Gmail]"':
            continue
        try:
            resp_code, mail_count = imap_ssl.select(mailbox=directory_name, readonly=True)
            print("{} - {}".format(directory_name, mail_count[0].decode()))
        except Exception as e:
            print("{} - ErrorType : {}, Error : {}".format(directory_name, type(e).__name__, e))
            resp_code, mail_count = None, None

    ############# Close Selected Mailbox #######################
    imap_ssl.close()