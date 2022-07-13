# s-health-test

## Setup
`$ yarn install`
`$ yarn start`

## Project Structure

This project consists of three packages:

- *server* - basic Express app REST API
- *client* - React App w/ TS FE (via CRA)
- *ui* - UI component library built w/ StoryBook

## Thoughts

As this is a fullstack task and I'm applying for a Frontend position, I perhaps understandably
spent most of my time reasearching and implementing the backend (i.e. '/packages/server') solution.

I looked at using fs.readFile but, as part of my research, I watched some tutorial videos that explained
the issues that method can bring when dealing with very large CSV files.
That's why, in the end, I used the fs.createReadStream method, in conjunction with the csv-parser package,
to parse and read the CSV files.

There's clearly potential for this data to be stored in a database so we don't need to parse and read the CSV files
every time a request is made, but given my lack of backend knowledge, and given the 2hr time limit, I thought it best
to leave this out for now, but it's a candidate for improvement.

Another candidate for improvement is clearly error handling, both server and client side. I was really keen to see what
I could actually do in just 2 hours so this is something that has not yet been implemented.

I'm using TypeScript in the client but it could also be used on the server, with the potential for types to be shared
between client and server.  I wanted to focus on completing the requirements of the task, and didn't want to slip into
the trap of spending 2hrs setting up tooling, so I didn't use TS on the backend for this reason.

The React implementation, as you can see, is all just in the App.tsx file which isn't how I'd normally live my life,
or how I'd do it in reality, but I'd used up a lot of my time researching and implementing the server solution, so was
short on time when it came to the React implementation.

Naturally, there's lots of room for improvement here and I steer you towards my CodeSandbox account, which contains many
boilerplate examples of neatly compartmentalised React code: https://codesandbox.io/u/JonJamesDesign

Lots more to say about my solution, so hopefully we can discuss it more in person.

Thanks, Jon.