import PropertyType from "../models/PropertyType.js";

export const createPropertyType = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const exists = await PropertyType.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Property type already exists" });
    }

    const propertyType = await PropertyType.create({ name });

    res.status(201).json(propertyType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPropertyTypes = async (req, res) => {
  try {
    const types = await PropertyType.find().sort({ createdAt: -1 });
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePropertyType = async (req, res) => {
  try {
    const { id } = req.params;

    const type = await PropertyType.findById(id);
    if (!type) {
      return res.status(404).json({ message: "Not found" });
    }

    await type.deleteOne();

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};