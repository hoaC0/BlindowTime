// backend/models/notification.model.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Pfad zur JSON-Datei
const notificationsFile = path.join(__dirname, '..', 'data', 'notifications.json');

// Stellt sicher, dass das Verzeichnis existiert
const ensureDirectoryExists = async () => {
  const dir = path.dirname(notificationsFile);
  try {
    await fs.access(dir);
  } catch (error) {
    // Verzeichnis existiert nicht, also erstellen
    await fs.mkdir(dir, { recursive: true });
  }
};

class NotificationModel {
    static async getAllNotifications() {
        try {
            await ensureDirectoryExists();
            
            try {
                const data = await fs.readFile(notificationsFile, 'utf8');
                const notifications = JSON.parse(data);
                
                // Filtere Benachrichtigungen, die älter als eine Woche sind
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                
                const filteredNotifications = notifications.filter(notification => {
                    const notificationDate = new Date(notification.time);
                    return notificationDate >= oneWeekAgo;
                });
                
                // Wenn Benachrichtigungen älter als eine Woche gefiltert wurden, aktualisiere die Datei
                if (filteredNotifications.length < notifications.length) {
                    await fs.writeFile(notificationsFile, JSON.stringify(filteredNotifications, null, 2), 'utf8');
                }
                
                // Füge formatierte Zeit hinzu
                return filteredNotifications.map(notification => ({
                    ...notification,
                    formattedTime: this.getFormattedTime(notification.time)
                })).sort((a, b) => new Date(b.time) - new Date(a.time)); // Sortiere nach Zeit (neueste zuerst)
                
            } catch (error) {
                // Wenn die Datei nicht existiert oder nicht gültig ist, erstelle eine leere Liste
                if (error.code === 'ENOENT' || error instanceof SyntaxError) {
                    await fs.writeFile(notificationsFile, JSON.stringify([], null, 2), 'utf8');
                    return [];
                }
                throw error;
            }
        } catch (error) {
            console.error('NotificationModel.getAllNotifications:', error);
            return [];
        }
    }

    static async createNotification(notificationData) {
        try {
            await ensureDirectoryExists();
            
            let notifications = [];
            
            try {
                const data = await fs.readFile(notificationsFile, 'utf8');
                notifications = JSON.parse(data);
            } catch (error) {
                // Wenn die Datei nicht existiert oder nicht gültig ist, starte mit leerer Liste
                if (error.code !== 'ENOENT' && !(error instanceof SyntaxError)) {
                    throw error;
                }
            }
            
            // Generiere eine eindeutige ID
            const notificationId = Date.now().toString();
            
            // Neue Benachrichtigung erstellen
            const newNotification = {
                notification_id: notificationId,
                title: notificationData.title,
                message: notificationData.message,
                sender: notificationData.sender || 'System',
                time: notificationData.time || new Date().toISOString(),
                read: false,
                avatar: notificationData.sender ? notificationData.sender.charAt(0) : 'S'
            };
            
            // Füge die neue Benachrichtigung hinzu
            notifications.push(newNotification);
            
            // Speichere die aktualisierte Liste
            await fs.writeFile(notificationsFile, JSON.stringify(notifications, null, 2), 'utf8');
            
            return notificationId;
        } catch (error) {
            console.error('NotificationModel.createNotification:', error);
            throw error;
        }
    }

    static async markAsRead(id) {
        try {
            await ensureDirectoryExists();
            
            let notifications = [];
            let success = false;
            
            try {
                const data = await fs.readFile(notificationsFile, 'utf8');
                notifications = JSON.parse(data);
            } catch (error) {
                if (error.code === 'ENOENT' || error instanceof SyntaxError) {
                    return false; // Datei existiert nicht oder ist ungültig
                }
                throw error;
            }
            
            // Aktualisiere den Lesestatus
            notifications = notifications.map(notification => {
                if (notification.notification_id === id) {
                    success = true;
                    return { ...notification, read: true };
                }
                return notification;
            });
            
            // Speichere die aktualisierte Liste
            await fs.writeFile(notificationsFile, JSON.stringify(notifications, null, 2), 'utf8');
            
            return success;
        } catch (error) {
            console.error('NotificationModel.markAsRead:', error);
            throw error;
        }
    }

    static async deleteNotification(id) {
        try {
            await ensureDirectoryExists();
            
            let notifications = [];
            let success = false;
            
            try {
                const data = await fs.readFile(notificationsFile, 'utf8');
                notifications = JSON.parse(data);
            } catch (error) {
                if (error.code === 'ENOENT' || error instanceof SyntaxError) {
                    return false; // Datei existiert nicht oder ist ungültig
                }
                throw error;
            }
            
            // Filtere die Benachrichtigung heraus
            const originalLength = notifications.length;
            notifications = notifications.filter(notification => notification.notification_id !== id);
            
            // Überprüfe, ob eine Benachrichtigung gelöscht wurde
            success = notifications.length < originalLength;
            
            // Speichere die aktualisierte Liste
            await fs.writeFile(notificationsFile, JSON.stringify(notifications, null, 2), 'utf8');
            
            return success;
        } catch (error) {
            console.error('NotificationModel.deleteNotification:', error);
            throw error;
        }
    }

    // Hilfsmethode zur Formatierung der Zeit
    static getFormattedTime(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;
        
        // Zeit in Minuten, Stunden oder Tagen umrechnen
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) {
            return `vor ${days} ${days === 1 ? 'Tag' : 'Tagen'}`;
        } else if (hours > 0) {
            return `vor ${hours} ${hours === 1 ? 'Stunde' : 'Stunden'}`;
        } else if (minutes > 0) {
            return `vor ${minutes} ${minutes === 1 ? 'Minute' : 'Minuten'}`;
        } else {
            return 'gerade eben';
        }
    }
}

export default NotificationModel;