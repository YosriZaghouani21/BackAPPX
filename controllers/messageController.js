const Message = require("../models/messageModel");


// sendMessage
exports.sendMessage = async (req, res) => {
  const { senderId, reclamtionId,content } = req.body;
  try {
    const newMessage = new Message({
        senderId,
        reclamtionId,
        content
      });
    await newMessage.save();
    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json({ errors: error });
  }
};



// Get all Reclamations
exports.allMessagesByReclamationId= async (req, res) => {
   Message.find({ reclamtionId: req.params.id })
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};




