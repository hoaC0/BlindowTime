import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// pfad setzen zur json datei
const notificationsFile = path.join(__dirname, '..', 'data', 'notifications.json');

// STELLT SICHER DASS DAS DIRECTORY DA IST!
const ensureDirectoryExists = async () => {
  const dir = path.dirname(notificationsFile);
  try {
    await fs.access(dir);
  } catch (error) {
    // verzeichnis gibts nicht -> machen
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
                
                // alte nachrichten rauswerfen
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                
                const filteredNotifications = notifications.filter(notification => {
                    const notificationDate = new Date(notification.time);
                    return notificationDate >= oneWeekAgo;
                });
                
                // falls wir was rausgefiltert haben -> datei aktualisieren
                if (filteredNotifications.length < notifications.length) {
                    await fs.writeFile(notificationsFile, JSON.stringify(filteredNotifications, null, 2), 'utf8');
                }
                
                // formatierte zeit hinzufuegen
                return filteredNotifications.map(notification => ({
                    ...notification,
                    formattedTime: this.getFormattedTime(notification.time)
                })).sort((a, b) => new Date(b.time) - new Date(a.time)); // sortieren nach zeit
                
            } catch (error) {
                // bei fehler leere liste nehmen
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

    // neue benachrichtigung erstellen
    static async createNotification(notificationData) {
        try {
            await ensureDirectoryExists();
            
            let notifications = [];
            
            try {
                const data = await fs.readFile(notificationsFile, 'utf8');
                notifications = JSON.parse(data);
            } catch (error) {
                // fehler abfangen
                if (error.code !== 'ENOENT' && !(error instanceof SyntaxError)) {
                    throw error;
                }
            }
            
            // id bauen
            const notificationId = Date.now().toString();
            
            // neue nachricht anlegen
            const newNotification = {
                notification_id: notificationId,
                title: notificationData.title,
                message: notificationData.message,
                sender: notificationData.sender || 'System',
                time: notificationData.time || new Date().toISOString(),
                read: false,
                avatar: notificationData.sender ? notificationData.sender.charAt(0) : 'S'
            };
            
            // hinzufuegen zu liste
            notifications.push(newNotification);
            
            // back in file
            await fs.writeFile(notificationsFile, JSON.stringify(notifications, null, 2), 'utf8');
            
            return notificationId;
        } catch (error) {
            console.error('NotificationModel.createNotification:', error);
            throw error;
        }
    }

    // setzt read status
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
                    return false; // file gibts nicht oder broken
                }
                throw error;
            }
            
            // gelesen
            notifications = notifications.map(notification => {
                if (notification.notification_id === id) {
                    success = true;
                    return { ...notification, read: true };
                }
                return notification;
            });
            
            // speicher
            await fs.writeFile(notificationsFile, JSON.stringify(notifications, null, 2), 'utf8');
            
            return success;
        } catch (error) {
            console.error('NotificationModel.markAsRead:', error);
            throw error;
        }
    }

    // LOESCHT NACHRICHT
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
                    return false; // datei gibts nicht
                }
                throw error;
            }
            
            // nachricht rausfiltern
            const originalLength = notifications.length;
            notifications = notifications.filter(notification => notification.notification_id !== id);
            
            // check ob was geloescht wurde
            success = notifications.length < originalLength;
            
            // speichern
            await fs.writeFile(notificationsFile, JSON.stringify(notifications, null, 2), 'utf8');
            
            return success;
        } catch (error) {
            console.error('NotificationModel.deleteNotification:', error);
            throw error;
        }
    }

    // hilfsfunktion fuer formatierte zeit
    static getFormattedTime(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;
        
        // zeit umrechne in min/stunden/tage
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