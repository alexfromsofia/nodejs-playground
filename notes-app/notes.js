const fs = require("fs");
const chalk = require("chalk");

const addNote = (title, body) => {
    const notes = loadNotes();
    const duplicateNote = notes.find(note => note.title === title);

    if (!duplicateNote) {
        notes.push({ title, body });

        saveNotes(notes);
        console.log(chalk.green.inverse("Note added!"));
    } else {
        console.log(chalk.red.inverse("Duplicate note title!"));
    }
};

const removeNote = title => {
    const notes = loadNotes();
    const updatedNotes = notes.filter(note => note.title !== title);

    if (notes.length > updatedNotes.length) {
        saveNotes(updatedNotes);
        console.log(chalk.green.inverse("Note removed!"));
    } else {
        console.log(chalk.red.inverse("No note removed!"));
    }
};

const listNotes = () => {
    const notes = loadNotes();

    console.log(chalk.cyan.inverse("Your notes..."));

    notes.forEach(({ title, body }) => {
        console.log(chalk.blue.inverse.bold(title));
        console.log(chalk.blue.inverse(body));
    });
};

const readNote = title => {
    const notes = loadNotes();
    const note = notes.find(n => n.title === title);

    if (note) {
        console.log(chalk.blue.inverse.bold(title));
        console.log(chalk.blue.inverse(note.body));
    } else {
        console.log(chalk.red.inverse("No note with that title found!"));
    }
};

const loadNotes = () => {
    try {
        const dataBuffer = fs.readFileSync("notes.json");
        const dataJSON = dataBuffer.toString();

        return JSON.parse(dataJSON);
    } catch (error) {
        return [];
    }
};

const saveNotes = notes => {
    const dataJSON = JSON.stringify(notes);

    fs.writeFileSync("notes.json", dataJSON);
};

module.exports = {
    addNote: addNote,
    removeNote: removeNote,
    listNotes: listNotes,
    readNote: readNote
};
