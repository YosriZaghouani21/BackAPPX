const router = require('express').Router();
const fs = require('fs');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const users_ports = []

// generate the api in the api-generator folder
router.post("/", async (req, res) => {
    const api_type = req.body.api_type;
    const user_id = req.body.user_id;
    let api_generator_name = ''
    try {
        if (!fs.existsSync(`./api-generator/api_${user_id}`)) {
            // Create the api directory
            fs.mkdirSync(`./api-generator/api_${user_id}`);
            console.log('API directory created successfully!');
        }
        else {
            fs.rmdirSync(`./api-generator/api_${user_id}`, { recursive: true });
            console.log('API directory deleted successfully!');
            fs.mkdirSync(`./api-generator/api_${user_id}`);
            console.log('API directory created successfully!');
        }

        if (api_type !== 'crud') {
            api_generator_name = 'payment-api-generator';
        } else {
            api_generator_name = 'auth-api-generator';
        }

        let commands = [];
        // Read the commands from the file
        if (process.platform === 'win32') {
            // Windows
            commands = fs.readFileSync(`./bin/bat/${api_generator_name}.bat`, 'utf-8').split('\n');
        }else {
            // Linux
            commands = fs.readFileSync(`./bin/bin/${api_generator_name}.sh`, 'utf-8').split('\n');
        }

        // Execute each command in the api-generator folder
        const promises = commands.map((command) => {
            return exec(command, { cwd: `./api-generator/api_${user_id}` });
        });
        await Promise.all(promises);
        res.send(`${api_generator_name} commands executed successfully!`);
    } catch (err) {
        console.error(`Error: ${err}`);
        // Delete the api-generator folder
        fs.rmdirSync(`./api-generator/api_${user_id}`, { recursive: true });
        res.status(500).send('Error executing API commands');
    }
});

// Push the api to a git repository
router.post("/push", async (req, res) => {
    const {username, repository,token,user_id} = req.body;
    const git_url = `https://${username}:${token}@github.com/${username}/${repository}.git`;
    try {
        let commands;
        // Read the commands from the file
        // Get the server platform
        if (process.platform === 'win32') {
            // Windows
            commands = fs.readFileSync('./bin/bat/api-generator-push.bat', 'utf-8').split('\n');
        }else {
            // Linux
            commands = fs.readFileSync('./bin/sh/api-generator-push.sh', 'utf-8').split('\n');
        }

        // Execute each command in the api-generator folder
        const promises = commands.map((command) => {
            return exec(command, { cwd: `./api-generator/api_${user_id}` });
        });
        await Promise.all(promises);
        await exec(`git commit -m "Initial commit"`, { cwd: `./api-generator/api_${user_id}` });
        await exec(`git remote add origin ${git_url} `, { cwd: `./api-generator/api_${user_id}` });
        await exec(`git push -u origin main`, { cwd: `./api-generator/api_${user_id}` });
        res.send('Git commands executed successfully!');

    } catch (err) {
        console.error(`Error: ${err}`);
        // Remove the .git folder
        fs.rmdirSync(`./api-generator/api_${user_id}/.git`, { recursive: true });
        res.status(500).send('Error executing API commands '+err);
    }
});

// Deploy the api to our server
router.post("/deploy", async (req, res) => {
    const {user_id} = req.body;
    const user_port = allocatePort(user_id);
    const user_database = `db_${user_id}`;
    try {
        // Check if the api directory exists
        if (!fs.existsSync(`./api-generator/api_${user_id}`)) {
            res.status(500).send('API directory not found!');
        }

        if (!fs.existsSync(`./api-generator/api_${user_id}/.env`)) {
            if (!fs.existsSync(`./api-generator/api_${user_id}/node_modules`)) {
                await exec(`npm install`, {cwd: `./api-generator/api_${user_id}`});
                console.log('node modules installed successfully!');
            }
            await exec(`echo PORT=${user_port}>> .env`, {cwd: `./api-generator/api_${user_id}`});
            await exec(`echo DB_URI=mongodb://localhost:27017/${user_database}>> .env`, {cwd: `./api-generator/api_${user_id}`});
            console.log('env file created successfully!');
        }
        // Start the api server
        await exec(`pm2 restart index.js`, { cwd: `./api-generator/api_${user_id}` });
        res.send(`API deployed successfully for user: ${user_id} on port: ${user_port}, on database: ${user_database}`);

    }
    catch (err) {
        console.error(`${err}`);
        res.status(500).send('Error executing API commands '+err);
    }
});

// Stop the api
router.post("/stop", async (req, res) => {
    const {user_id} = req.body;
    try {
        await exec(`pm2 stop index.js`, {cwd: `./api-generator/api_${user_id}`});
        console.log(`Server for user ${user_id} stopped successfully!`);
        res.send(`API stopped successfully for user: ${user_id}`);
    }
    catch (err) {
        console.error(`Error: ${err}`);
        res.status(500).send('Error executing API commands '+err);
    }
});

// Delete the api
router.post("/delete", async (req, res) => {
    const {user_id} = req.body;
    try {
        fs.rmdirSync(`./api-generator/api_${user_id}`, { recursive: true });
        res.send(`API deleted successfully for user: ${user_id}`);
    }
    catch (err) {
        console.error(`Error: ${err}`);
        res.status(500).send('Error executing API commands '+err);
    }
});

// Handle ports allocation for each user
function allocatePort(user_id) {
    // Start from port 3001
    let port = 3001;
    // Check if the ports array is empty
    if (users_ports.length === 0) {
        // Push the user_id and the port to the array
        users_ports.push({ user_id: user_id, port: port });
        return port;
    } else {
        for (let i = 0; i < users_ports.length; i++) {
            if (users_ports[i].user_id === user_id) {
                return users_ports[i].port;
            }
        }
        users_ports.push({ user_id: user_id, port: port + 1 });
        return port + 1;
    }
}

module.exports = router;