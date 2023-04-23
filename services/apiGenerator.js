const router = require('express').Router();
const fs = require('fs');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

// generate the api in the api-generator folder
router.post("/", async (req, res) => {
    const api_type = req.body.api_type;
    let api_generator_name = ''
    try {
        if (!fs.existsSync('./api-generator/api')) {
            // Create the api directory
            fs.mkdirSync('./api-generator/api');
            console.log('API directory created successfully!');
        }
        else {
            fs.rmdirSync('./api-generator/api', { recursive: true });
            console.log('API directory deleted successfully!');
            fs.mkdirSync('./api-generator/api');
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
            return exec(command, { cwd: './api-generator/api' });
        });
        await Promise.all(promises);


        res.send(`${api_generator_name} commands executed successfully!`);
    } catch (err) {
        console.error(`Error: ${err}`);
        res.status(500).send('Error executing API commands');
    }
});

// Push the api to a git repository
router.post("/push", async (req, res) => {
    const {username, repository,token} = req.body;
    const git_url = `https://${username}:${token}@github.com/${username}/${repository}.git`;
    try {
        let commands = [];
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
            return exec(command, { cwd: './api-generator/api' });
        });
        await Promise.all(promises);
        await exec(`git commit -m "Initial commit"`, { cwd: './api-generator/api' });
        await exec(`git remote add origin ${git_url} `, { cwd: './api-generator/api' });
        await exec(`git push -u origin main`, { cwd: './api-generator/api' });
        res.send('Git commands executed successfully!');
        await fs.rmdirSync('./api-generator/api', { recursive: true });

    } catch (err) {
        console.error(`Error: ${err}`);
        res.status(500).send('Error executing API commands '+err);
    }
});

module.exports = router;