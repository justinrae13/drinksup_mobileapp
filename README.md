<p align="center"><img width="300px" src="https://thumbs.gfycat.com/ImpracticalDistortedFeline-small.gif"></p>

<h1 align="center">Drinks Up Mobile Application</h1>

<h4><img width="60px" src="https://justinrae.ch/git_icons/step1.svg"> Clone the project :</h4>

```
$ git clone https://github.com/justinrae13/drinksup_mobileapp.git

```

<i>to clone a specific branch :</i>

```
$ git clone -b name_of_the_branch https://github.com/justinrae13/drinksup_mobileapp.git
```

<h4><img width="60px" src="https://justinrae.ch/git_icons/step2.svg"> Install all dependencies :</h4>

```
$ npm install
```

<h4><img width="60px" src="https://justinrae.ch/git_icons/step3.svg"> Build platforms :</h4>

```
$ ionic cordova build android
```

<i>or / and</i>

```
$ ionic cordova build ios
```

<h4><img width="60px" src="https://justinrae.ch/git_icons/step4.svg"> Check if the facebookconnect.xml file exists in path :</h4>

```
\platform\android\app\src\main\res\values\
```
<h5>If the file is missing, try to close and re-open your editor and then re-check the file. If the file is still missing, create facebookconnect.xml</h5>

<br>
<hr>

<h5>There's a chance that the app wont run or build on android and you might get this error :</h5>

```
* What went wrong:
Execution failed for task ':app:processDebugResources'.
```

<h5>In this case, you must add these lines :</h5>

```
<string name="fb_app_id">434430730652551</string>
<string name="fb_app_name">drinksup</string>
```

<h5>
  to <i>platform > android > app > src > main > res > values >facebookconnect.xml</i> ( inside of "resources" tag )
  <br><br>
  <i>And then, you must close and re-open the terminal and re-run $ionic cordova run android</i>
</h5>

<br>
<hr>

## Fixing the gray screen before splash screen [Cordova] [Pre-launch bug]
<br>

##### <img width="60px" src="https://justinrae.ch/git_icons/step1.svg"> Create a new style file in path :
```
\platform\android\app\src\main\res\values\
```
##### <img width="60px" src="https://justinrae.ch/git_icons/step2.svg"> Add these lines in the new style.xml file.
```
<?xml version="1.0" encoding="utf-8"?>
<resources>
   <style name="Theme.Transparent" parent="android:style/Theme.DeviceDefault.Light.NoActionBar">
      <item name="android:windowDisablePreview">true</item>
  </style>
</resources>
```
##### <img width="60px" src="https://justinrae.ch/git_icons/step3.svg"> Update theme in AndroidManifest.xml
```
 <activity ... android:theme="@style/Theme.Transparent" ... >
```

