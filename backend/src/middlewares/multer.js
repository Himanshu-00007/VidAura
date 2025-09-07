import multer from "multer";

// ab file RAM me aayegi, disk pe nahi bachegi
const storage = multer.memoryStorage();

export const upload = multer({ storage });
