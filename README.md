# App

Daily Diet API.

## FRs (Functional Requirements)

- [x] It must be possible to register a user;
- [x] It must be possible for the user to register a meal eaten (the meal should be related to the user) with the information: name, description, date and time, whether it was in the daily diet or not;
- [x] It must be possible for the user to edit a meal;
- [x] It must be possible for the user to delete a meal;
- [x] It must be possible to get all the meals from a user;
- [x] It must be possible for the user to get the information from a meal;
- [x] It must be possible to get the metrics of a user:
  - [x] Total number of meals registered;
  - [x] Total number of meals inside the daily diet;
  - [x] Total number of meals outside the daily diet;
  - [x] Better sequence of meals inside the daily diet;

## BR (Business Requirements)

- [x] A user can only get information about meals he created;
- [x] A user can only edit meals he created;
- [x] A user can only delete meals he created;

## NFR (Non-functional requirements)

- [x] Application data must be persisted in a SQLite database using a SQL Query Builder (Knex);
- [x] It must be possible to identify a user between requests;
