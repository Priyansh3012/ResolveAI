const aiService = require("./aiService");

const classifyTicket = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      const error = new Error(
        "Title and description are required"
      );

      error.statusCode = 400;

      throw error;
    }

    const result = await aiService.classifyTicket(
      title,
      description
    );

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  classifyTicket,
};