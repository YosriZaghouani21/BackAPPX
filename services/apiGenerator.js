const router = require('express').Router();
const fs = require('fs');
const { promisify } = require('util');
const User = require('../models/User');
const exec = promisify(require('child_process').exec);
const users_ports = []



// generate the api in the api-generator folder
router.post("/", async (req, res) => {
    const {api_type,user_id} = req.body;
    let api_generator_name = ''
    user = await User.findById(user_id)
    console.log("this is the apiGen",user)
    apiGen = user.apiGen
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
            if (apiGen == 1){
                user.apiGen = 2
               await user.save() 
                console.log("apiGen updated",user.apiGen)
            }else if(apiGen ==0){
                user.apiGen =2
                await user.save() 
                console.log("new crud apiGen added", user.apiGen)
            }
        } else {
            api_generator_name = 'auth-api-generator';
                if (apiGen == 2){
                     user.apiGen = 1
                    await user.save() 
                    console.log("apiGen updated",user.apiGen)
                }else if(apiGen ==0){
                     user.apiGen =1
                    await user.save() 
                    console.log("new payment apiGen added", user.apiGen)
                }
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
        await exec(`git push -u origin main --force`, { cwd: `./api-generator/api_${user_id}` });
        res.send({message:'Git commands executed successfully!'});
        user = await User.findById(user_id);
/* 
        if (user.apiGen == 1){
            user.apiGen = 3
            await user.save()
        }else if (user.apiGen == 2){
            user.apiGen = 4
            await user.save()
        } */

    } catch (err) {
        console.error(`Error: ${err}`);
        // Remove the .git folder
        fs.rmdirSync(`./api-generator/api_${user_id}/.git`, { recursive: true });
        await User.updateOne({ _id: user_id }, { apiGen: 0 })
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


            await exec(`pm2 startOrReload index.js -f`, {cwd: `./api-generator/api_${user_id}`});
            res.status(200).json({
                    port: user_port,
                    database: user_database,
                    message: `API deployed successfully for user: ${user_id}`
                }
            );
    }
    catch (err) {
        console.error(`${err}`);
        res.status(500).json('Error executing API commands '+err);
    }
});

// Restart the api
router.post("/restart", async (req, res) => {
    const {user_id} = req.body;
    try {
        await exec(`pm2 restart index.js`, {cwd: `./api-generator/api_${user_id}`});
        console.log(`Server for user ${user_id} restarted successfully!`);
        res.send(`API restarted successfully for user: ${user_id}`);
    }
    catch (err) {
        console.error(`Error: ${err}`);
        res.status(500).json('Error executing API commands '+err);
    }
});

// Stop the api
router.post("/stop", async (req, res) => {
    const {user_id} = req.body;
    try {
        await exec(`pm2 stop index.js`, {cwd: `./api-generator/api_${user_id}`});
        console.log(`Server for user ${user_id} stopped successfully!`);
        res.send(`API stopped successfully for user: ${user_id}`);
        deallocatePort(user_id);
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
            // Check if the api directory exists
            if (!fs.existsSync(`./api-generator/api_${user_id}`)) {
                res.status(500).send('API directory not found!');
            }
            // Stop the api server
            await exec(`pm2 stop index.js`, {cwd: `./api-generator/api_${user_id}`});
            // Add a delay of 1 second before removing the directory
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Delete the api directory
            fs.promises.rm(`./api-generator/api_${user_id}`, {recursive: true}, (err) => {
                if (err) {
                    console.error(`Error removing directory: ${err}`);
                    res.status(500).send(`Error removing directory: ${err}`);
                } else {
                    console.log(`Directory ./api-generator/api_${user_id} removed successfully.`);
                    // Remove the user_id and the port from the array
                    deallocatePort(user_id);
                    res.status(200).send(`Directory ./api-generator/api_${user_id} removed successfully.`);
                }
            });
        } catch (err) {
            console.error(`Error: ${err}`);
            res.status(500).send('Error executing API commands ' + err);
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
// Deallocate the port for the user
function deallocatePort(user_id) {
    for (let i = 0; i < users_ports.length; i++) {
        if (users_ports[i].user_id === user_id) {
            users_ports.splice(i, 1);
        }
    }
}
// Handle server instance allocation for each user
function serverIsDeployed(user_id) {
    for (let i = 0; i < users_servers.length; i++) {
        if (users_servers[i].user_id === user_id) {
            return true;
        }
    }
    return false;
}

// stop all the servers
router.post("/stop-all", async (req, res) => {
    try {
        await exec(`pm2 stop all`);
        console.log(`All servers stopped successfully!`);
        res.send(`All servers stopped successfully!`);
    }
    catch (err) {
        console.error(`Error: ${err}`);
        res.status(500).send('Error executing API commands '+err);
    }
}
);



module.exports = router;