include(["Engines", "Wine", "QuickScript", "OnlineInstallerScript"]);
include(["Engines", "Wine", "Verbs", "vcrun2012"]);
include(["Engines", "Wine", "Verbs", "dotnet40"]);
include(["Engines", "Wine", "Verbs", "d3dx9"]);

new OnlineInstallerScript()
    .name("DC Universe Online")
    .editor("Sony Entertainment")
    .applicationHomepage("http://www.dcuniverseonline.com/")
    .author("Zemoscripter")
    .url("https://launch.daybreakgames.com/installer/DCUO_setup.exe")
    .category("Games")
    .executable("Origin.exe")
    .wineVersion(LATEST_UPSTREAM_VERSION)
    .wineDistribution("upstream")
    .preInstall(function(wine, wizard) {
	wine.vcrun2012();
	wine.dotnet40();
	wine.d3dx9();
    })
.go();
