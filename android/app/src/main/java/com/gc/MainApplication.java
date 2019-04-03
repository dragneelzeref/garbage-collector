package com.gc;

import android.app.Application;

import com.facebook.react.ReactApplication;
import io.invertase.firebase.RNFirebasePackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.heanoria.library.reactnative.locationenabler.RNAndroidLocationEnablerPackage;
import com.levelasquez.androidopensettings.AndroidOpenSettingsPackage;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

// import io.invertase.firebase.auth.RNFirebaseAuthPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNFirebasePackage(),
            new LinearGradientPackage(),
            new RNFusedLocationPackage(),
            new MapsPackage(),
            new RNAndroidLocationEnablerPackage(),
            new AndroidOpenSettingsPackage(),
            new SnackbarPackage(),
            new RNSensitiveInfoPackage(),
            new RNGoogleSigninPackage(),
            new VectorIconsPackage(),
            // new RNFirebaseAuthPackage(),
            new RNGestureHandlerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
