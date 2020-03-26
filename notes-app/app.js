const chalk = require("chalk");
const yargs = require("yargs");
const notes = require("./notes");

// customize yargs version
yargs.version("1.1.0");

// Create add command
yargs.command({
    command: "add",
    describe: "Add a new note",
    builder: {
        title: {
            describe: "Note title",
            demandOption: true,
            type: "string"
        },
        Body: {
            describe: "Note body",
            demandOption: true,
            type: "string"
        }
    },
    handler: ({ title, body }) => {
        notes.addNote(title, body);
    }
});

// Create remove command
yargs.command({
    command: "remove",
    describe: "Remove a note",
    builder: {
        title: {
            describe: "Note title",
            demandOption: true,
            type: "string"
        }
    },
    handler: ({ title }) => {
        notes.removeNote(title);
    }
});

// Create list command
yargs.command({
    command: "list",
    describe: "List a note",
    handler: () => {
        notes.listNotes();
    }
});

// Create read command
yargs.command({
    command: "read",
    describe: "Read a note",
    builder: {
        title: {
            describe: "Note title",
            demandOption: true,
            type: "string"
        }
    },
    handler: ({ title }) => {
        notes.readNote(title);
    }
});

yargs.parse();
