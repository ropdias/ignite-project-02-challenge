# App

Daily Diet API.

## FRs (Functional Requirements)

- [ ] It must be possible to register a user;
- [ ] It must be possible for the user to register a meal eaten (the meal should be related to the user) with the information: name, description, date and time, whether it was in the daily diet or not;
- [ ] It must be possible for the user to edit a meal;
- [ ] It must be possible for the user to delete a meal;
- [ ] It must be possible to get all the meals from a user;
- [ ] It must be possible for the user to get the information from a meal;
- [ ] It must be possible to get the metrics of a user:
  - [ ] Total number of meals registered;
  - [ ] Total number of meals inside the daily diet;
  - [ ] Total number of meals outside the daily diet;
  - [ ] Better sequence of meals inside the daily diet;

## BR (Business Requirements)

- [ ] A user can only get information about meals he created;
- [ ] A user can only edit meals he created;
- [ ] A user can only delete meals he created;

## NFR (Non-functional requirements)

- [x] Application data must be persisted in a SQLite database using a SQL Query Builder (Knex);
- [ ] It must be possible to identify a user between requests;