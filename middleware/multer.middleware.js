import multer from 'multer'
import path from 'path'
import fs from 'fs' // Import fs to check or create directory

// Get the directory of the current file
const __dirname = path.dirname(new URL(import.meta.url).pathname)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Reached middleware')

    // Define the desired destination directory
    const tempDir = path.join(__dirname, '../public/temp') // Adjust this relative to your current directory structure

    // Ensure the directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true, mode: 0o755 })
    }

    // Pass the directory to multer's callback
    cb(null, tempDir)
  },
  filename: function (req, file, cb) {
    // Set a static filename or modify as needed
    cb(null, 'testing.jpg')
  },

  // console.log("Exiting middleware")
})

export const upload = multer({
  storage: storage,
})
