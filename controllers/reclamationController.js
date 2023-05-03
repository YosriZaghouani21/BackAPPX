const Reclamation = require("../models/reclamationModel");


// create Reclamtion
exports.createReclamation = async (req, res) => {
  const { objet, contenu,userId,stat } = req.body;
  try {
    const newReclamation = new Reclamation({
        objet,
        contenu,
        userId,
        stat,
      });
    await newReclamation.save();
    res.status(201).json(newReclamation);
  } catch (error) {
    res.status(500).json({ errors: error });
  }
};

// Update Reclamtion
exports.updateReclamation = async (req, res) => {
    Reclamation.findByIdAndUpdate(req.params.id, req.body)
    .then((doc2) => {
      res.status(200).json(doc2);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

// Get all Reclamations
exports.allReclamations= async (req, res) => {
   Reclamation.find(req.params.reference)
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

//Delete a Reclamation
exports.deleteReclamations = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ msg: "categorie supprimée avec succès" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//Get Reclamation by id
exports.getSingleReclamtion = async (req, res) => {
  try {
    const reclamation = await Reclamation.findById(req.params.id);
    res.status(200).json({ reclamation });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};


