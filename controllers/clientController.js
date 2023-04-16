const Client = require("../models/Client");

// create client
exports.createClient = async (req, res) => {
  const { name, familyName, email, phoneNumber, password, image, reference } =
    req.body;
  const fullName = name + " " + familyName;
  try {
    const newClient = new Client({
      name,
      email,
      phoneNumber,
      password,
      image,
      reference,
    });

    await newClient.save();
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ errors: error });
  }
};
exports.allClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json({
      clients,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// Update project
//exports.updateProject = async (req, res) => {
//    Project.findByIdAndUpdate(req.params.id,req.body)
//           .then(doc2 => {
//            res.status(200).json(doc2)
//        })
//        .catch(err => {
//            res.status(500).json({error : err})
//        })
//
//
//};
//
//// Get all projects
//exports.allProjects = async (req, res) => {
//    Project.find({})
//    .then(docs =>{
//    res.status(200).json(docs)
//   })
//   .catch(err => {
//    res.status(500).json({error:err})
//   })
//};
////Delete a project
//exports.deleteProject = async (req, res) => {
//  try {
//    await Project.findByIdAndDelete(req.params.id);
//    res.json({ msg: "projet supprimé avec succès" });
//  } catch (err) {
//    return res.status(500).json({ msg: err.message });
//  }
//};
//
////Get User with id
//exports.getSingleProject = async (req, res) => {
//  try {
//    const user = await Project.findById(req.params.id);
//    res.status(200).json({user});
//  } catch (err) {
//    return res.status(500).json({ msg: err.message });
//  }
//};
//
