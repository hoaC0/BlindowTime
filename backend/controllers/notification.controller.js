// backend/controllers/notification.controller.js
import NotificationModel from '../models/notification.model.js.js';

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await NotificationModel.getAllNotifications();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNotification = async (req, res) => {
  try {
    const notificationId = await NotificationModel.createNotification(req.body);
    res.status(201).json({ 
      notification_id: notificationId, 
      message: 'Benachrichtigung erfolgreich erstellt' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const id = req.params.id;
    const success = await NotificationModel.markAsRead(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Benachrichtigung nicht gefunden' });
    }
    
    res.json({ message: 'Benachrichtigung als gelesen markiert' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const id = req.params.id;
    const success = await NotificationModel.deleteNotification(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Benachrichtigung nicht gefunden' });
    }
    
    res.json({ message: 'Benachrichtigung erfolgreich gelöscht' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};