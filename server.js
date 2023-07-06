// Server file to launch server on a specified PORT
const app = require('./app.js')
const PORT = 3000

// Todo: Change listen to port, IP address for external network interfaces
// fire it up, listen to a specific pot we defined (e.g above)
app.listen(
    PORT,
    () => console.log(`Server started on http://localhost:${PORT}`)
)
