# Cloud Developer Journal Capstone

Serverless application based on the code provided from Udacity's Cloud Developer Nanodegree.

# Functionality of the application

This application will allow creating/removing/updating/fetching journal entries. Each journal entry can optionally have an attachment image. Each user only has access to journal entries that he/she has created.

# Journal Entries

The application stores journal entries, and each entry icontains the following fields:

* `entryId` (string) - a unique id for an entry
* `createdAt` (string) - date and time when an entry was created
* `title` (string) - title of a journal entry (e.g. "Vacation Day 1")
* `description` (string) - descriptio nof the journal entry (e.g. "Went swimming, hiking, sleeping")
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a TODO item

You might also store an id of a user who created a journal entry.

The file serverless.yml in the backend folder describes the used API.

# Project Rubric

The following rubric items are fulfilled:

- The application allows users to create, update, delete items
- The application allows users to upload a file.
- The application only displays items for a logged in user.
- Authentication is implemented and does not allow unauthenticated access.
- The code is split into multiple layers separating business logic from I/O related code.
- Code is implemented using async/await and Promises without using callbacks.
- All resources in the application are defined in the "serverless.yml" file
- Each function has its own set of permissions.
- Application has sufficient monitoring.
- HTTP requests are validated
- Data is stored in a table with a composite key.
- Scan operation is not used to read data from a database.
