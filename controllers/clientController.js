const Client = require("../models/clientModel.js");

// create client
exports.createClient = async (req, res) => {
  const { name, familyName,email,phoneNumber,password,reference } = req.body;
  const fullName = name +" "+familyName;
  try {
    const newClient = new Client({
      name,
      familyName,
      fullName,
      email,
      phoneNumber,
      password,
      reference
    });

    await newClient.save();
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ errors: error });
  }
};



// Update project
exports.updateClient = async (req, res) => {
  try {
    const { name, familyName, email,phoneNumber,password,reference,image } = req.body;

    const updatedClient = await Client.findByIdAndUpdate(req.params.id, {
      name,
       familyName,
       email,
       phoneNumber,
       password,
       reference,
       image
    });

    return res.status(201).json({
      msg: "Le client a été modifié avec succès",
      user: updatedClient,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }

};

// Get all clients
exports.allClients = async (req, res) => {
    Client.find({})
    .then(docs =>{
    res.status(200).json(docs)
   })
   .catch(err => {
    res.status(500).json({error:err})
   }) 
};

exports.allClientsByProjectReference = async (req, res) => {
    Client.find({"reference":req.params.reference})
    .then(doc => {
        res.status(200).json(doc)
    })
    .catch(err => {
        res.status(500).json({error : err})
    })
};
//Delete a client 
exports.deleteClient = async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ msg: "client supprimé avec succès" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//Get Client with id
exports.getSingleClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    res.status(200).json({client});
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};


exports.uploadPhotoToClient = async (req, res) => {
  try {
    const image = await cloudinary.v2.uploader.upload(req.file.path);
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      image,
    });
    res.json({
      success: true,
      file: image.secure_url,
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

