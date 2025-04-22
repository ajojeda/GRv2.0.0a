// backend/controllers/userController.js
import UserService from "../services/UserService.js";

export const getAllUsers = (req, res) => {
  const users = UserService.getAllUsers();
  res.json(users);
};

export const getUser = (req, res) => {
  const user = UserService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

export const createUser = (req, res) => {
  const newUser = UserService.createUser(req.body);
  res.status(201).json(newUser);
};

export const updateUser = (req, res) => {
  const updated = UserService.updateUser(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: "User not found" });
  res.json(updated);
};

export const deleteUser = (req, res) => {
  const success = UserService.deleteUser(req.params.id);
  if (!success) return res.status(404).json({ message: "User not found" });
  res.sendStatus(204);
};