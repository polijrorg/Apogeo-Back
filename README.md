# Prisma project template

## Description

This template uses:

For development ->
- Typescript
- Prisma
- NodeJS
- Express
- Postgres
- ESLint

## Configuration

Make sure you have node and docker installed by typing `node -v` and `docker -v` in terminal.

1. Use the repository as template (by forking it or using this one directly)
2. Install dependencies `yarn`
3. Run `docker run --name postgres -e POSTGRES_PASSWORD=mypass -p 5432:5432 -d postgres:latest`
4. Create a database in your container
5. Configure `.env` file copying the .env.example and setting the variables

## Scripts

- `yarn dev:server`: starts the server in the port you specified in .env (default 3333)

- `yarn prisma`: enables prisma cli

- `yarn lint`: check linting rules based in the .eslintrc.json file

- `yarn build`: transpile the src directory

## Notes

Don't forget to check if the template features fits your use case!

Check for the .github/workflows files, because they will need to be updated once you start your deploy 
