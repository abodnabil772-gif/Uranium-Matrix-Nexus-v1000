plugins {
    id("com.android.application")
}

android {
    namespace = "com.uranium.matrix.nexus"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.uranium.matrix.nexus"
        minSdk = 26
        targetSdk = 34
        versionCode = 1000
        versionName = "1000.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

dependencies {
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.9.0")
    implementation("androidx.core:core-ktx:1.10.1")
}

