
const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");

const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, "data", "books.json");

// Middleware
app.use(cors());
app.use(express.json());

// Read books
async function readBooks() {
    const data = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(data);
}

// Save books
async function saveBooks(books) {
    await fs.writeFile(
        DATA_FILE,
        JSON.stringify(books, null, 2)
    );
}

// Validate input
function validateBook(body) {
    const { title, author, price } = body;

    if (
        typeof title !== "string" ||
        !title.trim() ||
        typeof author !== "string" ||
        !author.trim() ||
        price === "" ||
        price === null ||
        price === undefined ||
        !Number.isFinite(Number(price)) ||
        Number(price) < 0
    ) {
        return "Please enter valid title, author and price.";
    }

    return null;
}

// GET: Retrieve all books
app.get("/api/books", async (req, res, next) => {
    try {
        const books = await readBooks();
        res.status(200).json(books);
    } catch (error) {
        next(error);
    }
});

// GET: Retrieve a particular book by ID
app.get("/api/books/:id", async (req, res, next) => {
    try {
        const books = await readBooks();

        const book = books.find(
            item => item.id === req.params.id
        );

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json(book);

    } catch (error) {
        next(error);
    }
});

// POST: Add a new book
app.post("/api/books", async (req, res, next) => {
    try {
        const validationError = validateBook(req.body);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const books = await readBooks();

        const newBook = {
            id: randomUUID(),
            title: req.body.title.trim(),
            author: req.body.author.trim(),
            price: Number(req.body.price)
        };

        books.push(newBook);

        await saveBooks(books);

        res.status(201).json({
            message: "Book added successfully",
            book: newBook
        });

    } catch (error) {
        next(error);
    }
});

// PUT: Update book details
app.put("/api/books/:id", async (req, res, next) => {
    try {
        const validationError = validateBook(req.body);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const books = await readBooks();

        const index = books.findIndex(
            item => item.id === req.params.id
        );

        if (index === -1) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        books[index] = {
            ...books[index],
            title: req.body.title.trim(),
            author: req.body.author.trim(),
            price: Number(req.body.price)
        };

        await saveBooks(books);

        res.status(200).json({
            message: "Book updated successfully",
            book: books[index]
        });

    } catch (error) {
        next(error);
    }
});

// DELETE: Delete a book
app.delete("/api/books/:id", async (req, res, next) => {
    try {
        const books = await readBooks();

        const index = books.findIndex(
            item => item.id === req.params.id
        );

        if (index === -1) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        const deletedBook = books[index];

        books.splice(index, 1);

        await saveBooks(books);

        res.status(200).json({
            message: "Book deleted successfully",
            book: deletedBook
        });

    } catch (error) {
        next(error);
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        message: "Internal server error"
    });
});

// Initialize server
async function startServer() {
    await fs.mkdir(path.dirname(DATA_FILE), {
        recursive: true
    });

    try {
        await fs.access(DATA_FILE);
    } catch {
        await saveBooks([]);
    }

    app.listen(PORT, () => {
        console.log(`Backend running at http://localhost:${PORT}`);
    });
}

startServer().catch(console.error);
