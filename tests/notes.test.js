import { jest } from "@jest/globals";

jest.unstable_mockModule("../src/db.js", () => ({
  insertNote: jest.fn(),
  getDB: jest.fn(),
  saveDB: jest.fn(),
}));

const { insertNote, getDB, saveDB } = await import("../src/db.js");
const { newNote, getAllNotes, removeNote } = await import("../src/notes.js");

beforeEach(() => {
  insertNote.mockClear();
  getDB.mockClear();
  saveDB.mockClear();
});

describe("app cli", () => {
  test("newNote inserts data and returns it", async () => {
    const note = "Test note";
    const tags = ["tag1", "tag2"];
    const data = {
      tags,
      content: note,
      id: Date.now(),
    };
    insertNote.mockResolvedValue(data);
    const result = await newNote(note, tags);
    expect(result).toEqual(data);
  });
  test("getAllNotes returns all notes", async () => {
    const db = {
      notes: ["note1", "note2", "note3"],
    };
    getDB.mockResolvedValue(db);
    const result = await getAllNotes();
    expect(result).toEqual(db.notes);
  });
  test("removeNote does nothing if id is not found", async () => {
    const notes = [
      { id: 1, content: "note 1" },
      { id: 2, content: "note 2" },
      { id: 3, content: "note 3" },
    ];

    getDB.mockResolvedValue({ notes });
    const result = await removeNote(4);
    expect(result).toBe(4);
  });
});
